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
function setDraw(busy){let g=$('setp');if(!g){g=document.createElement('div');g.id='setp';document.body.append(g)}const t=(S.ui.cor||[])[S.ui.setI]||{};g.innerHTML=`<div class="setb"><h3>인쇄물 한 번에 받기</h3><p>「${esc(t.title||'')}」 평대에 놓을 인쇄물을 PDF 파일 하나로 받습니다. 필요 없는 것은 눌러서 뺍니다.</p><div class="chips">${SETK.map(([k,n])=>`<button class="chip" data-a="setT" data-k="${k}" aria-pressed="${!!S.ui.setK[k]}">${n}</button>`).join('')}</div><div class="btns"><button class="btn pri" data-a="setPdf" ${busy?'disabled':''}>${busy?'만드는 중…':'PDF 받기'}</button><button class="btn" data-a="setClose">닫기</button></div></div>`}
A.setPdf=async()=>{const J=window.jspdf&&window.jspdf.jsPDF;if(!J){toast('PDF 도구를 불러오지 못했습니다. 하나씩 PNG 로 받아 주세요.');return}const ks=SETK.map(x=>x[0]).filter(k=>S.ui.setK[k]);if(!ks.length){toast('하나 이상 골라 주세요');return}setDraw(true);
  try{if(document.fonts){await Promise.all(['800 20px Pretendard','600 20px Pretendard','500 20px Pretendard','400 20px Pretendard','700 20px "Gowun Batang"'].map(f=>document.fonts.load(f,'더숲')));await document.fonts.ready}}catch(e){}
  try{const t=getTheme({s:'c',i:String(S.ui.setI)})||(S.ui.cor||[])[S.ui.setI]||{};let doc=null;for(const k of ks){const D=mkD(t,k),L=layout(D),c=await toCanvas(L),o=L.w>L.h?'l':'p';if(!doc)doc=new J({orientation:o,unit:'mm',format:[L.w,L.h],compress:true});else doc.addPage([L.w,L.h],o);doc.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,L.w,L.h);mkKeep(D)}
    await saveFile(String(t.title||'평대').replace(/[\\/:*?"<>|\n]/g,' ').trim()+' 인쇄물.pdf',doc.output('blob'));A.setClose();toast(`${ks.length}가지를 PDF 하나로 받았습니다`)}catch(e){console.warn(e);setDraw();toast('만들지 못했습니다. 하나씩 받아 주세요.')}};

/* 빈 화면: 다음에 할 일 하나 */
A.foc=d=>{const el=$(d.id);if(el){el.scrollIntoView({block:'center'});el.focus()}};
const EMPTY=[[/일정이 없습니다/,'한 줄로 넣기','gIn'],[/잡힌 북토크가 없습니다/,'저자부터 적기','tkA'],[/심긴 책이 없|아직 없습니다/,'한 줄로 시작하기','gIn']];

/* 그린 뒤 손보기 */
function uxPost(){const mn=document.querySelector('main');if(!mn)return;const m=S.mode,v=S.view[m];
  if(!$('gIn')){const w=document.createElement('div');w.className='gbarx';w.innerHTML=`<input type="text" id="gIn" autocomplete="off" enterkeyhint="go" aria-label="한 줄 입력" placeholder="한 줄이면 됩니다 — 비 · 내일 2시 독서모임 12명 · 오늘은 6시에 닫습니다"><label class="gi" title="사진으로" aria-label="사진으로"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/></svg><input type="file" accept="image/*" data-c="${m==='store'?'feelPhoto':'dPhoto'}" hidden></label>${typeof micBtn==='function'&&micBtn('gIn')?`<button class="gi" data-a="micTo" data-id="gIn" aria-pressed="${!!S.ui.mic}" title="말하기" aria-label="말하기"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9.2" y="3.5" width="5.6" height="10.5" rx="2.8"/><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21"/></svg></button>`:''}<button class="gi go" data-a="gGo" title="만들기" aria-label="만들기"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`;mn.prepend(w);if(S.ui.gv)$('gIn').value=S.ui.gv}
  mn.querySelectorAll('.empty').forEach(c=>{if(c.querySelector('[data-a="foc"]'))return;const e=EMPTY.find(x=>x[0].test(c.textContent));if(e&&$(e[2])){const b=document.createElement('button');b.className='btn sm';b.dataset.a='foc';b.dataset.id=e[2];b.textContent=e[1];b.style.marginTop='10px';c.appendChild(document.createElement('br'));c.appendChild(b)}});
  if(m==='store'&&v==='cur')mn.querySelectorAll('[data-a="dpOpen"]').forEach(b=>{if(b.parentNode.querySelector('[data-a="setOpen"]'))return;const n=document.createElement('button');n.className='btn';n.dataset.a='setOpen';n.dataset.i=b.dataset.i;n.textContent='인쇄물 한 번에';b.after(n)});
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
function navCur(){const L=navList(),m=S.mode,v=S.view[m];let t=L.find(x=>x[2]===m&&x[0]===v);if(!t&&m==='aka'&&typeof GRP!=='undefined'&&GRP[v])t=L.find(x=>x[2]==='aka'&&x[0]===GRP[v]);if(!t&&m==='store'&&/^(design|dp)$/.test(v))t=L.find(x=>x[2]==='store'&&x[0]==='design')||L.find(x=>x[2]==='store'&&x[0]==='cur');if(!t)t=L.find(x=>x[2]===m&&x[0]==='more')||L.find(x=>x[2]===m)||L[0];return t[2]+':'+t[0]}
A.place=d=>{const k=d.k;if(k==='aka'){if(!akaCtx()){S.mode='store';S.view.store='cur'}}else{if(S.mode!=='store'){S.mode='store'}}A.br({k});window.scrollTo(0,0)};
(()=>{const h=A.home;A.home=d=>{if(akaCtx()){S.mode='store';S.br='aka';S.view.store='cur';try{ss.set('view',S.view)}catch(e){}window.scrollTo(0,0);render();return}return h(d)}})();
function navPost(){if(S.br==='all'||!S.br)S.br='aka';const hd=document.querySelector('header.top');if(!hd)return;const md=hd.querySelector('.mode');if(md)md.remove();let r2=hd.querySelector('.row2');const cur=akaCtx()?'aka':S.br,html=PLACES.map(([k,n])=>`<button class="brchip" data-a="place" data-k="${k}" aria-pressed="${cur===k}">${n}</button>`).join('');
  if(!r2){r2=document.createElement('div');r2.className='row2';r2.setAttribute('role','group');const bar=hd.querySelector('.bar');bar.after(r2)}r2.classList.add('places');r2.setAttribute('aria-label','곳 고르기');r2.innerHTML=html;
  hd.querySelectorAll('.bar .homeb').forEach(x=>x.remove());if(!hd.querySelector('.railf')){const f=document.createElement('div');f.className='railf';const mob=typeof vwMob==='function'&&vwMob();f.innerHTML=`<button data-a="gdOpen">가이드</button><button data-a="vw">${mob?'컴퓨터 화면':'휴대폰 화면'}</button>`;hd.appendChild(f)}
  const nv=hd.querySelector('nav.tabs');if(nv){const c=navCur();let al=0,cn=0;try{al=anomalies('all').length;cn=BR.reduce((a,b)=>a+cart(b.k).items.length,0)}catch(e){}nv.innerHTML=navList().map(([v,l,m,g])=>`${g?`<span class="tg">${g}</span>`:''}<button data-a="go" data-v="${v}" data-m="${m}" ${c===m+':'+v?'aria-current="page"':''}>${l}${v==='more'&&al?`<span class="b">${al}</span>`:''}${v==='stock'&&cn?`<span class="b" style="background:var(--pine)">${cn}</span>`:''}</button>`).join('')}}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{navPost()}catch(e){console.warn(e)}try{if(window.dialSync)window.dialSync()}catch(e){}}})();

/* ── 지점마다 절반은 다른 큐레이션. 앞의 셋은 모든 지점이 같고, 그 뒤는 지점 · 주마다 순서가 다르다. 다른 지점 것을 보고 가져올 수 있다 ── */
const hsh=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)/4294967296};
const brAdd=()=>{const L=ls.get('brAdd',[]);return Array.isArray(L)?L:[]};
const plName=k=>(PLACES.find(p=>p[0]===k)||[k,k])[1];
(()=>{const g=corners;corners=function(br){const C=g(br);try{const wk=Math.floor(new Date(TODAY+'T00:00:00').getTime()/6048e5),my=C.time.filter(t=>t.tone==='내 생각'),rest=C.time.filter(t=>t.tone!=='내 생각'),same=rest.slice(0,3),G=rest.slice(3).map(t=>[hsh(wk+'|'+t.title),t]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]),bi=Math.max(0,PLACES.findIndex(p=>p[0]===br)),st=G.length?(bi*Math.max(2,Math.floor(G.length/PLACES.length)))%G.length:0,mix=[...G.slice(st),...G.slice(0,st)];let P=[];try{P=pool(br)}catch(e){}
    const have=new Set([...my,...rest].map(t=>t.title)),got=brAdd().filter(x=>x.br===br&&x.t).map(x=>({...x.t,br,tone:'가져온 것',hook:x.t.hook||'',books:(x.t.books||[]).map(b=>P.find(p=>nt(p.t)===nt(b.t))||{...b,src:''})}));
    {const mx=mix.filter(t=>!got.some(q=>q.title===t.title));C.time=[...got,...my,...mx.slice(0,2),...same.slice(0,2),...mx.slice(2,3),...same.slice(2),...mx.slice(3)]}C.all=[...C.time,...C.data]}catch(e){console.warn(e)}return C}})();
