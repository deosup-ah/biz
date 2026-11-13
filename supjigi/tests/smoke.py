"""올리기 전 점검: python3 tests/smoke.py  (로컬 서버를 스스로 띄움)
화면마다 열어 오류 · 가로 넘침을 찾고 /tmp/smoke_*.png 로 남긴다."""
import asyncio, subprocess, os, sys, time
from playwright.async_api import async_playwright
here=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
srv=subprocess.Popen([sys.executable,'-m','http.server','8765'],cwd=here,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
os.environ['NO_PROXY']='127.0.0.1'
STEPS=[('home',"A.place({k:'aka'});S.mode='store';S.view.store='cur';render()"),
 ('arc',"A.place({k:'aka'});A.go({v:'arc',m:'aka'})"),
 ('space',"A.place({k:'aka'});A.go({v:'space',m:'aka'})"),
 ('design',"A.place({k:'aka'});A.go({v:'design',m:'aka'})"),
 ('insta',"A.place({k:'aka'});A.go({v:'insta',m:'aka'})"),
 ('nowon',"A.place({k:'nowon'});S.mode='store';S.view.store='cur';render()"),
 ('guide',"S.ui.gdTab='a';S.ui.gd=0;gdDraw()"),
 ('guide_soon',"S.ui.gd=7;gdDraw()"),('guide_rule',"S.ui.gd=8;gdDraw()"),('guide_b',"S.ui.gdTab='b';gdDraw()")]
async def main():
  bad=0
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for w,h in [(360,660),(1440,900)]:
      pg=await b.new_page(viewport={'width':w,'height':h});errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.add_init_script("sessionStorage.setItem('sj.gdS','1');localStorage.setItem('gdSeen','1')")
      await pg.goto('http://127.0.0.1:8765/index.html');await pg.wait_for_timeout(1500)
      await pg.evaluate("S.locked=false;S.loaded=true;document.getElementById('lock').style.display='none'")
      for n,js in STEPS:
        try:await pg.evaluate(js)
        except Exception as e:errs.append(f'{n}: {e}')
        await pg.wait_for_timeout(500)
        sw=await pg.evaluate("document.documentElement.scrollWidth")
        if sw>w+1:errs.append(f'{n}: 가로 넘침 {sw}')
        await pg.screenshot(path=f'/tmp/smoke_{w}_{n}.png')
      print(w,'오류 없음' if not errs else errs);bad+=len(errs)
    await b.close()
  srv.terminate();sys.exit(1 if bad else 0)
asyncio.run(main())
