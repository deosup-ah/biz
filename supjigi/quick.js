/* 더숲 워크룸 — 오늘: 캘린더 자동 + 한 줄 입력 · 사진으로 만들기 · 아카데미 주제 · 굿즈 제안 */
const GCID='7dffddc55d74289b36e08e3cf6e03ed143131648f770c61de7dcb8e1a9ac30f1@group.calendar.google.com';
const GC={st:'idle',ev:[],at:0,code:''};
/* ── 구글 캘린더(단체 예약) 읽기. 읽기만 한다. 손님 개인 이름은 지운다. ── */
function gcParse(L){return (L||[]).map(e=>{const s=(e.start||{}),en=(e.end||{}),from=(s.date||(s.dateTime||'').slice(0,10)),to=(en.date||(en.dateTime||'').slice(0,10));
  const m=/^\s*\[(.+?)\]\s*(.+?)\s+[—–-]\s+(.+)$/.exec(e.summary||'');let st=m?m[1]:'',org=m?m[2]:(e.summary||''),sp=m?m[3]:'';
  if(org.includes(' / '))org=org.split(' / ').slice(1).join(' / ');org=org.split(' · ')[0].replace(/01\d[- ]?\d{3,4}[- ]?\d{4}/g,'').trim();
  const tm=/(\d{1,2}:\d{2})\s*[–~-]\s*(\d{1,2}:\d{2})/.exec((e.description||'').split('\n')[0]||'');
  let time=tm?tm[1].padStart(5,'0'):'',end=tm?tm[2].padStart(5,'0'):'';if(!time&&s.dateTime){time=s.dateTime.slice(11,16);end=(en.dateTime||'').slice(11,16)}
  const rm=/객실\s*(\d+)\s*실/.exec(sp);return{from,to:s.date?to:addDays(to||from,1),org,sp,st,time,end,rooms:rm?+rm[1]:0}}).filter(x=>x.from&&x.org)}
function gcDay(d){const G={};GC.ev.filter(x=>x.from<=d&&d<x.to).forEach(x=>{const g=G[x.org]=G[x.org]||{org:x.org,rooms:0,sp:[],time:'',st:x.st,in:false};
  if(x.rooms){g.rooms+=x.rooms;if(x.from===d)g.in=true}else if(x.from===d||!x.time){g.sp.push(x.sp+(x.time?` ${x.time}–${x.end}`:''));if(x.time&&(!g.time||x.time<g.time))g.time=x.time}});
  return Object.values(G).filter(g=>g.rooms||g.sp.length).sort((a,b)=>(a.time||'99')<(b.time||'99')?-1:1)}
async function gcLoad(force){if(!(window.claude&&window.claude.use)){GC.st='none';return}if(GC.st==='load')return;GC.st='load';
  try{const m=await window.claude.use('mcp');if(!m){GC.st='none';render();return}
    const r=await m.callTool('Google Calendar','list_events',{calendarId:GCID,startTime:TODAY+'T00:00:00',endTime:addDays(TODAY,8)+'T00:00:00',orderBy:'startTime',pageSize:250},{cache:force?{refresh:true,gcTime:36e5}:{staleTime:6e5,gcTime:36e5}});
    let p=r&&r.payload;if(typeof p==='string'){try{p=JSON.parse(p)}catch(e){p=null}}GC.ev=gcParse((p&&p.events)||[]);GC.st='ok';GC.at=(r&&r.cache&&r.cache.storedAt)||Date.now()}
  catch(e){GC.st='err';GC.code=(e&&e.code)||'upstream_error';if(/needs_reauth|server_not_connected|not_in_manifest|blocked_by_policy|approval_required|consent_required/.test(GC.code))GC.ev=[]}
  render()}
A.gcRe=()=>{GC.st='idle';gcLoad(true);render()};
const gcMsg=()=>GC.st==='load'?'캘린더 읽는 중…':GC.st==='ok'?`구글 캘린더 자동 · ${new Date(GC.at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})} 기준`:GC.st==='err'?(/needs_reauth|server_not_connected|selection_required/.test(GC.code)?'claude.ai 설정 → 커넥터에서 Google Calendar 를 연결하면 단체 일정이 자동으로 보입니다.':/not_in_manifest|approval_required|consent_required|not_granted/.test(GC.code)?'캘린더 사용을 허용하면 단체 일정이 자동으로 보입니다.':/blocked_by_policy/.test(GC.code)?'조직 정책으로 캘린더를 읽을 수 없습니다.':'지금은 캘린더를 읽지 못했습니다.'):'';

/* ── 한 줄 입력: "내일 2시 한살림 연수 30명 대화의 집" ── */

function qParse(raw){let s=' '+(raw||'').replace(/01\d[- ]?\d{3,4}[- ]?\d{4}/g,' ').replace(/\s+/g,' ').trim()+' ';if(!s.trim())return null;
  let date=TODAY,time='',end='',booked,place='',m;const Y=+TODAY.slice(0,4),cut=x=>{s=s.replace(x,' ')},p2=n=>String(n).padStart(2,'0'),fix=(mo,d)=>{let t=`${Y}-${p2(mo)}-${p2(d)}`;if(dayDiff(TODAY,t)>60)t=`${Y+1}-${p2(mo)}-${p2(d)}`;return t};
  if(m=/(\d{1,2})\s*월\s*(\d{1,2})\s*일?/.exec(s)){date=fix(+m[1],+m[2]);cut(m[0])}
  else if((m=/(?:^|\s)(\d{1,2})[\/.](\d{1,2})(?![\d:시])/.exec(s))&&+m[1]<=12&&+m[2]<=31){date=fix(+m[1],+m[2]);cut(m[0])}
  else if(m=/\s(오늘|내일|모레|글피)(?=\s)/.exec(s)){date=addDays(TODAY,{오늘:0,내일:1,모레:2,글피:3}[m[1]]);cut(m[0])}
  else if(m=/(다음\s*주|담주|이번\s*주)?\s*([월화수목금토일])요일/.exec(s)||/(다음\s*주|담주|이번\s*주)\s*([월화수목금토일])(?=\s)/.exec(s)){const w='일월화수목금토'.indexOf(m[2]),now=pd(TODAY).getDay();let n=(w-now+7)%7;if(m[1]&&/다음|담/.test(m[1])){const toMon=((8-now)%7)||7;n=toMon+((w+6)%7)}date=addDays(TODAY,n);cut(m[0])}
  else if(m=/(?:^|\s)(\d{1,2})일(?=\s)/.exec(s)){const d=+m[1];let mo=+TODAY.slice(5,7),t=`${Y}-${p2(mo)}-${p2(d)}`;if(t<TODAY){mo=mo%12+1;t=`${mo===1?Y+1:Y}-${p2(mo)}-${p2(d)}`}date=t;cut(m[0])}
  const hh=(ap,h)=>{h=+h;if(/오후|저녁|밤/.test(ap||'')&&h<12)h+=12;else if(!ap&&h>=1&&h<=7)h+=12;return h};
  if(m=/(오전|오후|아침|낮|저녁|밤)?\s*(\d{1,2})\s*[~\-–]\s*(\d{1,2})\s*시/.exec(s)){const a=hh(m[1],m[2]);let b=hh(m[1],m[3]);if(b<=a)b+=12;time=p2(a)+':00';end=p2(b%24)+':00';cut(m[0])}
  else if(m=/(오전|오후|아침|낮|저녁|밤)?\s*(\d{1,2})(?::(\d{2})|\s*시\s*(반|(\d{1,2})\s*분)?)/.exec(s)){time=p2(hh(m[1],m[2]))+':'+(m[3]||(m[4]==='반'?'30':m[5]?p2(m[5]):'00'));cut(m[0]);}
  if(m=/(\d{1,4})\s*(명|인)(?![가-힣])/.exec(s)){booked=+m[1];cut(m[0])}
  for(const p of QPL){const i=s.replace(/\s/g,'').indexOf(p.replace(/\s/g,''));if(i>=0&&s.includes(p)){place=p;cut(p);break}}
  const title=s.replace(/\s+/g,' ').replace(/^[\s,·-]+|[\s,·-]+$/g,'').trim();if(!title)return null;
  const kind=/영화|상영/.test(title)?'영화':/북토크|저자|작가와/.test(title)?'북토크':/책모임|독서|읽기|낭독/.test(title)?'책모임':/강연|클래스|수업|프로그램|요가|명상/.test(title)?'프로그램':'기타';
  const o={kind,title,date,time,place,memo:end?`~${end}`:''};if(booked!=null)o.booked=booked;return o}
const qShow=o=>o?`${dday(o.date)} ${mdw(o.date)}${o.time?' · '+o.time:''} · ${o.title}${o.booked!=null?' · '+o.booked+'명':''}${o.place?' · '+o.place:''}`:'';

function qCmd(v){const go=()=>{S.view.aka='design';S.mode='aka';window.scrollTo(0,0)};
  if(/단체표/.test(v)){A.gcBoard();return true}
  const sg=/주차/.test(v)?'park':/길\s*안내|화살표/.test(v)?'way':/대관/.test(v)?'rent':/금연|정숙|출입|알림판/.test(v)?'notice':/공간\s*소개/.test(v)?'space':'';
  if(sg){go();A.akaTpl({t:sg});render();return true}
  const km=/(POP|pop|팝|띠지|쇼카드|안내문)/.exec(v);if(!km)return false;const k=/띠지/.test(km[1])?'band':/쇼카드/.test(km[1])?'card':'pop',w=v.replace(km[0],'').replace(/만들어\s*줘?|만들기|해\s*줘|주제|으로|로\s/g,' ').trim();
  const T=akThemes(),al=Object.keys(QAL).find(x=>w.includes(x)),t=T.find(x=>al&&x.title.includes(QAL[al]))||(w.length>1?T.find(x=>(x.title+x.hook+x.books.map(b=>b.t).join('')).includes(w)):null);
  const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));go();
  if(t){S.ui.D=mkD({...t,br:'aka'},k);S.ui.D.tag='아카데미하우스';S.ui.akT=t.title;S.ui.akTn=t.tone}else{S.ui.D=Object.assign(defD(),{kind:k,br:'aka',tag:'아카데미하우스',head:w||'제목',phrases:w||'',body:''})}
  render();toast(t?`「${t.title}」 주제로 만들었습니다`:'초안을 만들었습니다. 아래에서 고칠 수 있습니다.');return true}
A.qAdd=()=>{const el=$('qIn');if(!el)return;if(!el.value.includes('\n')&&qCmd(el.value.trim()))return;const L=el.value.split('\n').map(qParse).filter(Boolean);if(!L.length){toast('예: 내일 2시 한살림 연수 30명 본관');return}
  L.forEach((o,i)=>put('events',nid()+(i||''),{...o,at:new Date().toISOString()},i<L.length-1));toast(L.length>1?`${L.length}건 넣었습니다`:qShow(L[0]));setTimeout(()=>{const e=$('qIn');if(e){e.value='';e.focus()}},60)};
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='qIn'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.qAdd()}});
document.addEventListener('input',e=>{if(e.target&&e.target.id==='qIn'){const p=$('qPv');if(p)p.textContent=qShow(qParse(e.target.value.split('\n')[0]))||'날짜·시간이 없으면 아이디어로 보고 디자인을 만듭니다'}});

