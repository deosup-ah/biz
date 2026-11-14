import asyncio,subprocess,sys,time
from playwright.async_api import async_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8779'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome');pg=await b.new_page(viewport={'width':360,'height':700},has_touch=True)
    er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    await pg.add_init_script("sessionStorage.setItem('sj.gdS','1');localStorage.setItem('gdSeen','1')")
    await pg.goto('http://127.0.0.1:8779/index.html');await pg.wait_for_timeout(1200)
    await pg.evaluate("S.locked=false;S.loaded=true;document.getElementById('lock').style.display='none';A.place({k:'aka'});S.mode='store';S.view.store='cur';render()");await pg.wait_for_timeout(400)
    st=lambda: pg.evaluate("[S.mode+':'+S.view[S.mode],S.br,!!document.querySelector('main>.bkbar'),document.querySelector('#dial .cur')?.textContent]")
    for t in ['공간','만들기','아카이브','큐레이션']:
      await pg.click(f'#dial button:has-text("{t}")');await pg.wait_for_timeout(500);print(t,await st())
    await pg.click('.brpick');await pg.wait_for_timeout(300);await pg.click('.brpk button:has-text("노원")');await pg.wait_for_timeout(500);print('노원',await st())
    await pg.go_back();await pg.wait_for_timeout(500);print('back',await st())
    await pg.go_back();await pg.wait_for_timeout(500);print('back',await st())
    await pg.evaluate("A.gdOpen()");await pg.wait_for_timeout(500);await pg.click('#guide [data-a=gdClose]');await pg.wait_for_timeout(500);print('guide closed',await pg.evaluate("!document.getElementById('guide')"))
    await pg.click('#dial button:has-text("공간")');await pg.wait_for_timeout(500);await pg.go_back();await pg.wait_for_timeout(500);print('back after guide',await st())
    print('errors',er)
    await b.close()
  srv.terminate()
asyncio.run(m())
