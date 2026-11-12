/* 인스타 피드 다시 만들기 (11/12 밤, 참부장 「촌스럽고 불편」)
   참고: 매거진형 캐러셀(표지 → 본문 → 정보), 프로필 격자가 3:4 로 잘리는 것(좌우 안전 여백), 표지 제목은 요약보다 궁금하게.
   쓰는 법: 미리보기는 늘 위에, 아래는 사진 · 디자인 · 글 세 칸. 바꾸면 바로 다시 그린다. 맨 아래 「저장 · 공유」 「글 복사」. */
const IGT=[['에디토리얼','사진 위 큰 제목'],['프레임','여백 있는 사진 · 책 한 쪽처럼'],['타이포','글자만, 질문 하나로']];
const IGSF='"Gowun Batang","Noto Serif CJK KR","Nanum Myeongjo",serif',IGSS='Pretendard,"Noto Sans CJK KR",sans-serif';
async function igFont(){try{await Promise.all(['700 60px "Gowun Batang"','400 40px "Gowun Batang"','800 40px Pretendard','600 30px Pretendard','500 30px Pretendard','400 30px Pretendard'].map(f=>document.fonts.load(f,'더숲 가')))}catch(e){}}
function igLS(x,v){try{x.letterSpacing=v+'px'}catch(e){}}

