"""스스로 점검: 지점마다 주요 화면을 열고, 화면 안 모든 버튼을 하나씩 눌러 본다.
누를 때마다: 자바스크립트 오류 · 가로 넘침 · 뒤로 가기로 원래 화면에 돌아오는지 · 겹친 창에 닫기가 보이는지 · 너무 작은 버튼.
python3 tests/crawl.py [폭]  → /tmp/crawl.json, 문제 목록 출력"""
import asyncio,subprocess,os,sys,time,json
from playwright.async_api import async_playwright
here=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W=int(sys.argv[1]) if len(sys.argv)>1 else 360
srv=subprocess.Popen([sys.executable,'-m','http.server','8770'],cwd=here,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
SCREENS=[('aka','store','cur'),('aka','aka','space'),('aka','aka','design'),('aka','aka','insta'),('aka','aka','arc'),('nowon','store','cur'),('nowon','store','design')]
SKIP={'lock','big','print','dl','share','arcAdd','arcTake','arcWipe','arcDel','fbSend','sendGo','setAll','igSave','popSave','gsTake','mic','micTo','camTo','arcPh','pl3Ph','upFile','imp','agSend','dpVideo','dpShot'}
STATE="JSON.stringify([S.mode,S.view[S.mode],S.br,S.ui.cOpen==null?null:S.ui.cOpen,!!document.getElementById('guide'),!!document.getElementById('agent'),document.getElementById('sheet').classList.contains('on')])"
OPEN="(()=>{const o=[];const g=document.getElementById('guide');if(g)o.push(g);const a=document.getElementById('agent');if(a&&getComputedStyle(a).display!='none')o.push(a);const s=document.getElementById('sheet');if(s.classList.contains('on'))o.push(s);const c=document.querySelector('.cvlayer');if(c)o.push(c);return o.map(e=>{const B=[...e.querySelectorAll('button,a')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<innerHeight&&/닫기|✕|×|←|이전|돌아|취소/.test(b.textContent+(b.getAttribute('aria-label')||''))});return (e.id||e.className)+':'+(B.length?'ok':'닫기 없음')})})()"
async def main():
  probs=[];n=0
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg=await b.new_page(viewport={'width':W,'height':700});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
    pg.on('dialog',lambda d:asyncio.ensure_future(d.dismiss()))
    await pg.add_init_script("sessionStorage.setItem('sj.gdS','1');localStorage.setItem('gdSeen','1');window.open=()=>null")
    async def home(br,m,v):
      await pg.goto('http://127.0.0.1:8770/index.html');await pg.wait_for_timeout(900)
      await pg.evaluate(f"S.locked=false;S.loaded=true;document.getElementById('lock').style.display='none';A.place({{k:'{br}'}});S.mode='{m}';S.view['{m}']='{v}';render()");await pg.wait_for_timeout(400)
    for br,m,v in SCREENS:
      await home(br,m,v)
      acts=await pg.evaluate("""[...document.querySelectorAll('main [data-a]')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.height>0}).map(b=>[b.dataset.a,JSON.stringify(b.dataset),(b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,18)])""")
      seen=set();small=await pg.evaluate("""[...document.querySelectorAll('main button')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.height>0&&(r.height<28||r.width<28)}).map(b=>(b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,14)).slice(0,8)""")
      if small:probs.append({'곳':f'{br}/{v}','문제':'작은 버튼','것':small})
      for a,ds,t in acts:
        k=(a,t)
        if a in SKIP or k in seen:continue
        seen.add(k);n+=1
        await home(br,m,v);errs.clear()
        s0=await pg.evaluate(STATE)
        ok=await pg.evaluate(f"(()=>{{const d={ds};const e=[...document.querySelectorAll('main [data-a]')].find(b=>JSON.stringify(b.dataset)===JSON.stringify(d));if(!e)return false;e.click();return true}})()")
        if not ok:continue
        await pg.wait_for_timeout(450)
        where=f'{br}/{v} 「{t}」({a})'
        if errs:probs.append({'곳':where,'문제':'오류','것':errs[:2]})
        sw=await pg.evaluate('document.documentElement.scrollWidth')
        if sw>W+1:probs.append({'곳':where,'문제':'가로 넘침','것':sw})
        for o in await pg.evaluate(OPEN):
          if o.endswith('닫기 없음'):probs.append({'곳':where,'문제':'겹친 창에 닫기가 안 보임','것':o})
        s1=await pg.evaluate(STATE)
        if s1!=s0:
          for _ in range(4):
            await pg.evaluate('history.back()');await pg.wait_for_timeout(350)
            if await pg.evaluate(STATE)==s0:break
          s2=await pg.evaluate(STATE)
          if s2!=s0:probs.append({'곳':where,'문제':'뒤로 가기로 못 돌아옴','것':[s0,s1,s2]})
    await b.close()
  srv.terminate()
  json.dump(probs,open('/tmp/crawl.json','w'),ensure_ascii=False,indent=1)
  print(f'{W}폭 · 버튼 {n}개 눌러 봄 · 문제 {len(probs)}건')
  for x in probs:print(' -',x['곳'],'|',x['문제'],'|',json.dumps(x['것'],ensure_ascii=False)[:160])
asyncio.run(main())
