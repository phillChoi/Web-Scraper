const puppeteer = require('puppeteer-extra');
const randomUseragent = require('random-useragent');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlockerPlugin({ blockTrackers: true}));

async function scrape(){
    console.log('Running tests..')
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 })
    await page.goto('https://www1.gogoanime.ai/one-piece-episode-900');
    const [e1] = await page.$x('//*[@id="wrapper_bg"]/section/section[1]/div[1]/div[1]/div[1]/h2');
    const src = e1.getProperty('textContent');
    console.log(src);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'testresult.png', fullPage: true });
    await browser.close()
    console.log(`All done, check the screenshot. ✨`);
  };
  scrape();

/*
async function scrapeVideo(url){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('video');
    //const layout = await page.querySelector("video");

    //console.log(layout);
}


scrapeVideo("https://twist.moe/a/one-punch-man/1");
*/
/*
async function scrapePage(url){
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto(url);


    
    const [e1] = await page.$x('//*[@id="landingImage"]');
    const src = await e1.getProperty('src');
    const srcText = await src.jsonValue();
    
    
    const [e2] = await page.$x('//*[@id="productTitle"]');
    const txt = await e2.getProperty('textContent');
    console.log(txt);
    
    const rawText = await txt.jsonValue();

    console.log({srcText,rawText});
    browser.close();
}

scrapePage('https://www.amazon.com/HiFiHear-Earphone-Diaphragm-Headphone-Detachable/dp/B07TZ2NQCF');

*/
