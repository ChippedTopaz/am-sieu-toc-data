const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'details');
const OUT_DIR = path.join(process.cwd(), 'tci-results-v2');
const MAPPING_PATHS = [
  path.join(process.cwd(), 'tci', 'input', 'dvc-mapping.csv'),
  path.join(process.cwd(), 'tci-results-v2', 'dvc-mapping.csv')
];
const TARGET = 50;

const arr = v => Array.isArray(v) ? v : [];
const obj = v => v && typeof v === 'object' && !Array.isArray(v);
const txt = v => v == null ? '' : String(v).trim();
const low = v => txt(v).toLowerCase();
const uniq = a => [...new Set(a.filter(Boolean))];
const num = v => { const n = Number(v); return Number.isFinite(n) ? n : null; };

function flattenProfiles(x) {
  const fromCases = arr(x.executionCases).flatMap(c => obj(c) ? arr(c.profileComponents) : []);
  return [...fromCases, ...arr(x.profileComponents)];
}

function extractAuthorization(text) {
  const t = low(text);
  const positive = [
    'thông qua người đại diện', 'thông qua đại diện', 'người đại diện',
    'trường hợp ủy quyền', 'trường hợp uỷ quyền', 'văn bản ủy quyền', 'văn bản uỷ quyền'
  ];
  const negative = [
    'không được ủy quyền', 'không được uỷ quyền', 'phải trực tiếp', 'chỉ người có quyền'
  ];
  if (negative.some(k => t.includes(k))) return 'NOT_ALLOWED';
  if (positive.some(k => t.includes(k))) return 'ALLOWED_CONDITIONAL';
  return 'UNKNOWN';
}

function parseExplicitSteps(text) {
  const matches = txt(text).match(/(?:^|\n)\s*(?:Bước|bước)\s*\d+\s*:/g);
  return matches ? matches.length : 0;
}

function count(re, text) { return (txt(text).match(re) || []).length; }

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) {
      out.push(cur); cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) {
      row.push(field); field = '';
    } else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(v => txt(v) !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(v => txt(v) !== '')) rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map(h => txt(h).replace(/^\uFEFF/, ''));
  return rows.slice(1).map(values => Object.fromEntries(headers.map((h, i) => [h, txt(values[i])])));
}

function normalizeMappingLevel(v) {
  const s = low(v).replace(/\s+/g, ' ');
  if (!s) return 'UNKNOWN';
  if (s === 'toàn trình' || s.includes('dịch vụ công trực tuyến toàn trình')) return 'FULL';
  if (s === 'một phần' || s.includes('dịch vụ công trực tuyến một phần')) return 'PARTIAL';
  if (s === 'chưa cung cấp' || s.includes('chưa cung cấp dvc')) return 'NONE';
  if (s === 'không cung cấp' || s.includes('không cung cấp dvc')) return 'NONE';
  return 'INVALID';
}

function loadDvcMapping() {
  const file = MAPPING_PATHS.find(p => fs.existsSync(p));
  if (!file) return { available: false, path: null, byMatthc: new Map(), rowCount: 0 };
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const byMatthc = new Map();
  for (const r of rows) {
    const maTthc = txt(r.MaTTHC);
    if (!maTthc) continue;
    const entry = {
      maDvc: txt(r.MaDVC),
      tenDvc: txt(r.TenDVC),
      mucDoRaw: txt(r.MucDo),
      level: normalizeMappingLevel(r.MucDo),
      maCqth: txt(r.MaCQTH),
      tenCqth: txt(r.TenCQTH)
    };
    if (!byMatthc.has(maTthc)) byMatthc.set(maTthc, []);
    byMatthc.get(maTthc).push(entry);
  }
  return { available: true, path: file, byMatthc, rowCount: rows.length };
}

