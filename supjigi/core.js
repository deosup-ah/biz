'use strict';
/* 숲지기 — 공통: 상태 · 저장 · 잠금 · 머리줄 · 도우미 */
const PIN_HASH='29034ea8787d9397e8532aaafed1d44c7fb23fc664eaa4f5e5e51a669db408ec';
const BR=[{k:'aka',n:'아카',c:'var(--s1)'},{k:'choso',n:'초소',c:'var(--s2)'},{k:'sojeon',n:'소전',c:'var(--s3)'},{k:'nowon',n:'노원더숲',c:'var(--s4)'},{k:'nmain',n:'노원문고 본점',c:'var(--s5)'},{k:'njung',n:'노원문고 중계',c:'var(--s6)'}];
const NM=br=>br==='nmain'||br==='njung',BP=br=>NM(br)?'노원문고 ':'더숲 ';
const brN=k=>k==='all'?'전체':(BR.find(b=>b.k===k)||{}).n||k;
const brC=k=>(BR.find(b=>b.k===k)||{}).c||'var(--pine)';
const GR=['문학','인문','예술','과학','기타'];
function grp(c){c=String(c||'');if(/문학|소설|에세이|산문|희곡|^시$|시집/.test(c))return'문학';if(/인문|철학|역사|사회|심리|종교|정치|교양/.test(c))return'인문';if(/예술|미술|음악|사진|디자인|건축|영화|만화/.test(c))return'예술';if(/과학|자연|수학|기술|공학|의학|환경/.test(c))return'과학';return'기타'}
const TABS={store:[['cur','큐레이션'],['design','POP'],['ana','매출'],['stock','주문'],['more','전체']],
  aka:[['today','오늘'],['cal','일정'],['plan','기획'],['insta','인스타'],['design','POP']]};
const COLS=['credit','sales','stock','carts','orders','returns','events','plans','insta','curations','ideas'];
const S={locked:true,mode:'aka',br:'all',view:{store:'cur',aka:'today'},loaded:false,demoPref:null,db:{},ui:{per:3},got:{}};
COLS.forEach(c=>S.db[c]=[]);
const V={store:{},aka:{}},A={},C={},AFTER={};
let DB=null,USER=null,AI=null,DL=null,DICT=null;

