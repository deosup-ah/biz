/* 인쇄물 「더숲 결」 (참부장 11/18 「최선으로 다듬어」): 참고자료 문서의 공통 결을 기본 모양으로.
   바탕 #F4F1EA · 먹 #1C1C1A · 짙은 초록 #003128 · 회색 줄 #A8A399. 머리글 왼쪽 「○○ 큐레이션 서가」 · 오른쪽 「// …」,
   큰 제목 끝 커서 블록 ▮, 아래 「> 맺음말」 + 로고. 아이콘 · 장식 없음. 줄은 낱말 단위로만 나눈다. */
const HZ={bg:'#F4F1EA',ink:'#1C1C1A',g:'#003128',ln:'#A8A399',mu:'#6b675e'};
const hzHouse=D=>(D.st|0)===0&&(D.kind==='pop'||D.kind==='list'||D.kind==='card'||(D.kind==='band'&&!(D.bv|0)));
const hzLeft=D=>{const b=!D.br||D.br==='all'?'aka':D.br;return b==='aka'?'사유의숲 큐레이션 서가':BRN(b)+' 큐레이션 서가'};
const hzBooks=(D,pref)=>{if(pref&&D.list)return hzRows(D);if(Array.isArray(D.books)&&D.books.length)return D.books.map(b=>({t:b.t,a:[b.a,b.p].filter(Boolean).join(' · ')}));
  return hzRows(D)};
