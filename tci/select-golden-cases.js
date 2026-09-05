const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'tci-results');
const INPUT = path.join(ROOT, 'tci-calibration-selection.json');
const OUT = path.join(ROOT, 'tci-golden-cases.json');
const MD = path.join(ROOT, 'tci-golden-cases-summary.md');
const TARGET = 30;

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const samples = data.samples || [];
if (samples.length < TARGET) throw new Error(`Không đủ candidate: ${samples.length}`);

const groups = [
  'G12_VERY_SIMPLE','G01_SIMPLE_STEPS','G03_FEW_PROFILES',
  'G02_MANY_STEPS','G04_MANY_PROFILES','G05_SHORT_TIME','G06_LONG_TIME',
  'G07_MULTIPLE_METHODS','G08_COMPLEX_CONDITIONS','G09_MANY_ACTORS',
  'G10_EXECUTION_CASES','G11_ANOMALIES','G13_VERY_COMPLEX'
];

const quota = new Map([
  ['G12_VERY_SIMPLE',3], ['G01_SIMPLE_STEPS',2], ['G03_FEW_PROFILES',2],
  ['G02_MANY_STEPS',4], ['G04_MANY_PROFILES',4], ['G05_SHORT_TIME',2],
  ['G06_LONG_TIME',2], ['G07_MULTIPLE_METHODS',2], ['G08_COMPLEX_CONDITIONS',3],
  ['G09_MANY_ACTORS',3], ['G10_EXECUTION_CASES',3], ['G11_ANOMALIES',3],
  ['G13_VERY_COMPLEX',4]
]);

function featureVector(s) {
  const f = s.features || {};
  return {
    steps: Number(f.steps || 0),
    profiles: Number(f.profileComponents || 0),
    methods: Number(f.methods || 0),
    cases: Number(f.executionCases || 0),
    condition: Number(f.conditionSignal || 0),
    actors: Number(f.actorSignal || 0),
    narrative: Number(f.narrativeLength || 0),
    anomaly: (f.dataWarnings || []).length,
    shortTime: Number.isFinite(f.processingMin) && f.processingMin > 0 ? f.processingMin : null,
    longTime: Number.isFinite(f.processingMax) ? f.processingMax : null
  };
}

function scoreForGroup(s, g) {
  const f = featureVector(s);
  if (g === 'G12_VERY_SIMPLE') return -(f.steps*4 + f.profiles + f.methods + f.condition + f.cases);
  if (g === 'G01_SIMPLE_STEPS') return -(f.steps);
  if (g === 'G03_FEW_PROFILES') return -(f.profiles);
  if (g === 'G02_MANY_STEPS') return f.steps*10 + f.condition + f.profiles;
  if (g === 'G04_MANY_PROFILES') return f.profiles*10 + f.cases;
  if (g === 'G05_SHORT_TIME') return -(f.shortTime ?? 1e9);
  if (g === 'G06_LONG_TIME') return f.longTime ?? -1;
  if (g === 'G07_MULTIPLE_METHODS') return f.methods*10 + (s.groups||[]).includes(g);
  if (g === 'G08_COMPLEX_CONDITIONS') return f.condition*10 + f.narrative/1000;
  if (g === 'G09_MANY_ACTORS') return f.actors*10 + f.condition;
  if (g === 'G10_EXECUTION_CASES') return f.cases*10 + f.profiles;
  if (g === 'G11_ANOMALIES') return f.anomaly*100 + (f.steps||0);
  if (g === 'G13_VERY_COMPLEX') return f.steps*5 + f.condition*2 + f.actors*2 + f.profiles*1.5 + f.cases*1.5 + f.narrative/1000;
  return 0;
}

const selected = new Map();
const chosenGroupCount = new Map(groups.map(g => [g,0]));

function addCandidate(s, reason) {
  if (!s || selected.has(s.id) || selected.size >= TARGET) return false;
  selected.set(s.id, { sample: s, reasons: [...(s.reasons || []), reason] });
  return true;
}

