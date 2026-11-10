'use strict';
/* 진열(DP) — 900×900mm 평대 기준. 코너의 책으로 어디에 무엇을 몇 권 놓을지 그림과 표로 낸다. */
const DPC=['#b9643f','#3f6f8f','#5f8163','#c9a13a','#8a5a7a','#6b6f7a'];
function dpPlan(t){const B=(t.books||[]).slice(0,6),mini=t.sym==='star'||B.filter(b=>/미니|키링/.test(b.t)).length>=3,it=[],rows=[],bw=mini?105:150,bd=mini?150:210,th=mini?12:20;
  it.push({k:'table'});const xs=[90,375,660];
  if(mini){it.push({k:'pop',x:345,y:70});B.forEach((b,i)=>{const r=Math.floor(i/3),x=[150,400,650][i%3],y=r?600:330,n=r?5:7;it.push({k:'stack',x,y,w:bw,d:bd,h:n*th,c:DPC[i],n:i+1});rows.push({n:i+1,b,place:`${r?'앞줄':'가운데 줄'} ${['왼쪽','가운데','오른쪽'][i%3]} · ${n}권 쌓기`,qty:n})});it.push({k:'tray',x:120,y:300,w:660,d:480})}
  else{it.push({k:'pop',x:345,y:60});B.forEach((b,i)=>{if(i<2){const x=i?660:90;it.push({k:'face',x,y:70,c:DPC[i],n:i+1});const n=i?4:5;it.push({k:'stack',x,y:330,w:bw,d:bd,h:n*th,c:DPC[i],n:i+1});rows.push({n:i+1,b,place:`뒷줄 ${i?'오른쪽':'왼쪽'}에 1권 세우고, 그 앞에 ${n}권 쌓기`,qty:n+1})}
      else if(i===2){it.push({k:'stack',x:375,y:330,w:bw,d:bd,h:3*th,c:DPC[i],n:3});rows.push({n:3,b,place:'가운데 · POP 바로 앞에 3권 쌓기',qty:3})}
      else{const x=xs[i-3];it.push({k:'stack',x,y:620,w:bw,d:bd,h:2*th,c:DPC[i],n:i+1});rows.push({n:i+1,b,place:`앞줄 ${['왼쪽','가운데','오른쪽'][i-3]}에 2권 눕히기`,qty:2})}})}
  it.push({k:'card',x:405,y:860});
  const tips=mini?['POP 은 뒷줄 가운데, 눈높이보다 낮아도 글씨가 읽히게 세웁니다.','작은 책은 쟁반이나 낮은 상자에 모아 흩어지지 않게 합니다.','가운데 줄을 앞줄보다 2권 높게 쌓아 계단을 만듭니다.','이름표는 앞 모서리 가운데. 값이 다르면 책마다 작은 가격표를 붙입니다.']
   :['뒤는 높게, 앞은 낮게. 세운 책 → 5권 → 3권 → 2권 순서로 내려오게 합니다.','POP 은 뒷줄 가운데. 양옆 세운 책의 표지가 POP 을 가리지 않게 15cm 띄웁니다.','쌓은 책이 2권 아래로 내려가면 그날 채웁니다. 한 권만 남은 더미는 안 팔립니다.','평대의 1/5 은 비워 둡니다. 손님이 집었다 놓을 자리입니다.','이름표는 앞 모서리 가운데, 띠지는 맨 위 책에만 두릅니다.'];
  return{it,rows,tips,total:rows.reduce((a,r)=>a+r.qty,0)}}