/* ── 오늘 화면 ── */
V.aka.today=()=>{if(GC.st==='idle')setTimeout(gcLoad,0);const days=[0,1,2,3,4,5,6].map(n=>addDays(TODAY,n)),mine=d=>S.db.events.filter(e=>e.date===d).sort((a,b)=>(a.time||'')<(b.time||'')?-1:1);
  const row=(t,b,s,btn)=>`<div class="li"><span class="qt">${t||'종일'}</span><div class="t"><b>${esc(b)}</b>${s?`<small>${esc(s)}</small>`:''}</div>${btn||''}</div>`;
  const dayHtml=(d,big)=>{const g=gcDay(d),m=mine(d);if(!g.length&&!m.length)return big?`<div class="card"><div class="empty">${dday(d)} 잡힌 일정이 없습니다.</div></div>`:'';
    return `<div class="card qday"><h3>${dday(d)==='오늘'||dday(d)==='내일'?dday(d)+' ':''}${mdw(d)} <small>${g.length+m.length}건</small></h3><div class="list">${g.map(x=>row(x.time||(x.rooms?(x.in?'입실':'숙박'):''),x.org,[x.rooms?`객실 ${x.rooms}실`:'',...x.sp].filter(Boolean).join(' · '),d===TODAY?`<button class="btn sm" data-a="gcWel" data-o="${esc(x.org)}">환영판</button>`:'')).join('')}${m.map(e=>row(e.time,e.title,[e.place,e.booked!=null?e.booked+'명':'',e.memo].filter(Boolean).join(' · '),`<button class="btn sm" data-a="evEdit" data-id="${e.id}">수정</button>`)).join('')}</div></div>`};
  const n0=gcDay(TODAY).length+mine(TODAY).length,todo=[];if(gcDay(TODAY).length||mine(TODAY).length)todo.push(['오늘의 단체표',`오늘 ${n0}건을 한 장으로`,'gcBoard','']);
  akaTodo().filter(x=>!/단체표/.test(x.t)).slice(0,4).forEach(x=>todo.push([x.b[0][0],x.t,'akaDo',`data-t="${x.b[0][1]}" data-id="${x.b[0][2]}"`]));
  return `<div class="hero"><h2>${mdw(TODAY)} · 오늘 ${n0}건</h2></div>
  <div class="card qadd"><div class="qrow"><input type="text" id="qIn" enterkeyhint="done" autocomplete="off" placeholder="내일 2시 한살림 연수 30명 본관">${micBtn('qIn')}<button class="btn pri" data-a="qAdd">추가</button></div><small id="qPv" class="note">날짜나 시간이 있으면 일정으로, 없으면 아이디어로 보고 바로 디자인을 만듭니다</small></div>
  ${gcMsg()?`<p class="note qsrc">${gcMsg()} ${GC.st==='load'?'':`<button class="lnk" data-a="gcRe">${GC.st==='ok'?'새로 읽기':'다시 연결'}</button>`}</p>`:''}
  ${dayHtml(TODAY,true)}${todo.length?`<div class="card todo">${todo.map(([b,t,a,x])=>`<div class="li"><div class="t"><b>${esc(t)}</b></div><button class="btn sm pri" data-a="${a}" ${x}>${b}</button></div>`).join('')}</div>`:''}
  ${days.slice(1).map(d=>dayHtml(d)).join('')}`};
A.gcBoard=()=>{const L=[...gcDay(TODAY).map(x=>[x.time||(x.rooms?'숙박':''),x.org,x.sp.map(s=>s.replace(/\s\d{1,2}:\d{2}–\d{1,2}:\d{2}$/,'')).join(', ')||(x.rooms?'객실':'')]),...S.db.events.filter(e=>e.date===TODAY).map(e=>[e.time||'',e.title,e.place||''])].sort((a,b)=>(a[0]||'99')<(b[0]||'99')?-1:1);
  S.view.aka='design';window.scrollTo(0,0);A.akaTpl({t:'board'});if(S.ui.D){S.ui.D.list=L.map(r=>r.join(' | ')).join('\n');S.ui.D.body=mdw(TODAY)}render()};
A.gcWel=d=>{const g=gcDay(TODAY).find(x=>x.org===d.o);S.view.aka='design';window.scrollTo(0,0);A.akaTpl({t:'group'});const D=S.ui.D;if(D&&g){D.head=g.org;D.list=[g.sp.length?`장소 | ${g.sp.map(s=>s.replace(/\s\d{1,2}:\d{2}–\d{1,2}:\d{2}$/,'')).join(', ')}`:'',g.time?`시간 | ${mdw(TODAY)} ${g.time}`:`일정 | ${mdw(TODAY)}`,'문의 | 02-904-0206'].filter(Boolean).join('\n')}render()};

/* ── 만들기: 사진으로 시작 · (아카데미) 주제로 시작 ── */
C.dPhoto=async el=>{const f=[...el.files].slice(0,3);if(!f.length)return;const pm=S.ui.phM|0;const k=['pop','band','card'].includes((S.ui.D||{}).kind)?S.ui.D.kind:'pop';
  const out=await ask('photo',`사진을 보고 서점·문화공간 "더숲"의 인쇄물 문안을 씁니다. 사진은 책 표지, 책 묶음, 손글씨 메모, 공간이나 물건 중 하나입니다.\n말투: 조용하고 담백하게. 느낌표·이모지·과장 금지. 사진에 없는 사실(수상, 판매량, 가격)은 지어내지 않습니다. 읽히지 않는 글자는 빈 문자열.\nhead 는 14자 안쪽의 제목(뜻 단위로 \\n 한 번 가능), body 는 45자 안쪽 한두 문장, band 는 띠지에 쓸 18자 안쪽 한 줄, sym 은 ${Object.keys(ICON).filter(x=>!x.startsWith('ph')).join('|')}|none 중 하나.${pm?`\ndraw 에는 사진 속 대상을 ${pm===2?'손으로 그린 듯한 선 스케치(선 여러 개, 윤곽과 특징만, 1400자 안쪽)':'단순한 상징 하나(선 몇 개, 400자 안쪽)'}로 옮긴 SVG path 의 d 값을 적습니다. 좌표는 0~24 상자 안, 선으로만 그리며 면을 채우지 않습니다. 글자는 그리지 않습니다.`:''}\nJSON 으로만: {"what":"책|묶음|메모|공간","head":"","body":"","band":"","sym":"","draw":"","books":[{"t":"제목","a":"저자","p":"출판사","why":"12자 안쪽 한마디"}]}`,{images:f});
  el.value='';if(!out||!out.head){if(out)toast('사진에서 읽은 것이 없습니다. 조금 더 가까이 찍어 주세요.');return}
  const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));const bs=(out.books||[]).filter(b=>b&&b.t).slice(0,8),b=bs[0]||{},br=S.mode==='aka'?'aka':curBr();
  const D=Object.assign(defD(),{kind:k,br,tag:S.mode==='aka'?'아카데미하우스':TAGN(br),sym:ICON[out.sym]?out.sym:'none',head:out.head,body:out.body||'',books:bs});
  if(k==='band'){D.phrases=out.band||out.head.replace(/\n/g,' ');if(D.sym!=='none')D.syms=[D.sym]}else if(k==='card')D.list=bs.map((x,i)=>`${i+1}. ${x.t} | ${[x.a,x.p].filter(Boolean).join(' · ')} | ${x.why||''}`).join('\n');
  if(pm&&typeof out.draw==='string'&&out.draw.length>10&&out.draw.length<2400&&/^[MmLlHhVvCcSsQqTtAaZz0-9\s.,\-eE]+$/.test(out.draw)){D.sym='ph'+Date.now().toString(36);D.symD=out.draw.trim();D.symBig=pm;ICON[D.sym]=D.symD;if(k==='band')D.syms=[D.sym]}
  if(k==='pop'&&b.t){D.book=b.t;D.author=[b.a,b.p].filter(Boolean).join(' · ')}S.ui.D=D;render();toast('사진으로 초안을 만들었습니다. 아래에서 고칠 수 있습니다.')};
const AKTN=['다른 시선','말놀이','제철'];
function akThemes(){try{return (corners('aka').all||[]).filter(t=>AKTN.includes(t.tone))}catch(e){return []}}
A.akThm=d=>{const t=akThemes()[+d.i];if(!t)return;const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));S.ui.D=mkD({...t,br:'aka'},'pop');S.ui.D.tag='아카데미하우스';S.ui.akT=t.title;render()};
A.akPlan=()=>{const t=akThemes().find(x=>x.title===S.ui.akT);if(!t)return;S.ui.plK='책모임';S.ui.plT=`「${t.title}」 — ${t.hook} 함께 읽을 책: ${t.books.slice(0,3).map(b=>b.t).join(', ')}`;A.go({v:'plan'})};
(()=>{const f=V.store.design,g=()=>{const aka=S.mode==='aka',tn=S.ui.akTn||AKTN[0],T=aka?akThemes():[];
  if(S.ui.D&&S.ui.D.symD&&!ICON[S.ui.D.sym])ICON[S.ui.D.sym]=S.ui.D.symD;
  const bar=`<div class="qbar">${AI?`<label class="btn ${S.ui.busy==='photo'?'':'pri'}">${S.ui.busy==='photo'?'사진 읽는 중…':'사진으로 만들기'}<input type="file" accept="image/*" data-c="dPhoto" hidden ${S.ui.busy?'disabled':''}></label>`:''}${AI?['문안만','상징도','스케치도'].map((x,i)=>`<button class="chip" data-a="ui" data-k="phM" data-v="${i}" aria-pressed="${(S.ui.phM|0)===i}">${x}</button>`).join(''):''}${aka&&T.length?`<span class="note">주제</span>${AKTN.map(x=>`<button class="chip" data-a="ui" data-k="akTn" data-v="${x}" aria-pressed="${tn===x}">${x}</button>`).join('')}`:''}</div>
  ${aka&&T.length?`<div class="qthm">${T.map((t,i)=>[t,i]).filter(([t])=>t.tone===tn).slice(0,S.ui.akAll?99:8).map(([t,i])=>true?`<button data-a="akThm" data-i="${i}" aria-pressed="${S.ui.akT===t.title}">${esc(t.title)}</button>`:'').join('')}${!S.ui.akAll&&T.filter(t=>t.tone===tn).length>8?`<button class="lnk" data-a="ui" data-k="akAll" data-v="1">더 보기</button>`:''}</div>${S.ui.akT&&T.find(t=>t.title===S.ui.akT)?`<div class="akx"><button class="btn" data-a="akDp">진열 보기</button><button class="btn" data-a="akPlan">모임 기획</button><span class="note">함께 놓을 것 · ${stnFor(T.find(t=>t.title===S.ui.akT)).map(x=>x.b).join(' · ')}</span></div>`:''}`:''}${(S.ui.err||{}).photo?`<p class="note">${esc(S.ui.err.photo)}</p>`:''}`;return bar+f()};V.store.design=g;V.aka.design=g})();

/* ── 굿즈 제안: 무엇을 · 어떻게 묶어 · 어디에 ── */

A.gdMore=async()=>{const aka=S.mode==='aka';const out=await ask('goods',`"더숲"(${aka?'북한산 자락 복합 문화 공간 아카데미하우스: 서점 · 북스테이 · 카페 · 대관 · 프로그램':'서울의 동네 서점 여러 지점: 문학 · 인문 · 예술 · 과학 중심'})에서 소량으로 시험해 볼 굿즈 · 묶음 상품 4가지를 제안하세요. 흔한 에코백 · 머그 말고, 이 공간만 할 수 있는 것. 원가나 판매량 숫자는 지어내지 말고, 과장 없이 담백하게.\nJSON 배열로만: [{"n":"이름","w":"왜 지금 이 공간에 맞는지 한 문장","set":"구성","at":"놓을 자리","first":"처음 시험하는 방법"}]`);if(Array.isArray(out))S.ui.gd=out.filter(x=>x&&x.n).slice(0,4)};
function goodsCard(){const m=S.mode,L=[...(S.ui.gd||[]),...GOODS.filter(g=>g.mode===m)];return `<div class="sec"><h2>굿즈 제안</h2></div><div class="grid g3">${L.map(g=>`<div class="card gd"><h3>${esc(g.n)}</h3><p>${esc(g.w)}</p><dl><dt>구성</dt><dd>${esc(g.set)}</dd><dt>자리</dt><dd>${esc(g.at)}</dd><dt>시작</dt><dd>${esc(g.first)}</dd></dl></div>`).join('')}</div>${AI?`<div class="btns"><button class="btn" data-a="gdMore" ${S.ui.busy?'disabled':''}>${S.ui.busy==='goods'?'생각하는 중…':'다른 제안 받기'}</button></div>`:''}`}
(()=>{const f=V.store.trend,g=()=>f()+goodsCard();V.store.trend=g;V.aka.trend=g})();

