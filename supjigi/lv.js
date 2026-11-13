'use strict';
/* 더숲 워크룸 — 관리자만 보는 메뉴(매출 · 주문/반품/순위 · 일정), 단계(1 책 고르는 사람 → 2 코너 큐레이터 → 3 공간 기획자), 서점 기초 그림 예시
   열쇠는 번호가 아니라 바꾼 값(해시)만 여기에 둔다. 비어 있으면 그 열쇠는 아직 없는 것. */
const LVK={adm:'c9c6e7270b84e1fe95a4695de4374d0374d569f3071cf04939eefdd2399688d2',2:'dc34ea1889a08bf4b8ad5750fefc8a43379564aba9ed52da3a51d22f298bda27',3:'105aadda5a5bb5e9aeab64f0d71b1ba2c0ff122a3a195f9ae408006a06ca2339'};
const LVN=['','책 고르는 사람','코너 큐레이터','공간 기획자'];
const LVREQ={2:{cur:10,pop:5,dp:3,days:5},3:{cur:30,pop:15,dp:10,vid:3,send:3,days:14}};
const LVLAB={cur:'큐레이션 만들기',pop:'인쇄물 만들기',dp:'진열안 저장',vid:'한 바퀴 영상',send:'다른 지점과 주고받기',days:'사용한 날'};
const LVGET={1:['6종 평대','진열 방법 세 가지','POP · 쇼카드 · 띠지','3D 돌려 보기 · 말로 옮기기 · 한 바퀴 영상'],2:['10종 큰 평대(120×90cm)','진열 방법 아홉 가지 전체','벽 서가','꽃병 · 손글씨 쪽지','POP 느낌 아홉 가지 전체','3주 연작 주제(문 열기 → 깊이 → 넓히기)'],3:['평대 크기 직접 고르기(180×90cm 까지)','더미 높이를 한 권씩 조절','무대 색 바꾸기(밝은 나무 · 짙은 무대 · 흰 무대)','4주 계절 기획(주마다 바뀌는 네 평대)']};
const lvS=()=>{const s=ls.get('lv',{});return{cur:0,pop:0,dp:0,vid:0,send:0,days:[],words:[],...s}};
const lvAdd=(k,w)=>{const s=lvS();if(k==='cur'){w=String(w||'').trim().slice(0,30);if(!w||s.words.includes(w))return;s.words=[w,...s.words].slice(0,60);s.cur++}else s[k]=(s[k]||0)+1;ls.set('lv',s)};
const lvVal=(s,k)=>k==='days'?s.days.length:(s[k]||0);
const isAdmin=()=>!!LVK.adm&&ls.get('kAdm','')===LVK.adm;
const lvNow=()=>{if(isAdmin())return 3;const k=ls.get('kLv',{});return LVK[3]&&k[3]===LVK[3]?3:LVK[2]&&k[2]===LVK[2]?2:1};
const lvReady=n=>{const s=lvS(),R=LVREQ[n];return !!R&&Object.keys(R).every(k=>lvVal(s,k)>=R[k])};
const keyHash=async(kind,v)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('theforest-key:'+kind+':'+v)))].map(b=>b.toString(16).padStart(2,'0')).join('');
(()=>{const s=lvS();if(!s.days.includes(TODAY)){s.days=[...s.days,TODAY].slice(-120);ls.set('lv',s)}})();

/* ── 관리자만 보는 화면 ── */
const HID={store:['ana','stock','today','rank','ret','data','biz','talk','club'],aka:['today','cal','talk']};
(()=>{const f=navList;navList=function(){const L=f();return isAdmin()?L:L.filter(t=>!(HID[t[2]]||[]).includes(t[0]))}})();
(()=>{const r=render;render=function(){if(!S.locked&&!isAdmin()){if(S.ui.mkTab&&S.ui.mkTab!=='p')S.ui.mkTab='p';const m=S.mode,v=S.view[m];if((HID[m]||[]).includes(v)){if(m==='aka'){S.mode='store';S.br='aka'}S.view.store='cur';if(S.loaded&&!S.ui.hidT){S.ui.hidT=1;setTimeout(()=>{S.ui.hidT=0;toast('이 화면은 테스트 중입니다. 며칠만 기다려 주세요.')},50)}}}
  r.apply(this,arguments);try{if(isAdmin())return;const mn=document.querySelector('main');if(mn)mn.querySelectorAll('.subt [data-a="mkTab"]').forEach(b=>{const s=b.parentElement;if(s)s.remove()});if(mn)mn.querySelectorAll('[data-a="dKind"][data-k="rent"],[data-a="dKind"][data-k="sign"],[data-a="curOrder"],[data-a="go"][data-v="club"]').forEach(b=>b.remove());if(mn&&S.mode==='store'&&S.view.store==='cur')mn.querySelectorAll(':scope>details.fold:not(.hmore)').forEach(b=>b.remove());if(mn)mn.querySelectorAll('button.mrow[data-a="go"]').forEach(b=>{if(HID.store.includes(b.dataset.v))b.remove()})}catch(e){}}})();
