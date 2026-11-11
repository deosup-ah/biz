/* ux.js — 쓰는 사람 쪽에서 다시 짠 것들: 한 줄 입력 하나, 한 벌 뽑기, 보관함, 매출 줄이기, 빈 화면의 다음 행동, 지점 주소 */

/* 지점 주소: 주소 끝에 #choso 처럼 붙이면 그 지점으로 열린다. #academy 는 아카데미 */
(()=>{try{const q=new URLSearchParams(location.search).get('br')||decodeURIComponent(location.hash.slice(1));if(q==='academy'||q==='aka'){S.mode='store';S.br='aka';S.view.store='cur';ls.set('br','aka')}else if(BR.some(b=>b.k===q)){S.mode='store';S.br=q;ls.set('br',q)}if(S.br==='all'||!S.br){S.br='aka';ls.set('br','aka')}}catch(e){}})();
A.cpLink=()=>{const u=location.origin+location.pathname+'#'+S.br;copyText(u)};

/* 한 줄 입력 하나: 어느 화면에서나 맨 위 같은 자리. 내용을 보고 일정 · 안내문 · 평대 · POP 으로 간다 */
const G_SCHED=/(오늘|내일|모레|글피|\d\s*시|\d{1,2}:\d{2}|\d+\s*(명|인)|\d+\s*월|\d+\s*일|요일|\d{1,2}[\/.]\d{1,2})/,G_NOTE=/(습니다|주세요|마세요|안내문|안내판|공지)/,G_CMD=/단체표|주차|길\s*안내|화살표|대관|금연|정숙|출입|알림판|공간\s*소개/;
A.gGo=async d=>{const el=$('gIn'),v=((d&&d.v)||(el&&el.value)||'').trim();if(!v){toast('한 줄 적어 주세요');if(el)el.focus();return}S.ui.gv='';
  if((G_SCHED.test(v)&&!G_NOTE.test(v))||G_CMD.test(v)){if(S.mode!=='aka'||S.view.aka!=='today'){S.mode='aka';S.view.aka='today';render()}const q=$('qIn');if(q){q.value=v;A.qAdd()}}
  else await A.ideaGo({v});
  setTimeout(()=>{try{const t=(TABS[S.mode].find(x=>x[0]===S.view[S.mode])||[])[1];if(t)toast(`「${t}」 화면에 만들었습니다`)}catch(e){}},400)};
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='gIn'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.gGo({})}});
document.addEventListener('input',e=>{if(e.target&&e.target.id==='gIn')S.ui.gv=e.target.value});
(()=>{const mh=micHeard;micHeard=t=>{if(S.ui.micT==='gIn'){S.ui.micT='';t=(t||'').trim();if(!t)return;const el=$('gIn');if(el)el.value=t;return A.gGo({v:t})}return mh(t)}})();

/* 보관함: PDF · PNG 로 받은 것을 이 기기에 30개까지 남긴다 */
const KNAME={pop:'POP',band:'띠지',list:'책 목록',shelf:'선반 이름표',card:'쇼카드',sign:'안내판',rent:'대관 안내'};
const made=()=>{const L=ls.get('made',[]);return Array.isArray(L)?L:[]};
function mkKeep(D){try{const j=JSON.stringify(D);if(!D||j.length>60000)return;const L=made().filter(x=>x.j!==j);L.unshift({at:Date.now(),j});ls.set('made',L.slice(0,30))}catch(e){}}
['dPdf','dPng'].forEach(n=>{const f=A[n];if(f)A[n]=async function(d){try{mkKeep(S.ui.D)}catch(e){}return f.call(this,d)}});
A.mkOpen=d=>{const x=made()[+d.i];if(!x)return;try{S.ui.D=JSON.parse(x.j)}catch(e){return}S.ui.dlog=[];S.view[S.mode]='design';render();window.scrollTo(0,0)};
A.mkDel=d=>{const L=made();L.splice(+d.i,1);ls.set('made',L);render()};A.mkAll=()=>{S.ui.mkAll=!S.ui.mkAll;render()};
function shelfHTML(){const L=made();if(!L.length)return '';const n=S.ui.mkAll?30:6;return `<div class="sec"><h2>보관함 <small class="note">받아 둔 결과물 ${L.length}개 · 이 기기에만 남습니다</small></h2></div><div class="mkg">${L.slice(0,n).map((x,i)=>{let D;try{D=JSON.parse(x.j)}catch(e){return ''}const dt=new Date(x.at),t=String(D.head||D.phrases||'').split('\n')[0]||KNAME[D.kind]||'';let sv='';try{sv=toSVG(layout({...D,size:0}))}catch(e){}return `<div class="mki"><button class="mkt" data-a="mkOpen" data-i="${i}" aria-label="${esc(t)} 다시 열기">${sv}</button><div class="mkc"><b>${esc(t)}</b><small>${KNAME[D.kind]||''} · ${dt.getMonth()+1}/${dt.getDate()}</small></div><button class="lnk" data-a="mkDel" data-i="${i}">지우기</button></div>`}).join('')}</div>${L.length>6?`<div class="btns" style="justify-content:center"><button class="btn ghost sm" data-a="mkAll">${S.ui.mkAll?'접기':'모두 보기'}</button></div>`:''}`}

