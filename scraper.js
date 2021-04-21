const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: true }).then(async browser => {
    console.log('Running tests..')
    const page = await browser.newPage()
    await page.goto('https://twist.moe/a/one-punch-man/1')
    await page.waitForTimeout(5000)
    await page.screenshot({ path: 'testresult.png', fullPage: true })
    await browser.close()
    console.log(`All done, check the screenshot. ✨`)
  })


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
