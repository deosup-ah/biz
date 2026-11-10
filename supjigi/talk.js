/* 더숲 워크룸 — 북토크: 기획 → 준비 → 당일 진행 → 뒤처리를 한 화면에서 */



const tkT=(t,m)=>{const [h,mi]=(t||'19:30').split(':').map(Number),x=((h*60+mi+m)%1440+1440)%1440;return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0')};
const tkAll=()=>S.db.events.filter(e=>e.kind==='북토크').sort((a,b)=>(a.date||'')<(b.date||'')?-1:1);
const tkCur=()=>{const L=tkAll(),up=L.filter(e=>e.date>=TODAY);return L.find(e=>e.id===S.ui.tk)||up[0]||L[L.length-1]||null};
const tkSave=(e,p)=>{const {id,...d}=e;put('events',id,{...d,...p})};
A.tkNew=()=>{const v=id=>($(id)||{}).value?$(id).value.trim():'',book=v('tkB'),au=v('tkA'),w=qParse((v('tkW')||'')+' 북토크')||{};if(!book&&!au){toast('책 이름이나 저자를 적어 주세요');return}
  const id=nid(),doc={kind:'북토크',title:[au,book?`『${book}』`:''].filter(Boolean).join(' ')+' 북토크',book,author:au,date:w.date||addDays(TODAY,28),time:w.time||'19:30',place:w.place||((w.title||'').replace(/북토크/,'').trim()),chk:{},at:new Date().toISOString()};if(w.booked!=null)doc.cap=w.booked;S.ui.tk=id;put('events',id,doc);toast(`${mdw(doc.date)} ${doc.time} 북토크를 만들었습니다`)};
A.tkPick=d=>{S.ui.tk=d.id;render()};
A.tkChk=d=>{const e=tkCur();if(!e)return;const c={...(e.chk||{})};c[d.k]=!c[d.k];tkSave(e,{chk:c})};
A.tkBk=d=>{const e=tkCur();if(!e)return;tkSave(e,{booked:Math.max(0,(e.booked||0)+(+d.n))})};
A.tkDo=d=>{const e=tkCur();if(!e)return;const go=()=>{S.view.aka='design';S.mode='aka';window.scrollTo(0,0)};
  if(d.t==='pop'){go();A.akaTpl({t:'ev',id:e.id})}else if(d.t==='wel'){go();A.akaTpl({t:'group'});A.sgEv({id:e.id})}else if(d.t==='ig'){A.igFrom({id:e.id})}
  else if(d.t==='dp'||d.t==='order'){S.mode='store';if(S.br==='all')S.br='aka';try{sessionStorage.setItem('sj.mode','store')}catch(x){}A.ideaGo({v:[e.author,e.book].filter(Boolean).join(' ')||e.title})}
  else if(d.t==='q'){const t=tkQ(e).map((q,i)=>`${i+1}. ${q}`).join('\n');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('질문 8개를 복사했습니다')).catch(()=>toast('복사하지 못했습니다. 아래 질문을 길게 눌러 복사해 주세요.'))}
  else if(d.t==='cue')A.tkPrint()};
A.tkPrint=()=>{const e=tkCur();if(!e)return;let p=$('printArea');if(!p){p=document.createElement('div');p.id='printArea';document.body.appendChild(p)}
  p.innerHTML=`<div style="font-family:Pretendard,sans-serif;color:#111"><p style="font-size:11pt;color:#666;margin:0 0 4pt">더숲 북토크 진행표</p><h1 style="font-size:22pt;margin:0 0 4pt;font-weight:800">${esc(e.title)}</h1><p style="font-size:12pt;margin:0 0 14pt">${mdw(e.date)} ${esc(e.time||'')} · ${esc(e.place||'')}${e.cap?` · 정원 ${e.cap}명`:''}</p>
  <table style="width:100%;border-collapse:collapse;font-size:12pt">${TKC.map(([m,t,l])=>`<tr><td style="border-top:1px solid #999;padding:7pt 0;width:52pt;font-weight:700">${tkT(e.time,m)}</td><td style="border-top:1px solid #999;padding:7pt 0">${t}</td><td style="border-top:1px solid #999;padding:7pt 0;width:44pt;color:#666;text-align:right">${l}</td><td style="border-top:1px solid #999;width:90pt"></td></tr>`).join('')}</table>
  <h2 style="font-size:13pt;margin:18pt 0 6pt">사회자 질문</h2><ol style="font-size:11.5pt;line-height:1.75;margin:0;padding-left:16pt">${tkQ(e).map(q=>`<li>${esc(q)}</li>`).join('')}</ol>
  <p style="font-size:10.5pt;color:#666;margin-top:16pt">판매 ____권 · 참석 ____명 · 메모 ______________________________</p></div>`;const t=document.title;document.title='북토크 진행표 '+e.date;window.print();setTimeout(()=>{document.title=t},500)};
