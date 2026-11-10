/* 더숲 워크룸 — 아카데미: 오늘 할 일 자동 · 인스타 인사이트 · 네이버 리뷰/언급 분석 */
TABS.aka=[['today','오늘'],['cal','일정'],['design','POP'],['insta','인스타'],['naver','네이버'],['plan','기획']];
const pc=(a,b)=>b?Math.round(a/b*1000)/10:0;
/* ── 오늘: 할 일을 일정에서 저절로 뽑는다 ── */
function akaTodo(){const up=evUp(),out=[],td=up.filter(e=>e.date===TODAY);
  if(td.length)out.push({t:`오늘 일정 ${td.length}건 — 입구에 세울 단체표`,s:td.map(e=>`${e.time||''} ${e.title}`).join(' · '),b:[['오늘의 단체표','board','']]});
  td.forEach(e=>out.push({t:`「${e.title}」 환영판`,s:`${e.time||''} ${e.place||''}`,b:[['환영판 만들기','welcome',e.id]]}));
  up.filter(e=>e.date>TODAY&&dayDiff(e.date,TODAY)<=3).forEach(e=>out.push({t:`${dday(e.date)} 「${e.title}」 안내 POP`,s:`${mdw(e.date)} ${e.time||''}`,b:[['POP 만들기','pop',e.id],['인스타 초안','ig',e.id]]}));
  up.filter(e=>e.cap&&dayDiff(e.date,TODAY)>3&&dayDiff(e.date,TODAY)<=10&&(e.booked||0)/e.cap<.3).forEach(e=>out.push({t:`「${e.title}」 예약이 더딥니다`,s:`${mdw(e.date)} · ${e.booked||0}/${e.cap}명`,b:[['인스타 초안','ig',e.id],['POP 만들기','pop',e.id]]}));
  const ig=(SEED||{}).ig;if(!ig||dayDiff(TODAY,ig.asOf)>7)out.push({t:'인스타 인사이트가 일주일 넘었습니다',s:ig?`마지막 ${ig.asOf}`:'아직 없음',b:[['인스타 보기','go','insta']]});
  return out}
(()=>{const f=V.aka.today;V.aka.today=()=>{let h=f();const L=akaTodo(),up=evUp(),nx=up[0],hero=`<div class="hero"><p>${[mdw(TODAY),hooks(1).season,(typeof wxText==='function'?wxText():'')].filter(Boolean).join(' · ')}</p><h2>${L.length?`오늘 챙길 것 ${L.length}가지`:nx?`다음은 ${dday(nx.date)}, ${esc(nx.title)}`:'오늘은 조용한 숲'}</h2></div>
  ${L.length?`<div class="card todo">${L.map(x=>`<div class="li"><div class="t"><b>${esc(x.t)}</b><small>${esc(x.s||'')}</small></div><div class="btns" style="flex-wrap:nowrap">${x.b.map(([n,a,id],i)=>`<button class="btn sm ${i?'':'pri'}" data-a="akaDo" data-t="${a}" data-id="${id}">${n}</button>`).join('')}</div></div>`).join('')}</div>`:''}`;
  const i=h.indexOf('</div>');return hero+(i>0&&h.startsWith('<div class="sec">')?h.slice(i+6):h)}})();
A.akaDo=d=>{if(d.t==='go'){A.go({v:d.id});return}if(d.t==='ig'){A.igFrom({id:d.id});return}S.view.aka='design';window.scrollTo(0,0);if(d.t==='board')A.akaTpl({t:'board'});else if(d.t==='welcome'){A.akaTpl({t:'group'});A.sgEv({id:d.id})}else A.akaTpl({t:'ev',id:d.id})};

