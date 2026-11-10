'use strict';
/* POP · 띠지 · 평대 책 목록 · 선반 이름표 — 더숲 샘플 모양에 맞춘 틀 */
const SANS='"Pretendard","IBM Plex Sans KR",sans-serif',SERIF='"Gowun Batang",serif';
const KINDS=[['pop','POP'],['band','띠지'],['list','평대 책 목록'],['shelf','선반 이름표']];
const SIZES={pop:[['A5 세로',148,210],['A4 세로',210,297],['A6 세로',105,148]],band:[['A3 가로 · 8줄',420,297]],list:[['A4 세로',210,297]],shelf:[['선반 이름표',90,55],['긴 이름표',180,50]]};
const POPC=[{n:'크림',bg:'#f3efe6',fg:'#1f2a44',ac:'#e07b45',hl:'#f2c230',b1:'#c9d6c2',b2:'#d9d5d8',box:'#ffffff'},{n:'숲',bg:'#eef1e8',fg:'#1f3b2d',ac:'#2f6b4a',hl:'#e9c46a',b1:'#cfdcc6',b2:'#e3ddcf',box:'#ffffff'},{n:'밤',bg:'#232a45',fg:'#f3efe6',ac:'#f2c230',hl:'#e07b45',b1:'#303a5e',b2:'#3a3350',box:'#303a5e'},{n:'살구',bg:'#f8ebe1',fg:'#4a2a22',ac:'#c8553d',hl:'#f5c9a8',b1:'#f1d6c4',b2:'#e6dccf',box:'#ffffff'}];
const BANDC=[{n:'밤',a:'#261d3d',b:'#3a2c52',fg:'#f0e6d8',ac:'#f2a57c'},{n:'크림',a:'#f8f1e4',b:'#f0e5d0',fg:'#4a3a2a',ac:'#c9935a'},{n:'장미',a:'#f1eceb',b:'#e8dcdd',fg:'#5a2a2e',ac:'#8e2a2e'},{n:'이끼',a:'#f0f1ec',b:'#dadcd3',fg:'#2c3a30',ac:'#e07b45'},{n:'숲',a:'#2c463a',b:'#2c463a',fg:'#f3ead2',ac:'#d9b65a'},{n:'새벽',a:'#d6deea',b:'#ecdcc9',fg:'#3a4660',ac:'#f2a57c'}];
const MOTIF=['고리','해','달','점','액자','없음'];
const defD=()=>({kind:'pop',size:0,pal:0,motif:0,tag:'',badge:'',head:'',body:'',book:'',author:'',price:'',phrases:'',list:'',foot:'',br:curBr(),books:[]});
const mctx=document.createElement('canvas').getContext('2d');
const mw=(t,font,size,weight)=>{mctx.font=`${weight||400} ${size*10}px ${font}`;return mctx.measureText(t).width/10};
function wrap(text,font,size,maxW,maxLines,weight){const out=[];String(text||'').split('\n').forEach(par=>{let line='';for(const tok of par.split(/(\s+)/)){if(mw(line+tok,font,size,weight)<=maxW){line+=tok;continue}
      if(line.trim()){out.push(line.trim());line=''}let w=tok.trim();while(w.length>1&&mw(w,font,size,weight)>maxW){let i=w.length;while(i>1&&mw(w.slice(0,i),font,size,weight)>maxW)i--;out.push(w.slice(0,i));w=w.slice(i)}line=w}
    if(line.trim())out.push(line.trim())});return maxLines&&out.length>maxLines?out.slice(0,maxLines-1).concat(out[maxLines-1]+'…'):out}
