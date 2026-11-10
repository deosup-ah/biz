'use strict';
/* 아카데미: 오늘 · 일정(북토크·영화·프로그램) · 행사 기획 · 인스타 · 네이버 */
const EK=['북토크','영화','프로그램','기타'];
const evUp=()=>S.db.events.filter(e=>(e.date||'')>=TODAY).sort((a,b)=>(a.date+(a.time||''))<(b.date+(b.time||''))?-1:1);
const evRow=e=>{const d=pd(e.date),r=e.cap?Math.round((e.booked||0)/e.cap*100):null;return `<div class="li"><span class="pill ${dayDiff(e.date,TODAY)<=3?'p-low':'p-mute'}">${dday(e.date)}</span><div class="t"><b>${esc(e.title)}</b><small>${mdw(e.date)} ${esc(e.time||'')} · ${esc(e.kind||'')}${e.place?' · '+esc(e.place):''}${e.cap?` · ${e.booked||0}/${e.cap}명${r!=null?' ('+r+'%)':''}`:''}</small>${e.memo?`<small>${esc(e.memo)}</small>`:''}</div><button class="btn sm" data-a="evEdit" data-id="${e.id}">고치기</button></div>`};
V.aka.today=()=>{const up=evUp(),wk=up.filter(e=>dayDiff(e.date,TODAY)<=14),low=up.filter(e=>e.cap&&dayDiff(e.date,TODAY)<=10&&(e.booked||0)/e.cap<.3),I=S.db.insta.slice().sort((a,b)=>a.id<b.id?1:-1)[0];
  return `<div class="sec"><h2>${mdw(TODAY)} 더숲아카데미</h2><p>북토크 · 영화 · 프로그램과 알리기</p></div>
  <div class="grid g4"><div class="card kpi"><span>앞으로 2주 행사</span><b class="num">${wk.length}건</b><small>전체 예정 ${up.length}건</small></div>
   <div class="card kpi"><span>2주 예약 인원</span><b class="num">${wk.reduce((a,e)=>a+(e.booked||0),0)}명</b><small>정원 합 ${wk.reduce((a,e)=>a+(e.cap||0),0)}명</small></div>
   <div class="card kpi"><span>예약이 더딘 행사</span><b class="num ${low.length?'down':''}">${low.length}건</b><small>10일 안 · 예약률 30% 아래</small></div>
   <div class="card kpi"><span>인스타 팔로워</span><b class="num">${I?won(I.followers):'—'}</b><small>${I?I.id+' 기록':'기록 없음'}</small></div></div>
  <div class="grid g2"><div class="card"><h3>다가오는 행사 <button class="btn sm ghost" style="margin-left:auto" data-a="go" data-v="cal">모두 보기 ›</button></h3>${wk.length?`<div class="list">${wk.slice(0,7).map(evRow).join('')}</div>`:'<div class="empty">2주 안에 잡힌 행사가 없습니다.</div>'}</div>
   <div class="card"><h3>지금 할 일</h3><div class="grid" style="gap:8px">${low.map(e=>`<div class="al"><b>${esc(e.title)}</b> ${mdw(e.date)} · ${e.booked||0}/${e.cap}명. <button class="btn sm" data-a="igFrom" data-id="${e.id}">인스타 초안 쓰기</button></div>`).join('')||'<p class="note">예약이 더딘 행사가 없습니다.</p>'}
     <div class="btns"><button class="btn pri" data-a="go" data-v="plan">새 행사 기획하기</button><button class="btn" data-a="evNew">일정 넣기</button><button class="btn" data-a="go" data-v="insta">게시물 초안 쓰기</button></div>
     <p class="note">단체 예약 · 대관 · 객실 매출은 <a href="https://claude.ai/artifact/3dtU9hamwcaPMCPMcVram1" target="_blank" rel="noopener">더숲아카.이븐</a> 앱에서 봅니다.</p></div></div></div>`};