A.peek=d=>{S.ui.peek=S.ui.peek===d.k?null:d.k;render()};
A.peekAdd=d=>{const k=S.ui.peek,src=(()=>{try{return corners(k).time.filter(t=>t.tone!=='가져온 것')[+d.i]}catch(e){return null}})();if(!src||!S.br)return;const L=brAdd().filter(x=>!(x.br===S.br&&x.t&&x.t.title===src.title)),t={title:src.title,hook:src.hook,sym:src.sym,bpal:src.bpal,ppal:src.ppal,place:src.place,until:src.until,pop:src.pop,band:src.band,from:k,books:(src.books||[]).slice(0,8).map(b=>({t:b.t,a:b.a,p:b.p,isbn:b.isbn,price:b.price,role:b.role,why:b.why}))};L.unshift({br:S.br,t});ls.set('brAdd',L.slice(0,40));toast(`${plName(k)}의 「${src.title}」을 ${plName(S.br)}에 넣었습니다`);render()};
A.peekDel=d=>{ls.set('brAdd',brAdd().filter(x=>!(x.br===S.br&&x.t&&x.t.title===d.t)));render()};
function peekHTML(){const me=S.br,others=PLACES.filter(p=>p[0]!==me),k=S.ui.peek&&S.ui.peek!==me?S.ui.peek:null,mine=brAdd().filter(x=>x.br===me&&x.t);let body='';
  if(k){let L=[];try{L=corners(k).time.filter(t=>t.tone!=='가져온 것').slice(0,8)}catch(e){}let cur=[];try{cur=corners(me).time.slice(0,6).map(t=>t.title)}catch(e){}
    body=`<div class="pkl">${L.map((t,i)=>{const has=mine.some(x=>x.t.title===t.title),top=cur.includes(t.title)&&!has;return `<div class="pkr"><div><b>${esc(t.title)}</b><p>${esc(t.hook||'')}</p><small>${(t.books||[]).slice(0,4).map(b=>esc(b.t)).join(' · ')}</small></div>${has?`<button class="btn sm" data-a="peekDel" data-t="${esc(t.title)}">빼기</button>`:top?`<span class="note">이미 앞에 있음</span>`:`<button class="btn sm pri" data-a="peekAdd" data-i="${i}">${plName(me)}에 넣기</button>`}</div>`}).join('')||'<p class="note">보여 줄 큐레이션이 없습니다.</p>'}</div>`}
  return `<div class="sec pks"><h2>다른 지점 큐레이션 <small class="note">맨 위 둘부터 지점마다 다릅니다. 다른 지점 것을 보고 가져올 수 있습니다${mine.length?` · 가져온 것 ${mine.length}개`:''}</small></h2></div><div class="chips pkc">${others.map(([q,n])=>`<button class="chip" data-a="peek" data-k="${q}" aria-pressed="${k===q}">${n}</button>`).join('')}</div>${body}`}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const mn=document.querySelector('main');if(mn&&S.mode==='store'&&S.view.store==='cur'&&!mn.querySelector('.pks')){const w=document.createElement('div');w.innerHTML=peekHTML();mn.append(...w.childNodes)}}catch(e){console.warn(e)}}})();

