/* 「말로 찾는 서가」 POP (11/13, 참부장)
   감정 · 물건 · 상황 같은 말이 여러 개 적힌 POP 를 붙인다. 고객이 마음에 걸리는 말 옆의 QR 하나를 휴대폰으로 찍으면
   그 말에 맞는 책이 있는 서가(장소)와 주제를 보여 주는 공개 안내 화면(w.html)이 열린다.
   안내 화면에는 말 · 장소 · 주제 · 지점만 들어간다(재고 · 매출 · 개인정보 없음). 진열을 바꾸면 POP 를 다시 뽑는다. */
const WDURL='https://deosup-ah.github.io/biz/supjigi/w.html';
/* 주제 제목의 낱말 → 고객이 떠올릴 만한 말(감정 · 물건 · 상황) */
const WDB=[[/비|우산|장마/,[['비 오는 날','상황'],['우산','물건']]],[/눈|겨울|추운|찬\s|맑고 찬/,[['첫눈','상황'],['손이 시릴 때','상황'],['목도리','물건']]],[/밤|새벽|잠/,[['잠이 안 올 때','상황'],['새벽 세 시','상황']]],
 [/죽음|마지막|이별/,[['그리움','감정'],['작별','상황']]],[/방|집|사는 곳|건물/,[['혼자 있고 싶을 때','상황'],['내 방','물건'],['이사','상황']]],[/단어|번역|말로|두 나라/,[['하고 싶은 말','감정'],['외국어','물건']]],
 [/숲|나무|겨울눈/,[['숲','물건'],['쉬고 싶을 때','상황']]],[/낫지|아픔|몸|병/,[['지칠 때','감정'],['괜찮지 않은 날','감정']]],[/평균|숫자|통계|1984|1949/,[['나만 다른 것 같을 때','감정'],['숫자','물건']]],
 [/요리|밥|식탁|먹/,[['배고플 때','상황'],['엄마 밥','물건']]],[/걷|산책|시속/,[['걷고 싶을 때','상황'],['운동화','물건']]],[/과학|분류|물고기|지구|기후|뜨거워/,[['궁금할 때','감정'],['날씨','물건'],['기후 불안','감정']]],
 [/가게|책방|서점/,[['단골','상황'],['동네','물건']]],[/물음표|질문|철학|생각/,[['고민','감정'],['답이 없을 때','상황']]],[/좋아한|아무튼|오래/,[['덕질','상황'],['좋아하는 것','감정']]],
 [/아니라고|나는/,[['억울할 때','감정'],['나도 몰랐던 나','감정']]],[/일|명함|직업/,[['출근길','상황'],['퇴근하고 싶을 때','감정']]],[/보는 법|그림|색|점 앞/,[['미술관','물건'],['멍하니','상황']]],
 [/실패|안 된/,[['실패','감정'],['다시 시작','상황']]],[/조용|소란/,[['조용히','상황'],['머리가 복잡할 때','감정']]],[/달리|앉아/,[['달리기','상황'],['의자','물건']]],
 [/긴 소설|긴 밤|겨울에 읽/,[['긴 연휴','상황'],['담요','물건']]],[/시\b|시를|서서 읽는 시|한 줄/,[['한 줄 위로','감정'],['편지','물건']]],[/주머니|코트/,[['지하철','물건'],['선물','물건']]],[/차가 식|차\s|커피/,[['따뜻한 차','물건'],['한숨 돌릴 때','상황']]],
 [/영화|장면|스크린/,[['영화 보고 난 뒤','상황'],['팝콘','물건']]],[/밑줄|문장/,[['밑줄','물건'],['올해 마지막 달','상황']]],[/여자|방과 500/,[['나만의 공간','물건'],['용기','감정']]],[/아이|그림책|동화/,[['아이와 함께','상황'],['잠자리','상황']]]];
const WDGEN=[['설렘','감정'],['위로가 필요할 때','감정'],['웃고 싶을 때','감정'],['외로움','감정'],['선물','물건'],['기차','물건'],['여행 전날','상황'],['생일','상황']];
function wdAuto(br){let T=[];try{T=corners(br).all||[]}catch(e){}const out=[],seen=new Set();
  T.forEach(t=>{const hit=WDB.filter(([r])=>r.test(t.title)).flatMap(x=>x[1]).slice(0,3);hit.forEach(([w,k])=>{if(seen.has(w))return;seen.add(w);out.push({w,k,pl:t.place||'입구 평대',th:t.title})})});
  if(out.length<9&&T.length)WDGEN.forEach(([w,k],i)=>{if(out.length>=12||seen.has(w))return;const t=T[i%T.length];seen.add(w);out.push({w,k,pl:t.place||'입구 평대',th:t.title})});return out.slice(0,15)}
