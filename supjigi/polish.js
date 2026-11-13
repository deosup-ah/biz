/* 11/13 저녁 전수 점검에서 고친 것: 빈 칸이 만드는 큰 틈, 겹친 제목, 도움말 자리 */
(()=>{const r=render;render=function(){r.apply(this,arguments);try{const mn=document.querySelector('main');if(!mn)return;
  /* 높이 0인 칸도 grid 간격을 먹어서 큰 틈이 생긴다 → 숨김 */
  [...mn.children].forEach(e=>{if(e.offsetHeight===0&&!e.matches('script,style'))e.style.display='none'});
  /* 도움말은 위쪽 막대로(아래로 한 줄을 통째로 쓰던 것) */
  const bar=document.querySelector('header .bar'),t=mn.querySelector('.gdtop'),b=t&&t.querySelector('.lvbtn');
  if(bar&&b){bar.querySelectorAll('.lvbtn').forEach(x=>x.remove());b.classList.add('lvbar');const nb=bar.querySelector('.navb');if(nb)nb.before(b);else bar.append(b);t.style.display='none'}
  /* 하위 탭이 하나뿐이면 감춘다(제목과 겹침) */
  mn.querySelectorAll('.subnav').forEach(n=>{const v=[...n.children].filter(x=>x.style.display!=='none');if(v.length<=1)n.style.display='none'});
  /* 공간: 큰 제목과 하위 탭 이름이 같으면 큰 제목을 「공간」으로 */
  const h=mn.querySelector('.hero h2'),sn=mn.querySelector('.subnav [data-a="spPick"][aria-pressed="true"]');if(h&&sn&&h.firstChild&&h.firstChild.nodeType===3&&h.firstChild.textContent.trim()===sn.textContent.trim())h.firstChild.textContent='공간';
  /* 홍보(직원): 운영 숫자는 없으니 설명을 하는 일로 */
  if(S.mode==='aka'&&S.view.aka==='insta'&&typeof isAdmin==='function'&&!isAdmin()){const p=mn.querySelector('.sec p');if(p&&/운영 숫자/.test(p.textContent))p.textContent='사진으로 피드 이미지와 글 만들기'}
}catch(e){}}})();