/* 큐레이션을 다른 지점에 그대로 복사 */
A.sendOpen=d=>{S.ui.sendI=+d.i;const t=(S.ui.cor||[])[+d.i];if(!t)return;let g=$('setp');if(!g){g=document.createElement('div');g.id='setp';document.body.append(g)}document.querySelectorAll('details.menu[open]').forEach(x=>x.open=false);
  g.innerHTML=`<div class="setb"><h3>다른 지점에 복사</h3><p>「${esc(t.title||'')}」을 책 목록 그대로 고른 지점의 큐레이션 맨 앞에 넣습니다. 재고 표시는 받는 지점 기준으로 다시 매겨집니다.</p><div class="chips">${PLACES.filter(p=>p[0]!==S.br).map(([k,n])=>{const has=brAdd().some(x=>x.br===k&&x.t&&x.t.title===t.title);return `<button class="chip" data-a="sendTo" data-k="${k}" aria-pressed="${has}">${n}${has?' · 넣음':''}</button>`}).join('')}</div><div class="btns"><button class="btn" data-a="setClose">닫기</button></div></div>`};
A.sendTo=d=>{const src=(S.ui.cor||[])[S.ui.sendI],k=d.k;if(!src)return;const had=brAdd().some(x=>x.br===k&&x.t&&x.t.title===src.title),L=brAdd().filter(x=>!(x.br===k&&x.t&&x.t.title===src.title));if(!had)L.unshift({br:k,t:{title:src.title,hook:src.hook,sym:src.sym,bpal:src.bpal,ppal:src.ppal,place:src.place,until:src.until,pop:src.pop,band:src.band,from:S.br,books:(src.books||[]).slice(0,8).map(b=>({t:b.t,a:b.a,p:b.p,isbn:b.isbn,price:b.price,role:b.role,why:b.why}))}});ls.set('brAdd',L.slice(0,40));toast(had?`${plName(k)}에서 뺐습니다`:`${plName(k)} 큐레이션 맨 앞에 넣었습니다`);A.sendOpen({i:S.ui.sendI})};

