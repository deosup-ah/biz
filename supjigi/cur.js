'use strict';
/* 큐레이션: 때 · 계절 · 날씨에 맞춘 코너 제안 → 지점 성격 → 들여놓을 책. 계산으로만 돌아가서 어디서 열어도 같다.
   품절 · 절판으로 표시된 책(window.SOLD)은 어디에도 내지 않는다. */
const BRAND={aka:'사유의숲',choso:'초소책방',sojeon:'소전미술관',nowon:'노원',nmain:'본점',njung:'중계점'};
const TAGN=br=>NM(br)?'':(BRAND[br]||''),BRN=br=>NM(br)?'노원문고':'더숲 '+(BRAND[br]||'');
const RC={문학:'문학',에세이:'문학',인문:'인문',예술:'예술',과학:'과학'};
const TLAB=['오전(12시 이전)','점심 뒤(12~15시)','오후(15~18시)','저녁(18시 이후)'];
const sellable=b=>!(b&&b.isbn&&(window.SOLD||{})[b.isbn]);
function profile(br){const ms=yms().slice(-12),me=agg(br,ms),share=a=>{const t=Object.values(a.cats).reduce((x,o)=>x+o.amt,0)||1,s={};GR.forEach(g=>s[g]=((a.cats[g]||{}).amt||0)/t);return s},sh=share(me),oth=BR.filter(b=>b.k!==br).map(b=>share(agg(b.k,ms))),avg={};
  GR.forEach(g=>avg[g]=oth.reduce((a,s)=>a+s[g],0)/Math.max(1,oth.length));const tops=items(br).slice().sort((a,b)=>(b.sold30||0)-(a.sold30||0)).slice(0,30),tag=re=>tops.filter(x=>re.test(x.t)).length,c=me.cu,ws=c.wkd+c.wke,ts=c.t.reduce((a,v)=>a+v,0);
  return{sh,avg,order:GR.filter(g=>g!=='기타').sort((a,b)=>sh[b]-sh[a]),price:me.qty?me.amt/me.qty:0,wke:ws?c.wke/ws:null,peak:ts?c.t.indexOf(Math.max(...c.t)):null,classic:tag(/세계문학|전집|초판본|데미안|싯다르타|인간실격|이방인|동물농장/),mini:tag(/미니|키링/),poem:tag(/시인선|시선|시집|의시$/),tops,months:ms.filter(ym=>sales().some(d=>d.br===br&&d.ym===ym)).length,amt:me.amt}}
function profText(br,P){const L=[],p=v=>Math.round(v*100),g1=P.order[0],g2=P.order[1];if(!P.amt)return['판매 자료가 아직 없습니다.'];
  L.push(`${g1} ${p(P.sh[g1])}%, ${g2} ${p(P.sh[g2])}% (최근 ${P.months}개월 매출).`);
  const up=GR.filter(g=>g!=='기타'&&P.sh[g]-P.avg[g]>=.04).map(g=>`${g} +${p(P.sh[g]-P.avg[g])}%p`),dn=GR.filter(g=>g!=='기타'&&P.avg[g]-P.sh[g]>=.04).map(g=>`${g} −${p(P.avg[g]-P.sh[g])}%p`);
  if(up.length||dn.length)L.push(`다른 지점보다 ${[up.length?'강한 곳: '+up.join(', '):'',dn.length?'약한 곳: '+dn.join(', '):''].filter(Boolean).join(' / ')}.`);
  const t=[];if(P.classic>=3)t.push(`고전 ${P.classic}종`);if(P.mini>=2)t.push(`미니북 · 키링북 ${P.mini}종`);if(P.poem>=2)t.push(`시집 ${P.poem}종`);if(t.length)L.push(`많이 팔린 30종 안에 ${t.join(', ')} — ${P.mini>=2?'가볍게 집어 가는 선물용 책이 통합니다.':P.classic>=3?'이름을 아는 고전이 꾸준히 나갑니다.':'시를 찾는 손님이 있습니다.'}`);
  if(P.price)L.push(`권당 평균 ${won(P.price)}원${P.wke!=null?` · 주말 매출 ${p(P.wke)}%`:''}${P.peak!=null?` · 붐비는 때 ${TLAB[P.peak]}`:''}.`);
  if(br==='aka')L.push('인물도서관과 「이 평대의 책」처럼, 한 사람 · 한 생각을 따라 읽게 하는 결.');return L}
