const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'tci-results-v2');
const INPUT = path.join(ROOT, 'tci-calibration-selection-v2.json');
const OUT = path.join(ROOT, 'tci-golden-cases-v2.json');
const MD = path.join(ROOT, 'tci-golden-cases-summary-v2.md');
const TARGET = 30;

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const samples = data.samples || [];
if (samples.length < TARGET) throw new Error(`Không đủ candidate: ${samples.length}`);

const quota = new Map([
  ['G01_VERY_SIMPLE',2], ['G02_MANY_STEPS',3], ['G03_FEW_PROFILES',2], ['G04_MANY_PROFILES',3],
  ['G05_SHORT_TIME',2], ['G06_LONG_TIME',2], ['G07_TIME_VARIANT',2], ['G08_COMPLEX_CONDITIONS',3],
  ['G09_MANY_ACTORS',2], ['G10_EXECUTION_CASES',2], ['G11_C5_FULL',2], ['G12_C5_PARTIAL',2],
  ['G13_C5_NONE',1], ['G14_C5_DIGITAL',2], ['G15_C5_NON_TERRITORIAL',2], ['G16_AUTHORIZATION',2],
  ['G17_ANOMALIES',1], ['G18_VERY_COMPLEX',3]
]);
const totalQuota = [...quota.values()].reduce((a,b)=>a+b,0);
if (totalQuota !== TARGET) throw new Error(`Quota lỗi: ${totalQuota} !== ${TARGET}`);

const selected = new Map();
const counts = new Map([...quota.keys()].map(g=>[g,0]));

function rank(s,g){
  const f=s.features||{};
  const n=x=>Number.isFinite(x)?x:0;
  switch(g){
    case 'G01_VERY_SIMPLE': return -(n(f.complexitySignal)+n(f.requiredProfiles)*2+n(f.conditionSignal));
    case 'G02_MANY_STEPS': return n(f.steps)*10+n(f.branchCount)*2+n(f.verificationCount);
    case 'G03_FEW_PROFILES': return -n(f.profileComponents);
    case 'G04_MANY_PROFILES': return n(f.profileComponents)*10+n(f.originalQtyTotal)+n(f.copyQtyTotal);
    case 'G05_SHORT_TIME': return -(n(f.processingMin)||1e9);
    case 'G06_LONG_TIME': return n(f.processingMax);
    case 'G07_TIME_VARIANT': return n(f.processingMax)-n(f.processingMin)+n(f.conditionSignal);
    case 'G08_COMPLEX_CONDITIONS': return n(f.conditionSignal)*10+n(f.branchCount);
    case 'G09_MANY_ACTORS': return n(f.actorCount)*10+n(f.handoffCount)*5;
    case 'G10_EXECUTION_CASES': return n(f.executionCases)*10+n(f.profileComponents);
    case 'G11_C5_FULL': return n(f.isFullProcess===true)*5+n(f.returningOnline)*2+n(f.isNonTerritorial===true);
    case 'G12_C5_PARTIAL': return n(f.isFullProcess===true)*5+n(f.returningOnline)*2+n(f.conditionSignal)/20;
    case 'G13_C5_NONE': return n(f.methods)+n(f.profileComponents)/10;
    case 'G14_C5_DIGITAL': return n(f.isFullProcess===true)*10+n(f.implementLevel==='PARTIAL')*2;
    case 'G15_C5_NON_TERRITORIAL': return n(f.isNonTerritorial===true)*10+n(f.actorCount);
    case 'G16_AUTHORIZATION': return n(f.authorization!=='UNKNOWN')*10+n(f.conditionSignal);
    case 'G17_ANOMALIES': return (f.dataWarnings||[]).length*100+n(f.steps);
    case 'G18_VERY_COMPLEX': return n(f.complexitySignal)+n(f.conditionSignal)*2+n(f.actorCount)*3+n(f.profileComponents)*1.5+n(f.processingMax)/10;
    default:return 0;
  }
}

function add(s,g,reason){
  if(!s || selected.has(s.id) || selected.size>=TARGET) return false;
  selected.set(s.id,{sample:s,reasons:[...(s.reasons||[]),reason],groups:[...(s.groups||[])]});
  for(const sg of s.groups||[]) counts.set(sg,(counts.get(sg)||0)+1);
  counts.set(g,(counts.get(g)||0)+1);
  return true;
}

for(const [g,q] of quota){
  const candidates=samples.filter(s=>(s.groups||[]).includes(g)).sort((a,b)=>rank(b,g)-rank(a,g));
  let k=0;
  for(const s of candidates){
    if(k>=q || selected.size>=TARGET) break;
    if(add(s,g,`Golden anchor: ${g}`)) k++;
  }
  if(k<q) console.warn(`WARN ${g}: ${k}/${q}`);
}