/* ── 가이드 안의 「서점 기초」: 움직이는 화면 안내와 따로 두는 읽을거리 ── */
A.gdTab=d=>{S.ui.gdTab=d.t;gdDraw();const g=$('guide');if(g)g.scrollTop=0};
A.bsGo=d=>{const e=document.getElementById('bs-'+d.id);if(e)e.scrollIntoView({block:'start'})};
function bsHTML(){const dl=L=>`<dl class="bsd">${L.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>`;
  return BASICS.map(s=>`<section id="bs-${s.id}"><h3>${s.t}${s.asof?`<small>${s.asof}</small>`:''}</h3><p class="bsl">${esc(s.lead)}</p>
    ${s.id==='flow'?`<div class="bsf" role="img" aria-label="출판사에서 북센을 거쳐 더숲 지점으로"><span>출판사</span><i>책</i><span class="on">북센<small>도매 · 총판</small></span><i>주문한 책</i><span>더숲 지점</span></div><p class="bsr">더숲 지점 → 북센 : 주문(오더북) · 반품</p>`:''}
    ${s.isbn?`<div class="bsn"><div class="bsg"><b>ISBN 13자리</b><div class="bsc">${s.isbn.map(([n,a,b])=>`<div><code>${n}</code><em>${a}</em><small>${b}</small></div>`).join('')}</div></div><div class="bsg"><b>부가기호 5자리</b><div class="bsc">${s.add.map(([n,a,b])=>`<div><code>${n}</code><em>${a}</em><small>${b}</small></div>`).join('')}</div></div></div>`:''}
    ${dl(s.items)}${s.more?`<h4>개념만 알아 둘 것</h4>${dl(s.more)}`:''}</section>`).join('')}