(()=>{const g=A.gGo;A.gGo=async d=>{const el=$('gIn'),v=((d&&d.v)||(el&&el.value)||'').trim();if(v&&!isAdmin()&&typeof G_SCHED!=='undefined'&&G_SCHED.test(v)&&!(typeof G_NOTE!=='undefined'&&G_NOTE.test(v))){toast('일정 넣기는 테스트 중입니다. 며칠만 기다려 주세요.');return}if(v)lvAdd('cur',v);return g(d)}})();
/* 가이드: 관리자가 아니면 일정 · 매출 장을 빼고 안내 한 줄 */
if(!isAdmin()){for(let i=GDS.length-1;i>=0;i--)if(GDS[i][0]==='b'||GDS[i][0]==='d'||GDS[i][0]==='c')GDS.splice(i,1)}
if(!isAdmin())GDS.push(['z','곧 열립니다','주문 · 반품 · 매출 · 지원사업']);
let gdTy=0;
(()=>{const g=gdDraw;gdDraw=function(){g.apply(this,arguments);try{const G=$('guide');if(!G)return;const gt=G.querySelector('.gdtab');if(gt&&!gt.querySelector('[data-a=lvFromGd]'))gt.insertAdjacentHTML('beforeend','<button data-a="lvFromGd">내 단계</button>');G.classList.toggle('gdfit',!G.classList.contains('bs'));if(G.classList.contains('bs'))return;const gi=S.ui.gd|0,k=(GDS[gi]||[])[0],last=gi===GDS.length-1;
  const B=G.querySelector('.gdb'),im0=G.querySelector('.gdi img');if(im0){im0.dataset.a=last?'gdClose':'gdGo';im0.dataset.d='1'}
  if(B&&k==='f'&&!B.querySelector('.gdwhy')){const p=B.querySelector('p');if(p)p.insertAdjacentHTML('afterend','<div class="gdwhy"><b>왜 3D인가</b> 평면 그림은 자리만 보입니다. 높이, 서로 가리는 표지, 고객 눈에 먼저 닿는 책은 돌려 봐야 보입니다. 놓기 전에 보면 두 번 옮기지 않습니다.</div>')}
  if(B&&last&&!B.querySelector('.gdnx')){const nx=document.createElement('div');nx.className='gdnx';nx.innerHTML='<button class="gdgo" data-a="gdClose">시작하기</button>';B.append(nx)}
  if(k==='z'){const im=G.querySelector('.gdi img');if(im)im.outerHTML=`<div class="gdz">${[['주문 · 반품','팔린 만큼 셈해 주문에 담고, 반품할 책은 사진만 찍으면 자동으로 반품 등록'],['매출','숫자 대신 이번 주 할 일 세 가지로 알려 줍니다'],['지원사업','공모 일정과 신청 기록을 한곳에 모읍니다']].map(([a,b])=>`<div><b>${a}</b><span>${b}</span><em>테스트 중</em></div>`).join('')}<p>시스템 테스트 중입니다. 며칠만 기다려 주세요.</p></div>`}
  const h=G.querySelector('.gdb h2');if(h){const t=h.textContent,id=++gdTy;h.textContent='';h.classList.add('gdty');let n=0;const st=()=>{if(id!==gdTy||!h.isConnected)return;h.textContent=t.slice(0,++n);if(n<t.length)setTimeout(st,28);else setTimeout(()=>h.classList.add('done'),600)};st()}}catch(e){}}})();

/* ── 쓴 만큼 세기 ── */
(()=>{const m=mkKeep;mkKeep=function(D){const n=made().length;m.apply(this,arguments);if(made().length!==n||n===0)lvAdd('pop')};
  const p=A.dpPng;A.dpPng=async function(){lvAdd('dp');return p.apply(this,arguments)};
  const v=A.d3rec;A.d3rec=function(){lvAdd('vid');lvAdd('dp');return v.apply(this,arguments)};
  ['sendTo','peekAdd'].forEach(k=>{const f=A[k];if(f)A[k]=function(){lvAdd('send');return f.apply(this,arguments)}})})();

/* ── 단계 화면 ── */
function lvBar(n){const s=lvS(),R=LVREQ[n];return Object.keys(R).map(k=>{const v=Math.min(lvVal(s,k),R[k]);return `<div class="lvr"><span>${LVLAB[k]}</span><div class="lvb"><i style="width:${Math.round(v/R[k]*100)}%"></i></div><b>${v}/${R[k]}</b></div>`}).join('')}
A.lvOpen=()=>{const L=lvNow(),nx=L<3?L+1:0;
  openSheet(`<h3>${L}단계 · ${LVN[L]}</h3><p class="note">큐레이션과 진열을 써 볼수록 다음 단계가 열립니다. 조건을 채우고 신청하면 참부장이 만든 것을 보고 열쇠를 드립니다.</p>
   <div class="lvs">${[1,2,3].map(n=>`<div class="lvc${n<=L?' on':''}${n===L?' cur':''}"><em>${n}</em><b>${LVN[n]}</b><ul>${LVGET[n].map(x=>`<li>${n<=L?x:'<u>잠김</u> ? ? ?'}</li>`).join('')}</ul></div>`).join('')}</div>
   ${nx?`<h4>${nx}단계 「${LVN[nx]}」까지</h4>${lvBar(nx)}
   <div class="btns"><button class="btn pri" data-a="lvAsk" ${lvReady(nx)?'':'disabled'}>${lvReady(nx)?'승급 신청 카드 만들기':'조건을 채우면 신청할 수 있습니다'}</button></div>
   <p class="note">신청 카드(그림)를 카카오톡으로 참부장에게 보내 주세요. 허가되면 받은 열쇠를 아래에 넣습니다.</p>`:`<p class="note">가장 높은 단계입니다.</p>`}
   <div class="dpcmd" style="margin-top:14px"><input id="lvKeyIn" type="password" inputmode="numeric" autocomplete="off" placeholder="받은 열쇠 넣기"><button class="btn sm pri" data-a="lvKey">열기</button></div>
   <details class="lvm"><summary>열쇠 만들기 (관리자용)</summary><p class="note">정한 번호를 넣으면 바꾼 값이 나옵니다. 번호가 아니라 이 값을 앱에 넣어 두므로, 번호는 어디에도 남지 않습니다.</p>
   <div class="lvmk"><label>① 무엇의 열쇠<select id="lvMkK"><option value="adm">관리자</option><option value="2">2단계</option><option value="3">3단계</option></select></label><label>② 정할 번호 (서로 다르게)<input id="lvMkIn" type="text" inputmode="numeric" autocomplete="off" name="lvmk-n" placeholder="여기에 번호를 누르세요"></label><button class="btn pri" data-a="lvMake">③ 값 만들기</button><textarea id="lvMkOut" readonly rows="3" placeholder="여기에 값이 나옵니다"></textarea><button class="btn" data-a="lvCopy">④ 값 복사하기</button></div></details>
   <div class="btns"><button class="btn" data-a="close">닫기</button></div>`)};