function enrichDvc(maTthc, hasOnlineSubmission, mapping) {
  if (!hasOnlineSubmission) {
    return {
      implementLevel: 'NONE', implementLevelSource: 'JSON_SUBMISSION_METHOD',
      dvcMappingStatus: 'NOT_REQUIRED_NO_ONLINE', dvcCodes: [], dvcLevels: []
    };
  }
  if (!mapping.available) {
    return {
      implementLevel: 'UNKNOWN', implementLevelSource: 'DVC_MAPPING_MISSING',
      dvcMappingStatus: 'MAPPING_NOT_LOADED', dvcCodes: [], dvcLevels: []
    };
  }
  const rows = mapping.byMatthc.get(maTthc) || [];
  if (!rows.length) {
    return {
      implementLevel: 'UNKNOWN', implementLevelSource: 'DVC_MAPPING',
      dvcMappingStatus: 'NOT_FOUND', dvcCodes: [], dvcLevels: []
    };
  }
  const validLevels = uniq(rows.map(r => r.level).filter(v => v === 'FULL' || v === 'PARTIAL' || v === 'NONE'));
  const invalidRows = rows.filter(r => r.level === 'INVALID').length;
  const dvcCodes = uniq(rows.map(r => r.maDvc));
  if (validLevels.length === 1 && invalidRows === 0) {
    return {
      implementLevel: validLevels[0], implementLevelSource: 'DVC_MAPPING',
      dvcMappingStatus: 'MATCHED', dvcCodes, dvcLevels: validLevels
    };
  }
  if (validLevels.length > 1) {
    return {
      implementLevel: 'UNKNOWN', implementLevelSource: 'DVC_MAPPING',
      dvcMappingStatus: 'CONFLICT', dvcCodes, dvcLevels: validLevels
    };
  }
  return {
    implementLevel: 'UNKNOWN', implementLevelSource: 'DVC_MAPPING',
    dvcMappingStatus: invalidRows ? 'INVALID_MUCDO' : 'UNKNOWN', dvcCodes, dvcLevels: validLevels
  };
}

