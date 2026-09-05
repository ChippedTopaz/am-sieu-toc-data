const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'details');
const OUT_DIR = path.join(process.cwd(), 'tci-results');
const TARGET = 50;

const arr = v => Array.isArray(v) ? v : [];
const obj = v => v && typeof v === 'object' && !Array.isArray(v);
const txt = v => v == null ? '' : String(v).trim();
const low = v => txt(v).toLowerCase();
const uniq = a => [...new Set(a.filter(Boolean))];
const num = v => { const n = Number(v); return Number.isFinite(n) ? n : null; };
const idOf = v => obj(v) ? (txt(v.id) || txt(v.code) || txt(v.name)) : txt(v);

function extract(id, x) {
  const steps = arr(x.executionSteps);
  const methods = arr(x.executionMethods);
  const cases = arr(x.executionCases);

  // Hồ sơ thực tế có thể nằm ở root hoặc nằm trong từng executionCase.
  const rootProfiles = arr(x.profileComponents);
  const caseProfiles = cases.flatMap(c => obj(c) ? arr(c.profileComponents) : []);
  const profilesByCase = cases.map(c => obj(c) ? arr(c.profileComponents) : []);
  const caseProfileCounts = profilesByCase.map(a => a.length).filter(n => n > 0);
  const profileComponents = caseProfileCounts.length ? Math.max(...caseProfileCounts) : rootProfiles.length;
  const profileIds = uniq([...rootProfiles, ...caseProfiles].map(idOf));

  const units = [
    ...arr(x.unitGroupsExecuting), ...arr(x.unitGroupsAuthority),
    ...arr(x.unitGroupsAuthorized), ...arr(x.unitGroupsCoordinating)
  ];
  const depts = [
    ...arr(x.departmentsExecuting), ...arr(x.departmentsAuthority),
    ...arr(x.departmentsAuthorized), ...arr(x.departmentsCoordinating)
  ];
  const agencies = [
    ...arr(x.executingAgencies), ...arr(x.authorizedAgencies),
    ...arr(x.delegatedAgencies), ...arr(x.coordinatingAgencies)
  ];

  const uniqueUnits = uniq(units.map(idOf));
  const uniqueDepts = uniq(depts.map(idOf));
  const uniqueAgencies = uniq(agencies.map(idOf));
  const actorSignal = uniqueUnits.length + uniqueDepts.length + uniqueAgencies.length;

  const narrative = `${txt(x.description)}\n${txt(x.requirementsAndConditions)}`;
  const branchWords = ['trường hợp','nếu','hoặc','trừ trường hợp','đối với','khi','trong trường hợp','tùy trường hợp'];
  const conditionWords = ['điều kiện','yêu cầu','tiêu chuẩn','phải','không được','được phép'];
  const branchHits = branchWords.filter(w => low(narrative).includes(w)).length;
  const conditionHits = conditionWords.filter(w => low(narrative).includes(w)).length;
  const orCount = (narrative.match(/\bhoặc\b/gi) || []).length;
  const ifCount = (narrative.match(/\bnếu\b/gi) || []).length;
  const caseCount = (narrative.match(/\btrường hợp\b/gi) || []).length;
  const conditionSignal = branchHits + conditionHits + Math.min(orCount, 10) + Math.min(ifCount * 2, 10) + Math.min(caseCount, 15);

  const methodNames = uniq(methods.map(m => obj(m) ? (txt(m.submissionMethod) || txt(m.type) || txt(m.method)) : '').filter(Boolean));

  const times = [];
  for (const m of methods) {
    if (obj(m)) {
      const q = num(m.processingTime);
      if (q !== null) times.push(`${q} ${txt(m.processingTimeUnit) || 'UNKNOWN'}`);
    }
  }
  for (const c of cases) {
    if (obj(c) && obj(c.processingDay)) {
      const q = num(c.processingDay.qty);
      if (q !== null) times.push(`${q} ${txt(c.processingDay.type) || 'UNKNOWN'}`);
    }
  }
  const distinctTimes = uniq(times);

  const warnings = [];
  for (const f of ['executionSteps','executionMethods','executionCases','profileComponents','requirementsAndConditions']) {
    if (!(f in x)) warnings.push(`MISSING_FIELD:${f}`);
    else if (x[f] === null) warnings.push(`NULL_FIELD:${f}`);
  }
  if (steps.length === 0) warnings.push('EMPTY_EXECUTION_STEPS');
  if (methods.length === 0) warnings.push('EMPTY_EXECUTION_METHODS');
  if (rootProfiles.length === 0 && caseProfileCounts.length === 0) warnings.push('EMPTY_PROFILE_COMPONENTS');
  if (distinctTimes.length > 1) warnings.push('PROCESSING_TIME_CONFLICT');

  const processingNums = [];
  for (const m of methods) if (obj(m)) { const q = num(m.processingTime); if (q !== null && q >= 0) processingNums.push(q); }
  for (const c of cases) if (obj(c) && obj(c.processingDay)) { const q = num(c.processingDay.qty); if (q !== null && q >= 0) processingNums.push(q); }

  return {
    id,
    code: txt(x.code) || txt(x.codeNotation) || id,
    name: txt(x.name) || '(Không có tên)',
    category: obj(x.category) ? txt(x.category.name) : '',
    features: {
      steps: steps.length,
      profileComponents: profileComponents,
      profileComponentSource: caseProfileCounts.length ? 'executionCases' : (rootProfiles.length ? 'root' : 'missing'),
      profileComponentIds: profileIds,
      profileComponentsByCase: caseProfileCounts,
      methods: methodNames.length,
      methodNames,
      executionCases: cases.length,
      processingMin: processingNums.length ? Math.min(...processingNums) : null,
      processingMax: processingNums.length ? Math.max(...processingNums) : null,
      processingValues: distinctTimes,
      timeConflict: distinctTimes.length > 1,
      conditionSignal,
      actorSignal,
      unitGroups: uniqueUnits.length,
      departments: uniqueDepts.length,
      agencies: uniqueAgencies.length,
      narrativeLength: narrative.length,
      hasExecutionCases: cases.length > 0,
      dataWarnings: warnings
    }
  };
}