A.lvKey=async()=>{const v=($('lvKeyIn')||{}).value||'';if(!v)return;for(const k of ['adm','2','3']){if(LVK[k]&&await keyHash(k,v)===LVK[k]){if(k==='adm')ls.set('kAdm',LVK.adm);else ls.set('kLv',{...ls.get('kLv',{}),[k]:LVK[k]});toast(k==='adm'?'관리자 화면을 엽니다':`${k}단계 「${LVN[k]}」가 열렸습니다`);setTimeout(()=>location.reload(),700);return}}toast('열쇠가 맞지 않습니다')};
A.lvCopy=async()=>{const o=$('lvMkOut'),v=o.value;if(!v){toast('먼저 값을 만들어 주세요');return}try{await navigator.clipboard.writeText(v)}catch(e){o.focus();o.select();try{document.execCommand('copy')}catch(e2){}}toast('복사했습니다. 대화창에 붙여 넣어 보내 주세요')};
A.lvMake=async()=>{const k=$('lvMkK').value,v=$('lvMkIn').value.trim();if(!v){toast('② 칸에 번호를 넣어 주세요');$('lvMkIn').focus();return}$('lvMkOut').value=`${k==='adm'?'관리자':k+'단계'}: ${await keyHash(k,v)}`;$('lvMkIn').value=''};
A.lvAsk=()=>{const L=lvNow(),nx=L+1,s=lvS(),R=LVREQ[nx];if(!R||!lvReady(nx))return;const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d'),F='Pretendard,"Malgun Gothic",sans-serif';
  x.fillStyle='#003128';x.fillRect(0,0,1080,300);x.fillStyle='#c9a24a';x.fillRect(0,1290,1080,60);x.fillStyle='#fcfcfa';x.fillRect(0,300,1080,990);
  x.fillStyle='#f2eee3';x.font=`600 30px ${F}`;x.fillText('더숲 워크룸 · 승급 신청',70,100);x.font=`800 76px ${F}`;x.fillText(`${nx}단계 ${LVN[nx]}`,70,210);
  x.fillStyle='#1a1a1a';x.font=`600 30px ${F}`;x.fillText(`${plName?plName(S.br):S.br} · ${TODAY} · 지금 ${L}단계`,70,380);let y=470;
  Object.keys(R).forEach(k=>{x.font=`500 34px ${F}`;x.fillStyle='#1a1a1a';x.fillText(LVLAB[k],70,y);x.font=`800 34px ${F}`;x.textAlign='right';x.fillText(`${lvVal(s,k)}  /  ${R[k]}`,1010,y);x.textAlign='left';x.fillStyle='#d9d6cc';x.fillRect(70,y+18,940,4);y+=84});
  x.fillStyle='#6b6b66';x.font=`600 28px ${F}`;x.fillText('최근에 만든 큐레이션 단어',70,y+30);x.fillStyle='#1a1a1a';x.font=`500 30px ${F}`;let lx=70,ly=y+86;s.words.slice(0,18).forEach(w=>{const tw=x.measureText(w).width+36;if(lx+tw>1010){lx=70;ly+=58}x.strokeStyle='#003128';x.lineWidth=2;x.strokeRect(lx,ly-36,tw-10,48);x.fillText(w,lx+13,ly);lx+=tw});
  x.fillStyle='#3a2f1c';x.font=`400 22px ${F}`;x.fillText('Planned by 쿼부장',840,1328);
  c.toBlob(b=>{if(b){saveFile(`더숲_승급신청_${nx}단계_${TODAY}.png`,b);toast('신청 카드를 저장했습니다. 카카오톡으로 참부장에게 보내 주세요.')}},'image/png')};
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const t=document.querySelector('.gdtop');if(t&&!t.querySelector('.lvbtn')){const L=lvNow(),b=document.createElement('button');b.className='btn sm lvbtn';b.dataset.a='lvOpen';b.innerHTML=`<em>${L}</em>${LVN[L]}`;b.textContent='도움말';b.dataset.a='gdOpen';t.innerHTML='';t.append(b)}
  Promise.resolve().then(()=>{try{const mn=document.querySelector('main'),w=mn&&mn.querySelector(':scope>.wall');if(w&&!mn.querySelector('.hmore')){const els=['.rfr','.sec.pks','.chips.pkc','.lvplan'].map(s=>mn.querySelector(':scope>'+s)).filter(Boolean);if(els.length){const d=document.createElement('details');d.className='fold hmore';d.open=!!S.ui.hmO;d.innerHTML='<summary>바꾸기 · 다른 지점 큐레이션 · 계절 기획</summary>';const bx=document.createElement('div');bx.className='hmb';bx.append(...els);d.append(bx);d.addEventListener('toggle',()=>{S.ui.hmO=d.open});const an=w.nextElementSibling&&w.nextElementSibling.nextElementSibling&&w.nextElementSibling.nextElementSibling.classList.contains('btns')?w.nextElementSibling.nextElementSibling:w;an.after(d)}}}catch(e){}});
  }catch(e){}}})();