/* 일정 */
V.aka.cal=()=>{const k=S.ui.ek||'전체',L=evUp().filter(e=>k==='전체'||(e.kind||'기타')===k),past=S.db.events.filter(e=>(e.date||'')<TODAY).length;
  return `<div class="sec"><h2>일정</h2><p>북토크 · 영화 · 프로그램</p><button class="btn pri" style="margin-left:auto" data-a="evNew">+ 일정 넣기</button></div>
  <div class="chips">${['전체',...EK].map(x=>`<button class="chip" data-a="ui" data-k="ek" data-v="${x}" aria-pressed="${k===x}">${x}</button>`).join('')}</div>
  <div class="card">${L.length?`<div class="list">${L.map(evRow).join('')}</div>`:`<div class="empty">다가오는 ${k==='전체'?'':k+' '}일정이 없습니다.</div>`}</div>
  <p class="note">지난 일정 ${past}건은 숨겼습니다. 영화 예약 인원은 <a href="https://claude.ai/artifact/1TB8beg3dWzqrZoNfJYPBJ" target="_blank" rel="noopener">진진 영화 예약 현황</a>에서 옮겨 적은 것입니다.</p>`};
function evForm(e){const f=e||{kind:'북토크',date:TODAY};openSheet(`<h3>일정 ${f.id?'고치기':'넣기'}</h3><form class="form" id="ef"><input type="hidden" id="efId" value="${esc(f.id||'')}">
  <div class="f2"><div class="fld"><label for="efK">종류</label><select id="efK">${EK.map(k=>`<option ${f.kind===k?'selected':''}>${k}</option>`).join('')}</select></div><div class="fld"><label for="efT">제목</label><input type="text" id="efT" value="${esc(f.title||'')}" placeholder="예: 저자와의 만남"></div></div>
  <div class="f2"><div class="fld"><label for="efD">날짜</label><input type="date" id="efD" value="${esc(f.date||'')}"></div><div class="fld"><label for="efH">시간</label><input type="time" id="efH" value="${esc(f.time||'')}"></div></div>
  <div class="f2"><div class="fld"><label for="efP">장소</label><input type="text" id="efP" value="${esc(f.place||'')}" placeholder="예: 대화의 집"></div><div class="f2"><div class="fld"><label for="efB">예약</label><input type="number" id="efB" min="0" value="${f.booked??''}"></div><div class="fld"><label for="efC">정원</label><input type="number" id="efC" min="0" value="${f.cap??''}"></div></div></div>
  <div class="fld"><label for="efM">메모</label><textarea id="efM" rows="2">${esc(f.memo||'')}</textarea></div>
  <div class="btns"><button type="button" class="btn pri" data-a="evSave">저장</button><button type="button" class="btn" data-a="close">닫기</button>${f.id?`<button type="button" class="btn ghost" data-a="evDel" data-id="${f.id}">지우기</button>`:''}</div><p class="note">손님 이름 · 연락처는 적지 않습니다.</p></form>`)}
A.evNew=()=>evForm(S.ui.evPre||null);
A.evEdit=d=>evForm(S.db.events.find(e=>e.id===d.id));
A.evSave=()=>{const v=id=>$(id).value.trim(),t=v('efT'),date=v('efD');if(!t||!date){toast('제목과 날짜를 적어 주세요');return}const id=v('efId')||nid(),doc={kind:v('efK'),title:t,date,time:v('efH'),place:v('efP'),memo:v('efM'),at:new Date().toISOString()};if(v('efB')!=='')doc.booked=+v('efB');if(v('efC')!=='')doc.cap=+v('efC');S.ui.evPre=null;closeSheet();put('events',id,doc);toast('저장했습니다')};
A.evDel=d=>{closeSheet();del('events',d.id)};

