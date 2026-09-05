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
const norm = s => str(s).toLowerCase().replace(/\s+/g, ' ').trim();
function flattenText(value, out = []) { if (value == null) return out; if (typeof value === 'string') out.push(value); else if (Array.isArray(value)) value.forEach(v => flattenText(v, out)); else if (typeof value === 'object') Object.values(value).forEach(v => flattenText(v, out)); return out; }
function countMatches(text, re) { const m = str(text).match(re); return m ? m.length : 0; }
function extractStepNumbers(text) { const found = []; const re = /(?:^|\n|\s)(?:Bước|BUOC)\s*(\d{1,3})\s*(?::|[-–—.]|$)/giu; let m; while ((m = re.exec(str(text))) !== null) found.push(Number(m[1])); return [...new Set(found)].sort((a,b)=>a-b); }
function procedureText(raw) { const stepText = arr(raw.executionSteps).map(s => `${str(s?.name)} ${str(s?.description)}`).filter(Boolean).join('\n'); const fallback = [raw.procedure,raw.executionProcedure,raw.processDescription,raw.description].map(str).filter(Boolean).join('\n'); return [stepText,fallback].filter(Boolean).join('\n'); }

function collectRawTimes(raw) {
  const values=[];
  for (const m of arr(raw.executionMethods)) {
    if (Number.isFinite(Number(m?.processingTime)) && Number(m.processingTime)>0) values.push({value:Number(m.processingTime),unit:str(m.processingTimeUnit).toUpperCase(),source:'executionMethods',method:str(m?.submissionMethod).toUpperCase()});
    const d=str(m?.description); const re=/(?:trong|không quá|ít nhất|tối đa|khoảng|sau)\s+(\d+(?:[.,]\d+)?)\s*(giờ|ngày|tháng|năm|DAY|WORKING_DAY|HOUR)/giu; let mm;
    while((mm=re.exec(d))) values.push({value:Number(mm[1].replace(',','.')),unit:mm[2].toUpperCase(),source:'methodDescription',method:str(m?.submissionMethod).toUpperCase(),text:d});
  }
  for (const c of arr(raw.executionCases)) for (const k of ['processingTime','processingDay']) {
    const x=c?.[k];
    if(x&&typeof x==='object'&&Number.isFinite(Number(x.qty))) values.push({value:Number(x.qty),unit:str(x.type).toUpperCase(),source:`executionCases.${k}`,caseIndex:c?.index});
    else if(Number.isFinite(Number(x))&&Number(x)>0) values.push({value:Number(x),unit:'UNKNOWN',source:`executionCases.${k}`,caseIndex:c?.index});
  }
  return values;
}
function toDays(x){const u=x.unit;if(u==='HOUR'||u==='GIỜ')return x.value/8;if(u==='DAY'||u==='WORKING_DAY'||u==='NGÀY')return x.value;if(u==='MONTH'||u==='THÁNG')return x.value*30;if(u==='YEAR'||u==='NĂM')return x.value*365;return null;}
function criterionC1(raw){
  const components=[...arr(raw.profileComponents)]; for(const c of arr(raw.executionCases)) components.push(...arr(c?.profileComponents));
  const keySet=new Set(),evidence=[];
  for(const p of components){const key=str(p?.code||p?.profileComponentId||p?.name).trim().toLowerCase();if(!key||keySet.has(key))continue;keySet.add(key);evidence.push({name:str(p?.name),required:p?.required===true,hasElectronicForm:p?.hasElectronicForm===true,isConditional:/trường hợp|nếu|khi|đối với/iu.test(str(p?.name))});}
  const narrative=flattenText({description:raw.description,requirementsAndConditions:raw.requirementsAndConditions,procedure:procedureText(raw)}).join('\n');
  const dossierSignals=countMatches(narrative,/hồ sơ|thành phần hồ sơ|nộp hồ sơ|giấy tờ|tài liệu/giu); const required=evidence.filter(x=>x.required).length; const conditional=evidence.filter(x=>x.isConditional).length;
  let score;if(evidence.length===0)score=dossierSignals>0?1:0;else if(evidence.length<=2)score=1;else if(evidence.length<=5)score=2;else if(evidence.length<=10)score=3;else if(evidence.length<=30)score=4;else score=5; if(required>=10||conditional>=8)score=Math.min(5,score+1);
  return{score,state:evidence.length===0&&dossierSignals>0?'UNKNOWN_STRUCTURED_ZERO':'KNOWN',count:evidence.length,requiredCount:required,conditionalCount:conditional,dossierSignals,evidence:evidence.slice(0,12)};
}
function criterionC2(raw){
  const structured=arr(raw.executionSteps); const text=procedureText(raw); const stepNumbers=extractStepNumbers(text); const structuredStepCount=structured.length; const textStepCount=stepNumbers.length?Math.max(...stepNumbers):0; const effectiveSteps=textStepCount||structuredStepCount;
  const branchSignals=countMatches(text,/\bnếu\b|\btrường hợp\b|\bđối với\b|\bkhi\b|\btrừ trường hợp\b|\bngược lại\b/giu); const coordinationSignals=countMatches(text,/phối hợp|thẩm định|thẩm tra|xin ý kiến|trình|phê duyệt|kiểm tra|đối chiếu|xác minh|họp|hội đồng/giu);
  let score=effectiveSteps<=2?1:effectiveSteps<=4?2:effectiveSteps<=7?3:effectiveSteps<=12?4:5; if(branchSignals>=6)score=Math.min(5,score+1); if(coordinationSignals>=8)score=Math.min(5,score+1);
  return{score,state:textStepCount&&textStepCount!==structuredStepCount?'TEXT_OVERRIDES_STRUCTURE':'KNOWN',structuredStepCount,textStepCount,stepNumbers,effectiveSteps,branchSignals,coordinationSignals,evidenceTextLength:text.length};
}
function criterionC3(raw){
  const text=flattenText({description:raw.description,requirements:raw.requirementsAndConditions}).join('\n'); const signals={condition:countMatches(text,/\bđiều kiện\b/giu),requirement:countMatches(text,/\byêu cầu\b/giu),branches:countMatches(text,/\bnếu\b|\btrường hợp\b|\bđối với\b|\bkhi\b|\btrừ trường hợp\b|\bchỉ khi\b/giu),negation:countMatches(text,/\bkhông được\b|\bkhông thuộc\b|\bkhông đủ\b|\bbị từ chối\b|\bkhông đáp ứng\b/giu),thresholds:countMatches(text,/\bít nhất\b|\bkhông quá\b|\btối thiểu\b|\btối đa\b|\btrong vòng\b/giu)};
  const total=signals.condition+signals.requirement+signals.branches*2+signals.negation+signals.thresholds; const score=total<=2?1:total<=6?2:total<=12?3:total<=24?4:5; return{score,state:text.trim()?'KNOWN':'UNKNOWN',...signals,totalSignal:total};
}
function criterionC4(raw){
  const values=collectRawTimes(raw).map(x=>({...x,days:toDays(x)})).filter(x=>x.days!=null); const distinct=uniq(values.map(x=>`${x.value} ${x.unit}`)); const dayValues=values.map(x=>x.days); const maxDays=dayValues.length?Math.max(...dayValues):null; const minDays=dayValues.length?Math.min(...dayValues):null;
  const proc=procedureText(raw); const hasCaseVariants=arr(raw.executionCases).length>1 || /\btrường hợp\b|\bđối với\b|\bnếu\b/iu.test(proc);
  const conflict=distinct.length>1 && !hasCaseVariants; const variant=distinct.length>1 && hasCaseVariants;
  let score=maxDays==null?1:maxDays<=1?1:maxDays<=5?2:maxDays<=15?3:maxDays<=60?4:5;
  return{score,state:maxDays==null?'UNKNOWN':variant?'TIME_VARIANT':conflict?'CONFLICT':'KNOWN',minDays,maxDays,distinctValues:distinct,rawValues:values};
}