/* ── 그리기 ── */
async function igCanvases({t,ph,fmt,ct,cs,tpl}){await igFont();const [,W,H]=IGF[fmt|0],M=88,out=[],PN='#003128',PA='#f2eee3',INK='#1c1c1a',GD='#c9a24a';tpl=tpl|0;
  let lw=null,lg=null;try{lw=await upImg('logo-w.png');lg=await upImg('logo-g.png')}catch(e){}
  const br=upBr(t?t.br||S.br:S.br),kick=t?(t.tg||t.tone||'이번 주 평대'):'더숲 소식',when=t&&t.until?mdw(t.until)+'까지':'',place=t&&t.place?t.place:'';
  const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return[c,c.getContext('2d')]};
  const cover=(x,bm,X,Y,w,h)=>{const s=Math.max(w/bm.width,h/bm.height),dw=bm.width*s,dh=bm.height*s;x.save();x.beginPath();x.rect(X,Y,w,h);x.clip();x.drawImage(bm,X+(w-dw)/2,Y+(h-dh)/2,dw,dh);x.restore()};
  const head=(x,col,i,n)=>{x.fillStyle=col;x.font=`600 24px ${IGSS}`;igLS(x,1);x.fillText(br,M,M);const bw=x.measureText(br).width;x.globalAlpha=.6;x.fillText(`  ·  ${kick}`,M+bw,M);x.globalAlpha=1;if(n>1){const s=`${String(i).padStart(2,'0')} / ${String(n).padStart(2,'0')}`;x.fillText(s,W-M-x.measureText(s).width,M)}igLS(x,0)};
  const T=ct||'',tl=(x,size,mw,max)=>{x.font=`700 ${size}px ${IGSF}`;return wrapW(x,T,mw,max)};
  /* 몇 장인지 먼저 센다 */
  const quote=t&&t.hook&&t.hook!==cs?t.hook:'';const N=1+Math.max(0,ph.length-1)+(quote?1:0)+(t?1:0);let k=1;
  /* 표지 */
  {const [c,x]=mk();
    if(tpl===0&&ph.length){cover(x,ph[0].bm,0,0,W,H);const g=x.createLinearGradient(0,H*.35,0,H);g.addColorStop(0,'rgba(10,22,18,0)');g.addColorStop(1,'rgba(10,22,18,.86)');x.fillStyle=g;x.fillRect(0,0,W,H);const g2=x.createLinearGradient(0,0,0,220);g2.addColorStop(0,'rgba(0,0,0,.38)');g2.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g2;x.fillRect(0,0,W,220);
      head(x,'#fff',k,N);let size=T.length>12?84:100;let L=tl(x,size,W-2*M,3);const lh=size*1.24;x.font=`400 30px ${IGSS}`;const SL=wrapW(x,cs||'',W-2*M,2);
      let y=H-M-34-(SL.length?SL.length*44+26:0);x.fillStyle=PA;x.font=`500 24px ${IGSS}`;igLS(x,1);x.fillText([place,when].filter(Boolean).join('  ·  '),M,H-M);igLS(x,0);
      x.fillStyle='rgba(255,255,255,.88)';x.font=`400 30px ${IGSS}`;SL.forEach((s,i)=>x.fillText(s,M,y+i*44));y-=SL.length?Math.round(size*.3+48):20;
      x.fillStyle='#fff';x.font=`700 ${size}px ${IGSF}`;L.slice().reverse().forEach((s,i)=>x.fillText(s,M,y-i*lh));x.fillStyle=GD;x.fillRect(M,y-(L.length-1)*lh-size-28,56,4)}
    else if(tpl===1||(tpl===0&&!ph.length&&false)){x.fillStyle=PA;x.fillRect(0,0,W,H);head(x,PN,k,N);const ih=Math.round(H*(H>1400?.5:.56)),iy=M+40;
      if(ph.length)cover(x,ph[0].bm,M,iy,W-2*M,ih);else{x.fillStyle=PN;x.fillRect(M,iy,W-2*M,ih);x.fillStyle=GD;x.font=`700 160px ${IGSF}`;x.fillText('“',M+40,iy+200)}
      let y=iy+ih+80;x.fillStyle='#8a6a10';x.font=`600 24px ${IGSS}`;igLS(x,1);x.fillText(kick,M,y);igLS(x,0);y+=24;
      const size=T.length>12?60:72,L=tl(x,size,W-2*M,2);x.fillStyle=PN;L.forEach((s,i)=>x.fillText(s,M,y+size+i*size*1.25));y+=size+(L.length-1)*size*1.25+30;
      x.fillStyle='rgba(28,28,26,.75)';x.font=`400 28px ${IGSS}`;wrapW(x,cs||'',W-2*M,2).forEach((s,i)=>x.fillText(s,M,y+12+i*40));
      if(lg)x.drawImage(lg,M,H-M-26,120,120*lg.height/lg.width);x.fillStyle=PN;x.font=`500 22px ${IGSS}`;const r=[place,when].filter(Boolean).join('  ·  ');x.fillText(r,W-M-x.measureText(r).width,H-M)}
    else{const bg=(t&&typeof TONEC!=='undefined'&&TONEC[t.tone]?TONEC[t.tone][0]:PN),fg=bg==='#c9a24a'?INK:PA;x.fillStyle=bg;x.fillRect(0,0,W,H);head(x,fg,k,N);
      const q=(t&&typeof popQ==='function'&&popQ(t))||T;const size=q.length>16?86:104;x.font=`700 ${size}px ${IGSF}`;const L=wrapW(x,q,W-2*M,4),lh=size*1.25,y0=H*.5-(L.length*lh)/2+size*.7;x.fillStyle=fg;L.forEach((s,i)=>x.fillText(s,M,y0+i*lh));
      x.fillStyle=fg===PA?GD:PN;x.fillRect(M,y0-size-40,56,4);x.globalAlpha=.85;x.fillStyle=fg;x.font=`600 30px ${IGSS}`;if(q!==T)x.fillText(T,M,y0+L.length*lh+30);x.globalAlpha=1;
      const lo=fg===PA?lw:lg;if(lo)x.drawImage(lo,M,H-M-26,120,120*lo.height/lo.width);x.font=`500 22px ${IGSS}`;const r=[place,when].filter(Boolean).join('  ·  ');x.fillStyle=fg;x.fillText(r,W-M-x.measureText(r).width,H-M)}
    out.push(c);k++}
  /* 나머지 사진 */
  ph.slice(1).forEach(p=>{const [c,x]=mk();if(tpl===0){cover(x,p.bm,0,0,W,H);const g2=x.createLinearGradient(0,0,0,200);g2.addColorStop(0,'rgba(0,0,0,.3)');g2.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g2;x.fillRect(0,0,W,200);head(x,'#fff',k,N)}
    else{const bg=tpl===1?PA:PN;x.fillStyle=bg;x.fillRect(0,0,W,H);head(x,tpl===1?PN:PA,k,N);cover(x,p.bm,M,M+40,W-2*M,H-2*M-90)}out.push(c);k++});
  /* 문장 */
  if(quote){const [c,x]=mk();x.fillStyle=PA;x.fillRect(0,0,W,H);head(x,PN,k,N);x.fillStyle=GD;x.font=`700 200px ${IGSF}`;x.fillText('“',M-10,H*.32);const size=58;x.font=`400 ${size}px ${IGSF}`;const L=wrapW(x,quote,W-2*M,7);x.fillStyle=INK;L.forEach((s,i)=>x.fillText(s,M,H*.36+i*size*1.55));
    x.fillStyle=PN;x.font=`600 26px ${IGSS}`;x.fillText(T,M,H-M);out.push(c);k++}
  /* 정보 */
  if(t){const [c,x]=mk();x.fillStyle=PN;x.fillRect(0,0,W,H);head(x,PA,k,N);x.fillStyle=PA;x.font=`700 64px ${IGSF}`;const L=wrapW(x,T,W-2*M,2);L.forEach((s,i)=>x.fillText(s,M,H*.3+i*80));
    let y=H*.3+L.length*80+60;const row=(a,b)=>{if(!b)return;x.fillStyle=GD;x.font=`600 24px ${IGSS}`;igLS(x,1);x.fillText(a,M,y);igLS(x,0);x.fillStyle=PA;x.font=`500 34px ${IGSS}`;wrapW(x,b,W-2*M-180,2).forEach((s,i)=>x.fillText(s,M+180,y+i*46));y+=110};
    row('어디서',`더숲 ${br.replace(/^더숲\s*/,'')}${place?' · '+place:''}`);row('언제까지',when);row('무엇을',(typeof popQ==='function'&&popQ(t))||t.hook);
    x.fillStyle=GD;x.fillRect(M,H-M-70,W-2*M,2);if(lw)x.drawImage(lw,M,H-M-26,120,120*lw.height/lw.width);x.fillStyle=PA;x.font=`500 22px ${IGSS}`;const r='책은 매장에서 직접 펴 보세요';x.fillText(r,W-M-x.measureText(r).width,H-M);out.push(c)}
  return out}

