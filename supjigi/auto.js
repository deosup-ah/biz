/* 숲지기 — 자동 요약 · 예측 · 책모임 · 지원사업 */
/* ── 매출 자동 요약과 다음 달 예상 ── */
function autoSum(br){const all=yms(),nowYm=TODAY.slice(0,7),full=all.filter(y=>y<nowYm);if(full.length<2)return null;
  const A=y=>agg(br,[y]),last=full[full.length-1],prev=full[full.length-2],a=A(last),p=A(prev),ly=y=>(+y.slice(0,4)-1)+y.slice(4),L=[],pct=(x,y)=>y?Math.round((x-y)/y*100):0,mN=y=>+y.slice(5)+'월';
  const d=pct(a.amt,p.amt);L.push(`${mN(last)} 책 매출 ${won(a.amt)}원 · ${a.qty}권. ${mN(prev)}보다 <b>${d>=0?'+':''}${d}%</b>.`);
  if(all.includes(ly(last))){const y=A(ly(last));if(y.amt){const dy=pct(a.amt,y.amt);L.push(`지난해 ${mN(last)}보다 ${dy>=0?'+':''}${dy}%.`)}}
  const gd=GR.map(g=>({g,d:((a.cats[g]||{}).amt||0)-((p.cats[g]||{}).amt||0)})).sort((x,y)=>Math.abs(y.d)-Math.abs(x.d))[0];if(gd&&gd.d)L.push(`가장 크게 움직인 분야는 <b>${gd.g}</b> (${gd.d>0?'+':'−'}${won(Math.abs(gd.d))}원).`);
  const dw=a.dow.map((v,i)=>({i,v:a.dowN[i]?v/a.dowN[i]:0})).sort((x,y)=>y.v-x.v);if(dw[0].v)L.push(`잘 팔리는 요일은 <b>${WD[dw[0].i]}요일</b>, 조용한 요일은 ${WD[dw[dw.length-1].i]}요일.`);
  /* 예상: 최근 석 달 평균 × 지난해 같은 달의 계절 비율(자료가 있을 때만) */
  const l3=full.slice(-3),base=l3.reduce((s,y)=>s+A(y).amt,0)/l3.length;let k=1,how='최근 석 달 평균';const ty=ly(nowYm),l3y=l3.map(ly);
  if(all.includes(ty)&&l3y.every(y=>all.includes(y))){const by=l3y.reduce((s,y)=>s+A(y).amt,0)/3,t=A(ty).amt;if(by>0&&t>0){k=Math.max(.6,Math.min(1.6,t/by));how='최근 석 달 평균 × 지난해 같은 달 흐름'}}
  const fc=base*k;let pace=null;if(all.includes(nowYm)){const c=A(nowYm),day=+TODAY.slice(8)-1,dim=new Date(+TODAY.slice(0,4),+TODAY.slice(5,7),0).getDate();if(day>=5&&c.amt)pace={amt:c.amt,proj:c.amt/day*dim,day}}
  return{L,fc,how,pace,m:mN(nowYm),last:a}}
function autoCard(br){const R=autoSum(br);if(!R)return '';return `<div class="card auto"><div><small>${brN(br)} · 자동 요약</small><ul>${R.L.map(l=>`<li>${l}</li>`).join('')}</ul></div>
  <div class="fc"><small>${R.m} 예상</small><b>${won(Math.round(R.fc/10000))}만원</b><span>${won(Math.round(R.fc*.85/10000))}~${won(Math.round(R.fc*1.15/10000))}만원 사이</span>${R.pace?`<span>지금 속도로는 ${won(Math.round(R.pace.proj/10000))}만원 (${R.pace.day}일치 ${won(R.pace.amt)}원)</span>`:''}<em>${R.how}으로 어림한 값입니다</em></div></div>`}
(()=>{const f=V.store.ana;V.store.ana=()=>{let c='';try{c=autoCard(S.br)}catch(e){}return c+f()}})();

/* ── 책모임 ── */
const CLQ=['가장 오래 머문 문장을 하나 읽어 주세요.','읽기 전과 읽은 뒤, 달라진 생각이 있나요?','이 책을 건네고 싶은 사람이 있다면 누구인가요?'];
const CLFLOW=[[10,'인사 · 한 줄 소개'],[15,'머문 문장 돌아가며 읽기'],[40,'이야기 나누기 (질문 세 가지)'],[15,'곁에 두고 읽을 책 소개'],[10,'마무리 · 다음 모임 알림']];
function clDate(n){const d=pd(TODAY);d.setDate(d.getDate()+14+n*7);while(d.getDay()!==4)d.setDate(d.getDate()+1);return dstr(d)}
function clubs(br){const C=corners(br).time.slice(0,3),N=S.ui.clN||8;return C.map((t,i)=>{const bs=t.books||[],bi=(S.ui['clb'+i]||0)%Math.max(1,bs.length),b=bs[bi]||{},it=items(br).find(x=>nt(x.t)===nt(b.t))||{},stock=it.stock||0;
    return{i,t,b,it,N,date:clDate(i),time:'19:30',lack:Math.max(0,N-stock),stock,title:`${t.title.replace(/[,.]\s*$/,'')} — 『${b.t||''}』 함께 읽기`}}).filter(c=>c.b.t)}
