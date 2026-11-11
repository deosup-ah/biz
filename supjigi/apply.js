/* 더숲 워크룸 — 지원사업 「신청 기록」: 진행 이력 · 할 일 · 자료를 남기고 PNG · PDF · PPT 로 내보낸다.
   공개 주소에도 올라가므로 개인 연락처 · 실제 매출 · 거래처 정보는 넣지 않는다. */
const APPLY=[{
  id:'arko27',br:'aka',
  n:'2027 문학상주작가 지원사업',org:'한국문화예술위원회(아르코) · 문화체육관광부',
  who:'더숲 아카데미하우스 사유의숲 (서점)',
  due:'2026-11-13T15:00',dueTxt:'11.13.(금) 15:00 · 국가문화예술지원시스템(NCAS)',
  amt:'시설별 3,265만 원 × 2년 (상주작가 인건비 255만 원 × 9개월 · 고용부담금 · 프로그램 운영비 700만 원)',
  result:'12월 5주 결과 발표 → 1월 온라인 채용박람회 → 3월 상주작가 근무 시작',
  steps:[
    ['공고 · 양식 · FAQ 받기','11.11'],['자료 모으기 (등록증 · 사진 · 연혁 · 이용자 수)','11.11'],['신청서 초안 (공식 HWP 양식)','11.11'],
    ['[확인] 칸 채우기',''],['상주작가 창작실 사진 4장',''],['NCAS 단체회원 가입 확인 (마감일 14시 전)',''],
    ['최종 검토 (공고문 대조)',''],['NCAS 제출 (11.13 15시 전)','']],
  log:[
    ['2026-11-11 14:58','신청 시작. 마감 11.13(금) 15:00 확인'],
    ['2026-11-11 15:05','아트누리에서 공고문 · 지원신청서(다년) 양식 · FAQ 받음'],
    ['2026-11-11 15:10','자료 확인: 사업자등록증, 사유의숲 · 캠퍼스 안내물, 질의서 답변, 자원봉사 매뉴얼'],
    ['2026-11-11 15:12','받은 사실: 인물도서관 3,000여 권 · 서점 2,000여 권, 사유의숲 09–18 · 씨앗숲 10–22 연중무휴, 하루 400~500명'],
    ['2026-11-11 15:12','수혜 이력: 2026 문학나눔 서가 제작 지원(출판진흥원, 10월 설치)'],
    ['2026-11-11 15:19','개관일 2026.6.16, 면적 약 100평 반영. 언론보도(CBS노컷뉴스 6.18 재개관) 추가'],
    ['2026-11-11 15:25','공식 양식에 전 항목 작성(v2). 공간 사진 4장 · 프로그램 사진 1장 삽입. 미리보기 PDF 전달']],
  prog:[['사유의 여정 — 인물의 문장을 읽고 쓰다','월 1회 · 8회','성인 30'],['숲에서 쓰는 산문 — 걷기 · 쓰기 · 합평','2기 × 6회 · 12회','기수 15'],
        ['대화의 집 기록학교 — 아카데미하우스 60년','주 1회 · 8회','12'],['작가의 테이블 — 작가가 고른 작가','월 1회 · 6회','20'],
        ['씨앗숲 밤의 낭독회 — 신진작가 북토크','분기 + 문학주간 · 5회','40'],['찾아가는 청소년 산문 교실','6회','20']],
  genre:['2027 수필 「대화의 집, 문장의 숲」','2028 시 · 시조 「숲의 시, 시민의 낭독」'],
  budget:[['인건비 (상주작가 255만 × 9)',22950000],['고용부담금 (30만 × 9)',2700000],['일반수용비 (기록집 · 합평집 · 사례비 · 홍보 · 재료)',5800000],['국내여비',500000],['사업추진비 (간담회)',700000]],
  docs:[['공고 · 양식 (아트누리)','https://artnuri.or.kr/crawler/info/view.do?key=2301170002&encData=sUiBAI0l4sHqoD%2B2npmyDyhT8R%2FrREV1FR1b%2FnOuXSUPBZm1EJpnMlsBwvsh76BM'],
        ['신청 (NCAS)','https://www.ncas.or.kr'],['아르코 공지','https://www.arko.or.kr/board/view/4057?cid=1811390'],['상주작가 사례 (블로그)','https://blog.naver.com/arko_munhakcurator']]
}];
const apK=(a,k)=>'apply.'+a.id+'.'+k;
const apChk=a=>ls.get(apK(a,'chk'),{}),apLog=a=>a.log.concat(ls.get(apK(a,'log'),[]));
const apDone=(a,i)=>{const c=apChk(a);return c[i]!=null?c[i]:!!a.steps[i][1]};
function apLeft(a){const ms=new Date(a.due)-Date.now();if(ms<=0)return '마감';const h=Math.floor(ms/36e5);return h<48?`${h}시간 남음`:`D-${Math.ceil(ms/864e5)}`}
const apNow=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`};
function applyHTML(){const br=S.br==='all'?'aka':S.br,L=APPLY.filter(a=>a.br===br||br==='aka');if(!L.length)return '';
  return L.map(a=>{const n=a.steps.length,d=a.steps.filter((_,i)=>apDone(a,i)).length,next=a.steps.find((_,i)=>!apDone(a,i)),op=S.ui.apOpen===a.id,lg=apLog(a);
  return `<div class="card apc"><div class="aph"><span class="pill p-low">${apLeft(a)}</span><b>${esc(a.n)}</b><small>${esc(a.org)}</small></div>
  <div class="apbar" aria-label="진행 ${d}/${n}"><i style="width:${Math.round(d/n*100)}%"></i></div>
  <p class="apn">${next?`다음 · ${esc(next[0])}`:'모두 마쳤습니다'} <small>${d}/${n} · 마감 ${esc(a.dueTxt)}</small></p>
  <div class="apadd"><input id="apIn_${a.id}" placeholder="한 일 · 받은 자료를 한 줄로 남기기" autocomplete="off"><button class="btn sm pri" data-a="apAdd" data-i="${a.id}">남기기</button></div>
  <div class="btns apx"><button class="btn sm" data-a="apOut" data-i="${a.id}" data-f="png">PNG</button><button class="btn sm" data-a="apOut" data-i="${a.id}" data-f="pdf">PDF</button><button class="btn sm" data-a="apOut" data-i="${a.id}" data-f="ppt">PPT</button><button class="btn sm ghost" data-a="apTog" data-i="${a.id}">${op?'접기':'이력 · 자료 펼치기'}</button></div>
  ${op?`<div class="apd"><h4>할 일</h4><div class="list">${a.steps.map((s,i)=>`<button class="mrow" data-a="apChk" data-i="${a.id}" data-k="${i}"><span><b>${apDone(a,i)?'☑':'☐'} ${esc(s[0])}</b></span></button>`).join('')}</div>
   <h4>이력</h4><ol class="aplog">${lg.slice().reverse().map(([t,m])=>`<li><time>${esc(t.slice(5))}</time>${esc(m)}</li>`).join('')}</ol>
   <h4>내용 요약</h4><p>${a.genre.map(esc).join(' · ')}</p><ul class="apl">${a.prog.map(p=>`<li><b>${esc(p[0])}</b> <small>${esc(p[1])} · ${esc(p[2])}명</small></li>`).join('')}</ul>
   <p class="note">${esc(a.amt)}<br>${esc(a.result)}</p>
   <h4>자료</h4><div class="btns">${a.docs.map(([t,u])=>`<a class="btn sm ghost" href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join('')}</div>
   <p class="note">신청서 원본(HWP)과 연락처가 든 파일은 공개 주소에 올리지 않습니다. 담당자 컴퓨터 「다운로드\\문학상주작가2027」에 있습니다.</p></div>`:''}</div>`}).join('')}
