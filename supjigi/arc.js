/* 더숲 아카이브 — 아카데미 아카이브 (11/13)
   실물은 사유의숲 별실에, 그 물건이 지나온 날은 여기에.
   공유 저장(Claude 앱 안): db  arc/<id> 기록, arcimg/<id> 사진 원본
   그 밖(공개 주소): 이 기기 안에만 (localStorage 기록 · IndexedDB 사진) */
const ARC={L:[],st:'idle',db:null,live:false,pend:false};
/* 11/13 23:36 참부장: 담은 기록을 한 번 비우고 찾은 소식(검색 상태)만 남긴다 — 기기마다 한 번 */
const ARC_RST='1113-2336';
function arcWipeLocal(){try{localStorage.removeItem('sj.arc');localStorage.removeItem('sj.arcHide');indexedDB.deleteDatabase('sjarc')}catch(e){}ARC.L=[];if(S&&S.ui){S.ui.arcSel={};S.ui.arcF='';S.ui.arcIss='';S.ui.arcBox='';S.ui.arcT='';S.ui.arcTh=[]}}
try{if(localStorage.getItem('sj.arcRst')!==ARC_RST){arcWipeLocal();localStorage.setItem('sj.arcRst',ARC_RST)}}catch(e){}
const ARC_K=[['영화',/영화|상영|시네마|cinema/i],['북토크',/북토크|작가|저자|낭독/],['전시',/전시|작품|씨앗숲|설치/],['프로그램',/프로그램|강의|워크숍|모임|수업|클래스/],['공간',/공간|가구|서가|배치|별실|인물도서관|사유의숲/],['기증',/기증|기부|받은 책|나눔/],['손상 · 수리',/파손|손상|수리|고장|누수|찢/],['방문',/방문|단체|대관|투어/]];
const arcKind=t=>{for(const [k,r] of ARC_K)if(r.test(t))return k;return '기록'};
const arcId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const arcNow=()=>{const d=new Date();return {date:TODAY,time:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}};

/* 이 기기 사진 창고 */
const arcIdb=()=>new Promise((ok,no)=>{try{const r=indexedDB.open('sjarc',1);r.onupgradeneeded=()=>r.result.createObjectStore('img');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}});
async function arcIdbPut(k,v){const d=await arcIdb();return new Promise(ok=>{const t=d.transaction('img','readwrite');t.objectStore('img').put(v,k);t.oncomplete=()=>ok(true);t.onerror=()=>ok(false)})}
async function arcIdbGet(k){const d=await arcIdb();return new Promise(ok=>{const q=d.transaction('img').objectStore('img').get(k);q.onsuccess=()=>ok(q.result||null);q.onerror=()=>ok(null)})}

/* 사진 줄이기: 원본은 256KB 안, 목록용은 작게 */
function arcShrink(file,max,limit){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{let w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,max/Math.max(w,h));const c=document.createElement('canvas');let q=.82,out='';
  for(let n=0;n<8;n++){c.width=Math.round(w*s);c.height=Math.round(h*s);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);out=c.toDataURL('image/jpeg',q);if(out.length<=limit)break;if(q>.55)q-=.1;else s*=.8}
  URL.revokeObjectURL(u);ok(out)};im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('img'))};im.src=u})}

/* 불러오기 · 실시간 */
async function arcStart(){if(ARC.st!=='idle')return;ARC.st='load';
  let db=null;try{db=window.claude&&window.claude.use?await window.claude.use('db'):null}catch(e){db=null}
  if(!db){ARC.L=ls.get('arc',[]);ARC.st='local';arcPaint();return}
  ARC.db=db;const tm=setTimeout(()=>{if(!ARC.live){ARC.slow=true;arcPaint()}},10000);
  db.collection('arc').onSnapshot(s=>{ARC.L=s.docs.map(d=>({...d.data(),id:d.id}));if(!s.metadata.fromCache){ARC.live=true;ARC.slow=false;clearTimeout(tm)}ARC.st='db';arcPaint()},
    e=>{clearTimeout(tm);ARC.st='local';ARC.err=e&&e.code;ARC.L=ls.get('arc',[]);arcPaint()})}
