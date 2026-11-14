/* 더숲 워크룸 공용 저장소 (구글 시트 + 앱스 스크립트)
   붙여 넣기만 하고 고치지 않습니다. 기록 이름표: arc(아카이브) · plog(평대 기록) · fb(의견) · arcimg(사진).
   사진은 드라이브 「워크룸 사진」 폴더에, 기록은 이 시트의 「기록」 탭에 쌓입니다.
   기사 찾기: 구글 뉴스 · 빙 뉴스 RSS를 대신 읽어 줍니다(30분 저장). */
var KEY = 'deosup-workroom';
var OK = ['arc', 'plog', 'fb', 'arcimg'];
var PARTS = 12, CH = 45000;

function sh_() { var ss = SpreadsheetApp.getActive(); var s = ss.getSheetByName('기록'); if (!s) { s = ss.insertSheet('기록'); s.appendRow(['이름표', 'id', '시각', '내용']); s.setFrozenRows(1); } return s; }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function folder_() { var it = DriveApp.getFoldersByName('워크룸 사진'); return it.hasNext() ? it.next() : DriveApp.createFolder('워크룸 사진'); }

function rows_() { var s = sh_(); var n = s.getLastRow(); if (n < 2) return []; return s.getRange(2, 1, n - 1, 3 + PARTS).getValues(); }
function find_(c, id) { var R = rows_(); for (var i = 0; i < R.length; i++) if (R[i][0] === c && String(R[i][1]) === id) return i + 2; return 0; }
function list_(c) { var R = rows_(), L = []; for (var i = 0; i < R.length; i++) { if (R[i][0] !== c) continue; var j = R[i].slice(3).join(''); try { L.push({ id: String(R[i][1]), data: JSON.parse(j) }); } catch (x) {} } return L; }

function put_(c, id, data) {
  var j = JSON.stringify(data); if (j.length > CH * PARTS) throw new Error('too big');
  var parts = []; for (var k = 0; k < PARTS; k++) parts.push(j.slice(k * CH, (k + 1) * CH));
  var row = [c, id, new Date().toISOString()].concat(parts), s = sh_(), r = find_(c, id);
  if (r) s.getRange(r, 1, 1, row.length).setValues([row]); else s.appendRow(row);
}
function del_(c, id) {
  var r = find_(c, id); if (!r) return;
  if (c === 'arcimg') { try { var d = JSON.parse(rows_()[r - 2].slice(3).join('')); if (d.fid) DriveApp.getFileById(d.fid).setTrashed(true); } catch (x) {} }
  sh_().deleteRow(r);
}
function img_(id, dataUrl) {
  var m = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl || ''); if (!m) throw new Error('img');
  var f = folder_().createFile(Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], id + '.jpg'));
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var d = { fid: f.getId(), d: 'https://drive.google.com/thumbnail?id=' + f.getId() + '&sz=w1600' };
  put_('arcimg', id, d); return d;
}

function rss_(url) {
  var x = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true }); if (x.getResponseCode() !== 200) return [];
  var ch = XmlService.parse(x.getContentText()).getRootElement().getChild('channel'); if (!ch) return [];
  return ch.getChildren('item').map(function (it) {
    var g = function (n) { var e = it.getChild(n); return e ? e.getText() : ''; };
    var t = g('title'), src = g('source'), m = / - ([^-]+)$/.exec(t);
    if (!src && m) src = m[1]; if (m) t = t.slice(0, m.index);
    var d = g('pubDate'); var dt = d ? Utilities.formatDate(new Date(d), 'Asia/Seoul', 'yyyy-MM-dd') : '';
    return { t: t, src: src, d: dt, url: g('link') };
  });
}
function news_(q) {
  q = String(q || '').slice(0, 60); if (!q) return [];
  var c = CacheService.getScriptCache(), k = 'n:' + q, hit = c.get(k); if (hit) return JSON.parse(hit);
  var e = encodeURIComponent(q), L = [];
  try { L = L.concat(rss_('https://news.google.com/rss/search?q=' + e + '&hl=ko&gl=KR&ceid=KR:ko')); } catch (x) {}
  try { L = L.concat(rss_('https://www.bing.com/news/search?q=' + e + '&format=rss&setlang=ko')); } catch (x) {}
  var seen = {}, out = [];
  L.forEach(function (a) { var key = a.t.replace(/\s/g, ''); if (!a.t || seen[key]) return; seen[key] = 1; out.push(a); });
  out.sort(function (a, b) { return a.d < b.d ? 1 : -1; }); out = out.slice(0, 40);
  try { c.put(k, JSON.stringify(out), 1800); } catch (x) {}
  return out;
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.a === 'list') { if (OK.indexOf(p.c) < 0) return out_({ err: 'c' }); return out_({ docs: list_(p.c) }); }
    if (p.a === 'get') { var L = list_(p.c).filter(function (x) { return x.id === p.id; }); return out_({ doc: L[0] || null }); }
    if (p.a === 'news') return out_({ items: news_(p.q) });
    return out_({ ok: 1 });
  } catch (x) { return out_({ err: String(x) }); }
}
function doPost(e) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var b = JSON.parse(e.postData.contents || '{}');
    if (b.k !== KEY || OK.indexOf(b.c) < 0 || !/^[\w.:@+~-]{1,80}$/.test(b.id || '')) return out_({ err: 'bad' });
    if (b.a === 'put') { put_(b.c, b.id, b.data || {}); return out_({ ok: 1 }); }
    if (b.a === 'del') { del_(b.c, b.id); return out_({ ok: 1 }); }
    if (b.a === 'img') return out_({ ok: 1, doc: img_(b.id, b.data && b.data.d) });
    return out_({ err: 'a' });
  } catch (x) { return out_({ err: String(x) }); } finally { lock.releaseLock(); }
}