const sortDesc = (a, fn) => [...a].sort((x, y) => (fn(y) ?? -Infinity) - (fn(x) ?? -Infinity));
const sortAsc = (a, fn) => [...a].sort((x, y) => (fn(x) ?? Infinity) - (fn(y) ?? Infinity));
const add = (pool, rec, group, reason) => {
  if (!rec) return;
  let p = pool.get(rec.id);
  if (!p) { p = { record: rec, groups: [], reasons: [] }; pool.set(rec.id, p); }
  if (!p.groups.includes(group)) p.groups.push(group);
  if (reason && !p.reasons.includes(reason)) p.reasons.push(reason);
};

if (!fs.existsSync(ROOT)) throw new Error(`Không tìm thấy thư mục: ${ROOT}`);
const files = fs.readdirSync(ROOT).filter(f => f.toLowerCase().endsWith('.json')).sort();
console.log(`Đọc ${files.length} JSON trong details/ ...`);
const records = [];
for (const file of files) {
  try {
    const id = path.basename(file, '.json');
    const x = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    if (obj(x)) records.push(extract(id, x));
  } catch (e) { console.warn(`Bỏ qua ${file}: ${e.message}`); }
}
console.log(`Phân tích được ${records.length} TTHC.`);

const groups = {};
groups.G01_SIMPLE_STEPS = records.filter(r => r.features.steps > 0).sort((a,b) => a.features.steps - b.features.steps).slice(0, 12);
groups.G02_MANY_STEPS = records.filter(r => r.features.steps > 1).sort((a,b) => b.features.steps - a.features.steps).slice(0, 12);
groups.G03_FEW_PROFILES = records.filter(r => r.features.profileComponentSource !== 'missing').sort((a,b) => a.features.profileComponents - b.features.profileComponents).slice(0, 12);
groups.G04_MANY_PROFILES = records.filter(r => r.features.profileComponents > 0).sort((a,b) => b.features.profileComponents - a.features.profileComponents).slice(0, 12);
groups.G05_SHORT_TIME = records.filter(r => r.features.processingMin !== null && r.features.processingMin > 0).sort((a,b) => a.features.processingMin - b.features.processingMin).slice(0, 12);
groups.G06_LONG_TIME = records.filter(r => r.features.processingMax !== null).sort((a,b) => b.features.processingMax - a.features.processingMax).slice(0, 12);
groups.G07_MULTIPLE_METHODS = records.filter(r => r.features.methods > 1).sort((a,b) => b.features.methods - a.features.methods).slice(0, 12);
groups.G08_COMPLEX_CONDITIONS = records.filter(r => r.features.conditionSignal > 0).sort((a,b) => b.features.conditionSignal - a.features.conditionSignal).slice(0, 12);
groups.G09_MANY_ACTORS = records.filter(r => r.features.actorSignal > 1).sort((a,b) => b.features.actorSignal - a.features.actorSignal).slice(0, 12);
groups.G10_EXECUTION_CASES = records.filter(r => r.features.executionCases > 1).sort((a,b) => b.features.executionCases - a.features.executionCases).slice(0, 12);
groups.G11_ANOMALIES = records.filter(r => r.features.dataWarnings.length > 0).sort((a,b) => b.features.dataWarnings.length - a.features.dataWarnings.length).slice(0, 15);

