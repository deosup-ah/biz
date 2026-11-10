# 예약 작업 「더숲 구글 캘린더 맞추기」 — 지시문

매일 09:10 (한국시간), 클라우드 실행(컴퓨터 불필요), Google Calendar 연결 필요. biz 계정 기본 캘린더만 다룬다.

1. `git clone --depth 1 https://github.com/deosup-ah/biz` (읽기만) → `node tools/ics.js data.js --json` → 있어야 할 일정 목록(오늘부터 60일). 각 항목 `{key,date,start,end,allDay,summary,description,location}`.
2. Google Calendar list_events 로 기본 캘린더의 오늘 00:00 ~ 61일 뒤, fullText "deosupsync" 인 일정을 모두 읽는다(다음 쪽까지). 설명 마지막 줄 `deosupsync <key>` 로 짝을 맞춘다.
3. 맞추기
   - 목록에 있고 캘린더에 없으면 create_event: summary · description · location 그대로, 종일이면 allDay true(startTime 그날 00:00:00, endTime 다음 날 00:00:00), 아니면 startTime `<date>T<start>:00`, endTime `<date>T<end>:00`. availability AVAILABILITY_FREE, useDefaultReminders false, notificationLevel NONE, 참석자 없음.
   - 둘 다 있는데 제목 · 시간 · 설명 · 장소가 다르면 update_event 로 그 일정만 고친다.
   - 캘린더에만 있고 목록에 없으면(취소 · 날짜 변경) 그 일정을 delete_event 로 지운다. **설명에 `deosupsync` 가 없는 일정은 절대 고치거나 지우지 않는다.**
4. 만든 · 고친 · 지운 개수를 한 줄로 남긴다. 바뀐 것이 없으면 아무것도 하지 않는다.
