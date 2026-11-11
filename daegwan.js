/* 단체대관 상담·배치 보드 — 화면 로직. 데이터(window.DG_DATA)는 daegwan.enc 에서 풀려 들어온다. */
"use strict";
const DG=window.DG_DATA,RAW=DG.raw;

// 공간: 이름, 사이니지 표기, 건별대장 품목표에 적힌 정원(없으면 null)
const SP={
 "HALL1966":{n:"대화의 집",sign:"대화의 집 HALL 1966",cap:80,max:100,capLabel:"기준 배치(8인 테이블 10개) 80석"},
 "DAWN":{n:"새벽의 집",sign:"새벽의 집 MULTI-COMPLEX HALL",cap:99,max:200,capLabel:"기준 배치(T자 세트 11개) 99석"},
 "YEOHAE-S":{n:"여해의 집 세미나룸",sign:"여해의 집 세미나룸",cap:15},
 "YEOHAE-G":{n:"여해의 집 게스트룸",sign:"여해의 집 게스트룸",cap:4,soft:true},
 "YEOHAE-ALL":{n:"여해의 집 전체",sign:"여해의 집",cap:12,soft:true},
 "ROOFTOP":{n:"본관 5F 루프탑",sign:"본관 5F 루프탑",cap:null},
 "C202-1":{n:"C202-1",sign:"회의실 C202-1 · 2F",cap:8},"C202-2":{n:"C202-2",sign:"회의실 C202-2 · 2F",cap:8},
 "C202T":{n:"C202 통합",sign:"회의실 C202 · 2F",cap:16},"C203-1":{n:"C203-1",sign:"회의실 C203-1 · 2F",cap:8},
 "C203-2":{n:"C203-2",sign:"회의실 C203-2 · 2F",cap:8},"C203T":{n:"C203 통합",sign:"회의실 C203 · 2F",cap:16},
 "C204":{n:"C204",sign:"회의실 C204 · 2F",cap:16},"C300":{n:"C300",sign:"회의실 C300 · 3F",cap:30},
 "C301":{n:"C301",sign:"회의실 C301 · 3F",cap:24},"C302":{n:"C302",sign:"회의실 C302 · 3F",cap:24},
 "C301T":{n:"C301+C302 통합",sign:"회의실 C301·C302 · 3F",cap:48},"C303":{n:"C303",sign:"회의실 C303 · 3F",cap:24},
 "C304":{n:"C304",sign:"회의실 C304 · 3F",cap:null},
 "MON-2F":{n:"75인치 모니터 (2F)",sign:"",cap:null,equip:true},"MON-3F":{n:"75인치 모니터 (3F)",sign:"",cap:null,equip:true}
};
// 기준 배치도: 프로젝트에 올라온 도면 그대로. pts는 도면 이미지 위 테이블(세트) 중심 좌표
const REF={
 HALL1966:{img:"daegwan-hall1966.jpg",iw:1414,ih:2000,vb:[60,215,1290,1590],per:8,tpu:2,unit:"8인 테이블",hw:98,hh:98,
  title:"대화의 집 401 기준 배치 · 8인 테이블 10개 · 80석",
  info:"테이블 1개는 접이식 1800×600 두 개를 붙인 1800×1200이고 사면에 2석씩 앉습니다. 피아노와 기둥 자리는 비워 둡니다.",
  pts:[[609,428],[816,428],[505,652],[817,652],[439,871],[738,872],[983,871],[453,1150],[712,1105],[971,1150]]},
 DAWN:{img:"daegwan-dawn.jpg",iw:2000,ih:1415,vb:[40,160,1500,1090],per:9,tpu:2,unit:"T자 세트",hw:82,hh:74,stage:true,
  title:"새벽의 집 101호 기준 배치 · T자 세트 11개 · 99석 · 단상 2,000×2,000",
  info:"세트 1개는 접이식 1800×600 테이블 2개와 의자 9개입니다. 단상은 서쪽 벽 중앙, 세로줄 사이 통로 2,873mm, 세트 위아래 간격 1,165mm.",
  pts:[[485,425],[767,425],[1050,425],[485,619],[767,619],[1050,619],[1332,619],[485,813],[767,813],[1050,813],[1332,813]]}
};
// 다이닝 1F 좌석 안내도: 테이블 23개 · 88석. 좌표는 안내도 이미지 기준
const DIN=[["A1",3,414,305,"c"],["A2",3,566,305,"c"],["A3",3,721,305,"c"],["A4",3,868,305,"c"],["A5",3,1003,305,"c"],
 ["A6",2,481,417,"c"],["A7",3,634,417,"c"],["A8",2,782,417,"c"],["A9",2,934,417,"c"],
 ["B1",4,1108,416,"s"],["B2",4,1108,566,"s"],["B3",4,1108,717,"s"],["B4",4,1108,867,"s"],["B5",4,1108,1017,"s"],["B6",4,1108,1168,"s"],
 ["C1",4,1108,1318,"s"],["C2",8,1060,1471,"w"],["D1",6,397,1471,"d"],["D2",6,548,1471,"d"],["D3",4,826,1471,"d"],
 ["E1",4,386,1245,"e"],["E2",4,553,1245,"e"],["E3",4,720,1245,"e"]];
