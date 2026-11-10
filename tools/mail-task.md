# 예약 작업 「더숲아카.이븐 메일 연동」 — 지시문

권장 시각: 매일 08:23 · 13:23 · 17:23 (한국시간), 클라우드 실행(컴퓨터 불필요), Gmail 연결 필요.

메일(Gmail)을 읽어 Artifact 의 `ext.js`(stay · settle · mail)를 새로 만든다. 형식과 규칙은 `DATA.md` 「메일 연동」 절.

1. Artifact 에서 현재 `ext.js` 를 받는다. stay·settle·mail 이외의 키는 그대로 둔다.
2. Gmail 검색(읽기만):
   - `from:notify@deosup-academyhouse-booking.com newer_than:30d` → stay (`(테스트)` 제목 제외, 같은 번호 취소는 `st:"cancel"`, 조치필요는 alerts)
   - `from:no-reply@settlement.tosspayments.com newer_than:14d` → settle
   - `in:inbox is:unread newer_than:10d -from:deosup.com -from:deosup-academyhouse-booking.com -category:promotions -category:updates -category:social` → mail
3. 이름·전화·이메일이 없는지 확인하고 `ext.js` 만 Artifact 에 올린다. GitHub 에는 올리지 않는다.
4. 새 조치필요 · 새 입금보류 · 3일 넘게 안 읽은 외부 메일이 있으면 요약에 적는다.
