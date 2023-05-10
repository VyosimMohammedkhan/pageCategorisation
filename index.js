//const puppeteer = require('puppeteer');
const {getAllUrlsFromPage,countMatchingKeywordsFromGivenSetOfLinks,divideArrayIntoFiveSmallerArrays,getMetaNames, getLanguages}=require('./helper_function')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs=require('fs');
const stringify=require('csv-stringify')
const path=require('path')

function createCsvFile(url){
     let filepath;
if(`${url}`.includes('https')){filepath=`${url}`.replace('https://','');}else{filepath=`${url}`.replace('http://','');};
     
     console.log(filepath)
const csvWriter = createCsvWriter({
     path: path.resolve(__dirname, `${filepath}.csv`),
     header: [
       {id: 'HREF', title:'HREF'},
       {id: 'linkText', title:'linkText'},
       {id: 'About', title:'About'},
       {id: 'Contact', title:'Contact'},
       {id: 'Team', title:'Team'},
       {id: 'Investor', title:'Investor'},
       {id: 'Product', title:'Product'},
       {id: 'Career', title:'Career'},
       {id: 'News', title:'News'},
       {id: 'ECommerce', title:'ECommerce'},
       {id: 'Resources', title:'Resources'},
       {id: 'Pricing', title:'Pricing'},
       {id: 'Social', title:'Social'},
       {id: 'Portal', title:'Portal'},
       {id: 'Legal', title:'Legal'},
       {id: 'Metanames', title:'Metanames'},
       {id: 'Language', title:'Language'},
       {id: 'Copyright', title:'Copyright'},
       {id: 'Blog', title:'Blog'},
       {id: 'Exclude', title:'Exclude'}
     ]
     });

     return csvWriter;
}



let tempurls=['https://www.naukri.com/recruit/login']
let tempArray=['apple','ball','cat','doll','egg','flower','goat','horse','ice','joker','king','lion','monkey']

urlArray=["http://www.allaccessequipment.com", "https://www.gn.com", "https://www.adecco.co.uk"];


async function main(){


urlArray.forEach(async url => {

     let csvWriter=  createCsvFile(url);

     try{
      const data=await getAllUrlsFromPage(url)
     // let dividedData= divideArrayIntoFiveSmallerArrays(data);

     //dividedData.forEach(async arr=>{
          const csvData= await countMatchingKeywordsFromGivenSetOfLinks(data);
          //console.log(csvData);
          await csvWriter.writeRecords(csvData);
      //})
      
      
     }
     catch(err){
      console.log(err)
      await csvWriter.writeRecords(err);
     }

});
};

//countMatchingKeywordsFromGivenSetOfLinks(tempurls);
//divideArrayIntoFiveSmallerArrays(tempArray);
//getAllUrlsFromPage();


main()
//getMetaNames()
//getLanguages();