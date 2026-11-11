/* 더숲 워크룸 — 메뉴 정리: 만드는 것 → 운영 → 흐름 순서, 비슷한 화면은 한 탭 안에서 고른다 */
TABS.aka=[['space','공간'],['design','만들기'],['trend','트렌드'],['talk','북토크'],['insta','홍보'],['today','오늘'],['cal','일정']];
TABS.store=[['cur','큐레이션'],['design','POP'],['trend','트렌드'],['biz','지원사업'],['stock','주문'],['ana','매출'],['more','더보기']];
/* 탭 묶음: 기획(간접 매출) · 실제(주문·매출) */
const TG={store:{cur:'기획',stock:'실제'},aka:{space:'기획',today:'실제'}};
delete V.aka.forms;
const GRP={plan:'cal',naver:'insta'},SUBS={cal:[['cal','일정'],['plan','행사 기획']],insta:[['insta','인스타그램'],['naver','네이버']]};
Object.keys(SUBS).forEach(g=>SUBS[g].forEach(([v])=>{const f=V.aka[v];if(!f)return;V.aka[v]=()=>`<div class="subnav" role="tablist">${SUBS[g].map(([k,l])=>`<button data-a="go" data-v="${k}" aria-pressed="${k===v}">${l}</button>`).join('')}</div>`+f()}));

/* 조작: 옆으로 쓸면 옆 메뉴(휴대폰), ← → 로 옆 책(컴퓨터) */
(()=>{const step=d=>{if(S.locked)return;const L=navList(),c=navCur(),i=Math.max(0,L.findIndex(t=>t[2]+':'+t[0]===c)),j=i+d;if(j<0||j>=L.length)return;A.go({v:L[j][0],m:L[j][2]})};
  const skip=e=>e.target.closest&&e.target.closest('input,textarea,select,[contenteditable],.dial,.d3,.subnav,table,.tw,svg,#sheet,#scan,.feels,.row2');
  let sx=0,sy=0,ok=false;document.addEventListener('touchstart',e=>{const p=e.touches[0];sx=p.clientX;sy=p.clientY;ok=e.touches.length===1&&!skip(e)},{passive:true});
  document.addEventListener('touchend',e=>{if(!ok)return;const p=e.changedTouches[0],dx=p.clientX-sx,dy=p.clientY-sy;if(Math.abs(dx)>80&&Math.abs(dy)<Math.abs(dx)*.45)step(dx<0?1:-1)},{passive:true});
  document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||skip(e)||document.getElementById('sheet')&&document.getElementById('sheet').classList.contains('on'))return;if(e.key==='ArrowRight'||e.key==='ArrowDown'&&e.shiftKey)step(1);else if(e.key==='ArrowLeft'||e.key==='ArrowUp'&&e.shiftKey)step(-1)})})();
