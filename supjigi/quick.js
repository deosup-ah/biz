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
const QPL=['대화의 집','내일을 위한 집','여해의 집','새벽의 집','구름의 집','기도의 집','사유의 숲','본관','루프탑','라운지','카페','다이닝','서점','명상센터','회의실','세미나룸','강당','야외'];
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
const QAL={기후:'뜨거워지는',환경:'뜨거워지는',동물:'먹히는',비건:'먹히는',노동:'일의 뒷면',차별:'나는 아니라고',차이:'나는 아니라고',장애:'나는 아니라고',예술:'보는 법',미술:'보는 법',사진:'보는 법'};
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
  ${aka&&T.length?`<div class="qthm">${T.map((t,i)=>[t,i]).filter(([t])=>t.tone===tn).slice(0,S.ui.akAll?99:8).map(([t,i])=>true?`<button data-a="akThm" data-i="${i}" aria-pressed="${S.ui.akT===t.title}">${esc(t.title)}</button>`:'').join('')}${!S.ui.akAll&&T.filter(t=>t.tone===tn).length>8?`<button class="lnk" data-a="ui" data-k="akAll" data-v="1">더 보기</button>`:''}${S.ui.akT?`<button class="lnk" data-a="akPlan">이 주제로 모임 기획 ›</button>`:''}</div>`:''}${(S.ui.err||{}).photo?`<p class="note">${esc(S.ui.err.photo)}</p>`:''}`;return bar+f()};V.store.design=g;V.aka.design=g})();

/* ── 굿즈 제안: 무엇을 · 어떻게 묶어 · 어디에 ── */
const GOODS=[
 {n:'문장 책갈피',w:'책 한 권에 한 장. 계산대에서 가장 부담 없이 따라오는 물건입니다.',set:'주제마다 3종 · 큐레이션 책을 사면 한 장 증정, 낱장 판매',at:'계산대 옆 · 평대 POP 아래',first:'주제당 100장, 2주 뒤 남은 수로 다음 수량 결정',mode:'store'},
 {n:'블라인드 북',w:'제목을 가리고 한 문장만 보여 줍니다. 「다른 시선」 주제와 잘 맞습니다.',set:'크라프트 포장 + 띠지 한 줄 + 책갈피 · 재고가 넉넉한 책부터',at:'입구 평대 한쪽, 8권 이하로 적게',first:'주제 하나에 8권, 포장은 매장에서',mode:'store'},
 {n:'읽기 꾸러미',w:'책 한 권에 엽서와 차 한 봉. 선물 수요가 오르는 연말에 맞습니다.',set:'책 1 + 엽서 2 + 티백 1 · 띠지로 묶기',at:'카페 쪽 벽 서가 눈높이 칸',first:'지점당 10세트, 예약 없이 현장 판매로 시험',mode:'store'},
 {n:'북한산 엽서 세트',w:'공간의 풍경이 곧 기념품입니다. 숙박 · 연수 손님이 가져갈 것이 필요합니다.',set:'계절 4장 한 묶음 · 본관과 여섯 개의 집 그림',at:'본관 프런트 · 카페 계산대',first:'200세트, 단체 환영 꾸러미에 한 장씩 넣어 반응 보기',mode:'aka'},
 {n:'단체 환영 꾸러미',w:'연수 첫날 책상 위에 놓이는 것. 재방문과 후기에 닿습니다.',set:'공간 안내 한 장 + 엽서 + 추천 책 목록 + 카페 음료권',at:'대관 공간 책상 · 객실',first:'다음 단체 1팀에 먼저 적용, 담당자 의견 받기',mode:'aka'},
 {n:'사유의 숲 필사 노트',w:'명상 · 낭독 프로그램과 묶으면 프로그램이 물건으로 남습니다.',set:'얇은 중철 노트 + 이달의 문장 1쪽 인쇄',at:'사유의 숲 입구 · 프로그램 접수대',first:'프로그램 참가자 수만큼 먼저, 남으면 판매',mode:'aka'}];
A.gdMore=async()=>{const aka=S.mode==='aka';const out=await ask('goods',`"더숲"(${aka?'북한산 자락 복합 문화 공간 아카데미하우스: 서점 · 북스테이 · 카페 · 대관 · 프로그램':'서울의 동네 서점 여러 지점: 문학 · 인문 · 예술 · 과학 중심'})에서 소량으로 시험해 볼 굿즈 · 묶음 상품 4가지를 제안하세요. 흔한 에코백 · 머그 말고, 이 공간만 할 수 있는 것. 원가나 판매량 숫자는 지어내지 말고, 과장 없이 담백하게.\nJSON 배열로만: [{"n":"이름","w":"왜 지금 이 공간에 맞는지 한 문장","set":"구성","at":"놓을 자리","first":"처음 시험하는 방법"}]`);if(Array.isArray(out))S.ui.gd=out.filter(x=>x&&x.n).slice(0,4)};
function goodsCard(){const m=S.mode,L=[...(S.ui.gd||[]),...GOODS.filter(g=>g.mode===m)];return `<div class="sec"><h2>굿즈 제안</h2></div><div class="grid g3">${L.map(g=>`<div class="card gd"><h3>${esc(g.n)}</h3><p>${esc(g.w)}</p><dl><dt>구성</dt><dd>${esc(g.set)}</dd><dt>자리</dt><dd>${esc(g.at)}</dd><dt>시작</dt><dd>${esc(g.first)}</dd></dl></div>`).join('')}</div>${AI?`<div class="btns"><button class="btn" data-a="gdMore" ${S.ui.busy?'disabled':''}>${S.ui.busy==='goods'?'생각하는 중…':'다른 제안 받기'}</button></div>`:''}`}
(()=>{const f=V.store.trend,g=()=>f()+goodsCard();V.store.trend=g;V.aka.trend=g})();

/* ── 다른 공간 읽기: 잘하는 것 · 약한 것 · 더숲은 언제 따르고 언제 달리할지 ── */
const SPACES=[
 {n:'던트 북스 (런던)',good:'책을 분야가 아니라 나라별로 놓습니다. 소설을 찾다가 옆의 역사·요리책을 집게 됩니다.',weak:'찾는 책이 분명한 손님에게는 돌아가는 길입니다.',keep:'기본 서가는 분야별 그대로.',diff:'여행·번역 문학처럼 「장소」가 주제인 평대 한 곳에서만.',u:'https://qz.com/1651414/barnes-nobles-new-ceo-wants-the-chain-to-be-more-like-an-indie'},
 {n:'워터스톤스 (영국)',good:'본사 일괄 매입과 출판사 광고 진열을 줄이고, 지점이 팔 책을 직접 고르게 했습니다. 반품이 줄었습니다.',weak:'지점마다 달라 물류와 교육이 복잡해집니다.',keep:'북센 주문과 재고 기준은 공통으로.',diff:'평대 주제와 수량은 지점이 정합니다. 워크룸의 지점별 「들여놓을 책」이 이 역할.',u:'https://www.newstatesman.com/spotlight/2017/07/how-new-attitude-work-saved-britain-s-bookshops'},
 {n:'분키츠 (도쿄)',good:'입장료를 받고 한 종에 한 권만 둡니다. 머무는 시간이 길고 책도 삽니다.',weak:'입장료가 문턱입니다. 지나가다 들르는 손님을 잃습니다.',keep:'서점은 무료 입장 그대로.',diff:'아카데미 「사유의 숲」처럼 이미 머무는 공간에서는 시간제 이용과 한 권씩 진열을 시험할 만합니다.',u:'https://www.mt.co.kr/culture/2019/06/16/2019061518293179177'},
 {n:'모리오카 서점 (도쿄)',good:'한 주에 책 한 권만 팔고, 방 전체를 그 책의 전시로 씁니다. 저자가 와 있습니다.',weak:'고를 것이 없습니다. 매출이 그 한 권에 달려 있습니다.',keep:'매장 전체를 한 권으로 채우지는 않습니다.',diff:'북토크가 있는 주에 평대 하나를 「이 주의 한 권」으로.',u:'https://weekly.khan.co.kr/article/202007171553121'},
 {n:'츠타야 (일본)',good:'책 옆에 그 책의 생활을 놓습니다. 분야 담당이 직접 제안합니다.',weak:'겉모습만 따라 한 곳은 오래가지 못했다는 평이 있습니다. 책이 소품이 되기 쉽습니다.',keep:'책이 먼저, 물건은 곁에.',diff:'주제가 분명한 평대에만 구하기 쉬운 오브제 두세 가지. 큐레이션의 「오브제와 함께」가 이 방식.',u:'https://letter.wepick.kr/post/3716'},
 {n:'별마당 도서관 · 아크앤북 (서울)',good:'압도적인 서가와 책 터널. 사람을 불러 모읍니다.',weak:'사진만 찍고 가는 손님이 많다는 지적이 처음부터 있었습니다.',keep:'사진 찍힐 자리 하나는 필요합니다.',diff:'그 자리 바로 옆에 살 수 있는 책과 가격을 둡니다. 보는 서가와 사는 평대를 떼어 놓지 않습니다.',u:'https://www.mt.co.kr/culture/2019/06/11/2019061014283497147'}];
function spaceCard(){return `<div class="sec"><h2>다른 공간 읽기</h2></div>
 <div class="card rule"><b>달리하는 것은 목적이 아닙니다.</b><ol><li>손님이 책을 찾는 데 방해가 되면 하지 않습니다. 기본 서가는 그대로 둡니다.</li><li>평대 하나, 2주 단위로 되돌릴 수 있을 때만 시험합니다.</li><li>시작 전에 볼 숫자를 정합니다. 그 평대의 판매 권수와, 없던 문의가 생겼는지.</li></ol></div>
 <div class="grid g2">${SPACES.map(s=>`<div class="card gd"><h3>${s.n}</h3><dl><dt>강점</dt><dd>${s.good}</dd><dt>약점</dt><dd>${s.weak}</dd><dt>그대로</dt><dd>${s.keep}</dd><dt>달리</dt><dd>${s.diff}</dd></dl><a class="lnk" href="${s.u}" target="_blank" rel="noopener">출처</a></div>`).join('')}</div>`}
(()=>{const f=V.store.trend,g=()=>f()+spaceCard();V.store.trend=g;V.aka.trend=g})();

/* ── 주문: 책 사진 → 제목·ISBN 목록 → 주문에 담기 ── */
const isbnOk=s=>{s=String(s||'').replace(/[^0-9]/g,'');if(!/^97[89]\d{10}$/.test(s))return '';let n=0;for(let i=0;i<12;i++)n+=+s[i]*(i%2?3:1);return (10-n%10)%10===+s[12]?s:''};
C.oPhoto=async el=>{const f=[...el.files].slice(0,4),br=S.br;if(!f.length||br==='all')return;
  const out=await ask('ophoto','사진 속 책을 모두 읽어 주세요. 서점에서 도매상에 주문할 책입니다. 책등·표지·뒷면 바코드 어느 쪽이든 보이는 대로 읽습니다.\n책마다 제목, 저자, 출판사, 같은 책 권수(겹쳐 보이면 세어서, 아니면 1)를 적습니다. ISBN 은 사진에 숫자가 실제로 보일 때만 13자리로 적고, 보이지 않으면 빈 문자열로 둡니다. 기억으로 채우지 마세요. 읽히지 않는 책은 넣지 않습니다.\nJSON 배열로만: [{"title":"","author":"","publisher":"","isbn":"","qty":1}]',{images:f});el.value='';
  if(!Array.isArray(out)||!out.length){if(out)toast('사진에서 읽은 책이 없습니다. 글자가 보이게 다시 찍어 주세요.');return}
  let P=[];try{P=pool(br)}catch(e){}const BK=window.BOOKS||{},cat=[...P,...(BK.yes24||[]),...(BK.aladin||[]),...(BK.kyobo||[])];
  S.ui.oPh=(S.ui.oPh||[]).concat(out.filter(x=>x&&x.title).map(x=>{const seen=isbnOk(x.isbn),h=cat.find(b=>seen&&b.isbn===seen)||cat.find(b=>nt(b.t)===nt(x.title));
    return{t:h?h.t:x.title,a:(h&&h.a)||x.author||'',p:(h&&h.p)||x.publisher||'',isbn:seen||(h&&h.isbn)||'',price:(h&&h.price)||0,qty:Math.max(1,Math.min(99,+x.qty||1)),src:seen?'사진에서 읽음':h&&h.isbn?'목록에서 찾음':''}}));render()};
A.oPhDel=d=>{(S.ui.oPh||[]).splice(+d.i,1);render()};A.oPhClear=()=>{S.ui.oPh=null;render()};
A.oPhQty=d=>{const x=(S.ui.oPh||[])[+d.i];if(x){x.qty=Math.max(1,Math.min(99,x.qty+(+d.n)));render()}};
A.oPhAdd=()=>{const L=S.ui.oPh||[];let n=0;L.forEach(b=>{if(addCart(S.br,{t:b.t,a:b.a,p:b.p,isbn:b.isbn,price:b.price},b.qty,'사진으로 담음'))n++});if(n){S.ui.oPh=null;toast(`${n}종을 주문에 담았습니다`);render()}};
function oPhCard(){if(!AI||S.br==='all')return '';const L=S.ui.oPh,no=L?L.filter(b=>!b.isbn).length:0;
  return `<div class="card oph"><div class="qbar" style="margin:0"><label class="btn ${L?'':'pri'}">${S.ui.busy==='ophoto'?'사진 읽는 중…':L?'사진 더 읽기':'책 사진으로 담기'}<input type="file" accept="image/*" multiple data-c="oPhoto" hidden ${S.ui.busy?'disabled':''}></label><span class="note">책등이나 뒷면 바코드를 찍으면 제목과 ISBN 을 읽어 목록으로 만듭니다. 한 번에 4장까지.</span></div>
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
  const bar=document.createElement('div');bar.className='dpx';bar.innerHTML=`<div class="qbar" style="margin:6px 0 10px">${AI?`<label class="btn">${S.ui.busy==='dpsp'?'자리 읽는 중…':'이 자리 사진으로 맞추기'}<input type="file" accept="image/*" data-c="dpPhoto" hidden></label>`:''}${fx===0?`<button class="chip" data-a="dp3" aria-pressed="${!!S.ui.dp3}">3D로 보기</button>`:''}${S.ui.dpCap?`<button class="lnk" data-a="dpFree">사진 맞춤 풀기</button>`:''}</div>
   ${R?`<div class="dprd"><b>${esc(R.fixture||'')} · 약 ${R.w||'?'}×${R.d||'?'}cm${R.tiers>1?` · ${R.tiers}단`:''} · ${R.titles||'?'}종 ${R.copies||'?'}권쯤</b><small>사진으로 어림한 값입니다. 줄자로 한 번 확인해 주세요.</small>${R.now?`<p>${esc(R.now)}</p>`:''}${(R.issues||[]).length?`<ul>${R.issues.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${R.why?`<p><b>제안</b> ${esc(R.why)}</p>`:''}</div>`:''}`;
  st.parentNode.insertBefore(bar,st);if(S.ui.dp3&&fx===0&&t){st.innerHTML=dp3d(dpPlan(t,S.ui.dpM||0));window.d3Apply()}}})();
A.dp3=()=>{S.ui.dp3=!S.ui.dp3;A.dpOpen({i:S.ui.dp.i})};A.dpFree=()=>{S.ui.dpCap=0;S.ui.dpRd=null;S.ui.dpSz=null;A.dpOpen({i:S.ui.dp.i})};
C.dpPhoto=async el=>{const f=[...el.files].slice(0,2);if(!f.length)return;const lb=el.parentNode;if(lb&&lb.firstChild)lb.firstChild.textContent='자리 읽는 중…';
  const out=await ask('dpsp','서점의 진열 자리 사진입니다. 평대(책을 눕혀 쌓는 탁자)인지 벽 서가(선반)인지 보고, 크기와 놓을 수 있는 양을 어림합니다. 사진 속 책(보통 가로 15cm, 세로 21cm)을 자 삼아 재세요. 보이지 않는 것은 지어내지 않습니다. 말투는 담백하게.\nJSON 으로만: {"fixture":"평대|벽 서가","w":가로cm,"d":깊이cm(벽 서가는 선반 깊이),"tiers":단 수(평대는 1),"titles":표지가 서로 가리지 않게 놓을 수 있는 종 수,"copies":그때 전체 권수,"now":"지금 놓인 상태 한 문장","issues":["고칠 점, 3개 이하"],"mood":"무심하게|사랑스럽게|돋보이게","why":"그 방식이 이 자리에 맞는 까닭 한 문장"}',{images:f});
  if(out&&out.fixture){S.ui.dpRd=out;S.ui.dpF=/서가|선반/.test(out.fixture)?1:0;S.ui.dpCap=Math.max(2,Math.min(8,+out.titles||6));const m=DMOOD.indexOf(out.mood);if(m>=0)S.ui.dpM=m;S.ui.dpSz=out.w&&out.d?{w:out.w,d:out.d}:null}else if(out)toast('자리를 읽지 못했습니다. 평대나 서가 전체가 보이게 찍어 주세요.');
  if(S.ui.dp)A.dpOpen({i:S.ui.dp.i})};

/* ── 아이디어 한 줄 → 바로 디자인 ── */
const IDS=[[/눈|겨울|첫눈/,'snow'],[/비\s|비가|장마|우산/,'rain'],[/밤|달|잠|새벽/,'moon'],[/커피|차 한|카페|찻/,'cup'],[/숲|나무|식물|산|풀/,'leaf'],[/집|방|동네/,'house'],[/필사|쓰기|글|편지|문장|메모/,'pencil'],[/별|선물|연말|크리스마스/,'star'],[/바다|물|파도|여름휴가/,'wave'],[/촛|위로|쉼|고요/,'candle'],[/햇|여름|아침|봄/,'sun'],[/걷|산책|여행|길/,'walk'],[/책|읽/,'book']];
function ideaLocal(v){const k=/띠지/.test(v)?'band':/쇼카드/.test(v)?'card':'pop',w=v.replace(/(POP|pop|팝|띠지|쇼카드|안내문)(으로|로)?|만들어\s*줘?|만들기|해\s*줘/g,' ').replace(/\s+/g,' ').trim()||v,aka=S.mode==='aka',br=aka?'aka':curBr(),sym=(IDS.find(([r])=>r.test(w+' '))||[0,'none'])[1];
  const cut=w.length>16?(()=>{const i=w.slice(0,18).search(/[,.—]|\s(?=\S*$)/);return i>5?i+1:Math.min(w.length,14)})():w.length,head=w.slice(0,cut).replace(/[,.\s]+$/,''),rest=w.slice(cut).trim();
  const dark=/밤|달|겨울|고요|죽|끝|어둠/.test(w),D=Object.assign(defD(),{kind:k,br,tag:aka?'아카데미하우스':TAGN(br),sym,head,body:rest,st:dark?1:0,pal:dark?2:/숲|나무|식물|산/.test(w)?1:/따뜻|커피|가을|편지/.test(w)?3:0});
  ideaPolish(D,w);if(k==='band'){D.phrases=D.head.replace(/\n/g,' ');if(sym!=='none')D.syms=[sym]}return D}
A.ideaGo=async d=>{const el=$('ideaIn')||$('qIn'),v=((d&&d.v)||(el&&el.value)||'').trim();if(!v){toast('아이디어를 한 줄 적어 주세요');return}
  const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));const D0=ideaLocal(v);S.ui.D=D0;S.ui.idea=v;S.view[S.mode]='design';window.scrollTo(0,0);render();if(!AI)return;
  const snap=JSON.stringify(D0),out=await ask('idea',`서점·문화공간 "더숲"의 ${S.mode==='aka'?'아카데미하우스(북한산 자락 복합 문화 공간)':'서점'} 인쇄물을 만듭니다. 직원이 적은 아이디어 한 줄을 바로 붙일 수 있는 문안으로 다듬어 주세요.\n아이디어: "${v.replace(/"/g,"'")}"\n말투: 조용하고 담백하게. 느낌표·이모지·과장 금지. 없는 사실(날짜, 가격, 수상)은 지어내지 않습니다. 뻔한 표현 대신 한 번 비튼 낱말 하나.\nhead 는 14자 안쪽 제목(뜻 단위로 \\n 한 번 가능), body 는 45자 안쪽 한두 문장, band 는 띠지용 18자 안쪽 한 줄, sym 은 ${Object.keys(ICON).filter(x=>!x.startsWith('ph')).join('|')}|none, look 은 0(밝고 조용하게)|1(짙은 바탕)|2(세로 제목) 중 하나.\nJSON 으로만: {"head":"","body":"","band":"","sym":"","look":0}`,{modelTier:'quick'});
  if(!out||!out.head||JSON.stringify(S.ui.D)!==snap)return;const D=S.ui.D;D.head=out.head;D.body=out.body||D.body;if(ICON[out.sym])D.sym=out.sym;if([0,1,2].includes(+out.look))D.st=+out.look;if(D.kind==='band'){D.phrases=out.band||out.head.replace(/\n/g,' ');D.syms=D.sym!=='none'?[D.sym]:[]}render()};
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='ideaIn'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.ideaGo({})}});
(()=>{const f=V.store.design,g=()=>`<div class="card qadd"><div class="qrow"><input type="text" id="ideaIn" autocomplete="off" enterkeyhint="go" value="${esc(S.ui.idea||'')}" placeholder="생각 한 줄 — 비 오는 날 혼자 읽기 좋은 얇은 책 / 오늘은 6시에 닫습니다">${micBtn('ideaIn')}<button class="btn pri" data-a="ideaGo">${S.ui.busy==='idea'?'다듬는 중…':'만들기'}</button></div></div>`+f();V.store.design=g;V.aka.design=g})();
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
  const bar=`<div class="card qadd"><div class="qrow"><input type="text" id="cIdea" autocomplete="off" enterkeyhint="go" placeholder="떠오른 생각 한 줄 — 비 오는 날엔 얇은 책">${micBtn('cIdea')}<button class="btn pri" data-a="ideaGo">${S.ui.busy==='idea'?'고르는 중…':'완성하기'}</button></div><small class="note">주제 · 책 · POP · 띠지 · 진열 · 오브제까지 한 벌로. 「오늘은 6시에 닫습니다」처럼 적으면 안내문이 됩니다${has&&S.ui.cTone==='내 생각'?` <button class="lnk" data-a="myClear">내 생각 모두 지우기</button>`:''}</small></div>`;
  const i=h.indexOf('<div class="subnav"');return i>0?h.slice(0,i)+bar+h.slice(i):bar+h}})();
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='cIdea'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.ideaGo({v:e.target.value})}});