/* 한 벌 뽑기: 평대 하나에 필요한 POP · 쇼카드 · 책 목록 · 띠지를 PDF 하나로 */
const SETK=[['pop','POP'],['card','쇼카드 6장'],['list','책 목록'],['band','띠지']];
A.setOpen=d=>{S.ui.setI=+d.i;S.ui.setK=S.ui.setK||{pop:1,card:1,list:1,band:1};setDraw()};A.setClose=()=>{const g=$('setp');if(g)g.remove()};A.setT=d=>{S.ui.setK[d.k]=!S.ui.setK[d.k];setDraw()};
function setDraw(busy){let g=$('setp');if(!g){g=document.createElement('div');g.id='setp';document.body.append(g)}const t=(S.ui.cor||[])[S.ui.setI]||{};g.innerHTML=`<div class="setb"><h3>한 벌 뽑기</h3><p>「${esc(t.title||'')}」 평대에 놓을 것을 PDF 하나로 받습니다. 필요 없는 것은 눌러서 뺍니다.</p><div class="chips">${SETK.map(([k,n])=>`<button class="chip" data-a="setT" data-k="${k}" aria-pressed="${!!S.ui.setK[k]}">${n}</button>`).join('')}</div><div class="btns"><button class="btn pri" data-a="setPdf" ${busy?'disabled':''}>${busy?'만드는 중…':'PDF 받기'}</button><button class="btn" data-a="setClose">닫기</button></div></div>`}
A.setPdf=async()=>{const J=window.jspdf&&window.jspdf.jsPDF;if(!J){toast('PDF 도구를 불러오지 못했습니다. 하나씩 PNG 로 받아 주세요.');return}const ks=SETK.map(x=>x[0]).filter(k=>S.ui.setK[k]);if(!ks.length){toast('하나 이상 골라 주세요');return}setDraw(true);
  try{if(document.fonts){await Promise.all(['800 20px Pretendard','600 20px Pretendard','500 20px Pretendard','400 20px Pretendard','700 20px "Gowun Batang"'].map(f=>document.fonts.load(f,'더숲')));await document.fonts.ready}}catch(e){}
  try{const t=getTheme({s:'c',i:String(S.ui.setI)})||(S.ui.cor||[])[S.ui.setI]||{};let doc=null;for(const k of ks){const D=mkD(t,k),L=layout(D),c=await toCanvas(L),o=L.w>L.h?'l':'p';if(!doc)doc=new J({orientation:o,unit:'mm',format:[L.w,L.h],compress:true});else doc.addPage([L.w,L.h],o);doc.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,L.w,L.h);mkKeep(D)}
    await saveFile(String(t.title||'평대').replace(/[\\/:*?"<>|\n]/g,' ').trim()+' 한 벌.pdf',doc.output('blob'));A.setClose();toast(`${ks.length}가지를 PDF 하나로 받았습니다`)}catch(e){console.warn(e);setDraw();toast('만들지 못했습니다. 하나씩 받아 주세요.')}};

/* 빈 화면: 다음에 할 일 하나 */
A.foc=d=>{const el=$(d.id);if(el){el.scrollIntoView({block:'center'});el.focus()}};
const EMPTY=[[/일정이 없습니다/,'한 줄로 넣기','gIn'],[/잡힌 북토크가 없습니다/,'저자부터 적기','tkA'],[/심긴 책이 없|아직 없습니다/,'한 줄로 시작하기','gIn']];

/* 그린 뒤 손보기 */
function uxPost(){const mn=document.querySelector('main');if(!mn)return;const m=S.mode,v=S.view[m];
  if(!$('gIn')){const w=document.createElement('div');w.className='gbarx';w.innerHTML=`<input type="text" id="gIn" autocomplete="off" enterkeyhint="go" aria-label="한 줄 입력" placeholder="한 줄이면 됩니다 — 비 · 내일 2시 독서모임 12명 · 오늘은 6시에 닫습니다"><label class="btn">사진<input type="file" accept="image/*" data-c="${m==='store'?'feelPhoto':'dPhoto'}" hidden></label>${typeof micBtn==='function'?micBtn('gIn'):''}<button class="btn pri" data-a="gGo">만들기</button>`;mn.prepend(w);if(S.ui.gv)$('gIn').value=S.ui.gv}
  mn.querySelectorAll('.empty').forEach(c=>{if(c.querySelector('[data-a="foc"]'))return;const e=EMPTY.find(x=>x[0].test(c.textContent));if(e&&$(e[2])){const b=document.createElement('button');b.className='btn sm';b.dataset.a='foc';b.dataset.id=e[2];b.textContent=e[1];b.style.marginTop='10px';c.appendChild(document.createElement('br'));c.appendChild(b)}});
  if(m==='store'&&v==='cur')mn.querySelectorAll('[data-a="dpOpen"]').forEach(b=>{if(b.parentNode.querySelector('[data-a="setOpen"]'))return;const n=document.createElement('button');n.className='btn';n.dataset.a='setOpen';n.dataset.i=b.dataset.i;n.textContent='한 벌 뽑기';b.after(n)});
  if(v==='design'&&!mn.querySelector('.mkg')){const h=shelfHTML();if(h){const w=document.createElement('div');w.innerHTML=h;mn.append(...w.childNodes)}}
  if(m==='store'&&v==='more'&&S.br!=='all'&&!mn.querySelector('[data-a="cpLink"]')){const b=[...mn.querySelectorAll('button')].find(x=>/화면 잠그기/.test(x.textContent));if(b){const n=document.createElement('button');n.className=b.className;n.dataset.a='cpLink';n.textContent='이 지점 주소 복사';b.after(n)}}
  if(m==='store'&&v==='ana'&&!mn.querySelector('.anaf')){const auto=mn.querySelector('.card.auto'),ul=auto&&auto.querySelector('ul'),extra=[...mn.querySelectorAll(':scope>.card')].filter(c=>{const h=c.querySelector(':scope>h3');return h&&/^(한눈에 읽기|요약)/.test(h.textContent.trim())}),lis=[];extra.forEach(c=>{lis.push(...c.querySelectorAll('li'));c.remove()});
    if(ul)lis.splice(0,3).forEach(li=>ul.appendChild(li));
    const g=mn.querySelector(':scope>.grid.g4');if(g){let st=g.nextElementSibling;if(st&&st.matches('p.note'))st=st.nextElementSibling;const rest=[];for(let e=st;e;e=e.nextElementSibling)rest.push(e);if(rest.length){const dt=document.createElement('details');dt.className='anaf';dt.open=!!S.ui.anaOpen;dt.innerHTML='<summary>그래프와 표 자세히 보기</summary>';if(lis.length){const c=document.createElement('div');c.className='card';c.innerHTML='<h3>더 읽기</h3><ul></ul>';lis.forEach(li=>c.lastChild.appendChild(li));dt.appendChild(c)}rest.forEach(e=>dt.appendChild(e));dt.addEventListener('toggle',()=>{S.ui.anaOpen=dt.open});mn.appendChild(dt)}}}}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{uxPost()}catch(e){console.warn(e)}}})();

/* ── 곳 고르기 하나: 아카데미 · 노원 · 초소 · 소전 · 본점 · 중계. 「서점 / 전체」는 없다. 아카데미는 공간 일과 책 일을 한 묶음으로 ── */
const PLACES=[['aka','아카데미'],['nowon','노원'],['choso','초소'],['sojeon','소전'],['nmain','본점'],['njung','중계']];
const akaCtx=()=>S.mode==='aka'||S.br==='aka';
function navList(){if(!akaCtx())return TABS.store.map(([v,l],i)=>[v,l,'store',i===0?'기획':v==='stock'?'실제':'']);
  return [['cur','큐레이션','store','기획'],['space','공간','aka',''],['design','만들기','aka',''],['trend','트렌드','aka',''],['talk','북토크','aka',''],['insta','홍보','aka',''],['today','오늘','aka','실제'],['cal','일정','aka',''],['stock','주문','store',''],['ana','매출','store',''],['more','더보기','store','']]}
function navCur(){const L=navList(),m=S.mode,v=S.view[m];let t=L.find(x=>x[2]===m&&x[0]===v);if(!t&&m==='aka'&&typeof GRP!=='undefined'&&GRP[v])t=L.find(x=>x[2]==='aka'&&x[0]===GRP[v]);if(!t)t=L.find(x=>x[2]===m&&x[0]==='more')||L.find(x=>x[2]===m)||L[0];return t[2]+':'+t[0]}
A.place=d=>{const k=d.k;if(k==='aka'){if(!akaCtx()){S.mode='store';S.view.store='cur'}}else{if(S.mode!=='store'){S.mode='store'}}A.br({k});window.scrollTo(0,0)};
(()=>{const h=A.home;A.home=d=>{if(akaCtx()){S.mode='store';S.br='aka';S.view.store='cur';try{ss.set('view',S.view)}catch(e){}window.scrollTo(0,0);render();return}return h(d)}})();
function navPost(){if(S.br==='all'||!S.br)S.br='aka';const hd=document.querySelector('header.top');if(!hd)return;const md=hd.querySelector('.mode');if(md)md.remove();let r2=hd.querySelector('.row2');const cur=akaCtx()?'aka':S.br,html=PLACES.map(([k,n])=>`<button class="brchip" data-a="place" data-k="${k}" aria-pressed="${cur===k}">${n}</button>`).join('');
  if(!r2){r2=document.createElement('div');r2.className='row2';r2.setAttribute('role','group');const bar=hd.querySelector('.bar');bar.after(r2)}r2.classList.add('places');r2.setAttribute('aria-label','곳 고르기');r2.innerHTML=html;
  const nv=hd.querySelector('nav.tabs');if(nv){const c=navCur();let al=0,cn=0;try{al=anomalies('all').length;cn=BR.reduce((a,b)=>a+cart(b.k).items.length,0)}catch(e){}nv.innerHTML=navList().map(([v,l,m,g])=>`${g?`<span class="tg">${g}</span>`:''}<button data-a="go" data-v="${v}" data-m="${m}" ${c===m+':'+v?'aria-current="page"':''}>${l}${v==='more'&&al?`<span class="b">${al}</span>`:''}${v==='stock'&&cn?`<span class="b" style="background:var(--pine)">${cn}</span>`:''}</button>`).join('')}}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{navPost()}catch(e){console.warn(e)}try{if(window.dialSync)window.dialSync()}catch(e){}}})();

