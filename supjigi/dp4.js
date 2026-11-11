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
const DPOBJ=[['pop','POP'],['card','이름표'],['show','쇼카드'],['band','띠지'],['vase','꽃병'],['note','손글씨 쪽지']];
function dpPick(t){const all=(t.books||[]).slice(0,10),P=S.ui.dpPick||{},k=dpKey(t);let L=P[k];if(!Array.isArray(L))L=all.map((_,i)=>i).slice(0,Math.min(6,all.length));return L.filter(i=>i<all.length)}
function dpPicked(t){const all=(t.books||[]).slice(0,10);return{...t,books:dpPick(t).map(i=>all[i])}}
const dpPosK=t=>dpKey(t)+'|'+(S.ui.dpM||0);
function dpBuild(g,t,md,tmp){const pk=dpPick(t),T=dpPicked(t),P=g(T,md),n=(T.books||[]).length,[W,D]=(S.ui.dpSzO&&typeof lvNow==='function'&&lvNow()>=3)?S.ui.dpSzO:DPSZ2(n),sx=(W-150)/750,sy=(D-230)/670;
  P.W=W;P.D=D;P.pk=pk;const ob=S.ui.dpObj||{};
  let it=P.it.filter(i=>i.k==='table'||!(i.k in ob)||ob[i.k]!==false).map(i=>{if(i.k==='table')return i;const o={...i,x:Math.round(i.x*sx),y:Math.round(i.y*sy)};if(i.k==='card'){o.x=Math.round(W/2-45);o.y=D-40}return o});
  if(ob.vase===true&&!it.some(i=>i.k==='vase'))it.push({k:'vase',x:40,y:Math.round(120*sy)});
  if(ob.note===true&&!it.some(i=>i.k==='note'))it.push({k:'note',x:W-180,y:D-110});
  const ov={...((S.ui.dpAbs||{})[dpPosK(t)]||{}),...(tmp||{})};
  it.forEach(i=>{if(i.k!=='stack')return;i.id='k'+pk[i.n-1];const a=ov[i.id];if(!a)return;const nx=Math.max(0,Math.min(W-i.w,a[0])),ny=Math.max(0,Math.min(D-i.d,a[1])),dx=nx-i.x,dy=ny-i.y;
    it.forEach(f=>{if(f.k==='face'&&f.n===i.n){f.x+=dx;f.y+=dy}});i.x=nx;i.y=ny});
  it.forEach(i=>{if(i.k==='face'||i.k==='stack'||i.k==='table')return;i.id=i.k;const a=ov[i.id];if(a){i.x=Math.max(0,Math.min(W-60,a[0]));i.y=Math.max(0,Math.min(D-30,a[1]))}});
  /* 비정형: 더미마다 조금씩 틀어 놓는다. 메인 책: 세우고 높게, 설명은 쇼카드 · 띠지로 */
  const free=S.ui.dpFree!==false,mi=(S.ui.dpMain||{})[dpKey(t)];
  it.forEach(i=>{if(i.k!=='stack')return;const bi=+i.id.slice(1);i.rot=free?(((bi*47+i.n*13)%21)-10)*Math.PI/180:0;
    if(mi===bi){i.main=true;i.rot=0;i.h=Math.max(i.h,80);if(ob.band)i.band=true;if(!it.some(f=>f.k==='face'&&f.n===i.n))it.push({k:'face',x:i.x,y:Math.max(0,i.y-45),c:i.c,n:i.n});
      if(ob.show)it.push({k:'show',id:'show',x:Math.min(W-110,i.x+i.w+18),y:Math.min(D-20,i.y+i.d-30)});const r=P.rows.find(r=>r.n===i.n);if(r){r.qty=Math.round(i.h/20)+1;r.place='메인 — 한 권 세우고 '+Math.round(i.h/20)+'권 높이로. 설명은 쇼카드 · 띠지로'}}});
  {const a=ov.show,sh=it.find(i=>i.k==='show');if(a&&sh){sh.x=a[0];sh.y=a[1]}}
  P.total=P.rows.reduce((a,r)=>a+r.qty,0);P.main=mi;
  const Q=(S.ui.dpQ||{})[dpPosK(t)]||{};it.forEach(i=>{if(i.k==='stack'&&Q[i.id]){i.h=Q[i.id]*20;const r=P.rows.find(r=>r.n===i.n);if(r)r.qty=Q[i.id]+(it.some(f=>f.k==='face'&&f.n===i.n)?1:0)}});P.total=P.rows.reduce((a,r)=>a+r.qty,0);
  P.it=it;return P}