function criterionC5(raw){
  const methods=uniq(arr(raw.executionMethods).map(x=>str(x?.submissionMethod).toUpperCase()).filter(Boolean));
  const standardOnly=methods.length>0 && methods.every(x=>['DIRECT','ONLINE','POSTAL','BY_POST','BPOST'].includes(x));
  const methodText=arr(raw.executionMethods).map(x=>str(x?.description)).join('\n');
  const specialSignals={conditional:countMatches(methodText,/trường hợp|nếu|chỉ được|chỉ thực hiện|bắt buộc/giu),original:countMatches(methodText,/bản gốc|bản giấy|đối chiếu|xuất trình/giu),certification:countMatches(methodText,/chứng thực|xác thực|ký số/giu),supplement:countMatches(methodText,/bổ sung|hoàn thiện hồ sơ/giu)};
  const specialTotal=Object.values(specialSignals).reduce((a,b)=>a+b,0);
  const returning=arr(raw.returningMethods).length;
  let score;
  if(standardOnly && specialTotal===0 && returning===0) score=1;
  else { score=standardOnly?1:2; if(specialTotal>=2)score=Math.max(score,3); if(specialTotal>=4)score=Math.max(score,4); if(specialTotal>=7)score=Math.max(score,5); if(returning>=2)score=Math.min(5,score+1); }
  return{score,state:methods.length?'KNOWN':'UNKNOWN',uniqueMethods:methods,standardOnly,specialSignals,specialTotal,returnMethodCount:returning};
}

