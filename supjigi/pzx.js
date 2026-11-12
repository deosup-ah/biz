/* 「가로세로 숲」 인쇄물 · 창 다시 만들기 (11/12 밤, 참부장 「촌스럽고 불편」)
   참고: 신문 · 잡지 크로스워드(The New Yorker 식) — 꽉 찬 사각 격자에 검은 칸, 격자는 위 왼쪽, 힌트는 옆과 아래로 단을 나눠 흘림, 한 쪽에 다 들어가게.
   열쇠 단어는 금색 바탕 대신 칸 안의 동그라미. 장식은 줄 몇 개와 로고만. 창은 미리보기(실제 인쇄물) + 고르기 몇 개 + 아래 고정 버튼. */
async function pzFont(){try{await Promise.all(['700 60px "Gowun Batang"','400 30px "Gowun Batang"','800 30px Pretendard','700 30px Pretendard','600 30px Pretendard','500 30px Pretendard','400 30px Pretendard'].map(f=>document.fonts.load(f,'가로세로 숲')))}catch(e){}}
async function pzCanvas(Z,f,ans,part){await pzFont();const [,W,H]=PZF[f],c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),U=W/1080,PN='#003128',INK='#1c1c1a',GR='#6b6b63',GD='#b8913a',BK='#1f2622',PA='#fbfaf6';
  const SR='"Gowun Batang","Noto Serif CJK KR",serif',SS='Pretendard,"Noto Sans CJK KR",sans-serif',M=Math.round(72*U);let lg=null;try{lg=await upImg('logo-g.png')}catch(e){}
  const brn=S.ui.pz.br||'사유의숲',[ed,eds]=pzEd(Z),no=`${TODAY.slice(5).replace('-','')}-${Z.seed}`,age=(PZAGE.find(a=>a[1]===Z.age)||[])[0],lvn=Z.lvn||PZL[Z.lv].n,shf=Z.who&&PZPSH(Z.who);
  x.fillStyle=PA;x.fillRect(0,0,W,H);
  /* 머리 */
  const isIG=f>=2;let y=M+Math.round(64*U);x.fillStyle=INK;x.font=`700 ${Math.round(72*U)}px ${SR}`;x.fillText(PZT,M,y);
  x.textAlign='right';x.font=`600 ${Math.round(19*U)}px ${SS}`;x.fillStyle=GR;try{x.letterSpacing=(1.5*U)+'px'}catch(e){}x.fillText(`제 ${no}호`,W-M,y-Math.round(40*U));x.fillText(`더숲 ${brn}${Z.who?' · 인물도서관'+(shf&&shf.no?' '+shf.no:''):''}`,W-M,y-Math.round(12*U));try{x.letterSpacing='0px'}catch(e){}x.textAlign='left';
  y+=Math.round(22*U);x.fillStyle=INK;x.fillRect(M,y,W-2*M,Math.max(2,3*U));x.fillRect(M,y+Math.round(7*U),W-2*M,Math.max(1,1*U));y+=Math.round(48*U);
  x.font=`700 ${Math.round(30*U)}px ${SR}`;x.fillStyle=PN;x.fillText(ed,M,y);let ew=x.measureText(ed).width;x.font=`400 ${Math.round(21*U)}px ${SS}`;x.fillStyle=GR;x.fillText(`${eds}  ·  ${lvn}${age&&Z.age?' · '+age:''}`,M+ew+Math.round(16*U),y);
  if(ans){x.textAlign='right';x.font=`700 ${Math.round(26*U)}px ${SR}`;x.fillStyle='#9b2c1f';x.fillText('정답',W-M,y);x.textAlign='left'}
  else if(!isIG||part===0){x.textAlign='right';x.font=`500 ${Math.round(19*U)}px ${SS}`;x.fillStyle=GR;x.fillText('이름 ____________   푼 날 ________',W-M,y);x.textAlign='left'}
  y+=Math.round(22*U);x.fillStyle='#d8d3c4';x.fillRect(M,y,W-2*M,Math.max(1,1*U));y+=Math.round(28*U);
  const top=y,footH=Math.round(112*U),bot=H-M-footH;
  /* 격자: 꽉 찬 사각, 쓰지 않는 칸은 검게 */
  /* 격자: 쓰는 칸만 흰 칸으로 띄움(빈 자리는 종이 그대로) — 검은 칸이 많으면 무겁다 */
  const drawGrid=(gx,gy,cs)=>{const lw=Math.max(1.5,2*U);
    for(let r=0;r<Z.H;r++)for(let q=0;q<Z.W;q++){const k=r+','+q;if(!Z.cells[k])continue;const px=gx+q*cs,py=gy+r*cs;x.fillStyle='#fff';x.fillRect(px,py,cs,cs);x.strokeStyle=INK;x.lineWidth=lw;x.strokeRect(px,py,cs,cs);
      if(Z.keyCells&&Z.keyCells[k]){x.strokeStyle=GD;x.lineWidth=Math.max(1.5,cs*.035);x.beginPath();x.arc(px+cs/2,py+cs/2,cs*.4,0,7);x.stroke()}
      if(Z.num[k]){x.fillStyle=INK;x.font=`600 ${Math.max(9,Math.round(cs*.22))}px ${SS}`;x.fillText(Z.num[k],px+cs*.07,py+cs*.25)}
      if(ans){x.fillStyle=PN;x.font=`700 ${Math.round(cs*.46)}px ${SR}`;x.textAlign='center';x.fillText(Z.cells[k],px+cs/2,py+cs*.7);x.textAlign='left'}}};
  const colH=(fs,cw,G)=>{let lo=fs*4,hi=H;while(hi-lo>4){const m=(lo+hi)/2;if(flow([{x:0,y0:0,y1:m,w:cw},{x:0,y0:0,y1:m,w:cw}],fs,true))hi=m;else lo=m}return hi};
  /* 힌트 조각: 머리표 + 항목 */
  const items=fs=>{const L=[];const one=(head,arr)=>{L.push({h:head});arr.forEach(p=>L.push({p}))};one('가로',Z.across);one('세로',Z.down);return L};
  const measure=(it,cw,fs)=>{if(it.h)return fs*2.1;x.font=`400 ${fs}px ${SS}`;const L=wrapW(x,`${it.p.h} (${it.p.s.length})`,cw-fs*2.1);it._l=L;return L.length*fs*1.38+fs*.55};
  const drawItem=(it,X,Y,cw,fs)=>{if(it.h){x.fillStyle=INK;x.font=`700 ${Math.round(fs*1.12)}px ${SR}`;x.fillText(it.h,X,Y+fs*1.15);x.fillRect(X,Y+fs*1.5,cw,Math.max(1,U));return}
    const p=it.p,sub=Z.who&&!p.main&&!p.key;x.fillStyle=p.key?GD:sub?'#9a958a':INK;x.font=`700 ${fs}px ${SS}`;x.fillText(p.n,X,Y+fs);x.fillStyle=sub?'#55554f':INK;x.font=`400 ${fs}px ${SS}`;(it._l||[]).forEach((s,i)=>x.fillText(s,X+fs*2.1,Y+fs+i*fs*1.38))};
  /* 흘리기: 격자 옆 칸들 → 격자 아래 칸들 */
  const flow=(cols,fs,dry)=>{const L=items(fs);let ci=0,yy=cols[0].y0;for(let j=0;j<L.length;j++){const it=L[j];let h=measure(it,cols[ci].w,fs);if(it.h&&ci<cols.length&&yy>cols[ci].y0)h+=fs*.6;const need=it.h&&L[j+1]?h+measure(L[j+1],cols[ci].w,fs):h;while(yy+need>cols[ci].y1){ci++;if(ci>=cols.length)return false;yy=cols[ci].y0}if(!dry)drawItem(it,cols[ci].x,yy+(it.h&&yy>cols[ci].y0?fs*.6:0),cols[ci].w,fs);yy+=h}return true};
  const foot=()=>{const fy=H-M;x.fillStyle='#d8d3c4';x.fillRect(M,fy-footH+Math.round(18*U),W-2*M,Math.max(1,U));const m=pzMsg(Z);x.fillStyle=INK;x.font=`600 ${Math.round(20*U)}px ${SS}`;
    const L1=Z.key?(ans?`동그라미 칸: 「${Z.key.w}」 — ${m||''}`:`동그라미 칸을 차례로 이으면 — ${m||''}`):'';if(L1){x.strokeStyle=GD;x.lineWidth=2*U;x.beginPath();x.arc(M+10*U,fy-footH+Math.round(52*U),9*U,0,7);x.stroke();x.fillText(wrapW(x,L1,W-2*M-200*U,1)[0],M+30*U,fy-footH+Math.round(59*U))}
    x.fillStyle=GR;x.font=`400 ${Math.round(18*U)}px ${SS}`;const bk=Z.who?(PZP[Z.who]||{}).books||[]:[];wrapW(x,Z.who?`검은 번호는 ${Z.who}의 책 ${bk.map(b=>'『'+b+'』').join(' ')}에서, 회색 번호는 책 상식입니다`:'막히면 서가에서 답이 담긴 책을 찾아보세요. 직원에게 물어도 좋습니다.',W-2*M-200*U,2).forEach((s,i,a)=>x.fillText(s,M,fy-Math.round(4*U)-(a.length-1-i)*Math.round(24*U)));
    if(lg){const lw=Math.round(110*U);x.drawImage(lg,W-M-lw,fy-Math.round(30*U),lw,lw*lg.height/lg.width)}};
  const fit=(cs,gw)=>cs;
  if(!isIG&&!ans){const CW=W-2*M,G=Math.round(40*U);let best=null;const cw2=(CW-G)/2;
    for(let fs=Math.round(24*U);fs>=Math.round(14*U);fs-=Math.max(1,Math.round(U))){const ch=colH(fs,cw2,G),gap=Math.round(44*U),cs=Math.floor(Math.min(CW*.86/Z.W,(bot-top-ch-gap)/Z.H,118*U));if(cs<40*U)continue;const sc=fs*5+cs;if(!best||sc>best.sc)best={sc,cs,fs,ch,gap}}
    if(!best){const fs=Math.round(13*U),ch=colH(fs,cw2,G);best={fs,ch,gap:Math.round(30*U),cs:Math.floor(Math.max(30*U,Math.min(CW*.8/Z.W,(bot-top-ch-30*U)/Z.H)))}}
    const gh=best.cs*Z.H,free=Math.max(0,bot-top-gh-best.gap-best.ch),gy=top+Math.round(free*.35),gx=Math.round((W-best.cs*Z.W)/2),cy=gy+gh+best.gap+Math.round(free*.25);
    x.fillStyle='#d8d3c4';x.fillRect(M,cy-Math.round(best.gap*.5),W-2*M,Math.max(1,U));drawGrid(gx,gy,best.cs);flow([{x:M,y0:cy,y1:cy+best.ch,w:cw2},{x:M+cw2+G,y0:cy,y1:cy+best.ch,w:cw2}],best.fs,false);foot()}

  else if(isIG&&part===1&&!ans){const CW=W-2*M,G=Math.round(40*U),cw2=(CW-G)/2;let fs=Math.round(36*U),ch=colH(fs,cw2,G);while(fs>13*U&&ch>bot-top){fs--;ch=colH(fs,cw2,G)}const cy=top+Math.round(Math.max(0,bot-top-ch)*.3);flow([{x:M,y0:cy,y1:cy+ch,w:cw2},{x:M+cw2+G,y0:cy,y1:cy+ch,w:cw2}],fs,false);foot()}
  else{const cs=Math.floor(Math.min((W-2*M)/Z.W,(bot-top-20*U)/Z.H,120*U)),gx=Math.round((W-cs*Z.W)/2);drawGrid(gx,top+Math.round(10*U),cs);foot()}
  return c}

