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
  g.innerHTML=`<div class="agb"><div class="agh"><div><b>AI 에이전트</b><small>묻기만 하는 챗봇이 아니라, 시키면 앱에서 직접 해 주는 도구</small></div><button class="agx" data-a="agClose">닫기 ✕</button></div>
   <div class="agm" id="agM">${L.map(m=>`<div class="ag-${m.who}"><p>${esc(m.t).replace(/\n/g,'<br>')}</p>${(m.btn||[]).map(b=>`<button class="chip" data-a="agDo" data-j='${esc(JSON.stringify(b.a))}'>${esc(b.n)}</button>`).join('')}</div>`).join('')}${busy?'<div class="ag-ai"><p>생각하는 중…</p></div>':''}</div>
   <div class="ags">${AGSUG.map(t=>`<button class="chip" data-a="agSug" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>
   <div class="agf"><input id="agIn" placeholder="예: 초소 큐레이션 진열을 눈에 띄게" autocomplete="off" enterkeyhint="send">${typeof micBtn==='function'?micBtn('agIn'):''}<button class="btn pri" data-a="agSend" ${busy?'disabled':''}>보내기</button></div></div>`;
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
    else if(a.do==='level'){close();A.lvOpen()}
    else if(a.do==='cmd'&&a.text&&S.ui.dp){const el=$('dpCmd');if(el){el.value=a.text;A.dpCmd()}}
  }catch(e){console.warn(e)}}}

/* ── 공개 주소에서도 되는 규칙 에이전트 ── */
function agFind(q){const T=S.ui.cor||[];const m=q.match(/(\d+)\s*(번째|번)/);if(m&&T[+m[1]-1])return +m[1]-1;if(/첫\s*번째|첫째|맨\s*위/.test(q))return 0;
  const toks=q.replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(w=>w.length>=2&&!/진열|평대|배치|보여|만들|인스타|피드|큐레이션|주제|해줘|줘|이번|지점|가득|채우|눈에|띄게|무난|이야기|포근|영상|릴스|인쇄물|쇼카드|띠지|목록/.test(w));
  let best=-1,bs=0;T.forEach((t,i)=>{const hay=(t.title+' '+t.hook+' '+(t.books||[]).map(b=>b.t+' '+(b.a||'')).join(' ')).replace(/\s/g,'');const s=toks.reduce((a,w)=>a+(hay.includes(w)?w.length:0),0);if(s>bs){bs=s;best=i}});return best}
const agTok=q=>{const o=[];q.replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).forEach(w=>{const b=w.replace(/(이란|이라는|이야|이에요|예요|에서|으로|이란|란|야|은|는|이|가|을|를|에|의|로|와|과|도|요)$/,'');[w,b].forEach(x=>{if(x.length>=2&&!/어떻게|뭐야|무엇|알려|해줘|하나요|인가요|뭔가요/.test(x))o.push(x)})});return [...new Set(o)]};
function agBasics(q){const toks=agTok(q);let best=null,bs=0;
  BASICS.forEach(b=>{const hay=(b.t+' '+(b.lead||'')+' '+(b.items||[]).map(x=>x.join(' ')).join(' ')).replace(/\s/g,'');const s=toks.reduce((a,w)=>a+(hay.includes(w)?(b.t.includes(w)?w.length*3:w.length):0),0);if(s>bs){bs=s;best=b}});
  if(!best||bs<2)return null;const it=(best.items||[]).find(x=>toks.some(w=>(x[0]+x[1]).includes(w)))||(best.items||[])[0];return{b:best,it}}
function agLocal(q0){const q=q0.replace(/\s+/g,' ').trim(),acts=[],T=S.ui.cor||[];let say=[];
  const br=AGBR.find(([,re])=>re.test(q));if(br&&br[0]!==S.br){acts.push({do:'place',br:br[0]});say.push(`${brN(br[0])}(으)로 바꿨습니다.`)}
  const hid=/매출|주문|반품|지원사업|정산|일정|북센|이지정보/.test(q);
  if(hid&&!isAdmin()&&!/큐레이션|진열|pop|POP|인스타/.test(q)){const bb=agBasics(q);return{t:`매출 · 주문 · 반품 · 지원사업 화면은 지금 안정화 테스트 중이라 열 수 없습니다.${/반품/.test(q)?' 반품은 사진으로 찍어 후보를 만들고, 확인한 뒤에만 이지정보에 넣는 방식으로 준비하고 있습니다.':''}${bb?`\n\n서점 기초 「${bb.b.t}」: ${bb.it?bb.it[1]:bb.b.lead}`:''}`,btn:bb?[{n:`「${bb.b.t}」 자세히`,a:[{do:'basics',id:bb.b.id}]}]:[]}}
  const ti=agFind(q),tn=ti>=0&&T[ti]?`「${T[ti].title}」`:'';
  const quoted=(q.match(/[「『"'“](.+?)[」』"'”]/)||[])[1],word=quoted||(q.match(/^(.{1,12}?)(?:으로|로|에 대한|에 관한)\s*(?:큐레이션|주제|평대)/)||[])[1];
  if(/단계|레벨|승급|열쇠/.test(q)){const L=lvNow();acts.push({do:'level'});return{t:`지금 ${L}단계 「${LVN[L]}」입니다.${L<3?` 큐레이션 · 인쇄물 · 진열안을 쓸수록 ${L+1}단계 조건이 채워지고, 채우면 승급 신청 카드를 참부장께 보내면 됩니다.`:''} 단계 화면을 열었습니다.`,a:acts}}
  if(/가이드|사용법|처음|어떻게 써/.test(q)&&!/진열|인스타|pop|POP/.test(q)){acts.push({do:'guide'});return{t:'화면 안내를 열었습니다. 좌우 화살표로 넘겨 보세요.',a:acts}}
  if(word&&/(만들|짜|해\s*줘|추천)/.test(q)&&!/진열|인스타|피드|pop|POP/.test(q)){acts.push({do:'make',word:word.trim()});return{t:`「${word.trim()}」(으)로 큐레이션을 만듭니다. 위 입력 칸에 넣고 바로 실행했습니다.`,a:acts}}
  if(/인스타|피드|sns|SNS|릴스(?!.*진열)/.test(q)&&!/진열|영상/.test(q)){acts.push({do:'insta',theme:ti>=0?ti:null});return{t:`${tn?tn+'로 ':''}인스타 피드 만들기를 열었습니다. 사진을 넣고 「피드 만들기」를 누르면 표지 이미지와 글 세 가지가 나옵니다.`,a:acts}}
  if(/한\s*벌|한번에|한 번에|전부/.test(q)){const i=ti>=0?ti:0;acts.push({do:'set',theme:i});return{t:`「${T[i].title}」 한 번에 받기를 열었습니다. POP · 쇼카드 · 띠지 PDF와 인스타 이미지를 한 번에 받습니다.`,a:acts}}
  if(/pop|POP|팝|포스터|쇼카드|띠지|인쇄|책\s*목록/.test(q)){const i=ti>=0?ti:0,k=/쇼카드/.test(q)?'card':/띠지/.test(q)?'band':/목록/.test(q)?'list':'pop';acts.push({do:'pop',theme:i});acts[acts.length-1].kind=k;return{t:`「${T[i].title}」 ${k==='card'?'쇼카드':k==='band'?'띠지':k==='list'?'책 목록':'POP'}를 열었습니다. 느낌을 고르고 PDF · PNG로 받으면 됩니다.`,a:acts}}
  if(/진열|평대|배치|3d|3D|가득|채우|영상|한\s*바퀴/.test(q)){const i=ti>=0?ti:0,rec=/가득|채우|빈틈/.test(q)?3:/눈에|돋보|강조/.test(q)?1:/이야기|포근|감성/.test(q)?2:/무난|기본|재고/.test(q)?0:null;acts.push({do:'dp',theme:i,rec,video:/영상|릴스|한\s*바퀴/.test(q)});
    return{t:`「${T[i].title}」 진열을 열었습니다.${rec!=null?` 추천 배치 「${DPREC[rec][0]}」로 놓았습니다.`:' 맨 위 추천 배치 네 가지 중 하나를 눌러 보세요.'}${/영상|릴스/.test(q)?' 영상 크기를 고르면 한 바퀴 돌며 저장합니다.':''}`,a:acts}}
  if(/큐레이션|주제|카드/.test(q)&&ti>=0){acts.push({do:'open',theme:ti});return{t:`${tn} 카드를 열었습니다. 진열 → 인쇄물 → 인스타 순서로 누르면 됩니다.`,a:acts}}
  const bb=agBasics(q);if(bb)return{t:`서점 기초 「${bb.b.t}」에서 찾았습니다.\n${bb.it?bb.it[0]+' — '+bb.it[1]:bb.b.lead}`,btn:[{n:`「${bb.b.t}」 펼쳐 보기`,a:[{do:'basics',id:bb.b.id}]}],a:acts};
  if(acts.length)return{t:say.join(' '),a:acts};
  return{t:'이렇게 시켜 보세요.\n· 「가득 채우는 진열 보여줘」\n· 「겨울로 큐레이션 만들어줘」\n· 「두 번째 주제 POP」\n· 「초소로 바꿔줘」\n· 「도서정가제가 뭐야?」'}}

/* ── Claude 안에서는 AI 가 뜻을 읽고 같은 동작을 고릅니다 ── */
async function agAI(q){const T=(S.ui.cor||[]).slice(0,20).map((t,i)=>`${i}: ${t.title} — ${t.hook}`).join('\n'),L=agLog().slice(-6).map(m=>`${m.who==='me'?'사용자':'에이전트'}: ${m.t}`).join('\n');
  const out=await AI.json(`당신은 「더숲 워크룸」 앱 전용 AI 에이전트입니다. 서점 직원의 말을 듣고 앱 안의 동작을 골라 직접 실행하고, 짧게 답합니다.
