/* 11/13 저녁 참부장 승인: 소식은 크기가 아니라 다른 것으로 더 강조(시의성 없는 큐레이팅은 없다) · 「내 단계」 숨김 ·
   평대 기록(누구에게 · 어떤 방식으로 쌓이게) · 한 장으로 받기(지점에 보내는 지시서) · 지점마다 그 지점의 집처럼 */

/* ── 지점마다 집처럼: 지점 색(11/13 19:29 한 줄 소개는 뺌) ── */
const BRHOME={aka:['사유의숲','북한산 자락, 아카데미하우스의 서가'],choso:['초소책방','인왕산 옛 초소 자리의 책방'],sojeon:['소전미술관','시흥, 미술관 안의 서가'],nowon:['노원더숲','노원, 동네의 더숲'],nmain:['노원문고 본점','노원문고 본점'],njung:['노원문고 중계점','노원문고 중계점']};
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const b=BR.find(x=>x.k===S.br),mn=document.querySelector('main');document.body.style.setProperty('--brc',b?b.c:'var(--ink)');
}catch(e){}}})();

/* ── 소식: 크기는 그대로, 「지금」이 느껴지게(빛나는 점 · 날짜 · 넘어가는 시간 줄 · 바로 평대로) ── */
(()=>{const deck=t=>{const N=(window.NEWS&&NEWS.items)||[],fresh=window.NEWS&&NEWS.asOf===TODAY,i=(S.ui.tki|0)%Math.max(1,N.length),em=t.querySelector('em');
    if(em&&!em.querySelector('.tkdot'))em.innerHTML=`<i class="tkdot" aria-hidden="true"></i>${fresh?'오늘 아침 소식':'소식 · '+(window.NEWS&&NEWS.asOf?mdw(NEWS.asOf).replace(/\(.\)/,''):'')}`;
    let g=t.querySelector('.tkgo');if(!g){g=document.createElement('i');g.className='tkgo';g.dataset.a='newsMake';g.textContent='이 소식으로 평대';t.append(g)}g.dataset.i=i};
  const r=render;render=function(){r.apply(this,arguments);try{const t=document.querySelector('main .tick');if(!t)return;t.classList.add('live');deck(t);if(!t.dataset.live){t.dataset.live='1';new MutationObserver(()=>{if(!t.querySelector('.tkgo')||!t.querySelector('.tkdot'))deck(t)}).observe(t,{childList:true})}}catch(e){}}})();

/* ── 평대 기록: 무엇을 · 어느 지점에 · 어떤 방식으로 ── */
const PLOG='sj.plog';const plog=()=>{try{return JSON.parse(localStorage.getItem(PLOG)||'[]')}catch(e){return[]}};
function plogAdd(k,t){try{if(!t||!t.title)return;const L=plog();const e={d:TODAY,br:S.br,t:t.title,k};if(L[0]&&L[0].t===e.t&&L[0].k===k&&L[0].d===e.d&&L[0].br===e.br)return;L.unshift(e);localStorage.setItem(PLOG,JSON.stringify(L.slice(0,300)))}catch(e){}}
const curT=()=>{try{return S.ui.dp&&S.ui.cor?S.ui.cor[S.ui.dp.i]:null}catch(e){return null}};
['dpSend','d3rec'].forEach(n=>{const f=A[n];if(f)A[n]=function(){plogAdd(n==='dpSend'?'진열 보냄':'진열 영상',curT());return f.apply(this,arguments)}});
(()=>{const f=A.dPng;if(f)A.dPng=function(){try{const D=S.ui.D;plogAdd('인쇄물',{title:(D&&(D.head||'').replace(/\n/g,' '))||''})}catch(e){}return f.apply(this,arguments)}})();
(()=>{const f=A.igSave;if(f)A.igSave=function(){try{plogAdd('인스타',igTheme()||{title:(S.ui.igG&&S.ui.igG.out&&S.ui.igG.out.ct)||''})}catch(e){}return f.apply(this,arguments)}})();
/* 섞어 보기: 쌓인 기록에서 서로 먼 두 주제를 골라 한 평대로 — 계획에 없던 만남 */
const plWord=s=>{const w=String(s).replace(/[,.「」『』\(\)·—\-]/g,' ').split(/\s+/).filter(x=>x.length>=2&&!/^(그|이|한|그런|다음|위한|있는|하는|읽는|보는)$/.test(x));return w.sort((a,b)=>b.length-a.length)[0]||''};
A.plMix=async()=>{const L=plog().filter(e=>e.br===S.br),ts=[...new Set(L.map(e=>e.t))];if(ts.length<2){toast('평대 기록이 두 개 이상 쌓이면 섞을 수 있습니다');return}
  const a=ts[Math.floor(Math.random()*ts.length)];let b=a;for(let k=0;k<12&&b===a;k++)b=ts[Math.floor(Math.random()*ts.length)];const w=[plWord(a),plWord(b)].filter(Boolean).join(' ');closeSheet&&closeSheet();toast(`「${a}」와 「${b}」를 섞습니다`);await A.ideaGo({v:w});window.scrollTo(0,0)};