function arcPaint(){if(!(S.mode==='aka'&&S.view.aka==='arc'))return;const a=document.activeElement;if(a&&a.closest&&a.closest('.arcw')&&(a.value||'').trim()){ARC.pend=true;return}render()}
const arcShared=()=>ARC.st==='db';
async function arcSave(o){if(arcShared()){const{id,...b}=o;try{await ARC.db.doc('arc/'+id).set(b);return true}catch(e){toast(e&&e.code==='quota_exceeded'?'저장 공간이 찼습니다. 오래된 사진을 정리해 주세요.':'저장하지 못했습니다. 잠시 뒤 다시 남겨 주세요.');return false}}
  const L=ls.get('arc',[]),i=L.findIndex(x=>x.id===o.id);if(i>=0)L[i]=o;else L.push(o);ls.set('arc',L);ARC.L=L;return true}
async function arcDel(id){const o=ARC.L.find(x=>x.id===id);if(arcShared()){try{await ARC.db.doc('arc/'+id).delete();for(const k of (o&&o.img)||[])await ARC.db.doc('arcimg/'+k).delete()}catch(e){toast('지우지 못했습니다.')}return}
  const L=ls.get('arc',[]).filter(x=>x.id!==id);ls.set('arc',L);ARC.L=L}
async function arcImgPut(k,full){if(arcShared()){try{await ARC.db.doc('arcimg/'+k).set({d:full});return true}catch(e){return false}}return arcIdbPut(k,full)}
async function arcImgGet(k){if(arcShared()){try{const s=await ARC.db.doc('arcimg/'+k).get();return s.exists?s.data().d:null}catch(e){return null}}return arcIdbGet(k)}