const wdB64=s=>{const b=new TextEncoder().encode(s);let x='';b.forEach(c=>x+=String.fromCharCode(c));return btoa(x).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const wdLink=(o,brn)=>WDURL+'#'+wdB64([o.w,o.pl,o.th,brn].join('|'));
function wdQR(x,s,X,Y,size,fg){const m=qrMatrix(s,'L'),n=m.length,q=size/(n+2);x.fillStyle='#fff';x.fillRect(X,Y,size,size);x.fillStyle=fg||'#1c1c1a';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(m[r][c])x.fillRect(Math.floor(X+(c+1)*q),Math.floor(Y+(r+1)*q),Math.ceil(q),Math.ceil(q))}
const WDF=[['A4 세로',2480,3508],['A3 세로',3508,4961],['A5 세로',1748,2480]];
async function wdCanvas(){const G=S.ui.wd,[,W,H]=WDF[G.f|0],c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),U=W/1080,PN='#003128',INK='#1c1c1a',GR='#6b6b63',GD='#b8913a',PA='#fbfaf6',SR='"Gowun Batang","Noto Serif CJK KR",serif',SS='Pretendard,"Noto Sans CJK KR",sans-serif',M=Math.round(70*U);
  try{await Promise.all(['700 60px "Gowun Batang"','400 30px "Gowun Batang"','800 30px Pretendard','600 30px Pretendard','400 30px Pretendard'].map(f=>document.fonts.load(f,'말로 찾는')))}catch(e){}let lg=null;try{lg=await upImg('logo-g.png')}catch(e){}
  x.fillStyle=PA;x.fillRect(0,0,W,H);const brn='더숲 '+(G.br||'사유의숲');
  let y=M+64*U;x.fillStyle=INK;x.font=`700 ${Math.round(74*U)}px ${SR}`;x.fillText('말로 찾는 서가',M,y);x.textAlign='right';x.font=`600 ${Math.round(20*U)}px ${SS}`;x.fillStyle=GR;x.fillText(brn,W-M,y-12*U);x.textAlign='left';
  y+=22*U;x.fillStyle=INK;x.fillRect(M,y,W-2*M,3*U);x.fillRect(M,y+7*U,W-2*M,1*U);y+=56*U;
  x.font=`500 ${Math.round(25*U)}px ${SS}`;x.fillStyle=INK;wrapW(x,'지금 마음에 걸리는 말 하나를 골라, 옆의 네모를 휴대폰 카메라로 찍어 보세요. 그 말에 어울리는 책이 있는 곳을 알려 드립니다.',W-2*M,2).forEach((s,i)=>x.fillText(s,M,y+i*38*U));y+=100*U;
  const L=G.list.filter(o=>o.w),n=L.length,cols=n<=6?2:3,rows=Math.ceil(n/cols),gap=Math.round(20*U),foot=110*U,cw=(W-2*M-gap*(cols-1))/cols,ch=Math.min((H-M-foot-y-gap*(rows-1))/rows,cw*.72);
  L.forEach((o,i)=>{const cx=M+(i%cols)*(cw+gap),cy=y+Math.floor(i/cols)*(ch+gap),pd=Math.round(16*U),qs=Math.min(ch-pd*2,cw*.36),tw=cw-qs-pd*3;x.fillStyle='#fff';x.fillRect(cx,cy,cw,ch);x.strokeStyle='#d8d3c4';x.lineWidth=1.5*U;x.strokeRect(cx,cy,cw,ch);
    x.fillStyle=o.k==='감정'?'#9b2c1f':o.k==='물건'?PN:'#8a6a10';x.font=`600 ${Math.round(15*U)}px ${SS}`;x.fillText(o.k||'',cx+pd,cy+pd+15*U);
    let fs=Math.round(Math.min(48*U,ch*.24)),wl;const fit=()=>{x.font=`700 ${fs}px ${SR}`;wl=[];o.w.split(/\s+/).forEach(t=>{const l=wl.length?wl[wl.length-1]+' '+t:'';if(wl.length&&x.measureText(l).width<=tw)wl[wl.length-1]=l;else wl.push(t)})};const f0=fs;x.font=`700 ${fs}px ${SR}`;const one=Math.floor(fs*Math.min(1,tw/x.measureText(o.w).width));if(one>=f0*.62){fs=one;x.font=`700 ${fs}px ${SR}`;wl=[o.w]}else{fit();while((wl.length>2||wl.some(s=>x.measureText(s).width>tw))&&fs>14*U){fs-=1;fit()}}wl=wl.slice(0,2);
    const ty=cy+pd+15*U+(ch-pd*2-15*U-wl.length*fs*1.22)/2+fs;x.fillStyle=INK;wl.forEach((s,j)=>x.fillText(s,cx+pd,ty+j*fs*1.22));
    wdQR(x,wdLink(o,brn),cx+cw-qs-pd,cy+(ch-qs)/2,qs,INK)});
  const fy=H-M;x.fillStyle='#d8d3c4';x.fillRect(M,fy-foot+30*U,W-2*M,1.5*U);x.fillStyle=GR;x.font=`400 ${Math.round(19*U)}px ${SS}`;x.fillText('찾는 말이 없으면 직원에게 물어보세요. 함께 찾아 드립니다.',M,fy-14*U);
  if(lg){const lw=120*U;x.drawImage(lg,W-M-lw,fy-34*U,lw,lw*lg.height/lg.width)}return c}
