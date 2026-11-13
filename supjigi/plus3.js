/* 11/14 더하기 (참부장 00:09 「더하기는 전부」)
   1 사진이 곧 기록 · 2 책의 일생 · 6 인물도서관 코너(아카) · 7 오늘 한 장
   (4 느낌 지도는 QR이 찍힌 횟수를 받을 서버가 없어 보류) */

/* ── 평대 기록을 지점끼리 함께 (Claude 앱 안에서만: db plog/<id>) ── */
const PL3={on:false,sub:false};
const pl3Id=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const pl3Get=()=>{try{return JSON.parse(localStorage.getItem('sj.plog')||'[]')}catch(e){return []}};
const pl3Set=L=>{try{localStorage.setItem('sj.plog',JSON.stringify(L.slice(0,400)))}catch(e){}};
async function pl3Push(e){if(!(typeof DB!=='undefined'&&DB))return;try{const{id,...b}=e;await DB.doc('plog/'+id).set(b)}catch(err){}}
function pl3Sub(){if(PL3.sub||!(typeof DB!=='undefined'&&DB))return;PL3.sub=true;
  try{DB.collection('plog').onSnapshot(s=>{const L=pl3Get(),M=new Map(L.filter(e=>e.id).map(e=>[e.id,e]));let ch=false;
    s.docs.forEach(d=>{const v={...d.data(),id:d.id},o=M.get(d.id);if(!o||JSON.stringify(o)!==JSON.stringify(v)){M.set(d.id,v);ch=true}});
    if(ch){const out=[...M.values(),...L.filter(e=>!e.id)].sort((a,b)=>(b.d+(b.at||''))<(a.d+(a.at||''))?-1:1);pl3Set(out);if(S.mode==='store'&&S.view.store==='cur')softRender()}},()=>{})}catch(e){}}
/* plogAdd 를 감싸 id · 책 목록 · 시각을 붙이고 함께 저장 */
(()=>{const f=plogAdd;plogAdd=function(k,t){const n0=pl3Get().length;f.apply(this,arguments);const L=pl3Get();if(L.length>n0&&L[0]&&!L[0].id){L[0].id=pl3Id();L[0].at=new Date().toISOString();try{const bs=(t&&t.books||[]).map(b=>b.t||b).filter(Boolean).slice(0,12);if(bs.length)L[0].books=bs}catch(e){}pl3Set(L);pl3Push(L[0])}}})();

/* ── 1 사진이 곧 기록 ── */
C.pl3Ph=async el=>{const f=el.files&&el.files[0];el.value='';if(!f)return;if(S.br==='all'){toast('지점을 먼저 고르세요');return}
  let th='';try{th=await arcShrink(f,480,60000)}catch(e){}
  let out=null;if(typeof AI!=='undefined'&&AI){toast('사진 속 책을 읽는 중…');out=await ask('pl3ph','서점 평대(책을 눕혀 놓은 탁자)나 서가 사진입니다. 보이는 책 제목을 읽고, 이 평대가 무슨 주제로 묶였는지 한 줄로 짓습니다. 제목은 실제로 읽힌 것만, 기억으로 채우지 않습니다. 주제는 15자 안의 담백한 말(느낌표 · 과장 금지).\nJSON 으로만: {"theme":"","books":["제목"]}',{images:[f]})}
  let theme=(out&&out.theme||'').trim(),books=(out&&Array.isArray(out.books)?out.books:[]).map(x=>String(x).trim()).filter(Boolean).slice(0,16);
  if(!theme){theme=(prompt('이 평대의 주제를 한 줄로 적어 주세요','')||'').trim();if(!theme){toast('남기지 않았습니다');return}}
  const e={id:pl3Id(),d:TODAY,at:new Date().toISOString(),br:S.br,t:theme.slice(0,40),k:'사진',books,th};const L=pl3Get();L.unshift(e);pl3Set(L);pl3Push(e);
  if(S.br==='aka'&&typeof arcSave==='function'){try{if(ARC.st==='idle')await arcStart();const id=arcId(),img=[];try{const full=await arcShrink(f,1600,240000);if(await arcImgPut(id+'-0',full))img.push(id+'-0')}catch(e){}
    await arcSave({id,date:TODAY,time:arcNow().time,t:`평대 「${e.t}」`+(books.length?` — ${books.slice(0,5).join(', ')}${books.length>5?' 외':''}`:''),k:'공간',iss:'평대',box:'',th:th?[th]:[],img,at:e.at})}catch(err){}}
  toast(books.length?`「${e.t}」 · 책 ${books.length}권을 남겼습니다`:`「${e.t}」를 남겼습니다`);render()};