/* 화면 */
const arcIss=()=>{const M={};ARC.L.forEach(x=>{if(!x.iss)return;const g=M[x.iss]=M[x.iss]||{n:x.iss,c:0,a:x.date,b:x.date};g.c++;if(x.date<g.a)g.a=x.date;if(x.date>g.b)g.b=x.date});return Object.values(M).sort((p,q)=>p.b<q.b?1:-1)};
const arcMD=(d,p)=>{const [y,m,dd]=d.split('-');if(p==='y')return y+'년';if(p==='m')return `${y}년 ${+m}월`;return (y!==TODAY.slice(0,4)?y+'년 ':'')+`${+m}월 ${+dd}일`};
const arcHid=()=>ls.get('arcHide',[]);
const arcLeft=()=>{if(typeof ARC_FOUND==='undefined')return [];const got=new Set(ARC.L.map(x=>x.from).filter(Boolean)),h=new Set(arcHid());return ARC_FOUND.filter(f=>!got.has(f.id)&&!h.has(f.id)).sort((a,b)=>a.d<b.d?1:-1)};
const arcWk=d=>'일월화수목금토'[new Date(d+'T00:00:00').getDay()];
V.aka.arc=()=>{if(ARC.st==='idle')setTimeout(arcStart,0);const U=S.ui,f=U.arcF||'',q=(U.arcQ||'').trim(),iss=arcIss(),cur=U.arcIss||'',dt=U.arcD||TODAY;
  let L=ARC.L.slice().sort((a,b)=>(b.date+(b.time||''))<(a.date+(a.time||''))?-1:1);if(f)L=L.filter(x=>x.iss===f);if(q)L=L.filter(x=>(x.t+' '+(x.iss||'')+' '+(x.box||'')+' '+x.k).includes(q));
  const days={};L.forEach(x=>(days[x.date]=days[x.date]||[]).push(x));const ds=Object.keys(days);
  const today=ARC.L.filter(x=>x.date===TODAY).length,ph=ARC.L.reduce((a,x)=>a+((x.th||[]).length),0);
  const where=arcShared()?(ARC.live?'함께 보는 기록 · 실시간':'함께 보는 기록 · 잇는 중'):'이 기기에만 남는 기록';
  const draft=U.arcT||'',shots=U.arcTh||[];
  return `<div class="arcw">
  <div class="archd"><h1>더숲 아카이브</h1><p class="arcm">실물은 사유의숲 별실에, 그 물건이 지나온 날은 여기에.</p>
   <div class="arcst"><span><b>${ARC.L.length}</b>기록</span><span><b>${ph}</b>사진</span><span><b>${iss.length}</b>묶음</span><span><b>${today}</b>오늘</span><em class="${arcShared()&&ARC.live?'on':''}">${where}</em></div></div>
  <div class="arcin">
   <textarea id="arcT" rows="2" placeholder="지금 있었던 일 한 줄 — 무엇이, 어떻게" aria-label="기록 한 줄">${esc(draft)}</textarea>
   ${shots.length?`<div class="arcsh">${shots.map((s,i)=>`<span><img src="${s.th}" alt=""><button data-a="arcShotX" data-i="${i}" aria-label="사진 빼기">×</button></span>`).join('')}</div>`:''}
   <div class="arcrow">
    <label class="arcph" aria-label="사진 넣기"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>사진<input type="file" accept="image/*" multiple data-c="arcPh" hidden></label>
    <label class="arcdt"><span>${dt===TODAY?'오늘':arcMD(dt)}</span><input type="date" value="${dt}" max="${TODAY}" data-c="arcD" aria-label="날짜"></label>
    <select data-c="arcIssSel" aria-label="묶음"><option value="">묶음 없음</option>${iss.map(g=>`<option ${g.n===cur?'selected':''}>${esc(g.n)}</option>`).join('')}<option value="+">새 묶음…</option></select>
    <input type="text" id="arcBox" value="${esc(U.arcBox||'')}" placeholder="별실 자리 (예: 상자 3)" aria-label="별실 보관 자리">
    <button class="btn pri" data-a="arcAdd">남기기</button>
   </div>
   ${U.arcBusy?`<p class="arcbusy">사진을 줄이는 중…</p>`:''}
  </div>
  ${(()=>{const F=arcLeft();if(!F.length)return '';const sel=U.arcSel||{},n=F.filter(f=>sel[f.id]).length;return `<details class="arcfd" ${U.arcFdC?'':'open'}><summary data-a="arcFdT"><b>찾은 소식 ${F.length}</b><span>검색된 기사 · 인터뷰 · 행사 · 연혁입니다. 고른 것만 기록으로 담깁니다.</span></summary>
   <ul>${F.map(f=>`<li><label><input type="checkbox" data-c="arcSel" data-id="${f.id}" ${sel[f.id]?'checked':''}><span class="arcfdd">${arcMD(f.d,f.p)}</span><span class="arck">${f.k}</span><b>${esc(f.t)}</b></label><span class="arcfdm">${f.note?`<i>${esc(f.note)}</i>`:''}<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.src)} ↗</a><button data-a="arcHide" data-id="${f.id}">빼기</button></span></li>`).join('')}</ul>
   <div class="arcfdb"><button class="btn" data-a="arcSelAll">${n===F.length?'모두 풀기':'모두 고르기'}</button><button class="btn pri" data-a="arcTake" ${n?'':'disabled'}>고른 ${n}건 담기</button></div></details>`})()}
  ${iss.length?`<div class="arciss"><button data-a="arcF" data-n="" aria-pressed="${!f}">전체</button>${iss.map(g=>`<button data-a="arcF" data-n="${esc(g.n)}" aria-pressed="${f===g.n}"><b>${esc(g.n)}</b><i>${g.c} · ${g.a===g.b?arcMD(g.b):arcMD(g.a)+'–'+arcMD(g.b)}</i></button>`).join('')}</div>`:''}
  ${ARC.L.length>8?`<input class="arcq" type="search" data-c="arcQ" value="${esc(q)}" placeholder="기록에서 찾기">`:''}
  ${ARC.slow?`<div class="al">함께 보는 기록에 아직 닿지 못했습니다. 보이는 내용이 최신이 아닐 수 있습니다.</div>`:''}
  ${!ARC.L.length?`<div class="arcnone"><b>첫 기록을 남겨 보세요.</b><p>포스터 한 장, 상영 회차, 기증 받은 책 한 상자. 사진 한 장과 한 줄이면 됩니다. 실물은 별실에 두고, 어느 상자에 넣었는지만 적어 두면 나중에 찾을 수 있어요.</p></div>`:''}
  <div class="arctl">${ds.map(d=>`<section><h3><span>${arcMD(d,days[d][0].p)}</span><i>${days[d][0].p&&days[d][0].p!=='d'?'':arcWk(d)}${d===TODAY?' · 오늘':d>TODAY?' · 예정':''}</i></h3>${days[d].map(x=>`<article class="arce">
    <div class="arcmeta"><span class="arck">${esc(x.k)}</span>${x.time?`<span>${x.time}</span>`:''}${x.iss?`<button data-a="arcF" data-n="${esc(x.iss)}">${esc(x.iss)}</button>`:''}</div>
    <p>${esc(x.t)}</p>${x.note?`<p class="arcnote">${esc(x.note)}</p>`:''}${x.url?`<a class="arcsrc" href="${esc(x.url)}" target="_blank" rel="noopener">출처 · ${esc(x.src||'링크')} ↗</a>`:x.src?`<span class="arcsrc">출처 · ${esc(x.src)}</span>`:''}
    ${(x.th||[]).length?`<div class="arcimg">${x.th.map((t,i)=>`<button data-a="arcView" data-id="${x.id}" data-i="${i}"><img src="${t}" alt="${esc(x.t)} 사진 ${i+1}" loading="lazy"></button>`).join('')}</div>`:''}
    <div class="arcft">${x.box?`<span class="arcbox">별실 · ${esc(x.box)}</span>`:'<span></span>'}<span><button data-a="arcMore" data-id="${x.id}">이어 쓰기</button><button data-a="arcEdit" data-id="${x.id}">고치기</button></span></div>
  </article>`).join('')}</section>`).join('')}</div>
  ${ARC.L.length?`<div class="arcrst"><button data-a="arcReset">기록 모두 비우기</button></div>`:''}
  </div>`};

