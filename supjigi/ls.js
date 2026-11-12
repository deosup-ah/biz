/* 마지막 판매일 · 반품 고르기 (11/13, 참부장)
   책 제목이나 바코드를 찍으면 여러 권이라도 책마다 마지막으로 팔린 날과 「1개월 · 3개월 · 6개월 · 9개월 · 1년 · 2년 · 3년」 구간을 보여 준다.
   반품 기준을 고르면 재고가 있고 그보다 오래 안 팔린 책을 골라 ISBN 과 함께 반품 목록에 담는다. 이지정보에는 쓰지 않는다.
   마지막 판매일 출처: ① 재고 파일의 「최종 판매일」 칸 ② 판매 파일(올린 뒤부터 날짜별) ③ 예전에 올린 판매 파일은 달까지만. */
const LSG=[[30,'1개월 안'],[90,'1개월 넘음'],[180,'3개월 넘음'],[270,'6개월 넘음'],[365,'9개월 넘음'],[730,'1년 넘음'],[1095,'2년 넘음'],[1e9,'3년 넘음']];
const LSTH=[[90,'3개월'],[180,'6개월'],[270,'9개월'],[365,'1년'],[730,'2년']];
const lsDays=d=>d?Math.floor((new Date(TODAY)-new Date(d))/864e5):null;
const lsGrp=n=>n==null?'기록 없음':LSG.find(g=>n<g[0])[1];
function lsSince(br){const ms=sales().filter(d=>d.br===br).map(d=>d.ym).sort();return ms[0]||''}
function lsFind(br,q){const all=items(br),d=String(q.isbn||'').replace(/\D/g,''),k2=nt(q.t||'');
  const it=(d&&all.find(x=>x.isbn===d))||(k2&&all.find(x=>nt(x.t)===k2))||(k2&&k2.length>=3&&all.find(x=>nt(x.t).includes(k2)))||null;
  const isbn=d||(it&&it.isbn)||'',keys=[isbn,nt((it&&it.t)||q.t||'')].filter(Boolean);let ld=(it&&it.ld)||'',ap=false;
  sales().filter(s=>s.br===br).forEach(s=>{keys.forEach(k=>{const v=s.last&&s.last[k];if(v&&v>ld){ld=v;ap=false}else if(!v&&!(s.last)&&(s.top||[]).some(x=>(x.isbn||nt(x.t))===k)){const e=s.ym+'-28';if(e>ld){ld=e;ap=true}}})});
  return{t:(it&&it.t)||q.t||'(제목 확인 중)',a:(it&&it.a)||q.a||'',p:(it&&it.p)||q.p||'',isbn,stock:it?it.stock|0:null,ld,ap,n:lsDays(ld),src:q.src||''}}
function lsAdd(q){const L=S.ui.ls.rows,r=lsFind(S.br,q),key=r.isbn||nt(r.t);if(L.some(x=>(x.isbn||nt(x.t))===key))return false;r.pick=lsPickable(r);L.unshift(r);
  if(!r.stock&&r.stock!==0&&r.isbn&&r.t==='(제목 확인 중)'){const BK=window.BOOKS||{},h=[...(BK.yes24||[]),...(BK.aladin||[]),...(BK.kyobo||[])].find(b=>b.isbn===r.isbn);if(h){r.t=h.t;r.a=h.a||'';r.p=h.p||''}else fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:'+r.isbn).then(x=>x.json()).then(j=>{const v=j&&j.items&&j.items[0]&&j.items[0].volumeInfo;r.t=v&&v.title?v.title:'(매장 자료에 없는 책)';lsDraw()}).catch(()=>{r.t='(매장 자료에 없는 책)';lsDraw()})}
  return true}
const lsPickable=r=>(r.stock==null||r.stock>0)&&(r.n==null?!!lsSince(S.br):r.n>=S.ui.ls.th);
A.lsOpen=()=>{if(S.br==='all'){toast('위에서 지점을 먼저 고르세요');return}S.ui.ls=S.ui.ls&&S.ui.ls.br===S.br?S.ui.ls:{br:S.br,rows:[],th:180};lsDraw()};
A.lsTh=d=>{const G=S.ui.ls;G.th=+d.v;G.rows.forEach(r=>r.pick=lsPickable(r));lsDraw()};
A.lsPk=d=>{const r=S.ui.ls.rows[+d.i];r.pick=!r.pick;lsDraw()};A.lsRm=d=>{S.ui.ls.rows.splice(+d.i,1);lsDraw()};A.lsClr=()=>{S.ui.ls.rows=[];lsDraw()};
A.lsTx=()=>{const v=($('lsT')||{}).value||'';v.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean).forEach(s=>{const d=s.replace(/\D/g,'');lsAdd(d.length>=10&&d.length===s.replace(/[\s-]/g,'').length?{isbn:d,src:'입력'}:{t:s,src:'입력'})});lsDraw()};
/* 재고 전체에서: 재고가 있고 기준보다 오래 안 팔린 책 */
A.lsAll=()=>{const G=S.ui.ls,ex=new Set(G.rows.map(r=>r.isbn||nt(r.t)));let n=0;items(S.br).filter(x=>(x.stock|0)>0).forEach(x=>{if(ex.has(x.isbn||nt(x.t)))return;const r=lsFind(S.br,{isbn:x.isbn,t:x.t,src:'재고'});if((r.n==null&&lsSince(S.br))||(r.n!=null&&r.n>=G.th)){r.pick=true;G.rows.push(r);n++}});
  toast(n?`${n}종을 찾았습니다`:'기준보다 오래 안 팔린 책이 없습니다');lsDraw()};
