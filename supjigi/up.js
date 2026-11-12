/* 더숲 워크룸 — 고도화 (11/12 밤, 참부장 승인)
   카드 세 걸음 · POP 화면 단순화 · 위쪽 정리 · 한 번에 받기 · 추천 배치 3안 · 사진으로 진열 점검 ·
   POP 질문 문구 · 직원에게 보내기(3D 포함) · 한 바퀴 영상(자막 · 세로) · 인스타 피드(사진에 맞춘 이미지와 글) */

/* ── 공통 ── */
const upImg=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src});
async function upFont(){try{await Promise.all(['800 40px Pretendard','700 40px Pretendard','600 40px Pretendard','500 40px Pretendard'].map(f=>document.fonts.load(f,'더숲 가')))}catch(e){}}
function wrapW(x,s,mw,max){const L=[];String(s||'').split('\n').forEach(par=>{let cur='';par.split(/(\s+)/).forEach(tok=>{if(!tok)return;const t=cur+tok;if(x.measureText(t).width<=mw)cur=t;else if(!cur.trim()||x.measureText(tok).width>mw){for(const ch of tok){if(x.measureText(cur+ch).width>mw&&cur.trim()){L.push(cur.trim());cur=ch.trim()?ch:''}else cur+=ch}}else{L.push(cur.trim());cur=tok.trim()?tok:''}});L.push(cur.trim())});
  const r=L.filter(l=>l!=='');if(max&&r.length>max){const k=r.slice(0,max);k[max-1]=k[max-1].replace(/.$/,'…');return k}return r}
