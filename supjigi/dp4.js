'use strict';
/* 더숲 워크룸 — 홈의 가이드 · 교육자료 버튼, 들어올 때 가이드 / 진열: 종수에 따라 평대 크기, 책 고르기(최대 10종), 오브제 켜고 끄기, 끌어서 옮기기 */

/* ── 홈 위쪽 버튼: 가이드 · 교육자료 ── */
A.edOpen=()=>{A.gdOpen();A.gdTab({t:'b'})};
(()=>{const r=render;render=function(){r.apply(this,arguments);try{
  const mn=document.querySelector('main');if(!mn||S.locked)return;
  const home=S.view[S.mode]===TABS[S.mode][0][0];
  if(home&&!mn.querySelector('.gdtop')){const b=document.createElement('div');b.className='gdtop';
    b.innerHTML=`<button class="btn sm" data-a="gdOpen">가이드</button><button class="btn sm" data-a="edOpen">교육자료</button>`;mn.prepend(b)}
  let seen=null;try{seen=sessionStorage.getItem('sj.gdS')}catch(e){}
  if(!seen&&S.loaded){try{sessionStorage.setItem('sj.gdS','1')}catch(e){}if(!$('guide'))A.gdOpen()}
}catch(e){}}})();

/* ── 진열 ── */
const DPSZ2=n=>n<=3?[600,600]:n<=6?[900,900]:[1200,900];
const dpKey=t=>(t&&t.title)||'';
const DPOBJ=[['pop','POP'],['card','이름표'],['vase','꽃병'],['note','손글씨 쪽지']];
function dpPick(t){const all=(t.books||[]).slice(0,10),P=S.ui.dpPick||{},k=dpKey(t);let L=P[k];if(!Array.isArray(L))L=all.map((_,i)=>i).slice(0,Math.min(6,all.length));return L.filter(i=>i<all.length)}
function dpPicked(t){const all=(t.books||[]).slice(0,10);return{...t,books:dpPick(t).map(i=>all[i])}}
(()=>{const g=dpPlan;dpPlan=function(t,m){const md=m==null?(S.ui.dpM||0):m,T=dpPicked(t),P=g(T,md),n=(T.books||[]).length,[W,D]=DPSZ2(n),sx=(W-150)/750,sy=(D-230)/670;
  P.W=W;P.D=D;const ob=S.ui.dpObj||{};
  let it=P.it.filter(i=>i.k==='table'||!(i.k in ob)||ob[i.k]!==false).map(i=>{if(i.k==='table')return i;const o={...i,x:Math.round(i.x*sx),y:Math.round(i.y*sy)};if(i.k==='card'){o.x=Math.round(W/2-45);o.y=D-40}return o});
  if(ob.vase===true&&!it.some(i=>i.k==='vase'))it.push({k:'vase',x:40,y:Math.round(120*sy)});
  if(ob.note===true&&!it.some(i=>i.k==='note'))it.push({k:'note',x:W-180,y:D-110});
  const ov=(S.ui.dpPos||{})[dpKey(t)+'|'+md]||{};
  it.forEach(i=>{if(i.k==='table')return;const id=(i.k==='stack'||i.k==='face')?'b'+i.n:i.k,d=ov[id];if(d){i.x+=d[0];i.y+=d[1]}
    if(i.k==='stack'){i.x=Math.max(0,Math.min(W-i.w,i.x));i.y=Math.max(0,Math.min(D-i.d,i.y))}});
  P.it=it;return P}})();
(()=>{const h=shelfPlan;shelfPlan=function(t,m){return h(dpPicked(t),m)}})();