A.wdOpen=()=>{if(S.br==='all'){toast('위에서 지점을 먼저 고르세요');return}const brn=(typeof BRAND!=='undefined'&&BRAND[S.br])||brN(S.br);S.ui.wd={br:brn,f:0,list:wdAuto(S.br)};wdDraw(1)};
A.wdAuto=()=>{S.ui.wd.list=wdAuto(S.br);wdDraw(1)};A.wdF=d=>{S.ui.wd.f=+d.v;wdDraw(1)};
C.wdEd=el=>{const i=+el.dataset.i,k=el.dataset.k,G=S.ui.wd;if(i===G.list.length)G.list.push({w:'',k:'감정',pl:'입구 평대',th:''});G.list[i][k]=el.value.trim();G.list=G.list.filter(o=>o.w||o===G.list[i]);wdDraw(1)};
A.wdRm=d=>{S.ui.wd.list.splice(+d.i,1);wdDraw(1)};
A.wdSave=async()=>{try{await upSaveMany([await wdCanvas()],`더숲_말로찾는서가_${upName(S.ui.wd.br)}`)}catch(e){toast('만들지 못했습니다')}};
A.wdPdf=async()=>{const J=window.jspdf&&window.jspdf.jsPDF;if(!J){toast('PDF 도구를 불러오지 못했습니다. 이미지로 저장해 주세요.');return}const f=S.ui.wd.f|0,mm=[[210,297],[297,420],[148,210]][f];try{const c=await wdCanvas(),doc=new J({unit:'mm',format:mm,compress:true});doc.addImage(c.toDataURL('image/jpeg',.95),'JPEG',0,0,mm[0],mm[1]);doc.save(`더숲_말로찾는서가_${upName(S.ui.wd.br)}.pdf`)}catch(e){toast('PDF 를 만들지 못했습니다')}};
async function wdDraw(re){const G=S.ui.wd;if(!G)return;if(re){try{G.url=(await wdCanvas()).toDataURL('image/jpeg',.82)}catch(e){console.warn(e)}}
  const row=(o,i)=>`<div class="wdr"><select data-c="wdEd" data-i="${i}" data-k="k">${['감정','물건','상황'].map(k=>`<option ${o.k===k?'selected':''}>${k}</option>`).join('')}</select><input data-c="wdEd" data-i="${i}" data-k="w" value="${esc(o.w)}" placeholder="말 (예: 잠이 안 올 때)"><input data-c="wdEd" data-i="${i}" data-k="pl" value="${esc(o.pl)}" placeholder="어디 (예: 3번 서가)">${o.w?`<button data-a="wdRm" data-i="${i}" aria-label="빼기">×</button>`:'<span></span>'}<input class="wdth" data-c="wdEd" data-i="${i}" data-k="th" value="${esc(o.th)}" placeholder="주제 (안내 화면에 함께 보임)"></div>`;
  openSheet(`<div class="pzx"><div class="pzxh"><b>말로 찾는 서가</b></div><p class="note">말 옆의 QR 을 찍으면 그 말에 맞는 책이 있는 곳이 열립니다. 진열이 바뀌면 다시 뽑아 붙이세요.</p>
   <div class="pzxp">${G.url?`<figure><img src="${G.url}" alt=""><figcaption>${WDF[G.f|0][0]} · 말 ${G.list.filter(o=>o.w).length}개</figcaption></figure>`:'<div class="igxe">만드는 중…</div>'}</div>
   <div class="igxf">${WDF.map(([n],i)=>`<button data-a="wdF" data-v="${i}" aria-pressed="${(G.f|0)===i}">${n}</button>`).join('')}</div>
   <div class="wdl">${G.list.map(row).join('')}${G.list.length<18?row({w:'',k:'감정',pl:'',th:''},G.list.length):''}</div><button class="btn ghost" data-a="wdAuto">큐레이션에서 다시 채우기</button>
   <div class="pzxa"><button class="btn pri" data-a="wdSave">저장 · 공유</button><button class="btn" data-a="wdPdf">인쇄 PDF</button></div></div>`)}
/* 「만들기」 화면에 들어가는 길 */
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const mn=document.querySelector('main');if(!mn||S.locked||S.view[S.mode]!=='design'||mn.querySelector('.wdtop'))return;const p=mn.querySelector('.pztop');const d=document.createElement('div');d.className='pztop wdtop';d.innerHTML=`<div><b>말로 찾는 서가</b><span>감정 · 물건 · 상황 말마다 QR. 찍으면 그 책이 있는 서가로 안내합니다</span></div><button class="btn" data-a="wdOpen">만들기</button>`;if(p)p.after(d);else{const s=mn.querySelector('.sec');if(s)s.after(d);else mn.prepend(d)}}catch(e){}}})();