/* 행사 기획 */
V.aka.plan=()=>{const U=S.ui,P=U.pl,ideas=S.db.ideas.slice().sort((a,b)=>(a.at||'')<(b.at||'')?1:-1);
  const view=(p,saved)=>`<div class="card theme"><h3>${esc(p.title)} <small>${esc(p.kind||'')}${saved?' · 저장됨':''}</small></h3><dl class="kv"><dt>한 줄 생각</dt><dd>${esc(p.concept)}</dd><dt>왜 지금</dt><dd>${esc(p.why)}</dd><dt>누구에게</dt><dd>${esc(p.target)}</dd><dt>언제 · 어디</dt><dd>${esc(p.when)}</dd></dl>
   <div class="grid g2" style="margin-top:12px"><div><b>당일 순서</b><div class="list">${(p.flow||[]).map(f=>`<div class="li"><span class="pill p-mute">${esc(f.time)}</span><div class="t">${esc(f.what)}</div></div>`).join('')}</div></div>
    <div><b>준비 일정</b><div class="list">${(p.prep||[]).map(f=>`<div class="li"><span class="pill p-info">${esc(f.when)}</span><div class="t">${esc(f.task)}</div></div>`).join('')}</div></div></div>
   ${(p.promo||[]).length?`<p style="margin:12px 0 0"><b>알리기</b></p><div class="list">${p.promo.map(f=>`<div class="li"><span class="pill p-mute">${esc(f.when)}</span><div class="t"><b>${esc(f.channel)}</b><small>${esc(f.what)}</small></div></div>`).join('')}</div>`:''}
   ${(p.books||[]).length?`<p style="margin:12px 0 4px"><b>함께 놓을 책</b> <span class="note">확인 뒤 주문하세요</span></p><div class="chips">${p.books.map(b=>`<span class="pill p-mute" data-tip="${esc(b.why||'')}">${esc(b.t)} · ${esc(b.a||'')}</span>`).join('')}</div>`:''}
   ${(p.risks||[]).length?`<p class="note" style="margin-top:10px">미리 살필 것: ${p.risks.map(esc).join(' · ')}</p>`:''}
   <div class="btns" style="margin-top:12px"><button class="btn pri" data-a="plToCal" data-s="${saved||''}">일정에 넣기</button><button class="btn" data-a="plToIg" data-s="${saved||''}">인스타 초안</button><button class="btn" data-a="plToPop" data-s="${saved||''}">안내 POP</button>${saved?`<button class="btn ghost" data-a="plDel" data-id="${saved}">지우기</button>`:`<button class="btn" data-a="plSave">저장</button>`}</div></div>`;
  return `<div class="sec"><h2>행사 기획</h2><p>몇 가지만 적으면 순서 · 준비 · 알리기까지 초안을 짭니다</p></div>
  <div class="card form"><div class="fld"><label>종류</label><div class="chips">${EK.map(k=>`<button class="chip" data-a="ui" data-k="plK" data-v="${k}" aria-pressed="${(U.plK||'북토크')===k}">${k}</button>`).join('')}</div></div>
   <div class="fld"><label for="plT">무엇을 하고 싶은가요</label><textarea id="plT" rows="2" data-c="uiv" data-k="plT" placeholder="예: 겨울 숲을 주제로 한 낭독 모임 / 『가호』 함께 읽기 / 12월 가족 영화">${esc(U.plT||'')}</textarea></div>
   <div class="f2"><div class="fld"><label for="plG">목적</label><input type="text" id="plG" data-c="uiv" data-k="plG" value="${esc(U.plG||'')}" placeholder="예: 평일 저녁 손님 늘리기, 숙박 손님 즐길 거리"></div><div class="fld"><label for="plW">누구에게 · 몇 명</label><input type="text" id="plW" data-c="uiv" data-k="plW" value="${esc(U.plW||'')}" placeholder="예: 동네 주민 20명"></div></div>
   <div class="f2"><div class="fld"><label for="plD">언제쯤</label><input type="text" id="plD" data-c="uiv" data-k="plD" value="${esc(U.plD||'')}" placeholder="예: 12월 둘째 주 토요일 저녁"></div><div class="fld"><label for="plB">예산 · 조건</label><input type="text" id="plB" data-c="uiv" data-k="plB" value="${esc(U.plB||'')}" placeholder="예: 30만원 안, 진행은 직원 1명"></div></div>
   <div class="btns">${AI?busyBtn('plan','기획 초안 만들기','plGen'):`<button class="btn pri" data-a="plGen">기획 초안 만들기</button>`}</div></div>
  ${P?view(P,''):''}${ideas.length?`<div class="sec"><h2 style="font-size:18px">저장한 기획</h2></div>${ideas.map(p=>view(p,p.id)).join('')}`:''}`};