const upBr=br=>{try{return '더숲 '+((typeof BRAND!=='undefined'&&BRAND[br])||brN(br))}catch(e){return '더숲'}};
const upName=s=>String(s||'').replace(/[\\/:*?"<>|\n\s,]+/g,'_').slice(0,24);
async function upSaveMany(cs,base){const bl=await Promise.all(cs.map(c=>new Promise(r=>c.toBlob(r,'image/png'))));const fs=bl.map((b,i)=>new File([b],`${base}_${String(i+1).padStart(2,'0')}.png`,{type:'image/png'}));
  try{if(navigator.canShare&&navigator.canShare({files:fs})){await navigator.share({files:fs});return true}}catch(e){if(e&&e.name==='AbortError')return false}
  for(const f of fs){await saveFile(f.name,f);await new Promise(r=>setTimeout(r,250))}toast(`${fs.length}장을 저장했습니다`);return true}

/* ── POP 문구: 주제마다 다른 질문 하나 (공통 질문 대신) ── */
const POPQX={'새벽 세 시에 깨어 있는 사람':'당신이 잠든 사이, 누가 깨어 있었나요?','죽음 곁에서 일한 사람들':'마지막 장을 먼저 읽으면 무엇이 달라질까요?','사는 곳이 사는 법을 정한다':'당신의 방은 어떤 하루를 만드나요?','단어 하나를 사흘 고민하는 일':'「괜찮아」를 다른 말로 옮긴다면?','숲이 주어인 문장들':'나무가 당신을 본다면 뭐라고 쓸까요?','낫지 않는 채로 사는 법':'다 낫지 않아도 괜찮은 하루가 있을까요?','방과 500파운드, 그 다음':'방이 생기면 무엇을 쓰겠습니까?','두 나라 말로 꿈꾸는 사람':'꿈은 어느 나라 말로 꾸나요?','평균인 사람은 0명이었다':'당신은 평균입니까?','요리책 코너에 못 간 책':'가장 오래 기억나는 밥은 무엇인가요?','시속 4킬로미터의 생각':'오늘은 몇 걸음만큼 생각했나요?','분류표를 의심하는 과학':'물고기는 정말 있을까요?','소설 속 작은 가게들':'당신 동네에도 이런 가게가 있나요?','물음표로 끝나는 제목':'오늘 당신의 질문은 무엇입니까?','1949년에 쓴 1984':'다음 숫자는 무엇일까요?','한 가지를 오래 좋아한 사람들':'아무튼, 당신은 무엇을 오래 좋아했나요?','나는 아니라고 생각했는데':'정말, 나는 아닐까요?','먹히는 쪽에서 본 식탁':'오늘 접시 건너편에는 누가 있었나요?','명함에 없는 일의 뒷면':'오늘 당신을 위해 일한 사람은 몇 명일까요?','겨울에 읽는 뜨거워지는 지구':'올겨울은 왜 덜 춥게 느껴질까요?','한 점 앞에 오래 서는, 보는 법':'마지막으로 오래 바라본 것은 무엇인가요?','제목에 색이 묻은 책':'이 평대는 무슨 색으로 보이나요?','건물 이름이 제목인 책':'어느 문부터 열어 보시겠어요?','실패한 쪽이 오래 읽힌다':'잘 안 된 일, 다시 읽어 볼까요?','조용한 제목, 소란한 속':'조용한 사람의 머릿속은 어떨까요?','달리는 사람, 앉아 있는 사람':'오늘은 달릴까요, 앉을까요?','시옷으로 시작하는 책':'ㅅ 다음엔 무엇이 올까요?','긴 밤에는, 긴 소설':'이번 겨울, 어떤 긴 이야기와 지낼까요?','문제집을 치운 자리에':'정답 없는 책, 무엇부터 펼까요?','비 오는 날, 서서 읽는 시':'비 그칠 때까지 몇 편 읽을까요?','첫눈 오는 날 펼 책':'첫눈 오는 날, 무엇을 읽겠습니까?','코트 주머니에 들어가는 책':'누구의 주머니에 넣어 줄까요?','차가 식기 전에, 철학 한 쪽':'한 잔이 식는 동안 무엇을 생각할까요?','겨울눈을 만든 나무들':'나무는 지금 무엇을 준비하고 있을까요?','한 장면 앞에 오래 머물기':'빨리 감지 않고 본 장면이 있나요?','맑고 찬 날의 산책자':'찬 공기 속을 얼마나 걸어 보셨나요?','올해 밑줄 그은 문장들':'올해 가장 오래 남은 문장은 무엇인가요?','서점의 날, 이 책방의 책':'이 책방에서 당신이 고른 책은 무엇이었나요?','다른 더숲이 먼저 알아본 책':'다른 동네에서는 무엇을 읽을까요?'};
const popQ=t=>{const s=(t&&t.title)||'';return POPQX[s]||(/월에 막 들어온 책/.test(s)?'아직 아무도 펴 보지 않은 책, 먼저 펴 보시겠어요?':/오래 자리를 지킨/.test(s)?'십 년 뒤에도 읽힐 책은 무엇일까요?':'')};
(()=>{const f=mkD;mkD=function(t,k){const D=f(t,k);try{if(k!=='pop'||!t)return D;const q=popQ(t);if(q&&typeof POPQ!=='undefined'){const g=POPQ.find(x=>(D.body||'').includes(x));if(g)D.body=D.body.replace(g,q)}}catch(e){}return D}})();

/* ── 화면 다듬기: 카드 세 걸음 · POP 화면 · 위쪽 ── */
function upPost(){const mn=document.querySelector('main');if(!mn||S.locked)return;
  document.querySelectorAll('.navb [data-a="nhGo"]').forEach(b=>b.style.display='none');
  if(!isAdmin())document.querySelectorAll('.navb [data-v="more"]').forEach(b=>b.style.display='none');
  /* 큐레이션 카드: 진열 → 인쇄물 → 인스타, 그리고 한 번에 받기 */
  mn.querySelectorAll('.pcard>.btns').forEach(bt=>{if(bt.dataset.up)return;bt.dataset.up=1;const dp=bt.querySelector('[data-a="dpOpen"]');if(!dp)return;const i=dp.dataset.i;
    const st=document.createElement('div');st.className='ust';st.innerHTML=`<button data-a="dpOpen" data-i="${i}"><em>1</em><b>진열</b><small>3D로 놓아 보기</small></button><button data-a="toDesign" data-kind="pop" data-s="c" data-i="${i}"><em>2</em><b>인쇄물</b><small>POP · 쇼카드 · 띠지</small></button><button data-a="igOpen" data-i="${i}"><em>3</em><b>인스타</b><small>피드 이미지 · 글</small></button>`;
    const all=document.createElement('button');all.className='btn usetall';all.dataset.a='setAll';all.dataset.i=i;all.textContent='한 번에 받기 — 인쇄물 PDF와 인스타 이미지를 한 번에';
    bt.before(st);st.after(all);[...bt.querySelectorAll(':scope>button')].forEach(b=>b.remove())});
  mn.querySelectorAll('.cvq').forEach(q=>{if(q.querySelector('[data-a="igOpen"]'))return;const d=q.querySelector('[data-a="dpOpen"]');if(!d)return;const b=document.createElement('button');b.dataset.a='igOpen';b.dataset.i=d.dataset.i;b.textContent='인스타';q.append(b);const p=q.querySelector('[data-a="toDesign"]');if(p)p.textContent='인쇄물';d.textContent='진열'});
  /* POP 만들기: 종류 → 미리보기 → 느낌 3개 → 저장, 나머지는 「글 · 색 고치기」 */
  const dz=mn.querySelector('.grid.dz');if(dz&&!dz.dataset.up){dz.dataset.up=1;
    const stage=dz.querySelector('#stage'),feel=dz.querySelector('.feel'),feels=dz.querySelector('.feels'),sws=dz.querySelector('.sws'),bts=dz.querySelector('.stagecol>.btns'),voice=dz.querySelector('.stagecol>.card.form'),form=dz.querySelector(':scope>.card.form'),kinds=form&&form.querySelector(':scope>.chips');
    if(kinds&&stage){kinds.classList.add('ukind');stage.before(kinds)}
    if(feels&&feel){const bs=[...feels.children];if(bs.length>3){const m=document.createElement('details');m.className='fold umore';m.open=!!S.ui.ufm;m.innerHTML='<summary>느낌 더 보기</summary>';const g=document.createElement('div');g.className='feels';bs.slice(3).forEach(b=>g.append(b));m.append(g);m.addEventListener('toggle',()=>{S.ui.ufm=m.open});feel.append(m)}}
    if(bts){bts.querySelectorAll('.fresh').forEach(b=>{if(/비슷/.test(b.textContent))b.style.display='none'})}
    const ed=document.createElement('details');ed.className='fold uedit';ed.open=!!S.ui.ued;ed.innerHTML='<summary>글 · 색 · 크기 고치기 <small>말로도 됩니다</small></summary>';ed.addEventListener('toggle',()=>{S.ui.ued=ed.open});
    const box=document.createElement('div');box.className='uedb';ed.append(box);
    if(form)form.querySelectorAll(':scope>.fld').forEach(x=>box.append(x));if(voice)box.append(voice);if(sws)box.append(sws);if(form)form.querySelectorAll(':scope>details').forEach(x=>box.append(x));
    (bts||stage).after(ed);if(form&&![...form.children].some(c=>c.offsetHeight>0))form.style.display='none'}
  /* 인스타 화면: 맨 위에 「피드 만들기」, 예전 초안 칸은 접기 */
  if(S.mode==='aka'&&S.view.aka==='insta'&&!mn.querySelector('.igtop')){const sec=mn.querySelector('.sec');const c=document.createElement('div');c.className='igtop';c.innerHTML=`<div><b>피드 만들기</b><span>사진을 넣으면 사진에 맞춰 표지 이미지와 글 세 가지를 만듭니다. 사진이 없으면 큐레이션으로 표지를 만듭니다.</span></div><button class="btn pri" data-a="igOpen">시작</button>`;if(sec)sec.after(c);else mn.prepend(c);const old=$('igT');if(old){const cd=old.closest('.card');if(cd)cd.style.display='none'}}}
(()=>{const r=render;render=function(){r.apply(this,arguments);try{upPost()}catch(e){console.warn(e)}}})();

/* ── 한 번에 받기: POP · 쇼카드 · 띠지 PDF + 인스타 이미지 ── */
try{if(!SETK.some(x=>x[0]==='ig'))SETK.push(['ig','인스타 이미지'])}catch(e){}
A.setAll=d=>{S.ui.setK={pop:1,card:1,list:0,band:1,ig:1};A.setOpen(d)};
(()=>{const sp=A.setPdf;A.setPdf=async()=>{const K=S.ui.setK||{},ig=!!K.ig,i=S.ui.setI,t=(S.ui.cor||[])[i];K.ig=0;const other=SETK.some(([k])=>k!=='ig'&&K[k]);try{if(other)await sp()}finally{K.ig=ig?1:0}
  if(ig&&t){try{const cs=await igCanvases({t,ph:[],fmt:0,ct:t.title,cs:t.hook});await upSaveMany(cs,'더숲_인스타_'+upName(t.title));A.setClose()}catch(e){console.warn(e);toast('인스타 이미지를 만들지 못했습니다')}}else if(!other)toast('하나 이상 골라 주세요')}})();

/* ── 추천 배치 3안 ── */
const DPREC=[['무난하게','재고 위주'],['눈에 띄게','4종 · 메인 크게'],['이야기 있게','따뜻하게'],['가득 채우기','빈틈없이']];
(()=>{const f=A.dpOpen;A.dpOpen=d=>{f(d);try{const b=document.querySelector('#sheetBox .dprec');if(b){const w=document.createElement('div');w.className='dprec3';w.innerHTML=`<b>추천 배치</b><div>${DPREC.map(([n,s],i)=>`<button data-a="dpRec" data-v="${i}" aria-pressed="${S.ui.dpRv===i}"><b>${n}</b><small>${s}</small></button>`).join('')}</div>`;b.replaceWith(w)}
  const sb=$('sheetBox');if(sb&&AI&&!sb.querySelector('.dpchk')&&sb.querySelector('.dpv')){const c=document.createElement('label');c.className='dpchk';c.innerHTML=`<b>사진으로 점검</b><span>진열을 마친 평대를 찍으면 빠진 책 · 가려진 표지 · 메인 자리를 알려 줍니다</span><input type="file" accept="image/*" capture="environment" hidden data-c="dpChk">`;const bt=sb.querySelector(':scope>.btns');(bt||sb.lastElementChild).before(c);if(S.ui.dpChkR&&S.ui.dpChkR.k===dpKey((S.ui.cor||[])[S.ui.dp.i]))c.after(dpChkBox(S.ui.dpChkR))}}catch(e){console.warn(e)}}})();
A.dpRec=d=>{try{const v=d&&d.v!=null?+d.v:0,t=S.ui.cor[S.ui.dp.i];if(!t)return;const k=dpKey(t),all=(t.books||[]).slice(0,10),L=lvNow(),cap=L>=2?8:6;
  const sc=b=>((b.here>0||b.src==='재고')?100:0)+(b.mine||0)*3+(b.sold||0)+(b.role==='중심'?5:0),ord=all.map((b,i)=>[i,sc(b)]).sort((a,b)=>b[1]-a[1]||a[0]-b[0]),ins=ord.filter(x=>x[1]>=100).length;
  S.ui.dpFull=v===3;const n=v===3?Math.min(cap,all.length):v===1?Math.min(4,all.length):Math.max(Math.min(3,all.length),Math.min(cap,all.length,v===0&&ins>=3?ins:cap)),pk=ord.slice(0,n).map(x=>x[0]).sort((a,b)=>a-b),main=ord[0][0],md=v===1?2:v===2?1:0;S.ui.dpOrd=ord.map(x=>x[0]);
  S.ui.dpPick={...(S.ui.dpPick||{}),[k]:pk};S.ui.dpMain={...(S.ui.dpMain||{}),[k]:main};const O={...(S.ui.dpObj||{}),show:true,band:v===1};if(L>=2){O.vase=v===2;O.note=v===2}S.ui.dpObj=O;S.ui.dpFree=v!==1;S.ui.dpM=md;S.ui.dpF=0;S.ui.dpRv=v;
  try{const ps=S.ui.dpAbs||{};Object.keys(ps).forEach(x=>{if(x.indexOf(k)===0)delete ps[x]});S.ui.dpAbs=ps}catch(e){}
  A.dpOpen({i:S.ui.dp.i});const nm=String(all[main].t).replace(/\s*[\(\[].*$/,''),inn=pk.filter(i=>all[i].here>0||all[i].src==='재고').length,w=document.querySelector('#sheetBox .dprec3');
  if(w){const P2=dpPlan(t,md);w.insertAdjacentHTML('afterend',`<p class="dprw"><b>${DPREC[v][0]}</b> ${n}종 · ${P2.total}권 · 메인 「${esc(nm)}」${v===3&&P2.full?` · ${P2.full.cells}칸`:''}</p>`)}}catch(e){console.warn(e);toast('추천 배치를 만들지 못했습니다')}};

/* ── 사진으로 진열 점검 (Claude 안에서만) ── */
function dpChkBox(r){const d=document.createElement('div');d.className='dpchkr';const li=(n,a,c)=>a&&a.length?`<li class="${c}"><b>${n}</b> ${a.map(esc).join(' · ')}</li>`:'';d.innerHTML=`<h4>점검 결과</h4><ul>${li('빠진 책',r.missing,'bad')}${li('표지가 가려진 책',r.covered,'warn')}${li('잘 놓인 책',r.found,'ok')}<li class="${r.main_ok?'ok':'warn'}"><b>메인</b> ${esc(r.main||'')}</li>${(r.tips||[]).slice(0,3).map(x=>`<li><b>고칠 점</b> ${esc(x)}</li>`).join('')}</ul>`;return d}
C.dpChk=async el=>{const f=el.files&&el.files[0];el.value='';if(!f)return;const t=(S.ui.cor||[])[S.ui.dp.i];if(!t)return;const all=(t.books||[]).slice(0,10),pk=dpPick(t),mi=(S.ui.dpMain||{})[dpKey(t)];
  const lab=document.querySelector('#sheetBox .dpchk span');if(lab)lab.textContent='사진을 보는 중… (30초쯤)';
  const out=await ask('dpchk',`서점 평대 진열 사진입니다. 계획과 견주어 점검해 주세요.\n계획한 책(번호 · 제목 · 저자):\n${pk.map((i,n)=>`${n+1}. ${all[i].t}${all[i].a?' · '+all[i].a:''}`).join('\n')}\n메인 책: ${mi!=null&&all[mi]?all[mi].t:'(정하지 않음)'}\n사진에서 표지 제목이 읽히는 책을 계획과 맞춰 보고, 사람 얼굴이나 손님은 말하지 마세요. 확실하지 않으면 found 에 넣지 마세요.\nJSON 으로만: {"found":["제목"],"missing":["제목"],"covered":["제목"],"main":"메인 책이 눈에 띄는지 한 문장","main_ok":true,"tips":["고칠 점 한 문장, 최대 3개"]}`,{images:[f]});
  if(out){S.ui.dpChkR={...out,k:dpKey(t)};A.dpOpen({i:S.ui.dp.i});const c=document.querySelector('#sheetBox .dpchkr');if(c)c.scrollIntoView({block:'center',behavior:'smooth'})}else{if(lab)lab.textContent='읽지 못했습니다. 평대 전체가 보이게 다시 찍어 주세요.'}};

/* ── 직원에게 보내기: 3D 장면 + 평면 + 놓는 순서 + 메인 표시 ── */
A.dpSend=async()=>{try{const t=S.ui.cor[S.ui.dp.i],P=dpPlan(t,S.ui.dpM||0),el=$('dpTop');if(!t||!el)return;lvAdd('dp');toast('보낼 그림을 만드는 중입니다');await upFont();
  const vb=(el.getAttribute('viewBox')||'0 0 900 900').split(/\s+/).map(Number),sw=vb[2],sh=vb[3];let svg=new XMLSerializer().serializeToString(el);if(!/xmlns=/.test(svg.slice(0,200)))svg=svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');svg=svg.replace(/^<svg([^>]*)>/,(m,a)=>`<svg${a.replace(/\sstyle="[^"]*"/,'').replace(/\s(width|height)="[^"]*"/g,'')} width="${sw}" height="${sh}">`);svg=svg.replace(/^(<svg[^>]*>)/,'$1'+await fontCSS());
  const top=await upImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)),c3=document.querySelector('#dpV3 canvas');
  const W=1080,F='Pretendard,"Malgun Gothic",sans-serif',all=(t.books||[]).slice(0,10),mi=(S.ui.dpMain||{})[dpKey(t)],mt=mi!=null&&all[mi]?all[mi].t:'',rows=(P.rows||[]).filter(r=>r&&r.b),x0=document.createElement('canvas').getContext('2d');
  const ih3=c3?Math.round(920*c3.height/c3.width):0,tw=c3?600:920,th=Math.round(tw*sh/sw);
  const RL=rows.map(r=>{x0.font=`800 34px ${F}`;const tt=wrapW(x0,r.b.t.replace(/\s*[\(\[].*$/,''),760,1)[0];x0.font=`500 26px ${F}`;return{n:r.n,t:tt,m:mt&&r.b.t===mt,p:wrapW(x0,r.place||'',820,2)}});
  x0.font=`500 26px ${F}`;const TL=['놓는 순서 — 메인 책 → 높은 더미 → 나머지 → POP · 쇼카드',...(P.tips||[]).slice(0,2)].flatMap(s=>wrapW(x0,'· '+s,920)),NL=(P.need||[]).length?wrapW(x0,'준비물  '+P.need.join(' · '),920):[];
  const H=250+(ih3?ih3+40:0)+th+60+RL.reduce((a,r)=>a+58+r.p.length*36+18,0)+30+TL.length*38+(NL.length?24+NL.length*38:0)+110,c=document.createElement('canvas'),x=c.getContext('2d');c.width=W;c.height=H;
  x.fillStyle='#f7f5ef';x.fillRect(0,0,W,H);x.fillStyle='#003128';x.fillRect(0,0,W,200);x.fillStyle='#c9a24a';x.fillRect(0,200,W,10);
  x.fillStyle='#d9b45b';x.font=`600 28px ${F}`;x.fillText('오늘의 진열 · 더숲 '+brN(P.br||S.br)+(t.until?' · '+mdw(t.until)+'까지':''),80,78);x.fillStyle='#f2eee3';x.font=`800 56px ${F}`;x.fillText(wrapW(x,t.title,920,1)[0],80,152);
  let y=250;if(c3){x.drawImage(c3,80,y,920,ih3);x.fillStyle='rgba(0,49,40,.82)';x.fillRect(80,y,150,44);x.fillStyle='#fff';x.font=`700 22px ${F}`;x.fillText('손님 눈높이',96,y+30);y+=ih3+40}
  x.drawImage(top,c3?80+(920-tw)/2:80,y,tw,th);y+=th+60;
  RL.forEach(r=>{x.fillStyle=r.m?'#c9a24a':'#003128';x.beginPath();x.arc(104,y+22,24,0,7);x.fill();x.fillStyle=r.m?'#1c1c1a':'#fff';x.font=`800 26px ${F}`;x.textAlign='center';x.fillText(r.n,104,y+31);x.textAlign='left';x.fillStyle='#1c1c1a';x.font=`800 34px ${F}`;x.fillText(r.t,150,y+34);
    if(r.m){const w=x.measureText(r.t).width;x.fillStyle='#c9a24a';x.fillRect(166+w,y+6,92,36);x.fillStyle='#1c1c1a';x.font=`800 22px ${F}`;x.fillText('메인',186+w,y+32)}
    y+=58;x.fillStyle='#55554f';x.font=`500 26px ${F}`;r.p.forEach(s=>{x.fillText(s,150,y+22);y+=36});y+=18});
  y+=30;x.fillStyle='#1c1c1a';x.font=`500 26px ${F}`;TL.forEach(s=>{x.fillText(s,80,y+22);y+=38});
  if(NL.length){y+=24;x.fillStyle='#7d3a2b';NL.forEach(s=>{x.fillText(s,80,y+22);y+=38})}
  x.fillStyle='#8a8a80';x.font=`400 22px ${F}`;x.fillText('Planned by 쿼부장',W-290,H-44);
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(!blob)return;const name=`더숲_진열안내_${upName(t.title)}.png`;
  try{const f=new File([blob],name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:t.title});return}}catch(e){if(e&&e.name==='AbortError')return}
  await saveFile(name,blob);toast('그림을 저장했습니다. 카카오톡으로 직원에게 보내 주세요.')}catch(e){console.warn(e);toast('그림을 만들지 못했습니다')}};

/* ── 한 바퀴 영상: 제목 · 한 줄 자막, 세로(릴스) · 피드 · 그대로 ── */
const RECF=[['세로 9:16 · 릴스',1080,1920],['피드 4:5',1080,1350],['그대로',0,0]];
A.d3rec=()=>{const b=document.querySelector('.d3cb');if(!b)return;let p=document.querySelector('.recp');if(p){p.remove();return}p=document.createElement('div');p.className='recp';p.innerHTML=`<span>영상 크기</span>${RECF.map(([n],i)=>`<button class="chip" data-a="d3recGo" data-v="${i}">${n}</button>`).join('')}`;b.after(p)};
A.d3recGo=async d=>{const p=document.querySelector('.recp');if(p)p.remove();const t=(S.ui.cor||[])[S.ui.dp.i],v=+d.v,[,W,H]=RECF[v];if(!W){D3C.record(t&&t.title);return}
  const cv=document.querySelector('#dpV3 canvas');if(!cv||!window.MediaRecorder){toast('이 브라우저는 영상 저장을 지원하지 않습니다');return}await upFont();
  const out=document.createElement('canvas');out.width=W;out.height=H;const x=out.getContext('2d'),F='Pretendard,"Malgun Gothic",sans-serif',TC=(typeof TONEC!=='undefined'&&TONEC[t.tone])||['#003128','#f2eee3'];let lw=null;try{lw=await upImg('logo-w.png')}catch(e){}
  x.font=`800 ${v===0?84:72}px ${F}`;const TT=wrapW(x,t.title,W-160,2);x.font=`500 ${v===0?38:34}px ${F}`;const HK=wrapW(x,popQ(t)||t.hook||'',W-160,2);
  const frame=()=>{x.fillStyle='#f2eee3';x.fillRect(0,0,W,H);const top=v===0?380:250,bh=v===0?H-top-420:H-top-230,ar=cv.width/cv.height;let dw=W,dh=W/ar;if(dh>bh){dh=bh;dw=bh*ar}x.drawImage(cv,(W-dw)/2,top+(bh-dh)/2,dw,dh);
    x.fillStyle=TC[0];x.fillRect(0,0,W,top-30);x.fillStyle='#c9a24a';x.fillRect(0,top-30,W,8);if(lw)x.drawImage(lw,80,v===0?90:56,150,150*lw.height/lw.width);
    x.fillStyle=TC[1];x.font=`800 ${v===0?84:72}px ${F}`;TT.forEach((s,i)=>x.fillText(s,80,(v===0?250:170)+i*(v===0?96:82)-(TT.length-1)*(v===0?40:30)));
    const by=H-(v===0?380:200);x.fillStyle='#1c1c1a';x.font=`500 ${v===0?38:34}px ${F}`;HK.forEach((s,i)=>x.fillText(s,80,by+60+i*(v===0?54:48)));x.fillStyle='#003128';x.font=`700 28px ${F}`;x.fillText(`${upBr(t.br||S.br)}${t.place?' · '+t.place:''}`,80,H-(v===0?110:60))};
  const ty=['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'].find(q=>MediaRecorder.isTypeSupported(q))||'',ext=ty.startsWith('video/mp4')?'mp4':'webm',st=out.captureStream(30),mr=new MediaRecorder(st,ty?{mimeType:ty,videoBitsPerSecond:6e6}:{}),ch=[];
  let on=true;const loop=()=>{if(!on)return;frame();requestAnimationFrame(loop)};mr.ondataavailable=e=>{if(e.data&&e.data.size)ch.push(e.data)};
  mr.onstop=()=>{on=false;saveFile(`더숲_진열_${v===0?'릴스':'피드'}_${upName(t.title)}.${ext}`,new Blob(ch,{type:ty||'video/webm'}));toast(`영상(${ext.toUpperCase()})을 저장했습니다`);try{lvAdd('vid')}catch(e){}};
  toast('한 바퀴 도는 동안 녹화합니다 (7초)');loop();mr.start();const [yw]=D3C.view();D3C.anim([yw,0.9],500,()=>D3C.turn(6000,()=>setTimeout(()=>mr.stop(),400)))};

/* ── 인스타 피드: 사진에 맞춘 표지 이미지 + 글 세 가지 ── */
const IGF=[['피드 4:5',1080,1350],['정사각 1:1',1080,1080],['스토리 9:16',1080,1920]];
const IGTAG='#더숲 #더숲아카데미하우스 #사유의숲 #북한산 #동네서점 #책추천 #북큐레이션';
function igTheme(){const G=S.ui.igG||{};return G.ti!=null?(S.ui.cor||[])[G.ti]:null}
A.igOpen=d=>{const i=d&&d.i!=null&&d.i!==''?+d.i:null;S.ui.igG={ph:[],ti:i,txt:'',fmt:0,out:null,busy:0};igDraw()};
A.igTh=d=>{const G=S.ui.igG;G.ti=G.ti===+d.i?null:+d.i;G.out=null;igDraw()};A.igFmt=d=>{const G=S.ui.igG;G.fmt=+d.v;if(G.out)igMake(true);else igDraw()};
A.igRm=d=>{const G=S.ui.igG;G.ph.splice(+d.i,1);G.out=null;igDraw()};A.igFirst=d=>{const G=S.ui.igG,i=+d.i;G.ph.unshift(...G.ph.splice(i,1));if(G.out)igMake(true);else igDraw()};
C.igPh=async el=>{const G=S.ui.igG;const fs=[...el.files].slice(0,10-G.ph.length);el.value='';for(const f of fs){try{const bm=await createImageBitmap(f);G.ph.push({f,bm,u:URL.createObjectURL(f)})}catch(e){}}G.out=null;igDraw()};
C.igTx=el=>{S.ui.igG.txt=el.value};C.igCT=el=>{const G=S.ui.igG;if(G.out){G.out.ct=el.value;igMake(true)}};C.igCS=el=>{const G=S.ui.igG;if(G.out){G.out.cs=el.value;igMake(true)}};
function igDraw(){const G=S.ui.igG;if(!G)return;const T=(S.ui.cor||[]).slice(0,8),t=igTheme(),o=G.out;
  const h=`<div class="igs"><h3>인스타 피드</h3><p class="note">사진을 넣으면 사진에 맞춰 표지와 글을 만듭니다(최대 10장). 사진 없이도 큐레이션으로 표지를 만듭니다.</p>
   <div class="igph">${G.ph.map((p,i)=>`<div><img src="${p.u}" alt="">${i?`<button data-a="igFirst" data-i="${i}" title="표지로">표지로</button>`:'<em>표지</em>'}<button class="x" data-a="igRm" data-i="${i}" aria-label="빼기">×</button></div>`).join('')}${G.ph.length<10?`<label class="igadd"><b>+</b><span>사진</span><input type="file" accept="image/*" multiple hidden data-c="igPh"></label>`:''}</div>
   <div class="fld"><label>무엇에 대해 <small>있으면 더 정확합니다</small></label><textarea id="igTx" rows="2" data-c="igTx" placeholder="예: 11/13 금 19시 〈해피엔드〉 특별상영, 상영 뒤 씨앗숲 열려 있음">${esc(G.txt||'')}</textarea></div>
   <div class="fld"><label>이번 주 큐레이션과 묶기</label><div class="chips igth">${T.map((x,i)=>`<button class="chip" data-a="igTh" data-i="${i}" aria-pressed="${G.ti===i}">${esc(x.title)}</button>`).join('')}</div></div>
   <div class="chips">${IGF.map(([n],i)=>`<button class="chip" data-a="igFmt" data-v="${i}" aria-pressed="${(G.fmt|0)===i}">${n}</button>`).join('')}</div>
   <div class="btns"><button class="btn pri" data-a="igMake" ${G.busy?'disabled':''}>${G.busy?'만드는 중… (사진이 있으면 30초쯤)':o?'다시 만들기':'피드 만들기'}</button></div>
   ${o?`<div class="igprev">${(o.urls||[]).map(u=>`<img src="${u}" alt="">`).join('')}</div>
    <div class="grid g2"><div class="fld"><label>표지 제목</label><input id="igCT" data-c="igCT" value="${esc(o.ct||'')}"></div><div class="fld"><label>표지 한 줄</label><input id="igCS" data-c="igCS" value="${esc(o.cs||'')}"></div></div>
    <div class="btns"><button class="btn pri" data-a="igSave">이미지 ${(o.urls||[]).length}장 저장</button></div>
    ${(o.caps||[]).map((c,i)=>`<div class="igcap"><span>${esc(c.tone||'')}</span><p>${esc(c.caption||'')}</p><small>${esc(o.tags||'')}</small><button class="btn sm" data-a="igCp" data-i="${i}">글 복사</button></div>`).join('')}
    ${o.alt?`<p class="note">사진 설명(대체 텍스트): ${esc(o.alt)}</p>`:''}<p class="note">날짜 · 시간 · 사실은 올리기 전에 확인하고, 올리는 것은 직접 합니다. 손님 얼굴이 크게 나온 사진은 동의를 받고 씁니다.</p>`:''}
   <div class="btns"><button class="btn" data-a="close">닫기</button></div></div>`;
  const sb=$('sheetBox');if(sb&&$('sheet').classList.contains('on')&&sb.querySelector('.igs')){const sc=sb.scrollTop;sb.innerHTML=h;sb.scrollTop=sc}else openSheet(h)}
const spine=t=>{const B=(t.books||[]).slice(0,4).map(b=>String(b.t).replace(/\s*[\(\[:].*$/,'').trim()).filter(Boolean);return B.length>=2?B.join(',\n')+'.':''};
function igCapsTpl(t,txt){const tags=IGTAG+(t&&t.tone?' #'+String(t.tg||t.tone).replace(/[^\p{L}\p{N}]/gu,''):'');
  if(!t){const s=txt||'더숲에서 전합니다.';return{tags,caps:[{tone:'담백하게',caption:`${s}\n\n숲 가까이에서, 천천히.`},{tone:'감성 있게',caption:`${hooks(1).season||'요즘'}의 더숲.\n${s}\n\n오시는 길이 조금 쌀쌀해도, 안은 따뜻합니다.`},{tone:'정보 위주로',caption:`[안내] ${s}\n\n· 곳: 더숲 아카데미하우스\n· 문의: 프로필 링크`}]}}
  const q=popQ(t),wh=`${upBr(t.br||S.br)}${t.place?' · '+t.place:''}`,pre=txt?txt+'\n\n':'',sp=spine(t);
  return{tags,caps:[{tone:'담백하게',caption:`${t.title}\n\n${pre}${t.hook}\n\n이번 주 ${wh}에서.`},{tone:'감성 있게',caption:`${q||t.title}\n\n${pre}${t.hook}${sp?`\n\n평대 위 책등을 이어 읽으면 이런 문장이 됩니다.\n\n${sp}`:''}\n\n천천히 들러 펴 보세요.`},{tone:'정보 위주로',caption:`[이번 주 평대] ${t.title}\n\n${pre}${t.hook}\n\n· 곳: ${wh}\n· 책은 그때그때 바뀝니다. 매장에서 직접 골라 보세요.`}]}}
A.igMake=()=>igMake(false);
async function igMake(redraw){const G=S.ui.igG;if(!G||G.busy)return;const t=igTheme(),txt=(G.txt||'').trim();if(!G.ph.length&&!t&&!txt){toast('사진을 넣거나, 큐레이션을 고르거나, 한 줄 적어 주세요');return}
  if(!redraw){G.busy=1;igDraw();let o=null;
    if(AI&&G.ph.length){const r=await ask('igf',`사진 ${G.ph.length}장으로 서울 강북구 북한산 자락의 서점 · 문화공간 「더숲 아카데미하우스」(사유의숲 서점 · 씨앗숲 · 아트시네마 · 북스테이 · 카페) 인스타그램 피드를 만듭니다.\n${t?`[묶을 큐레이션] ${t.title} — ${t.hook}\n책: ${(t.books||[]).slice(0,6).map(b=>b.t).join(', ')}\n`:''}${txt?`[적어 준 내용] ${txt}\n`:''}[오늘] ${TODAY}\n규칙: 사진에 실제로 보이는 것(책 제목, 공간, 빛, 계절, 물건)을 근거로 씁니다. 사람의 얼굴 · 이름 · 나이는 말하지 않습니다. 보이지 않거나 적어 주지 않은 사실(가격, 시간, 할인, 수상, 줄거리 세부)은 지어내지 않습니다. 말투는 차분하게, 감성은 적당히, 장난은 가볍게. 이모지는 0~1개. 책 제목을 목록으로 늘어놓지 않습니다(책은 자주 바뀝니다). 대신 사진 속 책 제목들을 이어 한 문장을 만들거나, 주제와 관련된 문장 · 사실을 씁니다. 사실은 위에 적힌 내용과 널리 알려진 것만 쓰고 기사나 사건을 지어내지 않습니다.\nct 는 표지 제목 14자 안쪽, cs 는 표지 한 줄 30자 안쪽. caps 는 세 가지 말투(담백하게 / 감성 있게 / 정보 위주로) 각 150~300자, 첫 줄은 25자 안쪽으로 눈길을 끄는 문장. tags 는 해시태그 8~12개(한글 위주, #더숲 포함). alt 는 사진 설명 한 문장. order 는 피드에 올릴 사진 순서(0부터, 표지에 가장 맞는 사진 먼저).\nJSON 으로만: {"ct":"","cs":"","caps":[{"tone":"","caption":""}],"tags":"","alt":"","order":[0]}`,{images:G.ph.slice(0,6).map(p=>p.f)});
      if(r&&r.caps){o=r;if(Array.isArray(r.order)){const ord=r.order.filter(i=>Number.isInteger(i)&&i>=0&&i<G.ph.length);const rest=G.ph.map((_,i)=>i).filter(i=>!ord.includes(i));G.ph=[...new Set([...ord,...rest])].map(i=>G.ph[i])}}}
    if(!o){const tp=igCapsTpl(t,txt);o={ct:t?t.title:(txt.split(/[\n,.·—-]/)[0]||'더숲').slice(0,18),cs:t?(popQ(t)||t.hook):'',caps:tp.caps,tags:tp.tags}}
    G.out=o;G.busy=0}
  try{const cs=await igCanvases({t,ph:G.ph,fmt:G.fmt|0,ct:G.out.ct,cs:G.out.cs});G.cv=cs;G.out.urls=cs.map(c=>c.toDataURL('image/jpeg',.8))}catch(e){console.warn(e);toast('이미지를 만들지 못했습니다')}
  igDraw();if(!redraw){try{lvAdd('pop')}catch(e){}}}
A.igSave=async()=>{const G=S.ui.igG;if(!G||!G.cv)return;const t=igTheme();await upSaveMany(G.cv,'더숲_인스타_'+upName((G.out&&G.out.ct)||(t&&t.title)||TODAY))};
A.igCp=d=>{const G=S.ui.igG,c=G.out.caps[+d.i];copyText(c.caption+'\n\n'+(G.out.tags||''))};
async function igCanvases({t,ph,fmt,ct,cs}){await upFont();const [,W,H]=IGF[fmt|0],F='Pretendard,"Malgun Gothic",sans-serif',out=[];let lw=null,lg=null;try{lw=await upImg('logo-w.png');lg=await upImg('logo-g.png')}catch(e){}
  const TC=(t&&typeof TONEC!=='undefined'&&TONEC[t.tone])||['#003128','#f2eee3'],mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return[c,c.getContext('2d')]};
  const cover=(x,bm)=>{const s=Math.max(W/bm.width,H/bm.height),w=bm.width*s,h=bm.height*s;x.drawImage(bm,(W-w)/2,(H-h)/2,w,h)};
  const where=t?`${upBr(t.br||S.br)}${t.until?'  ·  '+mdw(t.until)+'까지':''}`:'더숲 아카데미하우스';
  if(ph.length){const [c,x]=mk();cover(x,ph[0].bm);const g=x.createLinearGradient(0,H*.38,0,H);g.addColorStop(0,'rgba(0,30,24,0)');g.addColorStop(1,'rgba(0,30,24,.9)');x.fillStyle=g;x.fillRect(0,0,W,H);
    const g2=x.createLinearGradient(0,0,0,240);g2.addColorStop(0,'rgba(0,0,0,.35)');g2.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g2;x.fillRect(0,0,W,240);if(lw)x.drawImage(lw,64,60,150,150*lw.height/lw.width);
    if(t&&(t.tg||t.tone)){x.font=`700 26px ${F}`;const tg=t.tg||t.tone,w=x.measureText(tg).width;x.fillStyle='#c9a24a';x.fillRect(W-64-w-32,56,w+32,48);x.fillStyle='#1c1c1a';x.fillText(tg,W-64-w-16,90)}
    x.font=`500 34px ${F}`;const SL=wrapW(x,cs||'',W-128,2);x.font=`800 ${ct&&ct.length>10?72:84}px ${F}`;const TL=wrapW(x,ct||'',W-128,3),lh=ct&&ct.length>10?84:96;
    let y=H-100-SL.length*48-(SL.length?24:0);x.fillStyle='#d9b45b';x.font=`600 26px ${F}`;x.fillText(where,64,H-64);x.fillStyle='rgba(242,238,227,.92)';x.font=`500 34px ${F}`;SL.forEach((s,i)=>x.fillText(s,64,y+24+i*48+40));
    x.fillStyle='#fff';x.font=`800 ${ct&&ct.length>10?72:84}px ${F}`;TL.slice().reverse().forEach((s,i)=>x.fillText(s,64,y-i*lh));out.push(c)}
  else{const [c,x]=mk();x.fillStyle=TC[0];x.fillRect(0,0,W,H);x.fillStyle='#c9a24a';x.fillRect(0,H-24,W,24);const lo=TC[1]==='#1c1c1a'?lg:lw;if(lo)x.drawImage(lo,72,72,150,150*lo.height/lo.width);
    if(t&&(t.tg||t.tone)){x.font=`700 26px ${F}`;const tg=t.tg||t.tone,w=x.measureText(tg).width;x.strokeStyle=TC[1];x.lineWidth=2;x.strokeRect(W-72-w-32,68,w+32,48);x.fillStyle=TC[1];x.fillText(tg,W-72-w-16,102)}
    x.fillStyle=TC[1];x.font=`800 92px ${F}`;const TL=wrapW(x,ct||'',W-144,3);const y0=H*(H>1400?.3:.26);TL.forEach((s,i)=>x.fillText(s,72,y0+i*108));let y=y0+TL.length*108+20;
    x.font=`500 38px ${F}`;x.globalAlpha=.9;wrapW(x,cs||'',W-144,3).forEach(s=>{x.fillText(s,72,y);y+=56});x.globalAlpha=1;
    if(t&&t.hook&&t.hook!==cs){x.font=`500 34px ${F}`;const HL=wrapW(x,t.hook,W-144,4);y=Math.max(y+40,H-140-HL.length*50);x.fillRect(72,y-44,80,4);x.globalAlpha=.85;HL.forEach((s,i)=>x.fillText(s,72,y+i*50));x.globalAlpha=1}
    x.font=`600 26px ${F}`;x.fillText(where,72,H-60);out.push(c)}
  ph.slice(1).forEach(p=>{const [c,x]=mk();cover(x,p.bm);if(lw){const w=110;x.globalAlpha=.9;x.drawImage(lw,W-w-48,H-48-w*lw.height/lw.width,w,w*lw.height/lw.width);x.globalAlpha=1}out.push(c)});
  if(t&&ph.length){const [c,x]=mk();x.fillStyle='#f2eee3';x.fillRect(0,0,W,H);x.fillStyle='#003128';x.font=`600 30px ${F}`;x.fillText('이번 주 평대',72,140);x.font=`800 60px ${F}`;const TT=wrapW(x,t.title,W-144,2);TT.forEach((s,i)=>x.fillText(s,72,230+i*74));
    let y=230+TT.length*74+70;x.fillStyle='#c9a24a';x.fillRect(72,y-40,80,6);x.fillStyle='#1c1c1a';x.font=`500 44px ${F}`;wrapW(x,t.hook||'',W-144,6).forEach(s=>{x.fillText(s,72,y+20);y+=66});
    const q=popQ(t);if(q){y+=40;x.fillStyle='#003128';x.font=`800 44px ${F}`;wrapW(x,q,W-144,2).forEach(s=>{x.fillText(s,72,y+20);y+=60})}
    if(lg)x.drawImage(lg,72,H-120,130,130*lg.height/lg.width);x.fillStyle='#003128';x.font=`600 26px ${F}`;const w=x.measureText(where).width;x.fillText(where,W-72-w,H-80);out.push(c)}
  return out}

/* ── 가득 채우기(내부 지침: 빈틈없이 채우되, 군데군데 포인트를 다르게 — 세운 표지 · 높은 더미 · 메인. 설명은 짧게) ── */
(()=>{const g0=dpBuild;dpBuild=function(g,t,md,tmp){const P=g0(g,t,md,tmp);try{if(!S.ui.dpFull||S.ui.dpF||!P||!P.it)return P;const ov={...((S.ui.dpAbs||{})[dpPosK(t)]||{}),...(tmp||{})};const W=P.W,D=P.D,st=P.it.filter(i=>i.k==='stack');if(!st.length)return P;
  const keep=P.it.filter(i=>i.k!=='stack'&&i.k!=='face'&&i.k!=='show'),bw=150,bd=210,gx=14,gy=18,m0=22,cols=Math.max(1,Math.floor((W-2*m0+gx)/(bw+gx))),rowsN=Math.max(1,Math.floor((D-2*m0-30+gy)/(bd+gy))),ox=(W-(cols*(bw+gx)-gx))/2,oy=m0+30;
  const hit=(x,y)=>keep.some(o=>{const ow=o.k==='pop'?210:o.k==='table'?0:110,od=o.k==='pop'?40:o.k==='table'?0:60;return ow&&x<o.x+ow&&x+bw>o.x&&y<o.y+od&&y+bd>o.y});
  let cells=[];for(let r=0;r<rowsN;r++)for(let c=0;c<cols;c++){const x=ox+c*(bw+gx),y=oy+r*(bd+gy);if(!hit(x,y))cells.push({x,y,r,c})}
  const cx=W/2,cy=D*.55;cells.sort((a,b)=>Math.hypot(a.x+bw/2-cx,a.y+bd/2-cy)-Math.hypot(b.x+bw/2-cx,b.y+bd/2-cy));
  const byN={};st.forEach(i=>{byN[i.n]=i});const pk=P.pk||[],ordAll=S.ui.dpOrd||pk,ordN=ordAll.map(bi=>pk.indexOf(bi)+1).filter(n=>n>0&&byN[n]);st.forEach(i=>{if(!ordN.includes(i.n))ordN.push(i.n)});
  const mainN=P.main!=null?pk.indexOf(P.main)+1:ordN[0],seq=[mainN,...ordN.filter(n=>n!==mainN)],out=[],cnt={},ob=S.ui.dpObj||{};
  cells.forEach((cl,k)=>{const n=k<seq.length?seq[k]:seq[(k-seq.length)%Math.max(1,Math.min(seq.length,Math.ceil(seq.length/2)))+0];const b=byN[n];if(!b)return;cnt[n]=(cnt[n]||0)+1;
    const first=cnt[n]===1,pt=k===0?'main':(k%4===2&&cl.r===0)?'face':(k%5===3)?'tall':'';
    const s2={...b,x:cl.x,y:cl.y,rot:(S.ui.dpFree!==false&&pt!=='main')?((((n*47+k*13)%11)-5)*Math.PI/180):0,h:pt==='tall'||pt==='main'?140:80,id:first?b.id:('f'+n+'_'+cnt[n]),pt};
    s2.main=pt==='main';s2.band=pt==='main'&&!!ob.band;const a=ov[s2.id];if(a){if(s2.id[0]==='f'&&(a[0]+75<0||a[1]+105<0||a[0]+75>W||a[1]+105>D))return;s2.x=Math.max(0,Math.min(W-bw,a[0]));s2.y=Math.max(0,Math.min(D-bd,a[1]))}
    out.push(s2);if(pt==='face'||pt==='main')out.push({k:'face',x:s2.x,y:Math.max(0,s2.y-30),c:b.c,n,fid:s2.id})});
  const mi=out.find(i=>i.main);if(mi&&ob.show){const a=ov.show;out.push({k:'show',id:'show',x:a?a[0]:Math.min(W-110,mi.x+bw-40),y:a?a[1]:Math.min(D-20,mi.y+bd-20)})}
  P.it=[...keep,...out];const R={};out.forEach(i=>{if(i.k!=='stack')return;const o=R[i.n]=R[i.n]||{c:0,q:0,p:[]};o.c++;o.q+=Math.round(i.h/20);if(i.pt)o.p.push(i.pt)});out.forEach(i=>{if(i.k==='face'&&R[i.n])R[i.n].q++});
  const PN={main:'메인',face:'세우기',tall:'높게'};P.rows.forEach(r=>{const o=R[r.n];if(!o){r.qty=0;r.place='—';return}r.qty=o.q;r.place=`${o.c}칸${o.p.length?' · '+[...new Set(o.p)].map(x=>PN[x]).join(' · '):''}`});
  P.total=P.rows.reduce((a,r)=>a+r.qty,0);P.full={cells:out.filter(i=>i.k==='stack').length};P.tips=['빈칸 없이 채우고, 포인트 자리만 다르게 놓습니다.'];}catch(e){console.warn(e)}return P}})();
/* 놓는 법 설명은 짧게 */
(()=>{const g=dpPlan;dpPlan=function(t,m){const P=g(t,m);try{(P.rows||[]).forEach(r=>{if(r.place)r.place=String(r.place).replace(/^메인\s*—\s*한 권 세우고\s*(\d+)권 높이로.*$/,'메인 · 세우고 $1권').replace(/[,.]\s*(반듯하게|조금|살짝|설명은).*$/,'')});if(P.tips)P.tips=P.tips.slice(0,2)}catch(e){}return P}})();
A.dpReset=(f=>d=>{S.ui.dpFull=false;return f(d)})(A.dpReset);

/* 가득 채우기: 세운 칸이 아닌 같은 책 칸에 「세움」 표시가 붙지 않게 */
(()=>{const f=dpTop;dpTop=function(P){let h=f(P);try{if(!P||!P.full)return h;const fids=new Set(P.it.filter(i=>i.k==='face'&&i.fid).map(i=>i.fid));P.it.forEach(i=>{if(i.k!=='stack'||fids.has(i.id))return;const k=h.indexOf(`data-id="${i.id}"`);if(k<0)return;const e=h.indexOf('<title>',k);if(e<0)return;let seg=h.slice(k,e);seg=seg.replace(' · 세움</text>','</text>').replace(new RegExp(`<rect x="${i.x}" y="${i.y-26}" width="150" height="22"[^>]*/>`),'');h=h.slice(0,k)+seg+h.slice(e)})}catch(e){}return h}})();

/* ── 전수 점검(11/12 밤) ── */
/* 서점 기초: 닫기 · 탭 · 장 목록을 위에 고정, 장으로 가면 제목이 가리지 않게 */
(()=>{const g=gdDraw;gdDraw=function(){g.apply(this,arguments);try{const G=$('guide');if(!G||!G.classList.contains('bs'))return;const B=G.querySelector('.gdb.bsb');if(!B||B.querySelector('.bshead'))return;
  const h=document.createElement('div');h.className='bshead';const x=B.querySelector('.gdx'),t=B.querySelector('.gdtab'),n=B.querySelector('.bsnav');if(t)h.append(t);if(x)h.append(x);if(n)h.append(n);B.prepend(h)}catch(e){console.warn(e)}}})();
A.bsGo=d=>{const e=document.getElementById('bs-'+d.id),G=$('guide'),h=G&&G.querySelector('.bshead');if(!e||!G)return;G.scrollTo({top:e.getBoundingClientRect().top-G.getBoundingClientRect().top+G.scrollTop-(h?h.offsetHeight:0)-8,behavior:'smooth'});
  document.querySelectorAll('.bsnav button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.id===d.id))};
/* 아래에서 올라오는 창: 맨 위에 늘 보이는 닫기 */
(()=>{const sb=$('sheetBox');if(!sb||!window.MutationObserver)return;const put=()=>{if(sb.firstElementChild&&sb.firstElementChild.classList.contains('shx'))return;const b=document.createElement('button');b.className='shx';b.dataset.a='close';b.setAttribute('aria-label','닫기');b.textContent='닫기 ✕';sb.prepend(b)};new MutationObserver(m=>{if(!m.some(r=>[...r.addedNodes].some(n=>n.classList&&n.classList.contains('shx'))))put()}).observe(sb,{childList:true})})();
/* 직원 화면에서 쓸 일 없는 칸 숨기기 · 이름 붙이기 */
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const mn=document.querySelector('main');if(!mn||S.locked)return;
  mn.querySelectorAll('.pcard .blist em').forEach(e=>{if(e.textContent.trim()==='?'){e.textContent='없음';e.title='이 지점 재고에 없음'}});
  if(!isAdmin()&&S.mode==='aka'&&S.view.aka==='insta'){mn.querySelectorAll('.card').forEach(c=>{const h=c.querySelector('h3');if(h&&/인사이트|운영 숫자/.test(h.textContent))c.style.display='none'});mn.querySelectorAll('.empty,.note').forEach(e=>{if(/인사이트를 아직/.test(e.textContent))e.style.display='none'});mn.querySelectorAll('.subnav [data-v="naver"],.subnav [data-t="naver"]').forEach(b=>b.style.display='none')}
  const dz=mn.querySelector('.grid.dz'),cp=dz&&dz.previousElementSibling;
  if(dz){const form=dz.querySelector(':scope>.card.form'),box=dz.querySelector('.uedb');if(form&&box){[...form.children].forEach(c=>{if(!c.classList.contains('ukind')&&!(c.classList.contains('chips')&&c.offsetHeight===0))box.append(c)});form.style.display='none'}
    const qb=mn.querySelector('.qbar');if(qb&&qb.querySelector('[data-k="akTn"]')&&!mn.querySelector('.ulab'))qb.insertAdjacentHTML('beforebegin','<p class="ulab">어떤 주제로 만들까요 — 고르면 아래 인쇄물에 바로 들어갑니다</p>')}
  }catch(e){console.warn(e)}}})();