let dpG0=null;
(()=>{const g=dpPlan;dpG0=g;dpPlan=function(t,m){return dpBuild(g,t,m==null?(S.ui.dpM||0):m)}})();
(()=>{const h=shelfPlan;shelfPlan=function(t,m){return h(dpPicked(t),m)}})();

/* 위에서 본 배치 */
function dpTop(P){const W=P.W,D=P.D,F='font-family:Pretendard,sans-serif';let s=`<rect x="0" y="0" width="${W}" height="${D}" fill="#e8dcc0" stroke="#b9a67f" stroke-width="6"/>`;
  for(let v=150;v<W;v+=150)s+=`<line x1="${v}" y1="0" x2="${v}" y2="${D}" stroke="#d4c49f" stroke-width="2"/>`;
  const seen={};(P.it||[]).forEach(i=>{if(i.k==='table'||i.k==='face')return;
    if(i.k==='stack'){const fc=P.it.find(x=>x.k==='face'&&x.n===i.n),ttl=((P.rows.find(r=>r.n===i.n)||{}).b||{}).t||'',q=Math.max(1,Math.round(i.h/20));
      s+=`<g class="dpg" data-id="${i.id}" data-x="${i.x}" data-y="${i.y}"><g transform="rotate(${((i.rot||0)*180/Math.PI).toFixed(1)} ${i.x+i.w/2} ${i.y+i.d/2})">${i.main?`<rect x="${i.x-8}" y="${i.y-8}" width="${i.w+16}" height="${i.d+16}" rx="6" fill="none" stroke="#c9a24a" stroke-width="8"/>`:''}${fc?`<rect x="${i.x}" y="${i.y-26}" width="150" height="22" fill="${i.c}" opacity=".55"/>`:''}<rect x="${i.x}" y="${i.y}" width="${i.w}" height="${i.d}" rx="4" fill="${i.c}" stroke="#fff" stroke-width="3"/><circle cx="${i.x+i.w/2}" cy="${i.y+70}" r="34" fill="#fff"/><text x="${i.x+i.w/2}" y="${i.y+82}" text-anchor="middle" style="${F};font-size:34px;font-weight:800;fill:#1f2a24">${i.n}</text><text x="${i.x+i.w/2}" y="${i.y+150}" text-anchor="middle" style="${F};font-size:24px;font-weight:700;fill:#fff">${i.main?'메인 · ':''}${q}권${fc&&!i.main?' · 세움':''}</text></g><title>${esc(ttl)}</title></g>`;return}
    if(seen[i.k])return;seen[i.k]=1;const G=b=>`<g class="dpg" data-id="${i.k}" data-x="${i.x}" data-y="${i.y}">${b}</g>`;
    if(i.k==='pop')s+=G(`<rect x="${i.x}" y="${i.y}" width="210" height="40" fill="#fff" stroke="#1f2a44" stroke-width="3"/><text x="${i.x+105}" y="${i.y+30}" text-anchor="middle" style="${F};font-size:26px;font-weight:800;fill:#1f2a44">POP</text>`);
    if(i.k==='card')s+=G(`<rect x="${i.x}" y="${i.y}" width="90" height="34" fill="#fff" stroke="#b9a67f" stroke-width="3"/><text x="${i.x+45}" y="${i.y+25}" text-anchor="middle" style="${F};font-size:18px;font-weight:700;fill:#003128">이름표</text>`);
    if(i.k==='show')s+=G(`<rect x="${i.x}" y="${i.y}" width="105" height="30" fill="#fffdf6" stroke="#7d3a2b" stroke-width="3"/><text x="${i.x+52}" y="${i.y+22}" text-anchor="middle" style="${F};font-size:17px;font-weight:700;fill:#7d3a2b">쇼카드</text>`);
    if(i.k==='vase')s+=G(`<circle cx="${i.x+30}" cy="${i.y+30}" r="34" fill="#cfd8d2" stroke="#6f8a6c" stroke-width="3"/><text x="${i.x+30}" y="${i.y+38}" text-anchor="middle" style="${F};font-size:20px;font-weight:700;fill:#3f5a3c">꽃병</text>`);
    if(i.k==='note')s+=G(`<rect x="${i.x-46}" y="${i.y-30}" width="92" height="60" fill="#fffdf6" stroke="#d8cfb8" stroke-width="3"/><text x="${i.x}" y="${i.y+8}" text-anchor="middle" style="${F};font-size:18px;font-weight:700;fill:#9a8760">쪽지</text>`)});
  s+=`<text x="${W/2}" y="${D+50}" text-anchor="middle" style="${F};font-size:28px;font-weight:700;fill:#5b6a61">손님 쪽 · ${W/10}×${D/10}cm</text>`;
  return `<svg id="dpTop" xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 ${W+40} ${D+90}" style="width:100%;height:auto;touch-action:none;display:block">${s}</svg>`}