/* 입력 */
document.addEventListener('input',e=>{if(e.target.id==='arcT')S.ui.arcT=e.target.value;else if(e.target.id==='arcBox')S.ui.arcBox=e.target.value;else if(e.target.id==='arcSrc')S.ui.arcSrc=e.target.value});
const arcSrcParse=v=>{v=(v||'').trim();if(!v)return {src:'',url:''};const m=v.match(/https?:\/\/\S+/);if(!m)return {src:v.slice(0,60),url:''};const url=m[0],rest=v.replace(url,'').trim();let host='';try{host=new URL(url).hostname.replace(/^www\.|^m\./,'')}catch(e){}return {src:(rest||host||'링크').slice(0,60),url}};
document.addEventListener('keydown',e=>{if(e.target.id==='arcT'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();A.arcAdd()}});
document.addEventListener('focusout',e=>{if(e.target.closest&&e.target.closest('.arcw')&&ARC.pend){setTimeout(()=>{const a=document.activeElement;if(!(a&&a.closest&&a.closest('.arcw')&&(a.value||'').trim())){ARC.pend=false;render()}},50)}});
C.arcD=el=>{S.ui.arcD=el.value&&el.value<=TODAY?el.value:TODAY;render()};
C.arcQ=el=>{S.ui.arcQ=el.value;render()};
C.arcIssSel=el=>{if(el.value==='+'){const n=(prompt('새 묶음 이름 (예: 2026 가을 상영회)')||'').trim().slice(0,40);S.ui.arcIss=n||S.ui.arcIss||''}else S.ui.arcIss=el.value;render()};
C.arcPh=async el=>{const fs=[...el.files].slice(0,6);if(!fs.length)return;S.ui.arcBusy=1;render();const out=S.ui.arcTh||[];
  for(const f of fs){try{const full=await arcShrink(f,1600,240000),th=await arcShrink(f,360,24000);out.push({full,th})}catch(e){toast('사진 하나를 읽지 못했습니다.')}}
  S.ui.arcTh=out.slice(0,8);S.ui.arcBusy=0;render();const t=$('arcT');if(t)t.focus()};
