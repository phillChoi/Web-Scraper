const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const { PerformanceObserver, performance } = require('perf_hooks');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
const { get } = require('http');
const prompt = require('prompt-sync')({sigint:true});
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlockerPlugin({ blockTrackers: true}));

const baseURL = 'https://twist.moe';

async function searchAnime(){
    try {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();   
        await page.goto(baseURL);
        await page.waitForSelector('input.search');
        let title = prompt("What anime would you like to search for? ");
        title = clean(title);
        await page.type('input.search', title);
        const results = await page.evaluate(() => {
            resultArray = [];
            let searchResults = document.querySelectorAll('.series > ul >  li:not(.filtered-out)');
            let counter = 0;
            searchResults.forEach(result => {
                let animeTitle = result.querySelector('a span').innerHTML;
                let reference = result.querySelector('a').getAttribute('href');
                animeTitle = animeTitle.trim();
                resultArray.push({
                    Number: counter,
                    Title: animeTitle,
                    Link: reference
               });
               counter++;
            })
            return resultArray;
        });
        console.log(results);
        await browser.close();

        if (results.length == 1){
            let answer = prompt("Is this the anime you're looking for? (Yes or No)");
            answer = clean(answer);
            if (answer == 'yes'){
                let url = baseURL+results[0].Link;
                getEpisodeList(url);
            };
            if (answer == 'no'){
                answer = prompt("Would you like to try again?");
                answer = clean(answer);
                if (answer == 'yes'){
                    searchAnime();
                }
            };
        };
        if (results.length > 1){
            let answer = prompt("Which title to select?");
            let url = baseURL+results[answer].Link;
            getEpisodeList(url);
        };
        if (results.length == 0){
            console.log("No results found.");
            let answer = prompt("Do you want to try again?");
            answer = clean(answer);
            if (answer == "yes"){
                searchAnime();
            };
        };

    } catch(err){   
        console.log(err);
    };

};

//Change search toggle on Twist.moe to search for English titles
async function changeLanguage(){
    
}

async function getEpisodeList(URL) {
    try {
        //puppeteer.launch({headless:true}).then(async browser => {
        const browser = await puppeteer.launch({headless:true});

        // Open new page in browser
        const page = await browser.newPage();

        // Navigate to URL on the new page
        await page.goto(URL);

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
            for (const link of array){
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

//Just cleaning up string inputs from command line
function clean(string){
    return string.toLowerCase().trim();
}

//Test array to test getEpisodeDetails function
let episodeArray = [
    { epSource: 'https://twist.moe/a/one-punch-man/1', epNo: '1' },
    { epSource: 'https://twist.moe/a/one-punch-man/2', epNo: '2' },
  ];
var t0 = performance.now();

searchAnime();