const DIN_TOTAL=DIN.reduce((a,t)=>a+t[1],0);
// 단체 배정 우선순서: 큰 테이블과 붙어 있는 줄부터
const DIN_ORDER=["C2","D1","D2","D3","C1","B6","B5","B4","B3","B2","B1","E1","E2","E3","A1","A2","A3","A4","A5","A7","A6","A8","A9"];
const STAGE={TMP:"1차 상담 (대장 미등록)",S10:"문의 접수",S20:"상담·견적",S30:"가예약",S40:"견적 발송",S50:"계약·계약금",S60:"확정"};
const DOW="일월화수목금토";
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const store={get(k,d){try{const v=localStorage.getItem("gr:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
             set(k,v){try{localStorage.setItem("gr:"+k,JSON.stringify(v))}catch(e){}}};

$("asof").textContent=`건별대장 스냅샷 ${DG.asOf.replace("T"," ")} 기준 · 숙박 제외 대관 공간 점유 ${RAW.split("\n").length+DG.extra.length}줄 · 이 페이지에서 고친 내용은 건별대장에 반영되지 않습니다`;
const rows=RAW.split("\n").map(l=>{const [no,org,res,s,e,st,pax,stage]=l.split("|");return{no,org,res,s,e,st,pax:+pax,stage}});
const cases=[];const byNo={};
rows.forEach(r=>{if(!byNo[r.no]){byNo[r.no]={no:r.no,org:r.org,pax:r.pax,stage:r.stage,blocks:[]};cases.push(byNo[r.no])}byNo[r.no].blocks.push(r)});
cases.forEach(c=>{c.first=c.blocks[0].s;c.confirmed=c.blocks.every(b=>b.st==="c")});
function addTemp(t){const r={no:t.no,org:t.org,res:t.res,s:t.s,e:t.e,st:"h",pax:t.pax,stage:"TMP"};
  byNo[t.no]={no:t.no,org:t.org,pax:t.pax,stage:"TMP",blocks:[r],first:t.s,confirmed:false,temp:true};cases.push(byNo[t.no])}
store.get("temp",[]).forEach(addTemp);
const sortCases=()=>cases.sort((a,b)=>a.first<b.first?-1:1);sortCases();
const pill=(st,stage)=>stage==="TMP"?'<span class="pill n">상담 중</span>':`<span class="pill ${st==="c"?"c":"h"}">${st==="c"?"확정":"가예약"}</span>`;
const stText=b=>b.stage==="TMP"?"상담 중":b.st==="c"?"확정":"가예약";

const pd=s=>{const [d,t]=s.split("T");const [y,m,dd]=d.split("-").map(Number);return{y,m,d:dd,t,dow:DOW[new Date(y,m-1,dd).getDay()],key:d}};
const md=s=>{const p=pd(s);return String(p.m).padStart(2,"0")+"-"+String(p.d).padStart(2,"0")};
const hrs=b=>(new Date(b.e)-new Date(b.s))/36e5;
function when(b){const a=pd(b.s),z=pd(b.e);const head=`${a.y}. ${a.m}. ${a.d}. (${a.dow}) ${a.t}`;
  return a.key===z.key?`${head} ~ ${z.t}`:`${head} ~ ${z.m}. ${z.d}. (${z.dow}) ${z.t}`}

let cur=null,blk=null;

/* ---------- 목록 ---------- */
function fillFilter(){const keep=$("fs").value;const used=Object.keys(SP).filter(r=>!SP[r].equip&&cases.some(c=>c.blocks.some(b=>b.res===r)));
  $("fs").innerHTML='<option value="">공간 전체</option>'+used.map(r=>`<option value="${r}">${esc(SP[r].n)}</option>`).join("");$("fs").value=keep}
fillFilter();
$("nRes").innerHTML=Object.keys(SP).filter(r=>!SP[r].equip).map(r=>`<option value="${r}">${esc(SP[r].n)}</option>`).join("");
$("addBtn").addEventListener("click",()=>{$("newcase").classList.add("on");$("nOrg").focus()});
$("nCancel").addEventListener("click",()=>$("newcase").classList.remove("on"));
$("newcase").addEventListener("submit",e=>{e.preventDefault();const d=$("nDate").value,s=$("nS").value,en=$("nE").value,org=$("nOrg").value.trim(),pax=+$("nPax").value;
  if(!d||!org||!pax||!s||!en)return;const list=store.get("temp",[]);let n=1;while(byNo["상담-"+n])n++;
  const t={no:"상담-"+n,org,pax,res:$("nRes").value,s:d+"T"+s,e:d+"T"+en};list.push(t);store.set("temp",list);addTemp(t);sortCases();fillFilter();
  $("newcase").reset();$("newcase").classList.remove("on");select(t.no)});
function removeTemp(no){store.set("temp",store.get("temp",[]).filter(t=>t.no!==no));const i=cases.indexOf(byNo[no]);if(i>=0)cases.splice(i,1);delete byNo[no];fillFilter();select(cases[0].no)}
function renderList(){const q=$("q").value.trim().toLowerCase(),f=$("fs").value;
  const list=cases.filter(c=>(!q||c.org.toLowerCase().includes(q)||c.no.toLowerCase().includes(q))&&(!f||c.blocks.some(b=>b.res===f)));
  $("cases").innerHTML=list.map(c=>{const sp=[...new Set(c.blocks.filter(b=>!SP[b.res].equip).map(b=>SP[b.res].n))].join(" · ");
    return `<li><button class="case" type="button" data-no="${c.no}" aria-current="${cur&&cur.no===c.no}">
      <span class="d">${md(c.first)}</span><span class="o">${esc(c.org)}</span>
      ${pill(c.confirmed?"c":"h",c.stage)}
      <span class="s">${esc(sp)} · ${c.pax}명 · ${c.no}</span></button></li>`}).join("")||'<li class="note" style="padding:12px">조건에 맞는 건이 없습니다.</li>'}
$("cases").addEventListener("click",e=>{const b=e.target.closest(".case");if(!b)return;select(b.dataset.no);if(!location.hash||location.hash==="#check")location.hash="consult"});
$("q").addEventListener("input",renderList);$("fs").addEventListener("change",renderList);

/* ---------- 건 선택 ---------- */
function select(no){cur=byNo[no];blk=cur.blocks.find(b=>!SP[b.res].equip)||cur.blocks[0];store.set("last",no);renderList();renderHead();renderAll()}
function renderHead(){$("org").textContent=cur.org;
  $("meta").innerHTML=`<span>${cur.no}</span><span>${cur.pax}명</span><span>단계 ${STAGE[cur.stage]||cur.stage}</span>${cur.temp?'<button class="btn ghost" id="delTemp" type="button" style="padding:2px 10px">이 상담 건 지우기</button>':""}`;
  if(cur.temp)$("delTemp").addEventListener("click",()=>removeTemp(cur.no));
  $("blocks").innerHTML=cur.blocks.map((b,i)=>`<button class="blk" type="button" data-i="${i}" aria-pressed="${b===blk}">
    <b>${esc(SP[b.res].n)} ${pill(b.st,b.stage)}</b><span>${when(b)}</span></button>`).join("");
  $("fit").innerHTML=fitHtml()}
$("blocks").addEventListener("click",e=>{const b=e.target.closest(".blk");if(!b)return;blk=cur.blocks[+b.dataset.i];renderHead();renderAll()});
function capJudge(sp,pax){
  if(sp.cap==null)return{k:"warn",t:`${sp.n}은 건별대장에 정원이 없습니다. 현장 확인 후 수용 여부를 판단합니다.`};
  if(pax<=sp.cap)return{k:"ok",t:sp.capLabel?`${sp.n} ${sp.capLabel}, ${pax}명은 기준 배치 그대로 수용합니다.`:`${sp.n} 정원 ${sp.cap}명, ${pax}명 수용 가능합니다.`};
  if(sp.max&&pax<=sp.max)return{k:"warn",t:`${sp.n} ${sp.capLabel}을 넘지만 건별대장 최대 ${sp.max}명 이내입니다. 극장식 등 다른 배치가 필요합니다.`};
  if(sp.soft)return{k:"warn",t:`${sp.n} 건별대장 정원 ${sp.cap}명(숙박 기준)을 넘습니다. 행사 인원은 현장 기준으로 확인하세요.`};
  const lim=sp.max||sp.cap;return{k:"bad",t:`${sp.n} ${sp.max?"최대":"정원"} ${lim}명을 ${pax-lim}명 넘습니다. 공간 변경이나 인원 조정을 안내하세요.`}}
function fit(){const sp=SP[blk.res];if(sp.equip)return{k:"n",t:"기자재 배정 줄입니다. 공간 줄을 선택하세요."};
  const j=capJudge(sp,cur.pax);if(j.k!=="bad"||sp.max)return j;
  const same=cur.blocks.filter(b=>b.s===blk.s&&SP[b.res].cap);const sum=same.reduce((a,b)=>a+SP[b.res].cap,0);
  if(same.length>1&&sum>=cur.pax)return{k:"ok",t:`${sp.n} 정원은 ${sp.cap}명이지만 같은 시간 배정 ${same.length}실 합계 ${sum}명으로 ${cur.pax}명을 수용합니다.`};
  return j}
const cls=k=>k==="ok"?"ok":k==="bad"?"bad":"";
function fitHtml(){const f=fit();let av="";
  if(cur.temp&&!SP[blk.res].equip){const v=verdict(blk.res,blk.s,blk.e,cur.pax,cur.no);av=`<div class="callout ${cls(v.av)}" style="margin-bottom:6px">가용성: ${esc(v.avText)}</div>`}
  return av+`<div class="callout ${cls(f.k)}">${esc(f.t)}</div>`}

/* ---------- 1차 상담 체크 ---------- */
const CHECKS=[
 ["행사 기본",["행사 목적과 성격","최종 인원, 주요 참석자","입실·시작·종료 시간 (세팅 시간 포함)","당일 현장 담당자 연락처"]],
 ["배치",["배치 형태","무대·단상·연단","등록 데스크 위치","현수막·포토월·배너 위치"]],
 ["기자재",["마이크 수량 (유선·무선)","빔프로젝터·LED 스크린·75인치 모니터","노트북 연결 방식 (HDMI 등)과 자료 사전 전달","음향·배경음악"]],
 ["식음",["식사 끼니와 인원","알레르기·채식 등 식이 제한","커피브레이크 방식과 시간","주류 여부"]],
 ["외부 업체·고객 준비",["외부 업체 반입 여부, 반입 시간과 동선","고객이 직접 준비할 물품","주차 대수, 버스 여부","사이니지 문구와 부착 위치"]]
];
function chkState(){return store.get("chk:"+cur.no,{})}
function renderChecks(){const st=chkState();
  $("checks").innerHTML=CHECKS.map(([g,items],gi)=>`<div class="grp"><h3>${g}</h3>${items.map((it,ii)=>{const k=gi+"-"+ii,v=st[k]||{};
    return `<label class="chk"><input type="checkbox" id="c${k}" data-k="${k}" ${v.on?"checked":""}><span>${it}</span>
      <input type="text" id="n${k}" data-k="${k}" value="${esc(v.note||"")}" placeholder="확인 내용" aria-label="${it} 확인 내용"></label>`}).join("")}</div>`).join("");
  renderSummary()}
$("checks").addEventListener("input",e=>{const k=e.target.dataset.k;if(!k)return;const st=chkState();st[k]=st[k]||{};
  if(e.target.type==="checkbox")st[k].on=e.target.checked;else{st[k].note=e.target.value;if(e.target.value){st[k].on=true;$("c"+k).checked=true}}
  store.set("chk:"+cur.no,st);renderSummary()});
function renderSummary(){const st=chkState();const L=[];
  L.push(`[${cur.no}] ${cur.org} · ${cur.pax}명 · ${STAGE[cur.stage]||cur.stage}`);
  cur.blocks.forEach(b=>L.push(`- ${SP[b.res].n} · ${when(b)} · ${stText(b)}`));
  L.push("수용 판단: "+fit().t);
  const lay=layoutCalc();L.push(`배치: ${lay.label} · ${lay.needText}`);
  const done=[],todo=[];CHECKS.forEach(([g,items],gi)=>items.forEach((it,ii)=>{const v=st[gi+"-"+ii]||{};(v.on?done:todo).push(v.on?`- ${it}${v.note?": "+v.note:""}`:`- ${it}`)}));
  L.push("",`확인함 (${done.length})`,...(done.length?done:["- 없음"]),"",`미확인 (${todo.length})`,...(todo.length?todo:["- 없음"]));
  $("summary").value=L.join("\n")}

/* ---------- 배치·자원 ---------- */
// 새벽의 집 배치도 기재: 테이블 22개 사용 + 3개 여유, 의자 보유 100개
const INV_DEFAULT={rect:25,chair:100};
const LT={
 class:{label:"강의식 (교실형)",per:3,perLabel:"테이블당 인원",unit:"rect"},
 group:{label:"분임 (조별)",per:6,perLabel:"조당 인원 (조당 테이블 2개)",unit:"rect"},
 u:{label:"ㄷ자",per:2,perLabel:"테이블당 인원",unit:"rect"},
 theater:{label:"극장식 (의자만)",per:10,perLabel:"한 줄 의자 수",unit:"none"},
 round:{label:"원탁 (연회)",per:8,perLabel:"원탁당 인원",unit:"round"},
 stand:{label:"스탠딩",per:8,perLabel:"스탠딩 테이블당 인원",unit:"stand"}
};
const layKey=()=>"lay:"+cur.no+":"+blk.res;
const firstN=n=>Array.from({length:n},(_,i)=>i);
function layState(){const ref=REF[blk.res];const d=store.get(layKey(),null);if(d&&(d.type!=="ref"||ref))return d;
  if(ref)return{type:"ref",extra:2,pax:cur.pax,used:firstN(Math.min(ref.pts.length,Math.ceil(cur.pax/ref.per)))};
  const t=cur.pax>60?"theater":"class";return{type:t,per:LT[t].per,extra:2,pax:cur.pax}}
function layoutCalc(){const s=layState();
  if(s.type==="ref"){const ref=REF[blk.res],pax=s.pax||cur.pax,used=(s.used||[]).slice().sort((a,b)=>a-b),seats=used.length*ref.per;
    const need={rect:used.length*ref.tpu+(s.extra||0),round:0,stand:0,chair:seats};
    const parts=[`접이식 테이블(1800×600) ${need.rect}개`,`의자 ${need.chair}개`];if(ref.stage)parts.push("단상(2,000×2,000) 1개");
    return{s,ref,pax,per:ref.per,units:used.length,used,seats,need,label:`기준 배치도 · ${ref.unit} ${used.length}개 · ${seats}석`,needText:parts.join(", ")}}
  const t=LT[s.type],pax=s.pax||cur.pax,per=Math.max(1,s.per||t.per),units=Math.ceil(pax/per);
  const need={rect:0,round:0,stand:0,chair:pax};
  if(s.type==="class"||s.type==="u")need.rect=units;
  if(s.type==="group")need.rect=units*2;
  if(s.type==="round")need.round=units;
  if(s.type==="stand"){need.stand=units;need.chair=0}
  need.rect+=s.extra||0;
  const parts=[];if(need.rect)parts.push(`직사각 테이블 ${need.rect}개`);if(need.round)parts.push(`원탁 ${need.round}개`);if(need.stand)parts.push(`스탠딩 테이블 ${need.stand}개`);if(need.chair)parts.push(`의자 ${need.chair}개`);
  return{s,t,pax,per,units,need,label:t.label,needText:parts.join(", ")}}
function renderLayout(){const c=layoutCalc(),s=c.s,isRef=s.type==="ref",ref=REF[blk.res];
  $("ltype").innerHTML=(ref?'<option value="ref">기준 배치도</option>':"")+Object.entries(LT).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("");
  $("ltype").value=s.type;$("per").value=c.per;$("per").disabled=isRef;$("extra").value=s.extra||0;$("lpax").value=c.pax;$("perLabel").textContent=isRef?`${ref.unit}당 인원 (고정)`:c.t.perLabel;
  const sp=SP[blk.res],note=$("planNote");note.className="callout";
  if(isRef){const short=c.pax-c.seats;
    if(c.pax>ref.pts.length*ref.per){note.className="callout bad";note.textContent=`${ref.title}. 배치 인원 ${c.pax}명이 기준 배치 최대 ${ref.pts.length*ref.per}석을 넘습니다. 배치 형태를 바꾸거나 인원을 조정하세요.`}
    else if(short>0){note.className="callout bad";note.textContent=`선택한 ${c.units}개로는 ${c.seats}석입니다. ${short}석이 모자랍니다. 도면에서 ${ref.unit}을 더 눌러 추가하세요.`}
    else{note.className="callout ok";note.textContent=`${ref.title}. ${c.pax}명은 ${ref.unit} ${c.units}개(${c.seats}석)로 배치합니다. 도면에서 ${ref.unit}을 눌러 쓸 자리와 뺄 자리를 바꿀 수 있습니다. ${ref.info}`}
    $("plan").innerHTML=refSvg(c)}
  else{note.textContent=ref?"기준 배치도와 다른 형태입니다. 아래 그림은 수량 확인용 개념도이며 기둥, 피아노, 단상 위치는 반영되지 않았습니다. 현장에서 실제 배치 가능 여부를 확인하세요.":"아래 그림은 수량 확인용 개념도입니다. 실제 치수는 반영되지 않았습니다.";
    $("plan").innerHTML=planSvg(c)}
  const inv=Object.assign({},INV_DEFAULT,store.get("inv",{}));const R=[["rect","접이식 테이블 (1800×600)"],["round","원탁"],["stand","스탠딩 테이블"],["chair","의자"]];
  $("need").innerHTML=`<thead><tr><th>품목</th><th class="num">필요</th><th class="num">보유</th><th>판단</th></tr></thead><tbody>`+R.map(([k,n])=>{const need=c.need[k],have=inv[k];
    let j='<span class="pill n">해당 없음</span>';
    if(need>0){if(have===undefined||have===""||have===null)j='<span class="pill h">보유 수량 입력 필요</span>';else if(+have>=need)j=`<span class="pill c">충분 · 여유 ${have-need}</span>`;else j=`<span class="pill bad">부족 ${need-have} · 외부 조달 또는 배치 조정</span>`}
    return `<tr><td>${n}</td><td class="num">${need}</td><td class="num"><input id="inv-${k}" data-inv="${k}" type="number" min="0" style="width:84px;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:4px 6px;text-align:right" value="${have??""}" aria-label="${n} 보유 수량"></td><td>${j}</td></tr>`}).join("")+"</tbody>";
  const W=[`[세팅 작업지시] ${cur.org} · ${cur.pax}명`,`공간: ${sp.n}`,`일시: ${when(blk)}`,`배치: ${c.label} · ${c.pax}명 기준`,`수량: ${c.needText}`];
  if(s.type==="class")W.push(`구성: 테이블 ${c.units}개에 ${c.per}명씩, 전면 무대·스크린을 향해 줄 맞춤`);
  if(s.type==="group")W.push(`구성: ${c.units}개 조, 조마다 테이블 2개를 붙이고 ${c.per}명씩`);
  if(s.type==="u")W.push(`구성: 테이블 ${c.units}개를 ㄷ자로, 바깥쪽에만 ${c.per}명씩`);
  if(s.type==="theater")W.push(`구성: 한 줄 ${c.per}개씩 ${c.units}줄, 가운데 통로 확보`);
  if(s.type==="round")W.push(`구성: 원탁 ${c.units}개에 ${c.per}명씩`);
  if(s.type==="stand")W.push(`구성: 스탠딩 테이블 ${c.units}개`);
  if(isRef){W.push(`구성: 기준 배치도의 ${ref.unit} ${c.used.map(i=>i+1).join(", ")}번만 세팅 (${ref.unit} 1개 = 접이식 테이블 ${ref.tpu}개 + 의자 ${ref.per}개)`);
    const off=ref.pts.map((_,i)=>i).filter(i=>!c.used.includes(i));if(off.length)W.push(`세팅하지 않는 자리: ${off.map(i=>i+1).join(", ")}번`);
    if(c.seats>c.pax)W.push(`빈 좌석 ${c.seats-c.pax}석은 마지막 번호 ${ref.unit}에서 뺍니다`);
    W.push(blk.res==="HALL1966"?"고정: 피아노와 기둥 주변은 비움, 입구에서 중앙으로 들어오는 동선 확보":"고정: 단상 서쪽 벽 중앙, 세로 테이블이 단상을 향하게, 앞쪽 홀은 별도 배치 구역")}
  if(s.extra)W.push(`진행·등록용 테이블 ${s.extra}개 별도`);
  W.push("세팅 완료 시각: 행사 시작 30분 전까지 (상담 시 확정)");
  $("work").value=W.join("\n")}
function planSvg(c){const s=c.s,W=640;let H=120,els="";const ink="var(--ink)",fill="var(--accent-soft)",stroke="var(--accent)";
  const front=`<rect x="200" y="18" width="240" height="20" rx="3" fill="${stroke}"/><text x="320" y="33" text-anchor="middle" font-size="12" fill="var(--accent-ink)">전면 · 무대 · 스크린</text>`;
  const n=c.units;
  if(s.type==="theater"){const per=c.per;let left=c.pax;for(let r=0;r<n;r++){const k=Math.min(per,left);left-=k;const gap=Math.min(26,520/per);const x0=320-(k*gap)/2-(k>4?10:0);
      for(let i=0;i<k;i++){const aisle=(k>4&&i>=Math.ceil(k/2))?20:0;els+=`<circle cx="${x0+i*gap+gap/2+aisle}" cy="${70+r*22}" r="6" fill="${fill}" stroke="${stroke}"/>`}}
    H=70+n*22+20}
  else if(s.type==="u"){const side=Math.ceil(n/3),bottom=n-side*2>0?n-side*2:side;const tw=44,th=22;const bw=Math.max(bottom,1)*tw;const x0=320-bw/2;const yb=70+side*tw;
    for(let i=0;i<side;i++){els+=`<rect x="${x0-th}" y="${70+i*tw}" width="${th}" height="${tw-4}" rx="3" fill="${fill}" stroke="${stroke}"/><rect x="${x0+bw}" y="${70+i*tw}" width="${th}" height="${tw-4}" rx="3" fill="${fill}" stroke="${stroke}"/>`}
    for(let i=0;i<bottom;i++)els+=`<rect x="${x0+i*tw+2}" y="${yb}" width="${tw-4}" height="${th}" rx="3" fill="${fill}" stroke="${stroke}"/>`;
    H=yb+th+24}
  else{const cols=s.type==="class"?Math.min(4,n):Math.min(5,n);const rowsN=Math.ceil(n/cols);const cw=Math.min(130,560/cols),ch=s.type==="class"?46:70;const x0=320-(cols*cw)/2;
    for(let i=0;i<n;i++){const r=Math.floor(i/cols),cc=i%cols;const inRow=(r===rowsN-1)?n-r*cols:cols;const off=(cols-inRow)*cw/2;const cx=x0+off+cc*cw+cw/2,cy=78+r*ch+ch/2-10;
      if(s.type==="round")els+=`<circle cx="${cx}" cy="${cy}" r="24" fill="${fill}" stroke="${stroke}"/>`;
      else if(s.type==="stand")els+=`<circle cx="${cx}" cy="${cy}" r="13" fill="${fill}" stroke="${stroke}"/>`;
      else if(s.type==="group")els+=`<rect x="${cx-38}" y="${cy-22}" width="76" height="20" rx="3" fill="${fill}" stroke="${stroke}"/><rect x="${cx-38}" y="${cy}" width="76" height="20" rx="3" fill="${fill}" stroke="${stroke}"/>`;
      else els+=`<rect x="${cx-cw/2+8}" y="${cy-10}" width="${cw-16}" height="22" rx="3" fill="${fill}" stroke="${stroke}"/>`;
      els+=`<text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="12" font-weight="600" fill="${ink}">${i+1}</text>`}
    H=78+rowsN*ch+16}
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.label} 개념도"><rect x="6" y="6" width="${W-12}" height="${H-12}" rx="6" fill="none" stroke="var(--line)" stroke-dasharray="5 4"/>${front}${els}</svg>`}
function refSvg(c){const r=c.ref,[x,y,w,h]=r.vb;let o="";
  r.pts.forEach(([cx,cy],i)=>{const on=c.used.includes(i);
    o+=`<g class="rt" data-i="${i}" role="button" tabindex="0" aria-pressed="${on}" aria-label="${r.unit} ${i+1}번 ${on?"사용":"미사용"}">`+
      (on?`<rect x="${cx-r.hw}" y="${cy-r.hh}" width="${r.hw*2}" height="${r.hh*2}" rx="14" fill="#1f5c46" fill-opacity=".10" stroke="#1f5c46" stroke-width="5"/>`
         :`<rect x="${cx-r.hw}" y="${cy-r.hh}" width="${r.hw*2}" height="${r.hh*2}" rx="14" fill="#ffffff" fill-opacity=".86" stroke="#a3271f" stroke-width="3" stroke-dasharray="10 8"/><text x="${cx}" y="${cy+12}" text-anchor="middle" font-size="34" font-weight="700" fill="#a3271f">${i+1} 뺌</text>`)+`</g>`});
  return `<svg viewBox="${x} ${y} ${w} ${h}" style="max-width:${r.iw>r.ih?860:560}px;background:#fff;border-radius:4px" role="group" aria-label="${r.title}"><image href="${r.img}" width="${r.iw}" height="${r.ih}"/>${o}</svg>`}
function toggleRef(i){const s=layState();if(s.type!=="ref")return;const u=new Set(s.used||[]);u.has(i)?u.delete(i):u.add(i);s.used=[...u];store.set(layKey(),s);renderLayout();renderSummary()}
$("plan").addEventListener("click",e=>{const g=e.target.closest(".rt");if(g)toggleRef(+g.dataset.i)});
$("plan").addEventListener("keydown",e=>{const g=e.target.closest(".rt");if(g&&(e.key==="Enter"||e.key===" ")){e.preventDefault();toggleRef(+g.dataset.i)}});
function saveLay(resetUsed){const type=$("ltype").value,pax=+$("lpax").value||cur.pax,extra=+$("extra").value||0;
  if(type==="ref"){const ref=REF[blk.res],prev=layState();
    const used=(resetUsed||prev.type!=="ref")?firstN(Math.min(ref.pts.length,Math.ceil(pax/ref.per))):prev.used;store.set(layKey(),{type,extra,pax,used})}
  else store.set(layKey(),{type,per:+$("per").value||1,extra,pax})}
$("ltype").addEventListener("change",()=>{const t=$("ltype").value;if(LT[t])$("per").value=LT[t].per;saveLay(true);renderLayout();renderSummary()});
$("lpax").addEventListener("change",()=>{saveLay(true);renderLayout();renderSummary()});
["per","extra"].forEach(id=>$(id).addEventListener("change",()=>{saveLay(false);renderLayout();renderSummary()}));
$("need").addEventListener("change",e=>{const k=e.target.dataset.inv;if(!k)return;const inv=store.get("inv",{});if(e.target.value==="")delete inv[k];else inv[k]=+e.target.value;store.set("inv",inv);renderLayout()});

/* ---------- 식음 ---------- */
function fnbOptions(){const o=[];const days={};
  cur.blocks.filter(b=>!SP[b.res].equip).forEach(b=>{const k=pd(b.s).key;const sh=+b.s.slice(11,13)+(+b.s.slice(14,16))/60;const eh=pd(b.e).key===k?+b.e.slice(11,13)+(+b.e.slice(14,16))/60:24;
    days[k]=days[k]||{s:sh,e:eh,h:0};days[k].s=Math.min(days[k].s,sh);days[k].e=Math.max(days[k].e,eh);days[k].h+=hrs(b)});
  Object.entries(days).forEach(([k,d])=>{const p=pd(k+"T00:00"),tag=`${p.m}/${p.d}(${p.dow})`;
    if(d.s<=12&&d.e>=13)o.push({id:k+"L",t:`${tag} 단체 중식 ${cur.pax}인`,d:"배정 시간이 점심 시간대를 포함합니다. 다이닝 단체 중식 품목."});
    else if(d.s>=13&&d.s<=14)o.push({id:k+"L",t:`${tag} 행사 전 단체 중식 ${cur.pax}인`,d:"행사가 점심 직후 시작합니다. 식사 후 입실로 제안할 수 있습니다."});
    if(d.e>=19)o.push({id:k+"D",t:`${tag} 단체 석식 ${cur.pax}인`,d:"배정 시간이 저녁 시간대를 포함합니다. 다이닝 단체 석식 품목."});
    else if(d.e>=17)o.push({id:k+"D",t:`${tag} 행사 후 단체 석식 ${cur.pax}인`,d:"행사가 저녁 직전에 끝납니다. 종료 후 식사로 제안할 수 있습니다."});
    const dur=Math.min(d.e-d.s,d.h);const n=dur>=7?2:dur>=3?1:0;
    if(n){o.push({id:k+"C1",t:`${tag} 커피브레이크 ${n}회 · 카페 다과 세팅 ${cur.pax}인`,d:"행사장 안에 다과를 차립니다. 쉬는 시간이 짧은 일정에 맞습니다."});
      o.push({id:k+"C2",t:`${tag} 커피쿠폰 ${cur.pax*n}장 (${cur.pax}인 × ${n}회)`,d:"참석자가 카페에서 직접 받습니다. 세팅 인력이 들지 않고 사용한 장수로 정산을 조정할 수 있습니다."});
      o.push({id:k+"C3",t:`${tag} 베이커리 간식 ${cur.pax}인`,d:"다과 대신 또는 함께 제안합니다."})}});
  if(cur.pax>=40)o.push({id:"CAT",t:`케이터링 ${cur.pax}인`,d:"행사장 안에서 식사하거나 다이닝 착석이 어려울 때 제안합니다. 협의 품목."});
  return o}
function dinState(){return store.get("din:"+cur.no,[])}
function dinAuto(){let left=cur.pax;const pick=[];for(const id of DIN_ORDER){if(left<=0)break;const t=DIN.find(x=>x[0]===id);pick.push(id);left-=t[1]}return pick}
function dinSeats(sel){return DIN.filter(t=>sel.includes(t[0])).reduce((a,t)=>a+t[1],0)}
function renderDin(){const sel=dinState(),seats=dinSeats(sel),n=$("dinNote");
  if(cur.pax>DIN_TOTAL)n.innerHTML=`<div class="callout bad">예약 ${cur.pax}명이 다이닝 전체 ${DIN_TOTAL}석을 넘습니다. 2부제 식사나 케이터링을 안내하세요.</div>`;
  else if(!sel.length)n.innerHTML=`<div class="callout">아직 배정한 테이블이 없습니다. ${cur.pax}명이면 다이닝 ${DIN_TOTAL}석 중 ${Math.round(cur.pax/DIN_TOTAL*100)}%를 씁니다.</div>`;
  else if(seats<cur.pax)n.innerHTML=`<div class="callout bad">배정 ${sel.length}개 테이블 ${seats}석, ${cur.pax-seats}석이 모자랍니다.</div>`;
  else n.innerHTML=`<div class="callout ok">배정 ${sel.length}개 테이블 ${seats}석으로 ${cur.pax}명이 앉습니다. 일반 손님 자리는 ${DIN_TOTAL-seats}석 남습니다.</div>`;
  const A="var(--accent)",S="var(--accent-soft)",P="var(--panel)",I="var(--ink)";let o="";
  DIN.forEach(([id,seat,cx,cy,k])=>{const on=sel.includes(id),f=on?A:P,tc=on?"var(--accent-ink)":I;let sh;
    if(k==="c")sh=`<circle cx="${cx}" cy="${cy}" r="40" fill="${f}" stroke="${A}" stroke-width="3"/>`;
    else if(k==="e")sh=`<rect x="${cx-48}" y="${cy-70}" width="96" height="140" rx="46" fill="${f}" stroke="${A}" stroke-width="3"/>`;
    else{const hw=k==="w"?100:k==="d"?70:52;sh=`<rect x="${cx-hw}" y="${cy-36}" width="${hw*2}" height="72" rx="8" fill="${f}" stroke="${A}" stroke-width="3"/>`}
    o+=`<g class="rt" data-id="${id}" role="button" tabindex="0" aria-pressed="${on}" aria-label="${id} ${seat}인 ${on?"배정됨":"미배정"}">${sh}<text x="${cx}" y="${cy+2}" text-anchor="middle" font-size="26" font-weight="700" fill="${tc}">${id}</text><text x="${cx}" y="${cy+26}" text-anchor="middle" font-size="18" fill="${tc}">${seat}인</text></g>`});
  $("din").innerHTML=`<svg viewBox="170 190 1060 1420" style="max-width:520px" role="group" aria-label="다이닝 좌석 안내도">
    <path d="M190 222H1202V1583H850M700 1583H190" fill="none" stroke="${I}" stroke-width="6"/>
    <rect x="320" y="670" width="470" height="440" fill="${S}" stroke="${I}" stroke-width="5"/><text x="555" y="900" text-anchor="middle" font-size="44" font-weight="700" fill="var(--mute)">주방</text>
    <text x="262" y="330" text-anchor="middle" font-size="30" font-weight="700" fill="${A}">입구 →</text><text x="775" y="1575" text-anchor="middle" font-size="22" fill="var(--mute)">출입문</text>${o}</svg>`}
function toggleDin(id){const s=new Set(dinState());s.has(id)?s.delete(id):s.add(id);store.set("din:"+cur.no,[...s]);renderDin();renderFnbText()}
$("din").addEventListener("click",e=>{const g=e.target.closest(".rt");if(g)toggleDin(g.dataset.id)});
$("din").addEventListener("keydown",e=>{const g=e.target.closest(".rt");if(g&&(e.key==="Enter"||e.key===" ")){e.preventDefault();toggleDin(g.dataset.id)}});
$("dinAuto").addEventListener("click",()=>{store.set("din:"+cur.no,dinAuto());renderDin();renderFnbText()});
$("dinClear").addEventListener("click",()=>{store.set("din:"+cur.no,[]);renderDin();renderFnbText()});
function renderFnb(){const st=store.get("fnb:"+cur.no,{});const opts=fnbOptions();renderDin();
  let warn="";
  $("fopts").innerHTML=warn+(opts.length?opts.map(o=>`<label class="opt"><input type="checkbox" id="f-${o.id}" data-f="${o.id}" ${st[o.id]?"checked":""}><span><b>${esc(o.t)}</b><span>${esc(o.d)}</span></span></label>`).join(""):'<p class="note">배정 시간이 짧아 자동 제안할 식음 항목이 없습니다.</p>');
  renderFnbText()}
function renderFnbText(){const st=store.get("fnb:"+cur.no,{});const pick=fnbOptions().filter(o=>st[o.id]);const sel=dinState();
  const seatLine=sel.length?["",`다이닝 좌석은 ${DIN.filter(t=>sel.includes(t[0])).map(t=>t[0]).join(", ")} 테이블 ${dinSeats(sel)}석을 단체 자리로 잡아 두겠습니다.`]:[];
  $("ftext").value=(pick.length||sel.length)?[`${cur.org} 담당자님, 행사 일정에 맞춰 아래 식음 구성을 제안드립니다.`,"",...pick.map(o=>"· "+o.t),...seatLine,"","인원과 시간은 조정할 수 있습니다. 식이 제한(알레르기, 채식)이 있으면 함께 알려 주세요.","더숲 아카데미하우스 단체팀 드림"].join("\n"):"제안할 항목을 체크하거나 다이닝 좌석을 배정하면 안내 문구가 만들어집니다."}
$("fopts").addEventListener("change",e=>{const k=e.target.dataset.f;if(!k)return;const st=store.get("fnb:"+cur.no,{});st[k]=e.target.checked;store.set("fnb:"+cur.no,st);renderFnb()});

/* ---------- 사이니지 ---------- */
function signDefaults(){const sp=SP[blk.res];const a=pd(blk.s),z=pd(blk.e);
  const w=a.key===z.key?`${a.m}월 ${a.d}일 (${a.dow})  ${a.t} – ${z.t}`:`${a.m}월 ${a.d}일 (${a.dow}) ${a.t} – ${z.m}월 ${z.d}일 (${z.dow}) ${z.t}`;
  return{ori:"p",hello:"환영합니다",org:cur.org,evt:"",place:sp.sign||sp.n,when:w,arrow:""}}
function signState(){return Object.assign(signDefaults(),store.get("sign:"+cur.no+":"+blk.res+":"+blk.s,{}))}
function renderSignForm(){const s=signState();$("sOri").value=s.ori;$("sHello").value=s.hello;$("sOrg").value=s.org;$("sEvt").value=s.evt;$("sPlace").value=s.place;$("sWhen").value=s.when;$("sArrow").value=s.arrow;drawSign()}
function readSign(){return{ori:$("sOri").value,hello:$("sHello").value,org:$("sOrg").value,evt:$("sEvt").value,place:$("sPlace").value,when:$("sWhen").value,arrow:$("sArrow").value}}
["sOri","sHello","sOrg","sEvt","sPlace","sWhen","sArrow"].forEach(id=>$(id).addEventListener("input",()=>{store.set("sign:"+cur.no+":"+blk.res+":"+blk.s,readSign());drawSign()}));
const SERIF='"Noto Serif KR",serif',SANS='"IBM Plex Sans KR",sans-serif';
function fitLines(ctx,text,font,maxW,start,min,maxLines){
  // 먼저 낱말을 쪼개지 않고 들어가는 가장 큰 글자 크기를 찾고, 없으면 쪼개기를 허용한다
  for(const allowBreak of [false,true]){const r=fitPass(ctx,text,font,maxW,start,min,maxLines,allowBreak);if(r)return r}
  ctx.font=font.replace("%",min);return{size:min,lines:[text]}}
function fitPass(ctx,text,font,maxW,start,min,maxLines,allowBreak){for(let size=start;size>=min;size-=6){ctx.font=font.replace("%",size);const lines=[];let line="";let broke=false;
    const toks=text.split(/(\s+)/).filter(t=>t.length);
    for(const tk of toks){if(ctx.measureText(line+tk).width<=maxW){line+=tk;continue}
      if(line.trim()){lines.push(line.trim());line=""}
      if(ctx.measureText(tk).width<=maxW){line=tk.trimStart();continue}
      broke=true;for(const ch of tk){if(ctx.measureText(line+ch).width>maxW){lines.push(line);line=ch}else line+=ch}}
    if(line.trim())lines.push(line.trim());
    if(lines.length<=maxLines&&(allowBreak||!broke))return{size,lines}}
  return null}
function drawSign(){const s=readSign(),cv=$("sign");const P=s.ori==="p";cv.width=P?2339:3307;cv.height=P?3307:2339;const W=cv.width,H=cv.height,ctx=cv.getContext("2d");
  const G="#1f5c46",INK="#17211d",MUTE="#5d6b65";const m=W*0.08;
  ctx.fillStyle="#ffffff";ctx.fillRect(0,0,W,H);
  const band=H*(P?0.11:0.14);ctx.fillStyle=G;ctx.fillRect(0,0,W,band);
  ctx.fillStyle="#ffffff";ctx.textBaseline="middle";ctx.textAlign="left";ctx.font=`700 ${Math.round(band*0.3)}px ${SERIF}`;ctx.fillText("더숲 아카데미하우스",m,band/2);
  ctx.textAlign="right";ctx.font=`500 ${Math.round(band*0.2)}px ${SANS}`;ctx.fillText("단체 행사 안내",W-m,band/2);
  const foot=H*(P?0.30:0.34),footY=H-foot;ctx.fillStyle="#e2eee8";ctx.fillRect(0,footY,W,foot);ctx.fillStyle=G;ctx.fillRect(0,footY,W,Math.round(H*0.006));
  // 가운데: 환영 문구, 단체명, 행사명
  const midTop=band,midH=footY-band;ctx.textAlign="center";ctx.textBaseline="alphabetic";
  const org=fitLines(ctx,s.org||" ",`900 %px ${SERIF}`,W-2*m,P?300:320,90,3);const lh=org.size*1.28;
  const helloSize=Math.round(W*(P?0.042:0.03)),evtSize=Math.round(W*(P?0.046:0.034));
  const blockH=(s.hello?helloSize*2.2:0)+org.lines.length*lh+(s.evt?evtSize*2.0:0);let y=midTop+(midH-blockH)/2;
  if(s.hello){ctx.fillStyle=G;ctx.font=`600 ${helloSize}px ${SANS}`;y+=helloSize;ctx.fillText(s.hello,W/2,y);y+=helloSize*1.2}
  ctx.fillStyle=INK;ctx.font=`900 ${org.size}px ${SERIF}`;org.lines.forEach(l=>{y+=lh;ctx.fillText(l,W/2,y-lh*0.22)});
  if(s.evt){const e=fitLines(ctx,s.evt,`500 %px ${SANS}`,W-2*m,evtSize,40,1);ctx.fillStyle=MUTE;ctx.font=`500 ${e.size}px ${SANS}`;y+=evtSize*1.6;ctx.fillText(e.lines[0],W/2,y)}
  // 아래: 장소, 일시, 방향
  const aw=s.arrow?foot*0.62:0;const tx=m,tw=W-2*m-(aw?aw+m*0.5:0);ctx.textAlign="left";
  const pl=fitLines(ctx,s.place||" ",`700 %px ${SERIF}`,tw,P?170:180,70,2);const plh=pl.size*1.2;const whenSize=Math.round(W*(P?0.036:0.027));
  const wh=fitLines(ctx,s.when||" ",`500 %px ${SANS}`,tw,whenSize,36,2);const whh=wh.size*1.4;
  let fy=footY+(foot-(pl.lines.length*plh+wh.lines.length*whh+whenSize*0.6))/2;
  ctx.fillStyle=G;ctx.font=`700 ${pl.size}px ${SERIF}`;pl.lines.forEach(l=>{fy+=plh;ctx.fillText(l,tx,fy-plh*0.2)});
  fy+=whenSize*0.6;ctx.fillStyle=INK;ctx.font=`500 ${wh.size}px ${SANS}`;wh.lines.forEach(l=>{fy+=whh;ctx.fillText(l,tx,fy-whh*0.25)});
  if(s.arrow){const cx=W-m-aw/2,cy=footY+foot/2,r=aw/2;ctx.fillStyle=G;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
    const rot={"→":0,"↓":Math.PI/2,"←":Math.PI,"↑":-Math.PI/2}[s.arrow];ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.strokeStyle="#ffffff";ctx.lineWidth=r*0.16;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(-r*0.5,0);ctx.lineTo(r*0.5,0);ctx.moveTo(r*0.1,-r*0.4);ctx.lineTo(r*0.5,0);ctx.lineTo(r*0.1,r*0.4);ctx.stroke();ctx.restore()}}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(cur)drawSign()});
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('900 100px "Noto Serif KR"',"더숲"),document.fonts.load('500 40px "IBM Plex Sans KR"',"더숲")]).then(()=>{if(cur)drawSign()}).catch(()=>{})}