A.arcShotX=d=>{(S.ui.arcTh||[]).splice(+d.i,1);render()};
A.arcAdd=async()=>{const U=S.ui,t=(($('arcT')||{}).value||U.arcT||'').trim(),sh=U.arcTh||[];if(!t&&!sh.length){toast('한 줄이나 사진 한 장은 있어야 남깁니다.');const x=$('arcT');if(x)x.focus();return}
  if(U.arcBusy)return;const now=arcNow(),dt=U.arcD||TODAY,id=arcId(),img=[];
  for(const s of sh){const k=id+'-'+img.length;if(await arcImgPut(k,s.full))img.push(k)}
  const o={id,date:dt,time:dt===TODAY?now.time:'',t:t||'사진 기록',k:arcKind(t+' '+(U.arcIss||'')),iss:U.arcIss||'',box:(($('arcBox')||{}).value||U.arcBox||'').trim(),th:sh.slice(0,img.length).map(s=>s.th),img,at:new Date().toISOString()};
  if(await arcSave(o)){U.arcT='';U.arcTh=[];U.arcSrc='';ARC.pend=false;toast(dt===TODAY?'남겼습니다.':arcMD(dt)+' 기록으로 남겼습니다.');render()}};
A.arcF=d=>{S.ui.arcF=S.ui.arcF===d.n&&d.n?'':d.n;render();window.scrollTo(0,0)};
A.arcMore=d=>{const o=ARC.L.find(x=>x.id===d.id);if(!o)return;if(!o.iss){const n=(prompt('이 기록을 어떤 묶음으로 이어 갈까요?',o.t.slice(0,20))||'').trim().slice(0,40);if(!n)return;o.iss=n;arcSave({...o})}
  S.ui.arcIss=o.iss;S.ui.arcBox=o.box||S.ui.arcBox||'';render();window.scrollTo(0,0);const t=$('arcT');if(t)t.focus()};
A.arcEdit=d=>{const o=ARC.L.find(x=>x.id===d.id);if(!o)return;openSheet(`<h3>기록 고치기</h3><div class="arced">
  <label>날짜<input type="date" id="aeD" value="${o.date}"></label><label>내용<textarea id="aeT" rows="3">${esc(o.t)}</textarea></label>
  <label>묶음<input id="aeI" value="${esc(o.iss||'')}" placeholder="없음"></label><label>별실 자리<input id="aeB" value="${esc(o.box||'')}" placeholder="예: 상자 3"></label><label>출처 · 링크<input id="aeS" value="${esc([o.src,o.url].filter(Boolean).join(' '))}" placeholder="예: 국민일보 https://…"></label>
  <div class="arcedb"><button class="btn" data-a="arcRm" data-id="${o.id}">지우기</button><button class="btn" data-a="closeSheet">닫기</button><button class="btn pri" data-a="arcEdSave" data-id="${o.id}">저장</button></div></div>`)};
