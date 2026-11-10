'use strict';
/* 큐레이션 · 공간 배치 · POP/띠지 디자인 — 서점과 아카데미가 함께 씀 */

/* ── 큐레이션 ── */
const PURP=['계절 · 절기','기념일 · 이슈','행사 연계','매출 올리기','재고 줄이기','신간 소개','선물용'];
V.store.cur=()=>{const br=S.br,U=S.ui,hk=hooks(60),saved=S.db.curations.filter(c=>br==='all'||c.br===br).sort((a,b)=>(a.at||'')<(b.at||'')?1:-1),out=U.cur||[];
  return `<div class="sec"><h2>큐레이션</h2><p>지금 이때, 이 목적에 맞는 매대 주제를 추천받고 바로 POP · 띠지 · 주문으로 잇습니다</p></div>
  <div class="grid g2"><div class="card form"><h3>무엇을 위한 매대인가요</h3>
    <div class="fld"><label>목적 (하나 고르기)</label><div class="chips">${PURP.map(p=>`<button class="chip" data-a="ui" data-k="purp" data-v="${p}" aria-pressed="${(U.purp||PURP[0])===p}">${p}</button>`).join('')}</div></div>
    <div class="f2"><div class="fld"><label for="cuT">누구에게</label><input type="text" id="cuT" data-c="uiv" data-k="cuT" value="${esc(U.cuT||'')}" placeholder="예: 숙박 손님, 산책 나온 동네 주민"></div>
     <div class="fld"><label for="cuN">매대에 올릴 책 수</label><select id="cuN" data-c="uiv" data-k="cuN">${[5,8,12].map(n=>`<option ${(+U.cuN||8)===n?'selected':''}>${n}</option>`).join('')}</select></div></div>
    <div class="fld"><label for="cuM">더 알려 줄 것</label><textarea id="cuM" rows="3" data-c="uiv" data-k="cuM" placeholder="예: 11/14 영화 상영과 이어지게, 입구 평대 하나">${esc(U.cuM||'')}</textarea></div>
    <div class="btns">${busyBtn('cur',br==='all'?'지점을 먼저 고르세요':`${brN(br)} 매대 주제 3개 추천받기`,'curGen',br==='all'?'disabled':'')}</div>
    <p class="note">추천은 오늘 날짜, 다가오는 기념일과 행사, 순위, ${isDemo()?'(예시) ':''}매장 재고와 판매를 함께 봅니다. 목록에 없는 책은 「확인 필요」로 표시합니다.</p></div>
   <div class="card"><h3>지금 쓸 수 있는 때 <small>${hk.season}</small></h3><div class="list">${hk.list.slice(0,7).map(h=>`<div class="li"><span class="pill ${h.ev?'p-info':'p-mute'}">${dday(h.date)}</span><div class="t"><b>${esc(h.label)}</b><small>${mdw(h.date)} · ${esc(h.tip)}</small></div><button class="btn sm" data-a="curFrom" data-memo="${esc(h.label+' ('+mdw(h.date)+') — '+h.tip)}">쓰기</button></div>`).join('')||'<div class="empty">60일 안에 잡힌 때가 없습니다.</div>'}</div></div></div>
  ${out.map((t,i)=>themeCard(t,i,false)).join('')}
  ${saved.length?`<div class="sec"><h2 style="font-size:18px">저장한 주제</h2></div>${saved.map(t=>themeCard(t,t.id,true)).join('')}`:''}`};
function themeCard(t,i,saved){const its=items(t.br||S.br);const inStock=b=>its.find(x=>nt(x.t)===nt(b.t)&&x.stock>0);
  return `<div class="card theme"><h3>${esc(t.title)} <small>${saved?brN(t.br)+' · '+esc((t.at||'').slice(0,10)):'추천 '+(i+1)}</small></h3>
   <dl class="kv"><dt>왜 지금</dt><dd>${esc(t.hook)}</dd><dt>목적</dt><dd>${esc(t.goal)}</dd><dt>누구에게</dt><dd>${esc(t.target)}</dd><dt>기간</dt><dd>${esc(t.period)}</dd><dt>놓을 자리</dt><dd>${esc(t.place)}</dd></dl>
   <div class="tw" style="margin-top:10px"><table><tr><th>책</th><th>고른 까닭</th><th>재고</th></tr>${(t.books||[]).map(b=>`<tr><td>${esc(b.t)}<small>${esc([b.a,b.p].filter(Boolean).join(' · '))}</small></td><td>${esc(b.why)}</td><td>${inStock(b)?`<span class="pill p-ok">있음 ${inStock(b).stock}</span>`:b.src==='추천'?'<span class="pill p-low">확인 필요</span>':'<span class="pill p-none">없음</span>'}</td></tr>`).join('')}</table></div>
   ${(t.check||[]).length?`<p class="note" style="margin-top:8px">할 일: ${t.check.map(esc).join(' → ')}</p>`:''}
   <div class="btns" style="margin-top:12px"><button class="btn pri" data-a="toDesign" data-kind="pop" data-s="${saved?1:0}" data-i="${i}">POP 만들기</button><button class="btn" data-a="toDesign" data-kind="band" data-s="${saved?1:0}" data-i="${i}">띠지 만들기</button><button class="btn" data-a="toDesign" data-kind="shelf" data-s="${saved?1:0}" data-i="${i}">선반 이름표</button>
    <button class="btn" data-a="curOrder" data-s="${saved?1:0}" data-i="${i}">없는 책 주문에 담기</button>${saved?`<button class="btn ghost" data-a="curDel" data-i="${i}">지우기</button>`:`<button class="btn" data-a="curSave" data-i="${i}">저장</button>`}</div></div>`}
