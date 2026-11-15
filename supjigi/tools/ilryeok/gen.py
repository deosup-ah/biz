import asyncio
from playwright.async_api import async_playwright
G='#0f3a2e';R='#c8553d';INK='#24231f';MU='#8b877b';PAPER='#fbf8f1';LINE='#bdb6a5'
FONT="""@font-face{font-family:P;font-weight:400;src:url(pretendard-400.woff)}@font-face{font-family:P;font-weight:600;src:url(pretendard-600.woff)}@font-face{font-family:P;font-weight:800;src:url(pretendard-800.woff)}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:P,sans-serif;background:#fff}.sr{font-family:'Noto Serif CJK KR',serif}.a{position:absolute}"""
def cover():
  holes=''.join(f'<i class="a" style="top:7mm;left:{58+k*94}mm;width:6mm;height:6mm;border-radius:50%;background:{PAPER};box-shadow:inset 0 .6mm 1mm rgba(0,0,0,.35)"></i>' for k in range(2))
  wk=lambda d,col:f'<span style="font:600 6.5pt P;color:{col}">{d}</span>'
  return f'''<div id="s" style="position:relative;width:210mm;height:297mm;background:{PAPER};overflow:hidden">
  <div class="a" style="left:0;top:0;width:210mm;height:20mm;background:{G}"></div>{holes}
  <div class="a" style="left:22mm;top:28mm;font:600 8pt P;letter-spacing:.24em;color:{MU}">THE LAST PAGE · THE FIRST PAGE</div>
  <!-- 아래 장: 2027.1.1 -->
  <div class="a" style="left:22mm;top:38mm;width:166mm;height:140mm;background:#fff;box-shadow:0 1.2mm 3mm rgba(0,0,0,.12)">
    <div style="height:15mm;background:{R};color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 8mm;font:800 11pt P;letter-spacing:.12em"><span>2027 · JANUARY</span><span>금</span></div>
    <div class="sr a" style="right:10mm;bottom:6mm;font-size:86mm;font-weight:700;line-height:.8;color:{R}">1</div>
    <div class="a" style="right:12mm;bottom:96mm;font:600 9pt P;color:{R};text-align:right;line-height:1.5">내년의<br>첫 한 권</div>
  </div>
  <!-- 위 장: 2026.12.31, 오른쪽 아래가 넘어가는 중 -->
  <div class="a" style="left:22mm;top:38mm;width:166mm;height:140mm;background:{PAPER};clip-path:polygon(0 0,100% 0,100% 38%,46% 100%,0 100%);border:.3mm solid #e4dfd2">
    <div style="height:15mm;background:{G};color:{PAPER};display:flex;align-items:center;justify-content:space-between;padding:0 8mm;font:800 11pt P;letter-spacing:.12em"><span>2026 · DECEMBER</span><span>목</span></div>
    <div class="sr a" style="left:9mm;top:24mm;font-size:90mm;font-weight:700;line-height:.8;color:{G};letter-spacing:-.04em">31</div>
    <div class="a" style="left:10mm;bottom:10mm;font:600 9pt P;color:{G};line-height:1.5">올해의<br>한 권</div>
  </div>
  <!-- 넘어가는 귀퉁이 -->
  <div class="a" style="left:22mm;top:38mm;width:166mm;height:140mm;pointer-events:none;clip-path:polygon(100% 38%,46% 100%,40% 54%);background:linear-gradient(225deg,#e9e3d3 0%,#f7f3ea 45%,#ddd5c1 100%);filter:drop-shadow(-1.5mm 1.5mm 2mm rgba(0,0,0,.25))"></div>
  <div class="sr a" style="left:22mm;top:186mm;width:166mm;font-size:23pt;font-weight:700;line-height:1.38;color:{INK}">올해의 한 권이<br>내년의 첫 한 권에게</div>
  <div class="a" style="left:22mm;top:215mm;font:400 11.5pt P;color:{MU};line-height:1.6">마지막으로 덮은 책이, 누군가의 첫 장이 됩니다.</div>
  <div class="a" style="left:22mm;top:228mm;width:166mm;height:19mm;background:{G};color:{PAPER};display:flex;align-items:center;justify-content:space-between;padding:0 8mm">
    <span style="font:800 16pt P;letter-spacing:-.01em">한 장 넘겨, 뒷장에 적어 주세요</span>
    <svg width="12mm" height="12mm" viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="{PAPER}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  <div class="a" style="left:22mm;top:253mm;width:135mm;font:800 15pt P;color:{G};line-height:1.5">적어 주신 종이는 모두는 아니지만 추려서,<br>그 책과 어울리는 서가에 책과 함께 둡니다</div>
  <div class="a" style="left:22mm;top:276mm;width:166mm;font:600 11pt P;color:{MU}">올해 읽은 책 중 기억에 남은 한 권, 또는 내년에 가장 먼저 읽고 싶은 한 권</div>
  <img class="a" src="logo-g.png" style="right:22mm;top:257mm;height:11mm">
  </div>'''