A.myClear=()=>{S.ui.myT=[];ls.set('myT',[]);S.ui.cTone='전체';render()};

/* ── 말로 넣기 · 안내문도 생각 한 줄로 (아카 · 서점 모두) ── */
if(!KSHOW.store.includes('sign'))KSHOW.store.push('sign');
A.micTo=d=>{S.ui.micT=d.id;A.dMic()};
const micBtn=id=>(DICT||window.SpeechRecognition||window.webkitSpeechRecognition)?`<button class="btn" data-a="micTo" data-id="${id}" aria-pressed="${!!S.ui.mic}">${S.ui.mic?'듣는 중':'말하기'}</button>`:'';
const NOTR=/안내문|안내판|공지|알림|휴무|쉽니다|쉬어요|닫습니다|닫아요|엽니다|영업|금연|조용|정숙|출입|화장실|주차|마감|품절|매진|공사|점검|반납|금지|삼가|부탁|주세요|마세요|됩니다|입니다|합니다|있습니다|없습니다/;
function noticeLocal(v){const w=v.replace(/(안내문|안내판|공지|알림)(으로|로|을|를)?\s*(만들어\s*줘?|써\s*줘?|작성)?/g,' ').replace(/\s+/g,' ').trim()||v,aka=S.mode==='aka',br=aka?'aka':curBr(),ps=w.split(/(?<=[.!?])\s+|,\s+/),head=(ps[0]||w).replace(/[.!]+$/,''),body=ps.slice(1).join(' ');
  const sym=/금연|담배/.test(w)?'drop':/조용|정숙/.test(w)?'leaf':/우산|비가|비 오|장마/.test(w)?'rain':/화장실|이쪽|방향|층/.test(w)?'walk':/행사|촬영|모임/.test(w)?'candle':/휴무|닫|쉽|마감/.test(w)?'moon':/출입|관계자/.test(w)?'house':'none';
  return Object.assign(defD(),SIGN.notice.d,{kind:'sign',sg:'notice',cv:0,br,tag:aka?'아카데미하우스':TAGN(br),head,body,list:'',sym})}