A.lvFromGd=()=>{A.gdClose();A.lvOpen()};A.dpEx=d=>{const el=$('dpCmd');if(!el)return;el.value=d.c;A.dpCmd()};
(()=>{const f=A.dpOpen;A.dpOpen=d=>{f(d);try{const box=document.querySelector('#sheetBox .dpe');if(!box||S.ui.dpF)return;const st=$('dpStage');if(st)st.style.display='none';
  const how=box.querySelector('.dphow'),cmd=box.querySelector('.dpcmd'),v=box.querySelector('.dpv'),bk=$('dpBks'),chs=[...box.querySelectorAll(':scope>.chips')];if(!v||!cmd||!bk)return;
  box.prepend(v);v.after(bk);bk.after(cmd);const ci=$('dpCmd');if(ci)ci.placeholder='말로 옮기기';
  const ex=document.createElement('div');ex.className='dpex';ex.innerHTML=['1번 맨 앞으로','1번이랑 2번 바꿔','한 바퀴','위에서','처음 배치로'].map(c=>`<button class="chip" data-a="dpEx" data-c="${c}">${c}</button>`).join('');cmd.after(ex);
  const m=document.createElement('details');m.className='fold dpmore';m.open=!!S.ui.dpMo;m.innerHTML='<summary>더 보기 · 오브제 · 진열 방식 · 사용법</summary>';m.append(...chs,...(how?[how]:[]));m.addEventListener('toggle',()=>{S.ui.dpMo=m.open});ex.after(m);const sb=$('sheetBox');m.append(...sb.querySelectorAll(':scope>.tw,:scope>ol.steps,:scope>p.note'));const bt=sb.querySelector(':scope>.btns');if(bt){if(!isAdmin()){const o=bt.querySelector('[data-a="dpOrder"]');if(o)o.remove()}const pg=bt.querySelector('[data-a="dpPng"]');if(pg){pg.textContent='그림 저장';pg.classList.remove('pri')}if(!bt.querySelector('[data-a="dpSend"]'))bt.insertAdjacentHTML('afterbegin','<button class="btn pri" data-a="dpSend">직원에게 보내기</button>')}const v0=box.querySelector('.dpv');if(v0&&!box.querySelector('.dprec'))v0.insertAdjacentHTML('beforebegin','<button class="dprec" data-a="dpRec"><b>추천 배치</b><span>재고 · 판매 · 종수를 보고 알아서 놓습니다</span></button>');}catch(e){}}})();

/* ── 단계에 따라 열리는 진열 기능 ── */
const lvLock=n=>{toast(`${n}단계 「${LVN[n]}」에서 열립니다`);return false};
(()=>{const pk=A.dpPk;A.dpPk=d=>{const t=S.ui.cor[S.ui.dp.i],L=dpPick(t);if(!L.includes(+d.i)&&L.length>=6&&lvNow()<2)return lvLock(2);return pk(d)};
  const md=A.dpMode;A.dpMode=d=>{if(+d.v>=3&&lvNow()<2)return lvLock(2);return md(d)};
  const fx=A.dpFix;A.dpFix=d=>{if(+d.v===1&&lvNow()<2)return lvLock(2);return fx(d)};
  const ob=A.dpOb;A.dpOb=d=>{if((d.k==='vase'||d.k==='note')&&lvNow()<2)return lvLock(2);return ob(d)}})();
