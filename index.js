//const puppeteer = require('puppeteer');
const {startBrowser,navigateToUrl,closeBrowser,getAllUrlsFromPage,getMetaDataLanguageAndCopyright,countMatchingKeywordsFromGivenSetOfLinks,divideArrayIntoFiveSmallerArrays,getMetaNames,getLanguages, getCopyrightText}=require('./helper_function')
const {createCsvFileForCategories, createCsvFileForMetaData}= require('./csv_functions')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs=require('fs');

// let tempurls=['https://www.naukri.com/recruit/login']
// let tempArray=['apple','ball','cat','doll','egg','flower','goat','horse','ice','joker','king','lion','monkey']

urlArray=["http://www.allaccessequipment.com", "https://www.gn.com", "https://www.adecco.co.uk"];



async function main(){
     
     await urlArray.forEach(async url => {

          let categoryCsvWriter=  createCsvFileForCategories(url);
          let metaDataCsvWriter=  createCsvFileForMetaData(url);
          try{
               const browser= await startBrowser();
               const page=await navigateToUrl(browser, url);
               const data=await getAllUrlsFromPage(page);
               const metaDataLangCopyright=await getMetaDataLanguageAndCopyright(page);
               const categoryCsvData= await countMatchingKeywordsFromGivenSetOfLinks(data);
               await categoryCsvWriter.writeRecords(categoryCsvData);
               await metaDataCsvWriter.writeRecords([metaDataLangCopyright]);
               await closeBrowser(browser);
          }
          catch(err){
               console.log(err);
          }
     });
};

main();