C.uiv=(el,d)=>{S.ui[d.k]=el.value};
const getTheme=d=>d.s==='1'?S.db.curations.find(c=>c.id===d.i):(S.ui.cur||[])[+d.i];
A.curFrom=d=>{S.mode='store';S.view.store='cur';S.ui.cuM=d.memo;S.ui.purp=/행사|영화|북토크|프로그램/.test(d.memo)?'행사 연계':'기념일 · 이슈';window.scrollTo(0,0);render()};
A.curGen=async()=>{const br=S.br,U=S.ui,hk=hooks(60),B=window.BOOKS||{},n=+U.cuN||8;
  const st=items(br).sort((a,b)=>(b.sold30||0)-(a.sold30||0)).slice(0,70).map(x=>`${x.t} | ${x.a||''} | ${grp(x.cat)} | 재고 ${x.stock||0} | 30일 ${x.sold30||0}권`).join('\n');
  const rk=[...(B.yes24||[]),...(B.aladin||[])].filter((b,i,a)=>a.findIndex(z=>nt(z.t)===nt(b.t))===i).map(b=>`${b.t} | ${b.a} | ${b.p}`).join('\n');
  const out=await ask('cur',`당신은 독립서점의 북 큐레이터입니다. 책을 잘 모르는 직원도 그대로 따라 할 수 있게, 매대 주제 3개를 서로 다른 방향으로 제안하세요.
서점: 더숲 ${brN(br)} 지점 (서울 북한산 자락 · 숲과 쉼, 문학·인문·예술·과학 중심. 참고서·자격증·학습서는 다루지 않음)
오늘: ${TODAY} (${WD[pd(TODAY).getDay()]}요일) · 계절: ${hk.season}
목적: ${U.purp||PURP[0]}
대상: ${U.cuT||'정해지지 않음 — 지점 성격에 맞게 정하세요'}
매대에 올릴 책 수: ${n}권
추가 요청: ${U.cuM||'없음'}
다가오는 때: ${hk.list.slice(0,10).map(h=>`${h.date} ${h.label}`).join(' / ')||'없음'}

[매장 재고와 최근 판매${isDemo()?' (예시 자료)':''}]
${st||'자료 없음'}

[이번 주 온라인 서점 순위]
${rk||'자료 없음'}

규칙:
- 주제마다 "왜 지금인지"(날짜·계절·행사와 이어지는 구체적 까닭)와 "무엇을 얻으려는지"(목적)를 분명히 씁니다. 막연한 주제(예: 가을에 읽기 좋은 책)는 안 됩니다.
- 책은 위 재고 목록과 순위 목록에서 먼저 고릅니다(src "재고" 또는 "순위"). 목록 밖 책은 실제로 한국에 출간된 것이 확실한 책만, 주제마다 3권 이하로 넣고 src "추천"으로 표시합니다. 책을 지어내지 마세요.
- 목적이 "재고 줄이기"면 재고가 많고 판매가 적은 책을, "매출 올리기"면 잘 팔리는데 재고가 있는 책을 중심에 둡니다.
- POP 문구는 손님에게 건네는 말로, 과장 없이. head 18자 이내, body 60자 이내. 띠지 문구 22자 이내.
- place 는 "입구 앞 평대", "계산대 옆", "창가 서가 눈높이 칸"처럼 직원이 바로 알아듣는 자리로.
- check 는 진열까지의 할 일 3~4개.
JSON 배열로만 답하세요:
[{"title":"주제 이름","hook":"왜 지금","goal":"목적과 기대","target":"누구에게","period":"언제부터 언제까지","place":"놓을 자리","books":[{"t":"제목","a":"저자","p":"출판사","src":"재고|순위|추천","why":"한 줄"}],"pop":{"head":"","body":""},"band":"띠지 문구","check":["할 일"]}]`,{modelTier:'complex'});
  if(out){const arr=(Array.isArray(out)?out:out.themes||[]).filter(t=>t&&t.title).slice(0,3).map(t=>({...t,br,books:(t.books||[]).slice(0,14)}));S.ui.cur=arr;if(!arr.length)S.ui.err={cur:'주제를 만들지 못했습니다. 다시 눌러 주세요.'}}};
A.curSave=async d=>{const t=S.ui.cur[+d.i];await put('curations',nid(),{...clone(t),at:new Date().toISOString()},true);S.ui.cur.splice(+d.i,1);toast('주제를 저장했습니다');render()};
A.curDel=d=>del('curations',d.i);
A.curOrder=d=>{const t=getTheme(d),br=t.br||S.br;if(br==='all'){toast('지점을 먼저 고르세요');return}const its=items(br);let n=0;(t.books||[]).forEach(b=>{const it=its.find(x=>nt(x.t)===nt(b.t));if(!it||!(it.stock>0)){addCart(br,{t:b.t,a:b.a,p:b.p,isbn:(it||{}).isbn,price:(it||{}).price},2,'큐레이션: '+t.title);n++}});toast(n?`${n}종을 ${brN(br)} 북센 주문에 담았습니다`:'모두 매장에 있습니다')};
A.toDesign=d=>{const t=getTheme(d)||{},b=(t.books||[])[0]||{};S.ui.D=Object.assign(defD(),{kind:d.kind,tag:t.title||'',head:d.kind==='band'?(t.band||(t.pop||{}).head||''):d.kind==='shelf'?t.title||'':(t.pop||{}).head||'',body:d.kind==='shelf'?t.hook||'':(t.pop||{}).body||'',book:d.kind==='shelf'?'':b.t||'',author:d.kind==='shelf'?'':[b.a,b.p].filter(Boolean).join(' · '),br:t.br||curBr(),books:(t.books||[]).map(x=>({t:x.t,a:x.a,p:x.p}))});
  S.view[S.mode]='design';window.scrollTo(0,0);render()};

