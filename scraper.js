const puppeteer = require('puppeteer');

async function scrapePage(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);


    
    const [e1] = await page.$x('//*[@id="landingImage"]');
    const src = await e1.getProperty('src');
    const srcText = await src.jsonValue();
    
    
    const [e2] = await page.$x('//*[@id="productTitle"]');
    const txt = await e2.getProperty('textContent');
    const rawText = await txt.jsonValue();

    console.log({srcText,rawText});
    browser.close();
}

scrapePage('https://www.amazon.com/HiFiHear-Earphone-Diaphragm-Headphone-Detachable/dp/B07TZ2NQCF');