/* ── 평대 기록 창 (사진 · 책 · 다른 지점) ── */
A.plOpen=d=>{if(d&&d.all!==undefined)S.ui.plAll=!!d.all;const all=!!S.ui.plAll,L=pl3Get().filter(e=>all||e.br===S.br),by={};L.forEach(e=>{(by[e.d]=by[e.d]||[]).push(e)});
  openSheet(`<div class="plx"><div class="igxh"><b>평대 기록</b><span>${all?'모든 지점':esc(brN(S.br))} · ${L.length}건</span></div>
   <div class="pl3seg"><button data-a="plOpen" data-all="" aria-pressed="${!all}">이 지점</button><button data-a="plOpen" data-all="1" aria-pressed="${all}">모든 지점</button></div>
   <p class="note">진열 · 인쇄물 · 인스타 · 평대 사진을 남길 때마다 쌓입니다.${typeof DB!=='undefined'&&DB?'':' (이 화면에서는 이 기기에만 남습니다)'}</p>
   ${L.length?Object.entries(by).slice(0,24).map(([d,es])=>`<div class="pld"><b>${mdw(d)}</b>${es.map(e=>`<div class="plr pl3r">${e.th?`<img src="${e.th}" alt="">`:''}<span><b>${esc(e.t)}</b><i>${all?esc(brN(e.br))+' · ':''}${esc(e.k)}${e.books&&e.books.length?` · 책 ${e.books.length}권`:''}</i>${e.books&&e.books.length?`<small>${e.books.slice(0,6).map(esc).join(' · ')}</small>`:''}</span></div>`).join('')}</div>`).join(''):'<p class="lse">아직 기록이 없습니다. 큐레이션 카드에서 진열을 보내거나, 평대를 사진으로 남기면 쌓입니다.</p>'}
   <div class="igxa"><button class="btn pri" data-a="plMix">기록 섞어 새 평대</button><button class="btn" data-a="close">닫기</button></div></div>`)};

/* ── 2 책의 일생 ── */
function pl3Life(q){const k=nt(q),isb=(String(q).match(/97[89]\d{10}/)||[])[0]||'';if(!k&&!isb)return null;
  const hit=t=>{const n=nt(t);return n&&(n===k||(k.length>=3&&n.includes(k))||(n.length>=3&&k.includes(n)))};
  let name=q;const ev=[];
  pl3Get().forEach(e=>{const b=(e.books||[]).find(hit);if(b||hit(e.t)){if(b)name=b;ev.push({d:e.d,w:`${brN(e.br)} 평대 「${e.t}」`,k:e.k,g:e.g})}});
  try{(ARC.L||[]).forEach(x=>{if(hit(x.t)||(x.t||'').includes(q))ev.push({d:x.date,w:`아카이브 · ${x.t}`,k:x.k})})}catch(e){}
  const stock=[];try{BR.forEach(b=>{const p=pool(b.k).find(z=>(isb&&z.isbn===isb)||hit(z.t));if(p){name=p.t;stock.push({br:b.n,n:p.here||0,sold:p.mine||0})}})}catch(e){}
  const rank=[];try{const BK=window.BOOKS||{};[['kyobo','교보'],['yes24','예스24'],['aladin','알라딘']].forEach(([s,n])=>{const L=BK[s]||[],i=L.findIndex(z=>(isb&&z.isbn===isb)||hit(z.t));if(i>=0){rank.push(`${n} ${i+1}위`);if(L[i].t)name=L[i].t}})}catch(e){}
  ev.sort((a,b)=>a.d<b.d?1:-1);return{name,ev,stock,rank}}