import random
SAMPLE={
 0:dict(ck={'올해의 한 권','가명'},font="'Noto Sans CJK KR'",wt=300,col='#2a4fa0',filt='r1',sk=-4,
   name='급류 탄 여름이',title='급류 — 정대건',words=['읽다가 버스 두 정거장 지나침;;','책임지세요 ㅋㅋ (진짜 물살임)'],doodle=True,sign=False),
 2:dict(ck={'올해의 한 권','필명'},font="'Noto Sans CJK KR'",wt=400,col='#1f2f4f',filt='r3',sk=0,jit=.25,
   name='밤산책',title='작별하지 않는다 — 한강',words=['눈 오는 날마다 다시 펼쳐요.','올해 내 겨울은 이 책이었어요.'],doodle=False,sign=False),
 1:dict(ck={'내년의 첫 한 권','서명'},font="'Noto Serif CJK KR'",wt=400,col='#2b2a27',filt='r2',sk=2,
   name='',title='난장이가 쏘아올린 작은 공',words=['부끄러워서 미뤄 둔 책.','내년엔 끝까지 읽겠습니다.'],doodle=False,sign=True)}
def hw(t,S,size,seed):
  rnd=random.Random(seed);o='';J=S.get('jit',1)
  for ch in t:
    if ch==' ':o+='<span style="display:inline-block;width:.32em"></span>';continue
    o+=f'<span style="display:inline-block;transform:translateY({rnd.uniform(-.55,.55)*J:.2f}mm) rotate({rnd.uniform(-7,7)*J:.1f}deg) scale({1+rnd.uniform(-.1,.1)*J:.2f})">{ch}</span>'
  return f'<span style="font-family:{S["font"]};font-weight:{S["wt"]};font-size:{size}pt;color:{S["col"]};filter:url(#{S["filt"]});display:inline-block;transform:rotate({S["sk"]*.25}deg) skewX({S["sk"]}deg);white-space:nowrap;letter-spacing:-.02em">{o}</span>'
def tick(col,seed):
  r=random.Random(seed);a=r.uniform(-.6,.6)
  return f'<svg style="position:absolute;left:-1.2mm;top:-2.4mm;overflow:visible" width="6mm" height="5.6mm" viewBox="0 0 24 22"><path d="M2 12 C5 14 7 17 9 20 C12 12 16 6 23 {1+a}" fill="none" stroke="{col}" stroke-width="2.4" stroke-linecap="round" filter="url(#r1)"/></svg>'