const DPSZ3=[[0,0,'자동'],[600,600,'60×60'],[900,900,'90×90'],[1200,900,'120×90'],[1500,900,'150×90'],[1800,900,'180×90']];
const D3TH=[['밝은 나무',{a:'#f6f3ec',b:'#e9e4d8',top:'#d8c29a',leg:'#a8895c',rim:'#bfa275'}],['짙은 무대',{a:'#2b2b28',b:'#161614',top:'#3d3a34',leg:'#22201c',rim:'#2e2b26'}],['흰 무대',{a:'#ffffff',b:'#eef0f1',top:'#f4f4f2',leg:'#c9cbcc',rim:'#dcdedf'}]];
A.dpSz3=d=>{const z=DPSZ3[+d.i];S.ui.dpSzO=z&&z[0]?[z[0],z[1]]:null;const t=S.ui.cor[S.ui.dp.i],ps=S.ui.dpAbs||{};delete ps[dpPosK(t)];dpRe()};
A.dpQ=d=>{const t=S.ui.cor[S.ui.dp.i],k=dpPosK(t),Q=S.ui.dpQ||{},o={...(Q[k]||{})},P=dpPlan(t,S.ui.dpM||0),c=P.it.find(i=>i.k==='stack'&&i.id===d.id);if(!c)return;o[d.id]=Math.max(1,Math.min(12,Math.round(c.h/20)+(+d.d)));Q[k]=o;S.ui.dpQ=Q;dpRe()};
A.dpTh=d=>{S.ui.dpTh=+d.i;dpRe()};
(()=>{const f=A.dpOpen;A.dpOpen=d=>{f(d);const box=document.querySelector('#sheetBox .dpe');if(!box||(S.ui.dpF||0))return;const L=lvNow(),t=S.ui.cor[S.ui.dp.i],x=document.createElement('div');x.className='dp3x';
  if(L<3)x.innerHTML=`<p class="note"><u>잠김</u> 3단계 「${LVN[3]}」에서 평대 크기 · 더미 높이 · 무대 색을 직접 고릅니다. <button class="lnk" data-a="lvOpen">내 단계 보기</button></p>`;
  else{const P=dpPlan(t,S.ui.dpM||0),so=S.ui.dpSzO,th=S.ui.dpTh||0;x.innerHTML=`<div class="chips"><span class="note">평대 크기</span>${DPSZ3.map((z,i)=>`<button class="chip" data-a="dpSz3" data-i="${i}" aria-pressed="${so?so[0]===z[0]&&so[1]===z[1]:i===0}">${z[2]}</button>`).join('')}</div>
    <div class="chips"><span class="note">무대</span>${D3TH.map((z,i)=>`<button class="chip" data-a="dpTh" data-i="${i}" aria-pressed="${th===i}">${z[0]}</button>`).join('')}</div>
    <div class="chips"><span class="note">더미 높이</span>${P.it.filter(i=>i.k==='stack').map(i=>`<span class="dpq"><b>${i.n}</b><button data-a="dpQ" data-id="${i.id}" data-d="-1" aria-label="${i.n}번 한 권 줄이기">−</button>${Math.round(i.h/20)}권<button data-a="dpQ" data-id="${i.id}" data-d="1" aria-label="${i.n}번 한 권 늘리기">+</button></span>`).join('')}</div>`}
  box.append(x);if(typeof D3C!=='undefined'&&D3C.theme){D3C.theme(D3TH[L>=3?(S.ui.dpTh||0):0][1])}}})();

/* ── 서점 기초: 진열 그림 예시 ── */
function bsFigs(){try{const B=['코스모스','소년이 온다','아몬드','사피엔스','모순','데미안'].map(t=>({t})),keep=[S.ui.dpObj,S.ui.dpSzO];S.ui.dpObj={};S.ui.dpSzO=null;
  const fig=(svg,cap)=>`<figure>${svg.replace(/style="width:100%[^"]*"/,'style="width:100%;height:auto;background:#f7f5ef"')}<figcaption>${cap}</figcaption></figure>`;
  const a=dpSVG(dpBuild(dpG0,{title:'예시 · 여섯 권',books:B},3)),b=dpSVG(dpBuild(dpG0,{title:'예시 · 세 권',books:B.slice(0,3)},2)),c=dpSVG(dpBuild(dpG0,{title:'예시 · 들쭉날쭉',books:B},0)),d=shelfPlan({title:'예시 · 서가',books:B},0).svg;
  S.ui.dpObj=keep[0];S.ui.dpSzO=keep[1];
  return `<h4>그림으로 보기</h4><div class="bsfg">${fig(a,'<b>6종 · 90×90cm · 계단처럼</b> 뒷줄은 높게 세우고 앞줄은 낮게. 어디서 봐도 모든 표지가 보입니다.')}${fig(b,'<b>3종 · 60×60cm · 돋보이게</b> 책이 적으면 자리도 작게. 한 권은 표지가 보이게 세웁니다.')}${fig(c,'<b>6종 · 무심하게</b> 높이를 1~4권으로 다르게, 모서리를 일부러 맞추지 않습니다.')}${fig(d,'<b>벽 서가 · 면진열</b> 눈높이 칸에 표지를 앞으로. 아래 칸은 책등으로 꽂습니다.')}</div>`}catch(e){return ''}}

/* ── 사례 · 시장 흐름: 「오늘의 소식」을 펼치면 맨 위에. 사례마다 우리 지점에서 해 볼 것과 평대 만들기 ── */
A.caseMake=async d=>{const c=CASES[+d.i];if(!c)return;S.ui.tkOpen=false;lvAdd('cur',c.w);await A.ideaGo({v:c.w});window.scrollTo(0,0);setTimeout(()=>toast(`「${c.w}」로 평대 하나를 만들었습니다. 맨 앞 표지입니다`),300)};
(()=>{const f=newsPanel;newsPanel=function(){const h=f(),cs=typeof CASES==='undefined'?'':`<div class="sec"><h2>사례 · 시장 흐름</h2></div><div class="wgrid">${CASES.map((c,i)=>`<article class="wn"><p class="wnm"><b>${esc(c.c)}</b> · ${esc(c.src)} · ${esc(c.d)}</p><h3>${esc(nb(c.t))}</h3><p class="wns">${esc(nb(c.sum))}</p><p class="wnw"><b>우리 지점에서</b> ${esc(nb(c.do))}</p><div class="wna"><button class="btn sm pri" data-a="caseMake" data-i="${i}">「${esc(c.w)}」로 평대 만들기</button><a class="btn sm" href="${c.url}" target="_blank" rel="noopener">원문</a></div></article>`).join('')}</div><div class="sec"><h2>오늘의 소식</h2></div>`;return h.replace('<div class="tkpn">','<div class="tkpn">'+cs)}})();
/* 가이드 셋째 장: 쓸수록 열리는 세 단계 */
GDS.splice(2,0,['h','> 다음 단계: ???','쓸수록 열립니다. 2단계와 3단계는 가 본 사람만 압니다']);