A.pl3LifeOpen=d=>{const q=(d&&d.q)||S.ui.lifeQ||'',r=q?pl3Life(q):null;S.ui.lifeQ=q;
  openSheet(`<div class="plx pl3life"><div class="igxh"><b>책의 일생</b><span>한 권이 지나온 평대 · 지점 · 순위</span></div>
   <div class="pl3q"><input id="lifeQ" value="${esc(q)}" placeholder="제목이나 ISBN" enterkeyhint="search"><label class="btn" aria-label="바코드 사진">바코드<input type="file" accept="image/*" capture="environment" data-c="pl3LifeBc" hidden></label><button class="btn pri" data-a="pl3LifeGo">찾기</button></div>
   ${!r?'<p class="note">책 제목이나 바코드로 찾으면, 이 책이 언제 어느 지점에서 무슨 주제로 평대에 올랐는지, 지금 어느 지점에 있는지, 순위는 어떤지 한 줄로 이어 보여 줍니다.</p>'
   :`<h3 class="pl3n">${esc(r.name)}</h3>
   ${r.rank.length?`<p class="pl3k">${r.rank.join(' · ')}</p>`:''}
   ${r.stock.length?`<div class="pl3st">${r.stock.map(s=>`<span><b>${esc(s.br)}</b>${s.n?`${s.n}권`:'없음'}</span>`).join('')}</div>`:''}
   ${r.ev.length?`<ol class="pl3tl">${r.ev.slice(0,30).map(e=>`<li><b>${mdw(e.d)}</b><span>${esc(e.w)}</span><i>${esc(e.k||'')}</i></li>`).join('')}</ol>`:'<p class="lse">아직 평대 · 아카이브 기록에 이 책이 없습니다. 이 책이 든 평대를 사진으로 남기면 여기부터 일생이 쌓입니다.</p>'}`}
   <div class="igxa"><button class="btn" data-a="close">닫기</button></div></div>`);setTimeout(()=>{const i=$('lifeQ');if(i&&!q)i.focus()},50)};
A.pl3LifeGo=()=>{const v=(($('lifeQ')||{}).value||'').trim();if(!v){toast('제목이나 ISBN을 적어 주세요');return}A.pl3LifeOpen({q:v})};
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='lifeQ'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.pl3LifeGo()}});
C.pl3LifeBc=async el=>{const f=el.files&&el.files[0];el.value='';if(!f)return;let c=[];try{c=await bcFromFile(f)}catch(e){}if(c[0])A.pl3LifeOpen({q:c[0]});else toast('바코드를 읽지 못했습니다. 크게 찍거나 제목을 적어 주세요')};

/* ── 3 1년 전 오늘 · 5 지점 릴레이 · 6 인물도서관의 사람 ── */
const pl3Btn=(v,l)=>`<button class="btn sm" data-a="gGo" data-v="${esc(v)}">${l}</button>`;
/* 아카 기획 코너 · 인물도서관 코너 (11/14 참부장): 장일순은 다음 주 전시용 기획 코너(여러 권 · 인쇄물 한 번에),
   신영복 · 이어령은 한 권씩. 주제는 BANK 에 넣어 큐레이션 벽과 같은 과정으로 만든다. */
