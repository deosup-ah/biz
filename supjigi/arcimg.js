/* 더숲 아카이브 → 이미지로 공유 · 저장 (11/13)
   기록 하나 = 카드 한 장(1080×1350), 보이는 기록 = 8개씩 여러 장 */
const AI_={pa:'#fbfaf6',ink:'#1c1c1a',sub:'#6b6b63',pine:'#003128',gold:'#8a6a10',line:'#d8d3c4',SF:'"Gowun Batang","Noto Serif CJK KR",serif',SS:'Pretendard,sans-serif'};
async function aiFonts(){try{if(document.fonts){await Promise.all(['700 40px "Gowun Batang"','400 40px "Gowun Batang"','700 30px Pretendard','600 30px Pretendard','500 30px Pretendard'].map(f=>document.fonts.load(f,'더숲 아카이브')));await document.fonts.ready}}catch(e){}}
const aiImg=src=>new Promise(ok=>{if(!src)return ok(null);const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=src});
function aiCover(x,im,X,Y,W,H){const r=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*r,h=im.naturalHeight*r;x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();x.drawImage(im,X+(W-w)/2,Y+(H-h)/2,w,h);x.restore()}
function aiDate(o){const [y,m,d]=o.date.split('-');return o.p==='y'?y:o.p==='m'?`${y}. ${+m}.`:`${y}. ${+m}. ${+d}.`}
function aiFoot(x,W,H,page){x.fillStyle=AI_.line;x.fillRect(72,H-118,W-144,2);x.fillStyle=AI_.ink;x.font=`700 26px ${AI_.SF}`;x.textBaseline='alphabetic';x.textAlign='left';x.fillText('더숲 아카이브',72,H-70);const tw=x.measureText('더숲 아카이브').width;
  x.fillStyle=AI_.sub;x.font=`500 22px ${AI_.SS}`;x.fillText('더숲 아카데미하우스',72+tw+20,H-70);
  x.textAlign='right';x.font=`500 20px ${AI_.SS}`;x.fillText(page||'Planned by 쿼부장',W-72,H-70);x.textAlign='left'}
async function aiCard(o){await aiFonts();const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.fillStyle=AI_.pa;x.fillRect(0,0,W,H);
  let full=null;const k=(o.img||[])[0];if(k){try{full=await arcImgGet(k)}catch(e){}}const im=await aiImg(full||(o.th||[])[0]);
  let y=72;
  let fs=im?50:64,L;for(;;){x.font=`700 ${fs}px ${AI_.SF}`;L=wrapW(x,o.t,W-144,im?4:6);if(L.length<=(im?3:4)||fs<=40)break;fs-=4}
  x.font=`500 26px ${AI_.SS}`;const NL=o.note?wrapW(x,o.note,W-144,2):[];
  if(im){const bh0=72+L.length*fs*1.42+(o.note?10+NL.length*38:0)+(o.iss?46:0),ph=Math.max(560,Math.min(860,H-(o.src?200:150)-bh0-90));aiCover(x,im,0,0,W,ph);y=ph+64}
  else{x.fillStyle=AI_.pine;x.fillRect(0,0,W,420);x.fillStyle='#e9d9a8';x.font=`700 ${o.p==='y'?190:110}px ${AI_.SF}`;x.textBaseline='alphabetic';const ds=aiDate(o);let fs=o.p==='y'?190:110;while(x.measureText(ds).width>W-144&&fs>50){fs-=8;x.font=`700 ${fs}px ${AI_.SF}`}x.fillText(ds,72,330);
    x.fillStyle='#cfe0d8';x.font=`600 26px ${AI_.SS}`;x.fillText('더숲 아카이브',72,110);y=420+72}
  // 글 덩어리 높이를 먼저 재서 남은 칸 가운데쯤에 놓는다
  const bh=72+L.length*fs*1.42+(NL.length?10+NL.length*38:0)+(o.iss?46:0),bot=H-(o.src?200:150);y=Math.max(y,y+((bot-y)-bh)*(im?.35:.42));
  x.font=`700 24px ${AI_.SS}`;const kw=x.measureText(o.k).width+28;x.strokeStyle='#c9a24a';x.lineWidth=2;x.strokeRect(72,y-30,kw,42);x.fillStyle=AI_.gold;x.textBaseline='middle';x.fillText(o.k,86,y-9);
  if(im){x.fillStyle=AI_.ink;x.font=`700 30px ${AI_.SS}`;x.fillText(aiDate(o)+(o.time?'  '+o.time:''),72+kw+20,y-9)}
  x.textBaseline='alphabetic';y+=72+fs*.2;
  x.font=`700 ${fs}px ${AI_.SF}`;x.fillStyle=AI_.ink;L.forEach(l=>{x.fillText(l,72,y);y+=fs*1.42});
  if(NL.length){y+=10;x.font=`500 26px ${AI_.SS}`;x.fillStyle=AI_.gold;NL.forEach(l=>{x.fillText(l,72,y);y+=38})}
  if(o.iss){y+=6;x.font=`600 26px ${AI_.SS}`;x.fillStyle=AI_.pine;x.fillText('묶음 · '+o.iss,72,Math.min(y,H-170));y+=40}
  if(o.src){x.font=`500 24px ${AI_.SS}`;x.fillStyle=AI_.sub;x.fillText('출처 · '+o.src,72,H-150)}
  aiFoot(x,W,H);return c}
