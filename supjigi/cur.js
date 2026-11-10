'use strict';
/* 큐레이션: 때 · 계절 · 날씨에 맞춘 코너 제안 → 지점 성격 → 들여놓을 책. 계산으로만 돌아가서 어디서 열어도 같다.
   품절 · 절판으로 표시된 책(window.SOLD)은 어디에도 내지 않는다. */
const BRAND={aka:'사유의숲',choso:'초소책방',sojeon:'소전미술관',nowon:'노원',nmain:'본점',njung:'중계점'};
const TAGN=br=>NM(br)?'':(BRAND[br]||''),BRN=br=>NM(br)?'노원문고':'더숲 '+(BRAND[br]||'');
const RC={문학:'문학',에세이:'문학',인문:'인문',예술:'예술',과학:'과학'};
const TLAB=['오전(12시 이전)','점심 뒤(12~15시)','오후(15~18시)','저녁(18시 이후)'];
const sellable=b=>!(b&&b.isbn&&(window.SOLD||{})[b.isbn]);
function profile(br){const ms=yms().slice(-12),me=agg(br,ms),share=a=>{const t=Object.values(a.cats).reduce((x,o)=>x+o.amt,0)||1,s={};GR.forEach(g=>s[g]=((a.cats[g]||{}).amt||0)/t);return s},sh=share(me),oth=BR.filter(b=>b.k!==br).map(b=>share(agg(b.k,ms))),avg={};
  GR.forEach(g=>avg[g]=oth.reduce((a,s)=>a+s[g],0)/Math.max(1,oth.length));const tops=items(br).slice().sort((a,b)=>(b.sold30||0)-(a.sold30||0)).slice(0,30),tag=re=>tops.filter(x=>re.test(x.t)).length,c=me.cu,ws=c.wkd+c.wke,ts=c.t.reduce((a,v)=>a+v,0);
  return{sh,avg,order:GR.filter(g=>g!=='기타').sort((a,b)=>sh[b]-sh[a]),price:me.qty?me.amt/me.qty:0,wke:ws?c.wke/ws:null,peak:ts?c.t.indexOf(Math.max(...c.t)):null,classic:tag(/세계문학|전집|초판본|데미안|싯다르타|인간실격|이방인|동물농장/),mini:tag(/미니|키링/),poem:tag(/시인선|시선|시집|의시$/),tops,months:ms.filter(ym=>sales().some(d=>d.br===br&&d.ym===ym)).length,amt:me.amt}}
function profText(br,P){const L=[],p=v=>Math.round(v*100),g1=P.order[0],g2=P.order[1];if(!P.amt)return['판매 자료가 아직 없습니다.'];
  L.push(`${g1} ${p(P.sh[g1])}%, ${g2} ${p(P.sh[g2])}% (최근 ${P.months}개월 매출).`);
  const up=GR.filter(g=>g!=='기타'&&P.sh[g]-P.avg[g]>=.04).map(g=>`${g} +${p(P.sh[g]-P.avg[g])}%p`),dn=GR.filter(g=>g!=='기타'&&P.avg[g]-P.sh[g]>=.04).map(g=>`${g} −${p(P.avg[g]-P.sh[g])}%p`);
  if(up.length||dn.length)L.push(`다른 지점보다 ${[up.length?'강한 곳: '+up.join(', '):'',dn.length?'약한 곳: '+dn.join(', '):''].filter(Boolean).join(' / ')}.`);
  const t=[];if(P.classic>=3)t.push(`고전 ${P.classic}종`);if(P.mini>=2)t.push(`미니북 · 키링북 ${P.mini}종`);if(P.poem>=2)t.push(`시집 ${P.poem}종`);if(t.length)L.push(`많이 팔린 30종 안에 ${t.join(', ')} — ${P.mini>=2?'가볍게 집어 가는 선물용 책이 통합니다.':P.classic>=3?'이름을 아는 고전이 꾸준히 나갑니다.':'시를 찾는 손님이 있습니다.'}`);
  if(P.price)L.push(`권당 평균 ${won(P.price)}원${P.wke!=null?` · 주말 매출 ${p(P.wke)}%`:''}${P.peak!=null?` · 붐비는 때 ${TLAB[P.peak]}`:''}.`);
  if(br==='aka')L.push('인물도서관과 「이 평대의 책」처럼, 한 사람 · 한 생각을 따라 읽게 하는 결.');return L}
