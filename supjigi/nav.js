/* 더숲 워크룸 — 메뉴 정리: 만드는 것 → 운영 → 흐름 순서, 비슷한 화면은 한 탭 안에서 고른다 */
TABS.aka=[['today','오늘'],['cal','일정'],['talk','북토크'],['space','공간'],['design','만들기'],['insta','홍보'],['trend','트렌드']];
TABS.store=[['trend','트렌드'],['cur','큐레이션'],['design','POP'],['biz','지원사업'],['stock','주문'],['ana','매출'],['more','전체']];
/* 탭 묶음: 기획(간접 매출) · 실제(주문·매출) */
const TG={store:{trend:'기획',stock:'실제'},aka:{today:'실제',talk:'기획'}};
delete V.aka.forms;
const GRP={plan:'cal',naver:'insta'},SUBS={cal:[['cal','일정'],['plan','행사 기획']],insta:[['insta','인스타그램'],['naver','네이버']]};
Object.keys(SUBS).forEach(g=>SUBS[g].forEach(([v])=>{const f=V.aka[v];if(!f)return;V.aka[v]=()=>`<div class="subnav" role="tablist">${SUBS[g].map(([k,l])=>`<button data-a="go" data-v="${k}" aria-pressed="${k===v}">${l}</button>`).join('')}</div>`+f()}));