const simplicityScore = r =>
  r.features.steps * 4 +
  (r.features.profileComponents || 0) * 2 +
  r.features.methods +
  r.features.conditionSignal +
  r.features.executionCases;
const complexityScore = r =>
  r.features.steps * 5 +
  (r.features.profileComponents || 0) * 2 +
  r.features.conditionSignal * 2 +
  r.features.actorSignal * 2 +
  r.features.methods * 2 +
  r.features.executionCases * 2 +
  r.features.narrativeLength / 1000;

groups.G12_VERY_SIMPLE = [...records].sort((a,b) => simplicityScore(a) - simplicityScore(b)).slice(0, 12);
groups.G13_VERY_COMPLEX = [...records].sort((a,b) => complexityScore(b) - complexityScore(a)).slice(0, 12);

const pool = new Map();
for (const [g, list] of Object.entries(groups)) for (const r of list) add(pool, r, g, `Chọn từ ${g}`);
const selected = new Map();
function choose(id, reason) {
  if (selected.has(id)) return false;
  const p = pool.get(id); if (!p) return false;
  selected.set(id, { ...p, reasons: [...p.reasons, reason] });
  return true;
}

// Ưu tiên 2 cực đơn giản/phức tạp.
for (const r of groups.G12_VERY_SIMPLE) if (selected.size < TARGET) choose(r.id, 'Bắt buộc có mẫu rất đơn giản');
for (const r of groups.G13_VERY_COMPLEX) if (selected.size < TARGET) choose(r.id, 'Bắt buộc có mẫu rất phức tạp');

// Coverage: ưu tiên bổ sung tối đa 4 mẫu mới/nhóm, nhưng chỉ từ nhóm đã có dữ liệu thực.
for (const [g, list] of Object.entries(groups)) {
  let added = 0;
  for (const r of list) {
    if (selected.size >= TARGET || added >= 4) break;
    if (choose(r.id, `Bổ sung coverage ${g}`)) added++;
  }
}

// Anomaly cases cho audit dữ liệu.
for (const r of groups.G11_ANOMALIES) if (selected.size < TARGET) choose(r.id, 'Bổ sung bất thường dữ liệu để audit');