/* ── 창 ── */
A.igOpen=d=>{const i=d&&d.i!=null&&d.i!==''?+d.i:null;S.ui.igG={ph:[],ti:i,txt:'',fmt:0,tpl:0,tab:'ph',out:null,busy:0};igRe()};
A.igTab=d=>{S.ui.igG.tab=d.v;igDraw()};A.igTpl=d=>{S.ui.igG.tpl=+d.v;igRe()};A.igFmt=d=>{S.ui.igG.fmt=+d.v;igRe()};
C.igTh=el=>{const G=S.ui.igG;G.ti=el.value===''?null:+el.value;G.out=null;igRe()};
A.igRm=d=>{const G=S.ui.igG;G.ph.splice(+d.i,1);igRe()};A.igFirst=d=>{const G=S.ui.igG;G.ph.unshift(...G.ph.splice(+d.i,1));igRe()};
C.igPh=async el=>{const G=S.ui.igG;const fs=[...el.files].slice(0,10-G.ph.length);el.value='';for(const f of fs){try{const bm=await createImageBitmap(f);G.ph.push({f,bm,u:URL.createObjectURL(f)})}catch(e){}}if(G.ph.length&&G.tpl===2)G.tpl=0;igRe()};
C.igTx=el=>{S.ui.igG.txt=el.value;const G=S.ui.igG;if(G.out&&!G.out.ai){const tp=igCapsTpl(igTheme(),G.txt.trim());G.out.caps=tp.caps;igDraw()}};
C.igCT=el=>{const G=S.ui.igG;G.out.ct=el.value;igRe(true)};C.igCS=el=>{const G=S.ui.igG;G.out.cs=el.value;igRe(true)};
async function igRe(keep){const G=S.ui.igG;if(!G)return;const t=igTheme(),txt=(G.txt||'').trim();
  if(!G.out||(!keep&&!G.out.ai&&!G.out.edited)){const tp=igCapsTpl(t,txt);G.out={ct:t?t.title:(txt.split(/[\n,.·—-]/)[0]||'더숲에서 전합니다').slice(0,24),cs:t?(t.hook||''):'',caps:tp.caps,tags:tp.tags}}
  if(keep)G.out.edited=true;
  try{const cs=await igCanvases({t,ph:G.ph,fmt:G.fmt|0,ct:G.out.ct,cs:G.out.cs,tpl:G.tpl|0});G.cv=cs;G.out.urls=cs.map(c=>c.toDataURL('image/jpeg',.82))}catch(e){console.warn(e)}igDraw()}