const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const won=n=>Math.round(n||0).toLocaleString('ko-KR');
const man=n=>{n=n||0;return Math.abs(n)>=1e8?(n/1e8).toFixed(1)+'억':Math.abs(n)>=1e4?Math.round(n/1e4).toLocaleString('ko-KR')+'만':won(n)};
const clone=o=>JSON.parse(JSON.stringify(o));
const nid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const nt=s=>String(s||'').replace(/\(.*?\)|[\s·,:\-—'"“”‘’!?.&]/g,'').toLowerCase();
const now9=()=>new Date(Date.now()+9*36e5);
const TODAY=now9().toISOString().slice(0,10);
const WD=['일','월','화','수','목','금','토'];
const pd=s=>new Date(s+'T00:00:00');
const dstr=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const addDays=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return dstr(d)};
const dayDiff=(a,b)=>Math.round((pd(a)-pd(b))/864e5);
const mdw=s=>{const d=pd(s);return `${d.getMonth()+1}/${d.getDate()}(${WD[d.getDay()]})`};
const dday=s=>{const n=dayDiff(s,TODAY);return n===0?'오늘':n===1?'내일':n>0?'D-'+n:Math.abs(n)+'일 전'};
const ls={get(k,d){try{const v=localStorage.getItem('sj.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('sj.'+k,JSON.stringify(v))}catch(e){}}};
const curBr=()=>S.mode==='aka'?'aka':S.br;

/* 알림 · 시트 · 말풍선 */
let toastT;function toast(m){const t=$('toast');t.textContent=m;t.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>t.style.display='none',2600)}
function openSheet(html){$('sheetBox').innerHTML=html;$('sheet').classList.add('on')}
function closeSheet(){$('sheet').classList.remove('on');$('sheetBox').innerHTML=''}
A.close=closeSheet;
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('복사했습니다');return true}catch(e){openSheet(`<h3>복사할 내용</h3><textarea rows="12" readonly>${esc(t)}</textarea><p class="note">자동 복사가 막혀 있습니다. 길게 눌러 직접 복사하세요.</p><button class="btn" data-a="close">닫기</button>`);return false}}
async function saveFile(filename,data){if(!DL){try{const u=URL.createObjectURL(data instanceof Blob?data:new Blob([data])),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return true}catch(e){toast('파일을 저장하지 못했습니다.');return false}}try{await DL.save({filename,data});return true}catch(e){if(e&&e.code!=='declined')toast('파일을 저장하지 못했습니다.');return false}}

/* 저장 */
const dbErr=e=>e&&e.code==='quota_exceeded'?'저장 공간이 가득 찼습니다.':'저장하지 못했습니다. 이 링크에서는 입력 권한이 없을 수 있습니다.';
function local(col,id,data){const a=S.db[col],i=a.findIndex(x=>x.id===id);if(data==null){if(i>=0)a.splice(i,1)}else if(i>=0)a[i]={id,...data};else a.push({id,...data})}
const keep=()=>{if(!DB&&S.solo)ls.set('db',S.db)};
async function put(col,id,data,quiet){local(col,id,data);keep();if(!quiet)render();if(DB){try{await DB.doc(col+'/'+id).set(data)}catch(e){toast(dbErr(e))}}}
async function del(col,id){local(col,id,null);keep();render();if(DB){try{await DB.doc(col+'/'+id).delete()}catch(e){toast(dbErr(e))}}}
function subscribe(){
  const timer=setTimeout(()=>{if(!S.loaded){S.loaded=true;S.slow=true;render()}},10000);
  COLS.forEach(col=>{DB.collection(col).onSnapshot(s=>{S.db[col]=s.docs.map(d=>({id:d.id,...d.data()}));S.got[col]=true;
    if(!S.loaded&&COLS.every(c=>S.got[c])){S.loaded=true;clearTimeout(timer)}softRender()},()=>{S.got[col]=true;if(COLS.every(c=>S.got[c])){S.loaded=true;clearTimeout(timer)}softRender()})});
}
let rT;function softRender(){clearTimeout(rT);rT=setTimeout(()=>{const a=document.activeElement;if(S.drag||(a&&$('app').contains(a)&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))){S.stale=true;return}render()},60)}
document.addEventListener('focusout',()=>{if(S.stale){S.stale=false;setTimeout(softRender,150)}});

/* Claude 에게 묻기 */
const aiErr=e=>({none:'Claude 앱 안에서 열어야 쓸 수 있습니다.',not_granted:'Claude 사용을 허용해야 쓸 수 있습니다.',rate_limited:'요청이 많습니다. 잠시 뒤 다시 눌러 주세요.',invalid_json:'답을 읽지 못했습니다. 다시 눌러 주세요.',refused:'이 내용으로는 만들 수 없습니다. 내용을 바꿔 주세요.',image_rejected:'사진을 읽지 못했습니다. 다른 사진으로 해 보세요.',images_unavailable:'이 화면에서는 사진을 보낼 수 없습니다.'}[e&&e.code]||'만들지 못했습니다. 잠시 뒤 다시 눌러 주세요.');
async function ask(key,prompt,opts){if(S.ui.busy)return null;if(!AI){S.ui.err={[key]:aiErr({code:'none'})};render();return null}
  S.ui.busy=key;S.ui.err={};render();try{return await AI.json(prompt,{cache:false,...opts})}catch(e){S.ui.err={[key]:aiErr(e)};return null}finally{S.ui.busy=null;setTimeout(render,0)}}
const busyBtn=(key,label,act,extra='')=>!AI?'':`<button class="btn pri" data-a="${act}" ${extra} ${S.ui.busy?'disabled':''}>${S.ui.busy===key?'만드는 중… (1분쯤 걸릴 수 있습니다)':label}</button>${S.ui.err&&S.ui.err[key]?`<p class="note" style="color:var(--crit)">${esc(S.ui.err[key])}</p>`:''}`;

/* 예시 자료 (실제 자료가 들어오기 전 화면 확인용) */
const DT=[['가호','무라카미 하루키','문학동네','소설',16800],['모순','양귀자','쓰다','소설',13000],['싯다르타','헤르만 헤세','민음사','소설',9000],['빨강의 자서전','앤 카슨','한겨레출판','시집',15000],['태풍의 이름을 잊은 것처럼','정세랑','문학동네','소설',16000],['일일 반출록','성해나','무제','에세이',17000],['자연의 것들은 그저 자란다','이윤 리','다산책방','에세이',17500],['체스 이야기·낯선 여인의 편지','슈테판 츠바이크','문학동네','소설',12000],
 ['세네카, 오늘을 빼앗기고 있는 당신에게','세네카','논픽션','철학',18000],['옥스브리지의 철학 수업','고요엘','상상스퀘어','철학',19800],['쇼펜하우어 인생수업','쇼펜하우어','하이스트','철학',17000],['니체의 초월자','프리드리히 니체','히읏','철학',18500],['독재자(들)','황현필','역바연','역사',22000],['한국사 이상현상 연구원','최인서','다이브','역사',18000],['마음의 어휘력','조아란 외','페이지2북스','심리',18800],
 ['서늘한 대화','정재승','어크로스','과학',19000],['숲은 고요하지 않다','마들렌 치게','흐름출판','자연과학',18000],['코스모스','칼 세이건','사이언스북스','과학',19900],
 ['방구석 미술관','조원재','블랙피쉬','미술',16800],['건축가의 도시','이규빈','샘터','건축',18000],['사진의 용도','아니 에르노','1984Books','사진',15000],
 ['트렌드 코리아 2027','김난도 외','미래의창','경제경영',21000],['루이&후이 보물 같은 나날들','류정훈','한스미디어','취미',22000],['가짜 돈 진짜 부','박종훈','글로퍼스','경제경영',21000]];
function rng(seed){let s=seed>>>0;return()=>(s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296}
let _demo;function demo(){if(_demo)return _demo;const sales=[],stock=[];const W={aka:[.42,.27,.12,.09,.10],choso:[.55,.2,.14,.04,.07],sojeon:[.3,.22,.08,.12,.28],nowon:[.36,.3,.07,.11,.16],nmain:[.3,.2,.06,.1,.34],njung:[.3,.2,.06,.1,.34]},SC={aka:1,choso:.78,sojeon:.46,nowon:.62,nmain:1.6,njung:.9};
  const t=pd(TODAY),months=[];for(let i=5;i>=0;i--){const d=new Date(t.getFullYear(),t.getMonth()-i,1);months.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'))}
  BR.forEach((b,bi)=>{const r=rng(77+bi*13);months.forEach((ym,mi)=>{const [y,m]=ym.split('-').map(Number),nd=new Date(y,m,0).getDate(),days={};let tot=0;
      for(let d=1;d<=nd;d++){const ds=ym+'-'+String(d).padStart(2,'0');if(ds>=TODAY)break;const w=pd(ds).getDay();const v=Math.round((260000+r()*240000)*SC[b.k]*(w===0||w===6?1.7:1)*(1+mi*.035)/100)*100;days[String(d).padStart(2,'0')]=v;tot+=v}
      const cats={},top=[];DT.forEach((x,i)=>{const g=grp(x[3]),gi=GR.indexOf(g);const share=W[b.k][gi]/DT.filter(z=>grp(z[3])===g).length*(.6+r()*.8);const amt=Math.round(tot*share*.55/100)*100,qty=Math.max(0,Math.round(amt/x[4]));
        if(qty)top.push({t:x[0],a:x[1],p:x[2],cat:x[3],qty,amt:qty*x[4]})});
      GR.forEach((g,gi)=>{const amt=Math.round(tot*W[b.k][gi]*(.9+r()*.2));cats[g==='기타'?'아동·취미·기타':g]={amt,qty:Math.round(amt/16500)}});
      const sum=Object.values(cats).reduce((a,o)=>a+o.amt,0);Object.values(cats).forEach(o=>o.amt=Math.round(o.amt*tot/sum));
      const nr=.25+r()*.2;sales.push({id:b.k+'-'+ym,br:b.k,ym,days,cats,top,nb:{new:{qty:Math.round(tot*nr/17000),amt:Math.round(tot*nr)},old:{qty:Math.round(tot*(1-nr)/15500),amt:Math.round(tot*(1-nr))}}})});
    const r2=rng(900+bi);stock.push({id:b.k+'-0',br:b.k,asOf:'예시',items:DT.map(x=>{const s30=Math.round(r2()*r2()*26*SC[b.k]);return{t:x[0],a:x[1],p:x[2],cat:x[3],price:x[4],isbn:'',sold30:s30,sold7:Math.round(s30/4*(.5+r2())),stock:r2()<.12?0:Math.round(r2()*9)}})})});
  return _demo={sales,stock}}
const SEED={sales:[],stock:[],asOf:'',credit:{}};
const credit=br=>S.db.credit.find(c=>c.id===br)||(SEED.credit||{})[br]||null;
const realSales=()=>S.db.sales.length?S.db.sales:SEED.sales,realStock=()=>S.db.stock.length?S.db.stock:SEED.stock;
const hasReal=()=>realSales().length>0||realStock().length>0;
const isDemo=()=>S.seeding?false:(S.demoPref??!hasReal());
const sales=()=>isDemo()?demo().sales:realSales();
async function loadSeed(p){S.seeding=true;try{let r=await fetch('priv.enc',{cache:'no-store'}).catch(()=>null);if(!r||!r.ok)r=await fetch('priv.json',{cache:'no-store'});if(!r.ok)return;const j=await r.json(),b=x=>Uint8Array.from(atob(x),c=>c.charCodeAt(0)),E=new TextEncoder();
  const km=await crypto.subtle.importKey('raw',E.encode(p),'PBKDF2',false,['deriveKey']),key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b(j.s),iterations:150000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
  const o=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:b(j.i)},key,b(j.d))));Object.assign(SEED,o);if(S.solo&&o.events&&!S.db.events.length)S.db.events=o.events}catch(e){}finally{S.seeding=false;render()}}