(()=>{const f=A.dpOpen;A.dpOpen=d=>{S.ui.dp3=false;f(d);const b3=document.querySelector('#sheetBox [data-a="dp3"]');if(b3)b3.remove();const st=$('dpStage');if(!st)return;const t=(S.ui.cor||[])[S.ui.dp.i];if(!t)return;const fx=S.ui.dpF||0,md=S.ui.dpM||0,all=(t.books||[]).slice(0,10),pk=dpPick(t),P=fx?null:dpPlan(t,md);
  const has=k=>k==='band'||k==='show'?!!(S.ui.dpObj||{})[k]:(P?P.it.some(i=>i.k===k):false);
  const box=document.createElement('div');box.className='dpe';
  const chip=(b,i)=>`<span class="dpbk${pk.includes(i)?' on':''}" data-i="${i}" title="${esc(b.t)}">${pk.includes(i)?'<em>'+(pk.indexOf(i)+1)+'</em>':'+'} ${esc(b.t.replace(/\s*[\(\[].*$/,''))}</span>`;
  box.innerHTML=fx?`<h4>진열할 책 <small>눌러서 넣고 빼기 · ${pk.length}/${all.length}종</small></h4><div class="dpbks">${all.map(chip).join('')}</div>`
   :`<p class="dphow"><b>돌리고</b> 3D를 끌면 빙글 · <b>옮기고</b> 평면 그림에서 책을 끌면 3D가 따라옵니다 · <b>넣고 빼고</b> 아래 책을 평면으로 끌어 넣고, 밖으로 끌어내면 뺍니다 · <b>메인</b> 평면에서 책을 두 번 누르기 · <b>말로</b> 「3번 맨 앞으로」 · <b>영상</b> 한 바퀴 돌며 저장</p>
   <div class="dpcmd"><input id="dpCmd" placeholder="말로 옮기기 · 예: 3번 맨 앞으로 · 코스모스 빼 · 한 바퀴" autocomplete="off">${typeof micBtn==='function'?micBtn('dpCmd'):''}<button class="btn sm pri" data-a="dpCmd">하기</button></div><div class="dpv"><div><div id="dpV3"></div></div><div><div class="dptw">${dpTop(P)}</div></div></div>
   <div class="dpbks" id="dpBks">${all.map(chip).join('')}</div>
   <div class="chips" style="margin-top:10px"><span class="note">오브제</span>${DPOBJ.map(([k,n])=>`<button class="chip" data-a="dpOb" data-k="${k}" aria-pressed="${has(k)}">${n}</button>`).join('')}<button class="chip" data-a="dpReset">처음 배치로</button></div><div class="chips" style="margin-top:6px"><span class="note">놓는 결</span><button class="chip" data-a="dpFreeT" data-v="1" aria-pressed="${S.ui.dpFree!==false}">비정형</button><button class="chip" data-a="dpFreeT" data-v="0" aria-pressed="${S.ui.dpFree===false}">가지런히</button><span class="note">${P.main!=null&&pk.includes(P.main)?`메인 「${esc(all[P.main].t.replace(/\s*[\(\[].*$/,''))}」 · 쇼카드 · 띠지를 켜면 메인 곁에 놓입니다`:'평면 그림에서 책을 두 번 누르면 메인 책이 됩니다'}</span></div>`;
  st.after(box);if(!fx&&typeof D3C!=='undefined')D3C.mount($('dpV3'),P);dpDrag(t)}})();
A.dpPk=d=>{const t=S.ui.cor[S.ui.dp.i];let L=dpPick(t);const i=+d.i;L=L.includes(i)?L.filter(x=>x!==i):[...L,i].sort((a,b)=>a-b);if(!L.length){toast('한 권은 남겨 두어야 합니다');return false}
  S.ui.dpPick={...(S.ui.dpPick||{}),[dpKey(t)]:L};return true};
A.dpFreeT=d=>{S.ui.dpFree=d.v==='1';dpRe()};
A.dpMainSet=d=>{const t=S.ui.cor[S.ui.dp.i],k=dpKey(t),M={...(S.ui.dpMain||{})},bi=+String(d.id).slice(1);if(M[k]===bi){delete M[k];toast('메인을 풀었습니다')}else{M[k]=bi;S.ui.dpObj={show:true,band:true,...(S.ui.dpObj||{})};toast('메인 책으로 세웠습니다. 설명은 쇼카드 · 띠지로')}S.ui.dpMain=M;dpRe()};
A.dpOb=d=>{const t=S.ui.cor[S.ui.dp.i],P=dpPlan(t,S.ui.dpM||0),on=d.k==='band'||d.k==='show'?!!(S.ui.dpObj||{})[d.k]:P.it.some(i=>i.k===d.k);S.ui.dpObj={...(S.ui.dpObj||{}),[d.k]:!on};dpRe()};
A.dpReset=()=>{const t=S.ui.cor[S.ui.dp.i],ps=S.ui.dpAbs||{};delete ps[dpPosK(t)];S.ui.dpAbs=ps;dpRe()};
function dpRe(){const sb=$('sheetBox'),y=sb?sb.scrollTop:0;A.dpOpen({i:S.ui.dp.i});const s2=$('sheetBox');if(s2)s2.scrollTop=y}
function dpSetPos(t,id,x,y){const ps=S.ui.dpAbs||{},k=dpPosK(t);ps[k]={...(ps[k]||{}),[id]:[Math.round(x),Math.round(y)]};S.ui.dpAbs=ps}
function dpDrag(t){const sv=$('dpTop');
  const svPt=(e)=>{const m=sv.getScreenCTM();return m?[(e.clientX-m.e)/m.a,(e.clientY-m.f)/m.d]:[0,0]};
  const live=tmp=>{if(typeof D3C!=='undefined')D3C.set(dpBuild(dpG0,t,S.ui.dpM||0,tmp))};
  if(sv){let g=null,p0=null,dx=0,dy=0,raf=0;
    sv.addEventListener('pointerdown',e=>{const el=e.target.closest('.dpg');if(!el)return;g=el;p0=svPt(e);dx=dy=0;sv.setPointerCapture(e.pointerId);g.style.opacity='.8';e.preventDefault()});
    sv.addEventListener('pointermove',e=>{if(!g)return;const p=svPt(e);dx=p[0]-p0[0];dy=p[1]-p0[1];g.setAttribute('transform',`translate(${dx} ${dy})`);
      if(!raf){raf=requestAnimationFrame(()=>{raf=0;if(g)live({[g.dataset.id]:[+g.dataset.x+dx,+g.dataset.y+dy]})})}});
    const end=()=>{if(!g)return;const el=g;g=null;el.style.opacity='';if(Math.abs(dx)<3&&Math.abs(dy)<3){el.removeAttribute('transform');const id0=el.dataset.id,now=Date.now(),L=window._dpT;window._dpT=[id0,now];if(id0[0]==='k'&&L&&L[0]===id0&&now-L[1]<500){window._dpT=null;A.dpMainSet({id:id0})}return}
      const id=el.dataset.id,nx=+el.dataset.x+dx,ny=+el.dataset.y+dy,P=dpPlan(t,S.ui.dpM||0),out=nx+75<0||ny+105<0||nx+75>P.W||ny+105>P.D;
      if(id[0]==='k'&&out){if(A.dpPk({i:id.slice(1)}))toast('평대에서 뺐습니다');dpRe();return}
      dpSetPos(t,id,nx,ny);dpRe()};
    sv.addEventListener('pointerup',end);sv.addEventListener('pointercancel',end)}
  document.querySelectorAll('.dpbk').forEach(ch=>{ch.addEventListener('pointerdown',e=>{e.preventDefault();const i=+ch.dataset.i,on=ch.classList.contains('on'),x0=e.clientX,y0=e.clientY;let gh=null,moved=false;
    const mv=ev=>{if(!moved&&Math.hypot(ev.clientX-x0,ev.clientY-y0)>8){moved=true;gh=ch.cloneNode(true);gh.className='dpbk dpghost';document.body.append(gh)}if(gh){gh.style.left=ev.clientX+'px';gh.style.top=ev.clientY+'px'}};
    const up=ev=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);if(gh)gh.remove();
      if(!moved){if(A.dpPk({i}))dpRe();return}
      if(on||!sv)return;const r=sv.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)return;
      const p=svPt(ev);if(A.dpPk({i})){dpSetPos(t,'k'+i,p[0]-75,p[1]-105);toast('평대에 넣었습니다');dpRe()}};
    document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)})})}
