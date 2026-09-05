const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const GOLDEN = path.join(ROOT, 'tci-results', 'tci-golden-cases.json');
const DETAILS = path.join(ROOT, 'details');
const OUT_JSON = path.join(ROOT, 'tci-results', 'tci-golden-calibration.json');
const OUT_MD = path.join(ROOT, 'tci-results', 'tci-golden-calibration.md');

const input = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
const golden = input.golden || [];
if (golden.length !== 30) throw new Error(`Golden count = ${golden.length}, expected 30`);

const arr = v => Array.isArray(v) ? v : [];
const str = v => v == null ? '' : String(v);
const uniq = a => [...new Set(a.filter(Boolean))];

function flattenText(value, out = []) {
  if (value == null) return out;
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach(v => flattenText(v, out));
  else if (typeof value === 'object') Object.values(value).forEach(v => flattenText(v, out));
  return out;
}

function normalizeText(s) {
  return str(s).replace(/\s+/g, ' ').trim();
}

function countMatches(text, re) {
  const m = normalizeText(text).match(re);
  return m ? m.length : 0;
}

function maxStepFromText(text) {
  const re = /(?:^|[\\n.;])\\s*(?:Bước|BƯỚC)\\s*(\\d{1,2})\\s*:/g;
  let max = 0, m;
  while ((m = re.exec(str(text))) !== null) max = Math.max(max, Number(m[1]));
  return max;
}

function collectRawTimes(raw) {
  const values = [];
  for (const m of arr(raw.executionMethods)) {
    if (Number.isFinite(Number(m?.processingTime)) && Number(m.processingTime) > 0) {
      values.push({ value: Number(m.processingTime), unit: str(m.processingTimeUnit).toUpperCase(), source: 'executionMethods' });
    }
    const d = str(m?.description);
    const re = /(?:trong|không quá|ít nhất|tối đa|khoảng|sau)\\s+(\\d+(?:[.,]\\d+)?)\\s*(giờ|ngày|tháng|năm|DAY|WORKING_DAY|HOUR)/gi;
    let mm;
    while ((mm = re.exec(d))) values.push({ value: Number(mm[1].replace(',', '.')), unit: mm[2].toUpperCase(), source: 'methodDescription' });
  }
  for (const c of arr(raw.executionCases)) {
    for (const k of ['processingTime','processingDay']) {
      const x = c?.[k];
      if (x && typeof x === 'object' && Number.isFinite(Number(x.qty))) {
        values.push({ value: Number(x.qty), unit: str(x.type).toUpperCase(), source: `executionCases.${k}` });
      } else if (Number.isFinite(Number(x)) && Number(x) > 0) {
        values.push({ value: Number(x), unit: 'UNKNOWN', source: `executionCases.${k}` });
      }
    }
  }
  return values;
}

function toDays(x) {
  const u = x.unit;
  if (u === 'HOUR' || u === 'GIỜ') return x.value / 8;
  if (u === 'DAY' || u === 'WORKING_DAY' || u === 'NGÀY') return x.value;
  if (u === 'MONTH' || u === 'THÁNG') return x.value * 30;
  if (u === 'YEAR' || u === 'NĂM') return x.value * 365;
  return null;
}

function criterionC1(raw) {
  const components = [];
  const roots = arr(raw.profileComponents);
  components.push(...roots);
  for (const c of arr(raw.executionCases)) components.push(...arr(c?.profileComponents));
  const keySet = new Set();
  const evidence = [];
  for (const p of components) {
    const key = str(p?.code || p?.profileComponentId || p?.name).trim().toLowerCase();
    if (!key || keySet.has(key)) continue;
    keySet.add(key);
    evidence.push({
      name: str(p?.name),
      required: p?.required === true,
      hasElectronicForm: p?.hasElectronicForm === true,
      isConditional: /trường hợp|nếu|khi|đối với/i.test(str(p?.name))
    });
  }
  const text = flattenText({ description: raw.description, requirements: raw.requirementsAndConditions });
  const narrative = text.join('\n');
  const dossierSignals = countMatches(narrative, /hồ sơ|thành phần hồ sơ|nộp hồ sơ|giấy tờ|tài liệu/gi); 
  const required = evidence.filter(x => x.required).length;
  const conditional = evidence.filter(x => x.isConditional).length;
  let score;
  if (evidence.length === 0) score = dossierSignals > 0 ? 1 : 0;
  else if (evidence.length <= 2) score = 1;
  else if (evidence.length <= 5) score = 2;
  else if (evidence.length <= 10) score = 3;
  else if (evidence.length <= 30) score = 4;
  else score = 5;
  if (required >= 10 || conditional >= 8) score = Math.min(5, score + 1);
  return { score, state: evidence.length === 0 && dossierSignals > 0 ? 'UNKNOWN_STRUCTURED_ZERO' : 'KNOWN', count: evidence.length, requiredCount: required, conditionalCount: conditional, dossierSignals, evidence: evidence.slice(0, 12) };
}