/* ── 만들기 · 주제 고도화: POP 느낌(1단계 3가지 → 2단계 9가지), 2단계 3주 연작, 3단계 4주 계절 기획 ── */
(()=>{const f=A.dSt;A.dSt=d=>{if(+d.v>=3&&lvNow()<2)return lvLock(2);return f(d)};
  const r=render;render=function(){r.apply(this,arguments);try{const L=lvNow();
    if(L<2)document.querySelectorAll('.feels button').forEach((b,i)=>{if(i>=3&&!b.querySelector('.lkb')){b.classList.add('lk');b.insertAdjacentHTML('beforeend','<i class="lkb">2단계</i>')}});
    const mn=document.querySelector('main');if(mn&&S.mode==='store'&&S.view.store==='cur'&&!mn.querySelector('.lvplan')){const w=mn.querySelector('.tick')||mn.querySelector('.grid');if(w){const b=document.createElement('div');b.className='lvplan';
      b.innerHTML=`<button class="btn sm" data-a="lvSeason">${L>=3?'':'<u>3단계</u> '}4주 계절 기획 만들기</button>`;w.before(b)}}
    document.querySelectorAll('details.menu>div').forEach(dv=>{const s=dv.querySelector('[data-a="sendOpen"]');if(s&&!dv.querySelector('[data-a="lvSerial"]')){const b=document.createElement('button');b.dataset.a='lvSerial';b.dataset.i=s.dataset.i;b.innerHTML=(L>=2?'':'<u>2단계</u> ')+'3주 연작으로 만들기';s.before(b)}})}catch(e){}}})();
const lvPut=(T,msg)=>{S.ui.myT=[...T,...(S.ui.myT||[])].slice(0,8);ssT.set(S.ui.myT);S.ui.cTone='내 생각';S.ui.cOpen=null;S.view.store='cur';window.scrollTo(0,0);render();toast(msg)};
A.lvSerial=d=>{if(lvNow()<2)return lvLock(2);const t=(S.ui.cor||[])[+d.i];if(!t)return;const base=String(t.title||'').replace(/[,.]\s*$/,''),src=[t.src,t.key,base].filter(Boolean).join(' '),st=[['문 열기','처음 만나는 사람을 위한 쉬운 책부터',7],['깊이 읽기','한 걸음 더 들어가는 책',14],['옆으로 넓히기','다른 분야에서 같은 주제를 만나는 책',21]];
  lvAdd('cur','연작 '+base);lvPut(st.map(([a,b,dd],i)=>({id:'s'+Date.now().toString(36)+i,tone:'내 생각',src,title:`${base} ${'①②③'[i]} ${a}`,hook:`3주 연작 ${i+1}주차 · ${b}`,sym:t.sym||'book',bpal:t.bpal||0,ppal:t.ppal||0,until:addDays(TODAY,dd),place:t.place||'입구 평대',pop:{head:`${base}\n${'①②③'[i]} ${a}`,body:b},band:`${base} · ${a}`,pick:i===0?(t.books||[]).slice(0,4).map(b=>b.t):[],key:base})),`「${base}」 3주 연작을 만들었습니다. 맨 앞 세 표지입니다`)};
const LVSEA={1:['새해 첫 책','겨울밤','다짐','눈'],2:['겨울 끝','편지','졸업','봄 기다리기'],3:['새 학기','봄','시작','꽃'],4:['산책','벚꽃','나무','봄비'],5:['가족','숲','여행 준비','초록'],6:['여름 시작','비','바다','밤'],7:['여름방학','여행','바다','더위'],8:['한여름','휴가','밤','별'],9:['가을','독서의 계절','편지','하늘'],10:['단풍','산책','고독','노을'],11:['늦가을','겨울 준비','차 한 잔','첫눈'],12:['첫눈','선물','한 해 돌아보기','새해 준비']};
A.lvSeason=()=>{if(lvNow()<3)return lvLock(3);const m=+TODAY.slice(5,7),W=LVSEA[m]||LVSEA[11];lvAdd('cur',m+'월 계절 기획');
  lvPut(W.map((w,i)=>{const dark=/밤|겨울|고독|눈/.test(w),pal=dark?2:/숲|나무|봄|초록|꽃/.test(w)?1:/노을|가을|단풍|차/.test(w)?3:/바다|비|여름/.test(w)?4:0;return{id:'q'+Date.now().toString(36)+i,tone:'내 생각',src:w,title:`${m}월 ${i+1}주 · ${w}`,hook:`4주 계절 기획 ${i+1}주차 · 주마다 평대를 바꿉니다`,sym:'book',bpal:pal,ppal:pal,until:addDays(TODAY,(i+1)*7),place:'입구 평대',pop:{head:w,body:`${m}월 ${i+1}주의 평대`},band:w,pick:[],key:w}}),`${m}월 4주 계절 기획을 만들었습니다. 맨 앞 네 표지입니다`)};

