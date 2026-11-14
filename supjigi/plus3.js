/* 11/14 더하기 (참부장 00:09 「더하기는 전부」)
   1 사진이 곧 기록 · 아카 기획 코너 · 인물도서관 한 권 코너
   (4 느낌 지도는 QR이 찍힌 횟수를 받을 서버가 없어 보류) */

/* ── 평대 기록을 지점끼리 함께 (Claude 앱 안에서만: db plog/<id>) ── */
const PL3={on:false,sub:false};
const pl3Id=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const pl3Get=()=>{try{return JSON.parse(localStorage.getItem('sj.plog')||'[]')}catch(e){return []}};
const pl3Set=L=>{try{localStorage.setItem('sj.plog',JSON.stringify(L.slice(0,400)))}catch(e){}};
async function pl3Push(e){if(!shDB())return;try{const{id,...b}=e;await shDB().doc('plog/'+id).set(b)}catch(err){}}
function pl3Sub(){if(PL3.sub||!shDB())return;PL3.sub=true;
  try{shDB().collection('plog').onSnapshot(s=>{const L=pl3Get(),M=new Map(L.filter(e=>e.id).map(e=>[e.id,e]));let ch=false;
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
   <p class="note">진열 · 인쇄물 · 인스타 · 평대 사진을 남길 때마다 쌓입니다.${shDB()?'':' (이 화면에서는 이 기기에만 남습니다)'}</p>
   ${L.length?Object.entries(by).slice(0,24).map(([d,es])=>`<div class="pld"><b>${mdw(d)}</b>${es.map(e=>`<div class="plr pl3r">${e.th?`<img src="${e.th}" alt="">`:''}<span><b>${esc(e.t)}</b><i>${all?esc(brN(e.br))+' · ':''}${esc(e.k)}${e.books&&e.books.length?` · 책 ${e.books.length}권`:''}</i>${e.books&&e.books.length?`<small>${e.books.slice(0,6).map(esc).join(' · ')}</small>`:''}</span></div>`).join('')}</div>`).join(''):'<p class="lse">아직 기록이 없습니다. 큐레이션 카드에서 진열을 보내거나, 평대를 사진으로 남기면 쌓입니다.</p>'}
   <div class="igxa"><button class="btn pri" data-a="plMix">기록 섞어 새 평대</button><button class="btn" data-a="close">닫기</button></div></div>`)};

/* 아카 기획 코너 · 인물도서관 코너 (11/14 참부장): 장일순은 11/14 시작 전시용 기획 코너(여러 권 · 인쇄물 한 번에),
   신영복 · 이어령은 한 권씩. 주제는 BANK 에 넣어 큐레이션 벽과 같은 과정으로 만든다. */
const PL3K={jang:'장일순, 밥 한 그릇의 우주',shin:'신영복 한 권 — 감옥으로부터의 사색',lee:'이어령 한 권 — 마지막 수업'};
try{const akaOn=()=>S.br==='aka'&&TODAY<='2026-12-31';
  BANK.push({tone:'제철',t:PL3K.jang,tg:'기획 코너 · 전시',why:'원주의 스승 무위당 장일순. 생명과 협동을 말한 그의 책과, 그와 이어진 책들을 한자리에 놓습니다.',sym:'leaf',bp:2,pp:1,k:/^$/,end:'2026-12-31',noDue:true,sc:c=>akaOn()?99:0,
   fixed:[['나락 한 알 속의 우주','장일순','녹색평론사'],['좁쌀 한 알','최성현','도솔'],['무위당 장일순의 노자 이야기','장일순 · 이현주',''],['장일순 평전','김삼웅',''],['밥','김지하',''],['스핑크스의 코','리영희','까치'],['도덕경','노자',''],['월든','헨리 데이비드 소로','']]});
}catch(e){console.warn(e)}
/* 한 권 코너: 큐레이션 벽 주제(3권 이상)와 따로, 화면을 그릴 때마다 S.ui.cor 끝에 붙여 POP · 인쇄물을 같은 과정으로 만든다 */
const PL3ONE=[[PL3K.shin,'신영복','감옥으로부터의 사색','돌베개','20년 20일, 갇힌 자리에서 쓴 편지들. 1988년 햇빛출판사에서 나온 첫 책(초판)이 사유의숲 인물도서관 서가에 있습니다. 그 책을 펼쳐 보고, 지금 판을 한 권 가져가세요.','비를 함께\n맞는 것입니다.','초판 1988 · 인물도서관 서가'],[PL3K.lee,'이어령','이어령의 마지막 수업','열림원','세상을 떠나기 전, 묻고 답하며 남긴 마지막 이야기.']];
function pl3OneAdd(){if(S.br!=='aka'||!Array.isArray(S.ui.cor))return;PL3ONE.forEach(([title,who,bt,pub,why,hd,nt0],k)=>{if(S.ui.cor.some(x=>x&&x.title===title))return;
  S.ui.cor.push({tone:'꾸준한',tg:'인물도서관 코너',title,hook:why,sym:'book',bpal:4+k,ppal:1,until:'2026-12-31',place:'인물도서관',books:[{t:bt,a:who==='이어령'?'김지수 · 이어령':who,p:pub,role:'중심',src:''}],pop:{head:hd||`${who},\n『${bt}』`,body:hd?`${who} 『${bt}』 — ${why}`:why},note:nt0||'',line:hd?hd.replace(/\n/g,' '):'',band:`${who} 『${bt}』`,br:'aka'})})}
try{POPQX[PL3K.shin]='신영복 『감옥으로부터의 사색』 1988년 초판이 인물도서관 서가에 있습니다. 펼쳐 보세요.'}catch(e){}
const pl3Ix=t=>{try{return (S.ui.cor||[]).findIndex(x=>x&&x.title===t)}catch(e){return -1}};
function pl3Corner(){if(S.br!=='aka')return '';pl3OneAdd();const j=pl3Ix(PL3K.jang),a=pl3Ix(PL3K.shin),b=pl3Ix(PL3K.lee),J=j>=0?S.ui.cor[j]:null;
  const one=(i,n)=>{if(i<0)return '';const t=S.ui.cor[i],bk=(t.books||[])[0]||{};return `<div class="pl3one"><em>${n}</em><b>『${esc(bk.t||'')}』</b>${bk.a&&bk.a!==n?`<i>${esc(bk.a)}</i>`:''}${t.line?`<i class="pl3q">「${esc(t.line)}」${t.note?` · ${esc(t.note)}`:''}</i>`:''}<span><button class="btn sm" data-a="toDesign" data-kind="pop" data-s="c" data-i="${i}">POP</button><button class="btn sm" data-a="setOpen" data-i="${i}">인쇄물 한 번에</button></span></div>`};
  return `${J?`<section class="pl3pc" aria-label="기획 코너"><header><em>기획 코너 · ${TODAY==='2026-11-14'?'오늘 전시 시작':'전시 중'}</em><span>사유의숲 인물도서관 · ${J.books.length}권</span></header>
   <b>장일순</b><p>${esc(J.hook||'')}</p><ul>${J.books.map(x=>`<li>『${esc(x.t)}』</li>`).join('')}</ul>
   <div class="pl3pcb"><button class="btn" data-a="setOpen" data-i="${j}">인쇄물 한 번에 (POP · 쇼카드 · 목록 · 띠지)</button><button class="btn ghost" data-a="dpOpen" data-i="${j}">진열 보기</button></div></section>`:''}
   ${a>=0||b>=0?`<section class="pl3ones" aria-label="인물도서관 코너"><h3>인물도서관 코너 · 한 권씩</h3>${one(a,'신영복')}${one(b,'이어령')}</section>`:''}`}

/* ── 홈 큐레이션에 붙이기: 도구 줄 + 이어지는 것 ── */
(()=>{const r=render;render=function(){r.apply(this,arguments);try{if(S.locked)return;pl3Sub();if(typeof arcStart==='function'&&ARC.st==='idle')arcStart();
  const mn=document.querySelector('main');if(!mn||S.mode!=='store'||S.view.store!=='cur'||S.br==='all'||mn.querySelector('.pl3t'))return;
  const anchor=mn.querySelector('.plbar')||mn.querySelector('.wall');if(!anchor)return;
  const w=document.createElement('div');w.innerHTML=`<div class="pl3t" role="group" aria-label="평대 사진"><label class="pl3b"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>평대 사진 남기기<input type="file" accept="image/*" capture="environment" data-c="pl3Ph" hidden></label></div>${pl3Corner()}`;
  anchor.after(...w.childNodes)}catch(e){console.warn(e)}}})();
