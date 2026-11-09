// 주간 보고서 생성기 — node weekly.js <data.js> <rev.js> <기준 수요일 YYYY-MM-DD> <작성 문구>
global.window={};require(require('path').resolve(process.argv[2]));require(require('path').resolve(process.argv[3]));
const D=window.APP_DATA,R=window.REV_DATA,wed=process.argv[4],made=process.argv[5];
const pd=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)},ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const add=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ymd(d)},WD='일월화수목금토',md=s=>{const d=pd(s);return `${d.getMonth()+1}/${d.getDate()}`},mdw=s=>`${md(s)}(${WD[pd(s).getDay()]})`;
const won=n=>Number(n).toLocaleString('ko-KR'),man=n=>n>=1e4?Math.round(n/1e4).toLocaleString('ko-KR')+'만':won(n),sum=a=>a.reduce((x,y)=>x+y,0);
const mon=add(wed,-((pd(wed).getDay()+6)%7)); // 이번 주 월요일
const L=[add(mon,-7),add(mon,-1)],P=[add(mon,-14),add(mon,-8)],T=[mon,add(mon,6)],N=[add(mon,7),add(mon,13)];
const agg=(o,[f,t])=>{const c=R.parts.map(()=>0);let n=0;for(const[d,v]of Object.entries(o||{}))if(d>=f&&d<=t){v.c.forEach((x,i)=>c[i]+=x);n+=v.n}return{c,n,t:sum(c)}};
const on=(c,[f,t])=>c.s&&c.s<=t&&(c.e||c.s)>=f,by=(a,b)=>a.s.localeCompare(b.s);
const pct=(a,b)=>b?`${a>=b?'▲':'▼'} ${Math.abs(Math.round((a-b)/b*100))}%`:'—';
const own=o=>({'':'미지정','SALES':'영업','KIM-YW':'김영우','JIN-IJ':'진인주'}[o||'']??o);
const ST={conf:'확정',hold:'가예약',mix:'확정+가예약',quote:'견적 중'};
const la=agg(R.conf,L),pa=agg(R.conf,P),ta=agg(R.conf,T),tp=agg(R.pipe,T),na=agg(R.conf,N),np=agg(R.pipe,N);
const tw=D.cases.filter(c=>on(c,T)).sort(by),nw=D.cases.filter(c=>on(c,N)).sort(by);
const row=c=>[c.s===c.e||!c.e?mdw(c.s):`${mdw(c.s)}~${md(c.e)}`,c.name,(c.pax||'—')+'명',[...new Set([...(c.sch||[]).map(s=>s[2]),...(c.rooms||[]).map(r=>'연수 '+r[0])])].join(' · ')||'공간 미정',own(c.owner),ST[c.st]||c.stage];
const items={};tw.forEach(c=>(c.amt.items||[]).forEach(r=>{const k=r[0].replace(/\[.*?\]|\(.*?\)/g,'').replace(/\s+/g,' ').trim();const v=+String(r[3]).replace(/[^\d-]/g,'')||0;if(v)items[k]=(items[k]||0)+v}));
const late=D.cases.filter(c=>(c.al||[]).some(a=>/입금 지연/.test(a[1])));
const due=D.cases.filter(c=>+c.amt.due>0),dueSum=sum(due.map(c=>+c.amt.due));
const pays=[];D.cases.forEach(c=>(c.amt.pay||[]).forEach(p=>{if(p[1]>=T[0]&&p[1]<=T[1]&&!/확인|입금/.test(p[4]||''))pays.push([mdw(p[1]),c.name,p[0],p[2]+'원'])}));pays.sort();
const holds=D.cases.filter(c=>c.hold&&c.hold<wed&&c.stg<60&&c.s&&c.s>=T[0]).sort(by);
const noOwn=D.cases.filter(c=>!c.owner&&c.s&&c.s>=T[0]);
const lines=[];
lines.push(`지난주(${md(L[0])}~${md(L[1])}) 단체 확정 매출 ${won(la.t)}원 — 전주 ${man(pa.t)}원 대비 ${pct(la.t,pa.t)}`);
lines.push(`이번 주(${md(T[0])}~${md(T[1])}) 단체 ${tw.length}건 · ${sum(tw.map(c=>c.pax||0))}명, 확정 매출 ${man(ta.t)}원${tp.t?` + 확정 전 ${man(tp.t)}원`:''}`);
lines.push(`받을 돈 ${won(dueSum)}원(${due.length}건)${late.length?`, 그중 입금 지연 ${late.length}건 ${won(sum(late.map(c=>+c.amt.due||0)))}원`:''}`);
if(holds.length)lines.push(`기한 지난 가예약·견적 ${holds.length}건이 자리를 잡고 있음 — 연장·확정·해제 결정 필요`);
const rep={id:wed,title:`주간 보고서 · ${md(T[0])}~${md(T[1])} 주`,made,basis:`${D.asOf} · ${R.asOf}`,sections:[
 {h:'한눈에',lines},
 {h:`지난주 부문별 매출 (${md(L[0])}~${md(L[1])})`,table:[['부문','지난주','전주','증감'],...R.parts.map((p,i)=>[p,la.c[i]?won(la.c[i]):'—',pa.c[i]?won(pa.c[i]):'—',pct(la.c[i],pa.c[i])]),['합계',won(la.t),won(pa.t),pct(la.t,pa.t)]]},
 {h:`이번 주 단체 (${tw.length}건)`,table:[['날짜','단체','인원','공간','담당','상태'],...tw.map(row)]},
 {h:`이번 주 품목별 금액 (단체 견적 구성 기준)`,table:[['품목','금액'],...Object.entries(items).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>[k,won(v)])]},
 {h:`다음 주 예정 (${md(N[0])}~${md(N[1])} · ${nw.length}건)`,table:[['날짜','단체','인원','공간','담당','상태'],...nw.map(row)],lines:[`확정 매출 ${man(na.t)}원 · 확정 전 견적 ${man(np.t)}원`]},
 {h:'수금',lines:[...late.map(c=>`입금 지연: ${c.name} ${won(c.amt.due)}원 (${(c.al.find(a=>/입금 지연/.test(a[1]))||[])[1].replace('입금 지연 · ','')})`),...(pays.length?[]:['이번 주 예정된 결제 단계가 없습니다.'])],table:pays.length?[['예정일','단체','단계','금액'],...pays]:undefined},
 {h:'결정이 필요한 것',lines:[...holds.slice(0,10).map(c=>`${c.name} (${mdw(c.s)} 이용) — 가예약 기한 ${md(c.hold)} 지남 · ${c.stage}`),...(holds.length>10?[`그 밖에 ${holds.length-10}건`]:[]),...noOwn.slice(0,5).map(c=>`${c.name} (${mdw(c.s)}) — 담당 없음`)]},
 {h:'세부 메뉴 · 객실 타입별 매출',lines:['OKPOS(다이닝·카페·베이커리)와 WINGS(객실)가 아직 연결되지 않아 메뉴별·객실 타입별 실매출은 없습니다.','위 부문 매출은 건 대장의 단체 매출만입니다. 개인 투숙·워크인·매장 직접 매출은 빠져 있습니다.','연결되면 이 칸에 메뉴별 판매 수량·금액과 전주 대비 흐름이 들어갑니다.']},
]};
rep.sections.forEach(s=>{if(!s.table)delete s.table;if(s.lines&&!s.lines.length)delete s.lines});
process.stdout.write(JSON.stringify(rep));