/* ── 다른 공간 읽기: 잘하는 것 · 약한 것 · 더숲은 언제 따르고 언제 달리할지 ── */

function spaceCard(){return `<div class="sec"><h2>다른 공간 읽기</h2></div>
 <div class="card rule"><b>달리하는 것은 목적이 아닙니다.</b><ol><li>손님이 책을 찾는 데 방해가 되면 하지 않습니다. 기본 서가는 그대로 둡니다.</li><li>평대 하나, 2주 단위로 되돌릴 수 있을 때만 시험합니다.</li><li>시작 전에 볼 숫자를 정합니다. 그 평대의 판매 권수와, 없던 문의가 생겼는지.</li></ol></div>
 <div class="grid g2">${SPACES.map(s=>`<div class="card gd"><h3>${s.n}</h3><dl><dt>강점</dt><dd>${s.good}</dd><dt>약점</dt><dd>${s.weak}</dd><dt>그대로</dt><dd>${s.keep}</dd><dt>달리</dt><dd>${s.diff}</dd></dl><a class="lnk" href="${s.u}" target="_blank" rel="noopener">출처</a></div>`).join('')}</div>`}
(()=>{const f=V.store.trend,g=()=>f()+spaceCard();V.store.trend=g;V.aka.trend=g})();

/* ── 주문: 책 사진 → 제목·ISBN 목록 → 주문에 담기 ── */
const isbnOk=s=>{s=String(s||'').replace(/[^0-9]/g,'');if(!/^97[89]\d{10}$/.test(s))return '';let n=0;for(let i=0;i<12;i++)n+=+s[i]*(i%2?3:1);return (10-n%10)%10===+s[12]?s:''};
C.oPhoto=async el=>{const f=[...el.files].slice(0,8),br=S.br;if(!f.length||br==='all')return;let got=0;for(const x of f){for(const c of await bcFromFile(x)){if(scanAdd(c))got++}}if(got||!AI){el.value='';if(!got)toast('바코드를 찾지 못했습니다. 뒷면 바코드가 크게 보이게 찍어 주세요.');render();return}
  const out=await ask('ophoto','사진 속 책을 모두 읽어 주세요. 서점에서 도매상에 주문할 책입니다. 책등·표지·뒷면 바코드 어느 쪽이든 보이는 대로 읽습니다.\n책마다 제목, 저자, 출판사, 같은 책 권수(겹쳐 보이면 세어서, 아니면 1)를 적습니다. ISBN 은 사진에 숫자가 실제로 보일 때만 13자리로 적고, 보이지 않으면 빈 문자열로 둡니다. 기억으로 채우지 마세요. 읽히지 않는 책은 넣지 않습니다.\nJSON 배열로만: [{"title":"","author":"","publisher":"","isbn":"","qty":1}]',{images:f});el.value='';
  if(!Array.isArray(out)||!out.length){if(out)toast('사진에서 읽은 책이 없습니다. 글자가 보이게 다시 찍어 주세요.');return}
  let P=[];try{P=pool(br)}catch(e){}const BK=window.BOOKS||{},cat=[...P,...(BK.yes24||[]),...(BK.aladin||[]),...(BK.kyobo||[])];
  S.ui.oPh=(S.ui.oPh||[]).concat(out.filter(x=>x&&x.title).map(x=>{const seen=isbnOk(x.isbn),h=cat.find(b=>seen&&b.isbn===seen)||cat.find(b=>nt(b.t)===nt(x.title));
    return{t:h?h.t:x.title,a:(h&&h.a)||x.author||'',p:(h&&h.p)||x.publisher||'',isbn:seen||(h&&h.isbn)||'',price:(h&&h.price)||0,qty:Math.max(1,Math.min(99,+x.qty||1)),src:seen?'사진에서 읽음':h&&h.isbn?'목록에서 찾음':''}}));render()};
A.oPhDel=d=>{(S.ui.oPh||[]).splice(+d.i,1);render()};A.oPhClear=()=>{S.ui.oPh=null;render()};
A.oPhQty=d=>{const x=(S.ui.oPh||[])[+d.i];if(x){x.qty=Math.max(1,Math.min(99,x.qty+(+d.n)));render()}};
A.oPhAdd=()=>{const L=S.ui.oPh||[];let n=0;L.forEach(b=>{if(addCart(S.br,{t:b.t,a:b.a,p:b.p,isbn:b.isbn,price:b.price},b.qty,'사진으로 담음'))n++});if(n){S.ui.oPh=null;toast(`${n}종을 주문에 담았습니다`);render()}};
function oPhCard(){if(S.br==='all')return '';const L=S.ui.oPh,no=L?L.filter(b=>!b.isbn).length:0;
  return `<div class="card oph"><div class="qbar" style="margin:0"><button class="btn pri" data-a="scanOpen">바코드 스캔</button><label class="btn">${S.ui.busy==='ophoto'?'사진 읽는 중…':'사진에서 읽기'}<input type="file" accept="image/*" multiple data-c="oPhoto" hidden ${S.ui.busy?'disabled':''}></label><span class="note">책 뒷면 바코드를 비추면 ISBN 을 읽어 목록에 쌓습니다. 여러 권을 이어서 읽을 수 있습니다.</span></div>
  ${(S.ui.err||{}).ophoto?`<p class="note">${esc(S.ui.err.ophoto)}</p>`:''}
  ${L&&L.length?`<div class="list" style="margin-top:12px">${L.map((b,i)=>`<div class="li"><div class="t"><b>${esc(b.t)}</b><small>${esc([b.a,b.p].filter(Boolean).join(' · '))}</small></div>${b.isbn?`<span class="chip num" data-tip="${b.src}">${b.isbn}</span>`:'<span class="pill p-low">ISBN 확인 필요</span>'}<span class="qq"><button data-a="oPhQty" data-i="${i}" data-n="-1" aria-label="줄이기">−</button><b>${b.qty}</b><button data-a="oPhQty" data-i="${i}" data-n="1" aria-label="늘리기">+</button></span><button class="btn sm ghost" data-a="oPhDel" data-i="${i}">빼기</button></div>`).join('')}</div>
   <div class="btns" style="margin-top:12px"><button class="btn pri" data-a="oPhAdd">${L.length}종 주문에 담기</button><button class="btn ghost" data-a="oPhClear">지우기</button>${no?`<span class="note">ISBN 이 없는 ${no}종은 담은 뒤 북센에서 제목으로 확인해 주세요.</span>`:''}</div>`:''}</div>`}
(()=>{const f=V.store.stock;V.store.stock=()=>{const h=f(),c=oPhCard();if(!c)return h;const i=h.indexOf('<div class="card');return i>0?h.slice(0,i)+c+h.slice(i):c+h}})();

/* ── 진열: 자리 사진으로 규모 읽기 · 돌려 보는 3D ── */
(()=>{const g=dpPlan;dpPlan=function(t,m){return g(S.ui.dpCap?{...t,books:(t.books||[]).slice(0,S.ui.dpCap)}:t,m)};const h=shelfPlan;shelfPlan=function(t,m){return h(S.ui.dpCap?{...t,books:(t.books||[]).slice(0,S.ui.dpCap)}:t,m)}})();
function dp3d(P){const s=.4,W=900*s,bk=(i,z)=>`<i style="background:${i.c}"></i>`;let o='';
  (P.it||[]).forEach(i=>{const x=(i.x||0)*s,y=(i.y||0)*s;
    if(i.k==='stack'){const w=i.w*s,d=i.d*s,h=Math.max(4,i.h*s*1.3),n=Math.max(1,Math.round(i.h/20));o+=`<div class="d3b" style="left:${x}px;top:${y}px;width:${w}px;height:${d}px"><div class="tp" style="background:${i.c};transform:translateZ(${h}px)"><b>${i.n}</b></div><div class="fr" style="height:${h}px;top:${d-h}px;background-size:100% ${h/n}px"></div><div class="rt" style="width:${h}px;left:${w-h}px;background-size:${h/n}px 100%"></div><div class="lf" style="width:${h}px;background-size:${h/n}px 100%"></div><div class="bkk" style="height:${h}px;background-size:100% ${h/n}px"></div></div>`}
    else if(i.k==='face'){o+=`<div class="d3f" style="left:${x}px;top:${y+210*s}px;width:${150*s}px;height:${210*s}px;background:${i.c}"><b>${i.n}</b></div>`}
    else if(i.k==='pop'){o+=`<div class="d3f pp" style="left:${x}px;top:${y+150*s}px;width:${210*s*.75}px;height:${297*s*.6}px">POP</div>`}
    else if(i.k==='vase'){o+=`<div class="d3f vs" style="left:${x}px;top:${y+60*s}px;width:${60*s}px;height:${150*s}px"></div>`}});
  return `<div class="d3" id="d3"><div class="d3s" id="d3s" style="width:${W}px;height:${W}px"><div class="d3t"></div><div class="d3e e1"></div><div class="d3e e2"></div>${o}</div></div><p class="note" style="text-align:center">끌어서 돌려 봅니다 · 그림은 90×90cm 평대 기준</p>`}
(()=>{let dn=null,a=-28,t=58;const ap=()=>{const e=$('d3s');if(e)e.style.transform=`rotateX(${t}deg) rotateZ(${a}deg)`};
  document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('#d3')){dn=[e.clientX,e.clientY,a,t];e.preventDefault()}});
  document.addEventListener('pointermove',e=>{if(!dn)return;a=dn[2]+(e.clientX-dn[0])*.5;t=Math.max(25,Math.min(80,dn[3]-(e.clientY-dn[1])*.3));ap()});
  document.addEventListener('pointerup',()=>{dn=null});window.d3Apply=ap})();
