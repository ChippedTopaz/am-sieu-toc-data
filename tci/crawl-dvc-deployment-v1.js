const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = 'https://dichvucong.gov.vn/api/v1/submitting/formality/list-department-url-by-citizen';
const OUT_DIR = path.join(process.cwd(), 'tci-results-v2');
const OUTPUT_MASTER = path.join(OUT_DIR, 'dvc-deployment-master.json');
const OUTPUT_AUDIT = path.join(OUT_DIR, 'dvc-deployment-audit.json');
const OUTPUT_AUDIT_CSV = path.join(OUT_DIR, 'dvc-deployment-conflicts.csv');

const LIMIT = Number(process.env.DVC_DEPLOYMENT_LIMIT || 200);
const DELAY_MS = Number(process.env.DVC_DEPLOYMENT_DELAY_MS || 150);
const MAX_RETRIES = Number(process.env.DVC_DEPLOYMENT_RETRIES || 5);
const TYPES = ['VIETNAMESE_CITIZEN', 'ENTERPRISE'];

const headers = {
  accept: 'application/json',
  'content-type': 'application/json'
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const txt = v => v == null ? '' : String(v).trim();
const arr = v => Array.isArray(v) ? v : [];
const uniq = a => [...new Set(a.filter(Boolean))];

async function postWithRetry(payload) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(API_URL, payload, {
        headers,
        timeout: 60000,
        validateStatus: status => status >= 200 && status < 500
      });
      if (response.status >= 200 && response.status < 300 && response.data?.code === 'OK') {
        return response.data;
      }
      const message = response.data?.message || `HTTP ${response.status}`;
      throw new Error(message);
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_RETRIES) break;
      const wait = Math.min(30000, 1000 * Math.pow(2, attempt));
      process.stdout.write(`\n⚠️ Retry ${attempt + 1}/${MAX_RETRIES}: ${error.message}. Chờ ${wait} ms...\n`);
      await sleep(wait);
    }
  }
  throw lastError || new Error('Unknown request error');
}

function normalizeRow(row, targetType) {
  return {
    sourceTargetType: targetType,
    id: txt(row.id),
    departmentId: txt(row.departmentId),
    departmentName: txt(row.departmentName),
    departmentCode: txt(row.departmentCode),
    departmentLevel: txt(row.departmentLevel),
    departmentType: txt(row.departmentType),
    citizenUrl: txt(row.citizenUrl),
    employeeUrl: txt(row.employeeUrl),
    implementLevel: txt(row.implementLevel).toUpperCase(),
    formalityId: txt(row.formalityId),
    formalityCaseId: txt(row.formalityCaseId),
    formalityCaseName: txt(row.formalityCaseName),
    formalityCaseCode: txt(row.formalityCaseCode),
    formalityCode: txt(row.formalityCode),
    allowAuthorizationToSubmit: typeof row.allowAuthorizationToSubmit === 'boolean' ? row.allowAuthorizationToSubmit : null,
    isTesting: typeof row.isTesting === 'boolean' ? row.isTesting : null,
    isEssential: typeof row.isEssential === 'boolean' ? row.isEssential : null,
    formalityTargetType: arr(row.formalityTargetType).map(x => ({
      id: txt(x?.id),
      name: txt(x?.name),
      type: txt(x?.type)
    }))
  };
}

