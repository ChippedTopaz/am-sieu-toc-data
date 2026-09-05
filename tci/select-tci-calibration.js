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
const normKey = v => txt(v).toLowerCase().replace(/[.、,;:]+$/g, '').trim();
const num = v => { const n = Number(v); return Number.isFinite(n) ? n : null; };

function extract(id, x) {
  const steps = arr(x.executionSteps);
  const methods = arr(x.executionMethods);
  const cases = arr(x.executionCases);
  const rootProfiles = arr(x.profileComponents);
  const profilesByCase = cases.map(c => arr(c && c.profileComponents));
  const caseProfiles = profilesByCase.flat();
  const effectiveProfiles = [...rootProfiles, ...caseProfiles];

  // Đếm thành phần hồ sơ theo mã/ID đã chuẩn hóa, tránh đếm trùng giữa các executionCases.
  const profileKeys = uniq(effectiveProfiles.map(p => {
    if (!obj(p)) return '';
    return normKey(p.code) || normKey(p.profileComponentId) || normKey(p.name);
  }).filter(Boolean));

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
  const processingNums = [];
  const times = [];
  const methodTimeMap = new Map();

  for (const m of methods) {
    if (obj(m)) {
      const q = num(m.processingTime);
      const unit = txt(m.processingTimeUnit) || 'UNKNOWN';
      const method = txt(m.submissionMethod) || txt(m.type) || txt(m.method) || 'UNKNOWN';
      if (q !== null) {
        processingNums.push(q);
        times.push(`${q} ${unit}`);
        const key = normKey(method);
        if (!methodTimeMap.has(key)) methodTimeMap.set(key, new Set());
        methodTimeMap.get(key).add(`${q} ${unit}`);
      }
    }
  }

  for (const c of cases) {
    if (obj(c) && obj(c.processingDay)) {
      const q = num(c.processingDay.qty);
      const unit = txt(c.processingDay.type) || 'UNKNOWN';
      if (q !== null) {
        processingNums.push(q);
        times.push(`${q} ${unit}`);
      }
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
  if (effectiveProfiles.length === 0) warnings.push('EMPTY_PROFILE_COMPONENTS');

  // Khác thời gian giữa executionMethods và executionCases có thể là hợp lệ.
  // Chỉ gắn anomaly khi cùng một phương thức có nhiều thời gian khác nhau.
  const sameMethodTimeConflict = [...methodTimeMap.values()].some(s => s.size > 1);
  if (sameMethodTimeConflict) warnings.push('PROCESSING_TIME_CONFLICT_SAME_METHOD');
  else if (distinctTimes.length > 1) warnings.push('PROCESSING_TIME_MULTI_SOURCE');

  const actorSignal = uniq([
    ...units.map(v => JSON.stringify(v)),
    ...depts.map(v => JSON.stringify(v)),
    ...agencies.map(v => JSON.stringify(v))
  ]).length;

  return {
    id,
    code: txt(x.code) || txt(x.codeNotation) || id,
    name: txt(x.name) || '(Không có tên)',
    category: obj(x.category) ? txt(x.category.name) : '',
    features: {
      steps: steps.length,
      profileComponents: profileKeys.length,
      profileComponentsRaw: effectiveProfiles.length,
      profileComponentSource: rootProfiles.length && caseProfiles.length ? 'root+executionCases' : (caseProfiles.length ? 'executionCases' : (rootProfiles.length ? 'root' : 'none')),
      profileComponentIds: profileKeys.slice(0, 100),
      profileComponentsByCase: profilesByCase.map(a => uniq(a.map(p => obj(p) ? (normKey(p.code) || normKey(p.profileComponentId) || normKey(p.name)) : '').filter(Boolean)).length),
      methods: methodNames.length,
      methodNames,
      executionCases: cases.length,
      processingMin: processingNums.length ? Math.min(...processingNums) : null,
      processingMax: processingNums.length ? Math.max(...processingNums) : null,
      processingValues: distinctTimes,
      timeConflict: sameMethodTimeConflict,
      timeMultiSource: !sameMethodTimeConflict && distinctTimes.length > 1,
      conditionSignal,
      actorSignal,
      unitGroups: uniq(units.map(v => JSON.stringify(v))).length,
      departments: uniq(depts.map(v => JSON.stringify(v))).length,
      agencies: uniq(agencies.map(v => JSON.stringify(v))).length,
      narrativeLength: narrative.length,
      hasExecutionCases: cases.length > 0,
      dataWarnings: warnings
    }
  };
}

const sortDesc = (a, fn) => [...a].sort((x, y) => (fn(y) || 0) - (fn(x) || 0));
const sortAsc = (a, fn) => [...a].sort((x, y) => (fn(x) || 0) - (fn(y) || 0));
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
groups.G01_SIMPLE_STEPS = sortAsc(records, r => r.features.steps).slice(0, 12);
groups.G02_MANY_STEPS = sortDesc(records, r => r.features.steps).slice(0, 12);
groups.G03_FEW_PROFILES = [...records].filter(r => r.features.profileComponents > 0).sort((a,b) => a.features.profileComponents - b.features.profileComponents).slice(0, 12);
groups.G04_MANY_PROFILES = [...records].filter(r => r.features.profileComponents > 0).sort((a,b) => b.features.profileComponents - a.features.profileComponents).slice(0, 12);
groups.G05_SHORT_TIME = records.filter(r => r.features.processingMin !== null && r.features.processingMin > 0).sort((a,b) => a.features.processingMin - b.features.processingMin).slice(0, 12);
groups.G06_LONG_TIME = records.filter(r => r.features.processingMax !== null).sort((a,b) => b.features.processingMax - a.features.processingMax).slice(0, 12);
groups.G07_MULTIPLE_METHODS = records.filter(r => r.features.methods > 1).sort((a,b) => b.features.methods - a.features.methods).slice(0, 12);
groups.G08_COMPLEX_CONDITIONS = sortDesc(records, r => r.features.conditionSignal).slice(0, 12);
groups.G09_MANY_ACTORS = records.filter(r => r.features.actorSignal > 0).sort((a,b) => b.features.actorSignal - a.features.actorSignal).slice(0, 12);
groups.G10_EXECUTION_CASES = records.filter(r => r.features.executionCases > 1).sort((a,b) => b.features.executionCases - a.features.executionCases).slice(0, 12);
groups.G11_ANOMALIES = records.filter(r => r.features.dataWarnings.length > 0).sort((a,b) => b.features.dataWarnings.length - a.features.dataWarnings.length).slice(0, 15);
groups.G12_VERY_SIMPLE = [...records].sort((a,b) => (a.features.steps*4+a.features.profileComponents+a.features.methods+a.features.conditionSignal) - (b.features.steps*4+b.features.profileComponents+b.features.methods+b.features.conditionSignal)).slice(0, 12);
groups.G13_VERY_COMPLEX = [...records].sort((a,b) => (b.features.steps*5+b.features.conditionSignal*2+b.features.actorSignal*2+b.features.profileComponents*1.5+b.features.executionCases*1.5+b.features.narrativeLength/1000) - (a.features.steps*5+a.features.conditionSignal*2+a.features.actorSignal*2+a.features.profileComponents*1.5+a.features.executionCases*1.5+a.features.narrativeLength/1000)).slice(0, 12);

const pool = new Map();
for (const [g, list] of Object.entries(groups)) for (const r of list) add(pool, r, g, `Chọn từ ${g}`);
const selected = new Map();
function choose(id, reason) {
  if (selected.has(id)) return false;
  const p = pool.get(id); if (!p) return false;
  selected.set(id, { ...p, reasons: [...p.reasons, reason] });
  return true;
}

// Quota bắt buộc cho các nhóm quan trọng trước.
const priority = [
  ['G11_ANOMALIES', 4, 'Bắt buộc coverage anomaly dữ liệu'],
  ['G09_MANY_ACTORS', 4, 'Bắt buộc coverage nhiều tác nhân'],
  ['G10_EXECUTION_CASES', 4, 'Bắt buộc coverage executionCases'],
  ['G04_MANY_PROFILES', 4, 'Bắt buộc coverage nhiều hồ sơ'],
  ['G02_MANY_STEPS', 4, 'Bắt buộc coverage nhiều bước'],
  ['G08_COMPLEX_CONDITIONS', 4, 'Bắt buộc coverage điều kiện/nhánh'],
  ['G07_MULTIPLE_METHODS', 4, 'Bắt buộc coverage nhiều phương thức'],
  ['G06_LONG_TIME', 3, 'Bắt buộc coverage thời gian dài'],
  ['G05_SHORT_TIME', 3, 'Bắt buộc coverage thời gian ngắn'],
  ['G03_FEW_PROFILES', 3, 'Bắt buộc coverage ít hồ sơ'],
  ['G01_SIMPLE_STEPS', 3, 'Bắt buộc coverage ít bước'],
  ['G13_VERY_COMPLEX', 4, 'Bắt buộc có mẫu rất phức tạp'],
  ['G12_VERY_SIMPLE', 4, 'Bắt buộc có mẫu rất đơn giản']
];
for (const [g, quota, reason] of priority) {
  for (const r of groups[g]) {
    if (selected.size >= TARGET) break;
    if ([...selected.keys()].length >= TARGET) break;
    if (selected.has(r.id)) continue;
    const already = [...selected.values()].filter(s => s.groups.includes(g)).length;
    if (already >= quota) break;
    choose(r.id, reason);
  }
}

// Bổ sung anomaly chưa đủ quota.
for (const r of groups.G11_ANOMALIES) if (selected.size < TARGET) choose(r.id, 'Bổ sung anomaly để audit');

// Điền đủ 50 bằng phân tán deterministic theo mã.
const remaining = records.filter(r => !selected.has(r.id)).sort((a,b) => a.code.localeCompare(b.code, 'vi'));
if (selected.size < TARGET && remaining.length) {
  const need = TARGET - selected.size;
  const stride = Math.max(1, Math.floor(remaining.length / need));
  for (let i = 0; i < remaining.length && selected.size < TARGET; i += stride) {
    const r = remaining[i];
    if (!selected.has(r.id)) {
      add(pool, r, 'G14_DETERMINISTIC_SPREAD', 'Bổ sung để đủ 50 và phân tán mẫu');
      choose(r.id, 'Bổ sung deterministic spread');
    }
  }
}
for (const r of remaining) if (selected.size < TARGET && !selected.has(r.id)) {
  add(pool, r, 'G15_FILL', 'Bổ sung cuối để đủ 50');
  choose(r.id, 'Bổ sung cuối để đủ 50');
}

const samples = [...selected.values()].sort((a,b) => a.record.code.localeCompare(b.record.code, 'vi')).map((p, i) => ({ sampleNo: i + 1, ...p }));
const coverage = {};
for (const g of Object.keys(groups)) { const count = samples.filter(s => s.groups.includes(g)).length; coverage[g] = { selected: count, covered: count > 0 }; }

const out = {
  metadata: { version: 'TCI_V1_CALIBRATION_SELECTOR_GITHUB_1.4', generatedAt: new Date().toISOString(), source: 'branch data / details/*.json', totalJsonFiles: files.length, totalParsed: records.length, target: TARGET, selected: samples.length, random: false, note: 'Chỉ chọn mẫu calibration, không tính TCI. Hồ sơ được khử trùng lặp theo mã/ID; thời gian khác nguồn được phân biệt với xung đột cùng phương thức.' },
  coverage,
  samples: samples.map(s => ({ sampleNo: s.sampleNo, id: s.record.id, code: s.record.code, name: s.record.name, category: s.record.category, groups: s.groups, reasons: s.reasons, features: s.record.features }))
};

const manifest = samples.map(s => ({ sampleNo: s.sampleNo, id: s.record.id, file: `details/${s.record.id}.json`, code: s.record.code, name: s.record.name }));
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'tci-calibration-selection.json'), JSON.stringify(out, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'tci-calibration-manifest.json'), JSON.stringify(manifest, null, 2));