function clNotice(br,c){return `[${BP(br)}${BRAND[br]} 책모임]\n${c.t.title}\n\n함께 읽을 책: 『${c.b.t}』${c.b.a?' ('+c.b.a+')':''}\n때: ${mdw(c.date)} ${c.time} · 90분\n곳: ${BP(br)}${BRAND[br]}\n인원: ${c.N}명 (선착순)\n\n${c.t.hook||''}\n책은 매장에서 미리 살 수 있습니다. 다 읽지 않아도 괜찮습니다.\n신청: 매장 또는 메시지로`}
V.store.club=()=>{const br=S.br;if(br==='all')return `<div class="hero"><p>책모임</p><h2>지점 선택</h2></div><div class="grid g4">${BR.map(b=>`<button class="card pick" data-a="br" data-k="${b.k}" style="border-top:4px solid ${b.c}"><b>${NM(b.k)?'노원문고 ':''}${BRAND[b.k]}</b><small>${b.n}</small></button>`).join('')}</div>`;
  const L=clubs(br),up=S.db.events.filter(e=>(e.date||'')>=TODAY&&/책모임|북토크/.test(e.kind||'')).sort((a,b)=>a.date<b.date?-1:1);
  return `<div class="hero"><p>${BRAND[br]} · 지금 큐레이션에서 바로 만든 모임 안</p><h2>책모임 기획안</h2></div>
  <div class="chips" style="margin-bottom:14px"><span class="note">인원</span>${[6,8,12].map(n=>`<button class="chip" data-a="clN" data-v="${n}" aria-pressed="${(S.ui.clN||8)===n}">${n}명</button>`).join('')}</div>
  <div class="grid g3" style="align-items:start">${L.map(c=>`<div class="card pcard"><div class="phead">${symSVG(c.t.sym,c.t.bpal)}<div><h3>${esc(c.t.title)}</h3><p>${mdw(c.date)} ${c.time} · 90분 · ${c.N}명</p></div></div>
    <div class="li" style="padding:0"><div class="t"><b>『${esc(c.b.t||'')}』</b><small>${esc([c.b.a,c.b.p].filter(Boolean).join(' · '))} · 재고 ${c.stock}권${c.lack?` · <b style="color:var(--warn)">${c.lack}권 모자람</b>`:''}</small></div>${(c.t.books||[]).length>1?`<button class="btn sm ghost" data-a="clB" data-i="${c.i}">다른 책</button>`:''}</div>
    <details class="fold" style="margin:0"><summary>진행 순서 · 질문</summary><ol class="steps" style="margin-top:10px">${CLFLOW.map(([m,t])=>`<li><span><b>${m}분</b> ${t}</span></li>`).join('')}</ol><ul style="margin:12px 0 0;padding-left:18px;display:grid;gap:4px">${CLQ.map(q=>`<li>${q}</li>`).join('')}</ul></details>
    <div class="btns"><button class="btn pri" data-a="clSave" data-i="${c.i}">일정 등록</button><button class="btn" data-a="clCopy" data-i="${c.i}">공지 복사</button>
     <details class="menu"><summary>기타</summary><div><button data-a="clPop" data-i="${c.i}">안내 POP 만들기</button>${c.lack?`<button data-a="clOrder" data-i="${c.i}">모자란 ${c.lack}권 주문에 담기</button>`:''}<button data-a="clSheet" data-i="${c.i}">진행표 복사</button></div></details></div></div>`).join('')||'<div class="card empty">지금 큐레이션 제안이 없습니다.</div>'}</div>
  <div class="card" style="margin-top:16px"><h3>잡힌 모임 <small>${up.length}건</small></h3>${up.length?`<div class="list">${up.slice(0,8).map(e=>`<div class="li"><span class="pill p-info">${dday(e.date)}</span><div class="t"><b>${esc(e.title)}</b><small>${mdw(e.date)} ${esc(e.time||'')} · ${esc(e.place||'')}${e.cap?` · ${e.booked||0}/${e.cap}명`:''}</small></div><button class="btn sm ghost" data-a="del" data-col="events" data-id="${e.id}">지우기</button></div>`).join('')}</div>`:'<div class="empty">아직 없습니다. 위에서 「일정 등록」를 누르면 여기에 모입니다.</div>'}</div>`};