function dedupe(rows) {
  const byCase = new Map();
  const byFormality = new Map();
  const invalidRows = [];

  for (const row of rows) {
    if (!row.formalityId) {
      invalidRows.push({ ...row, reason: 'MISSING_FORMALITY_ID' });
      continue;
    }
    if (!byFormality.has(row.formalityId)) byFormality.set(row.formalityId, []);
    byFormality.get(row.formalityId).push(row);

    const caseKey = `${row.formalityId}::${row.formalityCaseId || row.formalityCaseCode || 'NO_CASE'}`;
    if (!byCase.has(caseKey)) byCase.set(caseKey, []);
    byCase.get(caseKey).push(row);
  }

  const master = [];
  const conflicts = [];

  for (const [caseKey, group] of byCase.entries()) {
    const levels = uniq(group.map(r => r.implementLevel));
    const validLevels = levels.filter(v => v === 'FULL' || v === 'PARTIAL' || v === 'NONE');
    const unknownLevels = levels.filter(v => !['FULL', 'PARTIAL', 'NONE'].includes(v));
    const audiences = uniq(group.map(r => r.sourceTargetType));
    const departmentIds = uniq(group.map(r => r.departmentId));
    const departmentNames = uniq(group.map(r => r.departmentName));
    const departmentCodes = uniq(group.map(r => r.departmentCode));
    const urls = uniq(group.map(r => r.citizenUrl));
    const authorizationValues = [...new Set(group.map(r => r.allowAuthorizationToSubmit).filter(v => v !== null))];

    let levelStatus = 'MATCHED';
    let resolvedLevel = validLevels.length === 1 && unknownLevels.length === 0 ? validLevels[0] : 'UNKNOWN';
    if (validLevels.length > 1) {
      levelStatus = 'CONFLICT';
      conflicts.push({
        key: caseKey,
        formalityId: group[0].formalityId,
        formalityCaseId: group[0].formalityCaseId,
        formalityCaseCode: group[0].formalityCaseCode,
        levels,
        targetTypes: audiences,
        departmentCount: departmentIds.length,
        departments: departmentNames
      });
    } else if (!levels.length || unknownLevels.length) {
      levelStatus = 'UNKNOWN_LEVEL';
    }

    if (authorizationValues.length > 1) {
      conflicts.push({
        key: caseKey,
        formalityId: group[0].formalityId,
        formalityCaseId: group[0].formalityCaseId,
        formalityCaseCode: group[0].formalityCaseCode,
        conflictType: 'AUTHORIZATION_CONFLICT',
        authorizationValues,
        targetTypes: audiences
      });
    }

    master.push({
      formalityId: group[0].formalityId,
      formalityCaseId: group[0].formalityCaseId,
      formalityCaseCode: group[0].formalityCaseCode,
      formalityCode: group[0].formalityCode,
      formalityCaseName: group[0].formalityCaseName,
      implementLevel: resolvedLevel,
      implementLevelStatus: levelStatus,
      targetTypes: audiences,
      departmentCount: departmentIds.length,
      departmentIds,
      departmentCodes,
      departmentNames,
      citizenUrls: urls,
      authorizationValues,
      sourceRowCount: group.length
    });
  }

  master.sort((a, b) => a.formalityCaseCode.localeCompare(b.formalityCaseCode));
  return { master, conflicts, invalidRows, byFormality };
}

