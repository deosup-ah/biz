/* 더숲 워크룸 — 도움말 「AI 에이전트」 에이전트 (11/12 밤)
   말로 시키면 이 앱 안에서 직접 해 줍니다: 화면 열기 · 지점 바꾸기 · 진열 · 추천 배치 · 인쇄물 · 인스타 · 한 번에 받기 · 단어로 큐레이션 · 서점 기초 찾기 · 단계 안내.
   Claude 안에서는 AI 가 뜻을 읽고, 공개 주소에서는 앱 안의 규칙으로 읽습니다(둘 다 따로 돈이 들지 않음). 매출 · 주문 같은 숨긴 화면과 바깥 시스템(이지정보 · 북센)에는 손대지 않습니다. */

const AGBR=[['aka',/아카|아카데미|사유의\s*숲|본관/],['nowon',/노원\s*더숲|노원(?!\s*문고)/],['choso',/초소/],['sojeon',/소전|시흥/],['nmain',/본점/],['njung',/중계/]];
const AGSUG=['가득 채우는 진열 보여줘','겨울로 큐레이션 만들어줘','이번 주 첫 번째 주제로 인스타 피드','POP 만들기','반품은 어떻게 해?','2단계는 어떻게 올라가?'];
const agLog=()=>S.ui.agL=S.ui.agL||[{who:'ai',t:'AI 에이전트는 답만 하지 않고, 시키면 이 앱 안에서 직접 합니다. 화면을 열고, 진열을 놓고, POP과 인스타 이미지를 만듭니다.\n예: 「노원 큐레이션에서 가득 채우는 진열 보여줘」'}];
A.agOpen=()=>{if(A.gdClose)A.gdClose();agDraw();setTimeout(()=>{const i=$('agIn');if(i)i.focus()},50)};
A.agClose=()=>{const g=$('agent');if(g)g.remove()};
A.agSug=d=>{const i=$('agIn');if(i)i.value=d.t;A.agSend()};
A.agDo=d=>{try{agRun(JSON.parse(d.j))}catch(e){}};
function agDraw(busy){let g=$('agent');if(!g){g=document.createElement('div');g.id='agent';document.body.append(g)}const L=agLog();
  g.innerHTML=`<div class="agb"><div class="agh"><div><b>AI 에이전트</b><small>시키면 앱에서 직접 해 주는 도구</small></div><button class="agx" data-a="agClose">닫기 ✕</button></div>
   <div class="agm" id="agM">${L.map(m=>`<div class="ag-${m.who}"><p>${esc(m.t).replace(/\n/g,'<br>')}</p>${(m.btn||[]).map(b=>`<button class="chip" data-a="agDo" data-j='${esc(JSON.stringify(b.a))}'>${esc(b.n)}</button>`).join('')}</div>`).join('')}${busy?'<div class="ag-ai"><p>생각하는 중…</p></div>':''}</div>
   <div class="ags">${AGSUG.map(t=>`<button class="chip" data-a="agSug" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>
   <div class="agf"><input id="agIn" placeholder="하고 싶은 일을 한 줄로" autocomplete="off" enterkeyhint="send">${typeof micBtn==='function'?micBtn('agIn'):''}<button class="btn pri" data-a="agSend" ${busy?'disabled':''}>보내기</button></div></div>`;
  const m=$('agM');if(m)m.scrollTop=m.scrollHeight}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='agIn'&&!e.isComposing){e.preventDefault();A.agSend()}});
A.agSend=async()=>{const i=$('agIn'),q=(i&&i.value||'').trim();if(!q)return;const L=agLog();L.push({who:'me',t:q});i.value='';agDraw(true);
  let r=null;if(typeof AI!=='undefined'&&AI){try{r=await agAI(q)}catch(e){r=null}}if(!r)r=agLocal(q);
  L.push({who:'ai',t:r.t,btn:r.btn});if(L.length>40)L.splice(1,L.length-40);agDraw();if(r.a&&r.a.length){setTimeout(()=>agRun(r.a),350)}};

/* ── 동작 실행(허용된 것만) ── */
const agTheme=i=>(S.ui.cor||[])[i];
function agRun(acts){let closed=false;const close=()=>{if(!closed){closed=true;A.agClose();A.close&&A.close()}};
  for(const a of acts||[]){try{
    if(a.do==='place'&&AGBR.some(x=>x[0]===a.br)){A.place?A.place({k:a.br}):A.br({k:a.br})}
    else if(a.do==='go'&&navList().some(x=>x[0]===a.view)){close();const n=navList().find(x=>x[0]===a.view);A.go({v:a.view,m:n[2]})}
    else if(a.do==='dp'&&agTheme(a.theme)){close();if(S.view[S.mode]!=='cur')A.go({v:'cur',m:'store'});A.dpOpen({i:a.theme});if(a.rec!=null)setTimeout(()=>A.dpRec({v:a.rec}),200);if(a.video)setTimeout(()=>A.d3rec(),600)}
    else if(a.do==='pop'&&agTheme(a.theme)){close();A.toDesign({kind:['pop','card','band','list'].includes(a.kind)?a.kind:'pop',s:'c',i:String(a.theme)})}
    else if(a.do==='insta'){close();A.igOpen(agTheme(a.theme)?{i:a.theme}:{})}
    else if(a.do==='set'&&agTheme(a.theme)){close();A.setAll({i:a.theme})}
    else if(a.do==='open'&&agTheme(a.theme)){close();if(S.view[S.mode]!=='cur')A.go({v:'cur',m:'store'});S.ui.cOpen=a.theme;render();setTimeout(()=>{const e=document.querySelector('.pcard.on');if(e)e.scrollIntoView({block:'center',behavior:'smooth'})},100)}
    else if(a.do==='make'&&a.word){close();if(S.view[S.mode]!=='cur')A.go({v:'cur',m:'store'});const el=$('gIn');if(el)el.value=String(a.word).slice(0,30);A.gGo({v:String(a.word).slice(0,30)})}
    else if(a.do==='basics'&&BASICS.some(b=>b.id===a.id)){A.agClose();A.gdOpen();A.gdTab({t:'b'});setTimeout(()=>A.bsGo({id:a.id}),120)}
    else if(a.do==='guide'){A.agClose();A.gdOpen()}
    else if(a.do==='pperson'){close();A.pzPerson({who:a.who})}
    else if(a.do==='puzzle'){close();A.pzOpen();const P=S.ui.pz;if(a.lv>=1&&a.lv<=5)P.lv=+a.lv;if(a.th&&PZTH.includes(a.th))P.th=a.th;if(a.age!=null&&PZAGE.some(x=>x[1]===a.age))P.age=a.age;if(a.lv||a.th||a.age!=null){pzNewZ();pzDraw()}}
    else if(a.do==='level'){close();A.lvOpen()}
    else if(a.do==='lastsale'){close();A.lsOpen()}
    else if(a.do==='wordpop'){close();A.wdOpen()}
    else if(a.do==='cmd'&&a.text&&S.ui.dp){const el=$('dpCmd');if(el){el.value=a.text;A.dpCmd()}}
  }catch(e){console.warn(e)}}}

/* ── 공개 주소에서도 되는 규칙 에이전트 ── */
const AGORD={'첫':1,'첫째':1,'한':1,'두':2,'둘째':2,'세':3,'셋째':3,'네':4,'넷째':4,'다섯':5,'여섯':6,'일곱':7,'여덟':8,'아홉':9,'열':10};
const AGSTOP=/^(진열|평대|배치|보여|보여줘|만들|만들어|만들어줘|인스타|피드|큐레이션|주제|해줘|해|줘|좀|이번|이번주|지점|가득|채우|채워|눈에|띄게|무난|무난하게|이야기|포근|영상|릴스|인쇄물|쇼카드|띠지|목록|책|거|것|열어|열어줘|하고|싶어|싶은데|그리고|에서|으로|해볼래|볼래|어떻게|뭐|좀더|더|번째|번)$/;
function agFind(q){const T=S.ui.cor||[];if(!T.length)return -1;const m=q.match(/(\d+)\s*(번째|번|째)/);if(m&&T[+m[1]-1])return +m[1]-1;
  const o=q.match(/(첫|첫째|두|둘째|세|셋째|네|넷째|다섯|여섯|일곱|여덟|아홉|열)\s*(번째|번|째)/);if(o&&T[AGORD[o[1]]-1])return AGORD[o[1]]-1;if(/첫\s*(번째|주제|카드)|맨\s*(위|앞|처음)|제일\s*위/.test(q))return 0;if(/마지막|맨\s*끝|맨\s*아래/.test(q))return T.length-1;
  if(/(이거|이것|그거|지금\s*(거|것|보는))/.test(q)&&S.ui.dp)return S.ui.dp.i;if(/(이거|이것|그거|아까)/.test(q)&&S.ui.cOpen!=null)return S.ui.cOpen;
  const toks=agTok(q).filter(w=>!AGSTOP.test(w));let best=-1,bs=0;T.forEach((t,i)=>{const hay=(t.title+' '+(t.tg||'')+' '+t.tone+' '+t.hook+' '+(t.books||[]).map(b=>b.t+' '+(b.a||'')).join(' ')).replace(/\s/g,'');const s=toks.reduce((a,w)=>a+(hay.includes(w)?(t.title.replace(/\s/g,'').includes(w)?w.length*3:w.length):0),0);if(s>bs){bs=s;best=i}});return bs>=2?best:-1}
const agTok=q=>{const o=[];q.replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).forEach(w=>{const b=w.replace(/(이란|이라는|이야|이에요|예요|에서|으로|이란|란|야|은|는|이|가|을|를|에|의|로|와|과|도|요)$/,'');[w,b].forEach(x=>{if(x.length>=2&&!/어떻게|뭐야|무엇|알려|해줘|하나요|인가요|뭔가요/.test(x))o.push(x)})});return [...new Set(o)]};
function agBasics(q){const toks=agTok(q);let best=null,bs=0;
  BASICS.forEach(b=>{const hay=(b.t+' '+(b.lead||'')+' '+(b.items||[]).map(x=>x.join(' ')).join(' ')).replace(/\s/g,'');const s=toks.reduce((a,w)=>a+(hay.includes(w)?(b.t.includes(w)?w.length*3:w.length):0),0);if(s>bs){bs=s;best=b}});
  if(!best||bs<2)return null;const it=(best.items||[]).find(x=>toks.some(w=>(x[0]+x[1]).includes(w)))||(best.items||[])[0];return{b:best,it}}
function agLocal(q0){const q=q0.replace(/\s+/g,' ').trim(),qs=q.replace(/\s/g,''),acts=[],T=S.ui.cor||[],say=[];const has=re=>re.test(qs);
  if(/^(안녕|하이|ㅎㅇ|hello|hi)/i.test(qs))return{t:'안녕하세요. 무엇을 할까요? 「가득 채우는 진열」, 「겨울 주제로 큐레이션」, 「두 번째 POP」처럼 편하게 말해 주세요.'};
  if(has(/^(고마|감사|땡큐|ㄱㅅ|좋아|좋네|굿|오케이|ok)/i))return{t:'네, 더 필요한 게 있으면 말해 주세요.'};
  if(has(/뭐할수있|뭘할수있|기능|할줄|도와줄|사용법|어떻게써|뭐해|무엇을할/)&&!has(/진열|pop|POP|인스타|피드/))return{t:'이런 걸 직접 합니다.\n· 지점 바꾸기 — 「초소로」\n· 진열 — 「가득 채우게 놔줘」 「눈에 띄게」 「한 바퀴 영상」\n· 인쇄물 — 「두 번째 POP」 「쇼카드」 「띠지」\n· 인스타 — 「피드 만들어줘」\n· 새 큐레이션 — 「겨울 주제로 만들어줘」\n· 서점 기초 — 「도서정가제가 뭐야?」\n· 단계 — 「2단계 어떻게 올라가?」',btn:[{n:'화면 안내 보기',a:[{do:'guide'}]}]};
  const br=AGBR.find(([,re])=>re.test(q));if(br&&br[0]!==S.br){acts.push({do:'place',br:br[0]});say.push(`${brN(br[0])}(으)로 바꿨습니다.`)}
  const W={dp:/진열|평대|배치|매대|디스플레이|놓아|놔|놓기|깔아|3d|입체|돌려|한바퀴|영상|동영상|녹화|릴스영상|가득|꽉|빼곡|빈틈|채워|채우/,pop:/pop|팝|포스터|홍보물|인쇄|출력|프린트|쇼카드|띠지|책목록|목록|리스트|안내문/i,ig:/인스타|피드|sns|게시물|업로드|올릴|올리|캡션|해시태그|스토리|릴스/i,set:/한번에|한꺼번에|전부|다받|모두받|일괄|세트/,make:/만들|짜|추천|골라|뽑아|구성|기획|해줘|해볼래|해봐/,lv:/단계|레벨|승급|등급|열쇠|잠김|잠겨|안열려|왜안돼|못써/,go:/화면|메뉴|페이지|가줘|가자|이동|열어/};
  const hid=has(/매출|주문|반품|지원사업|정산|북센|이지정보|발주|재고조사/);
  if(hid&&!isAdmin()&&!has(W.dp)&&!has(W.pop)&&!has(W.ig)){const bb=agBasics(q);return{t:`매출 · 주문 · 반품 · 지원사업은 지금 테스트 중이라 열 수 없습니다.${has(/반품/)?' 반품은 서가 사진으로 후보를 만들고, 확인한 뒤에만 이지정보에 넣는 방식으로 준비 중입니다.':''}${bb?`\n\n서점 기초 「${bb.b.t}」: ${bb.it?bb.it[1]:bb.b.lead}`:''}`,btn:bb?[{n:`「${bb.b.t}」 자세히`,a:[{do:'basics',id:bb.b.id}]}]:[]}}
  if(has(/마지막\s*판매|최종\s*판매|언제\s*팔|안\s*팔린|반품\s*(할|필요|후보|고르)|오래된\s*재고/)){return{t:'마지막 판매일 확인은 지금 테스트 중입니다. 며칠 안에 열립니다.'}}
  if(has(/말로\s*찾|단어\s*(pop|POP|큐알|QR)|감정\s*(pop|POP)|qr|QR|큐알/)){acts.push({do:'wordpop'});return{t:'「말로 찾는 서가」를 엽니다.',acts}}
  if(has(/퍼즐|가로세로|크로스워드|낱말퀴즈|단어퀴즈|십자말/)&&typeof PZP!=='undefined'){const who=Object.keys(PZP).find(n=>qs.includes(n));if(who||has(/인물/)){acts.push({do:'pperson',who:who||null});return{t:`${say.join(' ')} 인물도서관 퍼즐을 열었습니다.${who?` 「${who}」로 만들었습니다.`:' 인물을 고르세요.'} 단계는 입문 · 보통 · 깊이 세 가지입니다.`.trim(),a:acts}}}
  if(has(/퍼즐|가로세로|크로스워드|낱말퀴즈|단어퀴즈|십자말/)){const m=qs.match(/([1-5])단계|난이도([1-5])/),lv=m?+(m[1]||m[2]):has(/쉬운|쉽게/)?1:has(/어려운|어렵게|전문|고수/)?5:null,th=(PZTH.find(t=>qs.includes(t.replace(/\s|·/g,'').slice(0,2)))||null),age=has(/어린이|아이|초등|꼬마/)?'k':has(/청소년|중학|고등|학생/)?'t':has(/어르신|노인|시니어|할머니|할아버지/)?'s':has(/어른|성인/)?'a':null;acts.push({do:'puzzle',lv,th,age});return{t:`${say.join(' ')} 「가로세로 숲」 퍼즐을 열었습니다.${lv?` 난이도 ${lv}단계로 만들었습니다.`:''} 지점 이름 · 형태를 고르고 저장하거나 PDF로 인쇄하세요.`.trim(),a:acts}}
  if(has(W.lv)){const L=lvNow();acts.push({do:'level'});return{t:`${say.join(' ')} 지금 ${L}단계 「${LVN[L]}」입니다.${L<3?` 큐레이션 · 인쇄물 · 진열안을 쓸수록 ${L+1}단계 조건이 채워지고, 다 채우면 신청 카드를 참부장께 보내면 열쇠를 받습니다.`:''} 단계 화면을 열었습니다.`.trim(),a:acts}}
  const ti=agFind(q),pickT=()=>ti>=0?ti:(S.ui.dp?S.ui.dp.i:(S.ui.cOpen!=null?S.ui.cOpen:0)),tt=i=>T[i]?`「${T[i].title}」`:'';
  /* 새 큐레이션 단어 뽑기: 「겨울」, 겨울 주제로, 겨울 관련 책, 겨울 느낌으로, 겨울로 만들어줘 */
  const quoted=(q.match(/[「『"'“‘](.+?)[」』"'”’]/)||[])[1];
  const pat=q.match(/^(.{1,14}?)\s*(?:을|를|으로|로|에\s*대한|에\s*관한|관련|느낌|분위기|테마|주제|키워드)\s*(?:으로|로)?\s*(?:된|한|의)?\s*(?:큐레이션|주제|평대|책|추천|만들|짜|골라|기획|구성)/);
  let word=(quoted||(pat&&pat[1])||'').replace(/^(이번주|이번|새로|새|좀)\s*/,'').trim();if(word&&(AGSTOP.test(word)||AGBR.some(([,re])=>re.test(word))))word='';
  if(word&&(has(W.make)||quoted)&&!has(W.dp)&&!has(W.pop)&&!has(W.ig)&&(ti<0||pat||quoted)){acts.push({do:'make',word});return{t:`${say.join(' ')} 「${word}」(으)로 큐레이션을 만들었습니다. 맨 앞 카드입니다.`.trim(),a:acts}}
  if(has(W.set)&&!has(/영상/)){const i=pickT();if(T[i]){acts.push({do:'set',theme:i});return{t:`${say.join(' ')} ${tt(i)} 인쇄물 PDF와 인스타 이미지를 한 번에 받는 창을 열었습니다. 필요 없는 건 눌러서 빼세요.`.trim(),a:acts}}}
  if(has(W.ig)&&!has(/진열|평대|영상/)){const i=ti>=0?ti:null;acts.push({do:'insta',theme:i});return{t:`${say.join(' ')} ${i!=null?tt(i)+'(으)로 ':''}인스타 피드 만들기를 열었습니다. 사진을 넣고 「피드 만들기」를 누르세요. 사진 없이도 표지가 나옵니다.`.trim(),a:acts}}
  if(has(W.pop)){const i=pickT(),k=has(/쇼카드/)?'card':has(/띠지/)?'band':has(/목록|리스트/)?'list':'pop',KN={pop:'POP',card:'쇼카드',band:'띠지',list:'책 목록'};if(T[i]){acts.push({do:'pop',theme:i,kind:k});return{t:`${say.join(' ')} ${tt(i)} ${KN[k]}를 열었습니다. 느낌을 고르고 PDF · PNG로 받으면 됩니다. 문구는 「글 · 색 · 크기 고치기」에서 말로도 바꿀 수 있습니다.`.trim(),a:acts}}}
  if(has(W.dp)){const i=pickT(),rec=has(/가득|꽉|빼곡|빈틈|많이|풍성|채워|채우/)?3:has(/눈에|돋보|강조|임팩트|크게|메인|확/)?1:has(/이야기|감성|포근|따뜻|분위기|아기자기|사랑스|예쁘/)?2:has(/무난|기본|평범|깔끔|심플|재고/)?0:null,vid=has(/영상|동영상|녹화|릴스|한바퀴|돌려/);
    if(T[i]){acts.push({do:'dp',theme:i,rec,video:vid});return{t:`${say.join(' ')} ${tt(i)} 진열을 열었습니다.${rec!=null?` 「${DPREC[rec][0]}」로 놓았습니다.`:' 맨 위 추천 배치 네 가지 중 하나를 누르면 알아서 놓습니다.'}${vid?' 영상 크기(릴스 · 피드)를 고르면 한 바퀴 돌며 저장합니다.':' 책을 끌어 옮기거나, 「3번 맨 앞으로」처럼 말로도 옮깁니다.'}`.trim(),a:acts}}}
  if(has(W.go)||has(/공간|인물도서관|씨앗숲|사이서가|만들기|홍보|큐레이션/)){const v=has(/공간|인물도서관|씨앗숲|사이서가/)?'space':has(/만들기/)?'design':has(/홍보/)?'insta':has(/큐레이션/)&&ti<0?'cur':null;
    if(v&&!navList().some(x=>x[0]===v)&&(v==='space'||v==='insta')&&S.br!=='aka'){acts.push({do:'place',br:'aka'});say.push('아카데미로 바꿨습니다.')}
    const VN={space:'공간',design:'만들기',insta:'홍보',cur:'큐레이션'};if(v&&(navList().some(x=>x[0]===v)||acts.some(x=>x.do==='place'&&x.br==='aka'))){acts.push({do:'go',view:v});return{t:`${say.join(' ')} ${VN[v]} 화면을 열었습니다.`.trim(),a:acts}}}
  if(ti>=0){acts.push({do:'open',theme:ti});return{t:`${say.join(' ')} ${tt(ti)} 카드를 열었습니다. 진열 → 인쇄물 → 인스타 순서로 누르면 됩니다.`.trim(),a:acts}}
  const bb=agBasics(q);if(bb)return{t:`${say.join(' ')}\n서점 기초 「${bb.b.t}」에서 찾았습니다.\n${bb.it?bb.it[0]+' — '+bb.it[1]:bb.b.lead}`.trim(),btn:[{n:`「${bb.b.t}」 펼쳐 보기`,a:[{do:'basics',id:bb.b.id}]}],a:acts};
  if(acts.length)return{t:say.join(' ')+' 이어서 무엇을 할까요?',a:acts};
  const w2=(word||agTok(q).filter(w=>!AGSTOP.test(w))[0]||'').slice(0,12);
  return{t:`정확히 알아듣지 못했습니다.${w2?` 「${w2}」(으)로 큐레이션을 만들까요?`:''}\n이렇게도 말할 수 있어요: 「가득 채우는 진열」 「두 번째 POP」 「피드 만들어줘」 「초소로 바꿔」`,btn:w2?[{n:`「${w2}」 큐레이션 만들기`,a:[{do:'make',word:w2}]}]:[]}}

/* ── Claude 안에서는 AI 가 뜻을 읽고 같은 동작을 고릅니다 ── */
async function agAI(q){const T=(S.ui.cor||[]).slice(0,20).map((t,i)=>`${i}: ${t.title} — ${t.hook}`).join('\n'),L=agLog().slice(-6).map(m=>`${m.who==='me'?'사용자':'에이전트'}: ${m.t}`).join('\n');
  const out=await AI.json(`당신은 「더숲 워크룸」 앱 전용 AI 에이전트입니다. 서점 직원의 말을 듣고 앱 안의 동작을 골라 직접 실행하고, 짧게 답합니다.
앱: 큐레이션(이번 주 주제 카드 → 진열 3D · 인쇄물 POP/쇼카드/띠지/책 목록 · 인스타 피드) · 만들기 · 공간 · 홍보. 진열 추천 배치 0 무난하게 1 눈에 띄게 2 이야기 있게 3 가득 채우기. 매출 · 주문 · 반품 · 지원사업은 테스트 중이라 직원에게 열리지 않음${isAdmin()?'(지금 사용자는 관리자)':''}. 이지정보 · 북센에는 절대 쓰지 않음. 단계: 1 책 고르는 사람 2 코너 큐레이터 3 공간 기획자(쓸수록 열림).
지금: 지점 ${brN(S.br)}, 화면 ${S.view[S.mode]}, 단계 ${lvNow()}.
지점 코드: aka(아카데미·사유의숲) nowon(노원더숲) choso(초소) sojeon(소전·시흥) nmain(노원문고 본점) njung(중계점).
이번 주 큐레이션(번호: 제목 — 한 줄):
${T}
서점 기초 장: ${BASICS.map(b=>b.id+'='+b.t).join(', ')}
최근 대화:
${L}
사용자: ${q}

허용 동작(필요한 것만, 순서대로):
{"do":"place","br":"코드"} {"do":"go","view":"cur|design|space|insta"} {"do":"open","theme":번호} {"do":"dp","theme":번호,"rec":0~3 또는 null,"video":false} {"do":"pop","theme":번호,"kind":"pop|card|band|list"} {"do":"insta","theme":번호 또는 null} {"do":"set","theme":번호} {"do":"make","word":"단어"} {"do":"basics","id":"장 id"} {"do":"guide"} {"do":"level"} {"do":"puzzle","lv":1~5 또는 null,"th":"책과 서점|소설|수필|과학|철학|시|명문장|영화와 책|동화 · 그림책|섞어서","age":"|k|t|a|s"} {"do":"cmd","text":"진열 말 명령(진열 화면이 열려 있을 때)"}
답은 존댓말로 2~4문장, 무엇을 했는지와 다음에 누를 것. 모르는 사실은 지어내지 않습니다. 앱 밖 질문(서점 일반 지식)은 짧게 답하고, 서점 기초 장이 맞으면 basics 버튼을 붙입니다.
JSON 으로만: {"t":"답","a":[동작],"btn":[{"n":"버튼 이름","a":[동작]}]}`,{cache:false});
  if(!out||!out.t)return null;const ok=x=>x&&typeof x.do==='string';return{t:String(out.t),a:(out.a||[]).filter(ok).slice(0,4),btn:(out.btn||[]).filter(b=>b&&b.n&&Array.isArray(b.a)).slice(0,3).map(b=>({n:String(b.n).slice(0,20),a:b.a.filter(ok).slice(0,3)}))}}

/* ── 도움말에 「AI 에이전트」 탭 ── */
(()=>{const g=gdDraw;gdDraw=function(){g.apply(this,arguments);try{const G=$('guide');if(!G)return;const t=G.querySelector('.gdtab');if(t&&!t.querySelector('[data-a="agOpen"]'))t.insertAdjacentHTML('afterbegin','<button data-a="agOpen" class="agtab">AI 에이전트</button>')}catch(e){}}})();
