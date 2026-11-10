/* 더숲 워크룸 — 메뉴 정리: 만드는 것 → 운영 → 흐름 순서, 비슷한 화면은 한 탭 안에서 고른다 */
TABS.aka=[['today','오늘'],['design','만들기'],['cal','일정'],['insta','홍보'],['trend','트렌드']];
TABS.store=[['cur','큐레이션'],['design','POP'],['stock','주문'],['ana','매출'],['trend','트렌드'],['more','전체']];
const GRP={forms:'design',plan:'cal',naver:'insta'},SUBS={design:[['design','POP · 안내판'],['forms','견적서 · 서식']],cal:[['cal','일정'],['plan','행사 기획']],insta:[['insta','인스타그램'],['naver','네이버']]};
Object.keys(SUBS).forEach(g=>SUBS[g].forEach(([v])=>{const f=V.aka[v];if(!f)return;V.aka[v]=()=>`<div class="subnav" role="tablist">${SUBS[g].map(([k,l])=>`<button data-a="go" data-v="${k}" aria-pressed="${k===v}">${l}</button>`).join('')}</div>`+f()}));
