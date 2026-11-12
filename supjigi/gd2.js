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
  {k:'wd',img:'wd.jpg',n:'말로 찾는 서가',t:'마음에 걸린 말이 책으로 안내합니다',why:'직원이 바쁠 때도 고객이 스스로 책이 있는 곳을 찾습니다. 「잠이 안 올 때」 옆 QR 하나면 됩니다.',how:['말 · 장소 고치기','A4로 뽑아 붙이기','진열 바뀌면 다시 뽑기'],go:'wd'},
  {k:'ag',mock:'ag',n:'AI 에이전트',t:'메뉴를 몰라도 시키면 됩니다',why:'어디 있는지 찾지 않아도 「가득 채우는 진열」 「두 번째 POP」처럼 말하면 그 화면을 열고 만들어 줍니다.',how:['도움말 → AI 에이전트','하고 싶은 일 한 줄','결과 확인'],go:'ag'},
  {k:'cal',img:'b.gif',n:'일정',t:'한 줄이면 일정이 됩니다',why:'「내일 2시 30명 대화의 집」처럼 적으면 날짜 · 인원 · 장소가 나뉘어 들어갑니다. 겹치는 일정은 먼저 알려 줍니다.',how:['한 줄 적기','확인','오늘 화면에서 보기'],go:'today',adm:1},
  {k:'talk',img:'c.gif',n:'북토크',t:'준비 · 진행표 · 질문을 한 번에',why:'처음 맡아도 빠지는 게 없습니다. 진행표와 질문 카드가 함께 나옵니다.',how:['작가 · 책 적기','진행표 받기','질문 카드 뽑기'],go:'design',adm:1},
  {k:'ana',img:'d.gif',n:'매출',t:'숫자가 다음 할 일을 말합니다',why:'표를 읽는 대신 이번 주에 할 일 세 가지로 바꿔 보여 줍니다.',how:['지점 고르기','할 일 세 가지','지난달과 견주기'],go:'ana',adm:1},
  {k:'soon',n:'곧 열립니다',t:'안정화 중인 기능',soon:1}
];
const G2SOON=[['찍기 · 마지막 판매일','바코드나 제목을 찍으면 책마다 마지막으로 팔린 날과 1개월~3년 구간이 나오고, 오래 안 팔린 책을 반품 목록에 담습니다.',1],['주문 · 반품','팔린 만큼 셈해 주문에 담고, 확정은 사람이 합니다.',0],['매출','숫자 대신 이번 주 할 일로 알려 줍니다.',0],['지원사업','공모 일정과 신청 기록을 한곳에 모읍니다.',0]];
const g2List=()=>{const ad=typeof isAdmin==='function'&&isAdmin();return G2.filter(s=>!s.adm||ad)};
const g2Soon=()=>{const ad=typeof isAdmin==='function'&&isAdmin();return G2SOON.filter(x=>x[2]||!ad)};
(()=>{const prev=gdDraw;
  gdDraw=function(){const tab=S.ui.gdTab==='b'?'b':'a';if(tab==='b'){const G=$('guide');if(G)G.classList.remove('g2');return prev.apply(this,arguments)}
    let G=$('guide');if(!G){G=document.createElement('div');G.id='guide';document.body.append(G);let sx=0;G.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});G.addEventListener('touchend',e=>{if(!G.classList.contains('g2'))return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60&&!e.target.closest('.g2tabs'))A.gdGo({d:dx<0?1:-1})},{passive:true})}
    G.className='g2';const L=g2List(),i=Math.min(S.ui.gd|0,L.length-1),s=L[i],last=i===L.length-1;
    const tabs=`<div class="g2tabs" role="tablist"><button data-a="agOpen">AI 에이전트</button><button data-a="gdTab" data-t="a" aria-pressed="true">화면 안내</button><button data-a="gdTab" data-t="b">서점 기초</button>${typeof A.lvFromGd==='function'?'<button data-a="lvFromGd">내 단계</button>':''}</div>`;
    const bar=`<div class="g2bar">${L.map((x,j)=>`<button data-a="gdTo" data-i="${j}" class="${j<i?'done':j===i?'on':''}" aria-label="${x.n}"></button>`).join('')}</div>`;
    const media=s.soon?`<div class="g2soon">${g2Soon().map(([a,b])=>`<div><span><b>${a}</b><em>안정화 중</em></span><p>${b}</p></div>`).join('')}</div>`
      :s.mock==='ag'?`<div class="g2m g2ag"><p class="me">진열 가득 채워 줘</p><p class="it">첫 번째 평대를 「가득 채우기」로 놓았습니다. 메인은 앞줄 가운데에 세웠어요.</p><p class="me">두 번째 POP 짙은 바탕으로</p><p class="it">POP를 「짙은 바탕」으로 만들었습니다.</p></div>`
      :`<div class="g2m"><img src="guide/${s.img}?v=13" alt="${esc(s.t)}" loading="eager"></div>`;
    G.innerHTML=`<div class="g2b"><div class="g2top"><b>도움말</b><button class="g2x" data-a="gdClose">닫기</button></div>${tabs}${bar}
      <div class="g2c"><div class="g2h"><span class="g2n">${String(i+1).padStart(2,'0')}<i>/ ${String(L.length).padStart(2,'0')}</i></span><span class="g2f">${s.n}</span></div>
      <h2>${s.t}</h2>${media}
      ${s.soon?`<p class="g2note">시스템 안정화 테스트 중입니다. 며칠 안에 차례로 열립니다.</p>`:`<div class="g2why"><b>왜 도움이 되나</b><p>${s.why}</p></div><ol class="g2how">${s.how.map(h=>`<li>${h}</li>`).join('')}</ol>`}</div>
      <div class="g2nav"><button class="btn" data-a="gdGo" data-d="-1" ${i===0?'disabled':''}>이전</button>${s.go?`<button class="btn" data-a="g2Try" data-k="${s.go}">열어 보기</button>`:''}${last?`<button class="btn pri" data-a="gdClose">시작하기</button>`:`<button class="btn pri" data-a="gdGo" data-d="1">다음</button>`}</div></div>`}})();
A.gdGo=d=>{const n=S.ui.gdTab==='b'?GDS.length:g2List().length;S.ui.gd=Math.max(0,Math.min(n-1,(S.ui.gd|0)+(+d.d)));gdDraw()};
A.gdTo=d=>{S.ui.gd=+d.i;gdDraw()};
A.g2Try=d=>{const k=d.k;A.gdClose();try{if(k==='cur')A.go({v:'cur',m:'store'});else if(k==='design')A.go({v:'design'});else if(k==='today')A.go({v:'today',m:'aka'});else if(k==='ana')A.go({v:'ana',m:'store'});else if(k==='ig')A.igOpen({});else if(k==='pz')A.pzOpen();else if(k==='wd')A.wdOpen();else if(k==='ag')A.agOpen()}catch(e){}};