function criterionC2(raw) {
  const structured = arr(raw.executionSteps);
  const text = flattenText(structured).join('\n');
  const rootText = flattenText({ description: raw.description, requirementsAndConditions: raw.requirementsAndConditions }).join('\n');
  const proceduralText = `${text}\n${rootText}`;
  const textSteps = maxStepFromText(text);
  const fallback = structured.length;
  const effectiveSteps = textSteps || fallback;
  const branchSignals = countMatches(proceduralText, /\bnếu\b|\btrường hợp\b|\bđối với\b|\bkhi\b|\btrừ trường hợp\b|\bngược lại\b/gi);
  const coordinationSignals = countMatches(proceduralText, /phối hợp|thẩm định|thẩm tra|xin ý kiến|trình|phê duyệt|kiểm tra|đối chiếu|xác minh|họp|hội đồng/gi);
  let score = effectiveSteps <= 2 ? 1 : effectiveSteps <= 4 ? 2 : effectiveSteps <= 7 ? 3 : effectiveSteps <= 12 ? 4 : 5;
  if (branchSignals >= 6) score = Math.min(5, score + 1);
  if (coordinationSignals >= 8) score = Math.min(5, score + 1);
  return { score, state: textSteps && textSteps !== structured.length ? 'TEXT_OVERRIDES_STRUCTURE' : 'KNOWN', structuredStepCount: structured.length, textStepCount: textSteps, effectiveSteps, branchSignals, coordinationSignals };
}

function criterionC3(raw) {
  const text = flattenText({ description: raw.description, requirements: raw.requirementsAndConditions }).join('\n');
  const signals = {
    condition: countMatches(text, /\bđiều kiện\b/gi),
    requirement: countMatches(text, /\byêu cầu\b/gi),
    branches: countMatches(text, /\bnếu\b|\btrường hợp\b|\bđối với\b|\bkhi\b|\btrừ trường hợp\b|\bchỉ khi\b/gi),
    negation: countMatches(text, /\bkhông được\b|\bkhông thuộc\b|\bkhông đủ\b|\bbị từ chối\b|\bkhông đáp ứng\b/gi),
    thresholds: countMatches(text, /\bít nhất\b|\bkhông quá\b|\btối thiểu\b|\btối đa\b|\btrong vòng\b/gi)
  };
  const total = signals.condition + signals.requirement + signals.branches * 2 + signals.negation + signals.thresholds;
  const score = total <= 2 ? 1 : total <= 6 ? 2 : total <= 12 ? 3 : total <= 24 ? 4 : 5;
  return { score, state: text.trim() ? 'KNOWN' : 'UNKNOWN', ...signals, totalSignal: total };
}

function criterionC4(raw) {
  const values = collectRawTimes(raw).map(x => ({ ...x, days: toDays(x) })).filter(x => x.days != null);
  const distinct = uniq(values.map(x => `${x.value} ${x.unit}`));
  const dayValues = values.map(x => x.days);
  const maxDays = dayValues.length ? Math.max(...dayValues) : null;
  const minDays = dayValues.length ? Math.min(...dayValues) : null;
  const conflict = distinct.length > 1;
  let score = maxDays == null ? 1 : maxDays <= 1 ? 1 : maxDays <= 5 ? 2 : maxDays <= 15 ? 3 : maxDays <= 60 ? 4 : 5;
  if (conflict) score = Math.min(5, score + 1);
  return { score, state: maxDays == null ? 'UNKNOWN' : conflict ? 'CONFLICT' : 'KNOWN', minDays, maxDays, distinctValues: distinct, rawValues: values };
}

function criterionC5(raw) {
  const methods = arr(raw.executionMethods).map(x => str(x?.submissionMethod).toUpperCase()).filter(Boolean);
  const uniqueMethods = uniq(methods);
  const methodText = arr(raw.executionMethods).map(x => str(x?.description)).join('\n');
  const returning = arr(raw.returningMethods);
  const conditionalRoute = countMatches(methodText, /trường hợp|nếu|phải gửi|gửi bổ sung|chứng thực điện tử|bưu chính/gi);
  let score = uniqueMethods.length <= 1 ? 1 : 2;
  if (conditionalRoute >= 3) score = 3;
  if (conditionalRoute >= 7) score = 4;
  if (returning.length >= 2) score = Math.min(5, score + 1);
  return { score, state: uniqueMethods.length ? 'KNOWN' : 'UNKNOWN', uniqueMethods, conditionalRouteSignals: conditionalRoute, returnMethodCount: returning.length };
}