const clGet=d=>clubs(S.br).find(c=>c.i===+d.i);
A.clN=d=>{S.ui.clN=+d.v;render()};A.clB=d=>{S.ui['clb'+d.i]=(S.ui['clb'+d.i]||0)+1;render()};
A.clSave=d=>{const c=clGet(d),br=S.br;if(S.db.events.some(e=>e.title===c.title&&e.date===c.date)){toast('이미 일정에 있습니다');return}put('events',nid(),{kind:'책모임',title:c.title,date:c.date,time:c.time,place:BP(br)+BRAND[br],cap:c.N,booked:0,memo:`${c.t.hook||''}\n진행: ${CLFLOW.map(([m,t])=>`${m}분 ${t}`).join(' / ')}`,br,at:new Date().toISOString()},true);toast(`${mdw(c.date)} 일정에 넣었습니다`)};
A.clCopy=d=>copyText(clNotice(S.br,clGet(d)));
A.clSheet=d=>{const c=clGet(d);copyText(`${c.title}\n${mdw(c.date)} ${c.time} · ${c.N}명\n\n[진행 순서]\n${CLFLOW.map(([m,t])=>`${m}분  ${t}`).join('\n')}\n\n[질문]\n${CLQ.map((q,i)=>`${i+1}. ${q}`).join('\n')}\n\n[준비]\n책 ${c.N}권 (재고 ${c.stock}권) · 이름표 · 따뜻한 차 · 다음 모임 안내`)};
A.clOrder=d=>{const c=clGet(d);if(addCart(S.br,{t:c.b.t,a:c.b.a,p:c.b.p,isbn:c.it.isbn||c.b.isbn,price:c.it.price||c.b.price},c.lack,'책모임 '+mdw(c.date)))toast(`${c.lack}권을 북센 주문에 담았습니다`)};
A.clPop=d=>{const c=clGet(d),D=mkD({...c.t,br:S.br,books:[c.b]},'pop');D.head='함께 읽어요\n'+c.t.title.replace(/[,.]\s*$/,'');D.body=`${mdw(c.date)} ${c.time} · ${BP(S.br)}${BRAND[S.br]} · 90분. 다 읽지 않아도 괜찮습니다.`;D.badge=`선착순 ${c.N}명`;D.st=3;S.ui.D=D;S.ui.dT=null;S.ui.dlog=[];S.view.store='design';window.scrollTo(0,0);render()};
A.del=d=>del(d.col||d.c,d.id);

/* ── 지원사업 (2026년 공고를 기준으로 한 달력. 내년 날짜는 공고로 확인) ── */
const BIZ=[
 {n:'서울형책방',org:'서울도서관',m:2,when:'2026년 모집 2.24~3.10',amt:'70곳 선정',who:['aka','choso','nowon','nmain','njung'],fit:'서점 공간에서 여는 독서 문화 프로그램',url:'https://news.seoul.go.kr/culture/?p=531646'},
 {n:'문화요일수요일 × 심야책방 (상반기)',org:'문체부 · 출판진흥원 · 한국서련',m:3,when:'2026년 4월 말 70곳 선정',amt:'70곳',who:['aka','choso','sojeon','nowon','nmain','njung'],fit:'수요일 저녁 서점 프로그램',url:'https://www.mcst.go.kr/site/s_notice/press/pressView.jsp?pSeq=22388'},
 {n:'사회문화시설 활용 인문 프로그램',org:'문체부',m:4,when:'2026년 4월 공모',amt:'전국 1,200개 프로그램 · 115억 원 규모',who:['aka','choso','sojeon','nowon','nmain','njung'],fit:'지역서점이 지원 시설에 들어감. 인문 강연 · 읽기 모임',url:'https://newsseoul.co.kr/news/view/1065580823034041'},
 {n:'인생독서 × 인생서점',org:'문체부 · 출판진흥원 · 한국서련',m:4,when:'2026년 5~10월 운영',amt:'200곳 · 서점당 최대 600만 원',who:['aka','choso','sojeon','nowon','nmain','njung'],fit:'생애주기별 독서 문화 활동',url:'https://www.heraldk.com/article/2026051115174660723'},
 {n:'지역인문실천 프로젝트',org:'문체부 · 문화예술교육진흥원',m:5,when:'2026년 5.13~6.5 공모',amt:'10개 단체 · 1억 2천만~2억 원',who:['aka'],fit:'지역 문제를 인문 활동으로 푸는 기관 단위 사업',url:'https://www.heraldk.com/article/2026051215220561322'},
 {n:'문화요일수요일 × 심야책방 (하반기)',org:'문체부 · 출판진흥원 · 한국서련',m:7,when:'2026년 7월 공모 · 8.5 시작',amt:'70곳',who:['aka','choso','sojeon','nowon','nmain','njung'],fit:'수요일 저녁 서점 프로그램',url:'https://newsseoul.co.kr/news/view/1065579022893737'}];