/* ── 공간 배치 ── */
const FX={shelf:{n:'서가',w:1.8,h:.4,f:'#8a6b4a'},table:{n:'평대',w:1.2,h:.8,f:'#c9a36a'},face:{n:'면진열대',w:.9,h:.4,f:'#b08a5a'},counter:{n:'계산대',w:1.5,h:.7,f:'#6b7a71'},door:{n:'입구',w:1,h:.2,f:'#b23a2b'},sofa:{n:'읽는 자리',w:1.4,h:.7,f:'#1baf7a'},stage:{n:'무대 · 스크린',w:2.4,h:.5,f:'#6250d6'},seat:{n:'좌석',w:.45,h:.45,f:'#2a78d6'},wall:{n:'벽 · 기둥',w:.4,h:.4,f:'#444c48'}};
const PX=56;
function plan(br){const p=S.db.plans.find(x=>x.id===br);if(p)return p;return{id:br,starter:true,w:10,h:7,fx:[{id:'a',type:'door',x:4.5,y:6.8,w:1,h:.2,label:'입구'},{id:'b',type:'table',x:4.3,y:4.6,w:1.4,h:.9,label:'입구 앞 평대',theme:''},{id:'c',type:'counter',x:7.8,y:5.6,w:1.6,h:.7,label:'계산대'},{id:'d',type:'shelf',x:.2,y:.2,w:4,h:.4,label:'벽 서가 1'},{id:'e',type:'shelf',x:5,y:.2,w:4,h:.4,label:'벽 서가 2'},{id:'f',type:'face',x:1,y:3,w:.9,h:.4,label:'면진열대'},{id:'g',type:'sofa',x:.4,y:5.4,w:1.4,h:.7,label:'읽는 자리'}]}}
function savePlan(br,p,quiet){const {id,starter,...d}=p;d.at=new Date().toISOString();return put('plans',br,d,quiet)}
V.store.space=()=>{const br=curBr();if(br==='all')return `<div class="sec"><h2>공간 배치</h2></div><div class="card empty">위에서 지점을 고르면 그 지점의 배치도가 열립니다.</div>`;
  const p=plan(br),sel=p.fx.find(f=>f.id===S.ui.fx),W=p.w*PX,H=p.h*PX,themed=p.fx.filter(f=>['table','face','shelf'].includes(f.type)),seats=p.fx.filter(f=>f.type==='seat').length;
  return `<div class="sec"><h2>공간 배치</h2><p>${brN(br)} · 가로 ${p.w}m × 세로 ${p.h}m · 눈금 한 칸 1m</p></div>
  ${p.starter?`<div class="al">처음 보는 시작용 배치입니다. 실제 치수와 가구로 고친 뒤 무엇이든 옮기면 저장됩니다.</div>`:''}
  <div class="card"><div class="btns" style="margin-bottom:10px"><b>넣기</b>${Object.entries(FX).filter(([k])=>k!=='seat').map(([k,f])=>`<button class="btn sm" data-a="fxAdd" data-t="${k}"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${f.f};margin-right:5px"></span>${f.n}</button>`).join('')}</div>
   <div class="planwrap"><svg id="plan" viewBox="0 0 ${W} ${H}" data-br="${br}"><defs><pattern id="gr" width="${PX}" height="${PX}" patternUnits="userSpaceOnUse"><path d="M${PX} 0H0V${PX}" fill="none" stroke="var(--line)" stroke-width="1"/></pattern></defs><rect width="${W}" height="${H}" fill="var(--surface)"/><rect width="${W}" height="${H}" fill="url(#gr)"/><rect x="1.5" y="1.5" width="${W-3}" height="${H-3}" fill="none" stroke="var(--ink)" stroke-width="3"/>
    ${p.fx.map(f=>{const t=FX[f.type]||FX.wall,w=f.w*PX,h=f.h*PX,lab=f.type==='seat'?'':(f.label||t.n);return `<g class="fx ${f.id===S.ui.fx?'sel':''}" data-id="${f.id}" transform="translate(${f.x*PX},${f.y*PX})"><rect width="${w}" height="${h}" rx="${f.type==='seat'?h/2:4}" fill="${t.f}" stroke="var(--surface)" stroke-width="2"/>${lab?`<text x="${w/2}" y="${h/2+(f.theme?-2:4)}" text-anchor="middle" style="fill:#fff;font-size:11px;font-weight:600;pointer-events:none">${esc(lab.slice(0,Math.max(2,Math.floor(w/11))))}</text>`:''}${f.theme&&h>=26?`<text x="${w/2}" y="${h/2+12}" text-anchor="middle" style="fill:#fff;font-size:10px;pointer-events:none">${esc(f.theme.slice(0,Math.max(2,Math.floor(w/10))))}</text>`:''}</g>`}).join('')}</svg></div>
   <p class="note" style="margin-top:8px">가구를 끌어서 옮깁니다. 누르면 아래에서 이름 · 크기 · 주제를 고칩니다.</p></div>
  <div class="grid g2">${sel?`<div class="card form"><h3>${esc(sel.label||FX[sel.type].n)} <small>${FX[sel.type].n}</small></h3>
    <div class="f2"><div class="fld"><label for="fxL">이름</label><input type="text" id="fxL" data-c="fxSet" data-k="label" value="${esc(sel.label||'')}"></div><div class="fld"><label for="fxT">매대 주제</label><input type="text" id="fxT" data-c="fxSet" data-k="theme" value="${esc(sel.theme||'')}" list="thl" placeholder="예: 겨울 숲 산책"><datalist id="thl">${S.db.curations.map(c=>`<option value="${esc(c.title)}">`).join('')}</datalist></div></div>
    <div class="f2"><div class="fld"><label for="fxW">가로 (m)</label><input type="number" id="fxW" step="0.1" min="0.2" data-c="fxSet" data-k="w" value="${sel.w}"></div><div class="fld"><label for="fxH">세로 (m)</label><input type="number" id="fxH" step="0.1" min="0.2" data-c="fxSet" data-k="h" value="${sel.h}"></div></div>
    <div class="btns"><button class="btn" data-a="fxRot">90° 돌리기</button><button class="btn" data-a="fxDup">하나 더</button><button class="btn ghost" data-a="fxDel">지우기</button></div></div>`
   :`<div class="card form"><h3>공간 크기 · 행사 자리</h3><div class="f2"><div class="fld"><label for="plW">가로 (m)</label><input type="number" id="plW" min="3" max="40" step="0.5" data-c="plSet" data-k="w" value="${p.w}"></div><div class="fld"><label for="plH">세로 (m)</label><input type="number" id="plH" min="3" max="40" step="0.5" data-c="plSet" data-k="h" value="${p.h}"></div></div>
    <div class="fld"><label>북토크 · 상영 좌석 깔기 <small>지금 ${seats}석</small></label><div class="btns">${[12,20,30,40].map(n=>`<button class="btn sm" data-a="seats" data-n="${n}">${n}석</button>`).join('')}<button class="btn sm ghost" data-a="seats" data-n="0">좌석 걷기</button></div></div>
    <p class="note">좌석은 무대 · 스크린 앞에 줄 맞춰 놓입니다. 무대가 없으면 위쪽 벽을 앞으로 봅니다. 줄 사이 0.9m, 가운데 통로를 둡니다.</p></div>`}
   <div class="card"><h3>매대와 주제 <small>무엇을 어디에</small></h3>${themed.length?`<div class="list">${themed.map(f=>`<div class="li"><div class="t"><b>${esc(f.label||FX[f.type].n)}</b><small>${f.theme?esc(f.theme):'주제 없음'}</small></div>${f.theme?`<button class="btn sm" data-a="fxPop" data-id="${f.id}">이름표 만들기</button>`:`<button class="btn sm ghost" data-a="fxSel" data-id="${f.id}">주제 정하기</button>`}</div>`).join('')}</div>`:'<div class="empty">서가 · 평대를 넣으면 여기에 모입니다.</div>'}</div></div>
  <div class="card"><h3>책을 잘 몰라도 통하는 배치 다섯 가지</h3><ol class="steps">
   <li><span><b>입구 앞 평대는 「지금」을 놓는 자리.</b> 들어와서 세 걸음 안에 보이는 곳에 이번 주 주제 하나만 둡니다.</span></li>
   <li><span><b>눈높이 칸(바닥에서 120~150cm)은 표지가 보이게.</b> 책등만 보이는 책보다 표지를 보인 책이 훨씬 잘 집힙니다.</span></li>
   <li><span><b>한 매대에 한 가지 이야기.</b> 주제 이름표와 POP 한 장, 책은 5~12권. 섞이면 아무것도 안 보입니다.</span></li>
   <li><span><b>계산대 옆은 가볍고 싼 것.</b> 얇은 책, 선물용, 엽서. 기다리는 동안 손이 가는 자리입니다.</span></li>
   <li><span><b>통로는 90cm 이상.</b> 두 사람이 비켜 갈 수 있어야 오래 머뭅니다. 행사 날에는 뒤쪽 출구 통로를 먼저 비웁니다.</span></li></ol>
   <div class="btns" style="margin-top:12px">${busyBtn('space','이 배치 봐 달라고 하기','spaceAsk')}</div>${S.ui.spaceTip?`<ul style="margin:10px 0 0;padding-left:18px;display:grid;gap:5px">${S.ui.spaceTip.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}</div>`};
V.aka.space=V.store.space;
const planMut=(f,quiet)=>{const br=curBr(),p=clone(plan(br));f(p);return savePlan(br,p,quiet)};
const snap=v=>Math.round(v*10)/10;
A.fxAdd=d=>{const t=FX[d.t],id=nid();S.ui.fx=id;planMut(p=>p.fx.push({id,type:d.t,x:snap(p.w/2-t.w/2),y:snap(p.h/2-t.h/2),w:t.w,h:t.h,label:t.n,theme:''}))};
A.fxSel=d=>{S.ui.fx=d.id;render()};
A.fxRot=()=>planMut(p=>{const f=p.fx.find(x=>x.id===S.ui.fx);if(f)[f.w,f.h]=[f.h,f.w]});
A.fxDup=()=>{const id=nid();planMut(p=>{const f=p.fx.find(x=>x.id===S.ui.fx);if(f)p.fx.push({...f,id,x:snap(Math.min(p.w-f.w,f.x+.3)),y:snap(Math.min(p.h-f.h,f.y+.3))})});S.ui.fx=id};
A.fxDel=()=>{const id=S.ui.fx;S.ui.fx=null;planMut(p=>p.fx=p.fx.filter(x=>x.id!==id))};
A.fxPop=d=>{const f=plan(curBr()).fx.find(x=>x.id===d.id);S.ui.D=Object.assign(defD(),{kind:'shelf',head:f.theme,body:'',tag:f.label||'',br:curBr()});S.view[S.mode]='design';window.scrollTo(0,0);render()};
C.fxSet=(el,d)=>planMut(p=>{const f=p.fx.find(x=>x.id===S.ui.fx);if(!f)return;f[d.k]=d.k==='w'||d.k==='h'?Math.max(.2,+el.value||.2):el.value},true).then(()=>{S.stale=true});
C.plSet=(el,d)=>planMut(p=>{p[d.k]=Math.min(40,Math.max(3,+el.value||3))});
A.seats=d=>planMut(p=>{p.fx=p.fx.filter(f=>f.type!=='seat');const n=+d.n;if(!n)return;const st=p.fx.find(f=>f.type==='stage'),gap=.6,cols=Math.max(4,Math.min(10,Math.floor((p.w-1.6)/gap))),half=Math.ceil(cols/2),x0=(p.w-(cols*gap+.6))/2,y0=(st?st.y+st.h:.6)+1.2;
  for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols);p.fx.push({id:'s'+i+nid(),type:'seat',x:snap(x0+c*gap+(c>=half?.6:0)),y:snap(Math.min(p.h-.5,y0+r*.9)),w:.45,h:.45})}});
