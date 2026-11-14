/* 이전으로 가기(참부장 11/14): 휴대폰 뒤로 버튼 · 밀어서 뒤로 · 화면 위 「← 이전」이 모두 같은 길로 간다.
   겹친 창(도움말 · AI 에이전트 · 아래 창 · 열린 큐레이션)이 있으면 그것부터 닫고, 없으면 바로 앞 화면으로. */
const BK={st:[],last:null,busy:0,nav:0,stale:0,lay:0};
const bkSnap=()=>({m:S.mode,v:S.view[S.mode],br:S.br,c:S.ui.cOpen==null?null:S.ui.cOpen});
const bkKey=s=>s?[s.m,s.v,s.br].join('|'):'';
const bkName=s=>{try{const t=navList().find(x=>x[2]===s.m&&x[0]===s.v);if(s.c!=null)return '큐레이션';if(t)return t[1]}catch(e){}return {design:'만들기',dp:'진열',cur:'큐레이션',more:'더보기',arc:'아카이브'}[s.v]||'이전'};
document.addEventListener('pointerdown',e=>{const t=e.target;BK.nav=!!(t.closest&&t.closest('#dial,nav.tabs,[data-a="place"],[data-a="home"],[data-a="br"],.places'))},true);
const bkLayers=()=>{const L=[];const g=document.getElementById('guide');if(g)L.push(()=>A.gdClose());const a=document.getElementById('agent');if(a&&getComputedStyle(a).display!=='none')L.push(()=>A.agClose());
  const sh=document.getElementById('sheet');if(sh&&sh.classList.contains('on'))L.push(()=>closeSheet());return L};
function bkCheck(){if(BK.busy||S.locked)return;const s=bkSnap(),k=bkKey(s);if(!BK.last){BK.last=s;try{history.replaceState({bk:0},'')}catch(e){}return}
  if(k!==bkKey(BK.last)){BK.last.sub=!BK.nav;BK.st.push(BK.last);if(BK.st.length>40)BK.st.shift();try{history.pushState({bk:BK.st.length},'')}catch(e){}}
  else if(s.c!=null&&BK.last.c==null){try{history.pushState({bk:'c'},'')}catch(e){}}
  BK.last=s;bkBar()}
function bkBar(){const mn=document.querySelector('main');if(!mn)return;const old=mn.querySelector(':scope>.bkbar');const p=BK.st[BK.st.length-1];
  const show=p&&p.sub&&!(S.mode==='store'&&S.view.store==='cur'&&S.ui.cOpen!=null);if(!show){if(old)old.remove();return}
  const h=`<button type="button" data-a="bkGo">← ${esc(bkName(p))}</button>`;if(old){if(old.innerHTML!==h)old.innerHTML=h;return}
  const b=document.createElement('div');b.className='bkbar';b.innerHTML=h;mn.prepend(b)}
function bkRestore(){const p=BK.st.pop();if(!p)return false;BK.busy=1;try{if(p.br&&p.br!==S.br){S.br=p.br;try{ls.set('br',p.br)}catch(e){}}S.mode=p.m;S.view[p.m]=p.v;S.ui.cOpen=p.c;try{ss.set('view',S.view)}catch(e){}render();window.scrollTo(0,0)}finally{BK.busy=0}BK.last=bkSnap();bkBar();return true}
window.addEventListener('popstate',()=>{const L=bkLayers();if(L.length){BK.busy=1;try{L[L.length-1]()}finally{BK.busy=0}BK.lay=bkLayers().length;return}
  if(S.ui.cOpen!=null&&S.mode==='store'&&S.view.store==='cur'){BK.busy=1;try{A.cClose()}finally{BK.busy=0}BK.last=bkSnap();return}
  if(BK.stale>0){BK.stale--;return}
  if(!bkRestore()){try{history.pushState({bk:0},'')}catch(e){}}});
/* 겹친 창이 열리면 뒤로 한 칸을 만든다. 버튼으로 닫으면 그 칸은 다음 뒤로에서 건너뛴다 */
setInterval(()=>{const n=bkLayers().length;if(n>BK.lay){for(let i=BK.lay;i<n;i++)try{history.pushState({bk:'l'},'')}catch(e){}}else if(n<BK.lay&&!BK.busy)BK.stale+=BK.lay-n;BK.lay=n},300);
A.bkGo=()=>{try{history.back()}catch(e){bkRestore()}};
afterRender(()=>{setTimeout(bkCheck,0)});