/* ── 지점마다 절반은 다른 큐레이션. 앞의 셋은 모든 지점이 같고, 그 뒤는 지점 · 주마다 순서가 다르다. 다른 지점 것을 보고 가져올 수 있다 ── */
const hsh=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)/4294967296};
const brAdd=()=>{const L=ls.get('brAdd',[]);return Array.isArray(L)?L:[]};
const plName=k=>(PLACES.find(p=>p[0]===k)||[k,k])[1];
(()=>{const g=corners;corners=function(br){const C=g(br);try{const wk=Math.floor(new Date(TODAY+'T00:00:00').getTime()/6048e5),my=C.time.filter(t=>t.tone==='내 생각'),rest=C.time.filter(t=>t.tone!=='내 생각'),same=rest.slice(0,3),mix=rest.slice(3).map(t=>[hsh(br+'|'+wk+'|'+t.title),t]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);let P=[];try{P=pool(br)}catch(e){}
    const have=new Set([...my,...rest].map(t=>t.title)),got=brAdd().filter(x=>x.br===br&&x.t).map(x=>({...x.t,br,tone:'가져온 것',hook:x.t.hook||'',books:(x.t.books||[]).map(b=>P.find(p=>nt(p.t)===nt(b.t))||{...b,src:''})}));
    C.time=[...got,...my,...same,...mix.filter(t=>!got.some(q=>q.title===t.title))];C.all=[...C.time,...C.data]}catch(e){console.warn(e)}return C}})();
