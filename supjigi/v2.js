/* 워크룸 리뉴얼 v2 (참부장 11/18 승인): 메뉴 셋(큐레이션 · 만들기 · 기록), 한 줄 목록, 만들기는 한 화면에 한 단계 */
const V2TABS=()=>akaCtx()?[['cur','큐레이션','store',''],['design','만들기','aka',''],['arc','기록','aka','']]:[['cur','큐레이션','store',''],['design','만들기','store',''],['log','기록','store','']];
(()=>{const f=navList;navList=function(){const L=f(),ex=L.filter(t=>t[2]==='store'&&(t[0]==='stock'||t[0]==='ana'));return [...V2TABS(),...ex]}})();
(()=>{const f=navCur;navCur=function(){const m=S.mode,v=S.view[m];
  if(m==='aka'&&/^(space|insta|talk|design)$/.test(v))return 'aka:design';
  if(m==='store'&&/^(design|dp)$/.test(v))return akaCtx()?'aka:design':'store:design';
  if(m==='store'&&v==='log')return 'store:log';return f()}})();
document.body.classList.add('v2');
/* 지점 기록: 평대 기록 + 평대 사진 */
V.store.log=()=>{let h='';const o=openSheet;openSheet=x=>{h=x};try{A.plOpen()}catch(e){}finally{openSheet=o}
  return `<div class="hero"><p>${esc(brN(S.br))} · 평대 사진과 기록</p><h2>기록</h2></div>
   <label class="btn pri v2ph">평대 사진 남기기<input type="file" accept="image/*" capture="environment" data-c="pl3Ph" hidden></label>
   <div class="v2log">${h.replace(/<button class="btn" data-a="close">닫기<\/button>/,'')}</div>`};
/* 만들기 단계 */
A.dStep=d=>{S.ui.dStep=Math.max(1,Math.min(3,+d.n||1));render();window.scrollTo(0,0)};
afterRender(()=>{try{const mn=document.querySelector('main');if(!mn)return;const B=document.body;
  const des=S.view[S.mode]==='design'&&(S.mode==='aka'||S.mode==='store');
  B.classList.remove('ds1','ds2','ds3');
  /* 아카데미 만들기: 인쇄물 / 공간 · 인물 */
  if(S.mode==='aka'&&(S.view.aka==='design'||S.view.aka==='space')&&!mn.querySelector('.v2seg')){const s=document.createElement('div');s.className='v2seg';const sp=S.view.aka==='space';
    s.innerHTML=`<button data-a="go" data-v="design" data-m="aka" aria-pressed="${!sp}">인쇄물</button><button data-a="go" data-v="space" data-m="aka" aria-pressed="${sp}">공간 · 인물</button>`;
    const bk=mn.querySelector(':scope>.bkbar');bk?bk.after(s):mn.prepend(s)}
  if(des){const n=S.ui.dStep||1;B.classList.add('ds'+n);const ue=mn.querySelector('details.uedit');if(ue&&n===2&&!ue.open){ue.open=true;S.ui.ued=true}
    mn.querySelectorAll('.dsteps button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===n));
    if(!mn.querySelector('.v2next')){const b=document.createElement('div');b.className='v2next';
      b.innerHTML=n<3?`${n>1?`<button class="btn" data-a="dStep" data-n="${n-1}">이전</button>`:''}<button class="btn pri" data-a="dStep" data-n="${n+1}">${n===1?'다음 · 글과 색':'다음 · 받기'}</button>`:`<button class="btn" data-a="dStep" data-n="2">이전 · 고치기</button>`;mn.append(b)}}
  if(S.mode==='store'&&S.view.store==='cur'){
    const w=mn.querySelector(':scope>.wall');if(w){w.querySelectorAll('.cv').forEach(c=>{const t=c.querySelector('.cvt em'),m=c.querySelector('.cvm');if(t&&m)m.dataset.tg=t.textContent});w.querySelectorAll('[hidden]').forEach(x=>x.hidden=false);const m=mn.querySelector('.wmore');if(m)m.remove()}
    const g=mn.querySelector(':scope>.gbarx');const last=mn.querySelector(':scope>.hmore')||w;if(g&&last&&!g.dataset.mv){g.dataset.mv=1;last.after(g)}}
  if(S.mode==='aka'&&S.view.aka==='arc'&&!mn.querySelector('.v2pl')){const hd=mn.querySelector('.archd');if(hd){let n=0;try{n=pl3Get().filter(e=>e.br===S.br).length}catch(e){}
    const r=document.createElement('div');r.className='v2pl';r.innerHTML=`<button data-a="plOpen"><b>평대 기록</b><span>${n?n+'건':'진열 · 인쇄물을 만들면 쌓입니다'}</span><i>›</i></button><label aria-label="평대 사진 남기기" title="평대 사진 남기기"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><input type="file" accept="image/*" capture="environment" data-c="pl3Ph" hidden></label>`;hd.after(r)}}
}catch(e){console.warn(e)}});