function bizNext(b){const y=+TODAY.slice(0,4),m=+TODAY.slice(5,7),ny=b.m>=m?y:y+1,d=`${ny}-${String(b.m).padStart(2,'0')}-01`;return{d,left:dayDiff(d,TODAY)}}
function biz초안(br,b){const P=profile(br),C=corners(br).time.slice(0,3),cl=clubs(br);return `[${b.n} 신청서 초안 — ${BP(br)}${BRAND[br]}]\n\n1. 서점 소개\n${BP(br)}${BRAND[br]}. 잘 나가는 분야는 ${P.order[0]}(${Math.round(P.sh[P.order[0]]*100)}%) · ${P.order[1]}(${Math.round(P.sh[P.order[1]]*100)}%).\n\n2. 프로그램 이름(안)\n${C.map(t=>'- '+t.title).join('\n')}\n\n3. 취지\n${C[0]?C[0].hook:''}\n책을 사는 곳에서 함께 읽는 곳으로. 동네 주민이 한 달에 한 번 같은 책을 읽고 이야기합니다.\n\n4. 회차(안)\n${cl.map((c,i)=>`${i+1}회 ${mdw(c.date)} ${c.time} — 『${c.b.t}』 (${c.N}명, 90분)`).join('\n')}\n\n5. 진행 방식\n${CLFLOW.map(([m,t])=>`${m}분 ${t}`).join(' / ')}\n\n6. 예산 항목(금액은 공고의 기준에 맞춰 채우기)\n진행자 사례비 · 도서 구입 · 홍보물(POP · 포스터) · 다과\n\n※ 날짜 · 금액 · 자격은 올해 공고문으로 다시 확인해 주세요.`}
V.store.biz=()=>{const br=S.br==='all'?'aka':S.br,L=BIZ.map(b=>({...b,...bizNext(b)})).sort((a,b)=>a.left-b.left);
  return `<div class="hero"><p>${BRAND[br]} · 2026년 공고를 기준으로 한 달력</p><h2>지원사업 일정</h2></div>
  <div class="grid" style="gap:12px">${L.map(b=>{const ok=b.who.includes(br),i=BIZ.findIndex(x=>x.n===b.n);return `<div class="card" style="${ok?'':'opacity:.6'}"><div class="li" style="padding:0;align-items:flex-start"><span class="pill ${b.left<=60?'p-low':'p-mute'}">${b.left<=0?'이번 달':b.left<=60?'곧 · '+b.m+'월':b.m+'월 무렵'}</span><div class="t"><b>${esc(b.n)}</b><small style="display:block">${esc(b.org)} · ${esc(b.when)} · ${esc(b.amt)}</small><small style="display:block">${esc(b.fit)}${ok?'':' · 이 지점은 대상 지역이 아닐 수 있습니다'}</small></div></div>
   <div class="btns" style="margin-top:12px"><button class="btn pri sm" data-a="bizCopy" data-i="${i}">신청서 초안 복사</button><button class="btn sm" data-a="bizEv" data-i="${i}">알림 일정 등록</button><a class="btn sm ghost" href="${b.url}" target="_blank" rel="noopener">2026년 공고 보기</a></div></div>`}).join('')}</div>
  <p class="note" style="margin-top:12px">날짜와 금액은 2026년 공고 · 보도에서 가져왔습니다(11/10 확인). 내년 일정은 달라질 수 있으니 「알림」을 넣어 두고 그때 공고를 확인하세요. 신청서 초안 는 이 지점의 판매 성격 · 지금 큐레이션 · 책모임 안으로 채웁니다.</p>`};
A.bizCopy=d=>copyText(biz초안(S.br==='all'?'aka':S.br,BIZ[+d.i]));
A.bizEv=d=>{const b=BIZ[+d.i],n=bizNext(b),t=`[지원사업] ${b.n} 공고 확인`;if(S.db.events.some(e=>e.title===t&&e.date===n.d)){toast('이미 일정에 있습니다');return}put('events',nid(),{kind:'기타',title:t,date:n.d,time:'',place:'',memo:`${b.org} · ${b.when} · ${b.url}`,at:new Date().toISOString()},true);toast(`${n.d} 알림을 일정에 넣었습니다`)};