function recs(br){const P=profile(br),R=window.RECS||{new:{},steady:{}},its=items(br),has=b=>its.find(x=>(b.isbn&&x.isbn===b.isbn)||nt(x.t)===nt(b.t)),w={};
  Object.keys(RC).forEach(c=>w[c]=(P.sh[RC[c]]||.05)*(RC[c]==='문학'?(c==='문학'?.65:.35):1));const sum=Object.values(w).reduce((a,v)=>a+v,0)||1;
  const pick=(src,total,label)=>{const out=[];Object.keys(RC).sort((a,b)=>w[b]-w[a]).forEach(c=>{const k=Math.max(1,Math.round(total*w[c]/sum));(src[c]||[]).filter(b=>{const h=has(b);return sellable(b)&&!(h&&h.stock>0)&&!out.some(o=>o.isbn===b.isbn)}).slice(0,k).forEach(b=>out.push({...b,cat:c,src:label,why:label==='신간'?`${b.d} 출간 · ${RC[c]}`:`${c} 스테디셀러`}))});return out};
  const cross=[];BR.filter(b=>b.k!==br).forEach(b=>items(b.k).filter(x=>(x.sold30||0)>=3&&sellable(x)).forEach(x=>{const h=has(x);if(!(h&&h.stock>0)&&!cross.some(c=>c.isbn===x.isbn))cross.push({t:x.t,a:x.a,p:x.p,isbn:x.isbn,price:x.price,cat:grp(x.cat),src:'구간',why:`${b.n}에서 30일 ${x.sold30}권`,n:x.sold30})}));cross.sort((a,b)=>b.n-a.n);
  return{P,nw:pick(R.new,12,'신간'),st:pick(R.steady,10,'구간'),cross:cross.slice(0,10)}}
/* 날씨 (수유동). 공개 주소에서만 불러올 수 있고, 안 되면 계절만 본다. */
function loadWx(){if(S.wxTried)return;S.wxTried=true;fetch('https://api.open-meteo.com/v1/forecast?latitude=37.65&longitude=127.01&current=temperature_2m,precipitation,weather_code&timezone=Asia%2FSeoul').then(r=>r.json()).then(j=>{const c=j.current||{},code=c.weather_code;S.wx={temp:c.temperature_2m,rain:(code>=51&&code<=67)||(code>=80&&code<=82)||code>=95,snow:(code>=71&&code<=77)||code===85||code===86,clear:code<=1,cloud:code===2||code===3||code===45||code===48};softRender()}).catch(()=>{})}
const wxText=()=>{const w=S.wx;return w?`지금 수유동 ${Math.round(w.temp)}°C · ${w.snow?'눈':w.rain?'비':w.clear?'맑음':'흐림'}`:''};
/* 제안 은행: 짧은 문구 · 한 줄 까닭 · 상징 · 색. 책은 지금 팔 수 있는 것 가운데 제목으로 찾는다. */

function pool(br){const m=new Map(),add=(b,src)=>{if(!b.t||!sellable(b))return;const k=b.isbn||nt(b.t),o=m.get(k)||{t:b.t,a:b.a||'',p:b.p||'',isbn:b.isbn||'',price:b.price||0,cat:b.cat||'',here:0,sold:0,from:''};if(src===br){o.here=b.stock||0;o.mine=b.sold30||0}else if(BR.some(x=>x.k===src)&&(b.sold30||0)>o.sold){o.sold=b.sold30;o.from=src}if(!o.a&&b.a)o.a=b.a;if(!o.p&&b.p)o.p=b.p;m.set(k,o)};
  BR.forEach(b=>items(b.k).forEach(x=>add(x,b.k)));const R=window.RECS||{new:{},steady:{}};['new','steady'].forEach(kd=>Object.values(R[kd]).flat().forEach(b=>add(b,kd)));['yes24','aladin'].forEach(s=>((window.BOOKS||{})[s]||[]).forEach(b=>add(b,'rank')));return[...m.values()]}