(()=>{const f=A.ideaGo;A.ideaGo=async d=>{const el=$('ideaIn')||$('cIdea')||$('qIn'),v=((d&&d.v)||(el&&el.value)||'').trim();if(!v||!NOTR.test(v)||/(POP|pop|팝|띠지|쇼카드)/.test(v))return f(d);
  const H=S.ui.dH=S.ui.dH||[];if(S.ui.D)H.push(JSON.stringify(S.ui.D));const D0=noticeLocal(v);S.ui.D=D0;S.ui.idea=v;S.view[S.mode]='design';window.scrollTo(0,0);render();if(!AI)return;
  const snap=JSON.stringify(D0),out=await ask('idea',`"더숲" ${S.mode==='aka'?'아카데미하우스(복합 문화 공간)':'서점'}에 붙일 안내문입니다. 직원이 말한 내용을 손님이 한눈에 읽는 안내문으로 다듬어 주세요.\n내용: "${v.replace(/"/g,"'")}"\n정중하지만 짧게. 명령조·느낌표·이모지 금지. 말한 내용에 없는 날짜·시간·장소는 지어내지 않습니다.\nhead 는 16자 안쪽 한 줄(가장 중요한 말), body 는 40자 안쪽 덧붙임(없으면 빈 문자열), sym 은 ${Object.keys(ICON).filter(x=>!x.startsWith('ph')).join('|')}|none.\nJSON 으로만: {"head":"","body":"","sym":""}`,{modelTier:'quick'});
  if(!out||!out.head||JSON.stringify(S.ui.D)!==snap)return;S.ui.D.head=out.head;S.ui.D.body=out.body||'';if(ICON[out.sym])S.ui.D.sym=out.sym;render()}})();