C.lsPh=async el=>{const fs=[...el.files].slice(0,6);el.value='';if(!fs.length)return;const G=S.ui.ls;G.busy=1;lsDraw();let n=0;
  for(const f of fs){for(const c of await bcFromFile(f)){const i=isbnOk(c);if(i&&lsAdd({isbn:i,src:'바코드'}))n++}}
  if(AI){try{const out=await ask('lsph','사진 속 책들의 제목을 읽어 주세요. 서가의 책등이나 표지입니다. 보이는 책마다 제목, 저자(보이면), ISBN(바코드 숫자가 보이면). 보이지 않으면 빈 문자열, 지어내지 마세요. JSON 배열로만: [{"title":"","author":"","isbn":""}]',{images:fs});const arr=Array.isArray(out)?out:(out&&out.books)||[];arr.forEach(b=>{if(b&&(b.title||b.isbn)&&lsAdd({t:String(b.title||''),a:String(b.author||''),isbn:isbnOk(b.isbn)||'',src:'사진'}))n++})}catch(e){}}
  G.busy=0;if(!n)toast(AI?'책을 찾지 못했습니다. 더 가까이, 밝게 찍어 보세요.':'바코드를 찾지 못했습니다. 제목은 아래 칸에 적어 주세요.');lsDraw()};
