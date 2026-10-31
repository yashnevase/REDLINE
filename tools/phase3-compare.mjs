import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
process.env.PLAYWRIGHT_BROWSERS_PATH??=fileURLToPath(new URL('../.cache/ms-playwright',import.meta.url));
const browser=await chromium.launch();try{const page=await browser.newPage({viewport:{width:2560,height:760}});const a=(await readFile('art/targets/spirit-call/combat-lava-aoe.png')).toString('base64'),b=(await readFile('shots/phase3/boss-desktop.png')).toString('base64');await page.setContent(`<body style="margin:0;background:#17202a;color:#eee;font:16px Arial"><div style="display:flex"><section>Spirit Call study target<img width="1280" height="720" src="data:image/png;base64,${a}"></section><section>REDLINE boss visual preview · no boss gameplay yet<img width="1280" height="720" src="data:image/png;base64,${b}"></section></div></body>`);await page.screenshot({path:'shots/phase3/comparison.png'});}finally{await browser.close();}