const hzRows=D=>{return (D.list||'').split('\n').map(s=>s.trim()).filter(r=>r&&r[0]!=='#').map(r=>{let [t,a,why]=r.split('|').map(s=>(s||'').trim());t=t.replace(/^\d{1,2}\.\s*/,'');return{t,a:(a||'').replace(/\s*·\s*[\d,]+원$/,''),why}})};
/* 뜻 단위 줄바꿈: 문장마다 새 줄, 한 문장이 길면 줄 길이를 고르게(끝줄 한두 낱말만 남지 않게) */
const hzBal=(t,font,size,maxW,weight)=>{let l=wrap(t,font,size,maxW,0,weight);if(l.length<2)return l;let lo=maxW*.45,hi=maxW;for(let i=0;i<12;i++){const mid=(lo+hi)/2;if(wrap(t,font,size,mid,0,weight).length<=l.length)hi=mid;else lo=mid}return wrap(t,font,size,hi,0,weight)};
const hzWrap=(t,font,size,maxW,maxL,weight)=>{const ss=String(t||'').replace(/\n/g,' ').split(/(?<=[.!?。])\s+/).filter(Boolean);let out=[];ss.forEach(x=>{out=out.concat(hzBal(x,font,size,maxW,weight))});if(out.length<=maxL)return out;out=hzBal(ss.join(' '),font,size,maxW,weight);return out.length>maxL?out.slice(0,maxL-1).concat(out[maxL-1]+'…'):out};
function hzLayout(D){const pr=[],T=(x,y,txt,size,o={})=>pr.push({k:'t',x,y,txt:String(txt),size,font:o.font||SANS,fill:o.fill||HZ.ink,anchor:o.anchor||'start',weight:o.weight||500,ls:o.ls||0}),
  R=(x,y,w,h,fill,o={})=>pr.push({k:'r',x,y,w,h,fill,...o}),
  LG=(x,y,size,anchor)=>{const b=!D.br||D.br==='all'?'aka':D.br;if(NM(b)){T(x,y,'노원문고',size*.95,{fill:HZ.g,weight:800,anchor});return}const h=size*1.2,w=h*LOGOS.plain,x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;pr.push({k:'i',src:'logo-g',x:x0,y:y-h*.8,w,h})},
  CUR=(x,y,s)=>R(x,y-s*.74,s*.36,s*.78,HZ.g),
  head=(D.head||'').replace(/\n/g,' ').trim(),CU=(S.ui.cor||[]).find(t=>t&&t.title===head),right='// '+(D.over||D.badge||(CU&&CU.tg)||'이 평대의 책'),q=/[?？]\s*$/.test(D.body||''),intro=D.kind==='pop'&&CU&&CU.hook&&q?CU.hook:D.body,foot=D.foot&&D.kind!=='list'?D.foot:(D.kind==='pop'&&q?D.body:'이 평대에서, 한 권 골라 보세요.');
  if(D.kind==='band'){const w=420,h=297,n=8,sh=h/n,ph=(D.phrases||'').split('\n').map(s=>s.trim()).filter(Boolean).slice(0,4);if(!ph.length)ph.push(head||'문구를 한 줄에 하나씩');
    for(let i=0;i<n;i++){const t=ph[Math.min(ph.length-1,Math.floor(i*ph.length/n))],y=i*sh,f=fit(t,SERIF,9.2,150,1,4.5,700);R(0,y,w,sh,HZ.bg);
      T(w*.51,y+sh*.5+f.s*.32,f.l[0],f.s,{font:SERIF,fill:HZ.ink,weight:700});CUR(w*.51+mw(f.l[0],SERIF,f.s,700)+1.6,y+sh*.5+f.s*.32,f.s*.9);
      T(w*.51,y+sh*.86,hzLeft(D),2.5,{fill:HZ.mu,weight:600,ls:.3});LG(w*.842,y+sh*.5+1.2,3);if(i)R(0,y,w,.01,'none',{stroke:'#8a8a8a',sw:.15,dash:'1.2 1.2'})}
    return{w,h,pr}}
  let [,w,h]=SIZES[D.kind][D.size]||SIZES[D.kind][0];if(D.kind==='pop'&&D.land)[w,h]=[h,w];
  const k=Math.min(w,h)/210,m=16*k;
  const top=()=>{T(m,m+4*k,hzLeft(D),3.4*k,{weight:700});T(w-m,m+4*k,right,3.4*k,{fill:HZ.mu,weight:600,anchor:'end'});R(m,m+8*k,w-m*2,.25*k,HZ.ln)};
  const bottom=t=>{R(m,h-m-9*k,w-m*2,.25*k,HZ.ln);T(m,h-m-1.5*k,'> '+t,3.7*k,{weight:600});LG(w-m,h-m-1.2*k,4.6*k,'end')};
  if(D.kind==='card'){const B=hzBooks(D,1).slice(0,6);R(0,0,w,h,'#ffffff');const cw=w/2,ch=h/3,p=9;
    for(let i=0;i<6;i++){const b=B[i];const x=(i%2)*cw,y=Math.floor(i/2)*ch;if(!b)continue;R(x+.6,y+.6,cw-1.2,ch-1.2,HZ.bg);
      T(x+p,y+p+3,hzLeft(D),2.7,{weight:700});T(x+cw-p,y+p+3,'// '+String(i+1).padStart(2,'0'),2.7,{fill:HZ.mu,weight:600,anchor:'end'});R(x+p,y+p+6,cw-p*2,.2,HZ.ln);
      const tf=fit(`『${b.t}』`,SERIF,9.5,cw-p*2,2,5,700);let yy=y+ch*.42;tf.l.forEach(l=>{T(x+p,yy,l,tf.s,{font:SERIF,weight:700});yy+=tf.s*1.25});
      if(b.a)T(x+p,yy+1,wrap(b.a,SANS,3.4,cw-p*2,1)[0],3.4,{fill:HZ.mu});if(b.why){const wl=wrap(b.why,SANS,3.6,cw-p*2,2,500);let wy=yy+9;wl.forEach(l=>{T(x+p,wy,l,3.6,{weight:500});wy+=5.4})}
      R(x+p,y+ch-p-6,cw-p*2,.2,HZ.ln);LG(x+cw-p,y+ch-p,3,'end')}
    for(let c=1;c<2;c++)R(cw*c,0,.01,h,'none',{stroke:'#9d9686',sw:.2,dash:'1.5 1.5'});for(let r=1;r<3;r++)R(0,ch*r,w,.01,'none',{stroke:'#9d9686',sw:.2,dash:'1.5 1.5'});return{w,h,pr}}
  R(0,0,w,h,HZ.bg);top();
  /* 큰 제목 + 커서 */
  const ts=(D.kind==='list'?11:17)*k*(D.hs||1),TF=fit(head||'이 평대의 책',SANS,ts,w-m*2-6*k,D.kind==='list'?2:3,6*k,800);if(TF.l.length>1)TF.l=hzBal(head,SANS,TF.s,w-m*2-6*k,800);let y=(D.kind==='list'?m+24*k:h*.24)+TF.s*.2;
  TF.l.forEach((l,i)=>{y+=TF.s*(i?1.2:.9);T(m,y,l,TF.s,{weight:800,ls:-TF.s*.03})});CUR(m+mw(TF.l[TF.l.length-1],SANS,TF.s,800)*(1-.03)+1.6*k,y,TF.s*.92);
  if(intro){y+=TF.s*.55+4*k;hzWrap(intro,SANS,(D.kind==='pop'?5.4:4.8)*k,w-m*2-(D.kind==='pop'?20*k:0),3,500).forEach(l=>{y+=(D.kind==='pop'?8.4:7.4)*k;T(m,y,l,(D.kind==='pop'?5.4:4.8)*k,{fill:'#3a3a36',weight:500})})}
  const B=hzBooks(D,D.kind==='list');
  if(D.kind==='list'){y+=12*k;T(m,y,'이 평대의 책',3.2*k,{fill:HZ.g,weight:800,ls:.6*k});y+=3*k;R(m,y,w-m*2,.25*k,HZ.ink);const room=h-m-14*k-y,ih=Math.max(12*k,Math.min(19*k,room/Math.max(1,B.length)));
    B.slice(0,Math.max(1,Math.floor(room/(12*k)))).forEach((b,i)=>{const yy=y+ih*.55;T(m,yy,String(i+1).padStart(2,'0'),5*k,{font:SERIF,fill:HZ.g,weight:700});T(m+11*k,yy,wrap(`『${b.t}』`,SERIF,5.2*k,w-m*2-60*k,1,700)[0],5.2*k,{font:SERIF,weight:700});
      if(b.a)T(w-m,yy,wrap(b.a,SANS,3.4*k,55*k,1)[0],3.4*k,{fill:HZ.mu,anchor:'end'});if(b.why)T(m+11*k,yy+5.6*k,wrap(b.why,SANS,3.6*k,w-m*2-11*k,1)[0],3.6*k,{fill:'#3a3a36'});y+=ih;R(m,y,w-m*2,.15*k,'#d6d0c2')});
    bottom(D.foot||'번호는 평대 위 자리와 같습니다.');return{w,h,pr}}
  /* POP: 함께 놓은 책 (아래에서 위로) */
  const nB=h<170?1:h<230?2:3,BB=B.length?B.slice(0,nB):(D.book?[{t:D.book,a:D.author}]:[]);
  if(BB.length){const rh=14.5*k;let by=h-m-16*k-BB.length*rh;T(m,by,'함께 놓은 책',3.2*k,{fill:HZ.g,weight:800,ls:.6*k});BB.forEach((b,i)=>{const yy=by+rh*(i+1)-3*k;T(m,yy,wrap(`『${b.t}』`,SERIF,6.4*k,w-m*2,1,700)[0],6.4*k,{font:SERIF,weight:700});if(b.a)T(m,yy+5.6*k,wrap(b.a,SANS,3.5*k,w-m*2,1)[0],3.5*k,{fill:HZ.mu})})}
  bottom(foot);return{w,h,pr}}
(()=>{const L0=layout;layout=function(D){try{if(D&&hzHouse(D))return hzLayout(D)}catch(e){console.warn(e)}return L0(D)}})();
if(typeof STY!=='undefined'&&STY[0]==='기본')STY[0]='더숲 결';
