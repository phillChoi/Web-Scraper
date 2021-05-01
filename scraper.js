const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
//puppeteer.use(StealthPlugin());
//puppeteer.use(AdBlockerPlugin({ blockTrackers: true}));

puppeteer.launch({headless:true}).then(async browser => {

    // Open new page in browser
    const page = await browser.newPage();

    // Navigate to URL on the new page
    await page.goto('https://twist.moe/a/one-punch-man/1');

    // Wait for video tag to load on the website
    await page.waitForSelector('video');

    // Wait for 1000 milliseconds -- this was to prevent scraper from returning null for whatever reason
    await page.waitForTimeout(1000);

    
    const vidSource = await page.evaluate(() => {
        let title = document.querySelector('.series-title > span').innerHTML.trim();
        let episode = document.querySelector('.series-episode > span').innerHTML;;
        let vidSrc = document.querySelector('video').getAttribute('src');

        episodeDetails = [];
        episodeDetails.push({
            AnimeTitle: title,
            Episode: episode,
            Source: vidSrc,
        });
        return episodeDetails;
    });
    await browser.close();

    console.log(vidSource);

}).catch(function (err) {
    console.error(err);
});
