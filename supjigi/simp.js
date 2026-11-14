/* 첫 화면 단순화(참부장 11/14 승인 · 빼기 1): 큐레이션은 넷만 먼저, 나머지는 「더 보기」. 인물도서관 한 권 코너는 접어 둔다 */
afterRender(()=>{Promise.resolve().then(()=>{try{const mn=document.querySelector('main');if(!mn||S.locked||S.mode!=='store'||S.view.store!=='cur')return;
  const w=mn.querySelector(':scope>.wall');if(w&&!S.ui.wallAll){const C=[...w.children].filter(e=>e.nodeType===1&&!e.classList.contains('wmore'));if(C.length>4&&!mn.querySelector('.wmore')){C.slice(4).forEach(e=>e.hidden=true);const b=document.createElement('button');b.type='button';b.className='btn wmore';b.textContent=`큐레이션 ${C.length-4}개 더 보기`;b.onclick=()=>{S.ui.wallAll=1;render()};w.after(b)}}
  const o=mn.querySelector('.pl3ones');if(o&&o.tagName!=='DETAILS'){const d=document.createElement('details');d.className='pl3ones';const h=o.querySelector('h3');d.innerHTML=`<summary>${h?h.textContent:'인물도서관 코너'}</summary>`;if(h)h.remove();while(o.firstChild)d.appendChild(o.firstChild);o.replaceWith(d)}
}catch(e){}})});
/* 큐레이션 카드를 열면 한 화면으로 띄우고, 맨 위에 「← 큐레이션」(참부장 11/14) */
A.cClose=()=>{const i=S.ui.cOpen;S.ui.cOpen=null;render();setTimeout(()=>{const b=document.querySelector(`.wall [data-a="cOpen"][data-i="${i}"]`);if(b)b.scrollIntoView({block:'center'})},30)};
afterRender(()=>{Promise.resolve().then(()=>{try{const mn=document.querySelector('main');document.body.classList.remove('cvon');if(!mn||S.mode!=='store'||S.view.store!=='cur'||S.ui.cOpen==null)return;
  const h=mn.querySelector('.cvhost');if(!h||!h.querySelector('.pcard.on'))return;h.classList.add('cvlayer');document.body.classList.add('cvon');
  if(!h.querySelector('.cvbar')){const t=(S.ui.cor||[])[S.ui.cOpen]||{};const b=document.createElement('div');b.className='cvbar';b.innerHTML=`<button type="button" data-a="bkGo" aria-label="큐레이션 목록으로">← 큐레이션</button><b>${esc(t.title||'')}</b>`;h.prepend(b)}
  h.scrollTop=0}catch(e){}})});
/* 덜어 내기(참부장 11/14): 열린 카드의 「기타」 접기, 만들기 화면 위 퍼즐 · 말로 찾는 서가 타일, 큐레이션 밖의 「단어 하나로 큐레이션 만들기」 줄 */
afterRender(()=>{Promise.resolve().then(()=>{try{const mn=document.querySelector('main');if(!mn)return;
  
  document.body.classList.toggle('notcur',!(S.mode==='store'&&S.view.store==='cur'));
}catch(e){}})});
/* 더 빼기(참부장 11/14 21:51): 홍보 탭은 만들기 안 「인스타」로, 평대 기록 · 사진 한 줄, 도움말 버튼은 모든 화면에 */
afterRender(()=>{try{const mn=document.querySelector('main');if(!mn)return;
  if(S.mode==='aka'&&S.view.aka==='design'){const k=mn.querySelector('.ukind');if(k&&!k.querySelector('.igk')){const b=document.createElement('button');b.type='button';b.className='chip phm igk';b.dataset.a='go';b.dataset.v='insta';b.dataset.m='aka';b.title='인스타';b.innerHTML='<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="20" height="20" rx="5"></rect><circle cx="16" cy="16" r="4.5"></circle><circle cx="22" cy="10" r="0.8"></circle></svg><span>인스타</span>';const mo=k.querySelector('.kmore');mo?mo.before(b):k.append(b)}}
  const pb=mn.querySelector(':scope>.plbar'),pt=mn.querySelector(':scope>.pl3t');if(pb&&pt){const r=document.createElement('div');r.className='plrow';pb.before(r);r.append(pb,pt);const l=pt.querySelector('.pl3b');if(l){[...l.childNodes].forEach(n=>{if(n.nodeType===3)n.remove()});l.setAttribute('aria-label','평대 사진 남기기');l.title='평대 사진 남기기'}}
  const bar=document.querySelector('header .bar');if(bar&&!S.locked&&!bar.querySelector('.lvbtn')){const b=document.createElement('button');b.className='btn sm lvbtn lvbar';b.dataset.a='gdOpen';b.textContent='도움말';const nb=bar.querySelector('.navb');nb?nb.before(b):bar.append(b)}
}catch(e){}});
/* 처음 쓰는 사람: 첫 카드에 「눌러서 시작」(카드를 한 번 열면 사라짐). 숙련자: 데스크톱 단축키 */
afterRender(()=>{try{if(S.mode!=='store'||S.view.store!=='cur'||ls.get('cvDone',0))return;const w=document.querySelector('main .wall>.cvw');if(w)w.classList.add('hint')}catch(e){}});
(()=>{const f=A.cOpen;A.cOpen=d=>{ls.set('cvDone',1);return f(d)}})();
document.addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey||S.locked)return;const t=e.target,typing=t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable);
  if(e.key==='Escape'){if(typing){t.blur();return}e.preventDefault();A.bkGo();return}
  if(typing)return;
  if(e.key==='/'){const i=document.getElementById('gIn');if(i){e.preventDefault();i.focus()}return}
  if(e.key==='?'){e.preventDefault();A.gdOpen();return}
  if(/^[1-9]$/.test(e.key)){const L=navList(),x=L[+e.key-1];if(x){e.preventDefault();BK.nav=1;A.go({v:x[0],m:x[2]})}}});
afterRender(()=>{try{const g=document.querySelector('.gdtop, header .bar');const sb=document.querySelector('header');if(!sb||sb.querySelector('.kbd'))return;const p=document.createElement('p');p.className='kbd';p.textContent='단축키 · 1~4 화면 · / 찾기 · Esc 뒤로 · ? 도움말';sb.append(p)}catch(e){}});