(()=>{const f=V.store.biz;V.store.biz=()=>{const h=f(),a=applyHTML();if(!a)return h;const k=h.indexOf('</div>',h.indexOf('class="hero"'));return k<0?a+h:h.slice(0,k+6)+`<div class="sec"><h2>신청 기록</h2></div>`+a+h.slice(k+6)}})();
A.apTog=d=>{S.ui.apOpen=S.ui.apOpen===d.i?null:d.i;render()};
A.apChk=d=>{const a=APPLY.find(x=>x.id===d.i),c=apChk(a);c[d.k]=!apDone(a,+d.k);ls.set(apK(a,'chk'),c);render()};
A.apAdd=d=>{const a=APPLY.find(x=>x.id===d.i),el=document.getElementById('apIn_'+a.id),v=(el&&el.value||'').trim();if(!v){toast('남길 내용을 적어 주세요');return}const L=ls.get(apK(a,'log'),[]);L.push([apNow(),v]);ls.set(apK(a,'log'),L);toast('이력에 남겼습니다');render()};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id&&e.target.id.startsWith('apIn_')&&!e.isComposing){e.preventDefault();A.apAdd({i:e.target.id.slice(5)})}});
/* ── 내보내기: 1600×900 장표를 캔버스로 그려 PNG · PDF · PPT 로 ── */
const AP_W=1600,AP_H=900,APC={paper:'#fcfcfa',ink:'#1a1a1a',pine:'#003128',gold:'#c9a24a',brick:'#7d3a2b',mute:'#6b6b66',line:'#d9d6cc'};
function apWrap(c,t,w){const out=[];String(t).split('\n').forEach(par=>{let line='';for(const word of par.split(' ')){const tr=line?line+' '+word:word;if(c.measureText(tr).width>w&&line){out.push(line);line=word;while(c.measureText(line).width>w){let k=line.length;while(k>1&&c.measureText(line.slice(0,k)).width>w)k--;out.push(line.slice(0,k));line=line.slice(k)}}else line=tr}out.push(line)});return out}
function apText(c,t,x,y,w,size,weight,color,lh){c.font=`${weight} ${size}px Pretendard,"Malgun Gothic","Apple SD Gothic Neo",sans-serif`;c.fillStyle=color;const L=apWrap(c,t,w);L.forEach((l,i)=>c.fillText(l,x,y+i*(lh||size*1.45)));return y+L.length*(lh||size*1.45)}
function apFrame(c,a,title,no,tot){c.fillStyle=APC.paper;c.fillRect(0,0,AP_W,AP_H);c.fillStyle=APC.pine;c.fillRect(0,0,AP_W,14);c.fillStyle=APC.ink;c.fillRect(80,150,AP_W-160,5);
  apText(c,a.n,80,72,1000,24,600,APC.mute);apText(c,title,80,128,1300,46,800,APC.ink);apText(c,`${no} / ${tot}`,AP_W-180,72,120,22,500,APC.mute);
  c.fillStyle=APC.mute;c.font='400 18px Pretendard,"Malgun Gothic",sans-serif';c.fillText('Planned by 쿼부장',AP_W-240,AP_H-36);c.fillText(a.who,80,AP_H-36)}