/* ── 창: 미리보기는 실제 인쇄물, 고르기는 몇 개만, 버튼은 아래 고정 ── */
async function pzPrev(){const P=S.ui.pz;if(!P||!P.Z)return;try{const cs=await pzCanvases();P.urls=cs.map(c=>c.toDataURL('image/jpeg',.8))}catch(e){console.warn(e)}pzDraw(true)}
C.pzSel=el=>{const P=S.ui.pz,k=el.dataset.k,v=el.value;if(k==='lv'||k==='plv'||k==='f')P[k]=+v;else P[k]=v;if(k!=='f'&&k!=='br')pzNewZ();pzPrev()};
A.pzAns=()=>{S.ui.pz.ans=!S.ui.pz.ans;pzPrev()};A.pzNew=()=>{pzNewZ();pzPrev()};A.pzMd=d=>{S.ui.pz.md=d.v;pzNewZ();pzPrev()};
A.pzOpen=()=>{S.ui.pz=S.ui.pz||{lv:2,f:0,br:'사유의숲',ans:true,th:'책과 서점',age:'',md:'t',plv:1,who:'신영복'};if(!S.ui.pz.Z)pzNewZ();pzPrev()};
A.pzPerson=d=>{S.ui.pz=S.ui.pz||{lv:2,f:0,br:'사유의숲',ans:true,th:'책과 서점',age:'',plv:1,who:'신영복'};const P=S.ui.pz;P.md='p';if(d&&d.who&&PZP[d.who])P.who=d.who;P.plv=P.plv||1;pzNewZ();pzPrev()};
function pzDraw(fromPrev){const P=S.ui.pz;if(!P)return;if(!fromPrev&&!P.urls){pzPrev();return}const BRS=[...new Set(['사유의숲',...Object.values(typeof BRAND!=='undefined'?BRAND:{})])];
  const sel=(k,opts,cur,lab)=>`<label class="pzl"><span>${lab}</span><select data-c="pzSel" data-k="${k}">${opts.map(([v,n])=>`<option value="${esc(v)}" ${String(cur)===String(v)?'selected':''}>${esc(n)}</option>`).join('')}</select></label>`;
  const ctl=P.md==='p'?sel('who',Object.keys(PZP).map(n=>{const s=PZPSH(n);return[n,n+(s&&s.no?` · 서가 ${s.no}`:'')]}),P.who,'인물')+sel('plv',[[1,'입문'],[2,'보통'],[3,'깊이']],P.plv||1,'단계')
    :sel('th',PZTH.map(t=>[t,t]),P.th,'주제')+sel('age',PZAGE.map(([n,v])=>[v,n]),P.age||'','누가')+sel('lv',[1,2,3,4,5].map(n=>[n,`${n} · ${PZL[n].n}`]),P.lv,'난이도');
  const h=`<div class="pzx"><div class="pzxh"><b>${PZT}</b><div class="pzxm"><button data-a="pzMd" data-v="t" aria-pressed="${P.md!=='p'}">주제</button><button data-a="pzMd" data-v="p" aria-pressed="${P.md==='p'}">인물도서관</button></div></div>
   <div class="pzxp">${(P.urls||[]).map((u,i)=>`<figure><img src="${u}" alt=""><figcaption>${i===(P.urls.length-1)&&P.ans?'정답':i+1}</figcaption></figure>`).join('')||'<div class="igxe">만드는 중…</div>'}</div>
   <div class="pzxc">${ctl}${sel('br',BRS.map(b=>[b,b]),P.br,'지점')}${sel('f',PZF.map(([n],i)=>[i,n]),P.f|0,'형태')}<label class="pzl pzck"><input type="checkbox" data-a="pzAns" ${P.ans?'checked':''}><span>정답 장 붙이기</span></label></div>
   <div class="pzxa"><button class="btn" data-a="pzNew">다른 퍼즐</button><button class="btn pri" data-a="pzSave">저장 · 공유</button><button class="btn" data-a="pzPdf">인쇄 PDF</button></div></div>`;
  const sb=$('sheetBox');if(sb&&$('sheet').classList.contains('on')&&sb.querySelector('.pzx')){const sc=sb.scrollTop,px=(sb.querySelector('.pzxp')||{}).scrollLeft||0;sb.innerHTML=h;sb.scrollTop=sc;const p=sb.querySelector('.pzxp');if(p)p.scrollLeft=px}else openSheet(h)}