(()=>{const f=A.qAdd;A.qAdd=()=>{const el=$('qIn'),v=el?el.value.trim():'';if(v&&!v.includes('\n')&&/(습니다|주세요|마세요|안내문|안내판|공지)/.test(v)){A.ideaGo({v});return}f()}})();

/* ── 공개 주소에서도 되는 책 고르기 · 다듬기 (Claude 없이, 낱말 사전으로) ── */
const TOPIC=[
 {k:/밤|새벽|잠|불면|달/,w:['밤','어두운','달','꿈','고독'],c:['문학'],h:'불을 하나만 켜고 읽는 책들.'},
 {k:/비 오|비가|장마|우울|흐린|눈물|슬픔|슬플/,w:['장마','슬픔','슬픈','눈물','울고'],c:['문학'],h:'젖은 날에는 젖은 문장이 잘 읽힙니다.'},
 {k:/위로|지친|지칠|힘들|쉬고|괜찮|다정/,w:['마음','어루만지','위로','오래 곁에','사랑'],c:['문학','인문'],h:'힘내라는 말 없이 곁에 있어 주는 책.'},
 {k:/미술|그림|전시|화가|갤러리/,w:['미술관','그림','캔버스','보기','예술','루킹'],c:['예술'],h:'보러 가기 전에 먼저 읽어 두는 눈.'},
 {k:/영화|극장|상영|감독/,w:['영화','영화관','키아로스타미'],c:['예술','문학'],h:'불이 켜진 뒤에도 남는 이야기.'},
 {k:/철학|생각|삶|인생|어떻게 살|고민/,w:['철학','니체','쇼펜하우어','세네카','인생','삶','존재','군주론'],c:['인문'],h:'답보다 질문이 오래 남는 책.'},
 {k:/사랑|연애|이별|헤어/,w:['사랑','연애','에로스','헤어졌다','너를'],c:['문학'],h:'사랑을 설명하지 않고 보여 주는 책.'},
 {k:/혼자|고독|외로|조용|은둔/,w:['혼자','고독','은둔','실격','이방인'],c:['문학'],h:'혼자인 시간이 모자란 사람에게.'},
 {k:/걷|산책|달리|운동|몸/,w:['걷기','달리기','기행','거리'],c:['문학'],h:'읽고 나면 신발끈을 묶게 됩니다.'},
 {k:/숲|나무|새|꽃|식물|자연|계절|산/,w:['나무','새','숲','꽃','섬','생명','계절','녹색'],c:['자연과학','문학'],h:'사람이 주인공이 아닌 이야기.'},
 {k:/과학|우주|별|기계|AI|인공지능|미래/,w:['우주','궤도','헤일메리','기계','AI','항구'],c:['자연과학','문학','인문'],h:'멀리 보면 가까운 것이 달라 보입니다.'},
 {k:/말|언어|단어|글쓰|쓰기|필사|문장|낱말/,w:['어휘력','낱말','언어','말','쓰다','필사','적었다'],c:['문학','인문'],h:'낱말 하나를 오래 들여다보는 사람들.'},
 {k:/죽음|끝|이별|상실|애도|떠나/,w:['죽음','해방일지','소년이','떠난','증명','주마등'],c:['문학'],h:'끝을 다룬 책은 대개 삶에 관한 책입니다.'},
 {k:/겨울|눈 오|눈이|첫눈|추운|연말/,w:['눈 내리는','겨울','긴긴밤','계절','밤'],c:['문학'],h:'해가 짧은 달에 어울리는 긴 이야기.'},
 {k:/선물|작은 책|가벼운|들고 다니/,w:['미니북','키링','에디션','리커버','한정판'],c:['문학'],h:'주머니에 들어가는 책, 건네기 좋은 책.'},
 {k:/고전|오래된|다시 읽/,w:['데미안','이방인','싯다르타','오만과','이성과','동물농장','인간 실격','참을 수 없는'],c:['문학'],h:'제목은 아는데 끝까지 읽은 적은 없는 책.'},
 {k:/시집|시 한|시를|시인/,w:['시','노래','꽃','응답'],c:['문학'],h:'한 쪽이면 충분한 날을 위해.'},
 {k:/먹|술|밥|커피|음식|요리/,w:['국수','위스키','라면','빵','먹었다','밥'],c:['문학','취미'],h:'요리책 말고, 먹는 일을 생각하는 책.'},
 {k:/짧은|얇은|금방|한 시간|출퇴근/,w:['짧은','사소한','미니','쇼츠','1분'],c:['문학'],h:'한 번 앉은 자리에서 끝나는 책.'},
 {k:/일|직장|노동|회사|퇴근/,w:['노동자','노동','일하는'],c:['인문','문학'],h:'명함에 적히지 않는 일에 관하여.'}];