/* ── 인스타 인사이트 (계정의 프로페셔널 대시보드에서 읽어 온 값) ── */
function igCard(){const g=(SEED||{}).ig;if(!g)return `<div class="card empty">인스타 인사이트를 아직 읽어 오지 못했습니다.</div>`;
  const er=pc(g.inter,g.reach),vr=pc(g.visits,g.reach),lr=pc(g.link,g.visits),tips=[];
  tips.push(`본 사람 ${won(g.reach)}명 가운데 <b>${g.viewsNon}%가 팔로워가 아닌 사람</b>입니다. 새 손님에게 닿고 있습니다.`);
  tips.push(`본 사람 100명 중 <b>${Math.round(vr)}명이 프로필까지</b> 들어왔고, 프로필에 온 사람 100명 중 ${Math.round(lr)}명이 링크를 눌렀습니다.`);
  if(g.mix.reels<15)tips.push(`조회의 ${g.mix.post}%가 게시물, 릴스는 ${g.mix.reels}%뿐입니다. 숲 · 공간 영상을 릴스로 한두 편 올려 볼 만합니다.`);
  if(g.top&&g.top.length)tips.push(`반응이 가장 컸던 글은 ${g.top[0].d}(${g.top[0].n}건)입니다. 그날 올린 소재를 다시 써 보세요.`);
  const bar=(n,v,c)=>hbar(n,v,100,v+'%',c,`${n} ${v}%`);
  return `<div class="card"><h3>인사이트 <small>@${esc(g.acct)} · 최근 ${g.days}일 · ${esc(g.asOf)} 읽음</small></h3>
   <div class="grid g4"><div class="kpi"><span>조회수</span><b class="num">약 ${Math.round(g.views/1000)/10}만</b><small>본 사람 ${won(g.reach)}명</small></div><div class="kpi"><span>반응(좋아요 · 댓글 · 저장 · 공유)</span><b class="num">${won(g.inter)}</b><small>참여 계정 ${won(g.engaged)} · 반응률 ${er}%</small></div><div class="kpi"><span>프로필 방문</span><b class="num">${won(g.visits)}</b><small>링크 누름 ${won(g.link)}</small></div><div class="kpi"><span>팔로워</span><b class="num">${won(g.followers)}</b><small>총 팔로워</small></div></div>
   <div class="grid g2" style="margin-top:14px"><div><h3 style="font-size:15px">누가 보나</h3>${bar('팔로워',g.viewsF,'var(--s1)')}${bar('팔로워 아닌 사람',g.viewsNon,'var(--s3)')}<h3 style="font-size:15px;margin-top:12px">무엇으로 보나 <small>조회수 기준</small></h3>${bar('게시물',g.mix.post,'var(--s1)')}${bar('스토리',g.mix.story,'var(--s4)')}${bar('릴스',g.mix.reels,'var(--s2)')}</div>
    <div><h3 style="font-size:15px">반응이 컸던 글 <small>날짜 · 반응 수</small></h3>${(g.top||[]).map(t=>hbar(t.d,t.n,Math.max(...g.top.map(x=>x.n)),t.n+'건','var(--pine)',`${t.d} ${t.n}건`)).join('')}<h3 style="font-size:15px;margin-top:12px">읽어 보면</h3><ul style="margin:0;padding-left:18px;display:grid;gap:6px">${tips.map(t=>`<li>${t}</li>`).join('')}</ul></div></div>
   <p class="note" style="margin-top:10px">인스타그램에 로그인된 사무실 컴퓨터의 Claude 앱 브라우저에서 읽은 숫자입니다. 다시 읽으려면 Claude 에게 「인스타 인사이트 갱신」이라고 하면 됩니다.</p></div>`}
(()=>{const f=V.aka.insta;V.aka.insta=()=>{const h=f(),i=h.indexOf('</div>');let c='';try{c=igCard()}catch(e){}return h.slice(0,i+6)+c+h.slice(i+6)}})();