let downloads=null;const nativeSave=!window.claude;
function showSave(){$("savePdf").hidden=false;$("savePng").hidden=false;$("sMsg").textContent="A3 한 장으로 저장됩니다. 인쇄할 때 용지를 A3, 배율을 100%로 맞추세요."}
(async()=>{if(nativeSave){showSave();return}
  try{downloads=await window.claude.use("downloads")}catch(e){}
  if(downloads)showSave();else $("sMsg").textContent="이 보기에서는 파일 저장을 쓸 수 없습니다. 미리보기를 길게 누르거나 오른쪽 클릭해 이미지를 저장하세요."})();
const fname=ext=>`사이니지_${cur.org.replace(/[\\/:*?"<>|]/g,"")}_${md(blk.s)}_${SP[blk.res].n.replace(/[\\/:*?"<>|+]/g,"")}.${ext}`;
async function save(kind){const cv=$("sign");$("sMsg").textContent="파일을 만드는 중입니다.";
  try{let data;
    if(kind==="pdf"){const P=cv.height>cv.width;const doc=new window.jspdf.jsPDF({orientation:P?"portrait":"landscape",unit:"mm",format:"a3"});
      doc.addImage(cv.toDataURL("image/jpeg",0.93),"JPEG",0,0,P?297:420,P?420:297);data=doc.output("blob")}
    else data=await new Promise(r=>cv.toBlob(r,"image/png"));
    if(downloads)await downloads.save({filename:fname(kind),data});
    else{const u=URL.createObjectURL(data),a=document.createElement("a");a.href=u;a.download=fname(kind);document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
    $("sMsg").textContent="저장했습니다."}
  catch(e){$("sMsg").textContent=e&&e.code==="declined"?"저장을 취소했습니다.":"저장하지 못했습니다. 잠시 뒤 다시 눌러 주세요."}}
$("savePdf").addEventListener("click",()=>save("pdf"));$("savePng").addEventListener("click",()=>save("png"));

/* ---------- 가용성 모의체크 ---------- */
// 건별대장 가용성 보드에만 있는 점유(회의실 온라인 예약 등). 건 목록에는 넣지 않는다
const EXTRA=DG.extra;
const LINKS={"C202T":["C202-1","C202-2"],"C203T":["C203-1","C203-2"],"C301T":["C301","C302"],"YEOHAE-ALL":["YEOHAE-S","YEOHAE-G"]};
const MON={"MON-2F":2,"MON-3F":2};
const GROUPS=[["대관 공간",["HALL1966","DAWN","YEOHAE-S","YEOHAE-G","YEOHAE-ALL","ROOFTOP"]],["회의실 2F",["C202-1","C202-2","C202T","C203-1","C203-2","C203T","C204"]],["회의실 3F",["C300","C301","C302","C301T","C303","C304"]]];
const SNAP=DG.asOf.slice(0,10);
function rel(r){const o=[r];if(LINKS[r])o.push(...LINKS[r]);for(const p in LINKS)if(LINKS[p].includes(r))o.push(p);return o}
function occ(skipNo){return rows.concat(EXTRA).filter(b=>b.no!==skipNo)}
function tempOcc(skipNo){return cases.filter(c=>c.temp&&c.no!==skipNo).flatMap(c=>c.blocks)}
const hit=(b,s,e)=>b.s<e&&s<b.e;
function bLabel(b){const sameDay=b.s.slice(0,10)===b.e.slice(0,10);return `${b.s.slice(11)}–${sameDay?"":md(b.e)+" "}${b.e.slice(11)} ${b.org} (${b.st==="c"?"확정":"가예약"}${b.res?"":""})`}
function shiftDate(d,n){const [y,m,dd]=d.split("-").map(Number);const t=new Date(Date.UTC(y,m-1,dd+n));return t.toISOString().slice(0,10)}
function verdict(r,s,e,pax,skipNo){const sp=SP[r],rs=rel(r),all=occ(skipNo).filter(b=>rs.includes(b.res));
  const cf=all.filter(b=>hit(b,s,e)),conf=cf.filter(b=>b.st==="c"),hold=cf.filter(b=>b.st!=="c");
  const soft=tempOcc(skipNo).filter(b=>rs.includes(b.res)&&hit(b,s,e));
  const cap=capJudge(sp,pax),why=[];let av,avText;
  if(conf.length){av="bad";avText="확정 예약과 겹칩니다: "+conf.map(bLabel).join(", ")}
  else if(hold.length){av="warn";avText="가예약과 겹칩니다. 선순위 건의 진행 여부를 확인하세요: "+hold.map(bLabel).join(", ")}
  else{av="ok";avText="이 시간에 비어 있습니다."}
  why.push(avText);
  if(soft.length)why.push("상담 중인 다른 건과 겹칩니다: "+soft.map(b=>b.org).join(", "));
  const day=s.slice(0,10),near=all.filter(b=>!hit(b,s,e)&&b.s<day+"T24:00"&&b.e>day+"T00:00");
  if(near.length)why.push("같은 날 다른 일정: "+near.map(bLabel).join(", "));
  if(cap.k!=="ok")why.push(cap.t);
  let lvl=av;if(cap.k==="bad")lvl="bad";else if(lvl==="ok"&&(cap.k==="warn"||soft.length))lvl="warn";
  let alt=[];if(cf.length&&cap.k!=="bad"){const ts=s.slice(10),te=e.slice(10);for(let n=1;n<=10&&alt.length<3;n++)for(const sg of[-1,1]){const d=shiftDate(day,n*sg);if(d<SNAP||alt.length>=3)continue;
      if(!all.some(b=>hit(b,d+ts,d+te)))alt.push(d)}alt.sort()}
  const label=lvl==="ok"?"가능":lvl==="warn"?(av==="warn"?"가예약 겹침":"조건부"):(conf.length?"불가":"인원 초과");
  return{lvl,av,avText,cap,why,alt,label}}
const dLabel=d=>{const p=pd(d+"T00:00");return `${p.m}/${p.d}(${p.dow})`};
function ckQuery(){return{d:$("ckDate").value,s:$("ckS").value,e:$("ckE").value,pax:+$("ckPax").value}}
function renderCheck(){const q=ckQuery(),sum=$("ckSum");store.set("ck",q);
  if(!q.d||!q.s||!q.e||!q.pax){sum.innerHTML='<div class="callout">날짜, 시간, 인원을 모두 넣으세요.</div>';$("ckTable").innerHTML="";$("ckExtra").innerHTML="";return}
  if(q.e<=q.s){sum.innerHTML='<div class="callout bad">종료 시간이 시작 시간보다 늦어야 합니다.</div>';$("ckTable").innerHTML="";$("ckExtra").innerHTML="";return}
  const s=q.d+"T"+q.s,e=q.d+"T"+q.e,cnt={ok:0,warn:0,bad:0};let body="";
  GROUPS.forEach(([g,list])=>{body+=`<tr><th colspan="5" style="background:var(--bg)">${g}</th></tr>`;
    list.forEach(r=>{const sp=SP[r],v=verdict(r,s,e,q.pax);cnt[v.lvl]++;
      const capTxt=sp.cap==null?"정보 없음":sp.max?`기준 ${sp.cap} / 최대 ${sp.max}`:`${sp.cap}명${sp.soft?" (숙박 기준)":""}`;
      const pc=v.lvl==="ok"?"c":v.lvl==="warn"?"h":"bad";
      const alt=v.alt.length?`<br><span style="color:var(--accent);font-weight:600">같은 시간 가까운 가능일: ${v.alt.map(dLabel).join(", ")}</span>`:"";
      body+=`<tr><td style="white-space:nowrap;font-weight:600">${esc(sp.n)}</td><td style="white-space:nowrap">${capTxt}</td><td><span class="pill ${pc}">${v.label}</span></td>
        <td style="font-size:13px">${v.why.map(esc).join("<br>")}${alt}</td>
        <td>${v.lvl==="bad"?"":`<button class="btn ghost" type="button" data-start="${r}" style="padding:4px 10px;white-space:nowrap">상담 시작</button>`}</td></tr>`})});
  $("ckTable").innerHTML=`<thead><tr><th>공간</th><th>정원</th><th>판정</th><th>근거</th><th></th></tr></thead><tbody>${body}</tbody>`;
  const days=Math.round((Date.parse(q.d)-Date.parse(SNAP))/864e5);let warn="";
  if(q.d<SNAP)warn='<div class="callout bad">스냅샷 날짜보다 앞선 날짜입니다. 스냅샷 이후 점유만 들어 있습니다.</div>';
  else if(days<3)warn='<div class="callout">이용일까지 3일이 안 남았습니다. 건별대장 가예약 규칙(행사 전 최소 3일, 가예약 유효 7일)을 확인하세요.</div>';
  sum.innerHTML=`<div class="callout ${cnt.ok?"ok":cnt.warn?"":"bad"}"><b>${dLabel(q.d)} ${q.s}–${q.e} · ${q.pax}명</b> — 가능 ${cnt.ok}곳, 확인 필요 ${cnt.warn}곳, 불가 ${cnt.bad}곳</div>${warn}`;
  const mon=Object.entries(MON).map(([r,total])=>{const used=occ().filter(b=>b.res===r&&hit(b,s,e)).length;return `${SP[r].n}: ${total}대 중 ${Math.max(0,total-used)}대 사용 가능`}).join(" · ");
  $("ckExtra").innerHTML=`<p class="note">${mon}. 75인치 모니터는 회의실 전용이며 대화의 집 등 대관 공간에서는 쓸 수 없습니다.</p>
    <p class="note">다이닝은 건별대장에서 좌석 예약으로 관리하지 않습니다. ${q.pax}명은 다이닝 ${DIN_TOTAL}석 ${q.pax<=DIN_TOTAL?"이내라 한 번에 앉을 수 있지만":"을 넘어 2부제나 케이터링이 필요하며"}, 식사 가능 여부는 다이닝팀에 따로 확인하세요.</p>
    <p class="note">연수객실과 숙박은 이 체크에 들어 있지 않습니다.</p>`}
function createTemp(org,pax,res,s,e){const list=store.get("temp",[]);let n=1;while(byNo["상담-"+n])n++;
  const t={no:"상담-"+n,org,pax,res,s,e};list.push(t);store.set("temp",list);addTemp(t);sortCases();fillFilter();return t.no}
["ckDate","ckS","ckE","ckPax"].forEach(id=>$(id).addEventListener("input",renderCheck));
$("ckForm").addEventListener("submit",e=>e.preventDefault());
$("ckTable").addEventListener("click",e=>{const b=e.target.closest("[data-start]");if(!b)return;const q=ckQuery();
  const no=createTemp($("ckOrg").value.trim()||"신규 문의",q.pax,b.dataset.start,q.d+"T"+q.s,q.d+"T"+q.e);select(no);location.hash="consult"});
(function(){const t=new Date(),pad=n=>String(n).padStart(2,"0");const today=`${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`;
  const q=store.get("ck",null)||{};$("ckDate").value=q.d&&q.d>=today?q.d:shiftDate(today,7);$("ckS").value=q.s||"10:00";$("ckE").value=q.e||"17:00";$("ckPax").value=q.pax||30})();

/* ---------- 복사, 탭 ---------- */
function copyBtn(btn,src,msg){$(btn).addEventListener("click",async()=>{const el=$(src);try{await navigator.clipboard.writeText(el.value);$(msg).textContent="복사했습니다."}
  catch(e){el.focus();el.select();$(msg).textContent="자동 복사가 막혔습니다. 선택된 글을 직접 복사하세요."}})}
copyBtn("copySum","summary","copyMsg");copyBtn("copyWork","work","workMsg");copyBtn("copyF","ftext","fMsg");
const VIEWS=["check","consult","layout","fnb","signage"];
function route(){const h=(location.hash||"").slice(1);const v=VIEWS.includes(h)?h:"check";
  document.querySelector(".head").style.display=v==="check"?"none":"";if(v==="check")renderCheck();
  VIEWS.forEach(x=>$("v-"+x).classList.toggle("on",x===v));
  document.querySelectorAll(".tabs a").forEach(a=>{if(a.getAttribute("href")==="#"+v)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  if(v==="signage"&&cur)drawSign()}
window.addEventListener("hashchange",route);
function renderAll(){renderLayout();renderChecks();renderFnb();renderSignForm()}

const last=store.get("last",null);select(byNo[last]?last:cases[0].no);route();