const getPl=d=>d.s?S.db.ideas.find(p=>p.id===d.s):S.ui.pl;
function planTpl(U){const k=U.plK||'북토크',film=k==='영화',t=(U.plT||'').trim();return{kind:k,title:t.length>24?t.slice(0,24):t,concept:t,why:`${hooks(1).season} — ${U.plG||'책과 공간을 잇는 자리'}`,target:U.plW||'정하기',when:U.plD||'날짜 정하기',date:'',time:film?'19:00':'19:30',place:'',cap:0,
  flow:film?[{time:'18:30',what:'자리 안내 · 음료'},{time:'19:00',what:'작품 소개 3분'},{time:'19:05',what:'상영'},{time:'끝난 뒤',what:'10분 이야기 나눔 · 연계 도서 매대 안내'}]:[{time:'19:00',what:'자리 안내 · 책 매대 열기'},{time:'19:30',what:'여는 말 · 소개'},{time:'19:40',what:k==='북토크'?'이야기 50분':'본 프로그램 60분'},{time:'20:30',what:'묻고 답하기 20분'},{time:'20:50',what:k==='북토크'?'사인 · 책 판매':'마무리 · 사진'}],
  prep:[{when:'D-28',task:'날짜 · 장소 · 정원 정하기, 진행자(저자) 섭외 확인'},{when:'D-21',task:'네이버 예약 열기, 일정에 넣기'},{when:'D-14',task:'연계 도서 주문 (북센) · POP · 띠지 만들기'},{when:'D-7',task:'매대 깔기, 예약 인원 확인, 준비물 점검 (마이크 · 의자 · 프로젝터)'},{when:'D-1',task:'예약자 안내, 자리 배치'},{when:'D+1',task:'사진 정리 · 후기 올리기 · 판매 권수 기록'}],
  promo:[{when:'D-21',channel:'인스타그램',what:'일정 공개 게시물'},{when:'D-14',channel:'매장 POP',what:'계산대 · 입구에 안내 POP'},{when:'D-7',channel:'인스타그램',what:'남은 자리 알림'},{when:'D-3',channel:'숙박 손님 안내',what:'객실 · 프런트 안내문'}],books:[],risks:['진행자 일정 확정','예약이 30% 아래면 D-7 에 한 번 더 알리기','다른 행사와 날짜 겹침']}}
A.plGen=async()=>{const U=S.ui;if(!(U.plT||'').trim()){toast('무엇을 하고 싶은지 한 줄 적어 주세요');return}if(!AI){S.ui.pl=planTpl(U);render();return}const hk=hooks(90);
  const out=await ask('plan',`서울 강북구 북한산 자락의 복합 문화 공간 "더숲 아카데미하우스"(서점 · 북스테이 · 카페 · 다이닝 · 강연장/상영 공간)에서 열 행사를 기획해 주세요. 행사 경험이 적은 직원이 그대로 따라 할 수 있게 구체적으로.\n종류: ${U.plK||'북토크'}\n하고 싶은 것: ${U.plT}\n목적: ${U.plG||'정해지지 않음'}\n대상 · 인원: ${U.plW||'정해지지 않음'}\n시기: ${U.plD||'정해지지 않음'}\n예산 · 조건: ${U.plB||'정해지지 않음'}\n오늘: ${TODAY} · 계절: ${hk.season}\n이미 잡힌 일정: ${evUp().slice(0,10).map(e=>`${e.date} ${e.kind} ${e.title}`).join(' / ')||'없음'}\n다가오는 때: ${hk.list.filter(h=>!h.ev).slice(0,8).map(h=>`${h.date} ${h.label}`).join(' / ')}\n\n규칙: 확인되지 않은 사실(저자 섭외 확정, 가격, 수상 이력)은 지어내지 말고 "확인 필요"로 적습니다. 이미 잡힌 일정과 날짜가 겹치지 않게 합니다. prep 의 when 은 "D-21"처럼, promo 는 채널(인스타그램 · 네이버 예약 · 매장 POP · 숙박 손님 안내)별로. books 는 실제 출간이 확실한 책만 3~5권. date 는 추천 날짜가 분명하면 YYYY-MM-DD, 아니면 빈 문자열.\nJSON 객체로만: {"title":"","concept":"","why":"왜 지금 이 행사인가","target":"","when":"날짜 · 시간 · 장소 제안","date":"","time":"HH:MM","place":"","cap":0,"flow":[{"time":"19:00","what":""}],"prep":[{"when":"D-21","task":""}],"promo":[{"when":"D-14","channel":"","what":""}],"books":[{"t":"","a":"","why":""}],"risks":[""]}`,{modelTier:'complex'});
  if(out&&out.title)S.ui.pl={...out,kind:U.plK||'북토크'};else if(out)S.ui.err={plan:'초안을 만들지 못했습니다. 다시 눌러 주세요.'}};
A.plSave=async()=>{await put('ideas',nid(),{...clone(S.ui.pl),at:new Date().toISOString()},true);S.ui.pl=null;toast('기획을 저장했습니다');render()};
A.plDel=d=>del('ideas',d.id);
A.plToCal=d=>{const p=getPl(d);evForm({kind:p.kind,title:p.title,date:/^\d{4}-\d\d-\d\d$/.test(p.date||'')?p.date:'',time:/^\d\d:\d\d$/.test(p.time||'')?p.time:'',place:p.place||'',cap:p.cap||undefined,memo:p.concept||''})};
A.plToIg=d=>{const p=getPl(d);S.ui.igK=p.kind==='영화'?'영화':'프로그램';S.ui.igT=`${p.title} — ${p.concept} (${p.when})`;S.view.aka='insta';window.scrollTo(0,0);render()};
A.plToPop=d=>{const p=getPl(d);S.ui.D=Object.assign(defD(),{kind:'pop',tag:p.kind,head:p.title,body:[p.concept,p.when].filter(Boolean).join('\n'),br:'aka'});S.view.aka='design';window.scrollTo(0,0);render()};

