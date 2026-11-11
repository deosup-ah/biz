# 단체대관 상담·배치 보드 (daegwan.html)

1차 상담에서 가용성 모의체크 → 상담 체크 → 배치·자원 → 식음 제안 → 사이니지 A3 를 한 화면에서 본다.
기존 화면(index.html)과 data.js 는 건드리지 않는다.

## 파일
- `daegwan.html` 진입 잠금(숫자 4자리)과 화면 틀. 데이터는 들어 있지 않다.
- `daegwan.js` 화면 로직. 공간 정원, 기준 배치도 좌표, 다이닝 테이블표가 들어 있다.
- `daegwan.enc` 건별대장 스냅샷(단체명·공간·일시·인원). 비밀번호로 잠겨 있다.
- `daegwan-hall1966.jpg`, `daegwan-dawn.jpg` 대화의 집·새벽의 집 기준 배치도.

## 데이터 갱신
1. 건별대장 공간 가용성 보드의 점유 현황(숙박 제외)을 읽어 `daegwan.data.js` 를 만든다. (읽기만 한다)
   형식: `window.DG_DATA={asOf:"YYYY-MM-DDTHH:MM", raw:"건번호|단체명|공간코드|시작|종료|c 또는 h|인원|단계\n…", extra:[{no,org,res,s,e,st,pax}]};`
   `raw` 는 건 대장에 있는 건, `extra` 는 가용성 보드에만 있는 점유(회의실 온라인 예약 등)다.
2. `node tools/enc.js --pin <접속 비밀번호> daegwan.enc daegwan.data.js`
3. `daegwan.enc` 만 커밋한다. `daegwan.data.js` 는 .gitignore 에 있어 올라가지 않는다. 비밀번호는 어디에도 적지 않는다.

## 알아둘 것
- 가용성 판정은 스냅샷 시점 기준이다. 접수와 가예약은 건별대장에서 한다.
- 상담 체크, 임시 상담 건, 보유 수량은 그 브라우저에만 저장된다.