function vector(s){
  const f=s.features||{};
  return [
    Number(f.steps)||0, Number(f.profileComponents)||0, Number(f.methods)||0, Number(f.executionCases)||0,
    Number(f.conditionSignal)||0, Number(f.actorCount)||0, Number(f.handoffCount)||0, Number(f.narrativeLength)||0,
    Number(f.processingMax)||0, Number(f.processingMin)||0
  ];
}
function dist(a,b){
  const x=vector(a),y=vector(b), scales=[20,50,3,10,50,10,10,10000,100,100];
  return x.reduce((sum,v,i)=>sum+Math.min(1,Math.abs(v-y[i])/(scales[i]||1)),0);
}

while(selected.size<TARGET){
  const pool=samples.filter(s=>!selected.has(s.id));
  if(!pool.length) break;
  const deficit=[...quota.keys()].filter(g=>(counts.get(g)||0)<(quota.get(g)||0));
  let best=null,bestScore=-Infinity;
  for(const s of pool){
    const minDist=selected.size?Math.min(...[...selected.values()].map(x=>dist(s,x.sample))):1;
    const coverageBoost=(s.groups||[]).reduce((sum,g)=>sum+(deficit.includes(g)?6:0),0);
    const unusual=((s.features||{}).dataWarnings||[]).length*2+((s.features||{}).timeVariant?2:0);
    const score=minDist*10+coverageBoost+unusual;
    if(score>bestScore){bestScore=score;best=s;}
  }
  add(best,'DIVERSITY','Bổ sung để tăng độ đa dạng và coverage');
}

const golden=[...selected.values()].map((x,i)=>({
  goldenNo:i+1,
  id:x.sample.id,
  code:x.sample.code,
  name:x.sample.name,
  category:x.sample.category,
  groups:x.groups,
  reasons:[...new Set(x.reasons)],
  features:x.sample.features,
  sourceSampleNo:x.sample.sampleNo
}));

const coverage={};
for(const [g,q] of quota) coverage[g]={selected:golden.filter(x=>(x.groups||[]).includes(g)).length,quota:q};

const output={
  metadata:{version:'TCI_V1_GOLDEN_SELECTOR_V2_1.0',candidateCount:samples.length,goldenCount:golden.length,random:false,quotaTotal:totalQuota,note:'Ứng viên Golden Case thực tế; chưa gán reference score.'},
  coverage,
  golden
};

for(const [g,v] of Object.entries(coverage)) if(v.selected<v.quota) throw new Error(`Coverage thiếu ${g}: ${v.selected}/${v.quota}`);
if(golden.length!==TARGET) throw new Error(`Golden count lỗi: ${golden.length} !== ${TARGET}`);

fs.writeFileSync(OUT,JSON.stringify(output,null,2));
let md='# TCI V1 — Golden Cases V2\n\n';
md+=`- Candidate: **${samples.length}**\n- Golden: **${golden.length}**\n- Random: **No**\n- Reference score: **chưa gán**\n\n## Coverage\n\n`;
for(const [g,v] of Object.entries(coverage)) md+=`- ${v.selected>=v.quota?'✅':'⚠️'} ${g}: ${v.selected}/${v.quota}\n`;
md+='\n## Golden Cases\n\n';
for(const s of golden){const f=s.features;md+=`${s.goldenNo}. **${s.code} — ${s.name}**\n   - C1: profile=${f.profileComponents}, required=${f.requiredProfiles}, originals=${f.originalQtyTotal}, copies=${f.copyQtyTotal}\n   - C2: steps=${f.steps}, actions=${f.actionCount}, branches=${f.branchCount}, verification=${f.verificationCount}, approval=${f.approvalCount}\n   - C3: conditionSignal=${f.conditionSignal}\n   - C4: min=${f.processingMin??'UNKNOWN'}, max=${f.processingMax??'UNKNOWN'}, variant=${f.timeVariant}\n   - C5: level=${f.implementLevel}, fullProcess=${f.isFullProcess}, nonTerritorial=${f.isNonTerritorial}, auth=${f.authorization}\n   - C6: actors=${f.actorCount}, handoffs=${f.handoffCount}\n   - warnings=${(f.dataWarnings||[]).join(', ')||'none'}\n   - groups=${(s.groups||[]).join(', ')}\n\n`;}
fs.writeFileSync(MD,md);
console.log(`ĐÃ CHỌN ${golden.length} GOLDEN CASES V2.`);
