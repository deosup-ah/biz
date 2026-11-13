/* 11/14 참부장: 「앱의 모든 것은 이미지나 파일로 저장 · 공유 · 다운」 + 도움말에 「의견 보내기」(기능 개선)
   공통 원칙(앱 · 큐레이팅): 처음 쓰는 사람이 바로 알아보고 직접 고칠 수 있게, 그에 맞춰 계속 빼고 더한다. */

/* ── 1. 어느 화면이든 저장 · 공유: 위 막대의 공유 단추 하나 ── */
const SH4={lib:null};
function sh4Lib(){if(window.html2canvas)return Promise.resolve(window.html2canvas);if(SH4.lib)return SH4.lib;
  SH4.lib=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';s.onload=()=>ok(window.html2canvas);s.onerror=()=>{SH4.lib=null;no(new Error('lib'))};document.head.append(s)});return SH4.lib}
/* 지금 보이는 것: 열린 창 → 도움말 → 본문 */
function sh4Target(){const sh=$('sheet');if(sh&&sh.classList.contains('on'))return{el:$('sheetBox'),kind:'창'};const g=$('guide');if(g)return{el:g.querySelector('.g2b')||g,kind:'도움말'};return{el:document.querySelector('main'),kind:'화면'}}
function sh4Name(el){const h=el&&el.querySelector('h2,h3,b');let t=(h&&h.textContent||'워크룸').replace(/\s+/g,' ').trim().slice(0,24);return `더숲_${t.replace(/[\\/:*?"<>|]/g,'')}_${TODAY}`}
async function sh4Shot(){const{el}=sh4Target();if(!el)throw new Error('none');const h2c=await sh4Lib();
  const keep=[];[el,...el.querySelectorAll('*')].forEach(e=>{const cs=getComputedStyle(e);if((cs.overflowY==='auto'||cs.overflowY==='scroll'||cs.overflow==='hidden')&&e.scrollHeight>e.clientHeight+2&&!e.matches('svg,svg *,canvas,img,.d3,.d3 *,.dial')){keep.push([e,e.style.maxHeight,e.style.overflow,e.style.height]);e.style.maxHeight='none';e.style.overflow='visible';e.style.height='auto'}});
  document.body.classList.add('sh4on');
  try{const bg=getComputedStyle(el).backgroundColor,c=await h2c(el,{scale:Math.min(2,window.devicePixelRatio||2),backgroundColor:bg&&bg!=='rgba(0, 0, 0, 0)'?bg:getComputedStyle(document.body).backgroundColor,useCORS:true,logging:false,windowWidth:document.documentElement.clientWidth});
    const x=c.getContext('2d'),k=c.width/el.offsetWidth;x.font=`500 ${Math.round(10.5*k)}px Pretendard,sans-serif`;x.fillStyle='rgba(120,120,112,.8)';x.textAlign='right';x.fillText('Planned by 쿼부장',c.width-12*k,c.height-8*k);return c}
  finally{document.body.classList.remove('sh4on');keep.forEach(([e,m,o,h])=>{e.style.maxHeight=m;e.style.overflow=o;e.style.height=h})}}
const sh4Blob=c=>new Promise(r=>c.toBlob(r,'image/png'));
A.shOpen=()=>{let p=$('shp');if(p){p.remove();return}const{kind}=sh4Target();p=document.createElement('div');p.id='shp';p.setAttribute('role','menu');
  p.innerHTML=`<b>지금 ${kind} 저장 · 공유</b><button data-a="shGo" data-k="png">이미지로 저장</button><button data-a="shGo" data-k="pdf">PDF로 저장</button><button data-a="shGo" data-k="share">공유하기 (카톡 · 메일)</button><button data-a="shGo" data-k="txt">글로 복사</button>`;document.body.append(p)};
document.addEventListener('click',e=>{const p=$('shp');if(p&&!e.target.closest('#shp,[data-a="shOpen"]'))p.remove()},true);
A.shGo=async d=>{const p=$('shp');if(p)p.remove();const{el}=sh4Target();if(!el)return;const name=sh4Name(el);
  if(d.k==='txt'){const t=el.innerText.replace(/\n{3,}/g,'\n\n').trim();try{await navigator.clipboard.writeText(t);toast('글을 복사했습니다. 카톡 · 메일에 붙여 넣으세요')}catch(e){await saveFile(name+'.txt',new Blob([t],{type:'text/plain'}));toast('글을 파일로 저장했습니다')}return}
  toast('만드는 중…');let c;try{c=await sh4Shot()}catch(e){console.warn(e);toast('이 화면은 그림으로 만들지 못했습니다. 「글로 복사」를 써 주세요');return}
  if(d.k==='pdf'){try{const J=window.jspdf&&window.jspdf.jsPDF;if(!J)throw 0;const W=210,H=297,m=8,iw=W-m*2,ph=Math.floor(c.width*(H-m*2)/iw),doc=new J({unit:'mm',format:'a4'});
      for(let y=0,i=0;y<c.height;y+=ph,i++){const s=document.createElement('canvas');s.width=c.width;s.height=Math.min(ph,c.height-y);s.getContext('2d').drawImage(c,0,-y);if(i)doc.addPage();doc.addImage(s.toDataURL('image/jpeg',.92),'JPEG',m,m,iw,iw*s.height/s.width)}
      await saveFile(name+'.pdf',doc.output('blob'));toast('PDF를 저장했습니다')}catch(e){console.warn(e);toast('PDF를 만들지 못했습니다')}return}
  const blob=await sh4Blob(c);if(!blob){toast('그림을 만들지 못했습니다');return}
  if(d.k==='share'){try{const f=new File([blob],name+'.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return}}catch(e){if(e&&e.name==='AbortError')return}
    await saveFile(name+'.png',blob);toast('이 기기에서는 바로 공유가 안 되어 그림으로 저장했습니다');return}
  await saveFile(name+'.png',blob);toast('그림을 저장했습니다')};

/* 위 막대(공유 단추) · 열린 창 · 도움말에 같은 단추 */
const SH4IC='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>';
function sh4Put(){try{const nb=document.querySelector('header.top .navb');if(nb&&!nb.querySelector('.shb')){const b=document.createElement('button');b.className='shb';b.dataset.a='shOpen';b.title='저장 · 공유';b.setAttribute('aria-label','저장 · 공유');b.innerHTML=SH4IC;const h=nb.querySelector('[data-a="home"]');h?nb.insertBefore(b,h):nb.prepend(b)}
  const bx=$('sheetBox'),sh=$('sheet');if(bx&&sh&&sh.classList.contains('on')&&!bx.querySelector('.shb2')){const b=document.createElement('button');b.className='shb2';b.dataset.a='shOpen';b.setAttribute('aria-label','이 창 저장 · 공유');b.innerHTML=SH4IC+'<span>저장 · 공유</span>';bx.prepend(b)}}catch(e){}}
(()=>{const r=render;render=function(){r.apply(this,arguments);sh4Put()}})();
(()=>{const o=openSheet;openSheet=function(){o.apply(this,arguments);sh4Put()}})();

/* ── 2. 의견 보내기 (도움말 맨 위) — 기능 개선 · 불편 · 오류. Claude 앱에서는 함께 보는 기록(db fb/), 공개 주소에서는 이 기기 + 공유로 보내기 ── */
const FB4K=['불편해요','이렇게 바꿔 주세요','새 기능','오류'];
const fb4Get=()=>{try{return JSON.parse(localStorage.getItem('sj.fb')||'[]')}catch(e){return []}};
const fb4Set=L=>{try{localStorage.setItem('sj.fb',JSON.stringify(L.slice(0,200)))}catch(e){}};
const fb4Where=()=>{try{const L=navList(),c=navCur(),t=L.find(x=>x[2]+':'+x[0]===c);return [S.br&&S.br!=='all'?brN(S.br):'',t?t[1]:''].filter(Boolean).join(' · ')}catch(e){return ''}};
A.fbOpen=()=>{const w=fb4Where();if(typeof A.gdClose==='function')A.gdClose();S.ui.fbK=S.ui.fbK||FB4K[1];const L=fb4Get();
  openSheet(`<div class="fb4"><div class="igxh"><b>의견 보내기</b><span>기능 개선 · 불편 · 오류</span></div>
   <p class="note">쓰다가 막히거나 바꾸고 싶은 것을 한 줄로 적어 주세요. 매일 아침 점검 때 읽고, 빼거나 더해서 고칩니다.</p>
   <div class="chips">${FB4K.map(k=>`<button class="chip" data-a="fbK" data-k="${k}" aria-pressed="${S.ui.fbK===k}">${k}</button>`).join('')}</div>
   <textarea id="fbT" rows="4" placeholder="예) POP 글씨를 더 크게 고칠 수 있으면 좋겠어요"></textarea>
   <small class="note">${w?`보던 화면 「${esc(w)}」이 함께 적힙니다. `:''}고객 이름 · 연락처는 적지 말아 주세요.${typeof DB!=='undefined'&&DB?'':' 이 화면(공개 주소)에서는 이 기기에만 남으니, 「보내기」 뒤 공유로 전해 주세요.'}</small>
   <div class="btns"><button class="btn pri" data-a="fbSend">보내기</button><button class="btn" data-a="close">닫기</button></div>
   ${L.length?`<div class="fb4l"><b>보낸 의견 ${L.length}</b>${L.slice(0,8).map(e=>`<div><i>${esc(e.d.slice(5).replace('-','/'))} · ${esc(e.k)}${e.st?` · ${esc(e.st)}`:''}</i><p>${esc(e.t)}</p></div>`).join('')}</div>`:''}</div>`)};
A.fbK=d=>{S.ui.fbK=d.k;document.querySelectorAll('.fb4 [data-a="fbK"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===d.k))};
A.fbSend=async()=>{const el=$('fbT'),t=(el&&el.value||'').trim();if(!t){toast('한 줄 적어 주세요');return}
  const e={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),d:TODAY,at:new Date().toISOString(),k:S.ui.fbK||FB4K[1],t:t.slice(0,600),w:fb4Where(),v:(document.querySelector('script[src^="ag.js"]')||{}).src||''};
  const L=fb4Get();L.unshift(e);fb4Set(L);let sent=false;if(typeof DB!=='undefined'&&DB){try{const{id,...b}=e;await DB.doc('fb/'+id).set(b);sent=true}catch(err){}}
  if(sent){toast('받았습니다. 내일 아침 점검 때 반영합니다');A.fbOpen();return}
  const msg=`[워크룸 의견 · ${e.k}] ${e.t}${e.w?` (화면: ${e.w})`:''}`;try{if(navigator.share){await navigator.share({title:'워크룸 의견',text:msg});toast('이 기기에도 남겼습니다');A.fbOpen();return}}catch(err){if(err&&err.name==='AbortError'){A.fbOpen();return}}
  try{await navigator.clipboard.writeText(msg);toast('이 기기에 남기고 글을 복사했습니다. 카톡으로 보내 주세요')}catch(err){toast('이 기기에 남겼습니다')}A.fbOpen()};
/* 도움말 머리에 붙이기 */
(()=>{const g=g2Head;g2Head=function(t){return g(t).replace('<div class="g2seg"',`<button class="g2fb" data-a="fbOpen"><span>의견 보내기</span><small>기능 개선 · 불편 · 오류</small><i aria-hidden="true">›</i></button><div class="g2seg"`)}})();

/* 모양 */
(()=>{const s=document.createElement('style');s.textContent=`
.navb .shb{color:var(--ink)}
#shp{position:fixed;z-index:95;right:12px;top:58px;min-width:210px;background:var(--surface,#fbfaf7);border:1px solid #1c1c1a;padding:6px;display:grid;box-shadow:0 8px 24px rgba(0,0,0,.12)}
#shp b{font-size:12.5px;color:#6a6a64;padding:6px 10px 4px;font-weight:600}
#shp button{border:0;background:none;text-align:left;padding:11px 10px;font:inherit;font-size:15px;cursor:pointer;color:var(--ink,#1c1c1a)}#shp button:hover{background:var(--surface2,#e6e4dc)}
@media(min-width:900px){body:not(.dialon) #shp{left:20px;right:auto;top:64px}}
.shb2{display:inline-flex;align-items:center;gap:6px;justify-self:end;border:1px solid var(--line,#d6d4ca);background:none;padding:5px 10px;font:inherit;font-size:13px;cursor:pointer;color:var(--ink,#1c1c1a)}.shb2 svg{width:16px;height:16px}
body.sh4on .shb2,body.sh4on #shp{display:none!important}
.g2fb{display:flex;align-items:center;gap:10px;width:100%;border:1px solid rgba(242,238,227,.35);background:none;color:inherit;padding:10px 14px;margin:8px 0 0;font:inherit;cursor:pointer;text-align:left}
.g2fb span{font-weight:700;font-size:14.5px;white-space:nowrap}.g2fb small{flex:1;font-size:12.5px;opacity:.75;min-width:0}.g2fb i{font-style:normal;opacity:.7}
.fb4{display:grid;gap:12px}.fb4 textarea{width:100%;font:inherit;font-size:16px;padding:11px 12px;border:1px solid var(--line);background:var(--surface)}
.fb4l{border-top:1px solid var(--line);padding-top:10px;display:grid;gap:8px}.fb4l b{font-size:13px}.fb4l i{font-style:normal;font-size:12px;color:var(--muted)}.fb4l p{margin:2px 0 0;font-size:14px}`;document.head.append(s)})();
