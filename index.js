const { startBrowser, navigateToUrl, closeBrowser, getAllUrlsFromPage, getMetaDataLanguageAndCopyright, countMatchingKeywordsFromGivenSetOfLinks } = require('./helper_function')
const { createCsvFileForCategories, createCsvFileForMetaData } = require('./csv_functions')
const { Cluster } = require('puppeteer-cluster');
// let tempurls=['https://www.naukri.com/recruit/login']
// let tempArray=['apple','ball','cat','doll','egg','flower','goat','horse','ice','joker','king','lion','monkey']

urlArray = ["http://www.allaccessequipment.com", "https://www.gn.com", "https://www.adecco.co.uk"];




(async () => {
     const cluster = await Cluster.launch({
          concurrency: Cluster.CONCURRENCY_BROWSER,
          maxConcurrency: 4
     });

     await cluster.task(async ({ page, data: url }) => {
          await page.goto(url);
          let categoryCsvWriter = createCsvFileForCategories(url);
          let metaDataCsvWriter = createCsvFileForMetaData(url);

          const data = await getAllUrlsFromPage(page);
          const metaDataLangCopyright = await getMetaDataLanguageAndCopyright(page);
          const categoryCsvData = await countMatchingKeywordsFromGivenSetOfLinks(data);
          await categoryCsvWriter.writeRecords(categoryCsvData);
          await metaDataCsvWriter.writeRecords([metaDataLangCopyright]);
     });

     for (const url of urlArray) {
          cluster.queue(url);
     }

     await cluster.idle();
     await cluster.close();
})();
