#!/usr/bin/env bash
# Runs Lighthouse (mobile + desktop) on the main pages of a running local build. Usage: bash scripts/lighthouse.sh [baseUrl]
BASE=${1:-http://localhost:3000}
export CHROME_PATH=${CHROME_PATH:-"C:/Program Files/Google/Chrome/Application/chrome.exe"}
mkdir -p docs/lighthouse; : > docs/lighthouse/SUMMARY.txt
for u in "/:home" "/checkout:checkout" "/advertise:advertise" "/terms:terms" "/privacy:privacy"; do
  path=${u%%:*}; name=${u##*:}
  for preset in mobile desktop; do
    if [ $preset = desktop ]; then extra="--preset=desktop"; else extra="--form-factor=mobile"; fi
    npx -y lighthouse@12 "$BASE$path" $extra --chrome-flags="--headless=new" --output=json --output=html --output-path="docs/lighthouse/$name-$preset" --quiet >/dev/null 2>&1
    node -e "const r=require('./docs/lighthouse/$name-$preset.report.json');console.log('$name'.padEnd(10),'$preset'.padEnd(8), Object.values(r.categories).map(c=>c.id+'='+Math.round(c.score*100)).join(' '), 'LCP='+r.audits['largest-contentful-paint'].displayValue, 'CLS='+r.audits['cumulative-layout-shift'].displayValue, 'TBT='+r.audits['total-blocking-time'].displayValue)" | tee -a docs/lighthouse/SUMMARY.txt
  done
done
rm -f docs/lighthouse/*.report.json