// First pass: fill required group quotas, while avoiding repeated choice of near-identical records.
for (const g of groups) {
  const need = quota.get(g) || 0;
  const candidates = samples
    .filter(s => (s.groups || []).includes(g))
    .sort((a,b) => scoreForGroup(b,g) - scoreForGroup(a,g));
  let added = 0;
  for (const s of candidates) {
    if (selected.size >= TARGET || added >= need) break;
    if (selected.has(s.id)) continue;
    // Prefer non-duplicate signatures when the strongest records are structurally identical.
    const f = featureVector(s);
    const signature = `${f.steps}|${f.profiles}|${f.methods}|${f.cases}|${f.condition}|${f.actors}|${f.anomaly}`;
    const similar = [...selected.values()].some(x => {
      const y = featureVector(x.sample);
      return `${y.steps}|${y.profiles}|${y.methods}|${y.cases}|${y.condition}|${y.actors}|${y.anomaly}` === signature;
    });
    if (similar && candidates.length > need * 2) continue;
    if (addCandidate(s, `Golden anchor: ${g}`)) { added++; chosenGroupCount.set(g, (chosenGroupCount.get(g)||0)+1); }
  }
}

// Second pass: maximize feature diversity among remaining candidates.
function distance(a,b) {
  const x = featureVector(a), y = featureVector(b);
  const scale = (v, m) => Math.min(1, Math.abs(v)/(m||1));
  return scale(x.steps-y.steps,20)
    + scale(x.profiles-y.profiles,50)
    + scale(x.methods-y.methods,3)
    + scale(x.cases-y.cases,20)
    + scale(x.condition-y.condition,50)
    + scale(x.actors-y.actors,10)
    + scale(x.narrative-y.narrative,10000)
    + scale(x.anomaly-y.anomaly,3);
}
while (selected.size < TARGET) {
  const pool = samples.filter(s => !selected.has(s.id));
  if (!pool.length) break;
  let best = null, bestScore = -Infinity;
  for (const s of pool) {
    const minDist = selected.size ? Math.min(...[...selected.values()].map(x => distance(s,x.sample))) : 1;
    const groupNovelty = groups.filter(g => (s.groups||[]).includes(g) && (chosenGroupCount.get(g)||0) === 0).length;
    const f = featureVector(s);
    const score = minDist*10 + groupNovelty*4 + Math.min(f.condition,50)/50 + Math.min(f.steps,20)/20 + Math.min(f.profiles,50)/50 + f.anomaly*2;
    if (score > bestScore) { bestScore = score; best = s; }
  }
  addCandidate(best, 'Golden bổ sung để tăng độ đa dạng');
}

const golden = [...selected.values()].map((x,i) => ({
  goldenNo: i+1,
  id: x.sample.id,
  code: x.sample.code,
  name: x.sample.name,
  category: x.sample.category,
  groups: x.sample.groups,
  reasons: [...new Set(x.reasons)],
  features: x.sample.features,
  sourceSampleNo: x.sample.sampleNo
}));

const coverage = {};
for (const g of groups) coverage[g] = golden.filter(x => (x.groups||[]).includes(g)).length;

const output = {
  metadata: {
    version: 'TCI_V1_GOLDEN_SELECTOR_1.0',
    source: 'tci-results/tci-calibration-selection.json',
    candidateCount: samples.length,
    goldenCount: golden.length,
    random: false,
    note: 'Golden Cases ứng viên để hiệu chuẩn TCI; chưa tính điểm TCI.'
  },
  coverage,
  golden
};

fs.writeFileSync(OUT, JSON.stringify(output, null, 2));
let md = '# TCI V1 – Golden Cases\n\n';
md += `- Candidate: **${samples.length}**\n- Golden Cases: **${golden.length}**\n- Random: **Không**\n- Chưa tính điểm TCI.\n\n## Coverage\n\n`;
for (const [g,c] of Object.entries(coverage)) md += `- ${c > 0 ? '✅' : '❌'} ${g}: ${c}\n`;
md += '\n## Golden Cases\n\n';
for (const s of golden) {
  const f = s.features;
  md += `${s.goldenNo}. **${s.code} — ${s.name}**\n   - Bước: ${f.steps}; Hồ sơ: ${f.profileComponents}; Phương thức: ${f.methods}; Cases: ${f.executionCases}; Thời gian: ${f.processingMin ?? 'UNKNOWN'}${f.processingMax != null && f.processingMax !== f.processingMin ? `–${f.processingMax}` : ''}\n   - Điều kiện: ${f.conditionSignal}; Tác nhân: ${f.actorSignal}; Anomaly: ${(f.dataWarnings||[]).length}\n   - Nhóm: ${(s.groups||[]).join(', ')}\n   - Lý do: ${[...new Set(s.reasons)].join('; ')}\n\n`;
}
console.log(`ĐÃ CHỌN ${golden.length} GOLDEN CASES.`);