function recentQty(br){const m={};const docs=sales().filter(d=>d.br===br).sort((a,b)=>a.ym<b.ym?1:-1).slice(0,2);let days=0;docs.forEach(d=>{days+=Object.keys(d.days||{}).length;(d.top||[]).forEach(x=>{const k=x.isbn||nt(x.t);m[k]=(m[k]||0)+(x.qty||0)})});const f=days?30/days:0;Object.keys(m).forEach(k=>m[k]=Math.round(m[k]*f));return m}
function items(br){const src=isDemo()?demo().stock:realStock(),out=[];(br==='all'?BR.map(b=>b.k):[br]).forEach(k=>{let rq;src.filter(d=>d.br===k).forEach(d=>(d.items||[]).forEach(x=>{const o={...x,br:k};if(o.sold30==null){rq=rq||recentQty(k);o.sold30=rq[x.isbn||nt(x.t)]||0;o.est=true}out.push(o)}))});return out}
const need=x=>Math.max(0,Math.ceil((x.sold30||0)/30*14)-(x.stock||0));
const needs=br=>items(br).filter(x=>(x.sold30||0)>0&&need(x)>0).map(x=>({...x,need:need(x)})).sort((a,b)=>b.need-a.need);
const cart=br=>S.db.carts.find(c=>c.id===br)||{id:br,items:[],status:'담음'};
function addCart(br,b,qty,why){if(br==='all'){toast('위에서 지점을 먼저 고르세요');return false}const c=clone(cart(br)),k=b.isbn||nt(b.t),ex=c.items.find(i=>(i.isbn||nt(i.t))===k);
  if(ex)ex.qty+=qty||1;else c.items.push({t:b.t,a:b.a||'',p:b.p||'',isbn:b.isbn||'',price:b.price||0,qty:qty||1,why:why||''});const {id,...d}=c;d.status='담음';d.at=new Date().toISOString();put('carts',br,d);return true}
