/* 더숲아카.이븐 — 공유 저장소 (Google Apps Script)
 * 구글 시트 하나를 만들고 [확장 프로그램 > Apps Script] 에 이 내용을 붙여 넣은 뒤
 * [배포 > 새 배포 > 웹 앱 · 실행: 나 · 액세스: 모든 사용자] 로 배포하면 주소(…/exec)가 나온다.
 * 그 주소를 index.html 의 SYNC_URL 에 넣으면 모든 기기가 같은 기록을 본다.
 * TOKEN 은 index.html 의 SYNC_TOKEN 과 같은 값으로 바꾼다.
 */
const TOKEN = "바꿔-넣기";
function sh_(c){const s=SpreadsheetApp.getActive();return s.getSheetByName(c)||s.insertSheet(c)}
function all_(c){return sh_(c).getDataRange().getValues().filter(r=>r[0]).map(r=>Object.assign({id:r[0]},JSON.parse(r[1]||"{}")))}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function doGet(e){if(e.parameter.k!==TOKEN)return out_({err:"auth"});const r={};(e.parameter.c||"sales,events,returns,checks,notes").split(",").forEach(c=>r[c]=all_(c));return out_(r)}
function doPost(e){const b=JSON.parse(e.postData.contents);if(b.k!==TOKEN)return out_({err:"auth"});
  const L=LockService.getScriptLock();L.waitLock(10000);try{const s=sh_(b.c),v=s.getDataRange().getValues();let i=v.findIndex(r=>r[0]===b.id);
    if(b.op==="delete"){if(i>=0)s.deleteRow(i+1)}else{const row=[b.id,JSON.stringify(b.doc),new Date()];if(i>=0)s.getRange(i+1,1,1,3).setValues([row]);else s.appendRow(row)}
  }finally{L.releaseLock()}return out_({ok:1})}