V.aka.talk=()=>{const L=tkAll().filter(e=>e.date>=addDays(TODAY,-7)),e=tkCur(),form=`<div class="card qadd tkf"><div class="tkr"><input type="text" id="tkA" placeholder="저자" autocomplete="off"><input type="text" id="tkB" placeholder="책 이름" autocomplete="off"><input type="text" id="tkW" placeholder="12/5 7시 30명 대화의 집" autocomplete="off"><button class="btn pri" data-a="tkNew">북토크 만들기</button></div><small class="note">세 칸만 적으면 준비 일정 · 당일 진행표 · 질문지가 함께 만들어집니다. 날짜를 비우면 4주 뒤로 잡습니다.</small></div>`;
  if(!e)return `<div class="hero"><h2>북토크</h2></div>${form}<div class="card"><div class="empty">아직 잡힌 북토크가 없습니다.</div></div>`;
  const dd=dayDiff(e.date,TODAY),c=e.chk||{},nx=TKP.map(([o,t,a],i)=>({i,o,t,a,d:addDays(e.date,o)})),todo=nx.filter(x=>!c['p'+x.i]),late=todo.filter(x=>x.d<TODAY).length,r=e.cap?Math.round((e.booked||0)/e.cap*100):null,AB={pop:'포스터',order:'주문 담기',ig:'인스타 초안',q:'질문 복사',dp:'평대 만들기',cue:'진행표 인쇄'};
  return `<div class="hero"><h2>${dd>=0?(dd===0?'오늘':'D-'+dd):'지난'} · ${esc(e.title)}</h2></div>
  ${L.length>1?`<div class="chips" style="margin-bottom:12px">${L.map(x=>`<button class="chip" data-a="tkPick" data-id="${x.id}" aria-pressed="${x.id===e.id}">${mdw(x.date)} ${esc(x.author||x.title)}</button>`).join('')}</div>`:''}
  <div class="card tkh"><div><b>${mdw(e.date)} ${esc(e.time||'')}</b><small>${esc(e.place||'장소 미정')}${e.cap?` · 정원 ${e.cap}명`:''}</small></div><div class="tkb"><span class="note">예약</span><span class="qq"><button data-a="tkBk" data-n="-1" aria-label="줄이기">−</button><b>${e.booked||0}</b><button data-a="tkBk" data-n="1" aria-label="늘리기">+</button></span>${r!=null?`<span class="pill ${r>=70?'p-ok':dd<=10&&r<30?'p-low':'p-mute'}">${r}%</span>`:''}<button class="btn sm" data-a="evEdit" data-id="${e.id}">수정</button></div></div>
  <div class="grid g2" style="align-items:start"><div class="card"><h3>준비 <small>${todo.length?`남은 일 ${todo.length}${late?` · 늦은 일 ${late}`:''}`:'모두 끝'}</small></h3><div class="list">${nx.map(x=>`<div class="li tkl ${c['p'+x.i]?'done':''}"><button class="tkc" data-a="tkChk" data-k="p${x.i}" aria-pressed="${!!c['p'+x.i]}" aria-label="끝냄"></button><div class="t"><b>${x.t}</b><small class="${!c['p'+x.i]&&x.d<TODAY?'late':''}">${mdw(x.d)} · ${x.o===0?'당일':x.o<0?'D'+x.o:'다음 날'}</small></div>${x.a?`<button class="btn sm" data-a="tkDo" data-t="${x.a}">${AB[x.a]}</button>`:''}</div>`).join('')}</div></div>
   <div class="card"><h3>당일 진행표 <button class="btn sm" style="margin-left:auto" data-a="tkPrint">인쇄</button></h3><div class="list">${TKC.map(([m,t,l])=>`<div class="li"><span class="qt">${tkT(e.time,m)}</span><div class="t"><b>${t}</b></div>${l?`<small class="note">${l}</small>`:''}</div>`).join('')}</div>
    <div class="btns" style="margin-top:12px"><button class="btn" data-a="tkDo" data-t="wel">환영판</button><button class="btn" data-a="tkDo" data-t="pop">포스터</button><button class="btn" data-a="tkDo" data-t="ig">인스타 초안</button></div></div></div>
  <details class="fold"><summary>사회자 질문 8개</summary><ol class="tkq">${tkQ(e).map(q=>`<li>${esc(q)}</li>`).join('')}</ol><div class="btns"><button class="btn" data-a="tkDo" data-t="q">복사</button></div></details>
  <details class="fold"><summary>새 북토크</summary>${form}</details>`};
