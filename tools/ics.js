#!/usr/bin/env node
/* 단체 일정 → 구글 캘린더 구독 파일(cal.ics) · 직접 기록용 목록(JSON)
   node tools/ics.js data.js            → cal.ics 내용을 표준 출력으로
   node tools/ics.js data.js --json     → [{key,date,start,end,allDay,summary,description,location}] (캘린더 직접 기록용 · 오늘부터 60일 · 설명 끝에 「deosupsync 키」)
   단체명 · 공간 · 시간 · 인원 · 담당만 넣는다. 금액 · 연락처는 넣지 않는다. */
const fs = require("fs"), path = require("path");
const file = process.argv[2] || "data.js", asJson = process.argv.includes("--json");
global.window = {}; require(path.resolve(file));
const D = window.APP_DATA || { cases: [] };
const PUB = "https://deosup-ah.github.io/biz/";
const z2 = n => String(n).padStart(2, "0");
const pd = s => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const ymd = d => `${d.getUTCFullYear()}-${z2(d.getUTCMonth() + 1)}-${z2(d.getUTCDate())}`;
const add = (s, n) => { const d = pd(s); d.setUTCDate(d.getUTCDate() + n); return ymd(d); };
const t0 = s => { const m = (s || "").match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
const t1 = s => { const m = (s || "").match(/[–-]\s*(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
const hm = v => `${z2(Math.floor(v / 60))}:${z2(v % 60)}`;
const ST = { conf: "", hold: "(가예약) ", mix: "(일부 가예약) ", quote: "(견적 중) " };
const ownName = o => ({ "": "", "SALES": "영업", "KIM-YW": "김영우", "JIN-IJ": "진인주" }[o] ?? o);
const kst = new Date(Date.now() + 9 * 36e5), today = ymd(kst);
const from = add(today, -14);

const out = [];
(D.cases || []).forEach(c => {
  if (!c.s || !c.no) return;
  const e = c.e || c.s; if (e < from) return;
  const sch = c.sch || [], rooms = c.rooms || [];
  const nRooms = rooms.reduce((a, r) => a + (r[2] || []).length, 0);
  for (let ds = c.s, i = 0; ds <= e && i < 60; ds = add(ds, 1), i++) {
    if (ds < from) continue;
    const sl = sch.filter(s => s[0] === ds);
    const tm = sl.filter(s => t0(s[1]) != null && t1(s[1]) != null);
    const ev = { key: `${c.no}_${ds}`, date: ds, allDay: true };
    if (tm.length) {
      const a = Math.min(...tm.map(s => t0(s[1]))); let b = Math.max(...tm.map(s => t1(s[1])));
      if (b <= a) b = Math.min(a + 60, 1439);
      ev.allDay = false; ev.start = hm(a); ev.end = hm(b);
    }
    const spaces = [...new Set(sl.map(s => s[2]))];
    const L = sl.map(s => `${s[1]} ${s[2]}${s[3] === "hold" ? " (가예약)" : ""}`);
    if (nRooms && ds < e) L.push(`연수객실 ${nRooms}실 숙박`);
    if (nRooms && ds === e && c.s !== e) L.push("연수객실 퇴실 11:00");
    if (c.pax) L.push(`인원 ${c.pax}명`);
    const own = ownName(c.owner || ""); L.push(own ? `담당 ${own}` : "담당 없음");
    if (c.stage) L.push(`단계 ${c.stage}`);
    L.push(`건 번호 ${c.no}`, `${PUB}#${c.no}`);
    const day = c.s !== e ? ` ${i + 1}일차` : "";
    ev.summary = `[더숲] ${(c.stg || 0) >= 60 ? "" : (ST[c.st] ?? ST.quote)}${c.name}${c.pax ? " " + c.pax + "명" : ""}${day}`;
    ev.description = L.join("\n");
    ev.location = "더숲 아카데미하우스" + (spaces.length ? " · " + spaces.join(", ") : "");
    out.push(ev);
  }
});
out.sort((a, b) => (a.date + (a.start || "")).localeCompare(b.date + (b.start || "")) || a.key.localeCompare(b.key));

if (asJson) { out.forEach(ev => { ev.description += "\ndeosupsync " + ev.key; });
  const lim = add(today, 60); const o2 = out.filter(ev => ev.date >= today && ev.date <= lim); out.length = 0; out.push(...o2);
  process.stdout.write(JSON.stringify(out, null, 1) + "\n"); process.exit(0); }

const escT = s => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const fold = line => { const b = Buffer.from(line, "utf8"); if (b.length <= 73) return line; const parts = []; let i = 0;
  while (i < b.length) { let n = Math.min(i ? 72 : 73, b.length - i); while (n > 0 && i + n < b.length && (b[i + n] & 0xC0) === 0x80) n--; parts.push(b.slice(i, i + n).toString("utf8")); i += n; }
  return parts.join("\r\n "); };
const m = (D.asOf || "").match(/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/);
const stampD = m ? new Date(Date.UTC(kst.getUTCFullYear(), +m[1] - 1, +m[2], +m[3] - 9, +m[4])) : new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()));
const stamp = stampD.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
const nd = s => s.replace(/-/g, "");
const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//deosup//biz group schedule//KO", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
  "X-WR-CALNAME:더숲 단체 일정", "X-WR-TIMEZONE:Asia/Seoul", `X-WR-CALDESC:${escT(D.asOf || "")}`, "REFRESH-INTERVAL;VALUE=DURATION:PT6H", "X-PUBLISHED-TTL:PT6H",
  "BEGIN:VTIMEZONE", "TZID:Asia/Seoul", "BEGIN:STANDARD", "DTSTART:19700101T000000", "TZOFFSETFROM:+0900", "TZOFFSETTO:+0900", "TZNAME:KST", "END:STANDARD", "END:VTIMEZONE"];
out.forEach(ev => {
  L.push("BEGIN:VEVENT", `UID:${ev.key}@deosup-biz`, `DTSTAMP:${stamp}`);
  if (ev.allDay) L.push(`DTSTART;VALUE=DATE:${nd(ev.date)}`, `DTEND;VALUE=DATE:${nd(add(ev.date, 1))}`);
  else L.push(`DTSTART;TZID=Asia/Seoul:${nd(ev.date)}T${ev.start.replace(":", "")}00`, `DTEND;TZID=Asia/Seoul:${nd(ev.date)}T${ev.end.replace(":", "")}00`);
  L.push(`SUMMARY:${escT(ev.summary)}`, `DESCRIPTION:${escT(ev.description)}`, `LOCATION:${escT(ev.location)}`, "TRANSP:TRANSPARENT", "END:VEVENT");
});
L.push("END:VCALENDAR");
process.stdout.write(L.map(fold).join("\r\n") + "\r\n");