function apSlides(a){const lg=apLog(a),tot=6,S2=[];
  S2.push(c=>{c.fillStyle=APC.pine;c.fillRect(0,0,AP_W,AP_H);c.fillStyle=APC.gold;c.fillRect(0,AP_H-120,AP_W,120);
    apText(c,'신청 기록',100,150,1200,30,500,'#e9e4d4');apText(c,a.n,100,260,1400,76,800,'#fcfcfa',96);
    apText(c,a.who,100,450,1400,34,600,'#fcfcfa');apText(c,a.org,100,505,1400,26,400,'#cfd8d4');
    apText(c,`마감 ${a.dueTxt}  ·  ${apLeft(a)}`,100,AP_H-50,1400,32,700,APC.pine);
    c.font='400 18px Pretendard,"Malgun Gothic",sans-serif';c.fillStyle='#cfd8d4';c.fillText('Planned by 쿼부장',AP_W-240,AP_H-150)});
  S2.push(c=>{apFrame(c,a,'할 일과 진행',2,tot);const n=a.steps.length,d=a.steps.filter((_,i)=>apDone(a,i)).length;
    c.fillStyle=APC.line;c.fillRect(80,200,AP_W-160,18);c.fillStyle=APC.gold;c.fillRect(80,200,(AP_W-160)*d/n,18);apText(c,`${d} / ${n} 완료`,80,260,600,26,700,APC.ink);
    a.steps.forEach((s,i)=>{const y=330+i*62,ok=apDone(a,i);c.fillStyle=ok?APC.pine:'#fff';c.strokeStyle=APC.pine;c.lineWidth=3;c.fillRect(90,y-26,30,30);c.strokeRect(90,y-26,30,30);
      if(ok){c.strokeStyle='#fff';c.beginPath();c.moveTo(97,y-11);c.lineTo(103,y-4);c.lineTo(114,y-19);c.stroke()}apText(c,s[0],145,y,1100,28,ok?500:700,ok?APC.mute:APC.ink);if(s[1])apText(c,s[1],AP_W-260,y,180,24,500,APC.mute)})});
  S2.push(c=>{apFrame(c,a,'진행 이력',3,tot);let y=220;const L=lg.slice(-11);L.forEach(([t,m])=>{if(y>AP_H-90)return;c.fillStyle=APC.gold;c.fillRect(80,y-22,8,28);apText(c,t.slice(5),104,y,200,22,700,APC.pine);y=apText(c,m,300,y,AP_W-400,24,500,APC.ink,34)+18})});
  S2.push(c=>{apFrame(c,a,'2027 프로그램 6종 · 총 45회',4,tot);apText(c,a.genre.join('   ·   '),80,205,1440,24,600,APC.brick);
    a.prog.forEach((p,i)=>{const col=i%2,row=(i/2|0),x=80+col*730,y=250+row*190;c.fillStyle='#fff';c.fillRect(x,y,700,170);c.fillStyle=[APC.pine,APC.gold,APC.brick][row];c.fillRect(x,y,700,10);
      apText(c,String(i+1).padStart(2,'0'),x+24,y+62,80,34,800,APC.mute);apText(c,p[0],x+100,y+60,570,28,700,APC.ink,38);apText(c,`${p[1]} · ${p[2]}명`,x+100,y+142,560,22,500,APC.mute)})});
  S2.push(c=>{apFrame(c,a,'예산 (1년차, 원)',5,tot);const tot2=a.budget.reduce((s,b)=>s+b[1],0);let x=80;const cols=[APC.pine,'#2f5a52',APC.gold,APC.brick,'#555'];
    a.budget.forEach((b,i)=>{const w=(AP_W-160)*b[1]/tot2;c.fillStyle=cols[i];c.fillRect(x,220,Math.max(w-4,2),70);x+=w});
    a.budget.forEach((b,i)=>{const y=370+i*70;c.fillStyle=cols[i];c.fillRect(80,y-24,26,26);apText(c,b[0],125,y,1000,28,600,APC.ink);c.font='700 28px Pretendard,"Malgun Gothic",sans-serif';c.fillStyle=APC.ink;const t=b[1].toLocaleString();c.fillText(t,AP_W-80-c.measureText(t).width,y)});
    c.fillStyle=APC.ink;c.fillRect(80,AP_H-150,AP_W-160,3);apText(c,'합계',80,AP_H-100,300,32,800,APC.ink);c.font='800 34px Pretendard,"Malgun Gothic",sans-serif';const tt=tot2.toLocaleString();c.fillText(tt,AP_W-80-c.measureText(tt).width,AP_H-100)});
  S2.push(c=>{apFrame(c,a,'일정과 자료',6,tot);let y=230;y=apText(c,a.amt,80,y,1440,28,600,APC.ink,40)+20;y=apText(c,a.result,80,y,1440,28,600,APC.pine,40)+40;
    a.docs.forEach(([t,u])=>{apText(c,t,80,y,420,26,700,APC.ink);y=apText(c,u.length>90?u.slice(0,88)+'…':u,500,y,1020,20,400,APC.mute,30)+22});
    apText(c,'신청서 원본(HWP)과 연락처가 든 파일은 공개 주소에 올리지 않습니다.',80,AP_H-90,1440,22,500,APC.brick)});
  return S2}