async function aiList(L,title){await aiFonts();const per=7,pages=[],n=Math.ceil(L.length/per);
  for(let p=0;p<n;p++){const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.fillStyle=AI_.pa;x.fillRect(0,0,W,H);
    x.fillStyle=AI_.ink;x.font=`700 64px ${AI_.SF}`;x.textBaseline='alphabetic';x.fillText(title,72,140);
    x.fillStyle=AI_.sub;x.font=`500 24px ${AI_.SS}`;const span=L.length?`${aiDate(L[L.length-1])} – ${aiDate(L[0])}`:'';x.fillText(`${span}  ·  ${L.length}건`,72,190);
    x.fillStyle=AI_.ink;x.fillRect(72,222,W-144,3);
    let y=258;const rows=L.slice(p*per,p*per+per),rh=(H-258-150)/per;
    for(const o of rows){const im=await aiImg((o.th||[])[0]);
      x.fillStyle=AI_.pine;x.font=`700 26px ${AI_.SS}`;x.textBaseline='top';const ds=aiDate(o);x.fillText(ds,72,y+18);
      x.font=`700 20px ${AI_.SS}`;x.fillStyle=AI_.gold;x.fillText(o.k,72,y+56);
      const tx=290,tw=W-72-tx-(im?150:0);x.fillStyle=AI_.ink;x.font=`600 30px ${AI_.SF}`;const tl=wrapW(x,o.t,tw,2);tl.forEach((l,i)=>x.fillText(l,tx,y+16+i*42));
      if(o.src){x.font=`500 20px ${AI_.SS}`;x.fillStyle=AI_.sub;x.fillText('출처 · '+o.src,tx,y+16+tl.length*42+6)}
      if(im)aiCover(x,im,W-72-130,y+14,130,130);
      x.fillStyle=AI_.line;x.fillRect(72,y+rh-1,W-144,1);y+=rh}
    x.textBaseline='alphabetic';aiFoot(x,1080,1350,n>1?`${p+1} / ${n}`:'');pages.push(c)}
  return pages}
A.arcPng=async d=>{const o=ARC.L.find(x=>x.id===d.id);if(!o)return;toast('이미지를 만드는 중…');const c=await aiCard(o);await upSaveMany([c],'더숲아카이브_'+o.date+'_'+upName(o.t.slice(0,12)))};
A.arcPngAll=async()=>{const U=S.ui,f=U.arcF||'',q=(U.arcQ||'').trim();let L=ARC.L.slice().sort((a,b)=>(b.date+(b.time||''))<(a.date+(a.time||''))?-1:1);if(f)L=L.filter(x=>x.iss===f);if(q)L=L.filter(x=>(x.t+' '+(x.iss||'')+' '+x.k).includes(q));
  if(!L.length){toast('담긴 기록이 없습니다.');return}toast('이미지를 만드는 중…');const cs=await aiList(L,f||'더숲 아카이브');await upSaveMany(cs,'더숲아카이브_'+(f?upName(f):'목록'))};
/* 버튼 붙이기 */
(()=>{const f=V.aka.arc;V.aka.arc=()=>{let h=f();h=h.replace(/<button data-a="arcMore" data-id="([^"]+)">이어 쓰기<\/button>/g,'<button data-a="arcPng" data-id="$1">이미지</button><button data-a="arcMore" data-id="$1">이어 쓰기</button>');
  if(ARC.L.length)h=h.replace('<div class="arctl">',`<div class="arcall"><button class="btn" data-a="arcPngAll">${S.ui.arcF?'이 묶음':'보이는 기록'} 이미지로 받기</button></div><div class="arctl">`);return h}})();