function extract(id, x, mapping) {
  const steps = arr(x.executionSteps);
  const methods = arr(x.executionMethods);
  const cases = arr(x.executionCases);
  const profiles = flattenProfiles(x);
  const stepText = steps.map(s => obj(s) ? `${txt(s.name)}\n${txt(s.description)}` : '').join('\n');
  const conditionsText = `${txt(x.requirementsAndConditions)}\n${txt(x.description)}`;
  const narrative = `${stepText}\n${conditionsText}`;

  const departments = [
    ...arr(x.departmentsExecuting), ...arr(x.departmentsAuthority),
    ...arr(x.departmentsAuthorized), ...arr(x.departmentsCoordinating)
  ].filter(obj);
  const units = [
    ...arr(x.unitGroupsExecuting), ...arr(x.unitGroupsAuthority),
    ...arr(x.unitGroupsAuthorized), ...arr(x.unitGroupsCoordinating)
  ].filter(obj);
  const actorKeys = uniq([
    ...departments.map(a => txt(a.id) || `NAME:${low(a.name)}`),
    ...units.map(a => txt(a.id) || `NAME:${low(a.name)}`)
  ]);

  const processExplicitSteps = steps.reduce((s, st) => s + parseExplicitSteps(obj(st) ? st.description : ''), 0);
  const effectiveStepCount = Math.max(steps.length, processExplicitSteps);
  const methodsNames = uniq(methods.map(m => obj(m) ? txt(m.submissionMethod || m.type || m.method).toUpperCase() : ''));
  const returnMethods = uniq(methods.flatMap(m => obj(m) ? [m.returningMethod, m.returnMethod] : []).filter(Boolean));

  const processing = [];
  const processingSources = [];
  for (const m of methods) {
    if (!obj(m)) continue;
    const q = num(m.processingTime);
    if (q !== null) {
      processing.push({ value: q, unit: txt(m.processingTimeUnit) || 'UNKNOWN' });
      processingSources.push(`${q} ${txt(m.processingTimeUnit) || 'UNKNOWN'}`);
    }
  }
  for (const c of cases) {
    if (!obj(c) || !obj(c.processingDay)) continue;
    const q = num(c.processingDay.qty);
    if (q !== null) {
      processing.push({ value: q, unit: txt(c.processingDay.type) || 'UNKNOWN' });
      processingSources.push(`${q} ${txt(c.processingDay.type) || 'UNKNOWN'}`);
    }
  }

  const requiredProfiles = profiles.filter(p => obj(p) && p.required === true && p.isProcessingResult !== true).length;
  const conditionalProfiles = profiles.filter(p => obj(p) && p.isProcessingResult !== true && /(?:nếu|trong trường hợp|khi có|nếu có|trường hợp)/i.test(txt(p.name))).length;
  const processingResults = profiles.filter(p => obj(p) && p.isProcessingResult === true).length;
  const originals = profiles.filter(p => obj(p) && p.isProcessingResult !== true).reduce((s,p) => s + (num(p.originalQty) || 0), 0);
  const copies = profiles.filter(p => obj(p) && p.isProcessingResult !== true).reduce((s,p) => s + (num(p.copyQty) || 0), 0);
  const electronicForms = profiles.filter(p => obj(p) && p.hasElectronicForm === true).length;
  const attachmentTemplates = profiles.filter(p => obj(p) && arr(p.attachments).length > 0).length;

  const branchCount = count(/\b(?:nếu|trường hợp|trong trường hợp|đối với|khi|hoặc|trừ trường hợp)\b/gi, narrative);
  const decisionCount = count(/\b(?:quyết định|phê duyệt|chấp thuận|không chấp thuận|cấp|không cấp|giải quyết)\b/gi, stepText);
  const verificationCount = count(/\b(?:xác minh|kiểm tra|đối chiếu|thẩm tra|thẩm định)\b/gi, stepText);
  const consultationCount = count(/\b(?:phối hợp|xin ý kiến|lấy ý kiến|ý kiến của|cơ quan liên quan)\b/gi, stepText);
  const approvalCount = count(/\b(?:trình|phê duyệt|ký duyệt|quyết định)\b/gi, stepText);
  const dialogueCount = count(/\b(?:đối thoại|làm việc với|gặp gỡ)\b/gi, stepText);
  const actionCount = count(/\b(?:tiếp nhận|kiểm tra|thẩm định|xác minh|lập|gửi|chuyển|cấp|trả|thu|đối thoại)\b/gi, stepText);
  const handoffCount = count(/\b(?:chuyển(?: sang)?|gửi(?: cho)?|trình(?: lên)?|xin ý kiến|lấy ý kiến|phối hợp với)\b/gi, stepText);

  const hasOnlineSubmission = methodsNames.includes('ONLINE');
  const dvc = enrichDvc(txt(x.code) || txt(x.codeNotation) || id, hasOnlineSubmission, mapping);
  const authorization = extractAuthorization(conditionsText);
  const isFullProcess = typeof x.isFullProcess === 'boolean' ? x.isFullProcess : (x.isFullProcess == null ? null : 'INVALID');
  const isNonTerritorial = typeof x.isNonTerritorial === 'boolean' ? x.isNonTerritorial : (x.isNonTerritorial == null ? null : 'INVALID');
  const isOfflineOnly = typeof x.isOfflineOnly === 'boolean' ? x.isOfflineOnly : (x.isOfflineOnly == null ? null : 'INVALID');
  const returningOnline = methods.some(m => obj(m) && /ONLINE/i.test(txt(m.returningMethod || m.returnMethod || '')));

  const warnings = [];
  for (const f of ['executionSteps','executionMethods','executionCases','requirementsAndConditions','isFullProcess','isNonTerritorial']) {
    if (!(f in x)) warnings.push(`MISSING_FIELD:${f}`);
    else if (x[f] === null) warnings.push(`NULL_FIELD:${f}`);
  }
  if (hasOnlineSubmission && dvc.dvcMappingStatus !== 'MATCHED') warnings.push(`C5_DVC_MAPPING:${dvc.dvcMappingStatus}`);
  if (dvc.dvcMappingStatus === 'CONFLICT') warnings.push('C5_DVC_MULTIPLE_LEVELS_CONFLICT');
  if (!profiles.length) warnings.push('EMPTY_PROFILE_COMPONENTS');
  if (!steps.length) warnings.push('EMPTY_EXECUTION_STEPS');
  if (!methods.length) warnings.push('EMPTY_EXECUTION_METHODS');
  if (new Set(processingSources).size > 1) warnings.push('MULTIPLE_PROCESSING_TIME_VALUES');
  if (isOfflineOnly === false && methodsNames.length === 1 && methodsNames[0] === 'DIRECT') warnings.push('DIRECT_ONLY_BUT_OFFLINE_FLAG_FALSE');

  const conditionCountSignal = Math.min(50, branchCount + Math.min(30, count(/\b(?:điều kiện|yêu cầu|tiêu chuẩn|phải|không được|được phép)\b/gi, conditionsText)));
  const complexitySignal = effectiveStepCount*5 + actionCount*0.5 + branchCount*2 + verificationCount*2 + consultationCount*2 + approvalCount*1.5 + dialogueCount*2;

  return {
    id,
    code: txt(x.code) || txt(x.codeNotation) || id,
    name: txt(x.name) || '(Không có tên)',
    category: obj(x.category) ? txt(x.category.name) : '',
    features: {
      steps: effectiveStepCount,
      structuredStepCount: steps.length,
      explicitStepCount: processExplicitSteps,
      actionCount, decisionCount, branchCount, verificationCount, consultationCount, approvalCount, dialogueCount,
      complexitySignal,
      profileComponents: profiles.filter(p => obj(p) && p.isProcessingResult !== true).length,
      requiredProfiles, conditionalProfiles, processingResults,
      originalQtyTotal: originals, copyQtyTotal: copies,
      electronicFormCount: electronicForms, attachmentTemplateCount: attachmentTemplates,
      methods: methodsNames.length, methodNames: methodsNames,
      returningMethods: returnMethods, returningOnline,
      executionCases: cases.length,
      processingMin: processing.length ? Math.min(...processing.map(p => p.value)) : null,
      processingMax: processing.length ? Math.max(...processing.map(p => p.value)) : null,
      processingValues: processingSources, timeVariant: uniq(processingSources).length > 1,
      conditionSignal: conditionCountSignal,
      actorCount: actorKeys.length, departmentCount: departments.length, unitGroupCount: units.length, handoffCount,
      authorization,
      hasOnlineSubmission,
      implementLevel: dvc.implementLevel,
      implementLevelSource: dvc.implementLevelSource,
      dvcMappingStatus: dvc.dvcMappingStatus,
      dvcCodes: dvc.dvcCodes,
      dvcLevels: dvc.dvcLevels,
      isFullProcess, isNonTerritorial, isOfflineOnly,
      hasReturnOnline: returningOnline,
      narrativeLength: narrative.length,
      dataWarnings: uniq(warnings)
    }
  };
}