(()=>{const f=A.dpOpen;A.dpOpen=d=>{f(d);const st=$('dpStage');if(!st)return;const fx=S.ui.dpF||0,R=S.ui.dpRd,t=(S.ui.cor||[])[S.ui.dp.i];
  const bar=document.createElement('div');bar.className='dpx';bar.innerHTML=`<div class="qbar" style="margin:6px 0 10px"><span class="note">자리 크기</span>${DPSZ.map((z,i)=>`<button class="chip" data-a="dpSize" data-i="${i}" aria-pressed="${!!(S.ui.dpRd&&S.ui.dpRd.zi===i)}">${z.n}</button>`).join('')}${fx===0?`<button class="chip" data-a="dp3" aria-pressed="${!!S.ui.dp3}">3D로 보기</button>`:''}${S.ui.dpCap?`<button class="lnk" data-a="dpFree">크기 맞춤 풀기</button>`:''}</div>
   ${R?`<div class="dprd"><b>${esc(R.fixture||'')} · 약 ${R.w||'?'}×${R.d||'?'}cm${R.tiers>1?` · ${R.tiers}단`:''} · ${R.titles||'?'}종 ${R.copies||'?'}권쯤</b>${R.zi!=null?'':'<small>사진으로 어림한 값입니다. 줄자로 한 번 확인해 주세요.</small>'}${R.now?`<p>${esc(R.now)}</p>`:''}${(R.issues||[]).length?`<ul>${R.issues.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${R.why?`<p><b>제안</b> ${esc(R.why)}</p>`:''}</div>`:''}`;
  st.parentNode.insertBefore(bar,st);if(S.ui.dp3&&fx===0&&t){st.innerHTML=dp3d(dpPlan(t,S.ui.dpM||0));window.d3Apply()}}})();
A.dp3=()=>{S.ui.dp3=!S.ui.dp3;A.dpOpen({i:S.ui.dp.i})};A.dpFree=()=>{S.ui.dpCap=0;S.ui.dpRd=null;S.ui.dpSz=null;A.dpOpen({i:S.ui.dp.i})};
C.dpPhoto=async el=>{const f=[...el.files].slice(0,2);if(!f.length)return;const lb=el.parentNode;if(lb&&lb.firstChild)lb.firstChild.textContent='자리 읽는 중…';
  const out=await ask('dpsp','서점의 진열 자리 사진입니다. 평대(책을 눕혀 쌓는 탁자)인지 벽 서가(선반)인지 보고, 크기와 놓을 수 있는 양을 어림합니다. 사진 속 책(보통 가로 15cm, 세로 21cm)을 자 삼아 재세요. 보이지 않는 것은 지어내지 않습니다. 말투는 담백하게.\nJSON 으로만: {"fixture":"평대|벽 서가","w":가로cm,"d":깊이cm(벽 서가는 선반 깊이),"tiers":단 수(평대는 1),"titles":표지가 서로 가리지 않게 놓을 수 있는 종 수,"copies":그때 전체 권수,"now":"지금 놓인 상태 한 문장","issues":["고칠 점, 3개 이하"],"mood":"무심하게|사랑스럽게|돋보이게","why":"그 방식이 이 자리에 맞는 까닭 한 문장"}',{images:f});
  if(out&&out.fixture){S.ui.dpRd=out;S.ui.dpF=/서가|선반/.test(out.fixture)?1:0;S.ui.dpCap=Math.max(2,Math.min(8,+out.titles||6));const m=DMOOD.indexOf(out.mood);if(m>=0)S.ui.dpM=m;S.ui.dpSz=out.w&&out.d?{w:out.w,d:out.d}:null}else if(out)toast('자리를 읽지 못했습니다. 평대나 서가 전체가 보이게 찍어 주세요.');
  if(S.ui.dp)A.dpOpen({i:S.ui.dp.i})};

/* ── 아이디어 한 줄 → 바로 디자인 ── */

function ideaLocal(v){const k=/띠지/.test(v)?'band':/쇼카드/.test(v)?'card':'pop',w=v.replace(/(POP|pop|팝|띠지|쇼카드|안내문)(으로|로)?|만들어\s*줘?|만들기|해\s*줘/g,' ').replace(/\s+/g,' ').trim()||v,aka=S.mode==='aka',br=aka?'aka':curBr(),sym=(IDS.find(([r])=>r.test(w+' '))||[0,'none'])[1];
  const cut=w.length>16?(()=>{const i=w.slice(0,18).search(/[,.—]|\s(?=\S*$)/);return i>5?i+1:Math.min(w.length,14)})():w.length,head=w.slice(0,cut).replace(/[,.\s]+$/,''),rest=w.slice(cut).trim();
  const dark=/밤|달|겨울|고요|죽|끝|어둠/.test(w),D=Object.assign(defD(),{kind:k,br,tag:aka?'아카데미하우스':TAGN(br),sym,head,body:rest,st:dark?1:0,pal:dark?2:/숲|나무|식물|산/.test(w)?1:/따뜻|커피|가을|편지/.test(w)?3:0});
  ideaPolish(D,w);if(k==='band'){D.phrases=D.head.replace(/\n/g,' ');if(sym!=='none')D.syms=[sym]}return D}
A.ideaGo=async d=>{const el=$('ideaIn')||$('qIn'),v=((d&&d.v)||(el&&el.value)||'').trim();if(!v){toast('아이디어를 한 줄 적어 주세요');return}
  const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));const D0=ideaLocal(v);S.ui.D=D0;S.ui.idea=v;S.view[S.mode]='design';window.scrollTo(0,0);render();if(!AI)return;
  const snap=JSON.stringify(D0),out=await ask('idea',`서점·문화공간 "더숲"의 ${S.mode==='aka'?'아카데미하우스(북한산 자락 복합 문화 공간)':'서점'} 인쇄물을 만듭니다. 직원이 적은 아이디어 한 줄을 바로 붙일 수 있는 문안으로 다듬어 주세요.\n아이디어: "${v.replace(/"/g,"'")}"\n말투: 조용하고 담백하게. 느낌표·이모지·과장 금지. 없는 사실(날짜, 가격, 수상)은 지어내지 않습니다. 뻔한 표현 대신 한 번 비튼 낱말 하나.\nhead 는 14자 안쪽 제목(뜻 단위로 \\n 한 번 가능), body 는 45자 안쪽 한두 문장, band 는 띠지용 18자 안쪽 한 줄, sym 은 ${Object.keys(ICON).filter(x=>!x.startsWith('ph')).join('|')}|none, look 은 0(밝고 조용하게)|1(짙은 바탕)|2(세로 제목) 중 하나.\nJSON 으로만: {"head":"","body":"","band":"","sym":"","look":0}`,{modelTier:'quick'});
  if(!out||!out.head||JSON.stringify(S.ui.D)!==snap)return;const D=S.ui.D;D.head=out.head;D.body=out.body||D.body;if(ICON[out.sym])D.sym=out.sym;if([0,1,2].includes(+out.look))D.st=+out.look;if(D.kind==='band'){D.phrases=out.band||out.head.replace(/\n/g,' ');D.syms=D.sym!=='none'?[D.sym]:[]}render()};
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='ideaIn'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.ideaGo({})}});
(()=>{const f=V.store.design,g=()=>`<div class="card qadd"><div class="qrow"><input type="text" id="ideaIn" autocomplete="off" enterkeyhint="go" value="${esc(S.ui.idea||'')}" placeholder="생각 한 줄 — 비 오는 날 혼자 읽기 좋은 얇은 책 / 오늘은 6시에 닫습니다"><label class="btn">사진<input type="file" accept="image/*" data-c="feelPhoto" hidden></label>${micBtn('ideaIn')}<button class="btn pri" data-a="ideaGo">${S.ui.busy==='idea'?'다듬는 중…':'만들기'}</button></div></div>`+f();V.store.design=g;V.aka.design=g})();
(()=>{const f=A.qAdd;A.qAdd=()=>{const el=$('qIn'),v=el?el.value.trim():'';if(v&&!v.includes('\n')&&!/(오늘|내일|모레|글피|\d\s*시|\d{1,2}:\d{2}|\d+\s*(명|인)|\d+\s*월|\d+\s*일|요일|\d{1,2}[\/.]\d{1,2})/.test(v)&&!/단체표|주차|길\s*안내|화살표|대관|금연|정숙|출입|알림판|공간\s*소개/.test(v)&&!(/(POP|pop|팝|띠지|쇼카드|안내문)/.test(v)&&Object.keys(QAL).some(x=>v.includes(x)))){A.ideaGo({v});return}f()}})();

/* ── 떠오른 생각 한 줄 → 한 벌 완성 (주제 · 책 · POP · 띠지 · 목록 · 쇼카드 · 진열 · 오브제) ── */
S.ui.myT=ls.get('myT',[]);
(()=>{const g=corners;corners=function(br){const C=g(br),my=(S.ui.myT||[]).map(t=>({...t,br,books:myBooks(t,br)}));C.time=[...my,...C.time];C.all=[...C.time,...C.data];return C}})();
function myBooks(t,br){let P=[];try{P=pool(br)}catch(e){}const pick=(t.pick||[]).map(x=>P.find(b=>nt(b.t)===nt(x))).filter(Boolean),W=(t.src||'').split(/[\s,.·]+/).filter(w=>w.length>1).map(w=>w.replace(/(은|는|이|가|을|를|의|에|에서|으로|로|과|와|도|들)$/,'')).filter(w=>w.length>1);
  const TP=topicsOf(t.src||''),TW=TP.flatMap(x=>x.w),TC=TP.flatMap(x=>x.c||[]),hasW=(s,w)=>w.length>1?s.includes(w):new RegExp('(^|[\\s,])'+w+'($|[\\s,])').test(s),W2=W.filter(w=>!/^(이야기|사람|읽는|읽기|좋은|오는|싶은|건네고|전날|그냥|아는데|가기|한테|에서)$/.test(w)),sc=b=>(/취미|아동|경제|수험|참고/.test(b.cat||'')&&!TC.includes(b.cat))||/배우는|기초|완성|돈이 되는|문제집|자격증|수험/.test(b.t||'')?0:W2.reduce((a,w)=>a+(hasW(b.t||'',w)?4:0)+((b.a||'').includes(w)&&w.length>1?1:0),0)+TW.reduce((a,w)=>a+(hasW(b.t||'',w)?3:0),0)+(TW.some(w=>(b.t||'').includes(w))&&TC.includes(b.cat)?1:0)+((b.here||0)>0?.5:0),rest=P.filter(b=>!pick.includes(b)).map(b=>[sc(b),b]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]||(b[1].here||0)-(a[1].here||0)).map(x=>x[1]);
  let L=[...pick,...rest].filter((b,i,A)=>A.findIndex(z=>nt(z.t).slice(0,5)===nt(b.t).slice(0,5))===i);if(L.length<4)L=[...L,...P.filter(b=>b.here>0&&!L.includes(b)).sort((a,b)=>(b.mine||0)-(a.mine||0))].slice(0,5);
  return L.slice(0,6).map((b,i)=>({...b,why:bookWhy(b),src:b.here>0?'재고':'들여놓기',role:i===0?'중심':'곁들임'}))}
A.myDel=d=>{S.ui.myT=(S.ui.myT||[]).filter(t=>t.id!==d.id);ls.set('myT',S.ui.myT);render()};
(()=>{const f=A.ideaGo;A.ideaGo=async d=>{if(S.mode!=='store'||S.br==='all'){if(S.mode==='store'){toast('위에서 지점을 먼저 고르세요');return}return f(d)}
  const el=$('ideaIn')||$('cIdea'),v=((d&&d.v)||(el&&el.value)||'').trim();if(!v){toast('떠오른 생각을 한 줄 적어 주세요');return}
  const D=ideaLocal(v),id='m'+Date.now().toString(36),un=addDays(TODAY,14),sh=false,t={id,tone:'내 생각',src:v,title:D.head.replace(/\n/g,' '),hook:D.body||'',sym:D.sym,bpal:D.pal,ppal:D.pal,until:un,place:'입구 평대',pop:{head:D.head,body:D.body||''},band:v.length<=20?v:D.head,pick:[]};
  S.ui.myT=[t,...(S.ui.myT||[])].slice(0,6);ls.set('myT',S.ui.myT);S.ui.cTone='내 생각';S.view.store='cur';window.scrollTo(0,0);render();if(!AI)return;
  let P=[];try{P=pool(S.br)}catch(e){}const cand=P.filter(b=>b.here>0||b.sold>0).slice(0,150).map(b=>b.t);
  const out=await ask('idea',`서점 "더숲"의 평대 기획입니다. 직원이 떠올린 생각 한 줄로 평대 하나를 완성해 주세요.\n생각: "${v.replace(/"/g,"'")}"\n말투: 조용하고 담백하게. 느낌표·이모지·과장 금지. 뻔한 표현 대신 한 번 비튼 낱말 하나. 없는 사실은 지어내지 않습니다.\ntitle 은 14자 안쪽 평대 이름, hook 은 45자 안쪽 한두 문장, band 는 띠지용 18자 안쪽 한 줄, sym 은 ${Object.keys(ICON).filter(x=>!x.startsWith('ph')).join('|')}|none.\nbooks 는 아래 [이 지점에서 다루는 책] 목록에 있는 제목만, 생각에 맞는 순서로 4~6권. 목록에 맞는 책이 없으면 빈 배열. 목록에 없는 책은 넣지 않습니다.\n[이 지점에서 다루는 책]\n${cand.join(' / ')}\nJSON 으로만: {"title":"","hook":"","band":"","sym":"","books":["제목"]}`,{modelTier:'quick'});
  const m=(S.ui.myT||[]).find(x=>x.id===id);if(!out||!out.title||!m)return;m.title=out.title;m.hook=out.hook||m.hook;m.band=out.band||m.band;m.pop={head:out.title,body:out.hook||''};if(ICON[out.sym])m.sym=out.sym;m.pick=(Array.isArray(out.books)?out.books:[]).filter(x=>cand.includes(x)).slice(0,6);ls.set('myT',S.ui.myT);render()}})();