const remaining = records.filter(r => !selected.has(r.id)).sort((a,b) => a.code.localeCompare(b.code, 'vi'));
if (selected.size < TARGET && remaining.length) {
  const need = TARGET - selected.size;
  const stride = Math.max(1, Math.floor(remaining.length / need));
  for (let i = 0; i < remaining.length && selected.size < TARGET; i += stride) {
    const r = remaining[i];
    add(pool, r, 'G14_DETERMINISTIC_SPREAD', 'Bổ sung để đủ 50 và phân tán mẫu');
    choose(r.id, 'Bổ sung deterministic spread');
  }
}
for (const r of remaining) if (selected.size < TARGET) {
  add(pool, r, 'G15_FILL', 'Bổ sung cuối để đủ 50');
  choose(r.id, 'Bổ sung cuối để đủ 50');
}

const samples = [...selected.values()].sort((a,b) => a.record.code.localeCompare(b.record.code, 'vi')).map((p, i) => ({ sampleNo: i + 1, ...p }));
const coverage = {};
for (const g of Object.keys(groups)) {
  const count = samples.filter(s => s.groups.includes(g)).length;
  coverage[g] = { selected: count, covered: count > 0 };
}

const out = {
  metadata: {
    version: 'TCI_V1_CALIBRATION_SELECTOR_GITHUB_1.2',
    generatedAt: new Date().toISOString(),
    source: 'branch data / details/*.json',
    totalJsonFiles: files.length,
    totalParsed: records.length,
    target: TARGET,
    selected: samples.length,
    random: false,
    note: 'Chỉ chọn mẫu calibration, chưa tính TCI. profileComponents được đọc cả ở root và executionCases.'
  },
  coverage,
  samples: samples.map(s => ({ sampleNo: s.sampleNo, id: s.record.id, code: s.record.code, name: s.record.name, category: s.record.category, groups: s.groups, reasons: s.reasons, features: s.record.features }))
};

const manifest = samples.map(s => ({ sampleNo: s.sampleNo, id: s.record.id, file: `details/${s.record.id}.json`, code: s.record.code, name: s.record.name }));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'tci-calibration-selection.json'), JSON.stringify(out, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'tci-calibration-manifest.json'), JSON.stringify(manifest, null, 2));

let md = '# TCI V1 – Calibration Sample Report\n\n';
md += `- Tổng JSON trong details: **${files.length}**\n- Phân tích thành công: **${records.length}**\n- Số mẫu chọn: **${samples.length}**\n- Random: **Không**\n- Chưa tính điểm TCI.\n- Hồ sơ được đọc từ **root.profileComponents** và **executionCases[].profileComponents**.\n\n## Coverage\n\n`;
for (const [g,v] of Object.entries(coverage)) md += `- ${v.covered ? '✅' : '❌'} ${g}: ${v.selected}\n`;
md += '\n## 50 mẫu\n\n';
for (const s of samples) {
  const f = s.record.features;
  md += `${s.sampleNo}. **${s.record.code} — ${s.record.name}**\n   - Bước: ${f.steps}; Hồ sơ: ${f.profileComponents} (${f.profileComponentSource}); Phương thức: ${f.methods}; Cases: ${f.executionCases}; Thời gian: ${f.processingMin ?? 'UNKNOWN'}${f.processingMax !== null && f.processingMax !== f.processingMin ? `–${f.processingMax}` : ''}\n   - Điều kiện signal: ${f.conditionSignal}; Actor signal: ${f.actorSignal}; Cảnh báo: ${f.dataWarnings.length}${f.dataWarnings.length ? ` (${f.dataWarnings.join(', ')})` : ''}\n   - Nhóm: ${s.groups.join(', ')}\n\n`;
}
fs.writeFileSync(path.join(OUT_DIR, 'tci-calibration-summary.md'), md);
console.log(`ĐÃ CHỌN ${samples.length} MẪU.`);