function fit(text,font,size,maxW,maxLines,min,weight){let s=size,l=wrap(text,font,s,maxW,0,weight);while(l.length>maxLines&&s>min){s*=.93;l=wrap(text,font,s,maxW,0,weight)}return{s,l:l.slice(0,maxLines)}}
function layout(D){const pr=[],brand='더숲 '+brN(!D.br||D.br==='all'?'aka':D.br);
  const T=(x,y,txt,size,o={})=>pr.push({k:'t',x,y,txt:String(txt),size,font:o.font||SANS,fill:o.fill||'#111',anchor:o.anchor||'start',weight:o.weight||500,ls:o.ls||0});
  const R=(x,y,w,h,fill,o={})=>pr.push({k:'r',x,y,w,h,fill,...o});
  const O=(x,y,rx,ry,fill,o={})=>pr.push({k:'o',x,y,rx,ry,fill,...o});
  const LOGO=(x,y,size,fill,anchor)=>{const a=mw('de',SERIF,size,700),b=mw('sup',SERIF,size,700),r=size*.24,g=size*.16,tot=a+r*2+g*2+b,x0=anchor==='end'?x-tot:anchor==='middle'?x-tot/2:x,cx=x0+a+g+r,cy=y-size*.27;
    T(x0,y,'de',size,{font:SERIF,fill,weight:700});O(cx,cy,r,r,fill);O(cx-r*.55,cy+r*.25,r*.62,r*.62,fill);O(cx+r*.55,cy+r*.25,r*.62,r*.62,fill);O(cx,cy-r*.45,r*.7,r*.7,fill);T(x0+a+g*2+r*2,y,'sup',size,{font:SERIF,fill,weight:700});return tot};
  const motif=(m,cx,cy,r,ac,fg)=>{if(m===0)O(cx,cy,r,r,'none',{stroke:ac,sw:r*.2});else if(m===1){O(cx,cy-r*.1,r*.8,r*.8,ac);R(cx-r*1.6,cy+r*.75,r*3.2,r*.07,fg);R(cx-r*.9,cy+r*1.0,r*1.8,r*.06,ac);R(cx-r*.6,cy+r*1.22,r*1.2,r*.06,ac)}
    else if(m===2){O(cx-r*.3,cy,r*.8,r*.8,ac);O(cx+r*.35,cy,r*.8,r*.8,'none',{stroke:ac,sw:r*.06,dash:`${r*.12} ${r*.12}`})}
    else if(m===3){O(cx,cy,r*.22,r*.22,ac);for(let k=0;k<12;k++){const a=k*Math.PI/6;O(cx+Math.cos(a)*r*.6,cy+Math.sin(a)*r*.6,r*.09,r*.09,k%2?ac:fg);O(cx+Math.cos(a+.26)*r,cy+Math.sin(a+.26)*r,r*.07,r*.07,k%3?fg:ac)}}
    else if(m===4){R(cx-r*.8,cy-r,r*1.6,r*2,'none',{stroke:fg,sw:r*.1});R(cx-r*.6,cy-r*.8,r*1.2,r*1.6,ac,{op:.35});O(cx+r*.2,cy-r*.35,r*.2,r*.2,ac)}};
  if(D.kind==='band'){const w=420,h=297,n=8,sh=h/n,ph=(D.phrases||'').split('\n').map(s=>s.trim()).filter(Boolean).slice(0,4);if(!ph.length)ph.push('문구를 한 줄에 하나씩 적어 주세요');
    for(let i=0;i<n;i++){const j=Math.min(ph.length-1,Math.floor(i*ph.length/n)),P=BANDC[(D.pal+j)%BANDC.length],m=D.motif===5?5:(D.motif+j)%5,y=i*sh,cy=y+sh/2;R(0,y,w,sh,P.a,{fill2:P.b});
      const f=fit(ph[j],SERIF,4.6,150,1,3,700);if(m!==5)motif(m,w*.45,cy,sh*.2,P.ac,P.fg);T(w*.51,y+sh*.42,f.l[0],f.s,{font:SERIF,fill:P.fg,weight:700});LOGO(w*.585,y+sh*.8,3.1,P.fg,'start');
      if(m!==5)motif(m,w*.82,cy,sh*.07,P.ac,P.fg);LOGO(w*.842,cy+1.1,3,P.fg,'start');if(i)R(0,y,w,.01,'none',{stroke:'#8a8a8a',sw:.15,dash:'1.2 1.2'})}
    return{w,h,pr}}
  const [,w,h]=SIZES[D.kind][D.size]||SIZES[D.kind][0];
  if(D.kind==='list'){const fg='#1f3b2d',m=w*.08;R(0,0,w,h,'#f4f1e8');LOGO(m,m+4.5,8.5,fg,'start');T(w-m,m+3.5,D.tag||brand,3.7,{fill:fg,weight:800,anchor:'end'});R(m,m+10,w-m*2,.3,fg);
    const tf=fit(D.head||'이 평대의 책',SERIF,12.5,w-m*2,1,6,700),title=tf.l[0],tw=mw(title,SERIF,tf.s,700);T(m,m+27,title,tf.s,{font:SERIF,fill:fg,weight:700});let y=m+27;
    if(D.body){if(tw+6+mw(D.body,SERIF,4.8,400)<=w-m*2)T(m+tw+6,y,D.body,4.8,{font:SERIF,fill:fg,weight:400});else{y+=8;T(m,y,wrap(D.body,SERIF,4.8,w-m*2,1)[0],4.8,{font:SERIF,fill:fg,weight:400})}}
    y+=11;const rows=(D.list||'').split('\n').map(s=>s.trim()).filter(Boolean);if(!rows.length)rows.push('책 이름 | 저자 · 출판사 | 한 줄 소개');
    const items=rows.filter(r=>r[0]!=='#').length,secs=rows.length-items,room=h-m-10-y,ih=Math.max(11,Math.min(15.5,(room-secs*10)/Math.max(1,items)));
    for(const row of rows){if(y>h-m-12)break;if(row[0]==='#'){T(m,y+1,row.replace(/^#+\s*/,''),4,{fill:fg,weight:800,ls:.3});R(m,y+4,w-m*2,.3,fg);y+=10;continue}
      const [t,ap,why]=row.split('|').map(s=>(s||'').trim());O(m+1.4,y-1.4,.9,.9,fg);const apW=ap?mw(ap,SANS,3.3,500)+4:0;T(m+6,y,wrap(`『${t}』`,SERIF,5,w-m*2-6-apW,1,700)[0],5,{font:SERIF,fill:fg,weight:700});if(ap)T(w-m,y,ap,3.3,{fill:fg,anchor:'end'});
      if(why)T(m+6,y+ih*.42,wrap(why,SERIF,3.7,w-m*2-6,1)[0],3.7,{font:SERIF,fill:fg,weight:400});R(m+6,y+ih*.62,w-m*2-6,.15,'#c5c6b8');y+=ih}
    if(D.foot)T(m,h-m,D.foot,3.5,{font:SERIF,fill:fg,weight:400});return{w,h,pr}}
  const P=POPC[D.pal]||POPC[0],m=w*.075;R(0,0,w,h,P.bg);
  if(D.kind==='shelf'){R(0,0,w*.03,h,P.ac);if(D.tag)T(m*1.5,h*.22,D.tag,h*.085,{fill:P.ac,weight:800,ls:.3});const H=fit(D.head||'매대 이름',SERIF,h*.28,w-m*3,2,6,700);let y=h*.52-(H.l.length-1)*H.s*.55+(D.body?-h*.05:H.s*.3);
    H.l.forEach(l=>{T(m*1.5,y,l,H.s,{font:SERIF,fill:P.fg,weight:700});y+=H.s*1.15});if(D.body)wrap(D.body,SANS,h*.085,w-m*3,2).forEach(l=>{T(m*1.5,y,l,h*.085,{fill:P.fg});y+=h*.12});LOGO(w-m*.8,h-m*.7,h*.1,P.fg,'end');return{w,h,pr}}
  O(w*1.02,h*.31,w*.3,h*.125,P.b1);O(-w*.02,h*.69,w*.1,h*.085,P.b2);
  const lw=LOGO(m,m+w*.05,w*.062,P.fg,'start');if(D.tag){R(m+lw+w*.022,m+w*.012,.35,w*.042,P.fg);T(m+lw+w*.045,m+w*.047,D.tag,w*.032,{fill:P.fg,weight:800})}
  if(D.badge){const r=w*.1,cx=w-m-r*.9,cy=m+r*.85,bl=D.badge.split(/\n|\s+/).filter(Boolean).slice(0,3),big=bl.find(x=>/\d/.test(x))||bl[Math.floor(bl.length/2)];O(cx,cy,r,r*.94,P.ac);let by=cy-(bl.length-1)*r*.3+r*.12;bl.forEach(l=>{const s=l===big&&bl.length>1?r*.5:r*.3;T(cx,by+(s>r*.4?r*.08:0),l,s,{fill:'#fff',weight:800,anchor:'middle'});by+=r*.52})}
  const hd=D.head||'여기에 큰 문구를\n적어 주세요',H=fit(hd,SANS,w*.108,w-m*2,Math.min(3,Math.max(1,hd.split('\n').length)),w*.055,800);let y=h*.21+H.s;
  H.l.forEach((l,i)=>{if(i===H.l.length-1)R(m-w*.005,y-H.s*.36,mw(l,SANS,H.s,800)+w*.012,H.s*.44,P.hl);T(m,y,l,H.s,{fill:P.fg,weight:800});y+=H.s*1.24});
  y+=w*.012;const bs=w*.04;wrap(D.body||'',SANS,bs,w-m*2,4,500).forEach(l=>{T(m,y,l,bs,{fill:P.fg,weight:500});y+=bs*1.65});
  if(D.book){y+=w*.03;const bh=w*(D.author?.2:.15);R(m,y,w-m*2,bh,P.box,{rx:w*.014,stroke:P.fg,sw:.35});T(m+w*.04,y+w*.055,'오늘의 책',w*.03,{fill:P.fg,weight:800});T(m+w*.19,y+w*.055,"Today's Pick",w*.026,{fill:P.fg,weight:500});
    const pw=D.price?mw(D.price,SANS,w*.04,800)+w*.05:0;R(m+w*.04,y+w*.085,w*.09,w*.045,P.ac);T(m+w*.16,y+w*.12,wrap(`『${D.book}』`,SANS,w*.04,w-m*2-w*.22-pw,1,800)[0],w*.04,{fill:P.fg,weight:800});if(D.price)T(w-m-w*.04,y+w*.12,D.price,w*.04,{fill:P.fg,weight:800,anchor:'end'});
    if(D.author){R(m+w*.04,y+w*.14,w*.09,w*.035,P.b1==='#303a5e'?P.hl:'#5f8163');T(m+w*.16,y+w*.168,wrap(D.author,SANS,w*.03,w-m*2-w*.22,1)[0],w*.03,{fill:P.fg})}}
  T(m,h-m,brand,w*.03,{fill:P.fg,weight:800});return{w,h,pr}}
function toSVG(L){let defs='',g=0;const body=L.pr.map(p=>{if(p.k==='r'){let fill=p.fill;if(p.fill2&&p.fill2!==p.fill){const id='g'+(g++);defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fill}"/><stop offset="1" stop-color="${p.fill2}"/></linearGradient>`;fill=`url(#${id})`}
      return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${fill}" ${p.rx?`rx="${p.rx}"`:''} ${p.op?`opacity="${p.op}"`:''} ${p.stroke?`stroke="${p.stroke}" stroke-width="${p.sw}" ${p.dash?`stroke-dasharray="${p.dash}"`:''}`:''}/>`}
    if(p.k==='o')return `<ellipse cx="${p.x}" cy="${p.y}" rx="${p.rx}" ry="${p.ry}" fill="${p.fill}" ${p.stroke?`stroke="${p.stroke}" stroke-width="${p.sw}" ${p.dash?`stroke-dasharray="${p.dash}"`:''}`:''}/>`;
    return `<text x="${p.x}" y="${p.y}" text-anchor="${p.anchor}" style="font-family:${p.font.replace(/"/g,"'")};font-size:${p.size}px;font-weight:${p.weight};fill:${p.fill};letter-spacing:${p.ls}px">${esc(p.txt)}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.w} ${L.h}" width="${Math.min(L.w*3.2,980)}"><defs>${defs}</defs>${body}</svg>`}
function toPNG(L){const k=300/25.4,c=document.createElement('canvas');c.width=Math.round(L.w*k);c.height=Math.round(L.h*k);const x=c.getContext('2d');x.scale(k,k);
  const stroke=p=>{if(p.stroke){x.strokeStyle=p.stroke;x.lineWidth=p.sw;x.setLineDash(p.dash?p.dash.split(' ').map(Number):[])}};
  L.pr.forEach(p=>{x.save();if(p.op)x.globalAlpha=p.op;if(p.k==='r'){x.beginPath();if(p.rx&&x.roundRect)x.roundRect(p.x,p.y,p.w,p.h,p.rx);else x.rect(p.x,p.y,p.w,p.h);if(p.fill&&p.fill!=='none'){if(p.fill2&&p.fill2!==p.fill){const g=x.createLinearGradient(0,p.y,0,p.y+p.h);g.addColorStop(0,p.fill);g.addColorStop(1,p.fill2);x.fillStyle=g}else x.fillStyle=p.fill;x.fill()}if(p.stroke){stroke(p);x.stroke()}}
    else if(p.k==='o'){x.beginPath();x.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);if(p.fill&&p.fill!=='none'){x.fillStyle=p.fill;x.fill()}if(p.stroke){stroke(p);x.stroke()}}
    else{x.font=`${p.weight} ${p.size}px ${p.font}`;x.fillStyle=p.fill;x.textAlign={start:'left',middle:'center',end:'right'}[p.anchor];try{x.letterSpacing=p.ls+'px'}catch(e){}x.fillText(p.txt,p.x,p.y)}x.restore()});
  return new Promise(r=>c.toBlob(r,'image/png'))}
V.store.design=()=>{const D=S.ui.D=S.ui.D||defD(),L=layout(D),sz=SIZES[D.kind],k=D.kind;
  const F=(id,label,key,ph,rows)=>`<div class="fld"><label for="${id}">${label}</label>${rows?`<textarea id="${id}" rows="${rows}" data-c="dSet" data-k="${key}" placeholder="${ph}">${esc(D[key])}</textarea>`:`<input type="text" id="${id}" data-c="dSet" data-k="${key}" value="${esc(D[key])}" placeholder="${ph}">`}</div>`;
  const pals=k==='band'?BANDC.map(p=>[p.a,p.ac,p.n]):POPC.map(p=>[p.bg,p.ac,p.n]);
  return `<div class="sec"><h2>POP · 띠지 디자인</h2><p>글만 넣으면 더숲 모양의 인쇄용 그림(300dpi)이 됩니다</p></div>
  <div class="grid g2" style="align-items:start"><div class="card form">
    <div class="chips">${KINDS.map(([v,l])=>`<button class="chip" data-a="dKind" data-k="${v}" aria-pressed="${k===v}">${l}</button>`).join('')}</div>
    ${sz.length>1?`<div class="fld"><label>크기</label><div class="chips">${sz.map(([n,w,h],i)=>`<button class="chip" data-a="dPick" data-k="size" data-v="${i}" aria-pressed="${D.size===i}">${n} ${w}×${h}mm</button>`).join('')}</div></div>`:''}
    ${D.books&&D.books.length>1&&k==='pop'?`<div class="fld"><label>주제 속 책으로 바꾸기</label><div class="chips">${D.books.slice(0,10).map((b,i)=>`<button class="chip" data-a="dBook" data-i="${i}" aria-pressed="${D.book===b.t}">${esc(b.t.length>12?b.t.slice(0,12)+'…':b.t)}</button>`).join('')}</div></div>`:''}
    ${k==='band'?F('dPh','띠지 문구 (한 줄에 하나, 4개까지)','phrases','예: 어둠 속에서도, 축제\n번역되지 않는 맛',4)+`<p class="note">A3 한 장에 8줄이 나옵니다. 문구가 4개면 2줄씩, 1개면 8줄 모두 같습니다. 점선을 따라 자르면 한 줄이 420×37mm 입니다.</p><div class="fld"><label>작은 그림</label><div class="chips">${MOTIF.map((n,i)=>`<button class="chip" data-a="dPick" data-k="motif" data-v="${i}" aria-pressed="${D.motif===i}">${n}</button>`).join('')}</div></div>`
     :k==='list'?F('dTag','오른쪽 위 머리말','tag','예: 인물도서관 · 한살림 40년')+F('dHead','제목','head','이 평대의 책')+F('dBody','부제','body','예: 좁쌀 한 알이 차린 40년의 밥상')+F('dList','책 목록 (한 줄에: 책 이름 | 저자 · 출판사 | 한 줄 소개. # 으로 시작하면 묶음 제목)','list','# 처음 만나는 책\n가호 | 무라카미 하루키 · 문학동네 | 긴 밤에 어울리는 긴 소설.',9)+F('dFoot','맨 아래 한 줄','foot','예: 이 평대의 책을 사시면 책갈피를 드립니다.')
     :k==='shelf'?F('dTag','작은 머리말','tag','예: 11월의 문학')+F('dHead','매대 이름','head','예: 긴 밤에는 긴 소설을')+F('dBody','한 줄 설명','body','')
     :F('dTag','로고 옆 이름','tag','예: 사유의숲')+F('dHead','큰 문구 (마지막 줄에 색 띠가 깔립니다)','head','예: 『서울감자도』를 사면\n서울이 한 장.',2)+F('dBody','소개 글','body','손님에게 건네는 두세 문장',3)+`<div class="f2">${F('dBook','책 이름','book','예: 가호')}${F('dAuth','저자 · 출판사','author','예: 무라카미 하루키 · 문학동네')}</div><div class="f2">${F('dPrice','값 (비워도 됨)','price','예: 16,800원')}${F('dBadge','동그라미 딱지 (비워도 됨)','badge','예: 선착순 20명 한정')}</div>`}
    <div class="btns">${busyBtn('copy','문구 추천받기','dCopy')}</div>
    ${(S.ui.copies||[]).length?`<div class="list">${S.ui.copies.map((c,i)=>`<div class="li"><div class="t"><b>${esc(c.head)}</b><small>${esc(c.body||'')}</small></div><button class="btn sm" data-a="dUse" data-i="${i}">쓰기</button></div>`).join('')}</div>`:''}
    ${k==='list'?'':`<div class="fld"><label>${k==='band'?'첫 줄 색 (다음 문구는 이어지는 색)':'색'}</label><div class="btns">${pals.map(([a,b,n],i)=>`<button class="sw" data-a="dPick" data-k="pal" data-v="${i}" aria-pressed="${D.pal===i}" aria-label="${n}" title="${n}" style="background:linear-gradient(135deg,${a} 60%,${b} 60%)"></button>`).join('')}</div></div>`}</div>
   <div class="grid"><div class="stage" id="stage">${toSVG(L)}</div>
    <div class="btns"><button class="btn pri" data-a="dPng">인쇄용 그림 받기 (PNG)</button><button class="btn" data-a="dNew">새로 만들기</button><span class="note">${Math.round(L.w)}×${Math.round(L.h)}mm · 프린터에서 「실제 크기」로 인쇄하세요</span></div></div></div>`};
V.aka.design=V.store.design;
function dRefresh(){const s=$('stage');if(s)s.innerHTML=toSVG(layout(S.ui.D))}
C.dSet=(el,d)=>{S.ui.D[d.k]=el.value;dRefresh()};
document.addEventListener('input',e=>{const el=e.target.closest&&e.target.closest('[data-c="dSet"]');if(el){S.ui.D[el.dataset.k]=el.value;dRefresh()}});
A.dKind=d=>{const D=S.ui.D;D.kind=d.k;D.size=0;D.pal=0;if(d.k==='band'&&!D.phrases)D.phrases=D.head||'';if(d.k==='list'&&!D.list&&(D.books||[]).length)D.list=D.books.map(b=>`${b.t} | ${[b.a,b.p].filter(Boolean).join(' · ')} | ${b.why||''}`).join('\n');render()};
A.dPick=d=>{S.ui.D[d.k]=+d.v;render()};A.dNew=()=>{S.ui.D=defD();S.ui.copies=[];render()};
A.dBook=d=>{const b=S.ui.D.books[+d.i];S.ui.D.book=b.t;S.ui.D.author=[b.a,b.p].filter(Boolean).join(' · ');render()};
A.dUse=d=>{const c=S.ui.copies[+d.i],D=S.ui.D;if(D.kind==='band')D.phrases=((D.phrases||'').trim()+'\n'+c.head).trim().split('\n').slice(-4).join('\n');else{D.head=c.head;D.body=c.body||''}render()};
A.dCopy=async()=>{const D=S.ui.D,lim=D.kind==='band'?'head 만 씁니다. 14자 이내의 짧고 여운 있는 문구(예: "번역되지 않는 맛", "해가 지지 않던 밤"). body 는 빈 문자열':D.kind==='shelf'?'head 12자 이내(매대 이름), body 28자 이내':D.kind==='list'?'head 는 평대 제목 10자 이내, body 는 부제 24자 이내':'head 는 두 줄(줄바꿈 \\n 포함, 줄마다 10자 이내), body 60자 이내';
  const out=await ask('copy',`독립서점 "더숲"의 ${KINDS.find(k=>k[0]===D.kind)[1]}에 넣을 문구를 서로 다른 말투로 4개 써 주세요.\n주제/머리말: ${D.tag||'없음'}\n책: ${D.book||(D.books||[]).slice(0,6).map(b=>b.t).join(', ')||'특정 책 없음'} ${D.author||''}\n지금 적어 둔 문구: ${D.head||D.phrases||'없음'} / ${D.body||'없음'}\n오늘: ${TODAY}\n규칙: ${lim}. 손님에게 건네는 말투. 과장·최상급 금지. 책의 줄거리나 수상 이력 등 확실하지 않은 사실은 쓰지 마세요.\nJSON 배열로만: [{"head":"","body":""}]`,{modelTier:'quick'});
  if(out)S.ui.copies=(Array.isArray(out)?out:[]).filter(c=>c&&c.head).slice(0,4)};
A.dPng=async()=>{try{if(document.fonts){await Promise.all(['800 20px Pretendard','500 20px Pretendard','700 20px "Gowun Batang"'].map(f=>document.fonts.load(f,'더숲')));await document.fonts.ready}}catch(e){}const D=S.ui.D,blob=await toPNG(layout(D));if(!blob){toast('그림을 만들지 못했습니다');return}
  await saveFile(`더숲_${KINDS.find(k=>k[0]===D.kind)[1].replace(/\s/g,'')}_${(D.head||D.phrases||D.book||'디자인').split('\n')[0].replace(/[\\/:*?"<>|\s]+/g,'_').slice(0,20)}.png`,blob)};