A.spaceAsk=async()=>{const p=plan(curBr());const out=await ask('space',`서점 공간 배치를 봐 주세요. 책을 잘 모르는 직원에게 말하듯 쉽고 구체적으로, 고칠 점과 잘된 점을 합쳐 5개 이내로 알려 주세요. 치수 단위는 m, 왼쪽 위가 (0,0)입니다.\n공간: 가로 ${p.w} × 세로 ${p.h}\n가구:\n${p.fx.filter(f=>f.type!=='seat').map(f=>`- ${FX[f.type].n} "${f.label||''}" 위치(${f.x},${f.y}) 크기 ${f.w}×${f.h}${f.theme?' 주제: '+f.theme:''}`).join('\n')}\n좌석 ${p.fx.filter(f=>f.type==='seat').length}석\n살필 것: 입구에서 첫 매대까지 동선, 통로 폭(90cm 이상), 계산대 시야, 주제 없는 매대, 행사 때 출구.\nJSON 문자열 배열로만 답하세요: ["…","…"]`);
  if(out)S.ui.spaceTip=(Array.isArray(out)?out:[]).map(String).slice(0,6)};
/* 끌어 옮기기 */
(function(){let d=null;const pt=(svg,e)=>{const m=svg.getScreenCTM().inverse();return{x:(e.clientX*m.a+e.clientY*m.c+m.e)/PX,y:(e.clientX*m.b+e.clientY*m.d+m.f)/PX}};
  document.addEventListener('pointerdown',e=>{const g=e.target.closest&&e.target.closest('g.fx');if(!g)return;const svg=g.ownerSVGElement,p=plan(svg.dataset.br),f=p.fx.find(x=>x.id===g.dataset.id);if(!f)return;const s=pt(svg,e);d={g,svg,f:{...f},p,ox:s.x-f.x,oy:s.y-f.y,moved:false};S.drag=true;e.preventDefault()});
  document.addEventListener('pointermove',e=>{if(!d)return;const s=pt(d.svg,e);d.f.x=snap(Math.max(0,Math.min(d.p.w-d.f.w,s.x-d.ox)));d.f.y=snap(Math.max(0,Math.min(d.p.h-d.f.h,s.y-d.oy)));d.moved=true;d.g.setAttribute('transform',`translate(${d.f.x*PX},${d.f.y*PX})`)});
  document.addEventListener('pointerup',()=>{if(!d)return;const {f,moved}=d;d=null;S.drag=false;S.ui.fx=f.type==='seat'&&!moved?null:f.id;if(moved)planMut(p=>{const t=p.fx.find(x=>x.id===f.id);if(t){t.x=f.x;t.y=f.y}});else render()});})();

