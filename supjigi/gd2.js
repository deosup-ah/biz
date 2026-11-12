/* 가이드 다시 만들기 (11/13 참부장 「고도화 · 디자인화 · 집중화 · 설명화, 기능마다 도움 되는 이유, 심플하고 의미 있게, 프로 앱처럼」)
   한 장에 기능 하나: 이름 · 한 줄 제목 · 화면 · 왜 도움이 되나 · 이렇게 씁니다 · 「열어 보기」.
   위에는 이야기 넘기듯 진행 막대, 아래는 이전 · 다음. 아직 여는 중인 기능은 마지막 장에 「안정화 중」으로 모은다. */
const G2=[
  {k:'cur',img:'a.gif',n:'큐레이션',t:'단어 하나면 평대 하나',why:'「이번 주 무엇을 앞에 둘까」를 고민하는 시간이 줄어듭니다. 매장에 있는 책으로만 묶여서 바로 진열할 수 있습니다.',how:['단어 하나 적기','카드 고르기','진열 · POP로'],go:'cur'},
  {k:'dp',img:'f.gif',n:'진열 3D',t:'놓기 전에 먼저 봅니다',why:'평면 그림으로는 높이와 서로 가리는 표지가 보이지 않습니다. 돌려 보고 놓으면 두 번 옮기지 않습니다.',how:['카드에서 「진열 보기」','끌어서 자리 바꾸기','「직원에게 보내기」'],go:'cur'},
  {k:'say',img:'g.gif',n:'말로 옮기기',t:'말 한마디에 책이 움직입니다',why:'손이 바쁠 때도 「3번 맨 앞으로」라고만 하면 됩니다. 한 바퀴 영상으로 남겨 다른 지점과 나눕니다.',how:['진열 창 아래 입력 칸','「1번이랑 2번 바꿔」','「영상」으로 저장'],go:'cur'},
  {k:'pop',img:'e.gif',n:'인쇄물',t:'종이 한 장이 고객을 세웁니다',why:'평대 앞에서 걸음을 멈추게 하는 건 책보다 한 문장입니다. 문구 · 크기 · 색이 한 번에 맞춰집니다.',how:['느낌 고르기','글 고치기','PDF · 이미지로 받기'],go:'design'},
  {k:'ig',img:'ig.jpg',n:'인스타 피드',t:'사진만 넣으면 게시물이 됩니다',why:'표지, 한 줄 문장, 정보 장까지 잡지처럼 이어집니다. 글은 책 제목을 늘어놓지 않고, 궁금하게 만듭니다.',how:['사진 넣기','디자인 고르기','저장 · 글 복사'],go:'ig'},
  {k:'pz',img:'pz.jpg',n:'가로세로 숲',t:'풀다 보면 서가 앞에 서 있습니다',why:'고객이 머무는 시간이 길어지고, 막히면 답이 담긴 책을 찾아 서가로 갑니다. 출력해서 건네기만 하면 됩니다.',how:['주제 · 난이도 고르기','인쇄 PDF','정답 장은 계산대에'],go:'pz'},
  {k:'ag',mock:'ag',n:'AI 에이전트',t:'메뉴를 몰라도 시키면 됩니다',why:'어디 있는지 찾지 않아도 「가득 채우는 진열」 「두 번째 POP」처럼 말하면 그 화면을 열고 만들어 줍니다.',how:['도움말 → AI 에이전트','하고 싶은 일 한 줄','결과 확인'],go:'ag'},
  {k:'cal',img:'b.gif',n:'일정',t:'한 줄이면 일정이 됩니다',why:'「내일 2시 30명 대화의 집」처럼 적으면 날짜 · 인원 · 장소가 나뉘어 들어갑니다. 겹치는 일정은 먼저 알려 줍니다.',how:['한 줄 적기','확인','오늘 화면에서 보기'],go:'today',adm:1},
  {k:'soon',n:'곧 열립니다',t:'안정화 중인 기능',soon:1},
  {k:'rule',n:'원칙',t:'앱과 큐레이팅 설계 원칙',rule:1}
];
/* 참부장이 직접 정한 문장(11/13). 글자를 바꾸지 않는다 */
const G2RULE=[['덜어 내기','기능을 더하기 전에 먼저 덜어 내고, 장식보다 명료하게 만듭니다.'],['공간과 기억','화면에 실제 공간의 치수와 결을 그대로 옮기고, 정보는 얇게 겹쳐 무겁게 가리지 않게 합니다. 여섯 지점 어디서나 그 지점의 집처럼 느껴지게 하고, 작은 정렬까지 정확하게 맞춥니다.'],['누구에게 · 어떤 방식으로','애매하고 실체 없는 주제를 겨냥하는 기능과 문구는 만들지 않습니다. 모든 기능은 「누구에게 · 어떤 방식으로」가 정해져 있어야 하고, 그 기록이 쌓이면 우연한 만남을 낳는 기획을 할 수 있게 합니다.']];
const G2SOON=[['말로 찾는 서가','감정 · 물건 · 상황 말마다 QR을 붙여, 고객이 찍으면 그 책이 있는 서가로 안내합니다.',1],['북토크 · 프로그램','북토크와 프로그램을 기획부터 비용 정산까지 자동으로 이어 줍니다.',1],['찍기 · 마지막 판매일','바코드나 제목을 찍으면 책마다 마지막으로 팔린 날과 1개월~3년 구간이 나오고, 오래 안 팔린 책을 반품 목록에 담습니다.',1],['주문 · 반품','팔린 만큼 셈해 주문에 담고, 확정은 사람이 합니다.',0],['매출','숫자 대신 이번 주 할 일로 알려 줍니다.',1],['지원사업','공모 일정과 신청 기록을 한곳에 모읍니다.',0]];
function g2Head(t){return `<div class="g2top"><b>도움말</b><button class="g2x" data-a="gdClose">닫기</button></div>
  <button class="g2ai" data-a="agOpen"><span class="g2ai1">AI 에이전트</span><span class="g2ai2">말하면 앱이 직접 해 줍니다</span><i aria-hidden="true">›</i></button>
  <div class="g2seg" role="tablist"><button data-a="gdTab" data-t="a" aria-pressed="${t==='a'}">화면 안내</button><button data-a="gdTab" data-t="b" aria-pressed="${t==='b'}">서점 기초</button>${typeof A.lvFromGd==='function'?'<button data-a="lvFromGd">내 단계</button>':''}</div>`}