function add(pool, rec, group, reason) {
  if (!rec) return;
  let p = pool.get(rec.id);
  if (!p) { p = { record: rec, groups: [], reasons: [] }; pool.set(rec.id, p); }
  if (!p.groups.includes(group)) p.groups.push(group);
  if (reason && !p.reasons.includes(reason)) p.reasons.push(reason);
}
function asc(list, fn) { return [...list].sort((a,b) => (fn(a)??0)-(fn(b)??0)); }
function desc(list, fn) { return [...list].sort((a,b) => (fn(b)??0)-(fn(a)??0)); }

if (!fs.existsSync(ROOT)) throw new Error(`Không tìm thấy thư mục: ${ROOT}`);
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
const mapping = loadDvcMapping();
console.log(mapping.available ? `DVC mapping loaded: ${mapping.path} (${mapping.rowCount} rows)` : 'DVC mapping chưa được nạp; C5 FULL/PARTIAL sẽ ở trạng thái UNKNOWN với TTHC có ONLINE.');

const files = fs.readdirSync(ROOT).filter(f => f.toLowerCase().endsWith('.json')).sort();
const records = [];
for (const file of files) {
  try {
    const id = path.basename(file, '.json');
    const x = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    if (obj(x)) records.push(extract(id, x, mapping));
  } catch (e) { console.warn(`Bỏ qua ${file}: ${e.message}`); }
}
console.log(`Phân tích ${records.length}/${files.length} JSON.`);