(()=>{const g0=gdDraw;gdDraw=function(){const tab=S.ui.gdTab==='b'?'b':'a',tabs=`<div class="gdtab" role="tablist"><button data-a="gdTab" data-t="a" aria-pressed="${tab==='a'}">화면 안내</button><button data-a="gdTab" data-t="b" aria-pressed="${tab==='b'}">서점 기초</button></div>`;
  if(tab==='a'){g0();const b=document.querySelector('#guide .gdb');if(b){const x=b.querySelector('.gdx');x.insertAdjacentHTML('afterend',tabs)}const g=$('guide');if(g)g.classList.remove('bs');return}
  let g=$('guide');if(!g){g0();g=$('guide')}g.classList.add('bs');g.innerHTML=`<div class="gdb bsb"><button class="gdx" data-a="gdClose" aria-label="닫기">닫기</button>${tabs}<div class="bsp"><h2>서점 기초</h2><p class="bsl">처음 서점 일을 하는 사람이 먼저 알아 둘 다섯 가지입니다.</p><div class="bsnav">${BASICS.map(s=>`<button data-a="bsGo" data-id="${s.id}">${s.t}</button>`).join('')}</div>${bsHTML()}</div></div>`}})();

/* 그림책 · 유아 · 아동 주제는 POP 을 「어린이」 느낌으로 연다 */
(()=>{const f=A.toDesign;A.toDesign=d=>{f(d);try{const D=S.ui.D,k=STY.indexOf('어린이');if(D&&D.kind==='pop'&&k>=0&&/그림책|어린이|아동|유아|동화|아이와/.test([D.head,D.body,D.book,D.tag].join(' '))){D.st=k;render()}}catch(e){}}})();

/* ── 큐레이션 첫 화면 = 면진열 벽. 주제 하나가 표지 한 장(위 색 띠 · 가운데 제목 · 아래 색 띠). 누르면 그 책이 펼쳐진다 ── */
const TONEC={'제철':['#c9a24a','#1c1c1a'],'다른 시선':['#003128','#f2eee3'],'말놀이':['#7d3a2b','#f2eee3'],'꾸준한':['#2b2b28','#f2eee3'],'내 생각':['#1f6b57','#f2eee3'],'가져온 것':['#3f5fa8','#ffffff']};
A.cOpen=d=>{const i=+d.i;S.ui.cOpen=S.ui.cOpen===i?null:i;render();if(S.ui.cOpen!=null){const e=document.querySelector('.pcard.on');if(e)e.scrollIntoView({block:'nearest',behavior:'smooth'})}};
function wallPost(){const mn=document.querySelector('main');if(!mn||S.mode!=='store'||S.view.store!=='cur'||mn.querySelector('.wall'))return;const cards=[...mn.querySelectorAll('.pcard')];if(!cards.length)return;const host=cards[0].parentNode,wall=document.createElement('div');wall.className='wall';let html='';
  cards.forEach((c,n)=>{const b=c.querySelector('[data-a="dpOpen"]'),i=b?+b.dataset.i:n,t=(S.ui.cor||[])[i]||{},tc=TONEC[t.tone]||TONEC['다른 시선'],bk=(t.books||[]).slice(0,5),inn=bk.filter(x=>x.src==='재고').length,on=S.ui.cOpen===i;c.classList.toggle('on',on);
    html+=`<button class="cv" data-a="cOpen" data-i="${i}" aria-expanded="${on}" style="--c:${tc[0]};--t:${tc[1]}"><span class="cvt"><em>${esc(t.tone||'')}</em><i>${String(n+1).padStart(2,'0')}</i></span><span class="cvm"><b>${esc(t.title||'')}</b><small>${esc(t.hook||'')}</small></span><span class="cvb">${bk.length}권${inn?` · 있음 ${inn}`:''}</span></button>`});
  wall.innerHTML=html;host.before(wall);host.classList.add('cvhost')}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{wallPost()}catch(e){console.warn(e)}}})();