function anomalies(br){const out=[];(br==='all'?BR.map(b=>b.k):[br]).forEach(k=>{const its=items(k);its.filter(x=>(x.stock||0)<0).forEach(x=>out.push({lv:'crit',br:k,msg:`재고가 음수입니다: ${x.t} (${x.stock}권)`}));
    const dead=its.filter(x=>!(x.sold30>0)&&(x.stock||0)>=5);if(dead.length)out.push({lv:'warn',br:k,msg:`최근 30일 안 팔렸는데 재고 5권 이상인 책 ${dead.length}종 (예: ${dead[0].t})`});
    const recent=S.db.orders.filter(o=>o.br===k&&dayDiff(TODAY,o.date)<=7),rets=S.db.returns.filter(r=>r.br===k&&dayDiff(TODAY,r.date)<=30);
    cart(k).items.forEach(i=>{const key=i.isbn||nt(i.t),has=l=>l.some(o=>(o.items||[]).some(j=>(j.isbn||nt(j.t))===key));
      if(has(recent))out.push({lv:'warn',br:k,msg:`7일 안에 주문한 책이 또 담겼습니다: ${i.t}`});if(has(rets))out.push({lv:'warn',br:k,msg:`최근 반품한 책을 다시 주문하려 합니다: ${i.t}`})})});return out}