const groups = {};
groups.G01_VERY_SIMPLE = asc(records, r => r.features.complexitySignal + r.features.requiredProfiles*2 + r.features.conditionSignal).slice(0,15);
groups.G02_MANY_STEPS = desc(records, r => r.features.steps).slice(0,15);
groups.G03_FEW_PROFILES = asc(records, r => r.features.profileComponents).slice(0,15);
groups.G04_MANY_PROFILES = desc(records, r => r.features.profileComponents + r.features.originalQtyTotal + r.features.copyQtyTotal).slice(0,15);
groups.G05_SHORT_TIME = asc(records.filter(r => r.features.processingMin !== null), r => r.features.processingMin).slice(0,15);
groups.G06_LONG_TIME = desc(records.filter(r => r.features.processingMax !== null), r => r.features.processingMax).slice(0,15);
groups.G07_TIME_VARIANT = records.filter(r => r.features.timeVariant).slice(0,15);
groups.G08_COMPLEX_CONDITIONS = desc(records, r => r.features.conditionSignal).slice(0,15);
groups.G09_MANY_ACTORS = desc(records, r => r.features.actorCount + r.features.handoffCount*2).slice(0,15);
groups.G10_EXECUTION_CASES = desc(records, r => r.features.executionCases).slice(0,15);
groups.G11_C5_FULL = records.filter(r => r.features.implementLevel === 'FULL').slice(0,15);
groups.G12_C5_PARTIAL = records.filter(r => r.features.implementLevel === 'PARTIAL').slice(0,15);
groups.G13_C5_NONE = records.filter(r => r.features.implementLevel === 'NONE').slice(0,15);
groups.G14_C5_DIGITAL = records.filter(r => r.features.isFullProcess === true).slice(0,15);
groups.G15_C5_NON_TERRITORIAL = records.filter(r => r.features.isNonTerritorial === true).slice(0,15);
groups.G16_AUTHORIZATION = records.filter(r => r.features.authorization !== 'UNKNOWN').slice(0,15);
groups.G17_ANOMALIES = desc(records, r => r.features.dataWarnings.length).slice(0,20);
groups.G18_VERY_COMPLEX = desc(records, r => r.features.complexitySignal + r.features.conditionSignal*2 + r.features.actorCount*2 + r.features.profileComponents + (r.features.processingMax || 0)/10).slice(0,15);
groups.G19_C5_ONLINE_MAPPING_UNKNOWN = records.filter(r => r.features.hasOnlineSubmission && ['UNKNOWN','NOT_FOUND','MAPPING_NOT_LOADED','CONFLICT','INVALID_MUCDO'].includes(r.features.dvcMappingStatus)).slice(0,15);
groups.G20_C5_ONLINE_MAPPED = records.filter(r => r.features.hasOnlineSubmission && r.features.dvcMappingStatus === 'MATCHED').slice(0,15);

const pool = new Map();
for (const [g,list] of Object.entries(groups)) for (const r of list) add(pool,r,g,`Chọn từ ${g}`);