/* ── POP · 띠지 디자인 ── */
const PAL=[{n:'숲',bg:'#1d4d38',fg:'#f6f1e3',ac:'#e9c46a'},{n:'종이',bg:'#f6f1e3',fg:'#1f2a24',ac:'#b23a2b'},{n:'먹',bg:'#17191b',fg:'#f2f2ee',ac:'#ffd23f'},{n:'하늘',bg:'#dfeaf2',fg:'#17324d',ac:'#e4572e'},{n:'귤',bg:'#f4a52a',fg:'#231a0e',ac:'#ffffff'},{n:'흰',bg:'#ffffff',fg:'#111111',ac:'#1d6a49'}];
const FONTS=[['명조','"Gowun Batang",serif'],['고딕','"IBM Plex Sans KR",sans-serif'],['손글씨','"Nanum Pen Script",cursive'],['굵게','"Black Han Sans",sans-serif']];
const SIZES={pop:[['A6 세로',105,148],['A5 세로',148,210],['엽서 가로',148,100]],shelf:[['선반 이름표',90,55],['긴 이름표',180,50]],band:[['띠지',0,60]]};
const KINDS=[['pop','POP'],['band','띠지'],['shelf','선반 이름표']];
const defD=()=>({kind:'pop',size:0,pal:0,font:0,tag:'더숲의 추천',head:'',body:'',book:'',author:'',price:'',br:curBr(),bw:140,bs:18,bf:70,bh:60,books:[]});
const mctx=document.createElement('canvas').getContext('2d');
function wrap(text,font,size,maxW,maxLines){mctx.font=`${size*10}px ${font}`;const out=[];String(text||'').split('\n').forEach(par=>{let line='';for(const tok of par.split(/(\s+)/)){const tryL=line+tok;if(mctx.measureText(tryL).width/10<=maxW){line=tryL;continue}
      if(line.trim()){out.push(line.trim());line=''}let w=tok.trim();while(mctx.measureText(w).width/10>maxW&&w.length>1){let i=w.length;while(i>1&&mctx.measureText(w.slice(0,i)).width/10>maxW)i--;out.push(w.slice(0,i));w=w.slice(i)}line=w}
    if(line.trim())out.push(line.trim())});return maxLines&&out.length>maxLines?out.slice(0,maxLines-1).concat(out[maxLines-1]+'…'):out}
