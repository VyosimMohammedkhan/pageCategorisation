//const puppeteer = require('puppeteer');
const {getAllUrlsFromPage,countMatchingKeywordsFromGivenSetOfLinks,divideArrayIntoFiveSmallerArrays,getMetaNames, getLanguages, getCopyrightText}=require('./helper_function')
const {createCsvFileForCategories, createCsvFileForMetaData}= require('./csv_functions')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs=require('fs');

// let tempurls=['https://www.naukri.com/recruit/login']
// let tempArray=['apple','ball','cat','doll','egg','flower','goat','horse','ice','joker','king','lion','monkey']

urlArray=["http://www.allaccessequipment.com", "https://www.gn.com", "https://www.adecco.co.uk"];


async function main(){
     urlArray.forEach(async url => {

          let categoryCsvWriter=  createCsvFileForCategories(url);
          let metaDataCsvWriter=  createCsvFileForMetaData();

          try{
               const page=await navigateToUrl(url)
               const data=await getAllUrlsFromPage(page)
               const categoryCsvData= await countMatchingKeywordsFromGivenSetOfLinks(data);
               await categoryCsvWriter.writeRecords(categoryCsvData);
          }
          catch(err){
               console.log(err)
               await categoryCsvWriter.writeRecords(err);
          }
     });
};

main()