/* 위에서 본 배치 — 끌어서 옮긴다 */
function dpTop(P){const W=P.W,D=P.D,F='font-family:Pretendard,sans-serif';let s=`<rect x="0" y="0" width="${W}" height="${D}" fill="#e8dcc0" stroke="#b9a67f" stroke-width="6"/>`;
  for(let v=150;v<W;v+=150)s+=`<line x1="${v}" y1="0" x2="${v}" y2="${D}" stroke="#d4c49f" stroke-width="2"/>`;
  const seen={};(P.it||[]).forEach(i=>{if(i.k==='table')return;
    if(i.k==='stack'||i.k==='face'){const id='b'+i.n;if(i.k==='stack'){const fc=P.it.find(x=>x.k==='face'&&x.n===i.n),ttl=((P.rows.find(r=>r.n===i.n)||{}).b||{}).t||'',q=Math.max(1,Math.round(i.h/20));
        s+=`<g class="dpg" data-id="${id}">${fc?`<rect x="${fc.x}" y="${i.y-26}" width="150" height="22" fill="${i.c}" opacity=".55"/>`:''}<rect x="${i.x}" y="${i.y}" width="${i.w}" height="${i.d}" rx="4" fill="${i.c}" stroke="#fff" stroke-width="3"/><circle cx="${i.x+i.w/2}" cy="${i.y+70}" r="34" fill="#fff"/><text x="${i.x+i.w/2}" y="${i.y+82}" text-anchor="middle" style="${F};font-size:34px;font-weight:800;fill:#1f2a24">${i.n}</text><text x="${i.x+i.w/2}" y="${i.y+150}" text-anchor="middle" style="${F};font-size:24px;font-weight:700;fill:#fff">${q}권${fc?' · 세움':''}</text><title>${esc(ttl)}</title></g>`}return}
    if(seen[i.k])return;seen[i.k]=1;
    if(i.k==='pop')s+=`<g class="dpg" data-id="pop"><rect x="${i.x}" y="${i.y}" width="210" height="40" fill="#fff" stroke="#1f2a44" stroke-width="3"/><text x="${i.x+105}" y="${i.y+30}" text-anchor="middle" style="${F};font-size:26px;font-weight:800;fill:#1f2a44">POP</text></g>`;
    if(i.k==='card')s+=`<g class="dpg" data-id="card"><rect x="${i.x}" y="${i.y}" width="90" height="34" fill="#fff" stroke="#b9a67f" stroke-width="3"/><text x="${i.x+45}" y="${i.y+25}" text-anchor="middle" style="${F};font-size:18px;font-weight:700;fill:#003128">이름표</text></g>`;
    if(i.k==='vase')s+=`<g class="dpg" data-id="vase"><circle cx="${i.x+30}" cy="${i.y+30}" r="34" fill="#cfd8d2" stroke="#6f8a6c" stroke-width="3"/><text x="${i.x+30}" y="${i.y+38}" text-anchor="middle" style="${F};font-size:20px;font-weight:700;fill:#3f5a3c">꽃병</text></g>`;
    if(i.k==='note')s+=`<g class="dpg" data-id="note"><rect x="${i.x-46}" y="${i.y-30}" width="92" height="60" fill="#fffdf6" stroke="#d8cfb8" stroke-width="3"/><text x="${i.x}" y="${i.y+8}" text-anchor="middle" style="${F};font-size:18px;font-weight:700;fill:#9a8760">쪽지</text></g>`});
  s+=`<text x="${W/2}" y="${D+50}" text-anchor="middle" style="${F};font-size:28px;font-weight:700;fill:#5b6a61">손님이 서는 쪽 · ${W/10}×${D/10}cm</text>`;
  return `<svg id="dpTop" xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 ${W+40} ${D+90}" style="width:100%;max-width:${W>900?560:420}px;height:auto;touch-action:none;display:block;margin:0 auto">${s}</svg>`}