function fit(text,font,size,maxW,maxLines,min){let s=size,l=wrap(text,font,s,maxW);while(l.length>maxLines&&s>min){s*=.92;l=wrap(text,font,s,maxW)}return{s,l:l.slice(0,maxLines)}}
function layout(D){const P=PAL[D.pal]||PAL[0],hf=FONTS[D.font][1],bf=FONTS[1][1],pr=[],T=(x,y,txt,size,o={})=>pr.push({k:'t',x,y,txt,size,font:o.font||bf,fill:o.fill||P.fg,anchor:o.anchor||'start',weight:o.weight||400,rot:o.rot||0,ls:o.ls||0}),R=(x,y,w,h,fill,o={})=>pr.push({k:'r',x,y,w,h,fill,stroke:o.stroke,sw:o.sw,dash:o.dash}),brand='더숲 '+brN(D.br==='all'?'aka':D.br);
  if(D.kind==='band'){const w=D.bf*2+D.bw*2+D.bs,h=D.bh,xf=D.bf+D.bw+D.bs;R(0,0,w,h,P.bg);R(0,0,w,2.2,P.ac);R(0,h-2.2,w,2.2,P.ac);[D.bf,D.bf+D.bw,xf,xf+D.bw].forEach(x=>R(x,0,.2,h,'none',{stroke:P.fg,sw:.15,dash:'1 1.5'}));
    const H=fit(D.head||'띠지 문구를 적어 주세요',hf,h*.2,D.bw-16,2,5);let y=h*.5-(H.l.length-1)*H.s*.6-(D.body?h*.07:0);H.l.forEach(l=>{T(xf+D.bw/2,y,l,H.s,{font:hf,anchor:'middle',weight:700});y+=H.s*1.2});
    if(D.body)wrap(D.body,bf,h*.075,D.bw-18,2).forEach(l=>{T(xf+D.bw/2,y+h*.02,l,h*.075,{anchor:'middle'});y+=h*.1});
    T(xf+D.bw/2,h*.2,D.tag||'',h*.065,{anchor:'middle',fill:P.ac,weight:600,ls:.3});T(D.bf+D.bw+D.bs/2,h/2,(D.tag||brand).slice(0,14),Math.min(D.bs*.42,h*.08),{anchor:'middle',rot:90,weight:600});
    wrap(D.book?`『${D.book}』 ${D.author||''}`:brand,bf,h*.07,D.bw-20,3).forEach((l,i)=>T(D.bf+D.bw/2,h*.42+i*h*.1,l,h*.07,{anchor:'middle'}));T(D.bf/2,h/2+1,brand,h*.06,{anchor:'middle',fill:P.ac});T(w-D.bf/2,h/2+1,'theforest',h*.06,{anchor:'middle',fill:P.ac});return{w,h,pr}}
  const [,w,h]=SIZES[D.kind][D.size]||SIZES[D.kind][0],m=w*.09;R(0,0,w,h,P.bg);
  if(D.kind==='shelf'){R(0,0,w*.035,h,P.ac);const H=fit(D.head||'매대 이름',hf,h*.3,w-m*2.4,2,6);let y=h*.5-(H.l.length-1)*H.s*.55+(D.body?-h*.06:H.s*.3);if(D.tag)T(m*1.4,h*.2,D.tag,h*.085,{fill:P.ac,weight:600,ls:.3});H.l.forEach(l=>{T(m*1.4,y,l,H.s,{font:hf,weight:700});y+=H.s*1.15});
    if(D.body)wrap(D.body,bf,h*.09,w-m*2.6,2).forEach(l=>{T(m*1.4,y,l,h*.09);y+=h*.125});T(w-m*.6,h-m*.55,brand,h*.07,{anchor:'end',fill:P.ac});return{w,h,pr}}
  R(m*.5,m*.5,w-m,h-m,'none',{stroke:P.ac,sw:.5});let y=m*1.9;if(D.tag){T(m*1.3,y,D.tag,w*.042,{fill:P.ac,weight:600,ls:.4});y+=w*.05}
  const H=fit(D.head||'여기에 큰 문구',hf,w*.125,w-m*2.6,4,w*.07);y+=H.s*.95;H.l.forEach(l=>{T(m*1.3,y,l,H.s,{font:hf,weight:700});y+=H.s*1.22});
  y+=w*.01;R(m*1.3,y-H.s*.6,w*.14,.9,P.ac);y+=w*.06;const bs=w*.05,room=Math.max(2,Math.floor((h-m*4.2-y)/(bs*1.55)));wrap(D.body||'',bf,bs,w-m*2.6,room).forEach(l=>{T(m*1.3,y,l,bs);y+=bs*1.55});
  let by=h-m*1.5;if(D.price){T(w-m*1.3,by,D.price,w*.06,{anchor:'end',font:hf,weight:700,fill:P.ac})}
  if(D.book){const bl=wrap(`『${D.book}』`,bf,w*.046,w-m*2.6-(D.price?w*.24:0),2);if(D.author)T(m*1.3,by,D.author,w*.034);bl.slice().reverse().forEach((l,i)=>T(m*1.3,by-(D.author?w*.055:0)-i*w*.06,l,w*.046,{weight:600}))}
  T(w-m*1.3,m*1.35,brand,w*.03,{anchor:'end',fill:P.ac});return{w,h,pr}}