const selected = new Map();
const quotas = {
  G01_VERY_SIMPLE:3,G02_MANY_STEPS:3,G03_FEW_PROFILES:2,G04_MANY_PROFILES:3,
  G05_SHORT_TIME:2,G06_LONG_TIME:3,G07_TIME_VARIANT:2,G08_COMPLEX_CONDITIONS:3,
  G09_MANY_ACTORS:3,G10_EXECUTION_CASES:2,G11_C5_FULL:2,G12_C5_PARTIAL:2,G13_C5_NONE:2,
  G14_C5_DIGITAL:2,G15_C5_NON_TERRITORIAL:2,G16_AUTHORIZATION:2,G17_ANOMALIES:2,G18_VERY_COMPLEX:3
};

function choose(r, reason) {
  if (!r || selected.has(r.id) || selected.size >= TARGET) return false;
  const p = pool.get(r.id); if (!p) return false;
  selected.set(r.id, { record: r, groups: [...p.groups], reasons: [...p.reasons, reason] });
  return true;
}

for (const [g,q] of Object.entries(quotas)) {
  if (g === 'G11_C5_FULL' || g === 'G12_C5_PARTIAL') {
    if (!groups[g].length) { console.warn(`SKIP ${g}: không có candidate từ dữ liệu hiện tại.`); continue; }
  }
  let k = 0;
  for (const r of groups[g]) { if (k >= q || selected.size >= TARGET) break; if (choose(r, `Golden anchor: ${g}`)) k++; }
  if (k < q) console.warn(`WARN ${g}: ${k}/${q}`);
}

while (selected.size < TARGET) {
  const candidates = records.filter(r => !selected.has(r.id));
  if (!candidates.length) break;
  const best = candidates.sort((a,b) => {
    const score = r => {
      const f = r.features;
      return (f.hasOnlineSubmission ? 4 : 0) + (f.dvcMappingStatus === 'MATCHED' ? 4 : 0) + (f.timeVariant ? 2 : 0) + (f.dataWarnings.length * 2)
        + f.complexitySignal/20 + f.conditionSignal/20 + f.actorCount/5;
    };
    return score(b) - score(a);
  })[0];
  if (!best) break;
  choose(best, 'DIVERSITY_FILL');
}

const samples = [...selected.values()].map((x,i) => ({
  sampleNo: i+1, id: x.record.id, code: x.record.code, name: x.record.name, category: x.record.category,
  groups: x.groups, reasons: uniq(x.reasons), features: x.record.features
}));

const coverage = {};
for (const [g,q] of Object.entries(quotas)) coverage[g] = { selected: samples.filter(x => x.groups.includes(g)).length, quota: q };
const total = samples.length;
if (total !== TARGET) throw new Error(`Sample count lỗi: ${total} !== ${TARGET}`);

const implementCounts = records.reduce((a,r) => { const k=r.features.implementLevel; a[k]=(a[k]||0)+1; return a; }, {});
const mappingCounts = records.reduce((a,r) => { const k=r.features.dvcMappingStatus; a[k]=(a[k]||0)+1; return a; }, {});
console.log(`C5 implementLevel: ${JSON.stringify(implementCounts)}`);
console.log(`C5 mappingStatus: ${JSON.stringify(mappingCounts)}`);

const output = {
  metadata: {
    version: 'TCI_V1_CALIBRATION_V2_2.0',
    candidateCount: records.length,
    sampleCount: samples.length,
    random: false,
    dvcMappingLoaded: mapping.available,
    dvcMappingPath: mapping.path,
    note: 'JSON xác định có/không ONLINE; bảng DVC mapping theo MaTTHC xác định FULL/PARTIAL khi có ONLINE.'
  },
  coverage,
  samples
};
fs.writeFileSync(path.join(OUT_DIR, 'tci-calibration-selection-v2.json'), JSON.stringify(output, null, 2));
console.log(`ĐÃ CHỌN ${samples.length} SAMPLE V2.`);