A.plOpen=()=>{const L=plog().filter(e=>e.br===S.br),by={};L.forEach(e=>{(by[e.d]=by[e.d]||[]).push(e)});
  openSheet(`<div class="plx"><div class="igxh"><b>평대 기록</b><span>${esc(brN(S.br))} · ${L.length}건</span></div><p class="note">진열 · 인쇄물 · 인스타를 만들 때마다 날짜와 주제, 방식이 남습니다(이 기기에).</p>
   ${L.length?Object.entries(by).slice(0,20).map(([d,es])=>`<div class="pld"><b>${mdw(d)}</b>${es.map(e=>`<div class="plr"><span>${esc(e.t)}</span><em>${esc(e.k)}</em></div>`).join('')}</div>`).join(''):'<p class="lse">아직 기록이 없습니다. 큐레이션 카드에서 진열을 보내거나 POP를 저장하면 쌓입니다.</p>'}
   <div class="igxa"><button class="btn pri" data-a="plMix">기록 섞어 새 평대</button><button class="btn" data-a="close">닫기</button></div></div>`)};
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const mn=document.querySelector('main');if(!mn||S.locked||S.mode!=='store'||S.view.store!=='cur'||S.br==='all'||mn.querySelector('.plbar'))return;const wall=mn.querySelector('.wall');if(!wall)return;
  const L=plog().filter(e=>e.br===S.br),d=document.createElement('button');d.className='plbar';d.dataset.a='plOpen';d.innerHTML=`<b>평대 기록</b><span>${L.length?`${mdw(L[0].d).replace(/\(.\)/,'')} 「${esc(L[0].t)}」 ${esc(L[0].k)} 외 ${Math.max(0,L.length-1)}건`:'진열 · POP를 만들면 여기에 쌓입니다'}</span><i aria-hidden="true">›</i>`;wall.after(d)}catch(e){}}})();

