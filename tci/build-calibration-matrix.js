const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const ref = JSON.parse(fs.readFileSync(path.join(ROOT,'tci-results','tci-calibration-matrix-v1.json'),'utf8'));
const machine = JSON.parse(fs.readFileSync(path.join(ROOT,'tci-results','tci-golden-calibration.json'),'utf8'));
const byCode = new Map(machine.results.map(r => [r.code,r]));
const rows = ref.reference.map(x => {
  const m=byCode.get(x.code); if(!m) throw new Error(`Missing machine result for ${x.code}`);
  const refScores=[x.c1,x.c2,x.c3,x.c4,x.c5,x.c6]; const machineScores=[m.c1.score,m.c2.score,m.c3.score,m.c4.score,m.c5.score,m.c6.score];
  const deltas=machineScores.map((v,i)=>v-refScores[i]); const mae=deltas.reduce((a,b)=>a+Math.abs(b),0)/deltas.length;
  return {...x,machineC1:m.c1.score,machineC2:m.c2.score,machineC3:m.c3.score,machineC4:m.c4.score,machineC5:m.c5.score,machineC6:m.c6.score,machineTCI:m.score100,deltaC1:deltas[0],deltaC2:deltas[1],deltaC3:deltas[2],deltaC4:deltas[3],deltaC5:deltas[4],deltaC6:deltas[5],meanAbsDelta:Number(mae.toFixed(2)),warnings:m.warnings};
});
const summary={cases:rows.length,criterionMAE:{}}; for(const c of ['C1','C2','C3','C4','C5','C6']) summary.criterionMAE[c]=Number((rows.reduce((s,r)=>s+Math.abs(r[`delta${c}`]),0)/rows.length).toFixed(2));
summary.largeDifferences=rows.filter(r=>r.meanAbsDelta>=1).map(r=>({n:r.n,code:r.code,meanAbsDelta:r.meanAbsDelta,deltas:r.deltas}));
fs.writeFileSync(path.join(ROOT,'tci-results','tci-calibration-matrix-v1-report.json'),JSON.stringify({metadata:ref.metadata,summary,rows},null,2));
let md='# TCI V1 – Golden Calibration Matrix\n\n'; md+='> Đây là ma trận tham chiếu dùng để hiệu chuẩn. Điểm reference là mức đánh giá nghiệp vụ dự kiến; điểm máy được đặt cạnh để tìm lệch, chưa coi reference là chân lý tuyệt đối cho mọi TTHC.\n\n';
md+='| # | Mã | Ref C1 | M | Ref C2 | M | Ref C3 | M | Ref C4 | M | Ref C5 | M | Ref C6 | M | TCI máy | ΔTB |\n|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n';
for(const r of rows){const m=[r.machineC1,r.machineC2,r.machineC3,r.machineC4,r.machineC5,r.machineC6].map(v=>v);md+=`| ${r.n} | ${r.code} | ${r.c1} | ${m[0]} | ${r.c2} | ${m[1]} | ${r.c3} | ${m[2]} | ${r.c4} | ${m[3]} | ${r.c5} | ${m[4]} | ${r.c6} | ${m[5]} | ${r.machineTCI} | ${r.meanAbsDelta} |\n`;}
md+='\n## Sai lệch trung bình tuyệt đối theo tiêu chí\n\n'; for(const [k,v] of Object.entries(summary.criterionMAE)) md+=`- ${k}: ${v}\n`;
md+='\n## Các điểm cần rà lại\n\n'; for(const r of rows.filter(r=>r.meanAbsDelta>=1)) md+=`- **#${r.n} ${r.code}**: Δ = ${r.deltas.join(', ')}; ${r.anchor}\n`;
md+='\n## Quy tắc đã khóa tạm thời trong draft\n\n- C5: Direct/Online/Postal là kênh mặc định; không cộng điểm vì số lượng kênh.\n- C6: chỉ nhìn tác nhân thực sự tham gia trong text và các hành động phối hợp/chuyển giao/thẩm định/phê duyệt; không lấy số `departmentExecutingIds` làm điểm chính.\n- C4: nhiều thời hạn gắn với các trường hợp/nhánh hợp lệ được đánh dấu `TIME_VARIANT`; chỉ dữ liệu cùng phạm vi mà mâu thuẫn mới là `CONFLICT`.\n';
fs.writeFileSync(path.join(ROOT,'tci-results','tci-calibration-matrix-v1.md'),md); console.log('Generated calibration matrix report.');
