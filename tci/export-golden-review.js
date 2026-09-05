const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd());
const GOLDEN = path.join(ROOT, 'tci-results', 'tci-golden-cases.json');
const DETAILS = path.join(ROOT, 'details');
const OUT = path.join(ROOT, 'tci-results', 'golden-review');

const data = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
const cases = data.golden || [];
fs.mkdirSync(OUT, { recursive: true });

function arr(v) { return Array.isArray(v) ? v : []; }
function str(v) { return v == null ? '' : String(v); }
function pickObject(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }
function compact(v, max=12000) {
  const s = JSON.stringify(v, null, 2);
  return s.length <= max ? v : { _truncated: true, _preview: s.slice(0, max) };
}

for (let i = 0; i < cases.length; i++) {
  const g = cases[i];
  const file = path.join(DETAILS, `${g.id}.json`);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const executionCases = arr(raw.executionCases).map((c, idx) => ({
    index: idx + 1,
    code: c?.code ?? null,
    processingTime: c?.processingTime ?? null,
    processingDay: c?.processingDay ?? null,
    profileComponents: compact(arr(c?.profileComponents), 18000),
    executionSteps: compact(arr(c?.executionSteps), 14000),
    executingAgencies: compact(arr(c?.executingAgencies), 9000),
    departments: compact(arr(c?.departments), 9000)
  }));

  const review = {
    goldenNo: g.goldenNo,
    id: g.id,
    code: g.code,
    name: g.name,
    category: g.category,
    groups: g.groups,
    selectorFeatures: g.features,
    // Core TCI evidence from source JSON
    description: raw.description ?? null,
    requirementsAndConditions: raw.requirementsAndConditions ?? null,
    executionSteps: compact(arr(raw.executionSteps), 18000),
    executionMethods: compact(arr(raw.executionMethods), 18000),
    executionCases,
    profileComponentsRoot: compact(arr(raw.profileComponents), 18000),
    executingAgencies: compact(arr(raw.executingAgencies), 12000),
    unitGroupsExecuting: compact(arr(raw.unitGroupsExecuting), 12000),
    departments: compact(arr(raw.departments), 12000),
    returningMethods: compact(arr(raw.returningMethods), 12000),
    fees: compact(arr(raw.fees), 12000),
    targetObjects: compact(arr(raw.targetObjects), 12000),
    resultTypes: compact(arr(raw.resultTypes), 9000),
    flags: {
      isSharedService: raw.isSharedService ?? null,
      isFullProcess: raw.isFullProcess ?? null,
      isOfflineOnly: raw.isOfflineOnly ?? null,
      isNonTerritorial: raw.isNonTerritorial ?? null
    }
  };

  const batch = Math.floor(i / 6) + 1;
  const out = path.join(OUT, `batch-${batch}.json`);
  let list = [];
  if (fs.existsSync(out)) list = JSON.parse(fs.readFileSync(out, 'utf8'));
  list.push(review);
  fs.writeFileSync(out, JSON.stringify(list, null, 2));
}

const manifest = cases.map((g, i) => ({
  batch: Math.floor(i / 6) + 1,
  goldenNo: g.goldenNo,
  code: g.code,
  id: g.id,
  file: `tci-results/golden-review/batch-${Math.floor(i / 6) + 1}.json`
}));
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`ĐÃ XUẤT REVIEW DATA CHO ${cases.length} GOLDEN CASES.`);