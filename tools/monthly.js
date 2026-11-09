// 월간 보고서 생성기 — node monthly.js <data.js> <rev.js> <기준일 YYYY-MM-DD(그 달의 지난달을 보고)> <작성 문구>
global.window={};require(require('path').resolve(process.argv[2]));require(require('path').resolve(process.argv[3]));
const D=window.APP_DATA,R=window.REV_DATA,day=process.argv[4],made=process.argv[5];
const won=n=>Number(n).toLocaleString('ko-KR'),man=n=>n>=1e4?Math.round(n/1e4).toLocaleString('ko-KR')+'만':won(n),sum=a=>a.reduce((x,y)=>x+y,0);
const shift=(ym,n)=>{const[y,m]=ym.split('-').map(Number);const d=new Date(y,m-1+n,1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`};
const cur=day.slice(0,7),M=shift(cur,-1),PM=shift(cur,-2),lab=ym=>`${+ym.slice(5)}월`;
const agg=(o,ym)=>{const c=R.parts.map(()=>0);let n=0,days=0;for(const[d,v]of Object.entries(o||{}))if(d.startsWith(ym)){v.c.forEach((x,i)=>c[i]+=x);n+=v.n;days++}return{c,n,days,t:sum(c)}};
const pct=(a,b)=>b?`${a>=b?'▲':'▼'} ${Math.abs(Math.round((a-b)/b*100))}%`:'—';
const a=agg(R.conf,M),p=agg(R.conf,PM);
const wk={};for(const[d,v]of Object.entries(R.conf))if(d.startsWith(M)){const k=Math.min(5,Math.ceil(+d.slice(8)/7));wk[k]=(wk[k]||0)+sum(v.c)}
const dow=[0,0,0,0,0,0,0];for(const[d,v]of Object.entries(R.conf))if(d.startsWith(M)){const[y,m,dd]=d.split('-').map(Number);dow[new Date(y,m-1,dd).getDay()]+=sum(v.c)}
const W={10:.1,20:.2,30:.4,40:.6,50:.9};
const fc=[0,1,2].map(k=>{const m=shift(cur,k),c=agg(R.conf,m),pp=agg(R.pipe,m);let w=0;(R.pcase||[]).forEach(x=>{if((x[2]||'').startsWith(m))w+=(+x[4]||0)*(W[x[3]]??.3)});return[lab(m),won(c.t),won(Math.round(c.t+w)),won(c.t+pp.t)]});
const due=D.cases.filter(c=>+c.amt.due>0),late=D.cases.filter(c=>(c.al||[]).some(x=>/입금 지연/.test(x[1])));
const top=R.parts.map((n,i)=>[n,a.c[i]]).sort((x,y)=>y[1]-x[1]);
const rep={id:M,title:`월간 보고서 · ${M.slice(0,4)}년 ${lab(M)}`,made,basis:`${D.asOf} · ${R.asOf}`,sections:[
 {h:'한눈에',lines:[`${lab(M)} 단체 확정 매출 ${won(a.t)}원 — ${lab(PM)} ${man(p.t)}원 대비 ${pct(a.t,p.t)}`,`가장 큰 부문 ${top[0][0]} ${a.t?Math.round(top[0][1]/a.t*100):0}% · 다음 ${top[1][0]} ${a.t?Math.round(top[1][1]/a.t*100):0}%`,`매출이 있던 날 ${a.days}일 · 단체 1건·1일당 평균 ${a.n?man(Math.round(a.t/a.n)):'—'}원`,`받을 돈 ${won(sum(due.map(c=>+c.amt.due)))}원(${due.length}건) · 입금 지연 ${late.length}건`]},
 {h:`부문별 매출 (${lab(M)} vs ${lab(PM)})`,table:[['부문',lab(M),'비중',lab(PM),'증감'],...R.parts.map((n,i)=>[n,a.c[i]?won(a.c[i]):'—',a.t?Math.round(a.c[i]/a.t*100)+'%':'—',p.c[i]?won(p.c[i]):'—',pct(a.c[i],p.c[i])]),['합계',won(a.t),'100%',won(p.t),pct(a.t,p.t)]]},
 {h:'주차별 흐름',table:[['주','매출'],...[1,2,3,4,5].filter(k=>wk[k]).map(k=>[`${k}주차`,won(wk[k])])]},
 {h:'요일별 매출',table:[['요일','매출'],...'월화수목금토일'.split('').map((d,i)=>[d,won(dow[(i+1)%7])])]},
 {h:'앞으로 3개월 예측',table:[['월','확정','예상','전부 성사 시'],...fc],lines:['예상 = 확정 + 진행 중 견적 × 단계별 성사 가정(계약 90% · 견적 60% · 가예약 40% · 상담 20% · 문의 10%)']},
 {h:'수금',lines:late.map(c=>`입금 지연: ${c.name} ${won(c.amt.due)}원`).concat(late.length?[]:['입금 지연 없음'])},
 {h:'세부 메뉴 · 객실 타입별 매출',lines:['OKPOS(다이닝·카페·베이커리)와 WINGS(객실)가 아직 연결되지 않아 메뉴별·객실 타입별 실매출은 없습니다.','위 매출은 건 대장의 단체 매출만입니다. 연결되면 메뉴별 판매 수량·금액과 전월 대비 흐름이 이 칸에 들어갑니다.']},
]};
process.stdout.write(JSON.stringify(rep));