let md = '# TCI V1 – Calibration Sample Report\n\n';
md += `- Tổng JSON trong details: **${files.length}**\n- Phân tích thành công: **${records.length}**\n- Số mẫu chọn: **${samples.length}**\n- Random: **Không**\n- Chưa tính điểm TCI.\n\n## Coverage\n\n`;
for (const [g,v] of Object.entries(coverage)) md += `- ${v.covered ? '✅' : '❌'} ${g}: ${v.selected}\n`;
md += '\n## 50 mẫu\n\n';
for (const s of samples) {
  const f = s.record.features;
  md += `${s.sampleNo}. **${s.record.code} — ${s.record.name}**\n   - Bước: ${f.steps}; Hồ sơ: ${f.profileComponents}; Phương thức: ${f.methods}; Cases: ${f.executionCases}; Thời gian: ${f.processingMin ?? 'UNKNOWN'}${f.processingMax !== null && f.processingMax !== f.processingMin ? `–${f.processingMax}` : ''}\n   - Điều kiện signal: ${f.conditionSignal}; Actor signal: ${f.actorSignal}; Cảnh báo: ${f.dataWarnings.length}${f.dataWarnings.length ? ` (${f.dataWarnings.join(', ')})` : ''}\n   - Nhóm: ${s.groups.join(', ')}\n\n`;
}
fs.writeFileSync(path.join(OUT_DIR, 'tci-calibration-summary.md'), md);
console.log(`ĐÃ CHỌN ${samples.length} MẪU.`);