(()=>{const f=V.store.cur;V.store.cur=()=>{let h=f();if(S.br==='all')return h;const has=(S.ui.myT||[]).length;
  if(has)h=h.replace(`aria-pressed="${(S.ui.cTone||'전체')==='전체'}">전체</button>`,m=>m+`<button data-a="cTone" data-t="내 생각" aria-pressed="${S.ui.cTone==='내 생각'}">내 생각</button>`);
  const bar=`<div class="card qadd"><div class="qrow"><input type="text" id="cIdea" autocomplete="off" enterkeyhint="go" placeholder="떠오른 생각 한 줄 — 비 오는 날엔 얇은 책"><label class="btn">사진<input type="file" accept="image/*" data-c="feelPhoto" hidden></label>${micBtn('cIdea')}<button class="btn pri" data-a="ideaGo">${S.ui.busy==='idea'?'고르는 중…':'완성하기'}</button></div><small class="note">낱말 하나나 사진 한 장이면 세 갈래로 넓혀 평대 한 벌을 만듭니다. 문장으로 적으면 그대로, 「~습니다」로 끝내면 안내문이 됩니다${has&&S.ui.cTone==='내 생각'?` <button class="lnk" data-a="myClear">내 생각 모두 지우기</button>`:''}</small></div>`;
  const i=h.indexOf('<div class="subnav"');return i>0?h.slice(0,i)+bar+h.slice(i):bar+h}})();
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='cIdea'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.ideaGo({v:e.target.value})}});

A.myClear=()=>{S.ui.myT=[];ls.set('myT',[]);S.ui.cTone='전체';render()};

/* ── 말로 넣기 · 안내문도 생각 한 줄로 (아카 · 서점 모두) ── */
if(!KSHOW.store.includes('sign'))KSHOW.store.push('sign');
A.micTo=d=>{S.ui.micT=d.id;A.dMic()};
const micBtn=id=>(DICT||window.SpeechRecognition||window.webkitSpeechRecognition)?`<button class="btn" data-a="micTo" data-id="${id}" aria-pressed="${!!S.ui.mic}">${S.ui.mic?'듣는 중':'말하기'}</button>`:'';

function noticeLocal(v){const w=v.replace(/(안내문|안내판|공지|알림)(으로|로|을|를)?\s*(만들어\s*줘?|써\s*줘?|작성)?/g,' ').replace(/\s+/g,' ').trim()||v,aka=S.mode==='aka',br=aka?'aka':curBr(),ps=w.split(/(?<=[.!?])\s+|,\s+/),head=(ps[0]||w).replace(/[.!]+$/,''),body=ps.slice(1).join(' ');
  const sym=/금연|담배/.test(w)?'drop':/조용|정숙/.test(w)?'leaf':/우산|비가|비 오|장마/.test(w)?'rain':/화장실|이쪽|방향|층/.test(w)?'walk':/행사|촬영|모임/.test(w)?'candle':/휴무|닫|쉽|마감/.test(w)?'moon':/출입|관계자/.test(w)?'house':'none';
  return Object.assign(defD(),SIGN.notice.d,{kind:'sign',sg:'notice',cv:0,br,tag:aka?'아카데미하우스':TAGN(br),head,body,list:'',sym})}
(()=>{const f=A.ideaGo;A.ideaGo=async d=>{const el=$('ideaIn')||$('cIdea')||$('qIn'),v=((d&&d.v)||(el&&el.value)||'').trim();if(!v||!NOTR.test(v)||/(POP|pop|팝|띠지|쇼카드)/.test(v))return f(d);
  const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));const D0=noticeLocal(v);S.ui.D=D0;S.ui.idea=v;S.view[S.mode]='design';window.scrollTo(0,0);render();if(!AI)return;
  const snap=JSON.stringify(D0),out=await ask('idea',`"더숲" ${S.mode==='aka'?'아카데미하우스(복합 문화 공간)':'서점'}에 붙일 안내문입니다. 직원이 말한 내용을 손님이 한눈에 읽는 안내문으로 다듬어 주세요.\n내용: "${v.replace(/"/g,"'")}"\n정중하지만 짧게. 명령조·느낌표·이모지 금지. 말한 내용에 없는 날짜·시간·장소는 지어내지 않습니다.\nhead 는 16자 안쪽 한 줄(가장 중요한 말), body 는 40자 안쪽 덧붙임(없으면 빈 문자열), sym 은 ${Object.keys(ICON).filter(x=>!x.startsWith('ph')).join('|')}|none.\nJSON 으로만: {"head":"","body":"","sym":""}`,{modelTier:'quick'});
  if(!out||!out.head||JSON.stringify(S.ui.D)!==snap)return;S.ui.D.head=out.head;S.ui.D.body=out.body||'';if(ICON[out.sym])S.ui.D.sym=out.sym;render()}})();
(()=>{const f=A.qAdd;A.qAdd=()=>{const el=$('qIn'),v=el?el.value.trim():'';if(v&&!v.includes('\n')&&/(습니다|주세요|마세요|안내문|안내판|공지)/.test(v)){A.ideaGo({v});return}f()}})();

/* ── 공개 주소에서도 되는 책 고르기 · 다듬기 (Claude 없이, 낱말 사전으로) ── */

function topicsOf(s){return TOPIC.filter(x=>x.k.test(s+' '))}
function ideaPolish(D,w){const T=topicsOf(w)[0],full=w.replace(/\s+/g,' ').trim(),st=full.replace(/[\s,]*(에|때|에는|엔)?\s*(읽는|읽을|읽기 좋은|읽으면 좋은|어울리는|보는|좋은|위한|권하는)?\s*(얇은|짧은|작은|조용한)?\s*책들?\.?$/,'').trim();
  if(st.length>=4&&st.length<=22&&st!==full){D.head=st;D.body=T?T.h:''}else if(full.length<=20){D.head=full;D.body=T?T.h:''}else if(!D.body&&T)D.body=T.h;
  D.head=D.head.replace(/^(그냥|뭔가|약간|음+|어+)\s+/,'');return D}
(()=>{const f=noticeLocal;noticeLocal=function(v){const D=f(v),po=s=>s.replace(/닫아요|닫음/g,'닫습니다').replace(/쉬어요|쉼(?=$|[.\s])/g,'쉽니다').replace(/열어요|엶/g,'엽니다').replace(/해요(?=$|[.\s])/g,'합니다').replace(/돼요|되요/g,'됩니다').replace(/있어요/g,'있습니다').replace(/없어요/g,'없습니다').replace(/이에요|예요/g,'입니다').replace(/하지\s*마(세요)?(?=$|[.\s])/g,'삼가 주세요').replace(/금지(?=$|[.\s])/g,'삼가 주세요').trim();D.head=po(D.head);D.body=po(D.body);return D}})();
A.akDp=()=>{let L=[];try{L=corners('aka').all||[]}catch(e){}const i=L.findIndex(t=>t.title===S.ui.akT);if(i<0){toast('주제를 먼저 골라 주세요');return}S.ui.cor=L;A.dpOpen({i})};
(()=>{const f=A.akThm;A.akThm=d=>{const T=akThemes(),t=T[+d.i];if(t&&T.filter(x=>x.tone===t.tone).indexOf(t)>=8)S.ui.akAll=1;if(t)S.ui.akTn=t.tone;f(d)}})();

/* ── 진열 방법 더하기: 계단 · 한 줄 · 둥글게 · 대칭 · 탑 하나 · 짝지어 ── */
DMOOD.push('계단처럼','한 줄로','둥글게','대칭으로','탑 하나','짝지어');
(()=>{const g=dpPlan,h=shelfPlan;shelfPlan=function(t,m){return h(t,(m|0)%3)};
 dpPlan=function(t,mode){const md=mode==null?(S.ui.dpM||0):mode;if(md<3)return g(t,md);
  const B=(t.books||[]).slice(0,S.ui.dpCap||8),n=B.length,it=[{k:'table'}],rows=[],bw=150,bd=210,th=20;
  const put=(i,x,y,q,pl,face)=>{x=Math.round(Math.max(20,Math.min(730,x)));y=Math.round(Math.max(face?250:60,Math.min(670,y)));if(face)it.push({k:'face',x,y:y-235,c:DPC[i%6],n:i+1});it.push({k:'stack',x,y,w:bw,d:bd,h:q*th,c:DPC[i%6],n:i+1});rows.push({n:i+1,b:B[i],place:pl,qty:q+(face?1:0)})};
  let tips=[],need=['A5 POP 꽂이 1개'],pop=[345,40];
  if(md===3){const cols=n<=4?2:3,R=Math.ceil(n/cols),gx=cols===2?[200,550]:[90,375,660],gy=R<=1?[420]:R===2?[300,600]:[200,430,660];B.forEach((b,i)=>{const r=Math.floor(i/cols),c=i%cols,q=Math.max(1,(R-r)*2+(R===1?1:0));put(i,gx[c],gy[r],q,`${['뒷줄','가운뎃줄','앞줄'][R===1?2:R===2?r*2:r]} ${c+1}번째 · ${q}권`,r===0&&R>1)});
    tips=['뒷줄을 가장 높게, 앞으로 올수록 낮게. 어디서 봐도 모든 표지가 보입니다.','뒷줄은 한 권씩 세워 얼굴을 보여 줍니다.','줄과 줄 사이는 손이 들어갈 만큼 띄웁니다.'];need=['북엔드 '+Math.min(4,cols)+'개','A5 POP 꽂이 1개']}
  else if(md===4){B.forEach((b,i)=>{const f=n>1?i/(n-1):.5,q=[2,3,1,3,2,1,3,2][i];put(i,40+f*(690),300+f*220,q,`왼쪽 뒤에서 오른쪽 앞으로 ${i+1}번째 · ${q}권`,i===0)});pop=[600,60];
    tips=['사선 한 줄. 걸어오는 방향에서 차례로 읽힙니다.','첫 권만 세우고 나머지는 눕힙니다. 순서가 있는 주제에 좋습니다.','줄 바깥은 비워 둡니다. POP 은 줄이 끝나는 반대편에.'];need=['북엔드 1개','A5 POP 꽂이 1개']}
  else if(md===5){B.forEach((b,i)=>{const a=-Math.PI/2+i/n*Math.PI*2,q=1+(i%2);put(i,375+Math.cos(a)*300,380+Math.sin(a)*250,q,`둥근 자리 ${i+1}번째 (시계 방향) · ${q}권`)});pop=[345,330];
    tips=['가운데를 비우고 둘러 놓습니다. 평대를 한 바퀴 돌게 됩니다.','POP 은 가운데에 세웁니다. 어느 쪽에서도 보이게 양면으로.','높이는 1~2권으로 낮게. 둥근 모양이 먼저 보여야 합니다.'];need=['양면 POP 꽂이 1개']}
  else if(md===6){const mid=n%2?[0]:[],pairs=[];for(let i=mid.length;i<n;i+=2)pairs.push([i,i+1]);if(mid.length)put(0,375,300,5,'가운데 · 5권 높이로, 맨 위 한 권은 세우기',true);
    pairs.forEach(([a,b],j)=>{const dx=170+j*110,y=mid.length?330+j*150:260+j*170,q=Math.max(1,3-j);put(a,375-dx-(mid.length?0:-60),y,q,`왼쪽 ${j+1}번째 · ${q}권`);if(b<n)put(b,375+dx+(mid.length?0:-60),y,q,`오른쪽 ${j+1}번째 · ${q}권 (왼쪽과 같은 높이)`)});
    tips=['가운데를 기준으로 좌우를 같은 높이, 같은 간격으로 맞춥니다.','단정하고 격식 있는 주제, 행사 연계 평대에 어울립니다.','모서리와 책등을 반듯하게. 흐트러지면 바로 티가 납니다.'];need=['북엔드 1개','A4 POP 꽂이 1개']}
  else if(md===7){it.push({k:'face',x:375,y:95,c:DPC[0],n:1});it.push({k:'stack',x:375,y:330,w:bw,d:bd,h:Math.max(6,n+3)*th,c:DPC[0],n:1});rows.push({n:1,b:B[0],place:`가운데 탑 — 모든 책을 한 권씩 섞어 ${Math.max(6,n+3)}권 높이로, 맨 위에 이 책`,qty:4});
    B.slice(1).forEach((b,j)=>{const i=j+1,m=n-1,f=m>1?j/(m-1):.5;put(i,50+f*670,610+(j%2?40:0),1,`탑 앞에 부채꼴로 ${j+1}번째 · 1권`)});pop=[620,60];
    tips=['한가운데 탑 하나. 멀리서도 보이는 높이가 간판이 됩니다.','탑은 책등이 사방을 보게 돌려 가며 쌓습니다. 무너지지 않게 큰 판형을 아래로.','앞의 책은 한 권씩만. 탑에서 빼 가도록 두지 않습니다.'];need=['A5 POP 꽂이 1개','미끄럼 방지 매트 1장']}
  else{const P=Math.ceil(n/2),gx=P<=2?[200,560]:P===3?[80,375,670]:[190,570];for(let p=0;p<P;p++){const a=p*2,b=a+1,x=gx[p%gx.length],y=P<=3?400:(p<2?290:620);put(a,x-40,y,2,`${p+1}번째 짝 · 아래에 2권`);if(b<n){it.push({k:'stack',x:Math.round(Math.max(20,Math.min(730,x+30))),y:Math.round(y-50),w:bw,d:bd,h:th,c:DPC[b%6],n:b+1});rows.push({n:b+1,b:B[b],place:`${p+1}번째 짝 · ${a+1}번 책에 비스듬히 기대어 1권`,qty:1})}}
    tips=['두 권씩 짝을 지어 놓습니다. 한 권이 다른 한 권을 설명합니다.','짝마다 손글씨 한 줄: 「이 책을 읽었다면 이 책도」.','짝과 짝 사이는 넓게 띄워 따로 읽히게 합니다.'];need=['손글씨 쪽지 '+P+'장','A5 POP 꽂이 1개']}
  it.push({k:'pop',x:pop[0],y:pop[1]});it.push({k:'card',x:405,y:860});
  return{title:t.title,br:t.br||S.br,it,rows,tips,need,mini:false,mode:md,total:rows.reduce((a,r)=>a+r.qty,0)}}})();