A.arcEdSave=async d=>{const o=ARC.L.find(x=>x.id===d.id);if(!o)return;const t=$('aeT').value.trim()||o.t,n={...o,date:$('aeD').value||o.date,t,iss:$('aeI').value.trim().slice(0,40),box:$('aeB').value.trim(),...arcSrcParse($('aeS').value)};if(n.date!==o.date)n.p='d';n.k=arcKind(t+' '+n.iss);if(await arcSave(n)){closeSheet();render()}};
A.arcRm=async d=>{const b=document.querySelector('[data-a="arcRm"]');if(b&&!b.dataset.ok){b.dataset.ok=1;b.textContent='한 번 더 누르면 지웁니다';return}await arcDel(d.id);closeSheet();toast('지웠습니다. 별실의 실물은 그대로입니다.');render()};
A.arcView=async d=>{const o=ARC.L.find(x=>x.id===d.id);if(!o)return;const i=+d.i,k=(o.img||[])[i];openSheet(`<div class="arcvw"><img src="${(o.th||[])[i]||''}" alt="" id="arcVi"><p>${arcMD(o.date,o.p)}${o.time?' '+o.time:''} · ${esc(o.t)}</p><div class="arcedb">${(o.th||[]).length>1?`<button class="btn" data-a="arcView" data-id="${o.id}" data-i="${(i+1)%o.th.length}">다음 사진</button>`:''}<button class="btn" data-a="arcDl" data-id="${o.id}" data-i="${i}">원본 저장</button><button class="btn pri" data-a="closeSheet">닫기</button></div></div>`);
  if(k){const f=await arcImgGet(k);const im=$('arcVi');if(f&&im)im.src=f}};
A.arcDl=async d=>{const o=ARC.L.find(x=>x.id===d.id);if(!o)return;const k=(o.img||[])[+d.i],f=k&&await arcImgGet(k);if(!f){toast('원본을 찾지 못했습니다.');return}const b=await (await fetch(f)).blob();saveFile(`별실기록_${o.date}_${+d.i+1}.jpg`,b)};
if(typeof A.closeSheet!=='function')A.closeSheet=()=>closeSheet();

A.arcReset=async(d,el)=>{if(el&&!el.dataset.ok){el.dataset.ok=1;el.textContent=`${ARC.L.length}건을 지웁니다. 한 번 더 누르세요`;return}
  if(arcShared()){for(const o of ARC.L.slice())await arcDel(o.id)}arcWipeLocal();toast('비웠습니다. 찾은 소식만 남았습니다. 별실의 실물은 그대로입니다.');render();window.scrollTo(0,0)};
/* 찾은 소식 고르기 */
C.arcSel=el=>{const s=S.ui.arcSel=S.ui.arcSel||{};if(el.checked)s[el.dataset.id]=1;else delete s[el.dataset.id];render()};
A.arcFdT=(d,el,e)=>{e&&e.preventDefault();S.ui.arcFdC=!S.ui.arcFdC;render()};
A.arcSelAll=()=>{const F=arcLeft(),s=S.ui.arcSel=S.ui.arcSel||{},all=F.every(f=>s[f.id]);F.forEach(f=>{if(all)delete s[f.id];else s[f.id]=1});render()};
A.arcHide=d=>{const h=arcHid();h.push(d.id);ls.set('arcHide',h);if(S.ui.arcSel)delete S.ui.arcSel[d.id];render()};
A.arcTake=async()=>{const s=S.ui.arcSel||{},F=arcLeft().filter(f=>s[f.id]);let n=0;for(const f of F){const o={id:arcId(),from:f.id,date:f.d,p:f.p,time:'',t:f.t,k:f.k,iss:'',box:'',th:[],img:[],url:f.url,src:f.src,note:f.note||'',at:new Date().toISOString()};if(await arcSave(o))n++}S.ui.arcSel={};toast(n+'건을 기록으로 담았습니다.');render()};

/* 아카데미 메뉴에 「아카이브」 */
TABS.aka.push(['arc','아카이브']);
(()=>{const f=navList;navList=function(){const L=f();if(!L.some(x=>x[0]==='arc')){let i=L.findIndex(x=>x[0]==='today');if(i<0)i=L.findIndex(x=>x[0]==='insta');if(i>=0)L.splice(i+1,0,['arc','아카이브','aka',''])}return L}})();