A.igAI=async()=>{const G=S.ui.igG;if(!G||G.busy||!AI)return;if(!G.ph.length){toast('사진을 먼저 넣어 주세요');return}const t=igTheme(),txt=(G.txt||'').trim();G.busy=1;igDraw();
  const r=await ask('igf',`사진 ${G.ph.length}장으로 서울 강북구 북한산 자락의 서점 · 문화공간 「더숲 아카데미하우스」(사유의숲 서점 · 씨앗숲 · 아트시네마 · 북스테이 · 카페) 인스타그램 피드를 만듭니다.\n${t?`[묶을 큐레이션] ${t.title} — ${t.hook}\n`:''}${txt?`[적어 준 내용] ${txt}\n`:''}[오늘] ${TODAY}\n규칙: 사진에 실제로 보이는 것을 근거로 씁니다. 사람의 얼굴 · 이름 · 나이는 말하지 않습니다. 적어 주지 않은 사실(가격, 시간, 할인, 수상, 줄거리 세부)은 지어내지 않습니다. 책 제목을 목록으로 늘어놓지 않습니다. 말투는 차분하게, 감성은 적당히. 이모지는 0~1개.\nct 는 표지 제목 14자 안쪽(요약보다 궁금하게), cs 는 표지 한 줄 30자 안쪽. caps 는 세 가지(담백하게 / 감성 있게 / 정보 위주로) 각 150~300자, 첫 줄은 25자 안쪽. tags 는 해시태그 8~12개. alt 는 사진 설명 한 문장. order 는 표지에 맞는 순서(0부터).\nJSON 으로만: {"ct":"","cs":"","caps":[{"tone":"","caption":""}],"tags":"","alt":"","order":[0]}`,{images:G.ph.slice(0,6).map(p=>p.f)});
  G.busy=0;if(r&&r.caps){if(Array.isArray(r.order)){const o=r.order.filter(i=>Number.isInteger(i)&&i>=0&&i<G.ph.length);G.ph=[...new Set([...o,...G.ph.map((_,i)=>i)])].map(i=>G.ph[i])}G.out={...r,ai:true};G.tab='txt'}igRe(true)};