(()=>{const f=A.dpOpen;A.dpOpen=d=>{f(d);const st=$('dpStage');if(!st)return;const t=(S.ui.cor||[])[S.ui.dp.i];if(!t)return;const fx=S.ui.dpF||0,md=S.ui.dpM||0,all=(t.books||[]).slice(0,10),pk=dpPick(t),ob=S.ui.dpObj||{},P=fx?null:dpPlan(t,md);
  const has=k=>P?P.it.some(i=>i.k===k):false;
  const box=document.createElement('div');box.className='dpe';
  box.innerHTML=`<h4>진열할 책 고르기 <small>${pk.length} / ${all.length}종 · 고르는 대로 ${fx?'서가':'평대 크기와 배치'}가 바뀝니다</small></h4>
   <div class="dppk">${all.map((b,i)=>`<button class="mrow" data-a="dpPk" data-i="${i}" aria-pressed="${pk.includes(i)}"><span><b>${pk.includes(i)?'☑':'☐'} ${esc(b.t)}</b><small>${esc(b.a||'')}</small></span></button>`).join('')}</div>
   ${fx?'':`<h4>오브제 <small>눌러서 보이기 · 숨기기</small></h4><div class="chips">${DPOBJ.map(([k,n])=>`<button class="chip" data-a="dpOb" data-k="${k}" aria-pressed="${has(k)}">${n}</button>`).join('')}</div>
   <h4>배치 옮기기 <small>위에서 본 그림 · 책이나 POP 을 손가락이나 마우스로 끌어 옮기면 위 그림이 바로 바뀝니다</small></h4>${dpTop(P)}
   <div class="btns" style="justify-content:center"><button class="btn sm ghost" data-a="dpReset">처음 배치로</button></div>`}`;
  st.after(box);dpDrag()}})();
A.dpPk=d=>{const t=S.ui.cor[S.ui.dp.i];let L=dpPick(t);const i=+d.i;L=L.includes(i)?L.filter(x=>x!==i):[...L,i].sort((a,b)=>a-b);if(!L.length){toast('한 권은 남겨 두어야 합니다');return}
  S.ui.dpPick={...(S.ui.dpPick||{}),[dpKey(t)]:L};const ps=S.ui.dpPos||{};Object.keys(ps).forEach(k=>{if(k.startsWith(dpKey(t)+'|'))delete ps[k]});A.dpOpen({i:S.ui.dp.i})};
A.dpOb=d=>{const t=S.ui.cor[S.ui.dp.i],P=dpPlan(t,S.ui.dpM||0),on=P.it.some(i=>i.k===d.k);S.ui.dpObj={...(S.ui.dpObj||{}),[d.k]:!on};A.dpOpen({i:S.ui.dp.i})};
A.dpReset=()=>{const t=S.ui.cor[S.ui.dp.i],ps=S.ui.dpPos||{};delete ps[dpKey(t)+'|'+(S.ui.dpM||0)];S.ui.dpPos=ps;A.dpOpen({i:S.ui.dp.i})};
function dpDrag(){const sv=$('dpTop');if(!sv)return;let g=null,p0=null,dx=0,dy=0;
  const pt=e=>{const m=sv.getScreenCTM();return m?[(e.clientX-m.e)/m.a,(e.clientY-m.f)/m.d]:[0,0]};
  sv.addEventListener('pointerdown',e=>{const el=e.target.closest('.dpg');if(!el)return;g=el;p0=pt(e);dx=dy=0;sv.setPointerCapture(e.pointerId);g.style.opacity='.75';e.preventDefault()});
  sv.addEventListener('pointermove',e=>{if(!g)return;const p=pt(e);dx=p[0]-p0[0];dy=p[1]-p0[1];g.setAttribute('transform',`translate(${dx} ${dy})`)});
  const end=()=>{if(!g)return;const id=g.dataset.id,el=g;g=null;el.style.opacity='';if(Math.abs(dx)<3&&Math.abs(dy)<3){el.removeAttribute('transform');return}
    const t=S.ui.cor[S.ui.dp.i],k=dpKey(t)+'|'+(S.ui.dpM||0),ps=S.ui.dpPos||{},o=ps[k]||{},c=o[id]||[0,0];o[id]=[Math.round(c[0]+dx),Math.round(c[1]+dy)];ps[k]=o;S.ui.dpPos=ps;
    const y=(document.querySelector('.sheetbox,#sheetBox')||{}).scrollTop;A.dpOpen({i:S.ui.dp.i});const sb=$('sheetBox');if(sb&&y!=null)sb.scrollTop=y};
  sv.addEventListener('pointerup',end);sv.addEventListener('pointercancel',end)}
