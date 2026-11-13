/* 별실 기록 · 찾은 소식 (11/13 검색) — 고른 것만 기록에 담는다
   p: 날짜 정밀도 y(해) m(달) d(날). 서로 다른 날짜를 말하는 출처는 note에 적는다. */
const ARC_FOUND=[
 {id:'f-1965',d:'1965-01-01',p:'y',k:'연혁',t:'강원용 목사, 크리스챤아카데미 설립',src:'고향사랑기부제 매거진',url:'https://wegive.co.kr/wezine/detail/1717'},
 {id:'f-1966',d:'1966-01-01',p:'y',k:'연혁',t:'수유리 아카데미하우스 준공 (독일 교회 지원)',src:'고향사랑기부제 매거진 · 네이트 뉴스',url:'https://wegive.co.kr/wezine/detail/1717',note:'본관 공사 사진은 1966년 4월'},
 {id:'f-1979',d:'1979-01-01',p:'y',k:'연혁',t:'크리스천아카데미 사건 — 민주화운동의 상징 공간이 됨',src:'국민일보',url:'https://www.kmib.co.kr/article/view.asp?arcid=0030104008&code=61221111&sid1=chr'},
 {id:'f-2004',d:'2004-01-01',p:'y',k:'연혁',t:'한국기독교장로회가 아카데미하우스 인수',src:'고향사랑기부제 매거진',url:'https://www.wegive.co.kr/wezine/detail/1717'},
 {id:'f-2019',d:'2019-01-01',p:'y',k:'연혁',t:'매각 뒤 10년 가까이 사실상 방치',src:'안마을신문 · 고향사랑기부제 매거진',url:'https://anmaeul.com/%EB%8D%94%EC%88%B2-%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8%ED%95%98%EC%9A%B0%EC%8A%A4/',note:'안마을신문은 2019년 매각, 매거진은 2020년 매각 공고로 적음'},
 {id:'f-2409',d:'2024-09-01',p:'m',k:'계약',t:'더숲, 아카데미하우스 임차 계약 — 운영 시작 준비',src:'고향사랑기부제 매거진',url:'https://www.wegive.co.kr/wezine/detail/1717',note:'2024년 기장이 운영을 제안, 그해 9월 임차. 이후 약 1년 반 보수공사'},
 {id:'f-260323',d:'2026-03-23',p:'d',k:'행사',t:'개관 앞두고 마을 이웃 초대',src:'안마을신문',url:'https://anmaeul.com/%EB%8D%94%EC%88%B2-%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8%ED%95%98%EC%9A%B0%EC%8A%A4/'},
 {id:'f-260331',d:'2026-03-31',p:'d',k:'소식',t:'「4월 6일 오픈 확정」 소개 글',src:'브런치',url:'https://brunch.co.kr/@lyh0727s/212'},
 {id:'f-260402',d:'2026-04-02',p:'d',k:'기사',t:'우리동네 사진 한 장 — 더숲 아카데미하우스',src:'안마을신문',url:'https://anmaeul.com/%EB%8D%94%EC%88%B2-%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8%ED%95%98%EC%9A%B0%EC%8A%A4/'},
 {id:'f-260405',d:'2026-04-05',p:'d',k:'기사',t:'“민주화 가치 잇겠다”…되살린 아카데미 하우스',src:'미주중앙일보',url:'https://www.koreadaily.com/article/20260405080141650',note:'6일 본관 · 대화의 집 · 새벽의 집부터, 4월 말 전체 개방 예정'},
 {id:'f-260406',d:'2026-04-06',p:'d',k:'개관',t:'더숲 아카데미하우스 정식 개관',src:'고향사랑기부제 매거진 · 네이트 뉴스',url:'https://wegive.co.kr/wezine/detail/1717',note:'국민일보(7월 13일 기사)는 「지난달 16일 개관」으로 적음 — 확인 필요'},
 {id:'f-2604x',d:'2026-04-06',p:'m',k:'전시',t:'개관전 「숲을 거닐다」 — 자연미술 작가 23명, 6월 15일까지',src:'KTX매거진',url:'https://ktxmagazine.kr/%EC%95%A0%EC%84%9C%EA%B0%80%EC%9D%98-%EB%B6%81%EC%8A%A4%ED%85%8C%EC%9D%B4-%EB%8D%94%EC%88%B2-%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8%ED%95%98%EC%9A%B0%EC%8A%A4/'},
 {id:'f-260430',d:'2026-04-30',p:'d',k:'인터뷰',t:'실천하는 어른 — 더숲문화재단 탁무권 대표 인터뷰 ②',src:'고향사랑기부제 매거진',url:'https://wegive.co.kr/wezine/detail/1689'},
 {id:'f-260511',d:'2026-05-11',p:'d',k:'기사',t:'읽고, 쉬고, 다시 집중하는 하룻밤 ①',src:'고향사랑기부제 매거진',url:'https://www.wegive.co.kr/wezine/detail/1717'},
 {id:'f-260521',d:'2026-05-21',p:'d',k:'인터뷰',t:'“민주화 깃든 공간의 역사와 청년들 연결하고 싶어요”',src:'네이트 뉴스',url:'https://m.news.nate.com/view/20260521n35551'},
 {id:'f-2606k',d:'2026-06-01',p:'m',k:'기사',t:'애서가의 북스테이, 더숲 아카데미하우스',src:'KTX매거진',url:'https://ktxmagazine.kr/%EC%95%A0%EC%84%9C%EA%B0%80%EC%9D%98-%EB%B6%81%EC%8A%A4%ED%85%8C%EC%9D%B4-%EB%8D%94%EC%88%B2-%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8%ED%95%98%EC%9A%B0%EC%8A%A4/'},
 {id:'f-260713',d:'2026-07-13',p:'d',k:'인터뷰',t:'폐허가 됐던 ‘대화의 집’…사람이 숨 쉬는 공간으로 재탄생',src:'국민일보',url:'https://www.kmib.co.kr/article/view.asp?arcid=0030104008&code=61221111&sid1=chr'},
 {id:'f-260715',d:'2026-07-15',p:'d',k:'기사',t:'북한산 아카데미하우스, 복합문화공간으로 단장',src:'국민일보',url:'https://www.kmib.co.kr/article/view.asp?arcid=1784011407&code=23111111&sid1=chr'},
 {id:'f-260912',d:'2026-09-12',p:'d',k:'북토크',t:'2026 문학나눔 그림책 신진작가 북토크',src:'브런치(고수리)',url:'https://brunch.co.kr/@daljasee/623'},
 {id:'f-2610w',d:'2026-10-01',p:'m',k:'기사',t:'읽고, 쉬고, 다시 집중하는 하룻밤 ② — 대화의 집 60년 기록, 인물 도서관',src:'고향사랑기부제 매거진',url:'https://www.wegive.co.kr/wezine/detail/1730'},
 {id:'f-261031',d:'2026-10-31',p:'d',k:'전시',t:'「문장과 풍경」 전 — 음악과 함께 문장의 숲을 걷다 (10월 31일까지)',src:'더숲 아카데미하우스 누리집',url:'http://academyhouse.deosup.com/'},
 {id:'f-261212',d:'2026-12-12',p:'d',k:'행사',t:'노닥 워케이션 3기 in 더숲 (12월 12–14일)',src:'GPTers',url:'https://www.gpters.org/events/post/nodak-workation-3rd-S8JBfg0Anr0mkTf'}
];