function criterionC6(raw) {
  const idSets = [
    ['executing', raw.departmentExecutingIds],
    ['authority', raw.departmentAuthorityIds],
    ['authorized', raw.departmentAuthorizedIds],
    ['coordinating', raw.departmentCoordinatingIds]
  ];
  const roleCounts = Object.fromEntries(idSets.map(([k,v]) => [k, uniq(arr(v).map(str).map(x => x.toLowerCase())).length]));
  const allNames = [
    raw.executingAgencies, raw.authorizedAgencies, raw.delegatedAgencies, raw.coordinatingAgencies,
    ...arr(raw.departmentsExecuting).map(x => x?.name), ...arr(raw.departmentsAuthority).map(x => x?.name),
    ...arr(raw.departmentsCoordinating).map(x => x?.name), ...arr(raw.departmentsAuthorized).map(x => x?.name)
  ].map(str).join('\n');
  const text = flattenText(arr(raw.executionSteps)).join('\n');
  const combined = `${text}\n${allNames}`;
  const coordination = countMatches(combined, /phối hợp|xin ý kiến|thẩm định|thẩm tra|hội đồng|cơ quan liên quan|cơ quan có thẩm quyền|trình|phê duyệt|xác minh|đối chiếu|liên ngành/gi);
  const actorMentions = countMatches(combined, /UBND|Ủy ban nhân dân|Sở |Bộ |Công an|cơ quan|hội đồng|ban quản lý|chi cục|cục |phòng /gi);
  const crossRole = ['authority','authorized','coordinating'].some(k => roleCounts[k] > 0);
  const executing = roleCounts.executing;
  let score = executing <= 1 ? 1 : executing <= 3 ? 2 : executing <= 6 ? 3 : executing <= 12 ? 4 : 5;
  if (crossRole) score = Math.min(5, score + 1);
  if (coordination >= 5 || actorMentions >= 10) score = Math.min(5, score + 1);
  return { score, state: executing || actorMentions ? 'KNOWN_WITH_TEXT' : 'UNKNOWN', roleCounts, coordinationSignals: coordination, actorMentions, crossRole };
}

const results = golden.map(g => {
  const raw = JSON.parse(fs.readFileSync(path.join(DETAILS, `${g.id}.json`), 'utf8'));
  const c1 = criterionC1(raw);
  const c2 = criterionC2(raw);
  const c3 = criterionC3(raw);
  const c4 = criterionC4(raw);
  const c5 = criterionC5(raw);
  const c6 = criterionC6(raw);
  const weighted = c1.score * 0.20 + c2.score * 0.20 + c3.score * 0.15 + c4.score * 0.15 + c5.score * 0.10 + c6.score * 0.20;
  const score100 = Math.round(weighted * 20 * 10) / 10;
  const warnings = [];
  if (c2.state === 'TEXT_OVERRIDES_STRUCTURE') warnings.push('STEP_TEXT_STRUCTURE_MISMATCH');
  if (c1.state === 'UNKNOWN_STRUCTURED_ZERO') warnings.push('PROFILE_TEXT_STRUCTURED_ZERO');
  if (c4.state === 'CONFLICT') warnings.push('PROCESSING_TIME_CONFLICT');
  return {
    goldenNo: g.goldenNo,
    code: g.code,
    name: g.name,
    category: g.category,
    c1, c2, c3, c4, c5, c6,
    weightedScore: weighted,
    score100,
    warnings
  };
});

function stars(score) {
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}
for (const r of results) r.stars = stars(r.score100);

const out = {
  metadata: {
    version: 'TCI_V1_GOLDEN_CALIBRATION_DRAFT_1.0',
    goldenCount: results.length,
    note: 'Điểm nháp để hiệu chuẩn; chưa khóa công thức triển khai sản xuất. Phân tích ưu tiên text, dùng cấu trúc để đối chiếu và audit.'
  },
  weights: { C1:0.20,C2:0.20,C3:0.15,C4:0.15,C5:0.10,C6:0.20 },
  results
};
fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2));

let md = '# TCI V1 – Golden Calibration Draft\n\n';
md += '> Điểm dưới đây là **điểm nháp hiệu chuẩn**, chưa phải điểm TCI sản xuất. Ưu tiên text; cấu trúc chỉ dùng để đối chiếu.\n\n';
md += '| # | Mã | TTHC | C1 | C2 | C3 | C4 | C5 | C6 | TCI nháp | Sao | Cảnh báo |\n|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|\n';
for (const r of results) {
  md += `| ${r.goldenNo} | ${r.code} | ${r.name.replace(/\|/g,'/')} | ${r.c1.score} | ${r.c2.score} | ${r.c3.score} | ${r.c4.score} | ${r.c5.score} | ${r.c6.score} | **${r.score100}** | ${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)} | ${(r.warnings||[]).join(', ') || ''} |\n`;
}
md += '\n## Diễn giải quan trọng\n\n';
md += '- C2 lấy **số bước trong text** làm nguồn chính; nếu `executionSteps.length` khác số bước trong text thì đánh dấu mismatch.\n';
md += '- C1 không coi `[]/null/""` là 0 khi phần text vẫn cho thấy có hồ sơ/giấy tờ.\n';
md += '- C4 không tự động chọn min/max khi dữ liệu xung đột; điểm nháp chỉ dùng để nhìn mức độ và đồng thời gắn cảnh báo.\n';
md += '- C6 kết hợp vai trò cơ quan + dấu vết phối hợp/thẩm định/thẩm tra/phê duyệt trong text.\n';

fs.writeFileSync(OUT_MD, md);
console.log(`ĐÃ PHÂN TÍCH ${results.length} GOLDEN CASES.`);