function extractActiveActors(text){
  const clauses=str(text).split(/(?<=[.!?;:\n])\s+|\s+-\s+/).filter(Boolean); const actors=new Set();
  const actorPatterns=[
    [/văn phòng (?:ubnd|ủy ban nhân dân)[^,;:.\n]*/iu,'Văn phòng UBND'],
    [/chủ tịch(?:,? phó chủ tịch)?(?: ủy ban nhân dân| ubnd)?[^,;:.\n]*/iu,'Lãnh đạo UBND'],
    [/(?:bộ|sở|phòng|chi cục|cục|ban quản lý)[^,;:.\n]*/iu,'Cơ quan chuyên môn'],
    [/(?:ủy ban nhân dân|ubnd) (?:tỉnh|huyện|thành phố|xã|phường|thị trấn)[^,;:.\n]*/iu,'UBND cấp có thẩm quyền'],
    [/(?:hội đồng|cơ quan liên quan|cơ quan phối hợp|cơ quan có thẩm quyền)[^,;:.\n]*/iu,'Cơ quan/Hội đồng liên quan'],
    [/(?:công an|cơ quan đăng ký|cơ quan thuế|kho bạc|ngân hàng)[^,;:.\n]*/iu,'Cơ quan chuyên biệt']
  ];
  const action=/thực hiện|tiếp nhận|kiểm tra|thẩm định|thẩm tra|xác minh|phối hợp|xin ý kiến|lấy ý kiến|báo cáo|trình|phê duyệt|chuyển|gửi|tổ chức|giải quyết|đối chiếu|xác nhận|cấp/iu;
  for(const clause of clauses){ if(!action.test(clause)) continue; for(const [re,label] of actorPatterns) if(re.test(clause)) actors.add(label); }
  return [...actors];
}
function criterionC6(raw){
  const text=procedureText(raw);
  const activeActors=extractActiveActors(text);
  const coordination=countMatches(text,/phối hợp|xin ý kiến|lấy ý kiến|thẩm định|thẩm tra|xác minh|đối chiếu|liên ngành|hội đồng/giu);
  const handoffs=countMatches(text,/\bchuyển\b|\btrình\b|\bgửi\b|\bbáo cáo\b/giu);
  const approvals=countMatches(text,/phê duyệt|quyết định|cho ý kiến|đồng ý/giu);
  let score=activeActors.length<=1?1:activeActors.length===2?2:activeActors.length===3?3:activeActors.length===4?4:5;
  if((coordination>=3||handoffs>=4)&&score<5)score++; if(approvals>=2&&score<5)score++;
  return{score,state:text.trim()?'TEXT_BASED':'UNKNOWN',activeActors,activeActorCount:activeActors.length,coordinationSignals:coordination,handoffSignals:handoffs,approvalSignals:approvals,metadataDepartments:[...arr(raw.departmentExecutingIds),...arr(raw.departmentCoordinatingIds)].length};
}