function recs(br){const P=profile(br),R=window.RECS||{new:{},steady:{}},its=items(br),has=b=>its.find(x=>(b.isbn&&x.isbn===b.isbn)||nt(x.t)===nt(b.t)),w={};
  Object.keys(RC).forEach(c=>w[c]=(P.sh[RC[c]]||.05)*(RC[c]==='문학'?(c==='문학'?.65:.35):1));const sum=Object.values(w).reduce((a,v)=>a+v,0)||1;
  const pick=(src,total,label)=>{const out=[];Object.keys(RC).sort((a,b)=>w[b]-w[a]).forEach(c=>{const k=Math.max(1,Math.round(total*w[c]/sum));(src[c]||[]).filter(b=>{const h=has(b);return sellable(b)&&!(h&&h.stock>0)&&!out.some(o=>o.isbn===b.isbn)}).slice(0,k).forEach(b=>out.push({...b,cat:c,src:label,why:label==='신간'?`${b.d} 출간 · ${RC[c]}`:`${c} 스테디셀러`}))});return out};
  const cross=[];BR.filter(b=>b.k!==br).forEach(b=>items(b.k).filter(x=>(x.sold30||0)>=3&&sellable(x)).forEach(x=>{const h=has(x);if(!(h&&h.stock>0)&&!cross.some(c=>c.isbn===x.isbn))cross.push({t:x.t,a:x.a,p:x.p,isbn:x.isbn,price:x.price,cat:grp(x.cat),src:'구간',why:`${b.n}에서 30일 ${x.sold30}권`,n:x.sold30})}));cross.sort((a,b)=>b.n-a.n);
  return{P,nw:pick(R.new,12,'신간'),st:pick(R.steady,10,'구간'),cross:cross.slice(0,10)}}