/* ── 네이버: 리뷰 붙여 넣어 분석 · 블로그/카페 언급 기록 ── */
const NV_T=[['전망 · 숲',/뷰|전망|풍경|숲|산|자연|북한산|경치|야경|루프탑/],['공간 · 분위기',/분위기|공간|인테리어|넓|조용|아늑|예쁘|감성|깔끔|쾌적/],['책 · 서점',/책|서점|북카페|도서|큐레이션|독서/],['커피 · 빵',/커피|라떼|빵|베이커리|디저트|케이크|음료|소금빵/],['식사',/식사|다이닝|레스토랑|브런치|파스타|메뉴|음식|맛/],['친절 · 응대',/친절|직원|응대|서비스|안내/],['주차 · 오는 길',/주차|버스|종점|언덕|걸어|교통|접근|셔틀/],['값',/가격|비싸|가성비|값|저렴/],['기다림 · 붐빔',/웨이팅|대기|줄|붐비|사람이 많|시끄|자리가 없/],['숙박 · 대관',/숙박|객실|스테이|북스테이|워크숍|세미나|대관|웨딩|연수/]];
const NV_P=/좋|최고|추천|만족|친절|예쁘|맛있|멋지|힐링|편안|훌륭|감동|또 오|재방문|깨끗|쾌적|아늑/,NV_N=/별로|아쉽|아쉬|불친절|비싸|시끄|불편|실망|오래 걸|더럽|좁|없어서|힘들|다신|불만/;
function nvAnalyze(txt){const rv=String(txt||'').split(/\n{2,}|\r?\n(?=\S{0,12}\s*\d{2,4}[.\/년]\s*\d{1,2})/).map(s=>s.trim()).filter(s=>s.replace(/\s/g,'').length>=8),R=rv.length?rv:String(txt||'').split(/\n/).map(s=>s.trim()).filter(s=>s.length>=8);
  const T=NV_T.map(([n,re])=>{let m=0,p=0,ng=0;R.forEach(r=>{if(re.test(r)){m++;r.split(/[.!?~\n]/).forEach(s=>{if(re.test(s)){if(NV_N.test(s))ng++;else if(NV_P.test(s))p++}})}});return{n,m,p,ng}}).filter(t=>t.m).sort((a,b)=>b.m-a.m);
  let pos=0,neg=0;R.forEach(r=>{const a=NV_P.test(r),b=NV_N.test(r);if(a&&!b)pos++;else if(b&&!a)neg++});return{n:R.length,pos,neg,mix:R.length-pos-neg,T,at:TODAY}}