function toSVG(L){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.w} ${L.h}" width="${Math.min(L.w*3.4,900)}">${L.pr.map(p=>p.k==='r'?`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${p.fill}" ${p.stroke?`stroke="${p.stroke}" stroke-width="${p.sw}" ${p.dash?`stroke-dasharray="${p.dash}"`:''}`:''}/>`:`<text x="${p.x}" y="${p.y}" text-anchor="${p.anchor}" ${p.rot?`transform="rotate(${p.rot} ${p.x} ${p.y})" dominant-baseline="middle"`:''} style="font-family:${p.font.replace(/"/g,"'")};font-size:${p.size}px;font-weight:${p.weight};fill:${p.fill};letter-spacing:${p.ls}px">${esc(p.txt)}</text>`).join('')}</svg>`}
function toPNG(L){const k=300/25.4,c=document.createElement('canvas');c.width=Math.round(L.w*k);c.height=Math.round(L.h*k);const x=c.getContext('2d');x.scale(k,k);L.pr.forEach(p=>{if(p.k==='r'){if(p.fill&&p.fill!=='none'){x.fillStyle=p.fill;x.fillRect(p.x,p.y,p.w,p.h)}if(p.stroke){x.strokeStyle=p.stroke;x.lineWidth=p.sw;x.setLineDash(p.dash?p.dash.split(' ').map(Number):[]);x.strokeRect(p.x,p.y,p.w,p.h);x.setLineDash([])}}
    else{x.save();x.font=`${p.weight} ${p.size}px ${p.font}`;x.fillStyle=p.fill;x.textAlign={start:'left',middle:'center',end:'right'}[p.anchor];try{x.letterSpacing=p.ls+'px'}catch(e){}if(p.rot){x.translate(p.x,p.y);x.rotate(p.rot*Math.PI/180);x.textBaseline='middle';x.fillText(p.txt,0,0)}else x.fillText(p.txt,p.x,p.y);x.restore()}});return new Promise(r=>c.toBlob(r,'image/png'))}