/* 날씨 (수유동). 공개 주소에서만 불러올 수 있고, 안 되면 계절만 본다. */
function loadWx(){if(S.wxTried)return;S.wxTried=true;fetch('https://api.open-meteo.com/v1/forecast?latitude=37.65&longitude=127.01&current=temperature_2m,precipitation,weather_code&timezone=Asia%2FSeoul').then(r=>r.json()).then(j=>{const c=j.current||{},code=c.weather_code;S.wx={temp:c.temperature_2m,rain:(code>=51&&code<=67)||(code>=80&&code<=82)||code>=95,snow:(code>=71&&code<=77)||code===85||code===86,clear:code<=1,cloud:code===2||code===3||code===45||code===48};softRender()}).catch(()=>{})}
const wxText=()=>{const w=S.wx;return w?`지금 수유동 ${Math.round(w.temp)}°C · ${w.snow?'눈':w.rain?'비':w.clear?'맑음':'흐림'}`:''};
/* 제안 은행: 짧은 문구 · 한 줄 까닭 · 상징 · 색. 책은 지금 팔 수 있는 것 가운데 제목으로 찾는다. */
const BANK=[
 {tone:"다른 시선",t:"돌보는 사람의 자리",why:"돌봄은 늘 누군가의 시간으로 치러집니다.",sym:'house',bp:3,pp:1,k:/^$/,sc:c=>2+((c.d+0)%3),fixed:[["새벽 세 시의 몸들에게", "김영옥 외", "봄날의책"], ["아빠의 아빠가 됐다", "조기현", "이매진"], ["돌봄 선언", "더 케어 컬렉티브", "니케북스"]]},
 {tone:"다른 시선",t:"끝에서 읽기",why:"죽음을 다룬 책은 대개 삶에 관한 책입니다.",sym:'candle',bp:5,pp:5,k:/^$/,sc:c=>2+((c.d+1)%3),fixed:[["어떻게 죽을 것인가", "아툴 가완디", "부키"], ["숨결이 바람 될 때", "폴 칼라니티", "흐름출판"], ["아침의 피아노", "김진영", "한겨레출판"], ["죽은 자의 집 청소", "김완", "김영사"]]},
 {tone:"다른 시선",t:"집이 아니라 방",why:"사는 곳이 사는 방식을 정합니다. 도시를 읽는 책.",sym:'house',bp:4,pp:0,k:/^$/,sc:c=>2+((c.d+2)%3),fixed:[["도시는 무엇으로 사는가", "유현준", "을유문화사"], ["어디서 살 것인가", "유현준", "을유문화사"], ["착취도시, 서울", "이혜미", "글항아리"]]},
 {tone:"다른 시선",t:"말이 옮겨질 때",why:"번역과 사전, 낱말의 결을 따지는 사람들.",sym:'pencil',bp:2,pp:4,k:/^$/,sc:c=>2+((c.d+3)%3),fixed:[["번역: 황석희", "황석희", "달"], ["말끝이 당신이다", "김진해", "한겨레출판"], ["단어의 집", "안희연", "한겨레출판"], ["우리말 어감사전", "안상순", "유유"]]},
 {tone:"다른 시선",t:"나무 쪽에서 보면",why:"사람이 주인공이 아닌 숲 이야기.",sym:'leaf',bp:1,pp:1,k:/^$/,sc:c=>2+((c.d+4)%3),fixed:[["랩 걸", "호프 자런", "알마"], ["나무 수업", "페터 볼레벤", "위즈덤하우스"], ["식물의 책", "이소영", "책읽는수요일"], ["숲은 고요하지 않다", "마들렌 치게", "흐름출판"]]},
 {tone:"다른 시선",t:"아픈 몸으로 살기",why:"낫는 이야기가 아니라, 아픈 채로 사는 이야기.",sym:'drop',bp:6,pp:4,k:/^$/,sc:c=>2+((c.d+5)%3),fixed:[["아픈 몸을 살다", "아서 프랭크", "봄날의책"], ["질병과 함께 춤을", "다른몸들", "푸른숲"], ["은유로서의 질병", "수전 손택", "이후"], ["정신병의 나라에서 왔습니다", "리단", "반비"]]},
 {tone:"다른 시선",t:"자기만의 방, 그 뒤",why:"방을 얻은 다음에 쓰인 이야기들.",sym:'pencil',bp:6,pp:6,k:/^$/,sc:c=>2+((c.d+6)%3),fixed:[["자기만의 방", "버지니아 울프", "민음사"], ["남자들은 자꾸 나를 가르치려 든다", "리베카 솔닛", "창비"], ["멀고도 가까운", "리베카 솔닛", "반비"], ["82년생 김지영", "조남주", "민음사"]]},
 {tone:"다른 시선",t:"국경 위에서",why:"떠나온 사람과 남은 사람 사이의 책.",sym:'walk',bp:2,pp:2,k:/^$/,sc:c=>2+((c.d+7)%3),fixed:[["깻잎 투쟁기", "우춘희", "교양인"], ["파친코", "이민진", "인플루엔셜"], ["H마트에서 울다", "미셸 자우너", "문학동네"], ["마이너 필링스", "캐시 박 홍", "마티"]]},
 {tone:"다른 시선",t:"숫자가 정하는 것들",why:"알고리즘과 통계가 놓친 사람들.",sym:'star',bp:5,pp:5,k:/^$/,sc:c=>2+((c.d+8)%3),fixed:[["대량살상 수학무기", "캐시 오닐", "흐름출판"], ["보이지 않는 여자들", "캐럴라인 크리아도 페레스", "웅진지식하우스"], ["도둑맞은 집중력", "요한 하리", "어크로스"]]},
 {tone:"다른 시선",t:"먹는다는 것",why:"요리책 말고, 먹는 일을 생각하는 책.",sym:'cup',bp:3,pp:3,k:/^$/,sc:c=>2+((c.d+9)%3),fixed:[["음식의 언어", "댄 주래프스키", "어크로스"], ["오늘 뭐 먹지?", "권여선", "한겨레출판"], ["외로운 사람끼리 배추적을 먹었다", "김서령", "푸른역사"], ["잡식동물의 딜레마", "마이클 폴란", "다른세상"]]},
 {tone:"다른 시선",t:"걷는 사람의 속도",why:"북한산 아래에서 읽는 걷기의 책.",sym:'walk',bp:1,pp:1,k:/^$/,sc:c=>2+((c.d+10)%3),fixed:[["걷기의 인문학", "리베카 솔닛", "반비"], ["걷는 사람, 하정우", "하정우", "문학동네"], ["월든", "헨리 데이비드 소로", "은행나무"]]},
 {tone:"다른 시선",t:"이름 붙이기 전의 세계",why:"분류하고 이름 짓는 일을 의심하는 과학책.",sym:'wave',bp:4,pp:4,k:/^$/,sc:c=>2+((c.d+11)%3),fixed:[["물고기는 존재하지 않는다", "룰루 밀러", "곰출판"], ["떨림과 울림", "김상욱", "동아시아"], ["코스모스", "칼 세이건", "사이언스북스"]]},
 {tone:"다른 시선",t:"책방에 관한 책",why:"책방에서 읽는 책방 이야기.",sym:'book',bp:0,pp:0,k:/^$/,sc:c=>2+((c.d+12)%3),fixed:[["어서 오세요, 휴남동 서점입니다", "황보름", "클레이하우스"], ["섬에 있는 서점", "개브리얼 제빈", "루페"], ["츠바키 문구점", "오가와 이토", "위즈덤하우스"]]},
 {tone:"말놀이",t:"제목이 질문인 책",why:"답은 책 안에 있을 수도, 없을 수도.",sym:'star',bp:2,pp:3,k:/^$/,sc:c=>2+((c.d+13)%3),fixed:[["정의란 무엇인가", "마이클 샌델", "와이즈베리"], ["왜 나는 너를 사랑하는가", "알랭 드 보통", "청미래"], ["어떻게 살 것인가", "유시민", "생각의길"], ["우리는 왜 잠을 자야 할까", "매슈 워커", "열린책들"]]},
 {tone:"말놀이",t:"숫자가 들어간 제목",why:"1984부터 백 년까지. 순서대로 놓아 보세요.",sym:'star',bp:5,pp:3,k:/^$/,sc:c=>2+((c.d+14)%3),fixed:[["1984", "조지 오웰", "민음사"], ["7년의 밤", "정유정", "은행나무"], ["82년생 김지영", "조남주", "민음사"], ["백년의 고독", "가브리엘 가르시아 마르케스", "민음사"]]},
 {tone:"말놀이",t:"아무튼, 아무튼",why:"아무튼 한 가지에 빠진 사람들.",sym:'cup',bp:3,pp:3,k:/^$/,sc:c=>2+((c.d+15)%3),fixed:[["아무튼, 술", "김혼비", "제철소"], ["아무튼, 메모", "정혜윤", "위고"], ["아무튼, 식물", "임이랑", "코난북스"], ["아무튼, 비건", "김한민", "위고"]]},
 {tone:'다른 시선',t:'나는 아니라고 생각했던 것',why:'차별은 나쁜 사람만 하는 일이 아니라는 책들.',sym:'wave',bp:6,pp:4,k:/^$/,sc:c=>3+(c.d%2),fixed:[['선량한 차별주의자','김지혜','창비'],['실격당한 자들을 위한 변론','김원영','사계절'],['사이보그가 되다','김초엽, 김원영','사계절'],['아픔이 길이 되려면','김승섭','동아시아']]},
 {tone:'다른 시선',t:'먹히는 쪽의 이야기',why:'식탁 건너편에서 본 세계. 동물의 자리에서 읽습니다.',sym:'leaf',bp:3,pp:1,k:/^$/,sc:c=>3+((c.d+1)%2),fixed:[['동물 해방','피터 싱어','연암서가'],['고기로 태어나서','한승태','시대의창'],['아무튼, 비건','김한민','위고'],['사향고양이의 눈물을 마시다','이형주','책공장더불어']]},
 {tone:'다른 시선',t:'일의 뒷면',why:'명함에 적히지 않는 노동. 일하는 사람이 직접 쓴 기록.',sym:'pencil',bp:7,pp:5,k:/^$/,sc:c=>2+(c.d%3),fixed:[['임계장 이야기','조정진','후마니타스'],['노동의 배신','바버라 에런라이크','부키'],['까대기','이종철','보리'],['일하는 마음','제현주','어크로스']]},
 {tone:'다른 시선',t:'뜨거워지는 중',why:'날씨가 아니라 기후. 겨울에 읽는 더운 이야기.',sym:'sun',bp:5,pp:3,k:/^$/,sc:c=>2+((c.d+1)%3),fixed:[['침묵의 봄','레이첼 카슨','에코리브르'],['파란하늘 빨간지구','조천호','동아시아'],['2050 거주불능 지구','데이비드 월러스 웰즈','추수밭'],['두 번째 지구는 없다','타일러 라쉬','알에이치코리아']]},
 {tone:'다른 시선',t:'보는 법을 다시 배우기',why:'그림을 설명하지 않고, 보는 일 자체를 묻는 책.',sym:'star',bp:4,pp:5,k:/^$/,sc:c=>2+((c.d+2)%3),fixed:[['다른 방식으로 보기','존 버거','열화당'],['사진에 관하여','수전 손택','이후'],['예술하는 습관','메이슨 커리','걷는나무']]},
 {tone:'다른 시선',t:'제목에 색이 묻은 책',why:'표지가 아니라 제목의 색으로 골랐습니다. 빨강 옆에 녹색.',sym:'drop',bp:2,pp:6,k:/빨강|녹색|초록|파랑|푸른|붉은|검은|검정|하얀|흰|노랑|보라|회색|색/,sc:c=>2+(c.d%3)},
 {tone:'다른 시선',t:'건물이 제목인 책',why:'성당, 미술관, 영화관. 들어가 본 적 없는 건물로 들어갑니다.',sym:'house',bp:3,pp:5,k:/성당|미술관|영화관|도서관|서점|책방|학교|호텔|집$|의집|방$/,sc:c=>2+((c.d+1)%3)},
 {tone:'다른 시선',t:'잘 안 된 사람들',why:'실격, 모순, 고독. 실패한 쪽의 이야기가 더 오래 갑니다.',sym:'candle',bp:7,pp:5,k:/실격|모순|고독|이방인|가벼움|몰락|패배|은둔|절벽/,sc:c=>2+((c.d+2)%3)},
 {tone:'다른 시선',t:'혼자서도 시끄러운',why:'조용한 사람들의 머릿속은 대개 소란합니다.',sym:'wave',bp:6,pp:4,k:/혼자|고독|시끄러운|홀로|침묵|조용/,sc:c=>1+(c.d%4)},
 {tone:'다른 시선',t:'달리는 사람, 앉은 사람',why:'몸을 쓰는 책과 가만히 있는 책을 한자리에.',sym:'walk',bp:5,pp:0,k:/달리기|걷기|산책|앉|누워|초월|싯다르타|명상|요가/,sc:c=>1+((c.d+1)%4)},
 {tone:'말놀이',t:'ㅅ으로 시작하는 책',why:'까닭은 없습니다. 싯다르타, 사랑, 슬로, 서울. 소리 내어 읽어 보세요.',sym:'star',bp:1,pp:3,k:/^(싯|사랑|슬로|서울|새|생명|세네카|숲|시|소|수|섬)/,sc:c=>1+((c.d+2)%4)},
 {t:'긴 밤에는, 긴 소설',why:'해가 다섯 시면 집니다. 두꺼운 소설 한 권으로 건너는 밤.',sym:'moon',bp:0,pp:2,k:/가호|프로젝트헤일메리|참을수없는존재|급류|천개의문|너무시끄러운고독|소년이온다|검은사슴|녹색절벽|어두운방에서/,sc:c=>[11,12,1].includes(c.m)?5:0},
 {t:'문제집을 치운 자리에',why:'수능이 끝난 책상에 처음 놓는 책. 얇고, 오래 남는 것으로.',sym:'pencil',bp:1,pp:0,k:/데미안|싯다르타|인간실격|이방인|동물농장|모순|이처럼사소한것들/,sc:c=>c.sn>=-10&&c.sn<=14?7:0},
 {t:'비 오는 날은, 시집이 얇아서',why:'우산을 접고 서서 읽기 좋은 두께.',sym:'rain',bp:5,pp:4,k:/시인선|시선|마음챙김의시|캔버스에유채|슬픔이택배로|당신의이름을지어다가|오래된거리처럼|함께장마를|꽃샘바람|그대가곁에있어도|나도꽃인데/,sc:c=>c.wx&&c.wx.rain?9:[6,7].includes(c.m)?3:1},
 {t:'첫눈을 기다리는 책',why:'눈이 오면 꺼내려고 미리 사 두는 책.',sym:'snow',bp:3,pp:4,k:/눈내리는|계절의손잡이|바람이분다가라|긴긴밤|이처럼사소한것들|그랬다고적었다|떠난것은돌아오지/,sc:c=>c.wx&&c.wx.snow?9:(c.wx&&c.wx.temp<=2)||c.m===12?5:c.m===11?3:0},
 {t:'작아서, 주머니에',why:'선물 고르는 철. 손바닥만 한 책이 제일 먼저 나갑니다.',sym:'star',bp:2,pp:3,k:/미니북|미니미니|키링|미니\)/,sc:c=>[11,12].includes(c.m)?4:1},
 {t:'따뜻한 것을 마시며, 철학',why:'추운 날은 문장이 짧은 철학이 잘 넘어갑니다.',sym:'cup',bp:1,pp:0,k:/니체|쇼펜하우어|세네카|군주론|사랑의기술|짧은철학|삶을사랑하는가|1분철학|초역부처/,sc:c=>c.wx&&c.wx.temp<=8?6:[11,12,1,2].includes(c.m)?4:1},
 {t:'나무는 겨울에 무엇을 하나',why:'잎이 진 북한산 자락에서 읽는 숲 이야기.',sym:'leaf',bp:3,pp:1,k:/나무들의비밀|버려진섬들|생명이있는것은|새나들이도감|서로를통해존재|숲은|식물/,sc:c=>[10,11].includes(c.m)?4:c.m===12?2:1},
 {t:'천천히 보는 연습',why:'한 장면 앞에 오래 서 있는 법에 관한 책.',sym:'sun',bp:4,pp:1,k:/다른방식으로보기|슬로루킹|미술관에간할미|키아로스타미|혼자영화관에|예술을해도될까|그림이나에게|현대미술관/,sc:c=>c.movie?6:2},
 {t:'걷기 좋은 추위',why:'맑고 찬 날. 걷다가 들어온 손님에게 건네는 책.',sym:'walk',bp:6,pp:4,k:/걷기의인문학|달리기를말할때|서울문학기행|서울의자서전|국수의맛|위스키라고한다면/,sc:c=>c.wx&&c.wx.clear&&c.wx.temp<=12?6:[10,11,3,4].includes(c.m)?3:1},
 {t:'한 해를 접으며',why:'올해 밑줄 그은 말들을 다시 읽는 자리.',sym:'candle',bp:7,pp:2,k:/박완서의낱말들|오래곁에두어좋은말|스물다섯번의계절|마음의어휘력|아버지의해방일지|내안의어린아이/,sc:c=>c.m===12&&c.d>=10?8:c.m===12?4:c.m===11&&c.d>=20?2:0}];