const nvGet=()=>ls.get('naver',{an:null,log:[]}),nvSet=o=>ls.set('naver',o);
V.aka.naver=()=>{const D=nvGet(),A_=D.an,L=(D.log||[]).slice().sort((a,b)=>a.m<b.m?-1:1);
  return `<div class="hero"><p>네이버 · 리뷰와 언급</p><h2>손님이 남긴 말을 읽습니다</h2></div>
  <div class="grid g2" style="align-items:start"><div class="card form"><h3>리뷰 분석 <small>붙여 넣으면 바로 셉니다</small></h3>
    <textarea id="nvT" rows="7" placeholder="스마트플레이스 › 리뷰 화면이나 네이버 지도 리뷰를 드래그해 복사한 뒤 여기에 붙여 넣으세요. 이름은 저장하지 않고, 숫자만 남깁니다."></textarea>
    <div class="btns"><button class="btn pri" data-a="nvGo">분석하기</button>${A_?`<button class="btn ghost" data-a="nvClear">지우기</button>`:''}</div>
    ${A_?`<div class="grid g3" style="margin-top:6px"><div class="kpi"><span>읽은 리뷰</span><b class="num">${A_.n}건</b><small>${A_.at}</small></div><div class="kpi"><span>좋다는 말</span><b class="num">${pc(A_.pos,A_.n)}%</b><small>${A_.pos}건</small></div><div class="kpi"><span>아쉽다는 말</span><b class="num ${A_.neg?'down':''}">${pc(A_.neg,A_.n)}%</b><small>${A_.neg}건</small></div></div>
     <h3 style="font-size:15px;margin-top:10px">무엇을 말하나 <small>언급 수 · 좋음 / 아쉬움</small></h3>${A_.T.map(t=>hbar(t.n,t.m,Math.max(...A_.T.map(x=>x.m)),`${t.m}건 <small style="color:var(--muted)">좋음 ${t.p} · 아쉬움 ${t.ng}</small>`,t.ng>t.p?'var(--crit)':'var(--pine)',`${t.n} ${t.m}건`)).join('')}
     <ul style="margin:10px 0 0;padding-left:18px;display:grid;gap:6px">${(()=>{const o=[],best=A_.T.slice().sort((a,b)=>b.p-a.p)[0],bad=A_.T.slice().sort((a,b)=>b.ng-a.ng)[0];if(best&&best.p)o.push(`가장 많이 칭찬받는 것은 <b>${best.n}</b>입니다. 사진과 문구의 첫머리에 두세요.`);if(bad&&bad.ng)o.push(`아쉽다는 말이 가장 많은 것은 <b>${bad.n}</b>(${bad.ng}건)입니다. 안내판이나 공지로 먼저 알려 주면 줄어듭니다.`);if(!o.length)o.push('뚜렷한 쏠림이 없습니다. 리뷰를 더 붙여 넣으면 정확해집니다.');return o.map(x=>`<li>${x}</li>`).join('')})()}</ul>`:'<p class="note">낱말을 세어 주제별로 나누고, 좋다 · 아쉽다는 말을 가려냅니다. 글 자체는 저장하지 않습니다.</p>'}</div>
   <div class="card form"><h3>블로그 · 카페 언급 <small>달마다 적어 두면 흐름이 보입니다</small></h3>
    ${L.length>1?lineChart([{n:'블로그',c:'var(--s3)',v:L.slice(-12).map(x=>x.blog||0)},{n:'카페',c:'var(--s4)',v:L.slice(-12).map(x=>x.cafe||0)}],L.slice(-12).map(x=>x.m.slice(2).replace('-','.'))):L.length?`<div class="grid g2"><div class="kpi"><span>블로그 (${L[0].m})</span><b class="num">${won(L[0].blog)}건</b></div><div class="kpi"><span>카페 (${L[0].m})</span><b class="num">${won(L[0].cafe)}건</b></div></div>`:'<div class="empty">아직 기록이 없습니다.</div>'}
    ${L.length>1?(()=>{const a=L[L.length-1],b=L[L.length-2],d=pc(a.blog+a.cafe-b.blog-b.cafe,b.blog+b.cafe);return `<p class="note">${a.m} 언급 ${won(a.blog+a.cafe)}건 · 앞 달보다 ${d>=0?'+':''}${d}%</p>`})():''}
    <div class="grid g3"><div class="fld"><label for="nvM">달</label><input type="month" id="nvM" value="${TODAY.slice(0,7)}"></div><div class="fld"><label for="nvB">블로그 글 수</label><input type="number" id="nvB" min="0"></div><div class="fld"><label for="nvC">카페 글 수</label><input type="number" id="nvC" min="0"></div></div>
    <div class="btns"><button class="btn" data-a="nvLog">기록하기</button></div>
    <ol class="steps"><li><span>네이버에서 「더숲 아카데미하우스」를 검색하고 블로그 탭 › 옵션 › 기간을 그 달로 맞춥니다.</span></li><li><span>카페 탭도 같은 기간으로 봅니다.</span></li><li><span>보이는 글 수를 위 칸에 적습니다.</span></li></ol>
    <p class="note">네이버 화면은 이 도구에서 열 수 없게 막혀 있어 자동으로 읽어 오지 못합니다. 그래서 붙여 넣기와 직접 적기로 만들었습니다. 기록은 이 기기에 저장됩니다.</p></div></div>`};
A.nvGo=()=>{const t=$('nvT').value;if(t.replace(/\s/g,'').length<20){toast('리뷰 글을 붙여 넣어 주세요');return}const D=nvGet();D.an=nvAnalyze(t);nvSet(D);render();toast(`${D.an.n}건을 읽었습니다`)};
A.nvClear=()=>{const D=nvGet();D.an=null;nvSet(D);render()};
A.nvLog=()=>{const m=$('nvM').value,b=+$('nvB').value||0,c=+$('nvC').value||0;if(!m||(!b&&!c)){toast('달과 글 수를 적어 주세요');return}const D=nvGet();D.log=(D.log||[]).filter(x=>x.m!==m).concat([{m,blog:b,cafe:c}]);nvSet(D);render();toast('기록했습니다')};