A.igSave=async()=>{const G=S.ui.igG;if(!G||!G.cv)return;const t=igTheme();await upSaveMany(G.cv,'더숲_인스타_'+upName((G.out&&G.out.ct)||(t&&t.title)||TODAY));try{lvAdd('pop')}catch(e){}};
A.igCp=d=>{const G=S.ui.igG,c=G.out.caps[+(d&&d.i||G.ci||0)];copyText(c.caption+'\n\n'+(G.out.tags||''))};A.igCi=d=>{S.ui.igG.ci=+d.i;igDraw()};
function igDraw(){const G=S.ui.igG;if(!G)return;const T=(S.ui.cor||[]).slice(0,12),o=G.out||{},tab=G.tab||'ph',ci=G.ci|0;
  const prev=`<div class="igxp">${(o.urls||[]).map((u,i)=>`<figure><img src="${u}" alt=""><figcaption>${i===0?'표지':String(i+1).padStart(2,'0')}</figcaption></figure>`).join('')||'<div class="igxe">만드는 중…</div>'}</div>`;
  const tabs=`<div class="igxt" role="tablist">${[['ph','사진'],['tpl','디자인'],['txt','글']].map(([k,n])=>`<button data-a="igTab" data-v="${k}" aria-pressed="${tab===k}">${n}</button>`).join('')}</div>`;
  let body='';
  if(tab==='ph')body=`<div class="igph">${G.ph.map((p,i)=>`<div><img src="${p.u}" alt="">${i?`<button data-a="igFirst" data-i="${i}">표지로</button>`:'<em>표지</em>'}<button class="x" data-a="igRm" data-i="${i}" aria-label="빼기">×</button></div>`).join('')}${G.ph.length<10?`<label class="igadd"><b>+</b><span>사진 넣기</span><input type="file" accept="image/*" multiple hidden data-c="igPh"></label>`:''}</div>
    <label class="igxl">이번 주 큐레이션과 묶기<select data-c="igTh"><option value="">묶지 않음</option>${T.map((x,i)=>`<option value="${i}" ${G.ti===i?'selected':''}>${esc(x.title)}</option>`).join('')}</select></label>
    <label class="igxl">무엇에 대해 <small>있으면 글이 정확해집니다</small><textarea id="igTx" rows="2" data-c="igTx" placeholder="예: 11/13 금 19시 〈해피엔드〉 특별상영">${esc(G.txt||'')}</textarea></label>`;
  else if(tab==='tpl')body=`<div class="igxd">${IGT.map(([n,d],i)=>`<button data-a="igTpl" data-v="${i}" aria-pressed="${(G.tpl|0)===i}"><i class="t${i}"><b></b><s></s></i><span>${n}</span><small>${d}</small></button>`).join('')}</div>
    <div class="igxf">${IGF.map(([n],i)=>`<button data-a="igFmt" data-v="${i}" aria-pressed="${(G.fmt|0)===i}">${n}</button>`).join('')}</div><p class="note">인스타 프로필 격자는 4:5 사진의 양옆을 조금 잘라 보여 줍니다. 글자는 잘리지 않게 안쪽에 둡니다.</p>`;
  else body=`<label class="igxl">표지 제목 <small>요약보다 궁금하게</small><input id="igCT" data-c="igCT" value="${esc(o.ct||'')}"></label><label class="igxl">표지 한 줄<input id="igCS" data-c="igCS" value="${esc(o.cs||'')}"></label>
    ${AI?`<button class="btn" data-a="igAI" ${G.busy?'disabled':''}>${G.busy?'사진을 보고 쓰는 중…':'사진을 보고 글 다시 쓰기'}</button>`:''}
    <div class="igxc">${(o.caps||[]).map((c,i)=>`<button data-a="igCi" data-i="${i}" aria-pressed="${ci===i}">${esc(c.tone||'')}</button>`).join('')}</div>
    <div class="igcap"><p>${esc(((o.caps||[])[ci]||{}).caption||'')}</p><small>${esc(o.tags||'')}</small></div>${o.alt?`<p class="note">사진 설명: ${esc(o.alt)}</p>`:''}`;
  const h=`<div class="igx"><div class="igxh"><b>인스타 피드</b><span>${(o.urls||[]).length}장 · ${IGF[G.fmt|0][0]}</span></div>${prev}${tabs}<div class="igxb">${body}</div>
    <div class="igxa"><button class="btn pri" data-a="igSave">이미지 ${(o.urls||[]).length}장 저장 · 공유</button><button class="btn" data-a="igCp">글 복사</button></div></div>`;
  const sb=$('sheetBox');if(sb&&$('sheet').classList.contains('on')&&sb.querySelector('.igx')){const sc=sb.scrollTop,px=(sb.querySelector('.igxp')||{}).scrollLeft||0;sb.innerHTML=h;sb.scrollTop=sc;const p=sb.querySelector('.igxp');if(p)p.scrollLeft=px}else openSheet(h)}