앱: 큐레이션(이번 주 주제 카드 → 진열 3D · 인쇄물 POP/쇼카드/띠지/책 목록 · 인스타 피드) · 만들기 · 공간 · 홍보. 진열 추천 배치 0 무난하게 1 눈에 띄게 2 이야기 있게 3 가득 채우기. 매출 · 주문 · 반품 · 지원사업은 안정화 중이라 직원에게 열리지 않음${isAdmin()?'(지금 사용자는 관리자)':''}. 이지정보 · 북센에는 절대 쓰지 않음. 단계: 1 책 고르는 사람 2 코너 큐레이터 3 공간 기획자(쓸수록 열림).
지금: 지점 ${brN(S.br)}, 화면 ${S.view[S.mode]}, 단계 ${lvNow()}.
지점 코드: aka(아카데미·사유의숲) nowon(노원더숲) choso(초소) sojeon(소전·시흥) nmain(노원문고 본점) njung(중계점).
이번 주 큐레이션(번호: 제목 — 한 줄):
${T}
서점 기초 장: ${BASICS.map(b=>b.id+'='+b.t).join(', ')}
최근 대화:
${L}
사용자: ${q}

허용 동작(필요한 것만, 순서대로):
{"do":"place","br":"코드"} {"do":"go","view":"cur|design|space|insta"} {"do":"open","theme":번호} {"do":"dp","theme":번호,"rec":0~3 또는 null,"video":false} {"do":"pop","theme":번호,"kind":"pop|card|band|list"} {"do":"insta","theme":번호 또는 null} {"do":"set","theme":번호} {"do":"make","word":"단어"} {"do":"basics","id":"장 id"} {"do":"guide"} {"do":"level"} {"do":"cmd","text":"진열 말 명령(진열 화면이 열려 있을 때)"}
답은 존댓말로 2~4문장, 무엇을 했는지와 다음에 누를 것. 모르는 사실은 지어내지 않습니다. 앱 밖 질문(서점 일반 지식)은 짧게 답하고, 서점 기초 장이 맞으면 basics 버튼을 붙입니다.
JSON 으로만: {"t":"답","a":[동작],"btn":[{"n":"버튼 이름","a":[동작]}]}`,{cache:false});
  if(!out||!out.t)return null;const ok=x=>x&&typeof x.do==='string';return{t:String(out.t),a:(out.a||[]).filter(ok).slice(0,4),btn:(out.btn||[]).filter(b=>b&&b.n&&Array.isArray(b.a)).slice(0,3).map(b=>({n:String(b.n).slice(0,20),a:b.a.filter(ok).slice(0,3)}))}}

/* ── 도움말에 「AI 에이전트」 탭 ── */
(()=>{const g=gdDraw;gdDraw=function(){g.apply(this,arguments);try{const G=$('guide');if(!G)return;const t=G.querySelector('.gdtab');if(t&&!t.querySelector('[data-a="agOpen"]'))t.insertAdjacentHTML('afterbegin','<button data-a="agOpen" class="agtab">AI 에이전트</button>')}catch(e){}}})();