/* ── 한 장으로 받기: 3D · 평면 · POP · 인스타 표지를 A4 한 장에 ── */
A.dpSheet=async()=>{try{const t=curT();if(!t){toast('진열 화면에서 눌러 주세요');return}toast('한 장으로 묶는 중입니다');await upFont();
  const W=2480,H=3508,M=120,x0=document.createElement('canvas');x0.width=W;x0.height=H;const x=x0.getContext('2d'),F='Pretendard,"Noto Sans CJK KR",sans-serif',SR='"Gowun Batang","Noto Serif CJK KR",serif';
  x.fillStyle='#f7f5ef';x.fillRect(0,0,W,H);x.fillStyle='#003128';x.fillRect(0,0,W,430);x.fillStyle='#c9a24a';x.fillRect(0,430,W,14);
  x.fillStyle='#d9b45b';x.font=`600 46px ${F}`;x.fillText(`더숲 ${brN(S.br)} · 평대 지시서 · ${mdw(TODAY)}${t.until?' → '+mdw(t.until)+'까지':''}`,M,150);
  x.fillStyle='#f2eee3';x.font=`700 104px ${SR}`;x.fillText(wrapW(x,t.title,W-2*M,1)[0],M,290);x.font=`400 44px ${F}`;x.fillStyle='rgba(242,238,227,.8)';x.fillText(wrapW(x,t.hook||'',W-2*M,1)[0]||'',M,380);
  const box=async(img,X,Y,w,h,cap)=>{if(img){const s=Math.min(w/img.width,h/img.height),dw=img.width*s,dh=img.height*s;x.fillStyle='#fff';x.fillRect(X,Y,w,h);x.drawImage(img,X+(w-dw)/2,Y+(h-dh)/2,dw,dh)}else{x.fillStyle='#ebe6da';x.fillRect(X,Y,w,h)}x.fillStyle='#55554f';x.font=`600 36px ${F}`;x.fillText(cap,X,Y+h+56)};
  /* 3D */const c3=document.querySelector('#dpV3 canvas');let y=520;await box(c3,M,y,W-2*M,1250,'3D · 고객 쪽에서 본 모습');y+=1250+110;
  /* 평면 */let plan=null;try{const el=$('dpTop');if(el){const vb=(el.getAttribute('viewBox')||'0 0 900 900').split(/\s+/).map(Number);let svg=new XMLSerializer().serializeToString(el);if(!/xmlns=/.test(svg.slice(0,200)))svg=svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');svg=svg.replace(/^<svg([^>]*)>/,(m,a)=>`<svg${a.replace(/\sstyle="[^"]*"/,'').replace(/\s(width|height)="[^"]*"/g,'')} width="${vb[2]}" height="${vb[3]}">`);svg=svg.replace(/^(<svg[^>]*>)/,'$1'+await fontCSS());plan=await upImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg))}}catch(e){}
  /* POP */let pop=null;try{pop=await toCanvas(layout(mkD(t,'pop')))}catch(e){}
  /* 인스타 */let ig=null;try{ig=(await igCanvases({t,ph:[],fmt:0,ct:t.title,cs:t.hook||'',tpl:2}))[0]}catch(e){}
  const cw=(W-2*M-2*60)/3,ch=1150;await box(plan,M,y,cw,ch,'평면 · 놓는 자리');await box(pop,M+cw+60,y,cw,ch,'POP');await box(ig,M+2*(cw+60),y,cw,ch,'인스타 표지');y+=ch+130;
  /* 놓는 순서 */try{const P=dpPlan(t,S.ui.dpM||0),rows=(P.rows||[]).filter(r=>r&&r.b).slice(0,8);x.fillStyle='#1c1c1a';x.font=`700 44px ${F}`;x.fillText('놓는 순서',M,y);y+=24;x.font=`500 34px ${F}`;rows.forEach((r,i)=>{const s=`${r.n||i+1}  ${r.b.t.replace(/\s*[\(\[].*$/,'')}${r.place?'  —  '+r.place:''}`;x.fillText(wrapW(x,s,W-2*M,1)[0],M,y+62+i*52)})}catch(e){}
  x.fillStyle='#9a958a';x.font=`400 30px ${F}`;x.fillText('Planned by 쿼부장',W-M-x.measureText('Planned by 쿼부장').width,H-70);
  plogAdd('한 장 지시서',t);await upSaveMany([x0],`더숲_평대지시서_${upName(t.title)}`)}catch(e){console.warn(e);toast('만들지 못했습니다')}};
(()=>{const f=A.dpOpen;A.dpOpen=function(){const r=f.apply(this,arguments);setTimeout(()=>{try{const s=document.querySelector('#sheetBox [data-a="dpSend"]');if(s&&!document.querySelector('#sheetBox [data-a="dpSheet"]')){const b=document.createElement('button');b.className=s.className;b.dataset.a='dpSheet';b.textContent='한 장으로 받기';s.after(b)}}catch(e){}},60);return r}})();
