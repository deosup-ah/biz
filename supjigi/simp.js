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