const g2List=()=>{const ad=typeof isAdmin==='function'&&isAdmin();return G2.filter(s=>!s.adm||ad)};
const g2Soon=()=>{const ad=typeof isAdmin==='function'&&isAdmin();return G2SOON.filter(x=>x[2]||!ad)};
(()=>{const prev=gdDraw;
  gdDraw=function(){const tab=S.ui.gdTab==='b'?'b':'a';if(tab==='b'){let G=$('guide');if(!G){prev.apply(this,arguments);G=$('guide')}G.className='g2 g2bs';G.innerHTML=`<div class="g2b">${g2Head('b')}<div class="bshead g2sh"><div class="bsnav">${BASICS.map(s=>`<button data-a="bsGo" data-id="${s.id}">${s.t}</button>`).join('')}</div></div><div class="bsp g2bsp"><p class="bsl">처음 서점 일을 하는 사람이 먼저 알아 둘 것들입니다. 위 이름을 누르면 그 장으로 갑니다.</p>${bsHTML()}</div></div>`;return}
    let G=$('guide');if(!G){G=document.createElement('div');G.id='guide';document.body.append(G);let sx=0;G.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});G.addEventListener('touchend',e=>{if(!G.classList.contains('g2'))return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60&&!e.target.closest('.g2tabs'))A.gdGo({d:dx<0?1:-1})},{passive:true})}
    const L=g2List(),i=Math.min(S.ui.gd|0,L.length-1),s=L[i],last=i===L.length-1;G.className='g2'+(s.soon||s.rule?' g2free':'');
    const tabs='';
    const bar=`<div class="g2bar">${L.map((x,j)=>`<button data-a="gdTo" data-i="${j}" class="${j<i?'done':j===i?'on':''}" aria-label="${x.n}"></button>`).join('')}</div>`;
    const media=s.soon?`<div class="g2tiles">${g2Soon().map(([a,b],j)=>`<div class="g2t"><i aria-hidden="true"><b></b><b></b></i><b>${a}</b><p>${b}</p><em>안정화 중</em></div>`).join('')}</div>`:s.rule?`<div class="g2rule"><i aria-hidden="true"><b></b><b></b><b></b></i>${G2RULE.map(([a,b])=>`<section><h3>${a}</h3><p>${b}</p></section>`).join('')}<p class="g2sig">참부장</p></div>`:s.soon?`<div class="g2soon">${g2Soon().map(([a,b])=>`<div><span><b>${a}</b><em>안정화 중</em></span><p>${b}</p></div>`).join('')}</div>`
      :s.mock==='ag'?`<div class="g2m g2ag"><p class="me">진열 가득 채워 줘</p><p class="it">첫 번째 평대를 「가득 채우기」로 놓았습니다. 메인은 앞줄 가운데에 세웠어요.</p><p class="me">두 번째 POP 짙은 바탕으로</p><p class="it">POP를 「짙은 바탕」으로 만들었습니다.</p></div>`
      :`<div class="g2m"><img src="guide/${s.img}?v=13" alt="${esc(s.t)}" loading="eager"></div>`;
    G.innerHTML=`<div class="g2b">${g2Head('a')}${bar}
      <div class="g2c"><div class="g2h"><span class="g2n">${String(i+1).padStart(2,'0')}<i>/ ${String(L.length).padStart(2,'0')}</i></span><span class="g2f">${s.n}</span></div>
      <h2>${s.t}</h2>${media}
      ${s.rule?'':s.soon?`<p class="g2note">시스템 안정화 테스트 중입니다. 며칠 안에 차례로 열립니다.</p>`:`<div class="g2why"><b>왜 도움이 되나</b><p>${s.why}</p></div><ol class="g2how">${s.how.map(h=>`<li>${h}</li>`).join('')}</ol>`}</div>
      <div class="g2nav"><button class="btn" data-a="gdGo" data-d="-1" ${i===0?'disabled':''}>이전</button>${s.go?`<button class="btn" data-a="g2Try" data-k="${s.go}">열어 보기</button>`:''}${last?`<button class="btn pri" data-a="gdClose">시작하기</button>`:`<button class="btn pri" data-a="gdGo" data-d="1">다음</button>`}</div></div>`}})();