function pool(br){const m=new Map(),add=(b,src)=>{if(!b.t||!sellable(b))return;const k=b.isbn||nt(b.t),o=m.get(k)||{t:b.t,a:b.a||'',p:b.p||'',isbn:b.isbn||'',price:b.price||0,cat:b.cat||'',here:0,sold:0,from:''};if(src===br){o.here=b.stock||0;o.mine=b.sold30||0}else if(BR.some(x=>x.k===src)&&(b.sold30||0)>o.sold){o.sold=b.sold30;o.from=src}if(!o.a&&b.a)o.a=b.a;if(!o.p&&b.p)o.p=b.p;m.set(k,o)};
  BR.forEach(b=>items(b.k).forEach(x=>add(x,b.k)));const R=window.RECS||{new:{},steady:{}};['new','steady'].forEach(kd=>Object.values(R[kd]).flat().forEach(b=>add(b,kd)));['yes24','aladin'].forEach(s=>((window.BOOKS||{})[s]||[]).forEach(b=>add(b,'rank')));return[...m.values()]}
const bookWhy=b=>b.here>0?`매장에 ${b.here}권`:b.from?`${brN(b.from)}에서 30일 ${b.sold}권`:'들여놓기';
function corners(br){const X=recs(br),P=X.P,[g1,g2]=P.order,pl=pool(br),sd=(()=>{const d=new Date(+TODAY.slice(0,4),10,1);let th=0;while(th<3){if(d.getDay()===4)th++;if(th<3)d.setDate(d.getDate()+1)}return dstr(d)})();
  const ctx={m:+TODAY.slice(5,7),d:+TODAY.slice(8),wx:S.wx||null,sn:dayDiff(TODAY,sd),movie:S.db.events.some(e=>e.kind==='영화'&&dayDiff(e.date,TODAY)>=0&&dayDiff(e.date,TODAY)<=7)&&br==='aka'};
  const role=(b,i)=>i===0?'중심':(b.mine||0)>=3?'잘 나가는':(b.here>0||b.src==='재고')?'곁들임':b.from?'다른 지점 인기':'새로 들일',until=o=>{const d=pd(TODAY);d.setDate(d.getDate()+(o.days||14));return dstr(d)};
  const mk=(o,books)=>({tone:o.tone||'제철',title:o.t,hook:o.why,sym:o.sym,bpal:o.bp,ppal:o.pp,until:until(o),place:o.place||(o.sym==='star'?'계산대 옆':'입구 평대'),books:books.filter((b,i,a)=>a.findIndex(z=>nt(z.t)===nt(b.t))===i).slice(0,8).map((b,i)=>({...b,role:role(b,i)})),pop:{head:o.t.replace(/,\s*/,',\n'),body:o.why},band:o.t,br});
  const L=BANK.map(o=>({o,s:o.sc(ctx)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).map(({o})=>mk(o,o.fixed?FXB(o.fixed,pl):pl.filter(b=>o.k.test(b.t.replace(/\s/g,''))).sort((a,b)=>(b.here>0)-(a.here>0)||(b.mine||0)+b.sold-(a.mine||0)-a.sold).map(b=>({...b,why:bookWhy(b),src:b.here>0?'재고':'들여놓기'})))).filter(c=>c.books.length>=3).slice(0,48);
  if(Math.abs(dayDiff(TODAY,TODAY.slice(0,4)+'-11-11'))<=3)L.unshift(mk({t:'오늘은, 서점의 날',why:'11월 11일. 이 책방에서 가장 많이 집어 간 책들.',sym:'book',bp:4,pp:1},P.tops.filter(x=>x.stock>0&&sellable(x)).map(x=>({t:x.t,a:x.a,p:x.p,isbn:x.isbn,price:x.price,why:`30일 ${x.sold30}권`,src:'재고'}))));
  const own=g=>P.tops.filter(x=>grp(x.cat)===g&&x.stock>0&&sellable(x)).slice(0,3).map(x=>({t:x.t,a:x.a,p:x.p,isbn:x.isbn,price:x.price,why:`매장에서 30일 ${x.sold30}권`,src:'재고'}));
  const D=[mk({t:'지금 막 나온 책',why:`${ctx.m}월의 새 책. ${g1} · ${g2} 쪽으로.`,sym:'drop',bp:6,pp:4,place:'입구 앞 평대'},X.nw),
   mk({t:`오래 사랑받는 ${g1}`,why:`이 지점 매출의 ${Math.round(P.sh[g1]*100)}%. 잘 나가는 책 옆에 아직 없는 스테디셀러.`,sym:'star',bp:1,pp:0,place:'눈높이 서가'},[...own(g1),...X.st.filter(b=>RC[b.cat]===g1)]),
   mk({t:'다른 더숲이 먼저 알아본 책',why:'다른 지점에서 팔리는데 여기엔 없는 책.',sym:'walk',bp:3,pp:1,place:'면진열대'},X.cross)].filter(c=>c.books.length>=2);
  return{time:L,data:D,all:[...L,...D],X}}
const isbnChip=b=>b.isbn?`<button class="chip num" data-a="cp" data-t="${b.isbn}" data-tip="누르면 ISBN 이 복사됩니다">${b.isbn}</button>`:'';
const symSVG=(key,pal)=>{const P=BANDC[pal]||BANDC[1];return `<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" style="flex:none"><rect width="64" height="64" rx="14" fill="${P.a}"/><circle cx="32" cy="32" r="21" fill="${P.ac}" opacity=".25"/><path d="${ICON[key]||''}" transform="translate(14 14) scale(1.5)" fill="none" stroke="${P.fg}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
V.store.cur=()=>{const br=S.br;if(S.solo)loadWx();
  if(br==='all')return `<div class="hero"><p>${hooks(1).season}</p><h2>지점 선택</h2></div>
   <div class="grid g4">${BR.map(b=>{const P=profile(b.k);return `<button class="card pick" data-a="br" data-k="${b.k}" style="border-top:4px solid ${b.c}"><b>${NM(b.k)?'노원문고 ':''}${BRAND[b.k]}</b><small>${b.n} · ${P.amt?`${P.order[0]} ${Math.round(P.sh[P.order[0]]*100)}%`:'자료 없음'}</small></button>`}).join('')}</div>`;
  const C=corners(br),X=C.X,P=X.P;C.data.forEach(t=>t.tone='꾸준한');const TN=S.ui.cTone||'전체',pick=t=>TN==='전체'||t.tone===TN;S.ui.cor=C.all;const hk=hooks(21).list.filter(h=>!h.ev).slice(0,2).map(h=>`${h.label.replace(/\(.*?\)/g,'')} ${dday(h.date)}`);
  const lackN=t=>t.books.slice(0,5).filter(b=>b.src!=='재고').length,thumb=(t,i)=>{try{return `<button class="pthumb" data-a="toDesign" data-kind="pop" data-s="c" data-i="${i}" aria-label="POP 미리보기">${toSVG(layout(mkD({...t,br},'pop')))}</button>`}catch(e){return symSVG(t.sym,t.bpal)}};
  const card=(t,i)=>`<div class="card pcard"><div class="phead">${thumb(t,i)}<div><h3>${esc(t.title)}</h3><p>${esc(t.hook)}</p></div></div>
    <p class="cmeta"><span>${esc(t.place||'입구 평대')}</span><span>${t.until?mdw(t.until)+'까지':'2주'}</span><span>${dpPlan(t,0).total}권</span></p>
    <ul class="blist">${t.books.slice(0,5).map((b,n)=>`<li><span><i class="no">${n+1}</i>${esc(b.t)}<small>${esc(b.a||'')}</small>${b.role&&b.role!=='곁들임'?`<small class="role">${b.role}</small>`:''}</span><em class="${b.src==='재고'?'in':''}">${b.src==='재고'?'있음':'?'}</em></li>`).join('')}</ul>
    ${S.ui.cStn?`<ul class="stn">${stnFor(t).map(x=>`<li><b>${x.b} ${x.n}</b><small>${x.w}</small></li>`).join('')}</ul>`:''}
    <details class="fold cnote"><summary>기획 메모</summary><ul><li><b>왜 지금</b> ${esc(t.hook||'')}</li><li><b>중심 책</b> 『${esc((t.books[0]||{}).t||'')}』 — 가장 잘 보이는 자리에 가장 많이.</li><li><b>번호</b> 책 앞의 번호가 진열 자리 · 책 목록의 번호와 같습니다.</li><li><b>바꿀 때</b> ${t.until?mdw(t.until):''}까지 두고, 그 사이 3권도 안 나간 책은 다른 책으로 바꿉니다.</li></ul></details>
    <div class="btns"><button class="btn pri" data-a="toDesign" data-kind="pop" data-s="c" data-i="${i}">POP 만들기</button><button class="btn" data-a="dpOpen" data-i="${i}">진열 보기</button>
     <details class="menu"><summary>기타</summary><div><button data-a="toDesign" data-kind="band" data-s="c" data-i="${i}">띠지</button><button data-a="toDesign" data-kind="list" data-s="c" data-i="${i}">책 목록 A4</button><button data-a="toDesign" data-kind="card" data-s="c" data-i="${i}">쇼카드 (6장)</button><button data-a="curKit" data-i="${i}">전체 다운로드 (POP · 띠지 · 목록 · 쇼카드)</button><button data-a="curOrder" data-s="c" data-i="${i}">미보유 도서 주문 담기${lackN(t)?` (${lackN(t)}종)`:''}</button><button data-a="go" data-v="club">책모임으로 열기</button><button data-a="corFix" data-i="${i}">공간 매대에 넣기</button></div></details></div></div>`;
  const row=(b,k,i)=>`<div class="li"><div class="t"><b style="font-weight:600">${esc(b.t)}</b><small>${esc([b.a,b.p,b.why].filter(Boolean).join(' · '))}</small></div>${isbnChip(b)}<button class="btn sm" data-a="recAdd" data-k="${k}" data-i="${i}">담기</button></div>`;
  return `<div class="hero"><p>${[brN(br),mdw(TODAY),...hk].filter(Boolean).join(' · ')}</p><h2>이번 주 큐레이션</h2></div>
  <div class="subnav" role="tablist">${['전체','제철','다른 시선','말놀이','꾸준한'].map(t=>`<button data-a="cTone" data-t="${t}" aria-pressed="${TN===t}">${t}</button>`).join('')}<button class="stnb" data-a="cStn" aria-pressed="${!!S.ui.cStn}">문구와 함께</button></div>
  <div class="grid g2" style="align-items:start">${C.all.map((t,i)=>[t,i]).filter(([t])=>pick(t)).slice(0,S.ui.cMore?40:6).map(([t,i])=>card(t,i)).join('')||'<div class="card empty">지금 때에 맞는 제안이 없습니다.</div>'}</div>
  ${C.all.filter(pick).length>6?`<div class="btns" style="justify-content:center;margin-top:14px"><button class="btn ghost" data-a="cMore">${S.ui.cMore?'접기':`더 보기`}</button></div>`:''}
  <details class="fold" data-o="c1" ${S.ui.o_c1?'open':''}><summary>늘 두는 코너 <small>새 책 · 스테디셀러 · 다른 지점에서 팔리는 책</small></summary><div class="grid g2" style="align-items:start;margin-top:14px">${C.data.map((t,i)=>card(t,C.time.length+i)).join('')}</div></details>
  <details class="fold" data-o="c2" ${S.ui.o_c2?'open':''}><summary>이 지점의 성격 <small>${P.order[0]} ${Math.round(P.sh[P.order[0]]*100)}% · ${P.order[1]} ${Math.round(P.sh[P.order[1]]*100)}%</small></summary><div class="grid g2" style="margin-top:14px"><div class="card"><ul style="margin:0;padding-left:18px;display:grid;gap:6px">${profText(br,P).map(t=>`<li>${t}</li>`).join('')}</ul></div>
   <div class="card"><h3>분야 비중 <small>이 지점 / 다른 지점 평균</small></h3>${GR.map(g=>hbar(g,P.sh[g],Math.max(...GR.map(x=>P.sh[x]),.01),`${Math.round(P.sh[g]*100)}% <small style="color:var(--muted)">/ ${Math.round(P.avg[g]*100)}%</small>`,brC(br),`${g} · 이 지점 ${Math.round(P.sh[g]*100)}% · 다른 지점 평균 ${Math.round(P.avg[g]*100)}%`)).join('')}</div></div></details>
  <details class="fold" data-o="c3" ${S.ui.o_c3?'open':''}><summary>들여놓을 책 <small>신간 ${X.nw.length} · 스테디셀러 ${X.st.length} · 다른 지점 ${X.cross.length}</small></summary><div class="grid g3" style="align-items:start;margin-top:14px"><div class="card"><h3>신간</h3><div class="list">${X.nw.map((b,i)=>row(b,'nw',i)).join('')||'<div class="empty">없음</div>'}</div></div>
   <div class="card"><h3>스테디셀러</h3><div class="list">${X.st.map((b,i)=>row(b,'st',i)).join('')||'<div class="empty">없음</div>'}</div></div>
   <div class="card"><h3>다른 지점에서 팔리는 책</h3><div class="list">${X.cross.map((b,i)=>row(b,'cross',i)).join('')||'<div class="empty">없음</div>'}</div></div></div>
   <p class="note" style="margin-top:10px">품절 · 절판 제외(예스24 ${esc(window.SOLD_AT||'')}). 재고는 많이 팔린 30종만 압니다.</p></details>`};
A.recAdd=d=>{const b=recs(S.br)[d.k][+d.i];if(b&&addCart(S.br,b,2,b.why))toast('북센 주문에 담았습니다')};
A.corFix=d=>{const t=S.ui.cor[+d.i];let done='';planMut(p=>{if(p.starter)delete p.starter;const f=p.fx.find(x=>['table','face','shelf'].includes(x.type)&&!x.theme);if(f){f.theme=t.title;done=f.label||FX[f.type].n}},true).then(()=>toast(done?`「${done}」에 넣었습니다. 「공간」에서 볼 수 있습니다.`:'주제가 비어 있는 매대가 없습니다. 「공간」에서 매대를 넣어 주세요.'))};

A.cMore=()=>{S.ui.cMore=!S.ui.cMore;render()};
A.curKit=async d=>{const t=S.ui.cor[+d.i],keep=S.ui.D;for(const k of ['pop','band','list','card']){S.ui.D=mkD({...t,br:t.br||S.br},k);await A.dPdf()}S.ui.D=keep;toast('POP · 띠지 · 책 목록 · 쇼카드 PDF 네 장을 받았습니다')};

A.cTone=d=>{S.ui.cTone=d.t;S.ui.cMore=false;render()};

function FXB(L,pl){return L.map(([t,a,p])=>{const h=pl.find(b=>nt(b.t)===nt(t));return h?{...h,why:bookWhy(h),src:h.here>0?'재고':'들여놓기'}:{t,a,p,isbn:'',price:0,here:0,sold:0,why:'판매 상태 확인 전',src:'들여놓기'}})}

/* 책 곁에 놓을 문구 — 주제·결에 맞춰 고른다. 입점·거래 조건은 확인 전. */
const STN=[
 {b:'블랙윙',n:'602 연필',w:'밑줄과 필사에. 책 옆에 한 자루씩 낱개로.',k:/필사|문장|말|번역|시|방|쓰/},
 {b:'미도리',n:'MD 노트',w:'여백이 넓은 종이. 옮겨 적는 독자에게.',k:/필사|문장|말|읽|방|끝|아픈/},
 {b:'로이텀',n:'1917 노트',w:'쪽 번호와 차례가 있어 독서 기록에 맞습니다.',k:/질문|숫자|과학|이름|기록|일의/},
 {b:'트래블러스 컴퍼니',n:'트래블러스 노트',w:'들고 걷는 노트. 길 위에서 쓰는 사람에게.',k:/걷|국경|여행|도시|산|숲|나무/},
 {b:'카웨코',n:'스포츠 만년필',w:'주머니에 들어가는 만년필. 선물용으로 책과 묶기 좋습니다.',k:/걷|국경|선물|방|책방/},
 {b:'라미',n:'사파리 만년필',w:'처음 쓰는 만년필. 연말 선물 꾸러미에.',k:/선물|겨울|방|말|책방|질문/},
 {b:'스테들러',n:'마스 루모그래프 연필',w:'그리는 연필. 보는 법을 다루는 책 옆에.',k:/보는|예술|그림|사진|색|건물/},
 {b:'파버카스텔',n:'카스텔 9000 연필',w:'나무와 흑연. 숲과 식물 책 곁에 어울립니다.',k:/나무|숲|식물|뜨거|기후|먹히/},
 {b:'북다트',n:'금속 책갈피 클립',w:'접지 않고 줄을 표시합니다. 어느 주제에나.',k:/./},
 {b:'스탈로지',n:'반투명 메모지',w:'글자를 가리지 않는 메모지. 밑줄 대신 붙입니다.',k:/./},
 {b:'모나미',n:'153 볼펜',w:'가장 흔한 펜. 일과 노동을 다루는 책 옆에 일부러.',k:/일의|노동|숫자|차별|아니라고/},
 {b:'호보니치',n:'테쵸 다이어리',w:'하루 한 쪽. 연말·새해 평대에.',k:/겨울|새해|아무튼|하루/}];
function stnFor(t){const s=(t.title||'')+' '+(t.hook||''),sp=STN.filter(x=>x.k.source!=='.'&&x.k.test(s)),ge=STN.filter(x=>x.k.source==='.');return [...sp,...ge].slice(0,3)}
A.cStn=()=>{S.ui.cStn=!S.ui.cStn;render()};