function topicsOf(s){return TOPIC.filter(x=>x.k.test(s+' '))}
function ideaPolish(D,w){const T=topicsOf(w)[0],full=w.replace(/\s+/g,' ').trim(),st=full.replace(/[\s,]*(에|때|에는|엔)?\s*(읽는|읽을|읽기 좋은|읽으면 좋은|어울리는|보는|좋은|위한|권하는)?\s*(얇은|짧은|작은|조용한)?\s*책들?\.?$/,'').trim();
  if(st.length>=4&&st.length<=22&&st!==full){D.head=st;D.body=T?T.h:''}else if(full.length<=20){D.head=full;D.body=T?T.h:''}else if(!D.body&&T)D.body=T.h;
  D.head=D.head.replace(/^(그냥|뭔가|약간|음+|어+)\s+/,'');return D}
(()=>{const f=noticeLocal;noticeLocal=function(v){const D=f(v),po=s=>s.replace(/닫아요|닫음/g,'닫습니다').replace(/쉬어요|쉼(?=$|[.\s])/g,'쉽니다').replace(/열어요|엶/g,'엽니다').replace(/해요(?=$|[.\s])/g,'합니다').replace(/돼요|되요/g,'됩니다').replace(/있어요/g,'있습니다').replace(/없어요/g,'없습니다').replace(/이에요|예요/g,'입니다').replace(/하지\s*마(세요)?(?=$|[.\s])/g,'삼가 주세요').replace(/금지(?=$|[.\s])/g,'삼가 주세요').trim();D.head=po(D.head);D.body=po(D.body);return D}})();