function csvCell(value) {
  const s = Array.isArray(value) ? value.join('|') : txt(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function writeConflictCsv(conflicts) {
  const header = [
    'key', 'formalityId', 'formalityCaseId', 'formalityCaseCode',
    'conflictType', 'levels', 'targetTypes', 'departmentCount', 'departments', 'authorizationValues'
  ];
  const lines = [header.join(',')];
  for (const c of conflicts) {
    lines.push([
      c.key, c.formalityId, c.formalityCaseId, c.formalityCaseCode,
      c.conflictType || 'IMPLEMENT_LEVEL_CONFLICT', c.levels, c.targetTypes,
      c.departmentCount, c.departments, c.authorizationValues
    ].map(csvCell).join(','));
  }
  fs.writeFileSync(OUTPUT_AUDIT_CSV, lines.join('\n'), 'utf8');
}

async function crawlTarget(targetType) {
  const rows = [];
  let lastId = '';
  let page = 0;

  while (true) {
    const payload = {
      formalityTargetType: targetType,
      limit: LIMIT,
      lastId,
      search: '',
      departmentLevel: '',
      departmentCode: '',
      implementLevel: '',
      subjectTypeId: '',
      year: ''
    };

    const res = await postWithRetry(payload);
    const data = res?.data || {};
    const pageRows = arr(data.rows);
    page += 1;
    rows.push(...pageRows.map(row => normalizeRow(row, targetType)));

    console.log(`  ${targetType}: page ${page}, +${pageRows.length}, total ${rows.length}, API total ${data.total ?? '?'} `);

    const nextLastId = txt(data.lastId);
    if (!pageRows.length || !nextLastId || nextLastId === lastId) break;
    lastId = nextLastId;
    await sleep(DELAY_MS);
  }

  return rows;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('=== DVC DEPLOYMENT CRAWLER / TCI V1 ===');
  console.log(`API: ${API_URL}`);
  console.log(`Limit: ${LIMIT}`);

  const allRows = [];
  const statsByTarget = {};

  for (const targetType of TYPES) {
    const rows = await crawlTarget(targetType);
    statsByTarget[targetType] = { rawRows: rows.length };
    allRows.push(...rows);
  }

  console.log(`\nTổng raw rows: ${allRows.length}`);
  const result = dedupe(allRows);
  const uniqueFormalityIds = new Set(allRows.map(r => r.formalityId).filter(Boolean));

  for (const targetType of TYPES) {
    const subset = allRows.filter(r => r.sourceTargetType === targetType);
    const levels = {};
    for (const row of subset) levels[row.implementLevel || 'EMPTY'] = (levels[row.implementLevel || 'EMPTY'] || 0) + 1;
    statsByTarget[targetType].levelCounts = levels;
    statsByTarget[targetType].uniqueFormalityIds = new Set(subset.map(r => r.formalityId).filter(Boolean)).size;
  }

  const master = {
    schemaVersion: 'DVC_DEPLOYMENT_MASTER_V1',
    generatedAt: new Date().toISOString(),
    sourceApi: API_URL,
    targetTypes: TYPES,
    counts: {
      rawRows: allRows.length,
      uniqueFormalityIds: uniqueFormalityIds.size,
      uniqueFormalityCases: result.master.length,
      conflicts: result.conflicts.length,
      invalidRows: result.invalidRows.length
    },
    statsByTarget,
    rows: result.master
  };

  const audit = {
    generatedAt: master.generatedAt,
    sourceApi: API_URL,
    counts: master.counts,
    statsByTarget,
    conflicts: result.conflicts,
    invalidRows: result.invalidRows
  };

  fs.writeFileSync(OUTPUT_MASTER, JSON.stringify(master, null, 2), 'utf8');
  fs.writeFileSync(OUTPUT_AUDIT, JSON.stringify(audit, null, 2), 'utf8');
  writeConflictCsv(result.conflicts);

  console.log('\n=== KẾT QUẢ ===');
  console.log(`Raw rows               : ${master.counts.rawRows}`);
  console.log(`Unique formalityId      : ${master.counts.uniqueFormalityIds}`);
  console.log(`Unique formality cases  : ${master.counts.uniqueFormalityCases}`);
  console.log(`Conflicts               : ${master.counts.conflicts}`);
  console.log(`Invalid rows            : ${master.counts.invalidRows}`);
  for (const targetType of TYPES) {
    const s = statsByTarget[targetType];
    console.log(`${targetType}: rows=${s.rawRows}, uniqueFormalityIds=${s.uniqueFormalityIds}, levels=${JSON.stringify(s.levelCounts)}`);
  }
  console.log(`\nĐã ghi: ${OUTPUT_MASTER}`);
  console.log(`Đã ghi: ${OUTPUT_AUDIT}`);
  console.log(`Đã ghi: ${OUTPUT_AUDIT_CSV}`);
}

main().catch(error => {
  console.error('\n❌ CRAWLER FAILED');
  console.error(error?.stack || error?.message || error);
  process.exitCode = 1;
});