/* ── 메인 POP 원칙(참부장): 심플하면 이미지 · 기호 · 상징 · 기계 언어로 보완한다. 아니면 질문을 더 넣는다. 나머지 설명은 쇼카드 · 띠지가 맡는다 ── */
const POPQ=['왜 지금, 이 이야기일까요?','마지막으로 그래 본 게 언제인가요?','당신이라면 어떻게 하겠습니까?','이 가운데 당신의 책은 무엇입니까?','읽고 나면 무엇이 달라질까요?'];
const popMach=(w,n)=>[`> ${w}_`,`「${w}」 → ?`,`${w} + 책 = ___`,`if (${w}) { 읽는다 }`,`${w} ≠ ?`,`[ ${w} ]  ⌕`][n%6];
(()=>{const f=mkD;mkD=function(t,k){const D=f(t,k);try{if(k!=='pop')return D;const head=String(D.head||'').replace(/\n/g,' ').trim(),core=head.replace(/[\s,.!?·「」]/g,''),h=[...core].reduce((a,c)=>a+c.charCodeAt(0),0),simple=core.length<=8&&head.split(/\s+/).length<=2;
  if(simple){if(!D.sym||D.sym==='none'){let s='book';try{s=(IDS.find(([r])=>r.test(head+' '))||[0,'book'])[1]}catch(e){}D.sym=s}D.body=popMach(head,h)}
  else if(!/[?？]\s*$/.test(D.body||'')){const q=POPQ[h%POPQ.length];D.body=(D.body&&D.body.length<=28?D.body+'\n':'')+q}}catch(e){}return D}})();

/* 진열 오브제에서 이름표를 뺀다(쇼카드와 겹침, 11/11 결정) */
(()=>{try{const i=DPOBJ.findIndex(x=>x[0]==='card');if(i>=0)DPOBJ.splice(i,1)}catch(e){}const cut=P=>{if(P&&P.it)P.it=P.it.filter(i=>i.k!=='card');if(P&&P.need)P.need=P.need.filter(x=>!/이름표/.test(x));if(P&&P.tips)P.tips=P.tips.filter(x=>!/이름표/.test(x));return P};const g=dpPlan;dpPlan=function(){return cut(g.apply(this,arguments))}})();

/* ── 11/12 단순화: 아래 고정 메뉴 · 카드 빠른 버튼 · 홈 단계 한 줄 · 직원에게 보내기 ── */
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const mn=document.querySelector('main');if(!mn||S.locked)return;
  if(S.mode==='store'&&S.view.store==='cur'){
    const sn=mn.querySelector(':scope>.subnav:not(.subt)');if(sn){const on=sn.querySelector('[aria-pressed="true"]');if(!on||/전체/.test(on.textContent))sn.style.display='none'}
    const pcs=[...mn.querySelectorAll('.pcard')];mn.querySelectorAll('.wall>.cv').forEach(cv=>{const pc=pcs[+cv.dataset.i];if(!pc)return;const bs=[[pc.querySelector('[data-a="dpOpen"]'),'진열 보기'],[[...pc.querySelectorAll('[data-a="toDesign"][data-kind="pop"]')].pop(),'POP 만들기']].filter(x=>x[0]);if(!bs.length)return;const w=document.createElement('div');w.className='cvw';cv.replaceWith(w);const q=document.createElement('div');q.className='cvq';bs.forEach(([o,n])=>{const x=document.createElement('button');Object.assign(x.dataset,o.dataset);x.textContent=n;q.append(x)});w.append(cv,q)});
    const t=mn.querySelector('.gdtop');if(t&&!t.querySelector('.lvline')){const L=lvNow();if(L<3){const s=lvS(),R=LVREQ[L+1],ks=Object.keys(R),pc=Math.round(ks.reduce((a,k)=>a+Math.min(1,lvVal(s,k)/R[k]),0)/ks.length*100),SH={cur:'큐레이션',pop:'인쇄물',dp:'진열안',vid:'영상',send:'주고받기',days:'사용일'};const b=document.createElement('button');b.className='lvline';b.dataset.a='lvOpen';b.innerHTML=`<span>${L+1}단계까지 ${pc}%</span><i><u style="width:${pc}%"></u></i><small>${ks.slice(0,3).map(k=>`${SH[k]} ${Math.min(lvVal(s,k),R[k])}/${R[k]}`).join(' · ')}</small>`;t.prepend(b)}}}
  }catch(e){}}})();