A.peek=d=>{S.ui.peek=S.ui.peek===d.k?null:d.k;render()};
A.peekAdd=d=>{const k=S.ui.peek,src=(()=>{try{return corners(k).time.filter(t=>t.tone!=='가져온 것')[+d.i]}catch(e){return null}})();if(!src||!S.br)return;const L=brAdd().filter(x=>!(x.br===S.br&&x.t&&x.t.title===src.title)),t={title:src.title,hook:src.hook,sym:src.sym,bpal:src.bpal,ppal:src.ppal,place:src.place,until:src.until,pop:src.pop,band:src.band,from:k,books:(src.books||[]).slice(0,8).map(b=>({t:b.t,a:b.a,p:b.p,isbn:b.isbn,price:b.price,role:b.role,why:b.why}))};L.unshift({br:S.br,t});ls.set('brAdd',L.slice(0,40));toast(`${plName(k)}의 「${src.title}」을 ${plName(S.br)}에 넣었습니다`);render()};
A.peekDel=d=>{ls.set('brAdd',brAdd().filter(x=>!(x.br===S.br&&x.t&&x.t.title===d.t)));render()};
function peekHTML(){const me=S.br,others=PLACES.filter(p=>p[0]!==me),k=S.ui.peek&&S.ui.peek!==me?S.ui.peek:null,mine=brAdd().filter(x=>x.br===me&&x.t);let body='';
  if(k){let L=[];try{L=corners(k).time.filter(t=>t.tone!=='가져온 것').slice(0,8)}catch(e){}let cur=[];try{cur=corners(me).time.slice(0,6).map(t=>t.title)}catch(e){}
    body=`<div class="pkl">${L.map((t,i)=>{const has=mine.some(x=>x.t.title===t.title),top=cur.includes(t.title)&&!has;return `<div class="pkr"><div><b>${esc(t.title)}</b><p>${esc(t.hook||'')}</p><small>${(t.books||[]).slice(0,4).map(b=>esc(b.t)).join(' · ')}</small></div>${has?`<button class="btn sm" data-a="peekDel" data-t="${esc(t.title)}">빼기</button>`:top?`<span class="note">이미 앞에 있음</span>`:`<button class="btn sm pri" data-a="peekAdd" data-i="${i}">${plName(me)}에 넣기</button>`}</div>`}).join('')||'<p class="note">보여 줄 큐레이션이 없습니다.</p>'}</div>`}
  return `<div class="sec pks"><h2>다른 지점 큐레이션 <small class="note">앞의 셋은 모든 지점이 같고, 나머지는 지점마다 다릅니다. 보고 가져올 수 있습니다${mine.length?` · 가져온 것 ${mine.length}개`:''}</small></h2></div><div class="chips pkc">${others.map(([q,n])=>`<button class="chip" data-a="peek" data-k="${q}" aria-pressed="${k===q}">${n}</button>`).join('')}</div>${body}`}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const mn=document.querySelector('main');if(mn&&S.mode==='store'&&S.view.store==='cur'&&!mn.querySelector('.pks')){const w=document.createElement('div');w.innerHTML=peekHTML();mn.append(...w.childNodes)}}catch(e){console.warn(e)}}})();
