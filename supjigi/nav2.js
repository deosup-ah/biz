/* 리뉴얼(참부장 11/14 23:00 승인): 휴대폰은 위 한 줄(로고 · 지점 · 도움말) + 아래 탭 4개. 지점은 눌러서 고른다.
   만들기는 「고르기 → 고치기 → 받기」 단계 막대. 색은 짙은 초록 하나 + 강조 금색 하나. */
const brNow=()=>{try{const p=PLACES.find(x=>x[0]===S.br);return p?p[1]:'지점'}catch(e){return '지점'}};
A.brPick=()=>{openSheet(`<h3>지점 고르기</h3><div class="brpk">${PLACES.map(([k,n])=>`<button data-a="brGo" data-k="${k}" aria-pressed="${S.br===k}">${n}</button>`).join('')}</div><div class="btns"><button class="btn" data-a="close">닫기</button></div>`)};
A.brGo=d=>{const k=d.k,go=()=>{BK.nav=1;A.place({k})};if(BK.lay>0){history.back();setTimeout(go,150)}else{closeSheet();go()}};
afterRender(()=>{try{const bar=document.querySelector('header .bar');if(!bar||S.locked)return;let b=bar.querySelector('.brpick');
  if(!b){b=document.createElement('button');b.className='brpick';b.dataset.a='brPick';b.setAttribute('aria-label','지점 바꾸기');const br=bar.querySelector('.brand');br?br.after(b):bar.prepend(b)}
  b.innerHTML=`${esc(brNow())}<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
  const d=document.getElementById('dial');if(d){const c=navCur();d.querySelectorAll('[data-v]').forEach(x=>{const on=x.dataset.v===c;x.classList.toggle('cur',on);on?x.setAttribute('aria-current','page'):x.removeAttribute('aria-current')})}
}catch(e){}});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#dial [data-v]');if(!b)return;e.stopPropagation();const p=b.dataset.v.split(':');BK.nav=1;A.go({v:p[1],m:p[0]});window.scrollTo(0,0)},true);
/* 만들기 단계 막대 */
A.dStep=d=>{const mn=document.querySelector('main');if(!mn)return;const n=+d.n;S.ui.dStep=n;
  const go=el=>{if(el){const y=el.getBoundingClientRect().top+scrollY-(document.body.classList.contains('dialon')?70:16);window.scrollTo({top:y,behavior:'smooth'})}};
  if(n===1)go(mn.querySelector('.qbar')||mn.querySelector('.ukind')||mn);
  else if(n===2){const f=mn.querySelector('details.uedit');if(f){f.open=true;S.ui.ued=true}go(f||mn.querySelector('.stage'))}
  else{const p=mn.querySelector('[data-a="dPdf"]');go(p&&p.closest('.btns'));if(p){p.classList.add('flash');setTimeout(()=>p.classList.remove('flash'),1400)}}
  mn.querySelectorAll('.dsteps button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===n))};
afterRender(()=>{try{if(S.view[S.mode]!=='design')return;const mn=document.querySelector('main');if(!mn||mn.querySelector('.dsteps'))return;
  const s=document.createElement('div');s.className='dsteps';const n=S.ui.dStep||1;
  s.innerHTML=[['고르기','주제 · 종류'],['고치기','글 · 색 · 크기'],['받기','PDF · 이미지']].map(([t,d],i)=>`<button data-a="dStep" data-n="${i+1}" aria-pressed="${n===i+1}"><em>${i+1}</em><b>${t}</b><small>${d}</small></button>`).join('');
  const bk=mn.querySelector(':scope>.bkbar');bk?bk.after(s):mn.prepend(s)}catch(e){}});
/* 11/15 빼기: 공개 주소에서는 매출 · 주문 탭을 보이지 않는다(실제 매출은 공개 주소에 올리지 않음) */
(()=>{const f=navList;navList=function(){const L=f();return (typeof gsOn==='function'&&gsOn())?L.filter(t=>!(t[2]==='store'&&(t[0]==='stock'||t[0]==='ana'))):L}})();
/* 11/15 더하기: 한 번 눌러 남기는 반응 — 화면마다 아래 「좋아요 · 어려워요」. 의견(fb)과 같은 곳에 쌓여 매일 점검이 배운다 */
A.rxSend=async d=>{const k=d.v==='up'?'좋아요':'어려워요',w=fb4Where(),key='rx:'+TODAY+':'+w;
  try{if(sessionStorage.getItem(key)===k){toast('이미 남겼어요');return}sessionStorage.setItem(key,k)}catch(e){}
  const e={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),d:TODAY,at:new Date().toISOString(),k:'반응',t:k,w};
  const L=fb4Get();L.unshift(e);fb4Set(L);try{if(shDB()){const{id,...b}=e;await shDB().doc('fb/'+id).set(b)}}catch(err){}
  if(k==='어려워요'){toast('어디가 어려웠는지 한 줄 남겨 주시면 더 빨리 고칩니다');S.ui.fbK=FB4K[0];setTimeout(()=>{try{A.fbOpen()}catch(e){}},700)}else toast('고맙습니다. 내일 아침 점검에 반영합니다');
  const r=document.querySelector('main .rxbar');if(r)r.classList.add('done')};
afterRender(()=>{try{const mn=document.querySelector('main');if(!mn||S.locked||mn.querySelector('.rxbar'))return;const b=document.createElement('div');b.className='rxbar';
  b.innerHTML='<span>이 화면, 어땠나요?</span><button type="button" data-a="rxSend" data-v="up" aria-label="좋아요">좋아요</button><button type="button" data-a="rxSend" data-v="down" aria-label="어려워요">어려워요</button>';mn.append(b)}catch(e){}});