/* 지금 챙길 때 — 큐레이션 · 행사의 시의성 */
function hooks(range=60){const y=+TODAY.slice(0,4),out=[];const fix=[['01-01','새해 첫날','다짐 · 계획 · 새 출발'],['02-14','밸런타인데이','사랑 · 선물'],['03-01','삼일절','역사 · 독립'],['03-02','새 학기','공부 · 시작'],['04-23','세계 책의 날','책에 관한 책 · 선물'],['05-05','어린이날','가족'],['05-08','어버이날','부모 · 가족'],['05-15','스승의 날','배움 · 감사'],['06-06','현충일','기억'],['08-15','광복절','역사'],['10-09','한글날','우리말 · 글쓰기'],['11-11','서점의 날','동네 서점 · 책방 이야기'],['12-22','동지 무렵','긴 밤 · 겨울 읽기'],['12-25','크리스마스','선물 · 겨울'],['12-31','한 해 마무리','올해의 책 · 돌아보기']];
  [y,y+1].forEach(yy=>{fix.forEach(([md,n,tip])=>out.push({date:yy+'-'+md,label:n,tip}));const d=new Date(yy,10,1);let th=0;while(th<3){if(d.getDay()===4)th++;if(th<3)d.setDate(d.getDate()+1)}out.push({date:dstr(d),label:'수능(11월 셋째 목요일)',tip:'수험생 응원 · 수능 뒤 읽을 책'})});
  S.db.events.forEach(e=>{if(e.date)out.push({date:e.date,label:`${e.kind||'행사'}: ${e.title}`,tip:'행사 연계 매대',ev:true})});
  const m=+TODAY.slice(5,7);const season={1:'한겨울 · 새해',2:'늦겨울 · 졸업',3:'봄 · 새 학기',4:'봄 · 산책',5:'가정의 달',6:'초여름 · 장마',7:'여름휴가',8:'늦여름 · 휴가',9:'초가을 · 독서의 달',10:'가을 · 노벨문학상 발표 철',11:'늦가을 · 겨울 채비',12:'연말 · 선물'}[m];
  return {season,list:out.filter(h=>{const n=dayDiff(h.date,TODAY);return n>=0&&n<=range}).sort((a,b)=>a.date<b.date?-1:1)}}