const bookWhy=b=>b.here>0?`매장에 ${b.here}권`:b.from?`${brN(b.from)}에서 30일 ${b.sold}권`:'들여놓기';
function corners(br){const X=recs(br),P=X.P,[g1,g2]=P.order,pl=pool(br),sd=(()=>{const d=new Date(+TODAY.slice(0,4),10,1);let th=0;while(th<3){if(d.getDay()===4)th++;if(th<3)d.setDate(d.getDate()+1)}return dstr(d)})();
  const ctx={m:+TODAY.slice(5,7),d:+TODAY.slice(8),wx:S.wx||null,sn:dayDiff(TODAY,sd),movie:S.db.events.some(e=>e.kind==='영화'&&dayDiff(e.date,TODAY)>=0&&dayDiff(e.date,TODAY)<=7)&&br==='aka'};
  const role=(b,i)=>i===0?'중심':(b.mine||0)>=3?'잘 나가는':(b.here>0||b.src==='재고')?'곁들임':b.from?'다른 지점 인기':'새로 들일',until=o=>{const d=pd(TODAY);d.setDate(d.getDate()+(o.days||14));return dstr(d)};
  const mk=(o,books)=>({tone:o.tone||'제철',title:o.t,hook:o.why,sym:o.sym,bpal:o.bp,ppal:o.pp,until:until(o),place:o.place||(o.sym==='star'?'계산대 옆':'입구 평대'),books:books.filter((b,i,a)=>a.findIndex(z=>nt(z.t)===nt(b.t))===i).slice(0,8).map((b,i)=>({...b,role:role(b,i)})),pop:{head:o.t.replace(/,\s*/,',\n'),body:o.why},band:o.t,br});
  const L=BANK.map(o=>({o,s:o.sc(ctx)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).map(({o})=>mk(o,o.fixed?FXB(o.fixed,pl):pl.filter(b=>o.k.test(b.t.replace(/\s/g,''))).sort((a,b)=>(b.here>0)-(a.here>0)||(b.mine||0)+b.sold-(a.mine||0)-a.sold).map(b=>({...b,why:bookWhy(b),src:b.here>0?'재고':'들여놓기'})))).filter(c=>c.books.length>=3).slice(0,48);
  if(Math.abs(dayDiff(TODAY,TODAY.slice(0,4)+'-11-11'))<=3)L.unshift(mk({t:'오늘은, 서점의 날',why:'11월 11일. 이 책방에서 가장 많이 집어 간 책들.',sym:'book',bp:4,pp:1},P.tops.filter(x=>x.stock>0&&sellable(x)).map(x=>({t:x.t,a:x.a,p:x.p,isbn:x.isbn,price:x.price,why:`30일 ${x.sold30}권`,src:'재고'}))));
  const own=g=>P.tops.filter(x=>grp(x.cat)===g&&x.stock>0&&sellable(x)).slice(0,3).map(x=>({t:x.t,a:x.a,p:x.p,isbn:x.isbn,price:x.price,why:`매장에서 30일 ${x.sold30}권`,src:'재고'}));
  const D=[mk({t:'지금 막 나온 책',why:`${ctx.m}월의 새 책. ${g1} · ${g2} 쪽으로.`,sym:'drop',bp:6,pp:4,place:'입구 앞 평대'},X.nw),
   mk({t:`오래 사랑받는 ${g1}`,why:`이 지점 매출의 ${Math.round(P.sh[g1]*100)}%. 잘 나가는 책 옆에 아직 없는 스테디셀러.`,sym:'star',bp:1,pp:0,place:'눈높이 서가'},[...own(g1),...X.st.filter(b=>RC[b.cat]===g1)]),
   mk({t:'다른 더숲이 먼저 알아본 책',why:'다른 지점에서 팔리는데 여기엔 없는 책.',sym:'walk',bp:3,pp:1,place:'면진열대'},X.cross)].filter(c=>c.books.length>=2);
  return{time:L,data:D,all:[...L,...D],X}}
const isbnChip=b=>b.isbn?`<button class="chip num" data-a="cp" data-t="${b.isbn}" data-tip="누르면 ISBN 이 복사됩니다">${b.isbn}</button>`:'';
const symSVG=(key,pal)=>{const P=BANDC[pal]||BANDC[1];return `<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" style="flex:none"><rect width="64" height="64" rx="14" fill="${P.a}"/><circle cx="32" cy="32" r="21" fill="${P.ac}" opacity=".25"/><path d="${ICON[key]||''}" transform="translate(14 14) scale(1.5)" fill="none" stroke="${P.fg}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
V.store.cur=()=>{const br=S.br;if(S.solo)loadWx();
  if(br==='all')return `<div class="hero"><p>${hooks(1).season}</p><h2>지점 선택</h2></div>
   <div class="grid g4">${BR.map(b=>{const P=profile(b.k);return `<button class="card pick" data-a="br" data-k="${b.k}" style="border-top:4px solid ${b.c}"><b>${NM(b.k)?'노원문고 ':''}${BRAND[b.k]}</b><small>${b.n} · ${P.amt?`${P.order[0]} ${Math.round(P.sh[P.order[0]]*100)}%`:'자료 없음'}</small></button>`}).join('')}</div>`;
  const C=corners(br),X=C.X,P=X.P;C.data.forEach(t=>t.tone='꾸준한');const TN=S.ui.cTone||'전체',pick=t=>TN==='전체'||t.tone===TN;S.ui.cor=C.all;const hk=hooks(21).list.filter(h=>!h.ev).slice(0,2).map(h=>`${h.label.replace(/\(.*?\)/g,'')} ${dday(h.date)}`);
  const lackN=t=>t.books.slice(0,5).filter(b=>b.src!=='재고').length,thumb=(t,i)=>{try{return `<button class="pthumb" data-a="toDesign" data-kind="pop" data-s="c" data-i="${i}" aria-label="POP 미리보기">${toSVG(layout(mkD({...t,br},'pop')))}</button>`}catch(e){return symSVG(t.sym,t.bpal)}};
  const card=(t,i)=>`<div class="card pcard"><div class="phead">${thumb(t,i)}<div><h3>${esc(t.title)}</h3><p>${esc(t.hook)}</p></div></div>
    <p class="cmeta"><span>${esc(t.place||'입구 평대')}</span><span>${t.until?mdw(t.until)+'까지':'2주'}</span><span>${dpPlan(t,0).total}권</span></p>
    <ul class="blist">${t.books.slice(0,5).map((b,n)=>`<li><span><i class="no">${n+1}</i>${esc(b.t)}<small>${esc(b.a||'')}</small>${b.role&&b.role!=='곁들임'?`<small class="role">${b.role}</small>`:''}</span><em class="${b.src==='재고'?'in':''}">${b.src==='재고'?'있음':'?'}</em></li>`).join('')}</ul>
    ${S.ui.cStn?`<ul class="stn">${stnFor(t).map(x=>`<li><b>${x.b}</b> <span class="note">${x.n}</span><small>${x.w}</small></li>`).join('')}</ul>`:''}
    <details class="fold cnote"><summary>기획 메모</summary><ul><li><b>왜 지금</b> ${esc(t.hook||'')}</li><li><b>중심 책</b> 『${esc((t.books[0]||{}).t||'')}』 — 가장 잘 보이는 자리에 가장 많이.</li><li><b>번호</b> 책 앞의 번호가 진열 자리 · 책 목록의 번호와 같습니다.</li><li><b>바꿀 때</b> ${t.until?mdw(t.until):''}까지 두고, 그 사이 3권도 안 나간 책은 다른 책으로 바꿉니다.</li></ul></details>
    <div class="btns"><button class="btn pri" data-a="toDesign" data-kind="pop" data-s="c" data-i="${i}">POP 만들기</button><button class="btn" data-a="dpOpen" data-i="${i}">진열 보기</button>
     <details class="menu"><summary>기타</summary><div><button data-a="toDesign" data-kind="band" data-s="c" data-i="${i}">띠지</button><button data-a="toDesign" data-kind="list" data-s="c" data-i="${i}">책 목록 A4</button><button data-a="toDesign" data-kind="card" data-s="c" data-i="${i}">쇼카드 (6장)</button><button data-a="curKit" data-i="${i}">전체 다운로드 (POP · 띠지 · 목록 · 쇼카드)</button><button data-a="curOrder" data-s="c" data-i="${i}">미보유 도서 주문 담기${lackN(t)?` (${lackN(t)}종)`:''}</button><button data-a="go" data-v="club">책모임으로 열기</button><button data-a="corFix" data-i="${i}">공간 매대에 넣기</button></div></details></div></div>`;
  const row=(b,k,i)=>`<div class="li"><div class="t"><b style="font-weight:600">${esc(b.t)}</b><small>${esc([b.a,b.p,b.why].filter(Boolean).join(' · '))}</small></div>${isbnChip(b)}<button class="btn sm" data-a="recAdd" data-k="${k}" data-i="${i}">담기</button></div>`;
  return `<div class="hero"><p>${[brN(br),mdw(TODAY),...hk].filter(Boolean).join(' · ')}</p><h2>이번 주 큐레이션</h2></div>
  <div class="subnav" role="tablist">${['전체','제철','다른 시선','말놀이','꾸준한'].map(t=>`<button data-a="cTone" data-t="${t}" aria-pressed="${TN===t}">${t}</button>`).join('')}<button class="stnb" data-a="cStn" aria-pressed="${!!S.ui.cStn}">오브제와 함께</button></div>
  <div class="grid g2" style="align-items:start">${C.all.map((t,i)=>[t,i]).filter(([t])=>pick(t)).slice(0,S.ui.cMore?40:6).map(([t,i])=>card(t,i)).join('')||'<div class="card empty">지금 때에 맞는 제안이 없습니다.</div>'}</div>
  ${C.all.filter(pick).length>6?`<div class="btns" style="justify-content:center;margin-top:14px"><button class="btn ghost" data-a="cMore">${S.ui.cMore?'접기':`더 보기`}</button></div>`:''}
  <details class="fold" data-o="c1" ${S.ui.o_c1?'open':''}><summary>늘 두는 코너 <small>새 책 · 스테디셀러 · 다른 지점에서 팔리는 책</small></summary><div class="grid g2" style="align-items:start;margin-top:14px">${C.data.map((t,i)=>card(t,C.time.length+i)).join('')}</div></details>
  <details class="fold" data-o="c2" ${S.ui.o_c2?'open':''}><summary>이 지점의 성격 <small>${P.order[0]} ${Math.round(P.sh[P.order[0]]*100)}% · ${P.order[1]} ${Math.round(P.sh[P.order[1]]*100)}%</small></summary><div class="grid g2" style="margin-top:14px"><div class="card"><ul style="margin:0;padding-left:18px;display:grid;gap:6px">${profText(br,P).map(t=>`<li>${t}</li>`).join('')}</ul></div>
   <div class="card"><h3>분야 비중 <small>이 지점 / 다른 지점 평균</small></h3>${GR.map(g=>hbar(g,P.sh[g],Math.max(...GR.map(x=>P.sh[x]),.01),`${Math.round(P.sh[g]*100)}% <small style="color:var(--muted)">/ ${Math.round(P.avg[g]*100)}%</small>`,brC(br),`${g} · 이 지점 ${Math.round(P.sh[g]*100)}% · 다른 지점 평균 ${Math.round(P.avg[g]*100)}%`)).join('')}</div></div></details>
  <details class="fold" data-o="c3" ${S.ui.o_c3?'open':''}><summary>들여놓을 책 <small>신간 ${X.nw.length} · 스테디셀러 ${X.st.length} · 다른 지점 ${X.cross.length}</small></summary><div class="grid g3" style="align-items:start;margin-top:14px"><div class="card"><h3>신간</h3><div class="list">${X.nw.map((b,i)=>row(b,'nw',i)).join('')||'<div class="empty">없음</div>'}</div></div>
   <div class="card"><h3>스테디셀러</h3><div class="list">${X.st.map((b,i)=>row(b,'st',i)).join('')||'<div class="empty">없음</div>'}</div></div>
   <div class="card"><h3>다른 지점에서 팔리는 책</h3><div class="list">${X.cross.map((b,i)=>row(b,'cross',i)).join('')||'<div class="empty">없음</div>'}</div></div></div>
   <p class="note" style="margin-top:10px">품절 · 절판 제외(예스24 ${esc(window.SOLD_AT||'')}). 재고는 많이 팔린 30종만 압니다.</p></details>`};
A.recAdd=d=>{const b=recs(S.br)[d.k][+d.i];if(b&&addCart(S.br,b,2,b.why))toast('북센 주문에 담았습니다')};
A.corFix=d=>{const t=S.ui.cor[+d.i];let done='';planMut(p=>{if(p.starter)delete p.starter;const f=p.fx.find(x=>['table','face','shelf'].includes(x.type)&&!x.theme);if(f){f.theme=t.title;done=f.label||FX[f.type].n}},true).then(()=>toast(done?`「${done}」에 넣었습니다. 「공간」에서 볼 수 있습니다.`:'주제가 비어 있는 매대가 없습니다. 「공간」에서 매대를 넣어 주세요.'))};

A.cMore=()=>{S.ui.cMore=!S.ui.cMore;render()};
A.curKit=async d=>{const t=S.ui.cor[+d.i],keep=S.ui.D;for(const k of ['pop','band','list','card']){S.ui.D=mkD({...t,br:t.br||S.br},k);await A.dPdf()}S.ui.D=keep;toast('POP · 띠지 · 책 목록 · 쇼카드 PDF 네 장을 받았습니다')};

A.cTone=d=>{S.ui.cTone=d.t;S.ui.cMore=false;render()};

function FXB(L,pl){return L.map(([t,a,p])=>{const h=pl.find(b=>nt(b.t)===nt(t));return h?{...h,why:bookWhy(h),src:h.here>0?'재고':'들여놓기'}:{t,a,p,isbn:'',price:0,here:0,sold:0,why:'판매 상태 확인 전',src:'들여놓기'}})}

/* 책 곁에 놓을 오브제 — 매장이나 집, 근처 마트에서 바로 구할 수 있는 것만. */

function stnFor(t){const s=(t.title||'')+' '+(t.hook||''),sp=STN.filter(x=>x.k.source!=='.'&&x.k.test(s)),ge=STN.filter(x=>x.k.source==='.');return [...sp,...ge].slice(0,3)}
A.cStn=()=>{S.ui.cStn=!S.ui.cStn;render()};