const PL3K={jang:'장일순, 밥 한 그릇의 우주',shin:'신영복 한 권 — 감옥으로부터의 사색',lee:'이어령 한 권 — 마지막 수업'};
try{const akaOn=()=>S.br==='aka'&&TODAY<='2026-12-31';
  BANK.push({tone:'제철',t:PL3K.jang,tg:'기획 코너 · 전시',why:'원주의 스승 무위당 장일순. 생명과 협동을 말한 그의 책과, 그와 이어진 책들을 한자리에 놓습니다.',sym:'leaf',bp:2,pp:1,k:/^$/,end:'2026-12-31',sc:c=>akaOn()?99:0,
   fixed:[['나락 한 알 속의 우주','장일순','녹색평론사'],['좁쌀 한 알','최성현','도솔'],['무위당 장일순의 노자 이야기','장일순 · 이현주',''],['장일순 평전','김삼웅',''],['밥','김지하',''],['스핑크스의 코','리영희','까치'],['도덕경','노자',''],['월든','헨리 데이비드 소로','']]});
}catch(e){console.warn(e)}
/* 한 권 코너: 큐레이션 벽 주제(3권 이상)와 따로, 화면을 그릴 때마다 S.ui.cor 끝에 붙여 POP · 인쇄물을 같은 과정으로 만든다 */
const PL3ONE=[[PL3K.shin,'신영복','감옥으로부터의 사색','돌베개','갇힌 자리에서 쓴 편지가 가장 넓은 생각이 되었습니다.'],[PL3K.lee,'이어령','이어령의 마지막 수업','열림원','세상을 떠나기 전, 묻고 답하며 남긴 마지막 이야기.']];
function pl3OneAdd(){if(S.br!=='aka'||!Array.isArray(S.ui.cor))return;PL3ONE.forEach(([title,who,bt,pub,why],k)=>{if(S.ui.cor.some(x=>x&&x.title===title))return;
  S.ui.cor.push({tone:'꾸준한',tg:'인물도서관 코너',title,hook:why,sym:'book',bpal:4+k,ppal:1,until:'2026-12-31',place:'인물도서관',books:[{t:bt,a:who==='이어령'?'김지수 · 이어령':who,p:pub,role:'중심',src:''}],pop:{head:`${who},\n『${bt}』`,body:why},band:`${who} 『${bt}』`,br:'aka'})})}
const pl3Ix=t=>{try{return (S.ui.cor||[]).findIndex(x=>x&&x.title===t)}catch(e){return -1}};
function pl3Corner(){if(S.br!=='aka')return '';pl3OneAdd();const j=pl3Ix(PL3K.jang),a=pl3Ix(PL3K.shin),b=pl3Ix(PL3K.lee),J=j>=0?S.ui.cor[j]:null;
  const one=(i,n)=>{if(i<0)return '';const t=S.ui.cor[i],bk=(t.books||[])[0]||{};return `<div class="pl3one"><em>${n}</em><b>『${esc(bk.t||'')}』</b><i>${esc(bk.a||'')}</i><span><button class="btn sm" data-a="toDesign" data-kind="pop" data-s="c" data-i="${i}">POP</button><button class="btn sm" data-a="setOpen" data-i="${i}">인쇄물 한 번에</button></span></div>`};
  return `${J?`<section class="pl3pc" aria-label="기획 코너"><header><em>기획 코너 · 다음 주 전시</em><span>사유의숲 인물도서관 · ${J.books.length}권</span></header>
   <b>장일순</b><p>${esc(J.hook||'')}</p><ul>${J.books.map(x=>`<li>『${esc(x.t)}』</li>`).join('')}</ul>
   <div class="pl3pcb"><button class="btn" data-a="setOpen" data-i="${j}">인쇄물 한 번에 (POP · 쇼카드 · 목록 · 띠지)</button><button class="btn ghost" data-a="dpOpen" data-i="${j}">진열 보기</button></div></section>`:''}
   ${a>=0||b>=0?`<section class="pl3ones" aria-label="인물도서관 코너"><h3>인물도서관 코너 · 한 권씩</h3>${one(a,'신영복')}${one(b,'이어령')}</section>`:''}`}