/* 잠금 */
let pin='';
function lockUI(bad){$('lock').innerHTML=`<div class="lockbox ${bad?'shake':''}"><h1>더숲 워크룸</h1><p>${bad?'비밀번호가 맞지 않습니다':'화면 비밀번호 4자리'}</p><div class="dots">${[0,1,2,3].map(i=>`<i class="${i<pin.length?'on':''}"></i>`).join('')}</div>
  <div class="pad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-a="pin" data-n="${n}">${n}</button>`).join('')}<span></span><button data-a="pin" data-n="0">0</button><button data-a="pin" data-n="x" aria-label="지우기">←</button></div></div>`}
async function tryPin(){const h=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('theforest-books:'+pin)))].map(b=>b.toString(16).padStart(2,'0')).join('');
  if(h===PIN_HASH){S.locked=false;try{sessionStorage.setItem('sj.p',pin)}catch(e){}$('lock').style.display='none';loadSeed(pin);render()}else{pin='';lockUI(true)}}
A.pin=d=>{if(d.n==='x')pin=pin.slice(0,-1);else if(pin.length<4)pin+=d.n;lockUI();if(pin.length===4)tryPin()};
A.lock=()=>{S.locked=true;pin='';try{sessionStorage.removeItem('sj.p')}catch(e){}$('app').innerHTML='';$('lock').style.display='grid';lockUI()};
document.addEventListener('keydown',e=>{if(!S.locked)return;if(/^\d$/.test(e.key))A.pin({n:e.key});else if(e.key==='Backspace')A.pin({n:'x'})});

/* 머리줄 · 그리기 */
function render(){if(S.locked)return;if(S.view.store==='today'&&!S.ui.seenToday){}const m=S.mode,v=V[m][S.view[m]]?S.view[m]:TABS[m][0][0],tv=TABS[m].some(t=>t[0]===v)?v:'more';const al=m==='store'?anomalies('all').length:0,cn=BR.reduce((a,b)=>a+cart(b.k).items.length,0);
  const sx=window.scrollX,sy=window.scrollY;
  $('app').innerHTML=`<header class="top"><div class="bar"><div class="brand"><img class="blogo" src="logo-g.png" alt="deosup" height="20"><span>워크룸</span></div>
    <div class="mode" role="group" aria-label="일 고르기"><button data-a="mode" data-m="aka" aria-pressed="${m==='aka'}">아카데미</button><button data-a="mode" data-m="store" aria-pressed="${m==='store'}">서점</button></div>
    </div>
   ${m==='store'?`<div class="row2" role="group" aria-label="지점 고르기">${[{k:'all',n:'전체'},...BR].map(b=>`<button class="brchip" data-a="br" data-k="${b.k}" aria-pressed="${S.br===b.k}">${b.c?`<i style="background:${b.c}"></i>`:''}${b.n}</button>`).join('')}</div>`:''}
   <nav class="tabs">${TABS[m].map(([k,l])=>`<button data-a="go" data-v="${k}" ${tv===k?'aria-current="page"':''}>${l}${k==='more'&&al?`<span class="b">${al}</span>`:''}${k==='stock'&&cn?`<span class="b" style="background:var(--pine)">${cn}</span>`:''}</button>`).join('')}</nav></header>
   <main>${!S.loaded?`<div class="card empty">자료를 불러오는 중입니다…</div>`:''}${S.slow?`<div class="al">저장된 자료에 아직 닿지 못했습니다. 보이는 내용이 최신이 아닐 수 있습니다.</div>`:''}
   
   ${m==='store'&&!isDemo()&&!realStock().length&&v==='stock'?`<div class="al">재고 자료가 아직 없어 주문 필요 계산은 비어 있습니다. 매출은 실제 숫자입니다.</div>`:''}
   ${m==='store'&&isDemo()&&['today','ana','stock'].includes(v)?`<div class="demo"><span><b>예시 자료입니다.</b> 실제 매출 · 재고가 아닙니다. 이지정보에서 내보낸 엑셀을 「자료 · 설정」에 올리면 진짜 숫자로 바뀝니다.</span><button class="btn sm" data-a="go" data-v="data">자료 올리러 가기</button></div>`:''}
   ${V[m][v]()}</main>`;
  window.scrollTo(sx,sy);if(AFTER[v])AFTER[v]()}
A.mode=d=>{if(d.m!==S.mode){S.ui['D_'+S.mode]=S.ui.D;S.ui.D=S.ui['D_'+d.m]||null;S.ui.dH=[];S.ui.dlog=[]}S.mode=d.m;ls.set('mode2',d.m);window.scrollTo(0,0);render()};
A.br=d=>{S.br=d.k;ls.set('br',d.k);render()};
A.go=d=>{if(d.m)S.mode=d.m;S.view[S.mode]=d.v;ls.set('view',S.view);window.scrollTo(0,0);render()};
A.big=()=>{const b=document.body.classList.toggle('big');ls.set('big',b);render()};
A.ui=d=>{S.ui[d.k]=isNaN(+d.v)||d.v===''?d.v:+d.v;if(d.k==='per'){S.ui.pf=S.ui.pt=null}render()};
document.addEventListener('click',e=>{if(e.target.id==='sheet'){closeSheet();return}const el=e.target.closest('[data-a]');if(el&&A[el.dataset.a])A[el.dataset.a](el.dataset,el,e)});
document.addEventListener('toggle',e=>{const k=e.target&&e.target.dataset&&e.target.dataset.o;if(k)S.ui['o_'+k]=e.target.open},true);
document.addEventListener('change',e=>{const el=e.target.closest('[data-c]');if(el&&C[el.dataset.c])C[el.dataset.c](el,el.dataset)});
document.addEventListener('mousemove',e=>{const el=e.target.closest&&e.target.closest('[data-tip]'),t=$('tip');if(!el){t.style.display='none';return}t.textContent=el.dataset.tip;t.style.display='block';t.style.left=Math.min(e.clientX+12,innerWidth-250)+'px';t.style.top=e.clientY+14+'px'});

function boot(){S.mode=ls.get('mode2','aka');S.br=ls.get('br','all');S.view=Object.assign(S.view,ls.get('view',{}));if(ls.get('big',false))document.body.classList.add('big');
  let sp='';try{sp=sessionStorage.getItem('sj.p')||''}catch(e){}if(/^\d{4}$/.test(sp)){pin=sp;lockUI();tryPin()}else lockUI();
  if(!(window.claude&&window.claude.use)){S.solo=true;const o=ls.get('db',null);if(o)COLS.forEach(c=>{if(Array.isArray(o[c]))S.db[c]=o[c]});S.loaded=true;render();return}
  render();Promise.all(['db','user','sample','downloads','dictation'].map(n=>window.claude.use(n).catch(()=>null))).then(([d,u,a,l,dc])=>{DB=d;USER=u;AI=a;DL=l;DICT=dc;if(DICT){try{DICT.onFinal(({text})=>{micHeard(text);DICT.stop().catch(()=>{})});DICT.onState(({state})=>{const on=state==='listening';if(S.ui.mic!==on){S.ui.mic=on;render()}})}catch(e){DICT=null}}if(DB)subscribe();else{S.solo=true;S.loaded=true}render()});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>softRender())}