/* 인스타 */
const IGK=['책','영화','프로그램','공간 · 계절','다이닝 · 카페'];
V.aka.insta=()=>{const U=S.ui,L=S.db.insta.slice().sort((a,b)=>a.id<b.id?-1:1),last=L[L.length-1],prev=L[L.length-2],out=U.ig||[];
  const picks=[...evUp().slice(0,3).map(e=>`${e.kind} 「${e.title}」 ${mdw(e.date)}`),...((window.BOOKS||{}).yes24||[]).slice(0,3).map(b=>`『${b.t}』 입고`)];
  return `<div class="sec"><h2>인스타그램</h2><p>게시물 초안 쓰기와 운영 숫자 기록</p></div>
  <div class="grid g2" style="align-items:start"><div class="card form"><h3>게시물 초안</h3><div class="fld"><label>소재</label><div class="chips">${IGK.map(k=>`<button class="chip" data-a="ui" data-k="igK" data-v="${k}" aria-pressed="${(U.igK||'책')===k}">${k}</button>`).join('')}</div></div>
    <div class="fld"><label for="igT">무엇에 대해 쓸까요</label><textarea id="igT" rows="3" data-c="uiv" data-k="igT" placeholder="예: 11/14 숲속 영화관 「로봇 드림」, 자리 아직 넉넉함">${esc(U.igT||'')}</textarea><div class="chips">${picks.map(p=>`<button class="chip" data-a="igPick" data-t="${esc(p)}">${esc(p.length>20?p.slice(0,20)+'…':p)}</button>`).join('')}</div></div>
    <div class="btns">${AI?busyBtn('ig','초안 3개 만들기','igGen'):`<button class="btn pri" data-a="igGen">초안 3개 만들기</button>`}</div>
    ${out.map((o,i)=>`<div class="card" style="box-shadow:none"><span class="pill p-info">${esc(o.tone||'초안 '+(i+1))}</span><p style="white-space:pre-wrap;margin:8px 0">${esc(o.caption)}</p><p class="note" style="color:var(--info)">${esc(o.hashtags||'')}</p><div class="btns" style="margin-top:8px"><button class="btn sm" data-a="igCopy" data-i="${i}">복사</button></div></div>`).join('')}
    <p class="note">가격 · 날짜 같은 사실은 적어 준 것만 씁니다. 올리기 전에 확인하고, 올리는 것은 직접 합니다.</p></div>
   <div class="grid"><div class="card"><h3>운영 숫자 <small>주 1회 적어 두면 흐름이 보입니다</small></h3>
    ${last?`<div class="grid g3"><div class="kpi"><span>팔로워</span><b class="num">${won(last.followers)}</b><small>${prev?delta(last.followers,prev.followers):''}</small></div><div class="kpi"><span>도달(7일)</span><b class="num">${won(last.reach)}</b><small>${prev?delta(last.reach,prev.reach):''}</small></div><div class="kpi"><span>프로필 방문</span><b class="num">${won(last.visits)}</b><small>${prev?delta(last.visits,prev.visits):''}</small></div></div>
     ${L.length>1?lineChart([{n:'팔로워',c:'var(--s1)',v:L.slice(-10).map(x=>x.followers||0)}],L.slice(-10).map(x=>x.id.slice(5).replace('-','/'))):''}`:'<div class="empty">아직 기록이 없습니다. 인스타그램 앱의 「인사이트」 숫자를 아래에 적어 주세요.</div>'}
    <div class="grid g4" style="margin-top:12px"><div class="fld"><label for="isD">날짜</label><input type="date" id="isD" value="${TODAY}"></div><div class="fld"><label for="isF">팔로워</label><input type="number" id="isF" min="0"></div><div class="fld"><label for="isR">도달(7일)</label><input type="number" id="isR" min="0"></div><div class="fld"><label for="isV">프로필 방문</label><input type="number" id="isV" min="0"></div></div>
    <div class="btns" style="margin-top:10px"><button class="btn" data-a="isSave">기록하기</button></div>
    <p class="note" style="margin-top:8px">계정이 사무실 컴퓨터 브라우저에 로그인되어 있으면 매일 갱신 작업이 대신 읽어 적을 수 있습니다. 지금은 손으로 적습니다.</p></div></div></div>`};