def cell(i,c):
  nc=G;S=SAMPLE.get(i)
  bg='#fbf8f1' if (i//3+c)%2==0 else '#f4efe3'
  def ck(t,col=INK):
    m=tick(S['col'],hash(t)%97) if S and t in S['ck'] else ''
    return f'<span style="display:inline-flex;align-items:center;gap:1.1mm;color:{col};white-space:nowrap"><i style="position:relative;width:3.4mm;height:3.4mm;border:.4mm solid {col};border-radius:50%">{m}</i>{t}</span>'
  lab=lambda t:f'<div style="font:800 7.2pt P;color:{MU};letter-spacing:.02em">{t}</div>'
  def ln(h,st='solid',fill=''):
    return f'<div style="position:relative;border-bottom:.3mm {st} {LINE};height:{h}mm"><div style="position:absolute;left:1mm;bottom:.6mm">{fill}</div></div>'
  F=lambda k,size,seed:hw(S[k],S,size,seed) if S and S.get(k) else ''
  W=lambda n:hw(S['words'][n],S,10.5,40+n+i*7) if S else ''
  sig=('<svg style="position:absolute;left:2mm;bottom:-.4mm" width="34mm" height="9mm" viewBox="0 0 136 36"><path d="M4 26 C10 6 18 4 20 16 C22 28 14 32 16 20 C18 10 30 8 32 18 C33 26 36 26 40 16 C44 6 46 22 50 22 C56 22 54 10 62 12 C70 14 62 30 72 26 C82 22 86 10 96 14 C104 18 98 28 110 22 C118 18 124 16 132 18" fill="none" stroke="#2b2a27" stroke-width="2" stroke-linecap="round" filter="url(#r2)"/><path d="M30 31 C60 27 92 28 120 30" fill="none" stroke="#2b2a27" stroke-width="1.4" stroke-linecap="round" filter="url(#r2)"/></svg>') if S and S.get('sign') else ''
  doodle=('<svg style="position:absolute;right:5mm;top:31mm" width="22mm" height="17mm" viewBox="0 0 88 68" filter="url(#r1)"><g fill="none" stroke="#2a4fa0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22 C20 16 32 16 44 24 C56 16 68 16 80 22 L80 58 C68 52 56 52 44 60 C32 52 20 52 8 58 Z"/><path d="M44 24 L44 60"/><path d="M14 30 C22 27 30 27 38 31 M14 38 C22 35 30 35 38 39 M50 31 C58 27 66 27 74 30"/><path d="M2 64 C10 58 16 68 24 62 C32 56 38 68 46 62 C54 56 60 68 68 62 C76 56 80 66 86 62"/><path d="M58 6 L62 14 M70 4 L68 12 M80 10 L74 15"/></g></svg>') if S and S.get('doodle') else ''
  return f'''<div style="position:relative;background:{bg};padding:0 6mm;overflow:hidden">
   <div style="display:flex;align-items:flex-end;justify-content:space-between;padding-top:5mm;padding-bottom:2.4mm;border-bottom:.4mm solid {nc}">
     <div style="display:flex;align-items:flex-end;gap:2.4mm"><span style="position:relative;display:block;width:24mm;height:10.5mm"><span class="sr" style="position:absolute;left:0;top:0;font-size:12.5pt;font-weight:700;line-height:1;color:{G};letter-spacing:-.02em">2026</span><span style="position:absolute;left:13.2mm;top:.2mm;width:0;height:10.4mm;border-left:.35mm solid {MU};transform:rotate(28deg);transform-origin:top"></span><span class="sr" style="position:absolute;left:11.2mm;top:5.2mm;font-size:12.5pt;font-weight:700;line-height:1;color:{R};letter-spacing:-.02em">2027</span></span>
       <span style="font:600 6pt P;color:{MU};letter-spacing:.1em;line-height:1.4;padding-bottom:.4mm"><b style="font:800 8.2pt P;color:{G};letter-spacing:.06em">사유의숲</b></span></div>
     <img src="logo-g.png" style="height:4.4mm;margin-bottom:.6mm"></div>
   <div style="margin-top:3.4mm;font:800 7.4pt P;color:{nc}">체크해 주세요</div>
   <div style="display:flex;gap:3.6mm;margin-top:1.8mm;font:800 7.8pt P">{ck('올해의 한 권',G)}{ck('내년의 첫 한 권',R)}</div>
   <div style="display:flex;gap:3.2mm;margin-top:1.8mm;font:800 7.6pt P">{ck('실명')}{ck('가명')}{ck('필명')}{ck('서명')}</div>
   <div style="margin-top:2.6mm;display:flex;align-items:flex-end;gap:2.5mm"><span style="font:800 7.2pt P;color:{MU};white-space:nowrap">이름</span><span style="position:relative;flex:1;border-bottom:.3mm solid {LINE};height:6.5mm"><span style="position:absolute;left:1.5mm;bottom:.5mm">{F('name',11,i*13+1)}</span>{sig}</span></div>
   <div style="margin-top:4.4mm">{lab('책 제목')}{ln(9,'solid',F('title',13 if i==0 else 11.5,i*13+2))}</div>
   <div style="margin-top:3.6mm">{lab('이 책인 이유, 한마디')}{ln(9,'dotted',W(0))}{ln(9,'dotted',W(1))}</div>
   {doodle}
  </div>'''
def cuts(top,cols,rows):
  x0,y0,w,h=12,top+4,273,420-top-14
  o=''
  for k in range(cols+1):
    x=x0+w*k/cols;o+=f'<div class="a" style="left:{x-.1}mm;top:{y0}mm;height:{h}mm;border-left:.25mm dashed #9d9686"></div><div class="a" style="left:{x-.1}mm;top:{y0-4}mm;height:3mm;border-left:.25mm solid #444"></div><div class="a" style="left:{x-.1}mm;top:{y0+h+1}mm;height:3mm;border-left:.25mm solid #444"></div>'
  for k in range(rows+1):
    y=y0+h*k/rows;o+=f'<div class="a" style="top:{y-.1}mm;left:{x0}mm;width:{w}mm;border-top:.25mm dashed #9d9686"></div><div class="a" style="top:{y-.1}mm;left:{x0-5}mm;width:4mm;border-top:.25mm solid #444"></div><div class="a" style="top:{y-.1}mm;left:{x0+w+1}mm;width:4mm;border-top:.25mm solid #444"></div>'
  o+=f'<svg class="a" style="left:{x0+3}mm;top:{y0-2.1}mm;background:#fff" width="5mm" height="4.2mm" viewBox="0 0 24 20"><circle cx="5" cy="5" r="3.2" fill="none" stroke="#666" stroke-width="1.5"/><circle cx="5" cy="15" r="3.2" fill="none" stroke="#666" stroke-width="1.5"/><path d="M8 7l14 9M8 13l14-9" stroke="#666" stroke-width="1.5"/></svg>'
  return o
def a3(cols=3,rows=4):
  top=24
  cells=''.join(cell(i,i%cols) for i in range(cols*rows))
  return f'''<div id="s" style="position:relative;width:297mm;height:420mm;background:#fff;overflow:hidden"><svg width="0" height="0" style="position:absolute"><filter id="r1"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter><filter id="r2"><feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="1" seed="9"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter><filter id="r3"><feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="1" seed="2"/><feDisplacementMap in="SourceGraphic" scale="0.9"/></filter></svg>
   <div class="a" style="left:0;top:0;width:297mm;height:{top}mm;border-bottom:.5mm solid {G};display:flex;align-items:flex-end;justify-content:space-between;padding:0 12mm 4mm">
     <span class="sr" style="font-size:15pt;font-weight:700;color:{INK}">올해의 한 권이 <span style="color:{R}">내년의 첫 한 권에게</span></span>
     <span style="font:600 8.5pt P;color:{G}">한 칸에 한 권 · 추려서, 어울리는 서가에 이 종이와 함께 둡니다</span></div>
   <div class="a" style="left:12mm;top:{top+4}mm;width:273mm;height:{420-top-14}mm;display:grid;grid-template-columns:repeat({cols},1fr);grid-template-rows:repeat({rows},1fr)">{cells}</div>{cuts(top,cols,rows)}
   <div class="a" style="left:16mm;bottom:4mm;font:400 7pt P;color:{MU}">모든 칸이 놓이지는 않아요. 추려서, 그 책과 의미가 맞는 서가에 이 종이를 함께 둡니다 · 연락처는 적지 않습니다 · 위쪽은 스테이플러 자리</div>
   <img class="a" src="logo-g.png" style="right:12mm;bottom:3.5mm;height:5mm"></div>'''
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for name,body,dsf in (('1_표지_A4',cover(),300/96*1.4143),('2_적는장_A3_12칸',a3(),300/96)):
      pg=await b.new_page(viewport={'width':1200,'height':1700},device_scale_factor=dsf)
      open('t.html','w').write(f'<html><head><meta charset="utf-8"><style>{FONT}</style></head><body>{body}</body></html>')
      await pg.goto('file://'+__import__('os').path.abspath('t.html')+'');await pg.wait_for_timeout(600)
      await pg.locator('#s').screenshot(path=name+'.png');await pg.close()
    await b.close()
asyncio.run(main())