A.gdGo=d=>{const n=S.ui.gdTab==='b'?GDS.length:g2List().length;S.ui.gd=Math.max(0,Math.min(n-1,(S.ui.gd|0)+(+d.d)));gdDraw()};
A.gdTo=d=>{S.ui.gd=+d.i;gdDraw()};
A.g2Try=d=>{const k=d.k;A.gdClose();try{if(k==='cur')A.go({v:'cur',m:'store'});else if(k==='design')A.go({v:'design'});else if(k==='today')A.go({v:'today',m:'aka'});else if(k==='ana')A.go({v:'ana',m:'store'});else if(k==='ig')A.igOpen({});else if(k==='pz')A.pzOpen();else if(k==='wd')A.wdOpen();else if(k==='ag')A.agOpen()}catch(e){}};

/* 서점 기초: 「북토크와 행사」는 숨기고(안정화 중), 「지원사업」 장을 더한다 */
(()=>{const i=BASICS.findIndex(b=>b.id==='event');if(i>=0)BASICS.splice(i,1);
  if(!BASICS.some(b=>b.id==='biz'))BASICS.push({id:'biz',t:'지원사업',lead:'서점과 문화 공간이 공공 기관의 공모에 신청해 프로그램 비용을 지원받는 일입니다. 공고 → 신청 → 심사 → 협약 → 운영 → 정산 순서로 갑니다.',
   items:[['어디서 나오나','문화체육관광부와 그 아래 기관(한국문화예술위원회, 한국출판문화산업진흥원 등), 그리고 서울시 같은 지방자치단체가 해마다 공모를 냅니다.'],
    ['무엇을 지원하나','작가가 서점에 머물며 프로그램을 여는 일, 서점의 강연 · 북토크 · 독서 모임 같은 문화 활동, 지역 서점을 알리는 일 등입니다.'],
    ['신청서에 들어가는 것','시설 소개, 프로그램 계획(횟수 · 대상 · 일정), 예산(비목별 금액과 산출 근거), 지난 실적과 사진입니다.'],
    ['돈은 정해진 대로만','지원금은 신청서에 적은 비목에만 씁니다. 영수증 · 세금계산서 · 카드 내역을 남겨 두어야 끝에 정산할 수 있습니다.'],
    ['더숲의 기록','더숲 아카데미하우스는 2027 문학상주작가 지원사업(한국문화예술위원회)에 신청했습니다(2026년 11월). 씨네북토크 · 침묵의 독서처럼 이 공간에서만 할 수 있는 프로그램을 앞에 두었습니다.'],
    ['앱에서','「더보기 → 지원사업」에 다가오는 공모와 신청 기록을 모읍니다.']]})})();
/* 큐레이션과 POP: 참부장의 큐레이팅 원칙 한 문장(11/13) */
(()=>{const c=BASICS.find(b=>b.id==='curation');if(c&&!(c.items||[]).some(x=>x[0]==='정답은 없습니다'))c.items.unshift(['정답은 없습니다','해 보면서 이 공간에 맞는 목적과 방향을 정하되, 누구에게 어떤 방식으로 건넬지는 늘 분명해야 하고, 그것이 쌓였을 때 비로소 우연한 만남을 낳는 기획을 해 볼 수 있습니다.'])})();