function dpSVG(P){const C=Math.cos(Math.PI/6),pj=(x,y,z)=>[(x-y)*C,(x+y)*.5-z],pts=a=>a.map(p=>pj(...p).map(v=>v.toFixed(1)).join(',')).join(' '),sh=(c,k)=>`color-mix(in srgb, ${c} ${k}%, #1a1a1a)`;let out='';
  const box=(x,y,z,w,d,h,c)=>`<polygon points="${pts([[x,y+d,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x,y+d,z]])}" fill="${sh(c,84)}"/><polygon points="${pts([[x+w,y,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x+w,y,z]])}" fill="${sh(c,68)}"/><polygon points="${pts([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]])}" fill="${c}" stroke="${sh(c,60)}" stroke-width="1"/>`;
  const num=(x,y,z,n)=>{const [a,b]=pj(x,y,z);return `<circle cx="${a}" cy="${b}" r="26" fill="#fff" stroke="#1f2a24" stroke-width="2"/><text x="${a}" y="${b+10}" text-anchor="middle" style="font:800 28px Pretendard,sans-serif;fill:#1f2a24">${n}</text>`};
  const lab=(x,y,z,t)=>{const [a,b]=pj(x,y,z);return `<text x="${a}" y="${b}" text-anchor="middle" style="font:800 24px Pretendard,sans-serif;fill:#1f2a24">${t}</text>`};
  const order=P.it.filter(i=>i.k!=='table').sort((a,b)=>(a.x+a.y)-(b.x+b.y));
  out+=box(0,0,-40,900,900,40,'#dcc9a3')+`<polygon points="${pts([[40,900,-40],[90,900,-40],[90,900,-420],[40,900,-420]])}" fill="#b9a67f"/><polygon points="${pts([[810,900,-40],[860,900,-40],[860,900,-420],[810,900,-420]])}" fill="#b9a67f"/><polygon points="${pts([[900,40,-40],[900,90,-40],[900,90,-420],[900,40,-420]])}" fill="#a8956f"/>`;
  [300,600].forEach(v=>{out+=`<polyline points="${pts([[v,0,0],[v,900,0]])}" stroke="#c4b089" stroke-width="1" stroke-dasharray="6 8" fill="none"/><polyline points="${pts([[0,v,0],[900,v,0]])}" stroke="#c4b089" stroke-width="1" stroke-dasharray="6 8" fill="none"/>`});
  order.forEach(i=>{if(i.k==='tray')out+=`<polygon points="${pts([[i.x,i.y,1],[i.x+i.w,i.y,1],[i.x+i.w,i.y+i.d,1],[i.x,i.y+i.d,1]])}" fill="#f4ecdc" stroke="#b9a67f" stroke-width="2"/>`});
  order.forEach(i=>{if(i.k==='stack')out+=box(i.x,i.y,0,i.w,i.d,i.h,i.c)+num(i.x+i.w/2,i.y+i.d/2,i.h,i.n);
    else if(i.k==='face')out+=box(i.x,i.y,0,150,28,215,i.c)+num(i.x+75,i.y+28,120,i.n);
    else if(i.k==='pop')out+=box(i.x,i.y,0,210,14,297,'#f3efe6')+`<polygon points="${pts([[i.x+20,i.y+14,235],[i.x+150,i.y+14,235],[i.x+150,i.y+14,205],[i.x+20,i.y+14,205]])}" fill="#f2c230"/>`+lab(i.x+105,i.y+14,130,'POP');
    else if(i.k==='card')out+=box(i.x,i.y,0,90,10,55,'#ffffff')+lab(i.x+45,i.y+60,-30,'이름표')});
  const dim=(a,b,t)=>{const [x1,y1]=pj(...a),[x2,y2]=pj(...b);return `<line x1="${x1}" y1="${y1+34}" x2="${x2}" y2="${y2+34}" stroke="#5b6a61" stroke-width="1.5"/><text x="${(x1+x2)/2}" y="${(y1+y2)/2+66}" text-anchor="middle" style="font:500 22px Pretendard,sans-serif;fill:#5b6a61">${t}</text>`};
  out+=dim([0,900,-40],[900,900,-40],'가로 900mm · 손님이 서는 쪽')+lab(450,-60,330,'뒤');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-820 -360 1640 1400" style="width:100%;height:auto;background:#f7f5ef;border-radius:12px">${out}</svg>`}
A.dpOpen=d=>{const t=(S.ui.cor||[])[+d.i];if(!t)return;const P=dpPlan(t),br=t.br||S.br,its=items(br);S.ui.dp={i:+d.i};
  openSheet(`<h3>진열 — ${esc(t.title)} <small style="font:400 13px var(--body);color:var(--muted)">900×900 평대 · ${P.total}권</small></h3><div id="dpStage">${dpSVG(P)}</div>
   <div class="tw"><table><tr><th></th><th>책</th><th>놓는 법</th><th class="r">권수</th><th class="r">재고</th></tr>${P.rows.map(r=>{const h=its.find(x=>(r.b.isbn&&x.isbn===r.b.isbn)||nt(x.t)===nt(r.b.t));return `<tr><td><b>${r.n}</b></td><td>${esc(r.b.t)}</td><td>${r.place}</td><td class="r">${r.qty}</td><td class="r">${h?`<span class="pill ${h.stock>=r.qty?'p-ok':'p-low'}">${h.stock}</span>`:'<span class="pill p-none">없음</span>'}</td></tr>`}).join('')}</table></div>
   <ol class="steps">${P.tips.map(x=>`<li><span>${x}</span></li>`).join('')}</ol>
   <div class="btns"><button class="btn pri" data-a="dpOrder">모자란 권수 주문에 담기</button><button class="btn" data-a="dpPng">진열 그림 받기 (PNG)</button><button class="btn" data-a="close">닫기</button></div>`)};
A.dpOrder=()=>{const t=S.ui.cor[S.ui.dp.i],P=dpPlan(t),br=t.br||S.br;if(br==='all'){toast('지점을 먼저 고르세요');return}const its=items(br);let n=0;P.rows.forEach(r=>{const h=its.find(x=>(r.b.isbn&&x.isbn===r.b.isbn)||nt(x.t)===nt(r.b.t)),lack=r.qty-Math.max(0,(h||{}).stock||0);if(lack>0){addCart(br,{t:r.b.t,a:r.b.a,p:r.b.p,isbn:r.b.isbn||(h||{}).isbn,price:r.b.price||(h||{}).price},lack,'진열: '+t.title);n+=lack}});closeSheet();toast(n?`${n}권을 ${brN(br)} 북센 주문에 담았습니다`:'재고로 충분합니다')};
A.dpPng=async()=>{const t=S.ui.cor[S.ui.dp.i],svg=dpSVG(dpPlan(t)).replace('style="width:100%;height:auto;background:#f7f5ef;border-radius:12px"','width="1640" height="1400"'),img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);try{await img.decode()}catch(e){toast('그림을 만들지 못했습니다');return}
  const c=document.createElement('canvas');c.width=2460;c.height=2100;const x=c.getContext('2d');x.fillStyle='#f7f5ef';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);c.toBlob(b=>b&&saveFile(`더숲_진열_${t.title.replace(/[\\/:*?"<>|\s,]+/g,'_').slice(0,20)}.png`,b),'image/png')};
