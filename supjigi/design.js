'use strict';
/* POP · 띠지 · 평대 책 목록 · 선반 이름표 — 더숲 디자인 기준(Pretendard 800/500, 로고는 받은 그림 그대로) */
const SANS='"Pretendard",sans-serif',SERIF='"Gowun Batang",serif';
const KINDS=[['pop','POP'],['band','띠지'],['list','평대 책 목록'],['shelf','선반 이름표']];
const SIZES={pop:[['A4',210,297],['A5',148,210],['A6',105,148],['A3',297,420]],band:[['A3 가로 · 8줄',420,297]],list:[['A4 세로',210,297]],shelf:[['선반 이름표',90,55],['긴 이름표',180,50]]};
const POPC=[{n:'크림',bg:'#f3efe6',fg:'#1f2a44',ac:'#e07b45',hl:'#f2c230',b1:'#c9d6c2',b2:'#d9d5d8',box:'#ffffff'},{n:'숲',bg:'#eef1e8',fg:'#003128',ac:'#2f6b4a',hl:'#e9c46a',b1:'#cfdcc6',b2:'#e3ddcf',box:'#ffffff'},{n:'밤',bg:'#232a45',fg:'#f3efe6',ac:'#f2c230',hl:'#e07b45',b1:'#303a5e',b2:'#3a3350',box:'#303a5e',dark:1},{n:'살구',bg:'#f8ebe1',fg:'#4a2a22',ac:'#c8553d',hl:'#f5c9a8',b1:'#f1d6c4',b2:'#e6dccf',box:'#ffffff'},{n:'하늘',bg:'#e4ebf1',fg:'#1f3350',ac:'#3f7fb5',hl:'#bcd6ea',b1:'#cfdde9',b2:'#dfe3ea',box:'#ffffff'}];
const BANDC=[{n:'밤',a:'#261d3d',b:'#3a2c52',fg:'#f0e6d8',ac:'#f2a57c',dark:1},{n:'크림',a:'#f8f1e4',b:'#f0e5d0',fg:'#4a3a2a',ac:'#c9935a'},{n:'장미',a:'#f1eceb',b:'#e8dcdd',fg:'#5a2a2e',ac:'#8e2a2e'},{n:'이끼',a:'#f0f1ec',b:'#dadcd3',fg:'#2c3a30',ac:'#e07b45'},{n:'숲',a:'#2c463a',b:'#2c463a',fg:'#f3ead2',ac:'#d9b65a',dark:1},{n:'새벽',a:'#d6deea',b:'#ecdcc9',fg:'#3a4660',ac:'#f2a57c'},{n:'물',a:'#dcebe6',b:'#cfe2de',fg:'#2b5560',ac:'#5aa0a3'},{n:'먹',a:'#2e3344',b:'#262a3a',fg:'#eeeae0',ac:'#f5c66a',dark:1}];
const ICON={moon:'M17.5 13A7.5 7.5 0 1 1 11 5.2 6 6 0 0 0 17.5 13z',rain:'M7 14.5a4 4 0 0 1 .6-7.9 5 5 0 0 1 9.5 1.3A3.3 3.3 0 0 1 17 14.5zM8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5',snow:'M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2M4.2 7.5l2.7.4M4.2 7.5l1 2.6M19.8 16.5l-2.7-.4M19.8 16.5l-1-2.6',cup:'M5 10h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h1.5a2.3 2.3 0 0 1 0 4.6H16M8.5 3.5c-1 1.5 1 2 0 3.8M12 3.5c-1 1.5 1 2 0 3.8',leaf:'M5 19C5 10.5 10.5 5 19 5c0 8.500-5.500 14-14 14zM5 19l8.500-8.500',house:'M4 11.500l8-7 8 7V20H4zM10 14h4v4h-4zM12 14v4M10 16h4',pencil:'M4 20l1-4.200L15.800 5 19 8.200 8.200 19zM13.800 7l3.200 3.200M4 20l4.200-1',star:'M12 3.500l2.500 5.300 5.800.700-4.300 4 1.100 5.700L12 16.400l-5.100 2.800 1.100-5.700-4.300-4 5.800-.700z',wave:'M2 9c2.500-3 5-3 7.500 0s5 3 7.500 0 3-2 5-1M2 15c2.500-3 5-3 7.500 0s5 3 7.500 0 3-2 5-1',candle:'M10 11h4v9h-4zM12 11V8.500M12 3.500c-2 2-1.500 3.500 0 4 1.500-.500 2-2 0-4zM8 20h8',book:'M4 6c3-1.200 5.500-1 8 .800V19c-2.500-1.800-5-2-8-.800zM20 6c-3-1.200-5.500-1-8 .800V19c2.500-1.800 5-2 8-.800z',sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2.500V5M12 19v2.500M2.500 12H5M19 12h2.500M5.300 5.300L7 7M17 17l1.700 1.700M18.700 5.300L17 7M7 17l-1.700 1.700',drop:'M12 3.500c4 5 6 8 6 10.500a6 6 0 0 1-12 0c0-2.500 2-5.500 6-10.500zM12 18v-5M12 14.500c-2 0-3-1-3-3 2 0 3 1 3 3z',walk:'M7 20c1.500-1 2.500-2.500 2-4.500M9 8.500c1.800-.300 2.800 1 2.500 2.800-.300 1.800-1.800 2.500-3 2-1.200-.500-1.300-4.400.500-4.800zM15 5c1.800-.300 2.800 1 2.500 2.800-.300 1.800-1.800 2.500-3 2-1.200-.500-1.300-4.400.500-4.800zM13 16.500c1.500-1 2.500-2.500 2-4.500'};
const MOTIF=[['moon','달'],['rain','비'],['snow','눈'],['cup','찻잔'],['leaf','잎'],['house','집'],['pencil','연필'],['star','별'],['wave','물결'],['candle','초'],['book','책'],['sun','해'],['drop','새싹'],['walk','걸음'],['none','없음']];
const LOGOS={plain:3.16,book:2.41},LIMG={};
['logo-k','logo-g','logo-w','logob-k','logob-g','logob-w'].forEach(n=>{const i=new Image();i.src=n+'.png';LIMG[n]=i});
const STY=['기본','포스터','여백','띠','세로'];
const defD=()=>({kind:'pop',st:0,size:0,pal:0,sym:'none',logo:'plain',lc:'g',hs:1,tag:BRAND[curBr()]||'',badge:'',head:'',body:'',book:'',author:'',price:'',phrases:'',syms:[],pals:[],list:'',foot:'',br:curBr(),books:[]});
const mctx=document.createElement('canvas').getContext('2d');
const mw=(t,font,size,weight)=>{mctx.font=`${weight||400} ${size*10}px ${font}`;return mctx.measureText(t).width/10};
function wrap(text,font,size,maxW,maxLines,weight){const out=[];String(text||'').split('\n').forEach(par=>{let line='';for(const tok of par.split(/(\s+)/)){if(mw(line+tok,font,size,weight)<=maxW){line+=tok;continue}
      if(line.trim()){out.push(line.trim());line=''}let w=tok.trim();while(w.length>1&&mw(w,font,size,weight)>maxW){let i=w.length;while(i>1&&mw(w.slice(0,i),font,size,weight)>maxW)i--;out.push(w.slice(0,i));w=w.slice(i)}line=w}
    if(line.trim())out.push(line.trim())});return maxLines&&out.length>maxLines?out.slice(0,maxLines-1).concat(out[maxLines-1]+'…'):out}
function fit(text,font,size,maxW,maxLines,min,weight){let s=size,l=wrap(text,font,s,maxW,0,weight);while(l.length>maxLines&&s>min){s*=.93;l=wrap(text,font,s,maxW,0,weight)}return{s,l:l.slice(0,maxLines)}}
function layout(D){const pr=[],brand=BP(D.br)+(BRAND[D.br]||brN(!D.br||D.br==='all'?'aka':D.br));
  const T=(x,y,txt,size,o={})=>pr.push({k:'t',x,y,txt:String(txt),size,font:o.font||SANS,fill:o.fill||'#111',anchor:o.anchor||'start',weight:o.weight||500,ls:o.ls||0});
  const R=(x,y,w,h,fill,o={})=>pr.push({k:'r',x,y,w,h,fill,...o});
  const O=(x,y,rx,ry,fill,o={})=>pr.push({k:'o',x,y,rx,ry,fill,...o});
  /* 로고: 받은 그림 그대로. 밝은 바탕은 검정 · 짙은 초록, 어두운 바탕은 흰색 */
  const LOGO=(x,y,size,dark,anchor,kind)=>{if(NM(D.br)){const nm='노원문고',fs=size*.95,tw=mw(nm,SANS,fs,800);T(x,y,nm,fs,{fill:dark?'#ffffff':D.lc==='k'?'#111111':'#003128',weight:800,anchor:anchor||'start'});return tw}const kd=kind||D.logo||'plain',h=size*(kd==='book'?1.75:1.2),w=h*LOGOS[kd],x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;pr.push({k:'i',src:(kd==='book'?'logob-':'logo-')+(dark?'w':D.lc==='k'?'k':'g'),x:x0,y:y-h*(kd==='book'?.56:.8),w,h});return w};
  const SYM=(key,cx,cy,r,ac,fg,halo)=>{if(!ICON[key])return;if(halo!==false)O(cx,cy,r*1.25,r*1.25,ac,{op:.22});pr.push({k:'p',d:ICON[key],x:cx-r,y:cy-r,s:r/12,stroke:fg,sw:Math.max(.25,r*.085)})};
  if(D.kind==='band'){const w=420,h=297,n=8,sh=h/n,ph=(D.phrases||'').split('\n').map(s=>s.trim()).filter(Boolean).slice(0,4);if(!ph.length)ph.push('문구를 한 줄에 하나씩 적어 주세요');
    for(let i=0;i<n;i++){const j=Math.min(ph.length-1,Math.floor(i*ph.length/n)),P=BANDC[((D.pals||[])[j]??(D.pal+j))%BANDC.length],key=(D.syms||[])[j]||(D.sym&&D.sym!=='none'?D.sym:MOTIF[(j*3)%13][0]),y=i*sh,cy=y+sh/2;R(0,y,w,sh,P.a,{fill2:P.b});
      const f=fit(ph[j],SERIF,4.6,150,1,3,700);if(D.sym!=='off')SYM(key,w*.455,cy,sh*.26,P.ac,P.fg);T(w*.51,y+sh*.44,f.l[0],f.s,{font:SERIF,fill:P.fg,weight:700});LOGO(w*.585,y+sh*.82,2.6,P.dark,'start','plain');
      if(D.sym!=='off')SYM(key,w*.822,cy,sh*.085,P.ac,P.fg,false);LOGO(w*.842,cy+1,2.6,P.dark,'start','plain');if(i)R(0,y,w,.01,'none',{stroke:'#8a8a8a',sw:.15,dash:'1.2 1.2'})}
    return{w,h,pr}}
  let [,w,h]=SIZES[D.kind][D.size]||SIZES[D.kind][0];if(D.kind==='pop'&&D.land)[w,h]=[h,w];
  if(D.kind==='list'){const fg='#003128',m=w*.08;R(0,0,w,h,'#f4f1e8');LOGO(m,m+4.5,7,false,'start');T(w-m,m+3.5,D.tag||brand,3.7,{fill:fg,weight:800,anchor:'end'});R(m,m+10,w-m*2,.3,fg);
    const tf=fit(D.head||'이 평대의 책',SERIF,12.5,w-m*2-(ICON[D.sym]?20:0),1,6,700),title=tf.l[0],tw=mw(title,SERIF,tf.s,700);T(m,m+27,title,tf.s,{font:SERIF,fill:fg,weight:700});let y=m+27;if(ICON[D.sym])SYM(D.sym,w-m-8,m+21,7,'#c9935a',fg);
    if(D.body){if(tw+6+mw(D.body,SERIF,4.8,400)<=w-m*2-(ICON[D.sym]?20:0))T(m+tw+6,y,D.body,4.8,{font:SERIF,fill:fg,weight:400});else{y+=8;T(m,y,wrap(D.body,SERIF,4.8,w-m*2,1)[0],4.8,{font:SERIF,fill:fg,weight:400})}}
    y+=11;const rows=(D.list||'').split('\n').map(s=>s.trim()).filter(Boolean);if(!rows.length)rows.push('책 이름 | 저자 · 출판사 | 한 줄 소개');
    const items=rows.filter(r=>r[0]!=='#').length,secs=rows.length-items,room=h-m-10-y,ih=Math.max(11,Math.min(19,(room-secs*10)/Math.max(1,items)));
    for(const row of rows){if(y>h-m-12)break;if(row[0]==='#'){T(m,y+1,row.replace(/^#+\s*/,''),4,{fill:fg,weight:800,ls:.3});R(m,y+4,w-m*2,.3,fg);y+=10;continue}
      let [t,ap,why]=row.split('|').map(s=>(s||'').trim());const nm=t.match(/^(\d{1,2})\.\s*/);if(nm){t=t.slice(nm[0].length);O(m+2,y-1.7,2.5,2.5,'#f4f1e8',{stroke:fg,sw:.3});T(m+2,y-.5,nm[1],3.2,{fill:fg,weight:800,anchor:'middle'})}else O(m+1.4,y-1.4,.9,.9,fg);const apW=ap?mw(ap,SANS,3.3,500)+4:0;T(m+6,y,wrap(`『${t}』`,SERIF,5,w-m*2-6-apW,1,700)[0],5,{font:SERIF,fill:fg,weight:700});if(ap)T(w-m,y,ap,3.3,{fill:fg,anchor:'end'});
      if(why)T(m+6,y+ih*.42,wrap(why,SERIF,3.7,w-m*2-6,1)[0],3.7,{font:SERIF,fill:fg,weight:400});R(m+6,y+ih*.62,w-m*2-6,.15,'#c5c6b8');y+=ih}
    if(D.foot)T(m,h-m,D.foot,3.5,{font:SERIF,fill:fg,weight:400});return{w,h,pr}}
  const P=POPC[D.pal]||POPC[0];R(0,0,w,h,P.bg);
  if(D.kind==='shelf'){const m=w*.075;R(0,0,w*.03,h,P.ac);if(D.tag)T(m*1.5,h*.22,D.tag,h*.085,{fill:P.ac,weight:800,ls:.3});const H=fit(D.head||'매대 이름',SANS,h*.26*(D.hs||1),w-m*3-(ICON[D.sym]?h*.4:0),2,6,800);let y=h*.52-(H.l.length-1)*H.s*.55+(D.body?-h*.05:H.s*.3);
    H.l.forEach(l=>{T(m*1.5,y,l,H.s,{fill:P.fg,weight:800});y+=H.s*1.15});if(D.body)wrap(D.body,SANS,h*.085,w-m*3,2).forEach(l=>{T(m*1.5,y,l,h*.085,{fill:P.fg});y+=h*.12});if(ICON[D.sym])SYM(D.sym,w-m-h*.2,h*.36,h*.17,P.ac,P.fg);LOGO(w-m*.8,h-m*.7,h*.085,P.dark,'end');return{w,h,pr}}
  const u=w>h?Math.min(w*.7,h*.98):Math.min(w,h*.74),m=u*.075;const BADGE=()=>{if(D.badge){const r=u*.1,cx=w-m-r*.9,cy=m+r*.85,bl=D.badge.split(/\n|\s+/).filter(Boolean).slice(0,3),big=bl.find(x=>/\d/.test(x))||bl[Math.floor(bl.length/2)];O(cx,cy,r,r*.94,P.ac);let by=cy-(bl.length-1)*r*.3+r*.12;bl.forEach(l=>{const s=l===big&&bl.length>1?r*.5:r*.3;T(cx,by+(s>r*.4?r*.08:0),l,s,{fill:'#fff',weight:800,anchor:'middle'});by+=r*.52})}};
  if(D.st){const st=D.st,ld=w>h,hd=D.head||'여기에 큰 문구를\n적어 주세요',sym=ICON[D.sym]?D.sym:'book',nl=Math.min(3,Math.max(1,hd.split('\n').length)),bk=D.book?`『${D.book}』${D.author?'  '+D.author:''}${D.price?'  '+D.price:''}`:'';
    if(st===1){/* 포스터: 짙은 바탕, 가운데 */const B=P.dark?P.bg:P.fg,F=P.dark?P.fg:P.bg,cx=w/2,r=u*(ld?.125:.17),cy=h*(ld?.25:.235);R(0,0,w,h,B);O(cx,cy,r*1.55,r*1.55,P.ac,{op:.16});O(cx,cy,r*1.28,r*1.28,P.ac,{op:.9});pr.push({k:'p',d:ICON[sym],x:cx-r*.8,y:cy-r*.8,s:r*.8/12,stroke:F,sw:r*.06});
      const H=fit(hd,SERIF,u*.1*(D.hs||1),w-m*3,nl,u*.05,700);let y=cy+r*(ld?1.45:1.6)+H.s*(ld?.9:1.25);H.l.forEach(l=>{T(cx,y,l,H.s,{font:SERIF,fill:F,weight:700,anchor:'middle'});y+=H.s*1.32});R(cx-u*.04,y-H.s*.5,u*.08,u*.006,P.hl);y+=u*.045;
      const bs=u*.037;wrap(D.body||'',SANS,bs,Math.min(w-m*4,u*(ld?1.2:.86)),ld?2:3,500).forEach(l=>{T(cx,y,l,bs,{fill:F,weight:500,anchor:'middle'});y+=bs*1.7});if(bk){y+=u*.03;T(cx,y,wrap(bk,SANS,u*.032,w-m*3,1,800)[0],u*.032,{fill:P.hl,weight:800,anchor:'middle'})}
      if(ld){LOGO(m,h-m,u*.045,true,'start');if(D.tag&&D.logo!=='book')T(w-m,h-m,D.tag,u*.028,{fill:F,weight:800,anchor:'end',ls:.4})}else{LOGO(cx,h-m*1.5,u*.05,true,'middle');if(D.tag&&D.logo!=='book')T(cx,h-m*.75,D.tag,u*.026,{fill:F,weight:800,anchor:'middle',ls:.4});}BADGE();return{w,h,pr}}
    if(st===2){/* 여백: 조용하게, 아래에 낮게 */const r=u*.2;O(w-m-r*.9,m+r*1.05,r*1.2,r*1.2,P.b1,{op:.55});pr.push({k:'p',d:ICON[sym],x:w-m-r*1.9,y:m+r*.05,s:r/12,stroke:P.ac,sw:r*.045});
      const lw=LOGO(m,m+u*.05,u*.045,P.dark,'start');if(D.tag&&D.logo!=='book')T(m+lw+u*.03,m+u*.045,D.tag,u*.028,{fill:P.fg,weight:800});
      const H=fit(hd,SERIF,u*.088*(D.hs||1),w-m*2.6,nl,u*.045,700),bl=wrap(D.body||'',SERIF,u*.036,Math.min(w-m*3,u*.9),4,400),bh=H.l.length*H.s*1.36+bl.length*u*.062+(bk?u*.1:0);let y=h-m*2.2-bh+H.s;R(m,y-H.s*1.9,u*.1,u*.012,P.ac);
      H.l.forEach(l=>{T(m,y,l,H.s,{font:SERIF,fill:P.fg,weight:700});y+=H.s*1.36});y+=u*.012;bl.forEach(l=>{T(m,y,l,u*.036,{font:SERIF,fill:P.fg,weight:400});y+=u*.062});if(bk){y+=u*.035;T(m,y,wrap(bk,SANS,u*.03,w-m*2,1,800)[0],u*.03,{fill:P.ac,weight:800})}
      T(m,h-m,brand,u*.026,{fill:P.fg,weight:800,ls:.3});BADGE();return{w,h,pr}}
    if(st===4){/* 세로: 제목을 세로로 세워 쓰기 */const cols=hd.split('\n').slice(0,3),mx=Math.max(...cols.map(c=>[...c.replace(/\s/g,'')].length),1),top=m+u*.2,cs=Math.min(u*.13*(D.hs||1),(h*(ld?.62:.6))/mx/1.12);let cx=w-m-cs*.6;
      cols.forEach(c=>{let cy=top+cs;[...c].forEach(ch=>{if(/\s/.test(ch)){cy+=cs*.5;return}if(/[,.，、。]/.test(ch)){T(cx+cs*.42,cy-cs*.62,'、',cs*.7,{font:SERIF,fill:P.ac,weight:700,anchor:'middle'});cy+=cs*.35;return}T(cx,cy,ch,cs,{font:SERIF,fill:P.fg,weight:700,anchor:'middle'});cy+=cs*1.12});cx-=cs*1.35});
      R(cx+cs*.55,top+cs*.2,u*.004,h*(ld?.5:.46),P.ac);const lw=LOGO(m,m+u*.05,u*.045,P.dark,'start');if(D.tag&&D.logo!=='book')T(m+lw+u*.03,m+u*.045,D.tag,u*.028,{fill:P.fg,weight:800});
      const r=u*.13,tw=Math.max(u*.3,cx-m-cs*.2),bl=wrap(D.body||'',SERIF,u*.036,Math.min(tw,u*.62),6,400);O(m+r,h*(ld?.42:.4),r*1.25,r*1.25,P.b1,{op:.7});pr.push({k:'p',d:ICON[sym],x:m,y:h*(ld?.42:.4)-r,s:r/12,stroke:P.ac,sw:r*.05});
      let y=h-m*2.2-bl.length*u*.062-(bk?u*.09:0);bl.forEach(l=>{T(m,y,l,u*.036,{font:SERIF,fill:P.fg,weight:400});y+=u*.062});if(bk){y+=u*.03;T(m,y,wrap(bk,SANS,u*.03,w-m*2,1,800)[0],u*.03,{fill:P.ac,weight:800})}
      T(m,h-m,brand,u*.026,{fill:P.fg,weight:800,ls:.3});BADGE();return{w,h,pr}}
    /* 띠: 색 면과 글 면을 나눔 */const bw=ld?w*.36:w,bh=ld?h:h*.4,x0=ld?bw+m:m,tw=w-x0-m,r=Math.min(bw,bh)*.24,ic=P.dark?P.bg:'#ffffff';R(0,0,bw,bh,P.ac);O(bw/2,bh/2,r*1.5,r*1.5,ic,{op:.14});pr.push({k:'p',d:ICON[sym],x:bw/2-r,y:bh/2-r,s:r/12,stroke:ic,sw:r*.07});
    const H=fit(hd,SANS,u*.105*(D.hs||1),tw,nl,u*.05,800);let y=(ld?h*.2:bh+u*.1)+H.s;if(D.tag&&D.logo!=='book'){T(x0,y-H.s*1.25,D.tag,u*.03,{fill:P.ac,weight:800,ls:.4});y+=u*.03}H.l.forEach(l=>{T(x0,y,l,H.s,{fill:P.fg,weight:800});y+=H.s*1.24});y+=u*.015;
    wrap(D.body||'',SANS,u*.04,tw,4,500).forEach(l=>{T(x0,y,l,u*.04,{fill:P.fg,weight:500});y+=u*.066});if(bk){y+=u*.03;R(x0,y-u*.045,tw,.3,P.fg);T(x0,y+u*.012,wrap(bk,SANS,u*.032,tw,1,800)[0],u*.032,{fill:P.fg,weight:800})}
    LOGO(x0,h-m,u*.05,P.dark,'start');T(w-m,h-m,brand,u*.026,{fill:P.fg,weight:800,anchor:'end'});BADGE();return{w,h,pr}}
  O(w+u*.02,h*.31,u*.3,h*.125,P.b1);O(-u*.02,h*.69,u*.1,h*.085,P.b2);if(ICON[D.sym])SYM(D.sym,w-m-u*.11,h-m-u*.12,u*.095,P.b1,P.fg);
  const lw=LOGO(m,m+u*.05,u*.052,P.dark,'start');if(D.tag&&D.logo!=='book'){R(m+lw+u*.022,m+u*.008,.35,u*.05,P.fg);T(m+lw+u*.045,m+u*.047,D.tag,u*.032,{fill:P.fg,weight:800})}
  BADGE();
  const hd=D.head||'여기에 큰 문구를\n적어 주세요',H=fit(hd,SANS,u*.108*(D.hs||1),w-m*2-(w>h?u*.3:0),Math.min(3,Math.max(1,hd.split('\n').length)),u*.055,800);let y=h*(w>h?.24:.21)+H.s;
  H.l.forEach((l,i)=>{if(i===H.l.length-1)R(m-u*.005,y-H.s*.36,mw(l,SANS,H.s,800)+u*.012,H.s*.44,P.hl);T(m,y,l,H.s,{fill:P.fg,weight:800});y+=H.s*1.24});
  y+=u*.012;const bs=u*.04;wrap(D.body||'',SANS,bs,w-m*2-(w>h?u*.3:0),4,500).forEach(l=>{T(m,y,l,bs,{fill:P.fg,weight:500});y+=bs*1.65});
  if(D.book){y+=u*.03;const bh=u*(D.author?.2:.15),bx=w>h?Math.min(w-m*2,u*1.15):w-m*2;R(m,y,bx,bh,P.box,{rx:u*.014,stroke:P.fg,sw:.35});T(m+u*.04,y+u*.055,'오늘의 책',u*.03,{fill:P.fg,weight:800});T(m+u*.19,y+u*.055,"Today's Pick",u*.026,{fill:P.fg,weight:500});
    const pw=D.price?mw(D.price,SANS,u*.04,800)+u*.05:0;R(m+u*.04,y+u*.085,u*.09,u*.045,P.ac);T(m+u*.16,y+u*.12,wrap(`『${D.book}』`,SANS,u*.04,bx-u*.22-pw,1,800)[0],u*.04,{fill:P.fg,weight:800});if(D.price)T(m+bx-u*.04,y+u*.12,D.price,u*.04,{fill:P.fg,weight:800,anchor:'end'});
    if(D.author){R(m+u*.04,y+u*.14,u*.09,u*.035,P.dark?P.hl:'#5f8163');T(m+u*.16,y+u*.168,wrap(D.author,SANS,u*.03,bx-u*.22,1)[0],u*.03,{fill:P.fg})}}
  T(m,h-m,brand,u*.03,{fill:P.fg,weight:800});return{w,h,pr}}
function toSVG(L){let defs='',g=0;const body=L.pr.map(p=>{if(p.k==='r'){let fill=p.fill;if(p.fill2&&p.fill2!==p.fill){const id='g'+(g++);defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.fill}"/><stop offset="1" stop-color="${p.fill2}"/></linearGradient>`;fill=`url(#${id})`}
      return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${fill}" ${p.rx?`rx="${p.rx}"`:''} ${p.op?`opacity="${p.op}"`:''} ${p.stroke?`stroke="${p.stroke}" stroke-width="${p.sw}" ${p.dash?`stroke-dasharray="${p.dash}"`:''}`:''}/>`}
    if(p.k==='o')return `<ellipse cx="${p.x}" cy="${p.y}" rx="${p.rx}" ry="${p.ry}" fill="${p.fill}" ${p.op?`opacity="${p.op}"`:''} ${p.stroke?`stroke="${p.stroke}" stroke-width="${p.sw}" ${p.dash?`stroke-dasharray="${p.dash}"`:''}`:''}/>`;
    if(p.k==='i')return `<image href="${p.src}.png" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"/>`;
    if(p.k==='p')return `<path d="${p.d}" transform="translate(${p.x} ${p.y}) scale(${p.s})" fill="none" stroke="${p.stroke}" stroke-width="${p.sw/p.s}" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<text x="${p.x}" y="${p.y}" text-anchor="${p.anchor}" style="font-family:${p.font.replace(/"/g,"'")};font-size:${p.size}px;font-weight:${p.weight};fill:${p.fill};letter-spacing:${p.ls}px">${esc(p.txt)}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.w} ${L.h}" width="${Math.min(L.w*3.2,980)}"><defs>${defs}</defs>${body}</svg>`}
async function toCanvas(L){await Promise.all(L.pr.filter(p=>p.k==='i').map(p=>{const i=LIMG[p.src];return i.complete?0:new Promise(r=>{i.onload=i.onerror=r})}));
  const k=300/25.4,c=document.createElement('canvas');c.width=Math.round(L.w*k);c.height=Math.round(L.h*k);const x=c.getContext('2d');x.scale(k,k);
  const stroke=p=>{if(p.stroke){x.strokeStyle=p.stroke;x.lineWidth=p.sw;x.setLineDash(p.dash?p.dash.split(' ').map(Number):[])}};
  L.pr.forEach(p=>{x.save();if(p.op)x.globalAlpha=p.op;if(p.k==='r'){x.beginPath();if(p.rx&&x.roundRect)x.roundRect(p.x,p.y,p.w,p.h,p.rx);else x.rect(p.x,p.y,p.w,p.h);if(p.fill&&p.fill!=='none'){if(p.fill2&&p.fill2!==p.fill){const g=x.createLinearGradient(0,p.y,0,p.y+p.h);g.addColorStop(0,p.fill);g.addColorStop(1,p.fill2);x.fillStyle=g}else x.fillStyle=p.fill;x.fill()}if(p.stroke){stroke(p);x.stroke()}}
    else if(p.k==='o'){x.beginPath();x.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);if(p.fill&&p.fill!=='none'){x.fillStyle=p.fill;x.fill()}if(p.stroke){stroke(p);x.stroke()}}
    else if(p.k==='i'){try{x.drawImage(LIMG[p.src],p.x,p.y,p.w,p.h)}catch(e){}}
    else if(p.k==='p'){x.translate(p.x,p.y);x.scale(p.s,p.s);x.strokeStyle=p.stroke;x.lineWidth=p.sw/p.s;x.lineCap='round';x.lineJoin='round';x.stroke(new Path2D(p.d))}
    else{x.font=`${p.weight} ${p.size}px ${p.font}`;x.fillStyle=p.fill;x.textAlign={start:'left',middle:'center',end:'right'}[p.anchor];try{x.letterSpacing=p.ls+'px'}catch(e){}x.fillText(p.txt,p.x,p.y)}x.restore()});
  return c}
const toPNG=async L=>{const c=await toCanvas(L);return new Promise(r=>c.toBlob(r,'image/png'))};
const canMic=()=>!!(DICT||window.SpeechRecognition||window.webkitSpeechRecognition);
V.store.design=()=>{if(!S.ui.D&&S.mode==='store'){try{const br=curBr(),t=(corners(br).all||[])[0];if(t)S.ui.D=mkD({...t,br},'pop')}catch(e){}}const D=S.ui.D=S.ui.D||defD(),L=layout(D),sz=SIZES[D.kind],k=D.kind,log=S.ui.dlog=S.ui.dlog||[];
  const F=(id,label,key,ph,rows)=>`<div class="fld"><label for="${id}">${label}</label>${rows?`<textarea id="${id}" rows="${rows}" data-c="dSet" data-k="${key}" placeholder="${ph}">${esc(D[key])}</textarea>`:`<input type="text" id="${id}" data-c="dSet" data-k="${key}" value="${esc(D[key])}" placeholder="${ph}">`}</div>`;
  const pals=k==='band'?BANDC.map(p=>[p.a,p.ac,p.n]):POPC.map(p=>[p.bg,p.ac,p.n]);
  const main=k==='band'?F('dPh','문구 (한 줄에 하나, 4개까지)','phrases','예: 긴 밤에는, 긴 소설\n비 오는 날은, 시집이 얇아서',4)
    :k==='list'?F('dHead','제목','head','이 평대의 책')+F('dBody','부제','body','예: 좁쌀 한 알이 차린 40년의 밥상')+F('dList','책 목록 (한 줄에: 책 이름 | 저자 · 출판사 | 한 줄 소개)','list','가호 | 무라카미 하루키 · 문학동네 | 긴 밤에 어울리는 긴 소설.',8)
    :k==='shelf'?F('dHead','매대 이름','head','예: 긴 밤에는, 긴 소설')+F('dBody','한 줄 설명','body','')
    :F('dHead','큰 문구','head','예: 긴 밤에는,\n긴 소설.',2)+F('dBody','소개 글','body','손님에게 건네는 두세 문장',2);
  const more=`${sz.length>1?`<div class="fld"><label>크기 · 방향</label><div class="chips">${sz.map(([n],i)=>`<button class="chip" data-a="dPick" data-k="size" data-v="${i}" aria-pressed="${D.size===i}">${n}</button>`).join('')}${k==='pop'?`<span style="width:8px"></span><button class="chip" data-a="dLand" data-v="0" aria-pressed="${!D.land}">세로</button><button class="chip" data-a="dLand" data-v="1" aria-pressed="${!!D.land}">가로</button>`:''}</div></div>`:''}
    <div class="fld"><label>그림</label><div class="chips">${MOTIF.map(([v,n])=>`<button class="chip" data-a="dSym" data-k="${v}" aria-pressed="${(D.sym||'none')===v}">${n}</button>`).join('')}</div></div>
    ${k==='list'?'':`<div class="fld"><label>색</label><div class="btns">${pals.map(([a,b,n],i)=>`<button class="sw" data-a="dPick" data-k="pal" data-v="${i}" aria-pressed="${D.pal===i}" aria-label="${n}" title="${n}" style="background:linear-gradient(135deg,${a} 60%,${b} 60%)"></button>`).join('')}</div></div>`}
    ${k==='pop'?`${D.books&&D.books.length>1?`<div class="fld"><label>책 상자에 넣을 책</label><div class="chips">${D.books.slice(0,8).map((b,i)=>`<button class="chip" data-a="dBook" data-i="${i}" aria-pressed="${D.book===b.t}">${esc(b.t.length>12?b.t.slice(0,12)+'…':b.t)}</button>`).join('')}</div></div>`:''}<div class="f2">${F('dBook','책 이름','book','예: 가호')}${F('dAuth','저자 · 출판사','author','')}</div><div class="f2">${F('dPrice','값','price','예: 18,500원')}${F('dBadge','동그라미 딱지','badge','예: 선착순 20명')}</div>`:''}
    ${k==='list'?F('dTag','오른쪽 위 머리말','tag','')+F('dFoot','맨 아래 한 줄','foot',''):F('dTag','로고 옆 이름','tag','예: 사유의숲')}
    <div class="fld"><label>로고</label><div class="chips">${[['plain','기본'],['book','Bookstore']].map(([v,n])=>`<button class="chip" data-a="dStr" data-k="logo" data-v="${v}" aria-pressed="${D.logo===v}">${n}</button>`).join('')}${[['g','초록'],['k','검정']].map(([v,n])=>`<button class="chip" data-a="dStr" data-k="lc" data-v="${v}" aria-pressed="${D.lc===v}">${n}</button>`).join('')}</div></div>`;
  return `<div class="sec"><h2>POP 만들기</h2><p>글을 적거나, 말로 고치세요</p></div>
  <div class="grid g2 dz" style="align-items:start"><div class="grid stagecol"><div class="stage" id="stage">${toSVG(L)}</div>
    ${k==='pop'?`<div class="feel"><span class="note">느낌 고르기</span><div class="feels">${STY.map((n,i)=>`<button data-a="dSt" data-v="${i}" aria-pressed="${(D.st|0)===i}" aria-label="${n}">${toSVG(layout({...D,st:i,size:0,land:false}))}<small>${n}</small></button>`).join('')}</div><div class="sws"><span class="note">색</span>${pals.map(([a,b,n],i)=>`<button class="sw" data-a="dPick" data-k="pal" data-v="${i}" aria-pressed="${D.pal===i}" aria-label="${n}" title="${n}" style="background:linear-gradient(135deg,${a} 60%,${b} 60%)"></button>`).join('')}</div></div>`:''}
    <div class="btns"><button class="btn pri" data-a="dPdf">PDF 받기</button><button class="btn" data-a="dPng">PNG</button><span class="note">${Math.round(L.w)}×${Math.round(L.h)}mm</span>${(S.ui.dH||[]).length?`<button class="btn ghost" style="margin-left:auto" data-a="dUndo">되돌리기</button>`:'<span style="margin-left:auto"></span>'}<button class="btn ghost" data-a="dNew">새로</button></div>
    <div class="card form"><div class="btns" style="flex-wrap:nowrap">${canMic()?`<button class="btn mic ${S.ui.mic?'on':''}" data-a="dMic" aria-label="말로 고치기" title="말로 고치기">${S.ui.mic?'듣는 중…':'말하기'}</button>`:''}<input type="text" id="dchat" placeholder="예: 제목 더 크게 · 색 밤으로 · 가로로"><button class="btn pri" data-a="dChatGo">고치기</button></div>
     ${log.length?`<p class="note" id="dlog">${esc(log[log.length-1].t)}</p>`:`<div class="chips">${['느낌 바꿔','제목 더 크게','색 바꿔','그림 바꿔','가로로'].map(t=>`<button class="chip" data-a="dChatQ" data-t="${t}">${t}</button>`).join('')}</div>`}</div></div>
   <div class="card form"><div class="chips">${KINDS.map(([v,l])=>`<button class="chip" data-a="dKind" data-k="${v}" aria-pressed="${k===v}">${l}</button>`).join('')}</div>
    <div class="chips">${BR.map(b=>`<button class="chip" data-a="dBr" data-k="${b.k}" aria-pressed="${D.br===b.k}">${NM(b.k)?'노원문고 ':''}${BRAND[b.k]}</button>`).join('')}</div>
    ${main}
    <details data-o="dmore" ${S.ui.o_dmore?'open':''}><summary>더 고치기 <small>크기 · 그림 · 색 · 로고${k==='pop'?' · 책 상자':''}</small></summary><div class="form" style="margin-top:12px">${more}</div></details></div></div>`};
V.aka.design=V.store.design;
function dRefresh(){const s=$('stage');if(s)s.innerHTML=toSVG(layout(S.ui.D))}
C.dSet=(el,d)=>{S.ui.D[d.k]=el.value;dRefresh()};
document.addEventListener('input',e=>{const el=e.target.closest&&e.target.closest('[data-c="dSet"]');if(el){S.ui.D[el.dataset.k]=el.value;dRefresh()}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='dchat'){e.preventDefault();A.dChatGo()}});
A.dKind=d=>{const D=S.ui.D;D.kind=d.k;D.size=0;D.pal=0;if(d.k==='band'&&!D.phrases)D.phrases=(D.head||'').replace(/\n/g,' ');if(d.k==='list'&&!D.list&&(D.books||[]).length)D.list=D.books.map(b=>`${b.t} | ${[b.a,b.p].filter(Boolean).join(' · ')} | ${b.why||''}`).join('\n');render()};
A.dPick=d=>{S.ui.D[d.k]=+d.v;if(d.k==='pal')S.ui.D.pals=[];render()};A.dStr=d=>{S.ui.D[d.k]=d.v;render()};A.dSym=d=>{S.ui.D.sym=d.k;S.ui.D.syms=[];render()};
A.dBr=d=>{const D=S.ui.D;if(!D.tag||Object.values(BRAND).includes(D.tag)||/^(더숲|노원문고) /.test(D.tag))D.tag=D.kind==='list'?BP(d.k)+BRAND[d.k]:BRAND[d.k];D.br=d.k;render()};
A.dSt=d=>{S.ui.D.st=+d.v;render()};
A.dLand=d=>{S.ui.D.land=d.v==='1';render()};
A.dNew=()=>{S.ui.D=defD();S.ui.dlog=[];render()};
A.dBook=d=>{const b=S.ui.D.books[+d.i];S.ui.D.book=b.t;S.ui.D.author=[b.a,b.p].filter(Boolean).join(' · ');render()};
/* 말로 고치기 — 자주 쓰는 말은 규칙으로 바로 처리 */
function dChat(q){const D=S.ui.D,pal=D.kind==='band'?BANDC:POPC,has=re=>re.test(q),val=(re)=>{const m=q.match(re);return m?m[1].trim().replace(/[으]?로$|(으)?로\s*(바꿔|해|고쳐).*$/,'').replace(/^["'「『]|["'」』]$/g,'').trim():null};let did=[];
  let v;if((v=val(/(?:제목|큰\s*문구|문구|머리)(?:을|를|은|는)?\s*[:：]?\s*(.+?)(?:\s*(?:으로|로)\s*(?:바꿔|해|고쳐)\S*)?$/))&&!has(/크게|작게|키워|줄여|빼|없애/)&&v.length>1){if(D.kind==='band')D.phrases=v.replace(/\s*\/\s*/g,'\n');else D.head=v.replace(/\s*\/\s*/g,'\n');did.push('문구를 바꿨습니다')}
  else if((v=val(/(?:소개|본문|설명|부제)(?:을|를|은|는)?\s*[:：]?\s*(.+)$/))&&!has(/빼|없애/)){D.body=v;did.push('소개 글을 바꿨습니다')}
  else if((v=val(/책(?:\s*이름)?(?:을|를|은|는)?\s*[:：]?\s*(.+)$/))&&!has(/빼|없애|목록/)){D.book=v;did.push('책 이름을 바꿨습니다')}
  if(has(/크게|키워/)){D.hs=Math.min(1.6,(D.hs||1)*1.15);did.push('제목을 키웠습니다')}if(has(/작게|줄여/)){D.hs=Math.max(.6,(D.hs||1)/1.15);did.push('제목을 줄였습니다')}
  const pi=pal.findIndex(p=>q.includes(p.n));if(has(/색/)||pi>=0){D.pal=pi>=0?pi:(D.pal+1)%pal.length;D.pals=[];did.push(`색을 「${pal[D.pal].n}」으로 했습니다`)}
  const mi=MOTIF.find(([k,n])=>n!=='없음'&&q.includes(n)&&has(/그림|상징|아이콘|심볼/)||new RegExp('그림\\s*'+n).test(q));if(mi){D.sym=mi[0];D.syms=[];did.push(`그림을 「${mi[1]}」로 했습니다`)}else if(has(/그림|상징|아이콘/)){if(has(/빼|없애/)){D.sym=D.kind==='band'?'off':'none';D.syms=[]}else{const i=MOTIF.findIndex(m=>m[0]===D.sym);D.sym=MOTIF[(i+1)%(MOTIF.length-1)][0];D.syms=[]}did.push('그림을 바꿨습니다')}
  if(has(/값|가격/)&&has(/빼|없애|지워/)){D.price='';did.push('값을 뺐습니다')}else if((v=q.match(/(?:값|가격)\D*([\d,]+)\s*원?/))){D.price=v[1]+'원';did.push('값을 넣었습니다')}
  if(has(/딱지|동그라미/)&&has(/빼|없애|지워/)){D.badge='';did.push('딱지를 뺐습니다')}if(has(/책/)&&has(/빼|없애|지워/)&&!has(/목록/)){D.book='';D.author='';did.push('책 상자를 뺐습니다')}
  if(D.kind==='pop'){const si=has(/세로\s*(쓰기|글|느낌)|세워/)?4:has(/포스터/)?1:has(/여백|조용/)?2:has(/띠\s*(느낌|모양|로)|색\s*면/)?3:has(/기본\s*(느낌|으로|모양)/)?0:has(/느낌|스타일|분위기|다르게|다른\s*안/)?((D.st|0)+1)%STY.length:-1;if(si>=0){D.st=si;did.push(`느낌을 「${STY[si]}」로 했습니다`)}}
  const sz=q.match(/A([3456])/i);if(sz&&D.kind==='pop'){D.size={4:0,5:1,6:2,3:3}[sz[1]];did.push(`A${sz[1]} 크기로 했습니다`)}if(D.kind==='pop'&&has(/가로/)){D.land=true;did.push('가로로 돌렸습니다')}else if(D.kind==='pop'&&has(/세로/)){D.land=false;did.push('세로로 돌렸습니다')}
  const kd=[['band',/띠지/],['list',/목록/],['shelf',/이름표/],['pop',/POP|팝/i]].find(([k,re])=>re.test(q)&&has(/로|으로|만들|바꿔/));if(kd&&kd[0]!==D.kind){A.dKind({k:kd[0]});did.push(`${KINDS.find(x=>x[0]===kd[0])[1]}(으)로 바꿨습니다`)}
  const b=BR.find(x=>q.includes(x.n)||q.includes(BRAND[x.k]));if(b&&has(/로고|지점|이름/)){A.dBr({k:b.k});did.push(`${b.n}(${BRAND[b.k]})로 바꿨습니다`)}
  if(has(/bookstore|북스토어/i)){D.logo='book';did.push('Bookstore 로고로 했습니다')}if(has(/검정/)&&has(/로고/)){D.lc='k';did.push('로고를 검정으로 했습니다')}
  return did.length?did.join(' · '):null}
A.dChatQ=d=>{$('dchat').value=d.t;A.dChatGo()};
A.dChatGo=async()=>{const el=$('dchat'),q=(el.value||'').trim();if(!q)return;const log=S.ui.dlog;log.push({me:1,t:q});let r=dChat(q);
  if(!r&&AI&&!S.ui.busy){const D=S.ui.D,out=await ask('dchat',`서점 POP 편집기의 설정을 사용자의 말에 맞게 고쳐 주세요. 지금 설정(JSON): ${JSON.stringify({kind:D.kind,head:D.head,body:D.body,book:D.book,author:D.author,price:D.price,badge:D.badge,tag:D.tag,phrases:D.phrases,pal:D.pal,sym:D.sym,st:D.st|0,hs:D.hs})}\n고칠 수 있는 값: head(큰 문구, 줄바꿈 \\n), body, book, author, price, badge, tag, phrases(띠지 문구, 줄바꿈으로 4개까지), pal(0~${(D.kind==='band'?BANDC:POPC).length-1}), sym(${MOTIF.map(m=>m[0]).join('|')}), st(느낌 0 기본·1 포스터·2 여백·3 띠·4 세로쓰기), hs(제목 크기 배율 0.6~1.6).\n사용자의 말: ${q}\n바꿀 값만 담은 JSON 과 한 줄 설명으로 답하세요: {"set":{...},"say":"무엇을 바꿨는지"}. 확실하지 않은 사실(줄거리·수상·가격)은 지어내지 마세요.`,{modelTier:'quick'});
    if(out&&out.set){Object.entries(out.set).forEach(([k,v])=>{if(k in D&&['head','body','book','author','price','badge','tag','phrases','pal','sym','hs'].includes(k))D[k]=v});r=String(out.say||'고쳤습니다')}}
  log.push({t:r||'알아듣지 못했습니다. 이렇게 말해 보세요: 「제목을 긴 밤에는, 긴 소설로」 「제목 더 크게」 「색 밤으로」 「그림 달」 「값 빼」 「A4로」 「띠지로」 「초소 로고로」'});render();const n=$('dchat');if(n&&!S.ui.mic)n.focus()};
C.dChat=()=>{};
/* 음성: Claude 안에서는 받아쓰기 기능, 밖에서는 브라우저 음성 인식 */
let _rec=null;const micHeard=t=>{t=(t||'').trim();if(!t)return;const el=$('dchat');if(el){el.value=t;A.dChatGo()}};
A.dMic=()=>{if(DICT){if(S.ui.mic){DICT.stop().catch(()=>{});return}DICT.start().catch(e=>{S.ui.mic=false;toast(e&&e.code==='not_granted'?'마이크를 허용해야 말로 고칠 수 있습니다.':'지금은 듣지 못했습니다. 다시 눌러 주세요.');render()});return}
  const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return;if(_rec){_rec.stop();return}_rec=new R();_rec.lang='ko-KR';_rec.interimResults=false;_rec.onresult=e=>micHeard(e.results[0][0].transcript);_rec.onerror=e=>{toast(e.error==='not-allowed'?'마이크를 허용해야 말로 고칠 수 있습니다.':'듣지 못했습니다. 다시 눌러 주세요.')};_rec.onend=()=>{_rec=null;S.ui.mic=false;render()};S.ui.mic=true;render();try{_rec.start()}catch(e){_rec=null;S.ui.mic=false;render()}};
A.dPng=async()=>{try{if(document.fonts){await Promise.all(['800 20px Pretendard','500 20px Pretendard','700 20px "Gowun Batang"'].map(f=>document.fonts.load(f,'더숲')));await document.fonts.ready}}catch(e){}const D=S.ui.D,blob=await toPNG(layout(D));if(!blob){toast('그림을 만들지 못했습니다');return}
  await saveFile(`더숲_${KINDS.find(k=>k[0]===D.kind)[1].replace(/\s/g,'')}_${(D.head||D.phrases||D.book||'디자인').split('\n')[0].replace(/[\\/:*?"<>|\s]+/g,'_').slice(0,20)}.png`,blob)};
const dName=D=>`더숲_${KINDS.find(k=>k[0]===D.kind)[1].replace(/\s/g,'')}_${(D.head||D.phrases||D.book||'디자인').split('\n')[0].replace(/[\\/:*?"<>|\s,]+/g,'_').slice(0,20)}`;
A.dPdf=async()=>{try{if(document.fonts){await Promise.all(['800 20px Pretendard','500 20px Pretendard','700 20px "Gowun Batang"'].map(f=>document.fonts.load(f,'더숲')));await document.fonts.ready}}catch(e){}const J=window.jspdf&&window.jspdf.jsPDF;if(!J){toast('PDF 도구를 불러오지 못했습니다. PNG 로 받아 주세요.');return}
  const D=S.ui.D,L=layout(D),c=await toCanvas(L),doc=new J({orientation:L.w>L.h?'l':'p',unit:'mm',format:[L.w,L.h],compress:true});doc.addImage(c.toDataURL('image/jpeg',.95),'JPEG',0,0,L.w,L.h);await saveFile(dName(D)+'.pdf',doc.output('blob'))};

/* 되돌리기: 고치기 전 모습을 20개까지 기억 */
['dChatGo','dSt','dPick','dSym','dKind','dBr','dLand','dStr','dBook'].forEach(n=>{const f=A[n];A[n]=function(d){try{const H=S.ui.dH=S.ui.dH||[];if(S.ui.D){H.push(JSON.stringify(S.ui.D));if(H.length>20)H.shift()}}catch(e){}return f.call(this,d)}});
A.dUndo=()=>{const H=S.ui.dH||[];if(H.length){S.ui.D=JSON.parse(H.pop());render()}};
