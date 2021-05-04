const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const { PerformanceObserver, performance } = require('perf_hooks');
//const randomUseragent = require('random-useragent');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlockerPlugin({ blockTrackers: true}));


async function getEpisodeList() {
    try {
        //puppeteer.launch({headless:true}).then(async browser => {
        const browser = await puppeteer.launch({headless:true});

        // Open new page in browser
        const page = await browser.newPage();

        // Navigate to URL on the new page
        await page.goto('https://twist.moe/a/one-punch-man/1');

        // Wait for video tag to load on the website
        await page.waitForSelector('video');

        // Wait for 5 seconds -- this was to prevent scraper from returning null for whatever reason
        await page.waitForTimeout(5000);


        const vidSource = await page.evaluate(() => {
            // Get an array of all the episodes for the anime
            let allEpisodes = document.querySelectorAll('.episode-list.show-all > ul > li');
        
            //Create an array to store information
            episodeArray = [];

            //Iterate through all the listed episodes 
            allEpisodes.forEach(episode => {
                let episodeSource = episode.querySelector('a').getAttribute('href');
                let episodeNum = episode.querySelector('a span').innerHTML;

                episodeArray.push({
                    epSource: ('https://twist.moe'+episodeSource),
                    epNo: episodeNum,
                });
            });
            return episodeArray;
        });
        await browser.close();
        console.log(vidSource);
        //return vidSource;
        getEpisodeDetails(vidSource);
    } catch(err){
        console.log(err);
    } 
};

async function getEpisodeDetails(array){
    try { 
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        const finalResult =[];
            //Iterate through the list of links -- does not work with forEach loop
            for (x = 0; x<array.length;x++){
                let link = array[x];
                await page.goto(link.epSource);
                await page.waitForTimeout(5000);
                console.log("Now at: "+link.epSource);
                const results = await page.evaluate(()=>{
                    episodeDetails = [];
                    let title = document.querySelector('.series-title > span').innerHTML.trim();
                    let episode = document.querySelector('.series-episode > span').innerHTML;;
                    let vidSrc = document.querySelector('video').getAttribute('src');
                    episodeDetails.push({
                        AnimeTitle: title,
                        Episode: episode,
                        Source: vidSrc,
                    });  
                    return episodeDetails;
                });
                finalResult.push(results);
            };
        
        await browser.close();
        console.log(finalResult);
        console.log("Finished iterating through pages.");

        //Write File into JSON
        let data = JSON.stringify(finalResult, null, 2);
        fs.writeFileSync('./output/episodes.json', data);

        //Measuring runtime of script
        var t1 = performance.now()
        console.log("Script took " + ((t1 - t0)/1000).toFixed(2) + " seconds to execute.")
        
    } catch(err){
        console.log(err);
    }
};

//Test array to test getEpisodeDetails function
let episodeArray = [
    { epSource: 'https://twist.moe/a/one-punch-man/1', epNo: '1' },
    { epSource: 'https://twist.moe/a/one-punch-man/2', epNo: '2' },
  ];
var t0 = performance.now();

//getEpisodeDetails(episodeArray);
getEpisodeList();

