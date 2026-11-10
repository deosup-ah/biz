# 예약 작업 「더숲 아침 브리핑 메일」 — 지시문

매일 08:35 (한국시간), 클라우드 실행(컴퓨터 불필요), Gmail 연결 필요. 받는 사람은 biz 계정 한 곳.

1. `git clone --depth 1 https://github.com/deosup-ah/biz` (읽기만).
2. `node tools/brief.js data.js` → JSON 한 개 `{subject, body, asOf, stale}`.
3. Gmail send_message 로 한 통만 보낸다: to = biz 계정, subject · body 는 생성기 결과 그대로(고치거나 덧붙이지 않는다). 다른 주소로는 보내지 않는다.
4. 생성기가 오류를 내면 메일을 보내지 않고 한 줄로 알린다.