/* ── 장르 POP: 용도 읽기 (서가 안내 · 추천 · 새로 들어온 · 많이 나간) ── */


function genreOf(v){const ws=v.replace(/[.,!?]/g,' ').split(/\s+/).filter(Boolean);for(const w of ws){const b=w.replace(/(은|는|이|가|을|를|의|에|도|만)$/,''),g=GEN.find(x=>x.k.test(w)||x.k.test(b));if(g)return{g,word:(g.k.test(w)?w:b)}}return null}
function genreUse(v,g){if(/신간|새로|새 책|들어온|입고|갓 나온/.test(v))return'new';if(/베스트|많이|잘 나가|인기|순위|팔리/.test(v))return'best';if(/추천|읽을|고른|권하|권합|좋은|오늘의|이달의|요즘/.test(v))return'pick';if(/코너|서가|분야|여기|안내|표지|이름표|자리|칸|쪽/.test(v))return'sign';const m=ls.get('gUse',{})[g.n];return m||(v.replace(/\s/g,'').length<=g.n.length+2?'sign':'pick')}
function genreBooks(g,use,br){let P=[];try{P=pool(br)}catch(e){}let L=P.filter(b=>g.c.includes(b.cat)&&g.t.test(b.t||'')&&!/미니북|키링|필사책|리커버/.test(b.t||''));
  if(use==='new'){let N=[];try{N=recs(br).nw||[]}catch(e){}const nn=N.filter(b=>g.t.test(b.t||'')&&g.c.includes(b.cat));L=[...nn,...L.filter(b=>!(b.here>0))]}
  else if(use==='best')L=L.slice().sort((a,b)=>((b.mine||0)+(b.sold||0))-((a.mine||0)+(a.sold||0)));else L=L.slice().sort((a,b)=>(b.here>0)-(a.here>0)||(b.mine||0)-(a.mine||0));
  return L.filter((b,i,A)=>A.findIndex(z=>nt(z.t).slice(0,5)===nt(b.t).slice(0,5))===i).slice(0,6)}
function genreMake(word,g,use){const aka=S.mode==='aka',br=aka?'aka':curBr(),tag=aka?'아카데미하우스':TAGN(br);
  if(use==='sign')return Object.assign(defD(),{kind:'shelf',br,tag,head:word,body:g.h,sym:g.sym,pal:1});
  const B=genreBooks(g,use,br),b=B[0]||{},head=use==='new'?`새로 들어온\n${word}`:use==='best'?`요즘 많이 집는\n${word}`:`오늘의 ${word}`;
  const D=Object.assign(defD(),{kind:'pop',br,tag,head,body:g.h,sym:g.sym,st:use==='best'?1:0,pal:use==='new'?3:use==='best'?2:0,books:B.map(x=>({t:x.t,a:x.a,p:x.p,why:''}))});
  if(b.t){D.book=b.t;D.author=[b.a,b.p].filter(Boolean).join(' · ')}return D}
A.gUse=d=>{const G=S.ui.gen;if(!G)return;G.use=d.u;const m=ls.get('gUse',{});m[G.g.n]=d.u;ls.set('gUse',m);const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));S.ui.D=genreMake(G.word,G.g,d.u);render()};
(()=>{const f=A.ideaGo;A.ideaGo=async d=>{const el=$('ideaIn')||$('cIdea')||$('qIn'),v=((d&&d.v)||(el&&el.value)||'').trim(),G=v&&v.length<=18?genreOf(v):null;
  if(!G||(S.mode==='store'&&S.br==='all')){S.ui.gen=null;return f(d)}
  const use=genreUse(v,G.g),H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));S.ui.gen={g:G.g,word:G.word,use};S.ui.idea=v;S.ui.D=genreMake(G.word,G.g,use);S.view[S.mode]='design';window.scrollTo(0,0);render()}})();
(()=>{const f=V.store.design,g=()=>{const G=S.ui.gen,h=f();if(!G)return h;const B=G.use==='sign'?[]:genreBooks(G.g,G.use,S.mode==='aka'?'aka':curBr());
  const bar=`<div class="card gbar"><div class="qbar" style="margin:0"><span class="note"><b>${esc(G.word)}</b> · 용도를 「${GUSE.find(x=>x[0]===G.use)[1]}」로 읽었습니다</span>${GUSE.map(([u,n])=>`<button class="chip" data-a="gUse" data-u="${u}" aria-pressed="${G.use===u}">${n}</button>`).join('')}</div>${B.length?`<p class="note" style="margin:8px 0 0">고른 책 · ${B.map(b=>esc(b.t)).join(' · ')}</p>`:G.use!=='sign'?'<p class="note" style="margin:8px 0 0">이 지점 자료에서 이 분야 책을 찾지 못했습니다. 책 이름은 아래에서 직접 적어 주세요.</p>':''}</div>`;
  const i=h.indexOf('<div class="sec">');return i>0?h.slice(0,i)+bar+h.slice(i):bar+h};V.store.design=g;V.aka.design=g})();

/* ── 로그인 없이: 바코드 스캔 · 자리 크기 고르기 ── */

A.dpSize=d=>{const i=+d.i,z=DPSZ[i];if(S.ui.dpRd&&S.ui.dpRd.zi===i){A.dpFree();return}const titles=z.f?Math.min(8,Math.floor(z.w/17)*Math.min(2,z.t-2)+2):Math.min(8,Math.floor(z.w/22)*Math.floor(z.d/30)),copies=z.f?Math.floor(z.w/17)*2+Math.floor(z.w/3)*(z.t-2):titles*3;
  S.ui.dpRd={zi:i,fixture:z.f?'벽 서가':'평대',w:z.w,d:z.d,tiers:z.t||1,titles,copies,why:z.f?`표지가 보이게 한 단에 ${Math.floor(z.w/17)}권까지 놓을 수 있습니다. 눈높이 두 단은 표지로, 나머지는 책등으로.`:`책 사이를 손 하나 들어갈 만큼 띄우면 ${titles}종이 알맞습니다. 더 놓으면 표지가 서로 가립니다.`};S.ui.dpF=z.f;S.ui.dpCap=titles;S.ui.dpSz={w:z.w,d:z.d};A.dpOpen({i:S.ui.dp.i})};
let _zx=null;const zxLoad=()=>_zx||(_zx=new Promise((ok,no)=>{if(window.ZXing)return ok(window.ZXing);const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';s.onload=()=>ok(window.ZXing);s.onerror=()=>{_zx=null;no(new Error('zx'))};document.head.appendChild(s)}));
async function bcFromFile(file){const out=[];try{if('BarcodeDetector' in window){const bd=new BarcodeDetector({formats:['ean_13']}),bm=await createImageBitmap(file);(await bd.detect(bm)).forEach(r=>out.push(r.rawValue));if(out.length)return out}}catch(e){}
  try{const Z=await zxLoad(),url=URL.createObjectURL(file),r=await new Z.BrowserMultiFormatReader().decodeFromImageUrl(url);URL.revokeObjectURL(url);if(r)out.push(r.getText())}catch(e){}return out}
function scanAdd(code){const isbn=isbnOk(code);if(!isbn)return false;const L=S.ui.oPh=S.ui.oPh||[],ex=L.find(b=>b.isbn===isbn);if(ex){ex.qty=Math.min(99,ex.qty+1);return true}
  let P=[];try{P=pool(S.br)}catch(e){}const BK=window.BOOKS||{},h=[...P,...(BK.yes24||[]),...(BK.aladin||[]),...(BK.kyobo||[])].find(b=>b.isbn===isbn),row={t:h?h.t:'제목 찾는 중…',a:(h&&h.a)||'',p:(h&&h.p)||'',isbn,price:(h&&h.price)||0,qty:1,src:'바코드'};L.unshift(row);
  if(!h)fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn+'&country=KR').then(r=>r.json()).then(j=>{const v=j&&j.items&&j.items[0]&&j.items[0].volumeInfo;if(v&&v.title){row.t=v.title;row.a=(v.authors||[]).join(', ');row.p=v.publisher||''}else row.t='제목 미확인 (ISBN 으로 주문)';render();scanPaint()}).catch(()=>{row.t='제목 미확인 (ISBN 으로 주문)';render();scanPaint()});
  return true}
let _sc=null;function scanPaint(){const e=$('scanList');if(e){const L=S.ui.oPh||[];e.innerHTML=L.length?L.slice(0,6).map(b=>`<div><b>${esc(b.t)}</b> <small>${b.isbn} · ${b.qty}권</small></div>`).join('')+(L.length>6?`<div><small>외 ${L.length-6}종</small></div>`:''):'<div><small>바코드를 화면 가운데에 비춰 주세요</small></div>';const n=$('scanN');if(n)n.textContent=L.length?`${L.length}종 읽음 · 닫기`:'닫기'}}
A.scanOpen=async()=>{if(S.br==='all'){toast('위에서 지점을 먼저 고르세요');return}if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){toast('이 기기에서는 카메라를 열 수 없습니다. 「사진에서 읽기」를 써 주세요.');return}
  const box=document.createElement('div');box.id='scan';box.innerHTML='<video id="scanV" playsinline muted></video><div class="scanF"></div><div id="scanList"></div><button class="btn pri" id="scanN" data-a="scanClose">닫기</button>';document.body.appendChild(box);scanPaint();
  let stream;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false})}catch(e){A.scanClose();toast('카메라를 허용해야 스캔할 수 있습니다. 「사진에서 읽기」로도 됩니다.');return}
  const v=$('scanV');v.srcObject=stream;await v.play().catch(()=>{});let last='',lastT=0,stop=false;const hit=c=>{const now=Date.now();if(c===last&&now-lastT<2500)return;last=c;lastT=now;if(scanAdd(c)){try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}box.classList.add('ok');setTimeout(()=>box.classList.remove('ok'),250);scanPaint()}};
  _sc={stop:()=>{stop=true;try{stream.getTracks().forEach(t=>t.stop())}catch(e){}}};
  if('BarcodeDetector' in window){let bd;try{bd=new BarcodeDetector({formats:['ean_13']})}catch(e){}if(bd){const loop=async()=>{if(stop)return;try{(await bd.detect(v)).forEach(r=>hit(r.rawValue))}catch(e){}setTimeout(loop,220)};loop();return}}
  try{const Z=await zxLoad(),rd=new Z.BrowserMultiFormatReader(),cv=document.createElement('canvas'),cx=cv.getContext('2d',{willReadFrequently:true});const loop=()=>{if(stop)return;try{if(v.videoWidth){cv.width=v.videoWidth;cv.height=v.videoHeight;cx.drawImage(v,0,0);const lum=new Z.HTMLCanvasElementLuminanceSource(cv),r=rd.decode(new Z.BinaryBitmap(new Z.HybridBinarizer(lum)));if(r)hit(r.getText())}}catch(e){}setTimeout(loop,260)};loop()}catch(e){A.scanClose();toast('스캔 도구를 불러오지 못했습니다. 「사진에서 읽기」를 써 주세요.')}};