A.lsScan=()=>{S.ui.scanTo='ls';closeSheet();A.scanOpen()};
A.lsRet=()=>{const P=S.ui.ls.rows.filter(r=>r.pick);if(!P.length){toast('반품할 책을 골라 주세요');return}S.ui.ret=(S.ui.ret||[]).concat(P.map(r=>({t:r.t,a:r.a,p:r.p,isbn:r.isbn,qty:Math.max(1,r.stock|0)})));toast(`반품 목록에 ${P.length}종을 담았습니다`);closeSheet();A.go({v:'ret'})};
A.lsCp=()=>copyText(`${brN(S.br)} 마지막 판매일 ${TODAY}\nISBN\t제목\t재고\t마지막 판매\t구간\n`+S.ui.ls.rows.map(r=>`${r.isbn}\t${r.t}\t${r.stock==null?'':r.stock}\t${r.ld?(r.ap?r.ld.slice(0,7):r.ld):'기록 없음'}\t${lsGrp(r.n)}`).join('\n'));
function lsDraw(){const G=S.ui.ls;if(!G)return;const R=G.rows.slice().sort((a,b)=>(b.n==null?1e9:b.n)-(a.n==null?1e9:a.n)),since=lsSince(S.br),pk=G.rows.filter(r=>r.pick).length,noData=!sales().some(d=>d.br===S.br)&&!items(S.br).some(x=>x.ld);
  const cnt={};G.rows.forEach(r=>{const g=lsGrp(r.n);cnt[g]=(cnt[g]||0)+1});const GO=[...LSG.map(g=>g[1]),'기록 없음'].filter(g=>cnt[g]);
  const age=r=>r.n==null?(since?`${+since.slice(0,4)}년 ${+since.slice(5)}월 이후 판매 기록 없음`:'판매 기록 없음'):r.n<1?'오늘':r.n<60?`${r.n}일 전`:r.n<730?`${Math.floor(r.n/30.4)}개월 전`:`${(r.n/365).toFixed(1).replace('.0','')}년 전`;
  openSheet(`<div class="lsx"><div class="igxh"><b>마지막 판매일</b>${R.length?`<button class="lsclr" data-a="lsClr">비우기</button>`:`<span>${esc(brN(S.br))}</span>`}</div>
   ${noData?`<p class="lsw">이지정보 판매 · 재고 자료가 아직 없습니다. 「더보기 → 자료 · 설정」에서 이지정보 엑셀을 올리면 날짜가 나옵니다.</p>`:''}
   <div class="lsin"><button class="btn pri" data-a="lsScan">바코드 스캔</button><label class="btn">${G.busy?'읽는 중…':'사진'}<input type="file" accept="image/*" multiple data-c="lsPh" hidden></label><button class="btn" data-a="lsAll">재고 전체</button></div>
   <div class="lst"><input id="lsT" type="text" placeholder="제목 · ISBN (여러 개는 쉼표로)" onkeydown="if(event.key==='Enter')A.lsTx()"><button class="btn" data-a="lsTx">넣기</button></div>
   <div class="lsth"><span>반품 기준</span><div class="seg">${LSTH.map(([v,n])=>`<button data-a="lsTh" data-v="${v}" aria-pressed="${G.th===v}">${n}</button>`).join('')}</div></div>
   ${GO.length?`<div class="lsg">${GO.map(g=>`<span class="${g==='1개월 안'?'ok':g==='기록 없음'?'na':''}"><b>${cnt[g]}</b>${g}</span>`).join('')}</div>`:''}
   ${R.length?`<div class="lsl">${R.map(r=>{const i=G.rows.indexOf(r),old=r.n==null||r.n>=G.th;return`<div class="lsr${r.pick?' on':''}"><button class="lsk" data-a="lsPk" data-i="${i}" aria-pressed="${!!r.pick}" aria-label="반품 고르기">${r.pick?'✓':''}</button><div class="lsb"><b>${esc(r.t)}</b><small>${r.isbn||'ISBN 없음'}${r.stock!=null?` · 재고 ${r.stock}`:''}</small></div><div class="lsd${old?' old':''}"><b>${esc(lsGrp(r.n))}</b><small>${r.ld?(r.ap?r.ld.slice(0,7).replace('-','. ')+'월':r.ld.replace(/-/g,'. ')):age(r)}</small></div><button class="lsrm" data-a="lsRm" data-i="${i}" aria-label="빼기">×</button></div>`}).join('')}</div>`:`<p class="lse">바코드를 비추거나 사진을 넣으면 여기에 책마다 나옵니다.</p>`}
   ${R.length?`<div class="igxa"><button class="btn pri" data-a="lsRet">반품 목록에 담기 · ${pk}종</button><button class="btn" data-a="lsCp">복사</button></div>`:''}</div>`)}
/* 스캐너가 이 창을 위해 열렸으면 읽은 바코드를 여기로 */
(()=>{const sa=scanAdd,sp=scanPaint,sc=A.scanClose;
  scanAdd=function(code){if(S.ui.scanTo!=='ls')return sa(code);const i=isbnOk(code);if(!i)return false;lsAdd({isbn:i,src:'바코드'});return true};
  scanPaint=function(){if(S.ui.scanTo!=='ls')return sp();const e=$('scanList');if(!e)return;const L=(S.ui.ls&&S.ui.ls.rows)||[];e.innerHTML=L.length?L.slice(0,6).map(r=>`<div><b>${esc(r.t)}</b> <small>${esc(lsGrp(r.n))}${r.ld?' · '+r.ld:''}</small></div>`).join(''):'<div><small>바코드를 하나씩 비춰 주세요. 여러 권 이어서 됩니다</small></div>';const n=$('scanN');if(n)n.textContent=L.length?`${L.length}권 읽음 · 닫기`:'닫기'};
  A.scanClose=function(){const ls=S.ui.scanTo==='ls';S.ui.scanTo=null;sc();if(ls)lsDraw()}})();
/* 반품 화면 위에 들어가는 길 */
(()=>{const f=V.store.ret;V.store.ret=()=>{const h=f();if(S.br==='all')return h;const i=h.indexOf('<div class="card form">');const box=`<button class="card lsgo" data-a="lsOpen"><b>마지막 판매일로 고르기</b><span>찍으면 책마다 언제 마지막으로 팔렸는지</span></button>`;return i>0?h.slice(0,i)+box+h.slice(i):box+h}})();
