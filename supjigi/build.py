#!/usr/bin/env python3
"""올리기 전에 한 번: python3 build.py
- 모든 <script src="*.js"> 에 같은 판 번호(?v=월일시분)를 붙인다 → 고친 파일을 휴대폰이 옛것으로 보여 주지 않는다.
- version.txt 와 index.html 맨 위 「새 판 자동 받기」의 B 값을 같은 번호로 맞춘다.
- 같은 이름을 두 파일이 맨 위에서 const/let 으로 선언하면 멈춘다(앱 전체가 깨지는 원인)."""
import re, os, sys, time, glob
here = os.path.dirname(os.path.abspath(__file__))
os.chdir(here)
B = time.strftime('%m%d%H%M', time.gmtime(time.time() + 9 * 3600)) if len(sys.argv) < 2 else sys.argv[1]
s = open('index.html', encoding='utf-8').read()
srcs = re.findall(r'<script src="([a-z0-9_]+\.js)(?:\?v=[^"]*)?"></script>', s)
# 맨 위 선언 겹침 검사
seen = {}
bad = []
for f in srcs:
    for m in re.finditer(r'^(?:const|let|class)\s+([A-Za-z_$][\w$]*)', open(f, encoding='utf-8').read(), re.M):
        n = m.group(1)
        if n in seen and seen[n] != f:
            bad.append(f'{n}: {seen[n]} / {f}')
        seen.setdefault(n, f)
if bad:
    print('겹치는 맨 위 이름:\n  ' + '\n  '.join(bad)); sys.exit(1)
s = re.sub(r'<script src="([a-z0-9_]+\.js)(?:\?v=[^"]*)?"></script>', lambda m: f'<script src="{m.group(1)}?v={B}"></script>', s)
s = re.sub(r"(/\*새 판 자동 받기\*/\(function\(\)\{var B=')[^']*'", lambda m: m.group(1) + B + "'", s)
open('index.html', 'w', encoding='utf-8').write(s)
open('version.txt', 'w').write(B + '\n')
print(f'판 {B} · 스크립트 {len(srcs)}개')