A.scanClose=()=>{if(_sc){_sc.stop();_sc=null}const b=$('scan');if(b)b.remove();render()};

/* 진열 창: 고르는 것을 두 개의 선택 상자로 줄인다 */
C.dpSelM=el=>A.dpMode({v:el.value});C.dpSelZ=el=>{if(el.value==='')A.dpFree();else A.dpSize({i:el.value})};
(()=>{const f=A.dpOpen;A.dpOpen=d=>{f(d);const box=$('sheetBox');if(!box)return;const ch=box.querySelector('.chips'),bar=box.querySelector('.dpx .qbar');if(!ch)return;const fx=S.ui.dpF||0,md=S.ui.dpM||0,zi=S.ui.dpRd&&S.ui.dpRd.zi;
  ch.className='dpsel';ch.innerHTML=`${DFIX.map((n,i)=>`<button class="chip" data-a="dpFix" data-v="${i}" aria-pressed="${fx===i}">${n}</button>`).join('')}<select data-c="dpSelM" aria-label="놓는 법">${DMOOD.map((n,i)=>fx&&i>2?'':`<option value="${i}" ${md===i?'selected':''}>${n}</option>`).join('')}</select><select data-c="dpSelZ" aria-label="자리 크기"><option value="">자리 크기</option>${DPSZ.map((z,i)=>z.f===fx?`<option value="${i}" ${zi===i?'selected':''}>${z.n}</option>`:'').join('')}</select>${fx===0?`<button class="chip" data-a="dp3" aria-pressed="${!!S.ui.dp3}">3D</button>`:''}`;if(bar)bar.remove()}})();

/* ── 모바일 / 데스크탑 보기 전환 ── */
const vwGet=()=>ls.get('vw',null),vwMob=()=>{const v=vwGet();return v==='m'||(v!=='d'&&(window.screen&&Math.min(screen.width,window.innerWidth||9999)<700))};
function vwApply(){const v=vwGet();document.body.classList.toggle('vm',v==='m');const m=document.querySelector('meta[name="viewport"]');if(m)m.setAttribute('content',v==='d'?'width=1100':'width=device-width, initial-scale=1')}
A.vw=()=>{ls.set('vw',vwMob()?'d':'m');vwApply();render();window.scrollTo(0,0)};
(()=>{const r=render;render=function(){r.apply(this,arguments);const h=document.querySelector('.homeb');if(h&&!document.querySelector('.vwb')){const b=document.createElement('button');b.className='homeb vwb';b.dataset.a='vw';const mob=vwMob();b.title=mob?'데스크탑 화면으로 보기':'모바일 화면으로 보기';b.textContent=mob?'데스크탑':'모바일';h.after(b)}};vwApply()})();

/* ── 낱말 하나 · 사진 한 장에서 넓혀 생각하기 → 평대 한 벌 ── */
const josa=(w,a,b)=>{const c=w.charCodeAt(w.length-1);return w+((c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28)?a:b)};
function feelOf(w){const A=ASSOC.find(x=>x[0].test(w));return A?{f:A[1],l:A[2]}:{f:'',l:[[`${w}의 반대편`,w],[`${josa(w,'을','를')} 기다리는 사람`,w],[`${w} 다음에 오는 것`,w]]}}
A.feelGo=d=>{const w=(d.w||'').trim();if(!w)return;const F=feelOf(w),sym=(IDS.find(([r])=>r.test(w+' '))||[0,'none'])[1],dark=/밤|어둠|새벽|겨울|안개|고독|침묵/.test(w),pal=dark?2:/숲|나무|풀|산|꽃|봄/.test(w)?1:/노을|가을|커피|저녁/.test(w)?3:/바다|강|비|물/.test(w)?4:0,chain=`「${w}」${F.f?' → '+F.f:''}`;
  if(S.mode==='store'&&S.br!=='all'){const un=addDays(TODAY,14),T=F.l.map(([t,kw],i)=>({id:'f'+Date.now().toString(36)+i,tone:'내 생각',src:w+' '+kw,title:t,hook:`${chain}${d.note?' · '+d.note:''}`,sym,bpal:pal,ppal:pal,until:un,place:'입구 평대',pop:{head:t,body:chain},band:t,pick:[],key:w}));
    S.ui.myT=[...T,...(S.ui.myT||[])].slice(0,6);ls.set('myT',S.ui.myT);S.ui.cTone='내 생각';S.view.store='cur';window.scrollTo(0,0);render();toast(`「${w}」에서 세 갈래로 넓혔습니다`);return}
  if(S.mode==='store'){toast('위에서 지점을 먼저 고르세요');return}
  const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));const n=(S.ui.feelN=((S.ui.feelW===w?(S.ui.feelN|0)+1:0))%3);S.ui.feelW=w;S.ui.D=Object.assign(defD(),{kind:'pop',br:'aka',tag:'아카데미하우스',sym,st:dark?1:0,pal,head:F.l[n][0],body:chain+(d.note?'\n'+d.note:''),mkey:w});S.ui.gen=null;S.view.aka='design';window.scrollTo(0,0);render();toast('같은 낱말을 다시 넣으면 다른 갈래가 나옵니다')};
(()=>{const f=A.ideaGo;A.ideaGo=async d=>{const el=$('ideaIn')||$('cIdea')||$('qIn'),v=((d&&d.v)||(el&&el.value)||'').trim();if(v&&!/\s/.test(v)&&v.length<=6&&/^[가-힣]+$/.test(v)&&!genreOf(v)&&!NOTR.test(v)){A.feelGo({w:v});return}return f(d)}})();
C.feelPhoto=async el=>{const f=el.files&&el.files[0];if(!f)return;el.value='';try{const bm=await createImageBitmap(f),cv=document.createElement('canvas');cv.width=cv.height=40;const cx=cv.getContext('2d');cx.drawImage(bm,0,0,40,40);const px=cx.getImageData(0,0,40,40).data;let R=0,G=0,B=0,n=0,L2=0;for(let i=0;i<px.length;i+=4){R+=px[i];G+=px[i+1];B+=px[i+2];n++}R/=n;G/=n;B/=n;
    const mx=Math.max(R,G,B),mn=Math.min(R,G,B),lum=(mx+mn)/510,sat=mx===mn?0:(mx-mn)/(lum>.5?(510-mx-mn):(mx+mn));let h=0;if(mx!==mn){h=mx===R?((G-B)/(mx-mn))%6:mx===G?(B-R)/(mx-mn)+2:(R-G)/(mx-mn)+4;h=(h*60+360)%360}
    const w=lum<.26?'밤':lum>.82&&sat<.18?'눈':sat<.12?(lum>.6?'안개':'돌'):h>=70&&h<170?'숲':h>=170&&h<260?(lum<.45?'새벽':'바다'):h>=260&&h<330?'노을':h<25||h>=330?(lum<.5?'노을':'가을'):h<50?'가을':'빛',tone=lum<.35?'어둡고':lum>.7?'밝고':'차분하고',col=sat<.12?'빛이 옅은':h>=70&&h<170?'초록이 많은':h>=170&&h<260?'푸른':h<50||h>=330?'붉고 따뜻한':'노란';
    A.feelGo({w,note:`${tone} ${col} 사진에서 읽었습니다`})}catch(e){toast('사진을 읽지 못했습니다. 다른 사진으로 해 주세요.')}};

/* ── 매출이 말하는 것 → 이번 주 할 일 (자동) ── */
function salesActs(br){const out=[],all=yms(),nowYm=TODAY.slice(0,7),full=all.filter(y=>y<nowYm),m1=full[full.length-1],m0=full[full.length-2];if(!m1)return out;
  const row=(b,ym)=>sales().find(d=>d.br===b&&d.ym===ym),mon=y=>+y.slice(5)+'월',pct=(a,b)=>b?Math.round((a-b)/b*100):0;
  if(br==='all'){BR.forEach(b=>{const a=row(b.k,m1),p=row(b.k,m0);if(a&&p&&p.amt>0){const c=pct(a.amt,p.amt);if(c<=-20)out.push({lv:'low',t:`${brN(b.k)} ${mon(m1)} 매출이 ${mon(m0)}보다 ${Math.abs(c)}% 줄었습니다`,s:'평대를 바꾼 지 2주가 넘었는지, 잘 나가던 책이 비었는지 먼저 봅니다.',b:['이 지점 열기','br',b.k]});else if(c>=25)out.push({lv:'ok',t:`${brN(b.k)} ${mon(m1)} 매출이 ${c}% 늘었습니다`,s:'무엇이 팔렸는지 보고 다른 지점 평대에 옮겨 봅니다.',b:['이 지점 열기','br',b.k]})}});return out.sort((x,y)=>(x.lv==='low'?0:1)-(y.lv==='low'?0:1)).slice(0,6)}
  let R=null;try{R=autoSum(br)}catch(e){}const a=row(br,m1),p=row(br,m0);
  if(R&&R.pace&&R.fc){const gap=Math.round((R.pace.proj-R.fc)/R.fc*100);if(gap<=-10)out.push({lv:'low',t:`이번 달은 지금 속도로 ${Math.round(R.pace.proj/1e4)}만원, 예상보다 ${Math.abs(gap)}% 낮습니다`,s:`${R.pace.day}일까지 ${Math.round(R.pace.amt/1e4)}만원. 남은 주말 전에 평대를 한 번 바꿉니다.`,b:['큐레이션 열기','go','cur']});else if(gap>=10)out.push({lv:'ok',t:`이번 달은 지금 속도로 ${Math.round(R.pace.proj/1e4)}만원, 예상보다 ${gap}% 높습니다`,s:'잘 나가는 책이 떨어지지 않게 주문을 먼저 봅니다.',b:['주문 보기','go','stock']})}
  let nd=[];try{nd=needs(br)}catch(e){}if(nd.length)out.push({lv:'low',t:`2주 안에 떨어질 책 ${nd.length}종`,s:nd.slice(0,3).map(x=>x.t).join(' · '),b:['주문에 담으러 가기','go','stock']});
  if(a&&p&&p.amt>0&&a.cu&&p.cu&&a.cu.rc&&p.cu.rc){const rc=pct(a.cu.rc,p.cu.rc),pa=pct(a.amt/a.cu.rc,p.amt/p.cu.rc);if(Math.abs(rc)>=10||Math.abs(pa)>=10)out.push({lv:rc<0&&pa<=0?'low':'mute',t:`손님 수 ${rc>=0?'+':''}${rc}% · 한 번에 쓰는 돈 ${pa>=0?'+':''}${pa}%`,s:rc<-9&&pa>=0?'오는 사람이 줄었습니다. 입구에서 보이는 평대와 안내가 먼저입니다.':rc>=0&&pa<-9?'사람은 왔는데 적게 삽니다. 책 옆에 함께 살 책을 붙여 놓습니다.':rc<0?'손님과 객단가가 함께 줄었습니다. 평대부터 바꿉니다.':'손님이 늘었습니다. 계산대 옆에 가벼운 책을 둡니다.',b:rc>=0&&pa<-9?['짝지어 진열 보기','go','cur']:['큐레이션 열기','go','cur']})}
  try{const P=profile(br),g=GR.filter(x=>x!=='기타').map(x=>[x,P.sh[x]-P.avg[x]]).sort((x,y)=>y[1]-x[1])[0];if(g&&g[1]>=.08)out.push({lv:'ok',t:`${g[0]} 비중이 다른 지점보다 ${Math.round(g[1]*100)}%p 높습니다`,s:'이 지점의 얼굴입니다. 서가 안내와 추천 POP 을 이 분야로 만듭니다.',b:[`${g[0]} 추천 POP`,'idea',g[0]+' 추천']})}catch(e){}
  const L3=full.slice(-3).map(y=>row(br,y)).filter(d=>d&&d.cu),T=[0,0,0,0];let wkd=0,wke=0;L3.forEach(d=>{(d.cu.t||[]).forEach((v,i)=>T[i]+=v||0);wkd+=d.cu.wkd||0;wke+=d.cu.wke||0});const ts=T.reduce((x,y)=>x+y,0);
  if(ts){const i=T.indexOf(Math.max(...T)),lab=['12시 이전','12~15시','15~18시','18시 이후'][i];out.push({lv:'mute',t:`가장 붐비는 때는 ${lab} (${Math.round(T[i]/ts*100)}%)`,s:'북토크와 낭독은 이 시간 바로 뒤에 잡으면 지나던 손님이 앉습니다.',b:S.br==='aka'?['북토크 만들기','talk','']:null})}
  if(wkd+wke){const w=Math.round(wke/(wkd+wke)*100);if(w>=35)out.push({lv:'mute',t:`주말 매출이 ${w}%`,s:'평대는 금요일 저녁에 바꾸고, 주말 재고는 목요일까지 주문합니다.',b:null})}
  const O={low:0,ok:1,mute:2};return out.sort((x,y)=>O[x.lv]-O[y.lv]).slice(0,6)}