A.dpSend=async()=>{try{const t=S.ui.cor[S.ui.dp.i],P=dpPlan(t,S.ui.dpM||0),el=$('dpTop');if(!t||!el)return;lvAdd('dp');toast('보낼 그림을 만드는 중입니다');
  const vb=(el.getAttribute('viewBox')||'0 0 900 900').split(/\s+/).map(Number),sw=vb[2],sh=vb[3];let svg=new XMLSerializer().serializeToString(el);if(!/xmlns=/.test(svg.slice(0,200)))svg=svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');svg=svg.replace(/^<svg([^>]*)>/,(m,a)=>`<svg${a.replace(/\sstyle="[^"]*"/,'').replace(/\s(width|height)="[^"]*"/g,'')} width="${sw}" height="${sh}">`);svg=svg.replace(/^(<svg[^>]*>)/,'$1'+await fontCSS());
  const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();
  const W=1080,F='Pretendard,"Malgun Gothic",sans-serif',rows=(P.rows||[]).filter(r=>r&&r.b),iw=920,ih=Math.round(iw*sh/sw),c=document.createElement('canvas'),x=c.getContext('2d');
  const wrap=(s,mw,f)=>{x.font=f;const out=[];let cur='';for(const ch of String(s)){if(x.measureText(cur+ch).width>mw){out.push(cur);cur=ch}else cur+=ch}if(cur)out.push(cur);return out};
  const RL=rows.map(r=>({n:r.n,t:wrap(r.b.t.replace(/\s*[\(\[].*$/,''),820,`800 34px ${F}`).slice(0,1)[0],p:wrap(r.place||'',820,`500 26px ${F}`).slice(0,2)})),TL=(P.tips||[]).slice(0,2).flatMap(s=>wrap('· '+s,920,`500 26px ${F}`)),NL=(P.need||[]).length?wrap('준비물  '+P.need.join(' · '),920,`500 26px ${F}`):[];
  const H=250+ih+50+RL.reduce((a,r)=>a+58+r.p.length*36+18,0)+(TL.length?30+TL.length*38:0)+(NL.length?30+NL.length*38:0)+110;c.width=W;c.height=H;
  x.fillStyle='#f7f5ef';x.fillRect(0,0,W,H);x.fillStyle='#003128';x.fillRect(0,0,W,200);x.fillStyle='#c9a24a';x.fillRect(0,200,W,10);
  x.fillStyle='#d9b45b';x.font=`600 28px ${F}`;x.fillText('오늘의 진열 · '+('더숲 '+brN(P.br||S.br)),80,78);x.fillStyle='#f2eee3';x.font=`800 56px ${F}`;x.fillText(wrap(t.title,920,`800 56px ${F}`)[0],80,152);
  let y=250;x.drawImage(img,80,y,iw,ih);y+=ih+50;x.textBaseline='alphabetic';
  RL.forEach(r=>{x.fillStyle='#003128';x.beginPath();x.arc(104,y+22,24,0,7);x.fill();x.fillStyle='#fff';x.font=`800 26px ${F}`;x.textAlign='center';x.fillText(r.n,104,y+31);x.textAlign='left';x.fillStyle='#1c1c1a';x.font=`800 34px ${F}`;x.fillText(r.t,150,y+34);y+=58;x.fillStyle='#55554f';x.font=`500 26px ${F}`;r.p.forEach(s=>{x.fillText(s,150,y+22);y+=36});y+=18});
  if(TL.length){y+=30;x.fillStyle='#1c1c1a';x.font=`500 26px ${F}`;TL.forEach(s=>{x.fillText(s,80,y+22);y+=38})}
  if(NL.length){y+=30;x.fillStyle='#7d3a2b';x.font=`500 26px ${F}`;NL.forEach(s=>{x.fillText(s,80,y+22);y+=38})}
  x.fillStyle='#8a8a80';x.font=`400 22px ${F}`;x.fillText('Planned by 쿼부장',W-290,H-44);
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(!blob)return;const name=`더숲_진열안내_${t.title.replace(/[\\/:*?"<>|\s,]+/g,'_').slice(0,20)}.png`;
  try{const f=new File([blob],name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:t.title});return}}catch(e){if(e&&e.name==='AbortError')return}
  await saveFile(name,blob);toast('그림을 저장했습니다. 카카오톡으로 직원에게 보내 주세요.')}catch(e){console.warn(e);toast('그림을 만들지 못했습니다')}};

/* 추천 진열 배치: 재고 있는 책 먼저, 잘 나가는 책을 메인으로, 종수에 맞는 놓는 법 */
A.dpRec=()=>{try{const t=S.ui.cor[S.ui.dp.i];if(!t)return;const k=dpKey(t),all=(t.books||[]).slice(0,10),cap=lvNow()>=2?8:6;
  const sc=b=>((b.here>0||b.src==='재고')?100:0)+(b.mine||0)*3+(b.sold||0)+(b.role==='중심'?5:0);
  const ord=all.map((b,i)=>[i,sc(b)]).sort((a,b)=>b[1]-a[1]||a[0]-b[0]),ins=ord.filter(x=>x[1]>=100).length,n=Math.max(Math.min(3,all.length),Math.min(cap,all.length,ins>=3?ins:cap)),pk=ord.slice(0,n).map(x=>x[0]).sort((a,b)=>a-b),main=ord[0][0];
  const md=n<=3?2:/star|cup|candle|moon|snow/.test(t.sym||'')?1:0;
  S.ui.dpPick={...(S.ui.dpPick||{}),[k]:pk};S.ui.dpMain={...(S.ui.dpMain||{}),[k]:main};S.ui.dpObj={...(S.ui.dpObj||{}),show:true};S.ui.dpFree=md!==2;S.ui.dpM=md;S.ui.dpF=0;
  try{const ps=S.ui.dpAbs||{};Object.keys(ps).forEach(x=>{if(x.indexOf(k)===0)delete ps[x]});S.ui.dpAbs=ps}catch(e){}
  A.dpOpen({i:S.ui.dp.i});const nm=String(all[main].t).replace(/\s*[\(\[].*$/,''),inn=pk.filter(i=>all[i].here>0||all[i].src==='재고').length;
  const box=document.querySelector('#sheetBox .dprec');if(box)box.insertAdjacentHTML('afterend',`<p class="dprw"><b>이렇게 놓았습니다</b> ${n}종을 「${DMOOD[md]}」로 · 메인은 「${esc(nm)}」, 쇼카드와 함께 · 재고 있는 책 ${inn}종을 먼저${md===2?' · 종수가 적어 한 권씩 또렷하게':md===1?' · 주제가 따뜻해 부드럽게':' · 방금 읽다 둔 듯 살짝 흐트러지게'}. 마음에 안 들면 끌어서 고치세요.</p>`)}catch(e){console.warn(e);toast('추천 배치를 만들지 못했습니다')}};
