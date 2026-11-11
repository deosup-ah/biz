'use strict';
/* 더숲 워크룸 — 진열 3D(캔버스): 실제 치수(mm)로 책 한 권 한 권, 표지 제목, 세운 책, POP, 꽃병까지. 끌어 돌리고, 한 바퀴 영상으로 저장. 말로 옮기기 */
const D3C=(()=>{let TH={a:'#f6f3ec',b:'#e9e4d8',top:'#d8c29a',leg:'#a8895c',rim:'#bfa275'};let cv=null,P=null,yaw=-0.55,pitch=0.95,spin=0,raf=0,rec=null;
  const F='Pretendard,"Malgun Gothic","Apple SD Gothic Neo",sans-serif',SF='"Gowun Batang",Batang,serif';
  const L=(()=>{const v=[-0.45,-0.55,0.75],m=Math.hypot(...v);return v.map(x=>x/m)})();
  const rz=(p,r)=>{if(!r||!r.a)return p;const c=Math.cos(r.a),s=Math.sin(r.a),x=p[0]-r.cx,y=p[1]-r.cy;return [r.cx+x*c-y*s,r.cy+x*s+y*c,p[2]]},rn=(n,r)=>{if(!r||!r.a)return n;const c=Math.cos(r.a),s=Math.sin(r.a);return [n[0]*c-n[1]*s,n[0]*s+n[1]*c,n[2]]};
  const hx=c=>{c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(c.slice(i,i+2),16))};
  const shade=(c,k)=>{const [r,g,b]=hx(c);return `rgb(${Math.round(r*k)},${Math.round(g*k)},${Math.round(b*k)})`};
  function cam(){const W=P.W,D=P.D,cx=W/2,cy=D/2,cs=Math.cos(yaw),sn=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    return p=>{const x=p[0]-cx,y=p[1]-cy,z=p[2],X=x*cs-y*sn,Y=x*sn+y*cs;return [X,Y*cp-z*sp,Y*sp+z*cp]}}
  function boxFaces(x,y,z,w,d,h){const V=[[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z],[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]];
    return [{k:'top',v:[V[4],V[5],V[6],V[7]],n:[0,0,1]},{k:'front',v:[V[3],V[2],V[6],V[7]],n:[0,1,0]},{k:'back',v:[V[1],V[0],V[4],V[5]],n:[0,-1,0]},{k:'right',v:[V[2],V[1],V[5],V[6]],n:[1,0,0]},{k:'left',v:[V[0],V[3],V[7],V[4]],n:[-1,0,0]},{k:'bottom',v:[V[0],V[1],V[2],V[3]],n:[0,0,-1]}]}
  function visible(n){const cs=Math.cos(yaw),sn=Math.sin(yaw),Y=n[0]*sn+n[1]*cs;return Y*Math.sin(pitch)+n[2]*Math.cos(pitch)>0.001}
  const lit=n=>0.62+0.38*Math.max(0,n[0]*L[0]+n[1]*L[1]+n[2]*L[2]);
  function scene(){const out=[],W=P.W,D=P.D,ttl=n=>(((P.rows||[]).find(r=>r.n===n)||{}).b||{}).t||'';
    out.push({z:-1e9,kind:'table'});
    (P.it||[]).forEach(i=>{if(i.k==='stack'){const n=Math.max(1,Math.round(i.h/20));out.push({kind:'stack',i,n,t:ttl(i.n),cx:i.x+i.w/2,cy:i.y+i.d/2})}
      else if(i.k==='face')out.push({kind:'face',i,t:ttl(i.n),cx:i.x+75,cy:i.y+15});
      else if(i.k==='pop')out.push({kind:'pop',i,cx:i.x+105,cy:i.y+10});
      else if(i.k==='card')out.push({kind:'card',i,cx:i.x+45,cy:i.y+17});
      else if(i.k==='vase')out.push({kind:'vase',i,cx:i.x+30,cy:i.y+30});
      else if(i.k==='note')out.push({kind:'note',i,cx:i.x,cy:i.y});else if(i.k==='show')out.push({kind:'show',i,cx:i.x+52,cy:i.y+3})});
    return out}
  function draw(){if(!cv||!P)return;const ctx=cv.getContext('2d'),Wc=cv.width,Hc=cv.height,pr=cam(),W=P.W,D=P.D;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,Wc,Hc);const g=ctx.createLinearGradient(0,0,0,Hc);g.addColorStop(0,TH.a);g.addColorStop(1,TH.b);ctx.fillStyle=g;ctx.fillRect(0,0,Wc,Hc);
    const top=Math.max(300,...(P.it||[]).map(i=>i.k==='stack'?i.h:i.k==='pop'?300:i.k==='face'?230:0));
    const pts=[];[[0,0,-40],[W,0,-40],[W,D,-40],[0,D,-40],[0,0,top],[W,0,top],[W,D,top],[0,D,top],[0,0,-160],[W,D,-160],[W,0,-160],[0,D,-160]].forEach(p=>pts.push(pr(p)));
    const mnx=Math.min(...pts.map(p=>p[0])),mxx=Math.max(...pts.map(p=>p[0])),mny=Math.min(...pts.map(p=>p[1])),mxy=Math.max(...pts.map(p=>p[1]));
    const s=Math.min(Wc*0.92/(mxx-mnx),Hc*0.88/(mxy-mny)),ox=Wc/2-(mnx+mxx)/2*s,oy=Hc/2-(mny+mxy)/2*s;
    const S2=p=>{const q=pr(p);return [ox+q[0]*s,oy+q[1]*s,q[2]]};
    const poly=(v,fill,stroke)=>{ctx.beginPath();v.forEach((p,k)=>{const q=S2(p);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])});ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}};
    const box=(x,y,z,w,d,h,col,opt={})=>{boxFaces(x,y,z,w,d,h).map(f=>({...f,v:f.v.map(p=>rz(p,opt.rot)),n:rn(f.n,opt.rot)})).filter(f=>visible(f.n)).forEach(f=>{const c=(opt.side&&f.k!=='top'&&f.k!=='bottom'&&!(opt.spine&&f.k===opt.spine))?opt.side:col;poly(f.v,shade(c,lit(f.n)),opt.edge);if(opt.onFace)opt.onFace(f)})};
    /* 면 위 글씨: 면의 두 변으로 affine 변환 */
    const faceText=(o,u,v,wu,hv,fn)=>{const a=S2(o),b=S2(u),c=S2(v);ctx.save();ctx.setTransform((b[0]-a[0])/wu,(b[1]-a[1])/wu,(c[0]-a[0])/hv,(c[1]-a[1])/hv,a[0],a[1]);fn(ctx);ctx.restore()};
    const wrap=(t,k,mx)=>{t=String(t||'').replace(/\s*[\(\[].*$/,'');const o=[];let cur='';for(const w of t.split(/\s+/)){if((cur+' '+w).trim().length<=k)cur=(cur+' '+w).trim();else{if(cur)o.push(cur);cur=w;while(cur.length>k){o.push(cur.slice(0,k));cur=cur.slice(k)}}}if(cur)o.push(cur);return o.slice(0,mx)};
    /* 바닥 그림자 · 다리 · 상판 */
    poly([[-60,-60,-760],[W+60,-60,-760],[W+60,D+60,-760],[-60,D+60,-760]],'rgba(60,45,25,.10)');
    [[40,40],[W-90,40],[40,D-90],[W-90,D-90]].sort((p,q)=>pr([p[0],p[1],0])[2]-pr([q[0],q[1],0])[2]).forEach(([x,y])=>box(x,y,-760,50,50,720,TH.leg));
    box(60,60,-110,W-120,D-120,26,TH.rim);box(0,0,-40,W,D,40,TH.top,{edge:'rgba(120,95,60,.35)'});
    for(let v=150;v<W;v+=150){const a=S2([v,0,0.5]),b=S2([v,D,0.5]);ctx.strokeStyle='rgba(150,120,80,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()}
    /* 물건: 먼 것부터 */
    const O=scene().filter(o=>o.kind!=='table').map(o=>({...o,dep:pr([o.cx,o.cy,0])[2]})).sort((a,b)=>a.dep-b.dep);
    O.forEach(o=>{const i=o.i;
      if(o.kind==='stack'){for(let j=0;j<o.n;j++){const jx=((i.n*37+j*23)%9)-4,jy=((i.n*19+j*31)%7)-3,last=j===o.n-1,rot={a:(i.rot||0)+(i.rot?(((j*13+i.n)%5)-2)*0.012:0),cx:i.x+i.w/2,cy:i.y+i.d/2};
          box(i.x+jx,i.y+jy,j*20,i.w,i.d,20,i.c,{rot,side:'#f3ecdc',edge:'rgba(0,0,0,.18)',onFace:last?(f=>{if(f.k!=='top')return;const L2=wrap(o.t,7,3);
            faceText(rz([i.x+jx,i.y+jy,(j+1)*20],rot),rz([i.x+jx+i.w,i.y+jy,(j+1)*20],rot),rz([i.x+jx,i.y+jy+i.d,(j+1)*20],rot),i.w,i.d,c=>{if(i.band){c.fillStyle='#f2c230';c.fillRect(0,i.d*.66,i.w,i.d*.2);c.fillStyle='#1a1a1a';c.font=`700 13px ${F}`;c.fillText('띠지 · 한 줄 설명',10,i.d*.66+26)}c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=2;c.strokeRect(12,14,i.w-24,i.d-28);c.fillStyle='#fff';c.font=`700 21px ${SF}`;L2.forEach((l,k)=>c.fillText(l,22,58+k*27));c.font=`800 18px ${F}`;c.fillText(String(i.n),i.w-34,i.d-24);c.font=`600 13px ${F}`;c.globalAlpha=.85;c.fillText(o.n+'권',22,i.d-24)})}):null});
          /* 책등 띠 */
          const sp=[[i.x+jx,i.y+jy+i.d,j*20+3],[i.x+jx+i.w,i.y+jy+i.d,j*20+3],[i.x+jx+i.w,i.y+jy+i.d,j*20+6],[i.x+jx,i.y+jy+i.d,j*20+6]].map(p=>rz(p,rot));if(visible(rn([0,1,0],rot)))poly(sp,shade(i.c,.8))}}
      else if(o.kind==='show'){box(i.x,i.y,0,105,6,74,'#fffdf6',{edge:'rgba(125,58,43,.6)'});if(visible([0,1,0]))faceText([i.x,i.y+6,74],[i.x+105,i.y+6,74],[i.x,i.y+6,0],105,74,c=>{c.fillStyle='#7d3a2b';c.font=`800 13px ${F}`;c.fillText('쇼카드',8,20);c.fillStyle='rgba(31,42,68,.45)';c.fillRect(8,30,86,3);c.fillRect(8,40,70,3);c.fillRect(8,50,80,3)})}
      else if(o.kind==='face'){box(i.x-6,i.y-20,0,162,40,8,'#dfe6e8',{edge:'rgba(0,0,0,.15)'});box(i.x,i.y,8,150,22,215,i.c,{side:'#f3ecdc',edge:'rgba(0,0,0,.2)'});
        if(visible([0,1,0])){const L2=wrap(o.t,6,4);faceText([i.x,i.y+22,223],[i.x+150,i.y+22,223],[i.x,i.y+22,8],150,215,c=>{c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=2;c.strokeRect(10,10,130,195);c.fillStyle='#fff';c.font=`700 21px ${SF}`;L2.forEach((l,k)=>c.fillText(l,18,48+k*27));c.fillStyle='rgba(255,255,255,.85)';c.fillRect(0,160,150,30);c.fillStyle=shade(i.c,.55);c.font=`700 13px ${F}`;c.fillText('더숲의 추천',40,180)})}}
      else if(o.kind==='pop'){box(i.x+10,i.y-30,0,190,60,6,'#dfe6e8');box(i.x,i.y,6,210,10,297,'#fbf8f0',{edge:'rgba(0,0,0,.2)'});
        if(visible([0,1,0])){const L2=wrap((P.title||'').replace(/[,.]\s*$/,''),7,3);faceText([i.x,i.y+10,303],[i.x+210,i.y+10,303],[i.x,i.y+10,6],210,297,c=>{c.fillStyle='#003128';c.font=`800 17px ${F}`;c.fillText('더숲',18,34);L2.forEach((l,k)=>{c.fillStyle='#1f2a44';c.font=`800 26px ${F}`;c.fillText(l,18,96+k*36)});c.fillStyle='#f2c230';c.fillRect(18,104+(L2.length-1)*36,Math.min(170,(L2[L2.length-1]||'').length*26),10);c.globalAlpha=.4;c.fillStyle='#1f2a44';c.fillRect(18,150+L2.length*30,150,4);c.fillRect(18,164+L2.length*30,110,4)})}}
      else if(o.kind==='card'){box(i.x,i.y,0,90,6,50,'#ffffff',{edge:'rgba(0,0,0,.25)'});if(visible([0,1,0]))faceText([i.x,i.y+6,50],[i.x+90,i.y+6,50],[i.x,i.y+6,0],90,50,c=>{c.fillStyle='#003128';c.font=`700 12px ${SF}`;c.fillText(String(P.title||'').slice(0,8),8,30)})}
      else if(o.kind==='vase'){const k=8,r=28,cx=i.x+30,cy=i.y+30;for(let a=0;a<k;a++){const a0=a/k*Math.PI*2,a1=(a+1)/k*Math.PI*2,n=[Math.cos((a0+a1)/2),Math.sin((a0+a1)/2),0];if(!visible(n))continue;poly([[cx+Math.cos(a0)*r,cy+Math.sin(a0)*r,0],[cx+Math.cos(a1)*r,cy+Math.sin(a1)*r,0],[cx+Math.cos(a1)*r*.8,cy+Math.sin(a1)*r*.8,150],[cx+Math.cos(a0)*r*.8,cy+Math.sin(a0)*r*.8,150]],shade('#cfd8d2',lit(n)))}
        ctx.strokeStyle='#6f8a6c';ctx.lineWidth=2;[[-40,-20,290],[30,10,320],[5,-35,340]].forEach(([dx,dy,h])=>{const a=S2([cx,cy,150]),b=S2([cx+dx,cy+dy,h]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.fillStyle=dx>0?'#f0d59a':'#e9b7a5';ctx.beginPath();ctx.arc(b[0],b[1],Math.max(3,14*s),0,7);ctx.fill()})}
      else if(o.kind==='note'){poly([[i.x-46,i.y-30,1],[i.x+46,i.y-30,1],[i.x+46,i.y+30,1],[i.x-46,i.y+30,1]],'#fffdf6','#d8cfb8');faceText([i.x-46,i.y-30,1.5],[i.x+46,i.y-30,1.5],[i.x-46,i.y+30,1.5],92,60,c=>{c.strokeStyle='#b9a67f';c.lineWidth=2;c.beginPath();c.moveTo(14,22);c.lineTo(78,22);c.moveTo(14,36);c.lineTo(60,36);c.stroke()})}});
    /* 손님 쪽 표시 */
    const fz=Math.round(12*Math.min(2,devicePixelRatio||1)),fa=S2([W/2,D+40,-40]);ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(246,243,236,.85)';ctx.fillRect(0,Hc-fz*2.2,Wc,fz*2.2);ctx.fillStyle='#5b6a61';ctx.font=`600 ${fz}px ${F}`;ctx.fillText(`평대 ${W/10}×${D/10}cm · 실제 치수 · 책 1권 두께 2cm`,fz,Hc-fz*0.7);if(fa[1]+fz*1.4<Hc-fz*2.6){ctx.textAlign='center';ctx.fillStyle='#8a7a5a';ctx.fillText('손님 쪽',fa[0],fa[1]+fz*1.4);ctx.textAlign='start'}}
  function size(){if(!cv)return;const r=cv.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.max(300,r.width*dpr);cv.height=Math.max(220,r.height*dpr)}
  function mount(el,plan){P=plan;el.innerHTML=`<div class="d3c"><canvas></canvas><div class="d3cb"><button class="chip" data-a="d3v" data-v="front">앞에서</button><button class="chip" data-a="d3v" data-v="top">위에서</button><button class="chip" data-a="d3v" data-v="spin">한 바퀴</button><button class="chip" data-a="d3rec">영상 저장</button></div></div>`;
    cv=el.querySelector('canvas');size();draw();let dn=null;
    cv.addEventListener('pointerdown',e=>{dn=[e.clientX,e.clientY,yaw,pitch];cv.setPointerCapture(e.pointerId);e.preventDefault()});
    cv.addEventListener('pointermove',e=>{if(!dn)return;yaw=dn[2]+(e.clientX-dn[0])*0.008;pitch=Math.max(0.05,Math.min(1.4,dn[3]-(e.clientY-dn[1])*0.006));draw()});
    const up=()=>{dn=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up)}
  function set(plan){P=plan;draw()}
  function anim(to,ms,done){cancelAnimationFrame(raf);const y0=yaw,p0=pitch,t0=performance.now();const st=()=>{const k=Math.min(1,(performance.now()-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;yaw=y0+(to[0]-y0)*e;pitch=p0+(to[1]-p0)*e;draw();if(k<1)raf=requestAnimationFrame(st);else if(done)done()};raf=requestAnimationFrame(st)}
  function turn(ms,done){const y0=yaw;anim([y0+Math.PI*2,pitch],ms,()=>{yaw=y0;draw();if(done)done()})}
  async function record(name){if(!cv||rec)return;if(!window.MediaRecorder||!cv.captureStream){toast('이 브라우저는 영상 저장을 지원하지 않습니다');return}
    const ty=['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'].find(t=>MediaRecorder.isTypeSupported(t))||'',ext=ty.startsWith('video/mp4')?'mp4':'webm';
    const st=cv.captureStream(30),mr=new MediaRecorder(st,ty?{mimeType:ty,videoBitsPerSecond:4e6}:{}),ch=[];rec=mr;mr.ondataavailable=e=>{if(e.data&&e.data.size)ch.push(e.data)};
    mr.onstop=()=>{rec=null;const b=new Blob(ch,{type:ty||'video/webm'});saveFile(`더숲_진열_한바퀴_${String(name||'').replace(/[\\/:*?"<>|\s,]+/g,'_').slice(0,20)}.${ext}`,b);toast(`한 바퀴 영상(${ext.toUpperCase()})을 저장했습니다`)};
    toast('한 바퀴 도는 동안 녹화합니다 (6초)');mr.start();anim([yaw,0.9],400,()=>turn(6000,()=>setTimeout(()=>mr.stop(),200)))}
  return{theme:t=>{TH={...TH,...t};draw()},mount,set,draw,anim,turn,record,view:()=>[yaw,pitch],rot:d=>{anim([yaw+d,pitch],500)}}})();
A.d3v=d=>{if(d.v==='front')D3C.anim([0,1.2],500);else if(d.v==='top')D3C.anim([0,0.05],500);else D3C.turn(4000)};
A.d3rec=()=>{const t=(S.ui.cor||[])[S.ui.dp.i];D3C.record(t&&t.title)};

/* ── 말로 진열 바꾸기 ── */
function dpRef(t,s){const all=(t.books||[]).slice(0,10),pk=dpPick(t),out=[];
  const m=[...s.matchAll(/(\d+)\s*번/g)].map(x=>+x[1]);m.forEach(n=>{if(pk[n-1]!=null)out.push(pk[n-1])});
  const ko={첫:1,두:2,세:3,네:4,다섯:5,여섯:6,일곱:7,여덟:8,아홉:9,열:10};Object.entries(ko).forEach(([w,n])=>{if(new RegExp(w+'\\s*번째').test(s)&&pk[n-1]!=null)out.push(pk[n-1])});
  const nt2=x=>String(x||'').replace(/\s*[\(\[].*$/,'').replace(/\s/g,'');all.forEach((b,i)=>{const k=nt2(b.t);if(k.length>=2&&s.replace(/\s/g,'').includes(k.slice(0,Math.min(k.length,6))))out.push(i)});
  return [...new Set(out)]}
function dpOps(t,s){const ops=[],R=dpRef(t,s);
  if(/(영상|녹화|동영상)/.test(s))return [{op:'rec'}];
  if(/(한\s*바퀴|빙글|돌려|회전)/.test(s)&&!R.length)return [{op:'spin'}];
  if(/(위에서)/.test(s)&&!R.length)return [{op:'view',v:'top'}];if(/(앞에서|정면)/.test(s)&&!R.length)return [{op:'view',v:'front'}];
  const objs={쇼카드:'show',띠지:'band',꽃병:'vase',꽃:'vase',쪽지:'note',POP:'pop',pop:'pop',팝:'pop',이름표:'card'};for(const [w,k] of Object.entries(objs))if(s.includes(w)&&!R.length){ops.push({op:'obj',k,on:!/(빼|치워|숨|없애|지워)/.test(s)});return ops}
  if(/(처음|원래)/.test(s)&&/(배치|대로|자리)/.test(s))return [{op:'reset'}];
  if(/(메인|주인공|얼굴)/.test(s)&&R.length)return [{op:'main',i:R[0]}];
  if(/비정형|흐트|자유롭/.test(s))return [{op:'free',on:true}];if(/가지런|반듯|정렬/.test(s))return [{op:'free',on:false}];
  if(/(바꿔|교환|자리\s*바꾸)/.test(s)&&R.length>=2)return [{op:'swap',a:R[0],b:R[1]}];
  if(/(빼|치워|없애|지워|삭제|내려)/.test(s))return R.map(i=>({op:'rm',i}));
  const where=/(맨\s*앞|제일\s*앞)/.test(s)?'front':/(맨\s*뒤|제일\s*뒤)/.test(s)?'back':/가운데|중앙/.test(s)?'center':/앞/.test(s)?'fwd':/뒤/.test(s)?'bwd':/왼/.test(s)?'left':/오른/.test(s)?'right':null;
  if(/(넣|추가|올려|놓아|놔)/.test(s))R.forEach(i=>ops.push({op:'add',i,where}));else if(where)R.forEach(i=>ops.push({op:'mv',i,where}));
  return ops}
function dpFree(P,id,x,y){const W=P.W,D=P.D,o=P.it.filter(i=>i.k==='stack'&&i.id!==id),hit=(x,y)=>x<0||y<0||x+150>W||y+210>D||o.some(i=>x<i.x+i.w+15&&x+165>i.x&&y<i.y+i.d+15&&y+225>i.y);
  if(!hit(x,y))return [x,y];for(let r=40;r<900;r+=40)for(let a=0;a<16;a++){const nx=Math.round(x+Math.cos(a/16*Math.PI*2)*r),ny=Math.round(y+Math.sin(a/16*Math.PI*2)*r);if(!hit(nx,ny))return [nx,ny]}return [x,y]}
function dpApply(t,ops){const md=S.ui.dpM||0;let msg=[];for(const o of ops){const P=dpPlan(t,md),stk=i=>P.it.find(x=>x.k==='stack'&&x.id==='k'+i),W=P.W,D=P.D,nm=i=>(((t.books||[])[i]||{}).t||'').replace(/\s*[\(\[].*$/,'');
    const at=(w,cur)=>{const x=cur?cur.x:W/2-75,y=cur?cur.y:D/2-105;return w==='front'?[W/2-75,D-230]:w==='back'?[W/2-75,40]:w==='center'?[W/2-75,D/2-105]:w==='fwd'?[x,y+160]:w==='bwd'?[x,y-160]:w==='left'?[x-170,y]:w==='right'?[x+170,y]:[x,y]};
    if(o.op==='rm'){if(dpPick(t).includes(o.i)&&A.dpPk({i:o.i}))msg.push(`「${nm(o.i)}」 뺐습니다`)}
    else if(o.op==='add'){if(!dpPick(t).includes(o.i))A.dpPk({i:o.i});const P2=dpPlan(t,md),[x,y]=dpFree(P2,'k'+o.i,...at(o.where||'center'));dpSetPos(t,'k'+o.i,x,y);msg.push(`「${nm(o.i)}」 넣었습니다`)}
    else if(o.op==='mv'){const c=stk(o.i);if(!c)continue;const [x,y]=dpFree(P,'k'+o.i,...at(o.where,c));dpSetPos(t,'k'+o.i,x,y);msg.push(`「${nm(o.i)}」 옮겼습니다`)}
    else if(o.op==='swap'){const a=stk(o.a),b=stk(o.b);if(!a||!b)continue;dpSetPos(t,'k'+o.a,b.x,b.y);dpSetPos(t,'k'+o.b,a.x,a.y);msg.push('두 책의 자리를 바꿨습니다')}
    else if(o.op==='obj'){S.ui.dpObj={...(S.ui.dpObj||{}),[o.k]:o.on};msg.push(o.on?'보이게 했습니다':'숨겼습니다')}
    else if(o.op==='main'){if(!dpPick(t).includes(o.i))A.dpPk({i:o.i});A.dpMainSet({id:'k'+o.i});return}else if(o.op==='free'){A.dpFreeT({v:o.on?'1':'0'});return}
    else if(o.op==='reset'){A.dpReset();return}
    else if(o.op==='spin'){D3C.turn(4000);return}else if(o.op==='view'){A.d3v({v:o.v});return}else if(o.op==='rec'){A.d3rec();return}}
  dpRe();toast(msg.length?msg.join(' · '):'알아듣지 못했습니다. 예: 「3번 맨 앞으로」')}
A.dpCmd=async()=>{const el=$('dpCmd'),s=(el&&el.value||'').trim(),t=(S.ui.cor||[])[S.ui.dp.i];if(!s||!t)return;let ops=dpOps(t,s);
  if(!ops.length&&typeof AI!=='undefined'&&AI){const pk=dpPick(t),all=(t.books||[]).slice(0,10);
    const out=await ask('dpcmd',`서점 평대 진열을 말로 고칩니다. 평대에 놓인 책: ${pk.map((i,k)=>`${k+1}번=${all[i].t}(i=${i})`).join(', ')}. 놓이지 않은 책: ${all.map((b,i)=>pk.includes(i)?null:`${b.t}(i=${i})`).filter(Boolean).join(', ')||'없음'}.\n말: 「${s}」\nJSON 으로만: {"ops":[{"op":"rm|add|mv|swap|obj|spin|view|rec|reset","i":책 i,"a":i,"b":i,"where":"front|back|center|fwd|bwd|left|right","k":"pop|card|vase|note","on":true|false,"v":"front|top"}]}`);
    ops=out&&Array.isArray(out.ops)?out.ops:[]}
  if(el)el.value='';dpApply(t,ops)};
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='dpCmd'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.dpCmd()}});
(()=>{const f=micHeard;micHeard=t=>{const el=$('dpCmd');if(el&&(S.ui.micT==='dpCmd'||document.activeElement===el||$('sheet').classList.contains('on'))){S.ui.micT='';el.value=(t||'').trim();A.dpCmd();return}f(t)}})();