A.saDo=d=>{if(d.t==='br'){A.br({k:d.v})}else if(d.t==='go')A.go({v:d.v});else if(d.t==='idea')A.ideaGo({v:d.v});else if(d.t==='talk'){S.mode='aka';try{sessionStorage.setItem('sj.mode','aka')}catch(e){}A.go({v:'talk'})}};
(()=>{const f=V.store.ana;V.store.ana=()=>{const h=f();let L=[];try{L=salesActs(S.br)}catch(e){}if(!L.length)return h;
  const c=`<div class="sec"><h2>이번 주 할 일 <small class="note">매출에서 자동으로 뽑았습니다</small></h2></div><div class="card todo sact">${L.map(x=>`<div class="li"><span class="pill ${x.lv==='low'?'p-low':x.lv==='ok'?'p-ok':'p-mute'}">${x.lv==='low'?'먼저':x.lv==='ok'?'기회':'참고'}</span><div class="t"><b>${x.t}</b><small>${esc(x.s)}</small></div>${x.b?`<button class="btn sm" data-a="saDo" data-t="${x.b[1]}" data-v="${esc(x.b[2])}">${x.b[0]}</button>`:''}</div>`).join('')}</div>`;
  const i=h.indexOf('<div class="sec">');return i>=0?h.slice(0,i)+c+h.slice(i):c+h}})();

/* ── 모바일 다이얼: 아래에서 엄지로 돌려 화면을 고른다 ── */
(()=>{let key='',tmr=0,busy=false,tgt=null,t0=0;const cur=()=>navCur();
  const paint=()=>{const d=$('dial');if(!d)return;const c=d.scrollLeft+d.clientWidth/2;[...d.children].forEach(b=>{if(!b.dataset.v)return;const x=b.offsetLeft+b.offsetWidth/2,t=Math.min(1,Math.abs(x-c)/(d.clientWidth*.5));b.style.transform=`translateY(${(t*t*16).toFixed(1)}px) scale(${(1-t*.2).toFixed(3)})`;b.style.opacity=(1-t*.68).toFixed(2);b.classList.toggle('on',t<.14)})};
  const center=(v,smooth)=>{const d=$('dial'),b=d&&d.querySelector(`[data-v="${v}"]`);if(b)d.scrollTo({left:b.offsetLeft+b.offsetWidth/2-d.clientWidth/2,behavior:smooth?'smooth':'auto'})};
  const settle=()=>{const d=$('dial');if(!d||busy)return;const c=d.scrollLeft+d.clientWidth/2;let best=null,bd=1e9;[...d.children].forEach(b=>{if(!b.dataset.v)return;const x=Math.abs(b.offsetLeft+b.offsetWidth/2-c);if(x<bd){bd=x;best=b}});if(!best)return;const v=best.dataset.v;if(tgt){if(v!==tgt&&Date.now()-t0<1400){clearTimeout(tmr);tmr=setTimeout(settle,160);return}tgt=null}if(v!==cur()){try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}busy=true;{const p=v.split(':');A.go({v:p[1],m:p[0]})}busy=false}center(v,true)};
  window.dialSync=()=>{const on=!S.locked&&vwMob();document.body.classList.toggle('dialon',on);let d=$('dial');if(!on){if(d)d.parentNode.remove();key='';return}
    if(!d){const w=document.createElement('div');w.className='dialw';w.innerHTML='<i class="dialm"></i><nav class="dial" id="dial" aria-label="화면 고르기"></nav>';document.body.appendChild(w);d=$('dial');d.addEventListener('scroll',()=>{requestAnimationFrame(paint);clearTimeout(tmr);tmr=setTimeout(settle,130)},{passive:true});d.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b){tgt=b.dataset.v;t0=Date.now();center(b.dataset.v,true)}})}
    const NL=navList(),k=NL.map(t=>t[2]+':'+t[0]).join(',');if(k!==key){key=k;d.innerHTML='<span class="dpad"></span>'+NL.map(([v,l,m])=>`<button type="button" data-v="${m}:${v}">${l}</button>`).join('')+'<span class="dpad"></span>';requestAnimationFrame(()=>{center(cur(),false);paint()})}
    else if(!busy){const c=d.scrollLeft+d.clientWidth/2,b=d.querySelector(`[data-v="${cur()}"]`);if(b&&Math.abs(b.offsetLeft+b.offsetWidth/2-c)>b.offsetWidth*.6){tgt=cur();t0=Date.now();center(cur(),false)}}paint()};
  const r=render;render=function(){r.apply(this,arguments);try{window.dialSync()}catch(e){}};window.addEventListener('resize',()=>{try{window.dialSync()}catch(e){}})})();

/* ── 워크룸 가이드: 글 대신 실제 화면이 움직이는 짧은 안내. 처음 한 번은 저절로 열린다 ── */
const GDS=[['a','낱말 하나면 평대 한 벌','「비」라고만 적거나 말하면 됩니다'],['e','결과물은 여덟 가지 모양','원고지 · 도서카드 · 영수증 · 책등'],['b','말하면 일정이 됩니다','말하기를 누르고 한 줄'],['c','북토크는 세 칸','준비 · 진행표 · 질문까지'],['d','매출이 할 일을 알려 줍니다','이번 주 할 일']];
A.gdOpen=()=>{try{localStorage.setItem('gdSeen','1')}catch(e){}S.ui.gd=0;gdDraw()};A.gdClose=()=>{const g=$('guide');if(g)g.remove()};A.gdGo=d=>{S.ui.gd=(S.ui.gd+(+d.d)+GDS.length)%GDS.length;gdDraw()};A.gdTo=d=>{S.ui.gd=+d.i;gdDraw()};
function gdDraw(){let g=$('guide');if(!g){g=document.createElement('div');g.id='guide';document.body.append(g);let sx=0;g.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});g.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50){e.stopPropagation();A.gdGo({d:dx<0?1:-1})}},{passive:true})}
  const i=S.ui.gd|0,[k,t,s]=GDS[i];g.innerHTML=`<div class="gdb"><button class="gdx" data-a="gdClose" aria-label="닫기">닫기</button><div class="gdn">가이드 ${i+1} / ${GDS.length}</div><h2>${t}</h2><p>${s}</p><div class="gdi"><button class="gda" data-a="gdGo" data-d="-1" aria-label="이전">‹</button><img src="guide/${k}.gif?v=4" alt="${t}"><button class="gda" data-a="gdGo" data-d="1" aria-label="다음">›</button></div><div class="gdd">${GDS.map((x,j)=>`<button data-a="gdTo" data-i="${j}" aria-pressed="${j===i}" aria-label="${x[1]}"></button>`).join('')}</div></div>`}
(()=>{const r=render;render=function(){r.apply(this,arguments);const h=document.querySelector('.vwb')||document.querySelector('.homeb');if(h&&!document.querySelector('.gdbtn')){const b=document.createElement('button');b.className='homeb gdbtn';b.dataset.a='gdOpen';b.textContent='가이드';h.after(b)}let seen=1;try{seen=localStorage.getItem('gdSeen')}catch(e){}if(!seen&&!S.locked&&S.loaded&&!$('guide'))A.gdOpen()}})();

/* 위에서 지점(또는 아카데미/서점)을 바꾸면 만들고 있던 결과물의 지점 이름도 따라 바뀐다 */
(()=>{const f=A.br;A.br=d=>{f(d);if(S.ui.D&&d.k&&d.k!=='all'&&S.ui.D.br!==d.k&&typeof A.dBr==='function')A.dBr({k:d.k})};const g=A.mode;A.mode=d=>{g(d);const D=S.ui.D;if(!D||typeof A.dBr!=='function')return;const k=S.mode==='aka'?'aka':(S.br&&S.br!=='all'?S.br:D.br);if(k&&D.br!==k)A.dBr({k})}})();

/* ── 화면마다 물음표: 누르면 이 화면이 하는 일이 한 줄로 펼쳐진다 ── */
const HELP={store:{cur:'낱말 · 사진 · 생각 한 줄이면 평대 한 벌(책 · POP · 진열)이 나옵니다.',design:'POP · 띠지 · 쇼카드 · 책 목록 · 선반 이름표를 만들어 PDF · PNG 로 뽑습니다.',trend:'책방 소식과 통계, 바로 써먹을 아이디어를 봅니다.',biz:'지원사업 일정과 신청서 초안, 낼 서류를 챙깁니다.',stock:'떨어질 책을 계산하고 바코드로 담아 북센 주문을 준비합니다. 확정은 사람이 합니다.',ana:'매출을 읽고 이번 주 할 일을 뽑아 줍니다.',more:'자주 쓰지 않는 화면을 모아 두었습니다.'},
  aka:{space:'인물도서관 · 씨앗숲 · 사이서가의 큐레이션과 배치를 만듭니다.',design:'안내판 · POP · 대관 안내를 만듭니다.',trend:'책방 소식과 통계, 바로 써먹을 아이디어를 봅니다.',talk:'저자 · 책 · 날짜 세 칸이면 준비 일정 · 진행표 · 질문지가 나옵니다.',insta:'인스타그램 반응을 읽고 게시물 초안을 씁니다.',today:'한 줄로 일정을 넣고 오늘 할 일을 봅니다.',cal:'다가오는 일정과 행사 기획을 봅니다.'}};
A.hpT=()=>{const k=S.mode+'.'+S.view[S.mode];S.ui.hp=S.ui.hp===k?null:k;render()};
(()=>{const r=render;render=function(){r.apply(this,arguments);const m=S.mode,v=S.view[m],t=(HELP[m]||{})[v],mn=document.querySelector('main');if(!t||!mn||mn.querySelector('.hpq'))return;const on=S.ui.hp===m+'.'+v,b=document.createElement('button');b.className='hpq';b.dataset.a='hpT';b.setAttribute('aria-expanded',on);b.setAttribute('aria-label','이 화면 설명');b.textContent='?';
  const h=mn.querySelector('.hero h2, .sec h2, h2'),d=document.createElement('p');d.className='hpd';d.textContent=t;if(h&&mn.firstElementChild&&(mn.firstElementChild.contains(h))){h.appendChild(b);if(on)(h.closest('.hero,.sec')||h).after(d)}else{const w=document.createElement('div');w.className='hpw';w.appendChild(b);mn.prepend(w);if(on)w.after(d)}}})();