function stars(score){if(score<=20)return 1;if(score<=40)return 2;if(score<=60)return 3;if(score<=80)return 4;return 5;}
const results=golden.map(g=>{
  const raw=JSON.parse(fs.readFileSync(path.join(DETAILS,`${g.id}.json`),'utf8'));
  const c1=criterionC1(raw),c2=criterionC2(raw),c3=criterionC3(raw),c4=criterionC4(raw),c5=criterionC5(raw),c6=criterionC6(raw);
  const weighted=c1.score*.20+c2.score*.20+c3.score*.15+c4.score*.15+c5.score*.10+c6.score*.20; const score100=Math.round(weighted*20*10)/10;
  const warnings=[]; if(c2.state==='TEXT_OVERRIDES_STRUCTURE')warnings.push('STEP_TEXT_STRUCTURE_MISMATCH'); if(c1.state==='UNKNOWN_STRUCTURED_ZERO')warnings.push('PROFILE_TEXT_STRUCTURED_ZERO'); if(c4.state==='CONFLICT')warnings.push('PROCESSING_TIME_CONFLICT'); if(c4.state==='TIME_VARIANT')warnings.push('PROCESSING_TIME_VARIANT'); if(c4.state==='UNKNOWN')warnings.push('PROCESSING_TIME_UNKNOWN');
  return{goldenNo:g.goldenNo,code:g.code,name:g.name,category:g.category,c1,c2,c3,c4,c5,c6,weightedScore:weighted,score100,stars:stars(score100),warnings};
});
const out={metadata:{version:'TCI_V1_GOLDEN_CALIBRATION_DRAFT_1.2',goldenCount:results.length,note:'C4 phân biệt TIME_VARIANT với CONFLICT; C5 coi Direct/Online/Postal là phương thức mặc định; C6 chỉ tính tác nhân hoạt động trong text của luồng xử lý, không dùng số cơ quan được trao quyền làm điểm chính.'},weights:{C1:.20,C2:.20,C3:.15,C4:.15,C5:.10,C6:.20},results};
fs.writeFileSync(OUT_JSON,JSON.stringify(out,null,2));
let md='# TCI V1 – Golden Calibration Draft 1.2\n\n> Draft hiệu chuẩn, chưa khóa sản xuất. C2/C6 ưu tiên text trình tự thực hiện. C5 coi Direct/Online/Postal là phương thức mặc định. C4 phân biệt biến thể thời gian với xung đột dữ liệu.\n\n';
md+='| # | Mã | TTHC | C1 | C2 | C3 | C4 | C5 | C6 | TCI | Sao | Cảnh báo |\n|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|\n';
for(const r of results)md+=`| ${r.goldenNo} | ${r.code} | ${r.name.replace(/\|/g,'/')} | ${r.c1.score} | ${r.c2.score} | ${r.c3.score} | ${r.c4.score} | ${r.c5.score} | ${r.c6.score} | **${r.score100}** | ${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)} | ${r.warnings.join(', ')} |\n`;
md+='\n## C5 – Phương thức thực hiện\n\nDirect/Online/Postal không tự tăng điểm. Chỉ tín hiệu đặc thù như bản gốc/đối chiếu, chứng thực/xác thực, điều kiện theo phương thức, bổ sung hồ sơ hoặc quy trình trả kết quả phức tạp mới làm tăng điểm.\n\n## C6 – Phối hợp và nhiều tác nhân\n\nC6 không dùng số lượng `departmentExecutingIds` làm điểm chính. Điểm dựa trên tác nhân thực sự xuất hiện cùng hành động xử lý trong text, cộng tín hiệu phối hợp, chuyển giao, thẩm định/xác minh và phê duyệt. Nhiều cơ quan có thể được trao quyền giải quyết nhưng không đồng nghĩa hồ sơ phải đi qua tất cả các cơ quan đó.\n\n## C4 – Thời gian\n\nNhiều thời hạn gắn với các trường hợp/nhánh khác nhau được đánh dấu `TIME_VARIANT`, không coi là mâu thuẫn. Chỉ khi nhiều nguồn cho cùng một phạm vi xử lý mà không có căn cứ cho biến thể mới đánh dấu `CONFLICT`.\n';
md+='\n## C2 – Text-first\n\nSố bước trong text là nguồn chính; cấu trúc `executionSteps` chỉ dùng để đối chiếu.\n';
fs.writeFileSync(OUT_MD,md);
console.log(`Generated ${OUT_JSON}`); console.log(`Generated ${OUT_MD}`); console.log(`Golden cases: ${results.length}`);
