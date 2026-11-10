#!/usr/bin/env node
/* 아침 브리핑 메일 글 만들기 (숫자 · 문구는 화면의 「브리핑 복사」와 같은 규칙)
   node tools/brief.js data.js [YYYY-MM-DD]  → {"subject","body","asOf","stale"} JSON 한 개
   금액은 「그날 받을 돈」만 넣는다. 연락처는 넣지 않는다. */
const path = require("path");
global.window = {}; require(path.resolve(process.argv[2] || "data.js"));
const D = window.APP_DATA || { cases: [], asOf: "" };
const z2 = n => String(n).padStart(2, "0");
const kst = new Date(Date.now() + 9 * 36e5);
const TODAY_S = /^\d{4}-\d{2}-\d{2}$/.test(process.argv[3] || "") ? process.argv[3] : `${kst.getUTCFullYear()}-${z2(kst.getUTCMonth() + 1)}-${z2(kst.getUTCDate())}`;
const WD = "일월화수목금토";
const pd = s => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const ymd = d => `${d.getUTCFullYear()}-${z2(d.getUTCMonth() + 1)}-${z2(d.getUTCDate())}`;
const add = (s, n) => { const d = pd(s); d.setUTCDate(d.getUTCDate() + n); return ymd(d); };
const diff = s => Math.round((pd(s) - pd(TODAY_S)) / 864e5);
const md = s => { const d = pd(s); return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`; };
const mdw = s => `${md(s)}(${WD[pd(s).getUTCDay()]})`;
const ownName = o => ({ "": "", "SALES": "영업", "KIM-YW": "김영우", "JIN-IJ": "진인주" }[o] ?? o);
const ST = { conf: "확정", hold: "가예약", mix: "확정+가예약", quote: "견적 중" };
const MEAL = /조식|중식|석식|케이터링|식사|다과|간식/;
const mealKey = n => /조식/.test(n) ? "조" : /중식/.test(n) ? "중" : /석식/.test(n) ? "석" : "기타";
const mealStr = m => ["조", "중", "석", "기타"].filter(k => m[k]).map(k => `${k === "기타" ? "기타" : k + "식"} ${m[k]}`).join(" · ");

const CASES = (D.cases || []).map((c0, i) => { const c = JSON.parse(JSON.stringify(c0));
  c.id = c.no || ("X" + i); c.sch = c.sch || []; c.rooms = c.rooms || []; c.amt = c.amt || {}; c.own = ownName(c.owner || "");
  c.al = (c.al || []).map(a => ({ lv: a[0], t: a[1], n: a[2] || "" }));
  c.past = !!(c.e && diff(c.e) < 0) || !!(!c.e && c.s && diff(c.s) < 0);
  if (c.hold && (c.st === "hold" || c.st === "mix" || c.st === "quote") && !c.past) { const h = diff(c.hold), soon = c.s ? diff(c.s) : 999;
    if (h < 0) c.al.unshift({ lv: soon <= 14 ? "hi" : "mid", t: `가예약 기한 지남 (${md(c.hold)})`, n: "" });
    else if (h === 0) c.al.unshift({ lv: "hi", t: "가예약 기한 오늘", n: "" });
    else if (h <= 3) c.al.unshift({ lv: "mid", t: `가예약 기한 ${h}일 남음 (${md(c.hold)})`, n: "" }); }
  if (c.past) c.al.forEach(a => { if (a.lv === "hi" && !/입금/.test(a.t)) a.lv = "mid"; });
  c.late = c.al.some(a => /입금 지연/.test(a.t));
  return c; });
const on = (c, ds) => c.s && c.s <= ds && (c.e || c.s) >= ds;
const byDate = (a, b) => (a.s || "9999").localeCompare(b.s || "9999") || a.name.localeCompare(b.name, "ko");
function roomSpan(c, r) { const m = (r[1] || "").match(/(\d{1,2})\/(\d{1,2})\D+(\d{1,2})\/(\d{1,2})/); if (!m) return { s: c.s, e: c.e || c.s }; const y = (c.s || TODAY_S).slice(0, 4); const f = (mo, d) => `${y}-${z2(mo)}-${z2(d)}`; return { s: f(m[1], m[2]), e: f(m[3], m[4]) }; }
function mealsOn(c, ds) { const out = {}; const mmdd = `${+ds.slice(5, 7)}/${+ds.slice(8, 10)}`;
  (c.amt.items || []).forEach(r => { if (!MEAL.test(r[0]) || !(r[1] || "").startsWith(ds)) return; const n = parseInt(r[2]); if (!n) return; const k = mealKey(r[0]); out[k] = (out[k] || 0) + n; });
  (c.amt.chg || []).forEach(r => { const m = (r[0] || "").match(/수량 (\d+) → (\d+)/); if (!m || !MEAL.test(r[0])) return; if (r[1] !== mmdd && !(r[1] || "").startsWith(ds)) return; const k = mealKey(r[0]); if (out[k] != null) out[k] = out[k] - (+m[1]) + (+m[2]); }); return out; }
function day(ds, label) { const groups = CASES.filter(c => on(c, ds)).sort(byDate); const mt = {};
  const L = [`■ ${label} ${mdw(ds)} — 단체 ${groups.length}건 · ${groups.reduce((a, c) => a + (c.pax || 0), 0)}명`];
  groups.forEach(c => { L.push(`· ${c.name}${c.pax ? " " + c.pax + "명" : ""}${c.own ? " · 담당 " + c.own : " · 담당 없음"}${c.st !== "conf" ? " (" + (ST[c.st] || ST.quote) + ")" : ""}`);
    c.sch.filter(s => s[0] === ds).forEach(s => L.push(`   ${s[1]} ${s[2]}${s[3] === "hold" ? " (가예약)" : ""}`));
    const m = mealsOn(c, ds); if (Object.keys(m).length) { L.push("   식사 " + mealStr(m)); Object.entries(m).forEach(([k, v]) => mt[k] = (mt[k] || 0) + v); } });
  if (!groups.length) L.push("· 이용 단체 없음");
  if (Object.keys(mt).length) L.push(`식사 합계: ${mealStr(mt)}`);
  const ins = [], outs = []; CASES.forEach(c => c.rooms.forEach(r => { const sp = roomSpan(c, r); if (sp.s === ds) ins.push(`${c.name} ${r[2].length}실`); if (sp.e === ds) outs.push(`${c.name} ${r[2].length}실`); }));
  if (outs.length) L.push(`연수객실 퇴실(11:00): ${outs.join(", ")}`);
  if (ins.length) L.push(`연수객실 입실(16:00): ${ins.join(", ")}`);
  const pays = []; CASES.forEach(c => (c.amt.pay || []).forEach(p => { if (p[1] === ds && !/확인|입금/.test(p[4] || "")) pays.push(`${c.name} ${p[0]} ${p[2]}원`); }));
  if (pays.length) L.push(`받을 돈: ${pays.join(", ")}`);
  return { L, n: groups.length, pax: groups.reduce((a, c) => a + (c.pax || 0), 0) }; }

const T = day(TODAY_S, "오늘"), N = day(add(TODAY_S, 1), "내일");
const acts = []; CASES.filter(c => c.late || (!c.past && (!c.s || diff(c.s) <= 45))).forEach(c => c.al.forEach(a => { if (a.lv !== "lo") acts.push({ c, a }); }));
acts.sort((x, y) => (x.a.lv === "hi" ? 0 : 1) - (y.a.lv === "hi" ? 0 : 1) || ((x.c.s ? diff(x.c.s) : 999) - (y.c.s ? diff(y.c.s) : 999)));
const hi = acts.filter(x => x.a.lv === "hi");
const A = [`■ 챙길 일 — 급한 일 ${hi.length}건 · 전체 ${acts.length}건`];
acts.slice(0, 8).forEach(x => A.push(`· ${x.a.lv === "hi" ? "[급함] " : ""}${x.a.t} — ${x.c.name}${x.c.s ? " (" + md(x.c.s) + ")" : ""}`));
if (acts.length > 8) A.push(`· 외 ${acts.length - 8}건 (앱 「오늘 → 챙길 일」)`);
if (!acts.length) A.push("· 지금 급한 일 없음");
const W = ["■ 다음 7일"];
for (let i = 2; i <= 7; i++) { const ds = add(TODAY_S, i); const cs = CASES.filter(c => on(c, ds)).sort(byDate); W.push(`· ${mdw(ds)} ${cs.length ? cs.map(c => `${c.name}${c.pax ? " " + c.pax + "명" : ""}`).join(", ") : "일정 없음"}`); }
const m = (D.asOf || "").match(/(\d{1,2})\/(\d{1,2})/); const stale = !m || `${+m[1]}/${+m[2]}` !== md(TODAY_S);
const body = [`더숲 아카데미하우스 단체 브리핑 · ${mdw(TODAY_S)}`, "", ...(stale ? [`※ 일정 자료가 최신이 아닙니다 (${D.asOf || "기준 시각 없음"}). 사무실 컴퓨터가 켜지면 다시 맞춰집니다.`, ""] : []),
  ...T.L, "", ...N.L, "", ...A, "", ...W, "", D.asOf || "", "앱에서 보기: https://deosup-ah.github.io/biz/"].join("\n");
const subject = `[더숲 브리핑] ${mdw(TODAY_S)} · 오늘 ${T.n}건 ${T.pax}명 · 내일 ${N.n}건${hi.length ? " · 급한 일 " + hi.length : ""}`;
process.stdout.write(JSON.stringify({ subject, body, asOf: D.asOf || "", stale }) + "\n");
