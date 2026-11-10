/* 더숲 워크룸 — 메뉴 정리: 만드는 것 → 운영 → 흐름 순서, 비슷한 화면은 한 탭 안에서 고른다 */
TABS.aka=[['talk','북토크'],['space','공간'],['design','만들기'],['insta','홍보'],['trend','트렌드'],['today','오늘'],['cal','일정']];
TABS.store=[['cur','큐레이션'],['design','POP'],['trend','트렌드'],['biz','지원사업'],['stock','주문'],['ana','매출'],['more','전체']];
/* 탭 묶음: 기획(간접 매출) · 실제(주문·매출) */
const TG={store:{cur:'기획',stock:'실제'},aka:{talk:'기획',today:'실제'}};
delete V.aka.forms;
const GRP={plan:'cal',naver:'insta'},SUBS={cal:[['cal','일정'],['plan','행사 기획']],insta:[['insta','인스타그램'],['naver','네이버']]};
Object.keys(SUBS).forEach(g=>SUBS[g].forEach(([v])=>{const f=V.aka[v];if(!f)return;V.aka[v]=()=>`<div class="subnav" role="tablist">${SUBS[g].map(([k,l])=>`<button data-a="go" data-v="${k}" aria-pressed="${k===v}">${l}</button>`).join('')}</div>`+f()}));

/* 조작: 옆으로 쓸면 옆 메뉴(휴대폰), ← → 로 옆 책(컴퓨터) */
(()=>{const step=d=>{if(S.locked)return;const m=S.mode,t=TABS[m],cur=document.querySelector('nav.tabs button[aria-current="page"]'),i=Math.max(0,t.findIndex(a=>cur&&a[0]===cur.dataset.v)),j=i+d;if(j<0||j>=t.length)return;A.go({v:t[j][0]})};
  const skip=e=>e.target.closest&&e.target.closest('input,textarea,select,[contenteditable],.dial,.d3,.subnav,table,.tw,svg,#sheet,#scan,.feels,.row2');
  let sx=0,sy=0,ok=false;document.addEventListener('touchstart',e=>{const p=e.touches[0];sx=p.clientX;sy=p.clientY;ok=e.touches.length===1&&!skip(e)},{passive:true});
  document.addEventListener('touchend',e=>{if(!ok)return;const p=e.changedTouches[0],dx=p.clientX-sx,dy=p.clientY-sy;if(Math.abs(dx)>80&&Math.abs(dy)<Math.abs(dx)*.45)step(dx<0?1:-1)},{passive:true});
  document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||skip(e)||document.getElementById('sheet')&&document.getElementById('sheet').classList.contains('on'))return;if(e.key==='ArrowRight'||e.key==='ArrowDown'&&e.shiftKey)step(1);else if(e.key==='ArrowLeft'||e.key==='ArrowUp'&&e.shiftKey)step(-1)})})();