A.igPick=d=>{S.ui.igT=d.t;render()};
A.igFrom=d=>{const e=S.db.events.find(x=>x.id===d.id);S.ui.igK=e.kind==='영화'?'영화':'프로그램';S.ui.igT=`${e.kind} 「${e.title}」 ${mdw(e.date)} ${e.time||''} ${e.place||''} — 자리 여유 있음`.trim();S.view.aka='insta';window.scrollTo(0,0);render()};
A.igGen=async()=>{const U=S.ui;if(!(U.igT||'').trim()){toast('무엇에 대해 쓸지 한 줄 적어 주세요');return}
  if(!AI){const t=U.igT.trim(),k=U.igK||'책',tag=`#더숲 #더숲아카데미하우스 #사유의숲 #북한산 #수유동 ${k==='영화'?'#숲속영화관 #영화상영':k==='책'?'#책추천 #동네서점 #북큐레이션':'#북토크 #북스테이'}`;S.ui.ig=[{tone:'담백하게',caption:`${t}\n\n숲 가까이에서, 천천히.`,hashtags:tag},{tone:'따뜻하게',caption:`${hooks(1).season}의 더숲에서 전합니다.\n${t}\n\n오시는 길이 조금 쌀쌀해도, 안은 따뜻합니다.`,hashtags:tag},{tone:'정보 위주로',caption:`[안내] ${t}\n\n· 곳: 더숲 아카데미하우스\n· 문의: 프로필 링크`,hashtags:tag}];render();return}
  const out=await ask('ig',`서울 강북구 수유동 북한산 자락 숲속에 있는 "더숲 아카데미하우스"(서점 · 북스테이 · 카페 · 다이닝 · 대관 공간)의 인스타그램 게시물 문구 초안을 3개 써 주세요.\n소재 종류: ${U.igK||'책'}\n내용: ${U.igT}\n오늘: ${TODAY}\n\n규칙: 세 개의 말투를 서로 다르게(담백하게 / 따뜻하게 / 정보 위주로). 각 120~220자. 과장하지 말고, 주어지지 않은 사실(가격, 날짜, 시간, 할인, 수상 이력, 줄거리의 구체적 내용)은 지어내지 마세요. 이모지는 0~2개. 해시태그는 6~10개, 한글 위주.\nJSON 배열로만 답하세요: [{"tone":"말투 이름","caption":"문구","hashtags":"#태그 #태그"}]`);
  if(out)S.ui.ig=(Array.isArray(out)?out:out.drafts||[]).filter(o=>o&&o.caption).slice(0,3)};
A.igCopy=d=>{const o=S.ui.ig[+d.i];copyText(o.caption+'\n\n'+(o.hashtags||''))};
A.isSave=()=>{const d=$('isD').value,f=+$('isF').value;if(!d||!f){toast('날짜와 팔로워 수를 적어 주세요');return}put('insta',d,{followers:f,reach:+$('isR').value||0,visits:+$('isV').value||0,at:new Date().toISOString()});toast('기록했습니다')};

/* 네이버 */
V.aka.naver=()=>`<div class="sec"><h2>네이버 예약</h2><p>예약 관리 화면 연결을 기다리는 중</p></div>
  <div class="card"><h3>연결되면 보이는 것</h3><ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>오늘부터 2주 동안의 네이버 예약 (날짜 · 시간 · 상품 · 인원 · 상태)</li><li>행사별 예약 인원이 「일정」에 저절로 들어갑니다</li><li>예약자 이름과 연락처는 가져오지 않습니다</li></ul>
   <p class="note" style="margin-top:10px">네이버 예약 관리 화면이 사무실 컴퓨터의 Claude 앱 브라우저에 로그인되어 있으면 매일 갱신 작업이 읽어 옵니다. 그때까지 예약 인원은 「일정 › 고치기」에서 직접 적습니다.</p>
   <div class="btns" style="margin-top:10px"><a class="btn" href="https://partner.booking.naver.com/" target="_blank" rel="noopener">네이버 예약 파트너센터 열기</a><button class="btn" data-a="go" data-v="cal">일정에서 인원 고치기</button></div></div>`;