/* ── 살아 있는 첫 화면: 표지 벽 위 「오늘의 소식」 한 줄, 어제 없던 표지에 「새」 ── */
let _tk=0;
function livePost(){const mn=document.querySelector('main');if(!mn)return;clearInterval(_tk);
  if(S.mode==='store'&&S.view.store==='cur'){const wall=mn.querySelector('.wall'),N=(window.NEWS&&NEWS.items)||[];
    if(wall&&N.length&&!mn.querySelector('.tick')){const t=document.createElement('button');t.className='tick';t.dataset.a='go';t.dataset.v='trend';t.dataset.m=akaCtx()?'aka':'store';let i=S.ui.tki|0;const put=()=>{const n=N[i%N.length];t.innerHTML=`<em>오늘의 소식</em><span>${esc(n.t)}</span><small>${esc(n.src||'')}</small>`};put();wall.before(t);_tk=setInterval(()=>{if(!document.body.contains(t)){clearInterval(_tk);return}i++;S.ui.tki=i;t.classList.add('sw');setTimeout(()=>{put();t.classList.remove('sw')},260)},4200)}
    if(wall){try{const k='cov.'+S.br,ts=[...wall.querySelectorAll('.cvm b')].map(b=>b.textContent);let r=ls.get(k,null);if(!r||r.d!==TODAY){r={d:TODAY,prev:r?r.cur:null,cur:ts};ls.set(k,r)}if(r.prev)wall.querySelectorAll('.cv').forEach(c=>{const b=c.querySelector('.cvm b');if(b&&!r.prev.includes(b.textContent)&&!c.querySelector('.cvn'))c.querySelector('.cvt em').insertAdjacentHTML('beforeend','<u class="cvn">새</u>')})}catch(e){}}}
  /* 해외 책 소식: 옮겨 읽기 + 원문 보기 + 책 정보 */
  if(S.view[S.mode]==='trend'&&!mn.querySelector('.wnews')){const N=((window.NEWS&&NEWS.items)||[]).filter(n=>n.tag==='해외');if(N.length){const h=[...mn.querySelectorAll('h3')].find(x=>/오늘의 소식/.test(x.textContent)),host=h&&h.closest('.card');if(host){const w=document.createElement('div');w.className='wnews';w.innerHTML=`<div class="sec"><h2>해외 책 소식 <small class="note">우리말로 줄여 옮겼습니다 · ${esc(NEWS.asOf||'')}</small></h2></div>${N.map(n=>`<article class="wn"><p class="wnm">${esc(n.src||'')} · ${esc(n.d||'')}</p><h3>${esc(n.t)}</h3>${n.sum?`<p class="wns">${esc(n.sum)}</p>`:`<p class="wns">${esc(n.why||'')}</p>`}${n.sum&&n.why?`<p class="wnw"><b>우리 지점에는</b> ${esc(n.why)}</p>`:''}${n.book&&n.book.t?`<p class="wnb"><b>기사에 나온 책</b> ${esc(n.book.t)}${n.book.a?` · ${esc(n.book.a)}`:''}${n.book.ko?` · 우리말 책 「${esc(n.book.ko)}」`:' · 우리말 책은 확인되지 않음'}</p>`:''}<a class="btn sm" href="${n.url}" target="_blank" rel="noopener">원문 보기</a></article>`).join('')}`;host.after(w)}}}
  /* 더보기: 메뉴에 이미 있는 것은 빼고, 반품은 주문 안으로 */
  if(S.mode==='store'&&S.view.store==='more'){const have=new Set(navList().map(x=>x[0]));mn.querySelectorAll('button.mrow[data-a="go"]').forEach(b=>{const v=b.dataset.v;if(v==='ret'||(v!=='more'&&have.has(v)))b.remove()})}}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{livePost()}catch(e){console.warn(e)}}})();
/* 주문 화면 안에 주문 | 반품 */
A.ordTab=d=>{S.ui.ordTab=d.t;render()};
(()=>{const f=V.store.stock;V.store.stock=()=>{const r=S.ui.ordTab==='r';return `<div class="subnav ordt" role="tablist"><button data-a="ordTab" data-t="o" aria-pressed="${!r}">주문</button><button data-a="ordTab" data-t="r" aria-pressed="${r}">반품</button></div>${r?V.store.ret():f()}`}})();
try{HELP.store.stock='떨어질 책을 담아 북센 주문을 준비하고, 같은 자리에서 반품 목록도 만듭니다. 확정은 사람이 합니다.';HELP.store.more='자주 쓰지 않는 화면을 모아 두었습니다.'}catch(e){}