V.store.design=()=>{const D=S.ui.D=S.ui.D||defD(),L=layout(D),sz=SIZES[D.kind],F=(id,label,k,ph,ta)=>`<div class="fld"><label for="${id}">${label}</label>${ta?`<textarea id="${id}" rows="3" data-c="dSet" data-k="${k}" placeholder="${ph}">${esc(D[k])}</textarea>`:`<input type="text" id="${id}" data-c="dSet" data-k="${k}" value="${esc(D[k])}" placeholder="${ph}">`}</div>`;
  return `<div class="sec"><h2>POP · 띠지 디자인</h2><p>글만 넣으면 바로 인쇄할 수 있는 그림 파일이 됩니다 (300dpi)</p></div>
  <div class="grid g2" style="align-items:start"><div class="card form">
    <div class="chips">${KINDS.map(([k,l])=>`<button class="chip" data-a="dKind" data-k="${k}" aria-pressed="${D.kind===k}">${l}</button>`).join('')}</div>
    ${sz.length>1?`<div class="fld"><label>크기</label><div class="chips">${sz.map(([n,w,h],i)=>`<button class="chip" data-a="dPick" data-k="size" data-v="${i}" aria-pressed="${D.size===i}">${n} ${w}×${h}mm</button>`).join('')}</div></div>`:''}
    ${D.kind==='band'?`<div class="grid g4">${[['bw','책 가로'],['bs','책등 두께'],['bf','날개'],['bh','띠지 높이']].map(([k,l])=>`<div class="fld"><label for="d_${k}">${l} (mm)</label><input type="number" id="d_${k}" data-c="dNum" data-k="${k}" value="${D[k]}" min="5" max="400"></div>`).join('')}</div><p class="note">전체 길이 ${D.bf*2+D.bw*2+D.bs}mm. 점선은 접는 자리입니다 (날개 · 뒤 · 책등 · 앞 · 날개).</p>`:''}
    ${D.books&&D.books.length>1?`<div class="fld"><label>주제 속 책으로 바꾸기</label><div class="chips">${D.books.slice(0,10).map((b,i)=>`<button class="chip" data-a="dBook" data-i="${i}" aria-pressed="${D.book===b.t}">${esc(b.t.length>12?b.t.slice(0,12)+'…':b.t)}</button>`).join('')}</div></div>`:''}
    ${F('dTag','작은 머리말','tag','예: 더숲의 추천 · 11월의 문학')}${F('dHead',D.kind==='shelf'?'매대 이름':'큰 문구','head','예: 긴 밤에는 긴 소설을')}${F('dBody',D.kind==='shelf'?'한 줄 설명':'소개 글','body','손님에게 건네는 두세 문장',true)}
    ${D.kind==='shelf'?'':`<div class="f2">${F('dBook','책 이름','book','예: 가호')}${F('dAuth','저자 · 출판사','author','예: 무라카미 하루키 · 문학동네')}</div>`}${D.kind==='pop'?F('dPrice','값 (비워도 됨)','price','예: 16,800원'):''}
    <div class="btns">${busyBtn('copy','문구 추천받기','dCopy')}</div>
    ${(S.ui.copies||[]).length?`<div class="list">${S.ui.copies.map((c,i)=>`<div class="li"><div class="t"><b>${esc(c.head)}</b><small>${esc(c.body)}</small></div><button class="btn sm" data-a="dUse" data-i="${i}">쓰기</button></div>`).join('')}</div>`:''}
    <div class="fld"><label>색</label><div class="btns">${PAL.map((p,i)=>`<button class="sw" data-a="dPick" data-k="pal" data-v="${i}" aria-pressed="${D.pal===i}" aria-label="${p.n}" title="${p.n}" style="background:linear-gradient(135deg,${p.bg} 60%,${p.ac} 60%)"></button>`).join('')}</div></div>
    <div class="fld"><label>큰 글씨 모양</label><div class="chips">${FONTS.map(([n,f],i)=>`<button class="chip" data-a="dPick" data-k="font" data-v="${i}" aria-pressed="${D.font===i}" style="font-family:${f.replace(/"/g,"'")}">${n}</button>`).join('')}</div></div></div>
   <div class="grid"><div class="stage" id="stage">${toSVG(L)}</div>
    <div class="btns"><button class="btn pri" data-a="dPng">인쇄용 그림 받기 (PNG)</button><button class="btn" data-a="dNew">새로 만들기</button><span class="note">${Math.round(L.w)}×${Math.round(L.h)}mm · 프린터에서 「실제 크기」로 인쇄하세요</span></div></div></div>`};
V.aka.design=V.store.design;
function dRefresh(){const s=$('stage');if(s)s.innerHTML=toSVG(layout(S.ui.D))}
C.dSet=(el,d)=>{S.ui.D[d.k]=el.value;dRefresh()};
C.dNum=(el,d)=>{S.ui.D[d.k]=Math.max(5,Math.min(400,+el.value||5));render()};
document.addEventListener('input',e=>{const el=e.target.closest&&e.target.closest('[data-c="dSet"]');if(el){S.ui.D[el.dataset.k]=el.value;dRefresh()}});
A.dKind=d=>{S.ui.D.kind=d.k;S.ui.D.size=0;render()};A.dPick=d=>{S.ui.D[d.k]=+d.v;render()};A.dNew=()=>{S.ui.D=defD();S.ui.copies=[];render()};
A.dBook=d=>{const b=S.ui.D.books[+d.i];S.ui.D.book=b.t;S.ui.D.author=[b.a,b.p].filter(Boolean).join(' · ');render()};
A.dUse=d=>{const c=S.ui.copies[+d.i];S.ui.D.head=c.head;S.ui.D.body=c.body;render()};
A.dCopy=async()=>{const D=S.ui.D,lim=D.kind==='band'?'head 22자 이내, body 30자 이내':D.kind==='shelf'?'head 12자 이내(매대 이름), body 28자 이내':'head 18자 이내, body 70자 이내';
  const out=await ask('copy',`독립서점 "더숲"의 ${KINDS.find(k=>k[0]===D.kind)[1]}에 넣을 문구를 서로 다른 말투로 4개 써 주세요.\n주제/머리말: ${D.tag||'없음'}\n책: ${D.book||'특정 책 없음'} ${D.author||''}\n지금 적어 둔 문구: ${D.head||'없음'} / ${D.body||'없음'}\n오늘: ${TODAY}\n규칙: ${lim}. 손님에게 건네는 말투. 과장·최상급 금지. 책의 줄거리나 수상 이력 등 확실하지 않은 사실은 쓰지 마세요.\nJSON 배열로만: [{"head":"","body":""}]`,{modelTier:'quick'});
  if(out)S.ui.copies=(Array.isArray(out)?out:[]).filter(c=>c&&c.head).slice(0,4)};
A.dPng=async()=>{try{if(document.fonts&&document.fonts.ready)await document.fonts.ready}catch(e){}const D=S.ui.D,blob=await toPNG(layout(D));if(!blob){toast('그림을 만들지 못했습니다');return}await saveFile(`더숲_${KINDS.find(k=>k[0]===D.kind)[1]}_${(D.head||D.book||'디자인').replace(/[\\/:*?"<>|\s]+/g,'_').slice(0,20)}.png`,blob)};
