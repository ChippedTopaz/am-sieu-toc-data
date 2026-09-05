const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'details');
const files = fs.readdirSync(ROOT).filter(f => f.toLowerCase().endsWith('.json')).sort();

const counts = new Map();
const examples = new Map();
const keyCounts = new Map();
const isValue = v => v !== null && v !== undefined;
const topKeys = new Set();

function note(name, value, id, code) {
  const key = `${name}=${JSON.stringify(value)}`;
  counts.set(key, (counts.get(key) || 0) + 1);
  if (!examples.has(key)) examples.set(key, { id, code });
}

for (const file of files) {
  try {
    const id = path.basename(file, '.json');
    const x = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    if (!x || typeof x !== 'object' || Array.isArray(x)) continue;
    const code = x.code || x.codeNotation || id;
    for (const k of Object.keys(x)) {
      topKeys.add(k);
      keyCounts.set(k, (keyCounts.get(k) || 0) + 1);
    }
    for (const k of ['implementLevel','isFullProcess','isNonTerritorial','isOfflineOnly','formalityType','formalityTargetType','onlineServiceLevel','serviceLevel','degree','onlineLevel']) {
      if (Object.prototype.hasOwnProperty.call(x, k)) note(k, x[k], id, code);
    }
    const methods = Array.isArray(x.executionMethods) ? x.executionMethods : [];
    const returns = [];
    for (const m of methods) {
      if (!m || typeof m !== 'object') continue;
      returns.push(m.returningMethod ?? m.returnMethod ?? null);
      note('submissionMethod', m.submissionMethod ?? null, id, code);
      note('returningMethod', m.returningMethod ?? m.returnMethod ?? null, id, code);
    }
    if (returns.length) note('returningMethods_array', [...new Set(returns.filter(isValue))], id, code);
  } catch (e) {
    console.warn(`Bỏ qua ${file}: ${e.message}`);
  }
}

function printSorted(prefix) {
  console.log(`\n=== ${prefix} ===`);
  [...counts.entries()]
    .filter(([k]) => k.startsWith(`${prefix}=`))
    .sort((a,b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([k,n]) => console.log(`${n}\t${k}\texample=${examples.get(k)?.code || examples.get(k)?.id}`));
}

console.log(`Parsed files: ${files.length}`);
console.log(`Top-level keys: ${[...topKeys].sort().length}`);
console.log(`Files containing likely C5 keys:`);
for (const k of ['implementLevel','isFullProcess','isNonTerritorial','isOfflineOnly','formalityType','formalityTargetType','onlineServiceLevel','serviceLevel','degree','onlineLevel']) {
  console.log(`${k}: ${keyCounts.get(k) || 0}`);
}

for (const p of ['implementLevel','isFullProcess','isNonTerritorial','isOfflineOnly','formalityType','formalityTargetType','onlineServiceLevel','serviceLevel','degree','onlineLevel','submissionMethod','returningMethod','returningMethods_array']) printSorted(p);

console.log('\n=== TOP-LEVEL KEYS POTENTIALLY RELATED TO ONLINE/DVC ===');
console.log([...topKeys].filter(k => /online|service|digital|full|process|submit|return|method|formality|level|degree/i.test(k)).sort().join('\n'));
