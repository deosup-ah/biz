// 비공개 자료(rev.js · reports.js · ext.js)를 한 덩어리로 잠가 priv.enc 로 만든다.
// 사용: node tools/enc.js <키(hex 64자)> priv.enc rev.js reports.js ext.js
//       node tools/enc.js --pin <접속 비밀번호> …   (키를 다시 만들 때만. 비밀번호는 어디에도 적지 않는다)
//       node tools/enc.js --key <접속 비밀번호>      (키 hex 만 출력)
const c = require("crypto"), fs = require("fs");
const SALT = "deosup-akaeven-v1", ITER = 310000;
const fromPin = p => c.pbkdf2Sync(String(p), SALT, ITER, 32, "sha256");
let a = process.argv.slice(2), key;
if (a[0] === "--key") { console.log(fromPin(a[1]).toString("hex")); process.exit(0); }
if (a[0] === "--pin") { key = fromPin(a[1]); a = a.slice(2); } else { key = Buffer.from(a[0], "hex"); a = a.slice(1); }
if (key.length !== 32 || a.length < 2) { console.error("usage"); process.exit(1); }
const out = a[0], text = a.slice(1).filter(f => fs.existsSync(f)).map(f => fs.readFileSync(f, "utf8")).join("\n;\n");
const iv = c.randomBytes(12), ci = c.createCipheriv("aes-256-gcm", key, iv);
const d = Buffer.concat([ci.update(text, "utf8"), ci.final(), ci.getAuthTag()]);
fs.writeFileSync(out, JSON.stringify({ v: 1, at: new Date().toISOString(), iv: iv.toString("base64"), d: d.toString("base64") }));
console.log(out, d.length, "bytes");
