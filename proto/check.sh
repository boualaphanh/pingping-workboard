#!/usr/bin/env bash
# PingPing prototype — mechanical gate (design spec §8, checks 5, 6 and 8).
# Run from anywhere:  bash proto/check.sh
set -uo pipefail
cd "$(dirname "$0")"

fail=0
say() { printf '%s\n' "$*"; }

# ---- 8. no network calls anywhere outside vendor/ ---------------------------
hits=$(grep -rnE '\bfetch\(|XMLHttpRequest|new WebSocket|EventSource|navigator\.sendBeacon' \
        --include='*.html' --include='*.js' --include='*.css' . \
        | grep -v '^\./vendor/' || true)
if [ -n "$hits" ]; then
  say "FAIL  network call found (spec §1.1 — this prototype calls nothing):"
  say "$hits"
  fail=1
else
  say "ok    no network calls outside vendor/"
fi

# ---- 5. no colour literal in a screen file ----------------------------------
hits=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' screens/ || true)
if [ -n "$hits" ]; then
  say "FAIL  colour literal in a screen file (spec §8.5 — tokens only):"
  say "$hits"
  fail=1
else
  say "ok    no colour literals in screens/"
fi

# ---- 6 + i18n integrity + four states ---------------------------------------
python3 - <<'PY' || fail=1
import re, os, sys

ok = True
def bad(msg):
    global ok
    ok = False
    print(msg)

def keys(path):
    src = open(path, encoding='utf-8').read()
    body = src[src.index('{', src.index('window.PP_I18N.')):]
    return set(re.findall(r'^\s{2}(\w+):', body, re.M))

en, lo = keys('i18n/en.js'), keys('i18n/lo.js')
if en - lo: bad("FAIL  keys missing from lo.js: %s" % sorted(en - lo))
if lo - en: bad("FAIL  keys missing from en.js: %s" % sorted(lo - en))
if en == lo: print("ok    en.js and lo.js carry the same %d keys" % len(en))

# screens whose missing states are documented in spec §6
EXCEPT = {'P01': {'loading','empty','error'},
          'P06': {'loading','empty'},
          'K03': {'loading','empty'},
          'K09': {'loading','empty'}}
ALL = {'ok','loading','empty','error'}

used = set()
for name in sorted(os.listdir('screens')):
    if not name.endswith('.html'):
        continue
    sid = name[:-5]
    src = open(os.path.join('screens', name), encoding='utf-8').read()
    used |= set(re.findall(r'data-i18n="([\w]+)"', src))
    # keys a screen's own script resolves at runtime, e.g. PP.t("p10_silent") or c.dwellKey
    used |= set(re.findall(r'PP\.t\(\s*"(\w+)"', src))
    used |= set(re.findall(r'data-i18n-attr="([^"]+)"', src) and
                re.findall(r'[\w-]+:(\w+)', ' '.join(re.findall(r'data-i18n-attr="([^"]+)"', src))) or [])
    have = set(re.findall(r'data-state-view="(\w+)"', src))
    want = ALL - EXCEPT.get(sid, set())
    if not want <= have:
        bad("FAIL  %s is missing state view(s): %s" % (sid, sorted(want - have)))

missing = sorted(k for k in used if k not in en)
if missing:
    bad("FAIL  data-i18n keys with no string in en.js: %s" % missing)
else:
    print("ok    every data-i18n key resolves (%d keys used)" % len(used))

# keys named by the fixture rather than by a literal in a screen
import json
fx = open('fixtures/seed.js', encoding='utf-8').read()
used |= set(re.findall(r'(?:Key|key): "(\w+)"', fx))

unused = sorted(en - used - {k for k in en if k.startswith('common_')})
if unused:
    print("note  strings defined but not used yet (future screens): %d" % len(unused))

sys.exit(0 if ok else 1)
PY

# ---- every fixture path a screen names resolves ------------------------------
if command -v node >/dev/null 2>&1; then
  node check-paths.js || fail=1
fi

# ---- every script parses ----------------------------------------------------
if command -v node >/dev/null 2>&1; then
  for f in shell/*.js i18n/*.js fixtures/*.js check-paths.js; do
    if ! node --check "$f" >/dev/null 2>&1; then
      say "FAIL  $f does not parse"
      fail=1
    fi
  done
  [ "$fail" -eq 0 ] && say "ok    every script parses"
else
  say "note  node not found — skipped the parse check"
fi

if [ "$fail" -ne 0 ]; then
  say ""
  say "GATE FAILED"
  exit 1
fi
say ""
say "GATE CLEAN"