/* ── 7 오늘 한 장 (매장 직원용 1080×1350) ── */
async function pl3Sheet(){const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  try{await document.fonts.ready}catch(e){}
  const F=(w,s)=>`${w} ${s}px Pretendard, sans-serif`,G=(s)=>`700 ${s}px "Gowun Batang","Noto Serif CJK KR",serif`;
  x.fillStyle='#fbfaf6';x.fillRect(0,0,W,H);x.fillStyle='#003128';x.fillRect(0,0,W,14);
  const wrap=(t,X,Y,mw,lh,font,col,max=3)=>{x.font=font;x.fillStyle=col;let line='',n=0;for(const ch of String(t)){const tt=line+ch;if(x.measureText(tt).width>mw&&line){x.fillText(line,X,Y);Y+=lh;line=ch.trim()}else line=tt}if(line){x.fillText(line,X,Y);Y+=lh}return Y};
  const d=pd(TODAY);let y=110;x.font=F(600,28);x.fillStyle='#6b6b63';x.fillText(`${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()} ${WD[d.getDay()]}요일 · ${brN(S.br)}`,72,y);
  y+=80;x.font=G(64);x.fillStyle='#1c1c1a';x.fillText('오늘 한 장',72,y);y+=40;x.fillStyle='#1c1c1a';x.fillRect(72,y,W-144,3);y+=60;
  const sec=(lab,body,sub)=>{x.font=F(700,24);x.fillStyle='#8a6a10';x.fillText(lab,72,y);y+=48;y=wrap(body,72,y,W-144,52,F(700,40),'#1c1c1a');if(sub){y=wrap(sub,72,y-6,W-144,40,F(500,28),'#55554f')}y+=26;x.fillStyle='#e2ddd0';x.fillRect(72,y,W-144,1);y+=52};
  let cor=[];try{cor=(S.ui.cor||[]).slice(0,2)}catch(e){}
  if(cor[0])sec('오늘 바꿀 평대',`「${cor[0].title}」`,(cor[0].books||[]).slice(0,4).map(b=>b.t).join(' · '));
  if(cor[1])sec('다음 후보',`「${cor[1].title}」`,(cor[1].books||[]).slice(0,3).map(b=>b.t).join(' · '));
  try{const n=(window.NEWS&&NEWS.items||[])[0];if(n)sec('오늘 아침 소식',n.t,n.src||'')}catch(e){}
  try{if(typeof gcDay==='function'&&GC&&GC.st==='ok'){const g=gcDay(TODAY).slice(0,3);if(g.length)sec('아카데미 오늘',g.map(z=>`${z.time?z.time+' ':''}${z.org}`).join(' / '),'')}}catch(e){}
  if(S.br==='aka'&&y<H-240){const j=pl3Ix(PL3K.jang);if(j>=0)sec('기획 코너 · 장일순',`『${(S.ui.cor[j].books[0]||{}).t||''}』 외 ${S.ui.cor[j].books.length-1}권`,'다음 주 전시')}
  x.font=F(500,22);x.fillStyle='#9a958a';x.fillText('더숲 워크룸 · Planned by 쿼부장',72,H-56);
  return new Promise(ok=>c.toBlob(b=>ok(b),'image/png'))}
A.pl3Day=async()=>{if(S.br==='all'){toast('지점을 먼저 고르세요');return}toast('한 장을 만드는 중…');const b=await pl3Sheet();if(!b){toast('만들지 못했습니다');return}
  const name=`더숲_오늘한장_${TODAY}_${brN(S.br)}.png`;try{const f=new File([b],name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'오늘 한 장'});return}}catch(e){if(e&&e.name==='AbortError')return}
  saveFile(name,b)};

/* ── 홈 큐레이션에 붙이기: 도구 줄 + 이어지는 것 ── */
(()=>{const r=render;render=function(){r.apply(this,arguments);try{if(S.locked)return;pl3Sub();if(typeof arcStart==='function'&&ARC.st==='idle')arcStart();
  const mn=document.querySelector('main');if(!mn||S.mode!=='store'||S.view.store!=='cur'||S.br==='all'||mn.querySelector('.pl3t'))return;
  const anchor=mn.querySelector('.plbar')||mn.querySelector('.wall');if(!anchor)return;
  const w=document.createElement('div');w.innerHTML=`<div class="pl3t" role="group" aria-label="평대 도구"><label class="pl3b"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>평대 사진 남기기<input type="file" accept="image/*" capture="environment" data-c="pl3Ph" hidden></label><button class="pl3b" data-a="pl3LifeOpen">책의 일생</button><button class="pl3b" data-a="pl3Day">오늘 한 장</button></div>${pl3Corner()}`;
  anchor.after(...w.childNodes)}catch(e){console.warn(e)}}})();