async function apCanvases(a){try{if(document.fonts){await Promise.all(['800 30px Pretendard','700 30px Pretendard','600 30px Pretendard','500 30px Pretendard','400 30px Pretendard'].map(f=>document.fonts.load(f,'가')))}}catch(e){}
  return apSlides(a).map(fn=>{const cv=document.createElement('canvas');cv.width=AP_W;cv.height=AP_H;const c=cv.getContext('2d');c.textBaseline='alphabetic';fn(c);return cv})}
function apLoad(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
A.apOut=async d=>{const a=APPLY.find(x=>x.id===d.i),f=d.f,base=`${a.n.replace(/\s+/g,'_')}_신청기록_${TODAY}`;toast('만드는 중…');const cvs=await apCanvases(a);
  if(f==='png'){for(let i=0;i<cvs.length;i++){const b=await new Promise(r=>cvs[i].toBlob(r,'image/png'));await saveFile(`${base}_${i+1}.png`,b)}toast(`PNG ${cvs.length}장을 받았습니다`);return}
  if(f==='pdf'){const J=window.jspdf&&window.jspdf.jsPDF;if(!J){toast('PDF 도구를 불러오지 못했습니다. PNG 로 받아 주세요.');return}const doc=new J({orientation:'landscape',unit:'px',format:[AP_W,AP_H],hotfixes:['px_scaling']});
    cvs.forEach((cv,i)=>{if(i)doc.addPage([AP_W,AP_H],'landscape');doc.addImage(cv.toDataURL('image/jpeg',0.92),'JPEG',0,0,AP_W,AP_H)});await saveFile(base+'.pdf',doc.output('blob'));toast('PDF 를 받았습니다');return}
  if(f==='ppt'){if(!window.PptxGenJS){try{await apLoad('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js')}catch(e){try{await apLoad('https://cdnjs.cloudflare.com/ajax/libs/pptxgenjs/3.12.0/pptxgen.bundle.js')}catch(e2){}}}
    if(!window.PptxGenJS){toast('PPT 도구를 불러오지 못했습니다. PDF 나 PNG 로 받아 주세요.');return}
    const p=new PptxGenJS();p.layout='LAYOUT_WIDE';p.title=a.n+' 신청 기록';const lg=apLog(a);
    cvs.forEach((cv,i)=>{const s=p.addSlide();s.addImage({data:cv.toDataURL('image/png'),x:0,y:0,w:13.333,h:7.5});
      if(i===2)s.addNotes(lg.map(([t,m])=>t+' '+m).join('\n'));if(i===3)s.addNotes(a.prog.map(x=>x.join(' · ')).join('\n'))});
    const b=await p.write({outputType:'blob'});await saveFile(base+'.pptx',b);toast('PPT 를 받았습니다');return}};
