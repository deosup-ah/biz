/* 공개 주소용 공용 저장소 (구글 시트 + 앱스 스크립트, gs/Code.gs)
   GS_URL 이 비어 있으면 아무 일도 하지 않는다(지금처럼 이 기기에만).
   Claude 앱 안에서는 쓰지 않는다(그쪽은 db). */
const GS_URL='https://script.google.com/macros/s/AKfycbzj7xFhY6eG69nnTKzXrJ9SRs0cb_cquSzujT1Pazhhhz7mw96MV5GWl4fnPT2ghoISMg/exec';
const GS_K='deosup-workroom';
const gsOn=()=>!!GS_URL&&!(window.claude&&window.claude.use);
async function gsGet(p){const r=await fetch(GS_URL+'?'+new URLSearchParams(p));return r.json()}
async function gsPost(b){const r=await fetch(GS_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({k:GS_K,...b})});return r.json()}
const gsErr=r=>({code:r&&r.err==='too big'?'invalid_argument':'unavailable'});
const GSSUB={};const gsKick=c=>(GSSUB[c]||[]).forEach(f=>setTimeout(f,300));
const GSDB={
  doc(path){const [c,id]=String(path).split('/');const me={id,path,
    async set(data){const img=c==='arcimg'&&data&&String(data.d||'').startsWith('data:');const r=await gsPost({a:img?'img':'put',c,id,data});if(!r||r.err)throw gsErr(r);gsKick(c)},
    async update(data){const s=await me.get();await me.set({...(s.exists?s.data():{}),...data})},
    async delete(){const r=await gsPost({a:'del',c,id});if(!r||r.err)throw gsErr(r);gsKick(c)},
    async get(){const r=await gsGet({a:'get',col:c,id});return r&&r.doc?{id,exists:true,data:()=>r.doc.data,metadata:{fromCache:false}}:{id,exists:false,data:()=>undefined,metadata:{fromCache:false}}}};return me},
  collection(c){return{path:c,doc:id=>GSDB.doc(c+'/'+id),
    onSnapshot(next,err){let stop=false,ok=false;const run=async()=>{try{const r=await gsGet({a:'list',col:c});if(!r||r.err)throw r;ok=true;if(!stop)next({docs:r.docs.map(d=>({id:d.id,exists:true,data:()=>d.data,metadata:{fromCache:false}})),size:r.docs.length,empty:!r.docs.length,metadata:{fromCache:false,hasPendingWrites:false},docChanges:()=>[]})}catch(e){if(!stop&&!ok&&err){stop=true;err({code:'unavailable'})}}};
      (GSSUB[c]=GSSUB[c]||[]).push(run);run();const t=setInterval(()=>{if(!stop&&!document.hidden)run()},60000);return()=>{stop=true;clearInterval(t)}}}}};
/* 함께 쓰는 저장소 고르기: Claude 앱이면 db, 공개 주소면 시트 */
const shDB=()=>(typeof DB!=='undefined'&&DB)||(gsOn()?GSDB:null);

/* ── 기사 찾기 (아카이브 안, 공개 주소): 시트의 스크립트가 구글 · 빙 뉴스를 대신 읽어 온다 ── */
const GSN={q:'더숲 아카데미하우스',L:null,busy:false,err:''};
A.gsNews=async()=>{const i=$('gsQ'),q=((i&&i.value)||GSN.q).trim();if(!q)return;GSN.q=q;GSN.busy=true;GSN.err='';render();
  try{const r=await gsGet({a:'news',q});GSN.L=(r&&r.items)||[];if(r&&r.err)GSN.err='기사를 읽지 못했습니다. 잠시 뒤 다시 눌러 주세요.'}catch(e){GSN.err='기사를 읽지 못했습니다. 잠시 뒤 다시 눌러 주세요.';GSN.L=[]}GSN.busy=false;render()};
A.gsTake=async d=>{const a=(GSN.L||[])[+d.i];if(!a||typeof arcSave!=='function')return;const id='n'+arcId();
  const ok=await arcSave({id,from:'news:'+a.url,date:a.d||TODAY,p:'d',time:'',t:a.t,k:'기사',iss:'',box:'',th:[],img:[],url:a.url,src:a.src||'',note:'',at:new Date().toISOString()});if(ok){toast('아카이브에 담았습니다');render()}};
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='gsQ'&&e.key==='Enter'&&!e.isComposing){e.preventDefault();A.gsNews()}});
(()=>{const r=render;render=function(){r.apply(this,arguments);try{if(!gsOn()||S.mode!=='aka'||S.view.aka!=='arc')return;const mn=document.querySelector('main');if(!mn||mn.querySelector('.gsn'))return;
  const got=new Set((ARC.L||[]).map(x=>x.url).filter(Boolean)),L=GSN.L;
  const w=document.createElement('section');w.className='gsn';w.innerHTML=`<h3>기사 찾기</h3><p>구글 · 빙 뉴스에서 찾아, 고른 기사만 아카이브에 담습니다.</p>
   <div class="gsq"><input id="gsQ" value="${esc(GSN.q)}" enterkeyhint="search" aria-label="찾을 말"><button class="btn pri" data-a="gsNews" ${GSN.busy?'disabled':''}>${GSN.busy?'찾는 중…':'찾기'}</button></div>
   ${GSN.err?`<p class="gse">${esc(GSN.err)}</p>`:''}
   ${L?L.length?`<ul>${L.map((a,i)=>`<li><span><b>${esc(a.t)}</b><i>${esc(a.src||'')}${a.d?' · '+esc(a.d):''}</i><a href="${esc(a.url)}" target="_blank" rel="noopener">원문 ↗</a></span>${got.has(a.url)?'<em>담음</em>':`<button class="btn sm" data-a="gsTake" data-i="${i}">담기</button>`}</li>`).join('')}</ul>`:'<p class="gse">찾은 기사가 없습니다. 다른 말로 찾아 보세요.</p>':''}`;
  const at=mn.querySelector('.arcfd')||mn.querySelector('.arcin');if(at)at.after(w);else mn.append(w)}catch(e){console.warn(e)}}})();

/* ── 찾은 소식에서 찾기 (어디서나): 언론사 · 제목 · 메모로 바로 거른다 ── */
const arcFqRun=()=>{const q=(S.ui.arcFq||'').trim().toLowerCase(),fd=document.querySelector('main .arcfd');if(!fd)return;let n=0;
  fd.querySelectorAll('ul>li').forEach(li=>{const on=!q||li.textContent.toLowerCase().replace(/\s/g,'').includes(q.replace(/\s/g,''));li.style.display=on?'':'none';if(on)n++});
  const c=fd.querySelector('.arcfqn');if(c)c.textContent=q?`${n}건`:''};
document.addEventListener('input',e=>{if(e.target&&e.target.id==='arcFq'){S.ui.arcFq=e.target.value;arcFqRun()}});
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const fd=document.querySelector('main .arcfd');if(!fd||fd.querySelector('.arcfq'))return;const ul=fd.querySelector('ul');if(!ul)return;
  const w=document.createElement('div');w.className='arcfq';w.innerHTML=`<input id="arcFq" type="search" value="${esc(S.ui.arcFq||'')}" placeholder="찾기 — 한겨레 · 중앙 · CBS · 개관 …" aria-label="찾은 소식에서 찾기"><span class="arcfqn"></span>`;ul.before(w);arcFqRun()}catch(e){}}})();
