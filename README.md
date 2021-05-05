# Web Scraper

## Description
 Testing out and learning about Web scraping using Node and Puppeteer using Twist.moe as a real world example. 
 
 ## Usage
 The code is inside scraper.js and can be run by executing in Node terminal: 
 
```node terminal
$ node scraper.js
```
At the bottom of ```scraper.js``` just put desired function in. Currently the list of functions are: 
- ```getEpisodeDetails()```
- ```getEpisodeList() ```

## To Do List
- [X] Execute first scrape on 1 page
- [X] Scrape the a list of details: Anime Title, Episode, Video Source
- [X] Scrape a list of episode links
- [X] Push scraped data into JSON file
- [X] Loop scrape to do the entire series
- [X] Seperate as module functions

## Additional Tasks
- [ ] Add search functionality to find Anime based off title
- [ ] Maybe add in Command Line Interface support

## Dependencies
- puppeteer-extra
- puppeteer-extra-plugin-stealth
- puppeteer-extra-plugin-adblocker
- fs
- perf_hooks (not required, just used to time the script)

## Disclaimer
This project was created with the intent on learning about web scraping. The repository and creater have **no** affiliation with Twist.moe.
