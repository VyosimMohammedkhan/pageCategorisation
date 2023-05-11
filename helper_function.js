const puppeteer = require('puppeteer');

let keywords = {
  "About": ['About', 'Company', 'Enterprise', 'Corporate', 'History', 'Values', 'Mission', 'Vision', 'Story', 'What we do', 'Who we are', 'Who we serve', 'Firm', 'Profile'],
  "Contact": ["Contact", "Office", "Location", "Map", "Direction", "Get in touch", "Submit", "Send", "Form", "Consult", "Consultation", "Free", "Appointment", "Request"],
  "Team": ["Management", "Leadership", "Leaders", "Founder", "Staff", "People", "Meet", "Partner", "Board", "Committee", "Trustee", "President", "Owner", "Director", "Chair"],
  "Investor": ["Investor"],
  "Product": ["Product", "Service", "Solution", "Compare", "Demo", "Feature", "Portfolio", "Featured", "Practice", "Area", "Project"],
  "Career": ['Career', 'Jobs', 'Hiring', 'Employment'],
  "News": ["News", "Press", "Newsroom", "Awards", "Press kit"],//temporarily removed keyword "PR"
  "ECommerce": ["E-Commerce", "Cart", "Store", "Shop"],
  "Resources": ["Resources", "Support", "Download", "Chat", "Schedule", "Developers", "FAQ", "Tour", "Help", "Webinar", "Community", "Marketplace", "Feedback", "Knowledge"],
  "Pricing": ["Pricing", "Offer", "Special", "Deal"],
  "Social": ["Social", "Facebook,", "Twitter", "Instagram", "Youtube", "LinkedIn", "RSS", "Feed", "Houzz", "Pinterest"],
  "Portal": ["Portal", "Login", "Sign in", "Sign up", "Cart", "Subscribe", "Log in", "Register", "Stay in touch"],
  "Legal": ['Legal', 'Privacy', 'Terms', 'Disclaimer'],
  "Blog": ["Articles", "Customer Stories", "Testimonials", "Reviews", "Newsletter", "Gallery", "Photo", "Guide", "Case Studies", "White Papers", "Client", "Event"],
  "Exclude": ["Page Not found", "lorem ipsum", "domain for sale", "parked for free"]
};

async function startBrowser() {
  const browser = await puppeteer.launch({ headless: false });
  return browser;
}


async function navigateToUrl(browser, url) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  await page.goto(url, {
    "waituntil": "domcontentloaded"
  });

  return page;
}
async function closeBrowser(browser) {
  await browser.close();
}

async function getAllUrlsFromPage(page) {

  const PageUrlsAndUrlTexts = await page.evaluate(() => {
    const urlHrefAndTextArray = Array.from(document.links).map((link) => [link.href, link.text]);
    const uniqueUrlArray = [...new Set(urlHrefAndTextArray)];
    return urlHrefAndTextArray;
  })
  return PageUrlsAndUrlTexts;
}

async function getMetaDataLanguageAndCopyright(page) {
  let metanamesLanguage = {};
  let pagemetaNames = await getMetaNames(page);
  let pageLanguage = await getLanguages(page);

  for (let [key, value] of Object.entries(pagemetaNames)) {
    metanamesLanguage[`${key}`] = value;
  };
  for (let [key, value] of Object.entries(pageLanguage)) {
    metanamesLanguage[`${key}`] = value;
  };
  //await csvWriter.writeRecords(metanamesLanguage);
  return metanamesLanguage;
}


async function countMatchingKeywordsFromGivenSetOfLinks(PageUrlsAndUrlTexts) {

  let csvData = [];
  for (const UrlsAndUrlText of PageUrlsAndUrlTexts) {
    try {
      const keywordMatchCountData = await checkKeywordsOnUrl(`${UrlsAndUrlText}`);
      csvData.push(keywordMatchCountData);
    } catch (error) {
      console.log(`failed to classify ${url}`)
      console.log(error)
      continue;
    }
  }
  return csvData;
}


async function checkKeywordsOnUrl(urlHrefAndTextArray) {
  const urlAndTextArray = urlHrefAndTextArray.split(",");
  let Categories = { "HREF": urlAndTextArray[0], "linkText": urlAndTextArray[1], "About": 0, "Contact": 0, "Team": 0, "Investor": 0, "Product": 0, "Career": 0, "News": 0, "ECommerce": 0, "Resources": 0, "Pricing": 0, "Social": 0, "Portal": 0, "Legal": 0, "Blog": 0, "Exclude": 0 };
  let keywordsArry = Object.entries(keywords);

  for (let [category, keywordset] of keywordsArry) {
    const word = category.toString()
    // let count=Categories[`${word}`];     
    for (let keyword of keywordset) {
      if (Categories.HREF.toLowerCase().includes(keyword.toLowerCase()) || Categories.linkText.toLowerCase().includes(keyword.toLowerCase())) {
        Categories[`${word}`] = 1;
      }
    }
  }
  return Categories;
}


//not useful anymore
function divideArrayIntoFiveSmallerArrays(largeArray) {
  let sizeOfSmallerArrays = Math.ceil(largeArray.length / 1);
  let newDividedArray = []
  for (let i = 0; i < 2; i++) {
    newDividedArray.push(largeArray.splice(0, sizeOfSmallerArrays));
  }
  return newDividedArray;
}


async function getMetaNames(page) {

  let getMetaData = await page.evaluate(() => {
    let metaDataMap = new Map();

    let titleContent = document.title;
    metaDataMap.metaTitleContent = titleContent ? titleContent : null;

    let httpContenType = document.querySelector('meta[http-equiv="Content-Type"]')
    metaDataMap.metaContenType = httpContenType ? httpContenType.getAttribute('content') : null;

    let keywords = document.querySelector('meta[name="keywords"]')
    metaDataMap.metaKeywords = keywords ? keywords.getAttribute('content') : null;

    let desc = document.querySelector('meta[name="description"]')
    metaDataMap.metaDescription = desc ? desc.getAttribute('content') : null;

    let ogTitle = document.querySelector('meta[property="og:title"]')
    metaDataMap.metaOgTitle = ogTitle ? ogTitle.getAttribute('content') : null;

    let ogDescription = document.querySelector('meta[property="og:description"]')
    metaDataMap.metaOgDescription = ogDescription ? ogDescription.getAttribute('content') : null;

    let ogUrl = document.querySelector('meta[property="og:url"]')
    metaDataMap.metaOgUrl = ogUrl ? ogUrl.getAttribute('content') : null;

    let ogSitename = document.querySelector('meta[property="og:site_name"]')
    metaDataMap.metaOgSitename = ogSitename ? ogSitename.getAttribute('content') : null;

    let profileUsername = document.querySelector('meta[property="profile:username"]')
    metaDataMap.metaProfileUsername = profileUsername ? profileUsername.getAttribute('content') : null;

    let profileFirstname = document.querySelector('meta[property="profile:first_name"]')
    metaDataMap.metaProfileFirstname = profileFirstname ? profileFirstname.getAttribute('content') : null;

    let profileLastname = document.querySelector('meta[property="profile:last_name"]')
    metaDataMap.metaprofileLastname = profileLastname ? profileLastname.getAttribute('content') : null;

    return metaDataMap;
  })
  return getMetaData;
}

async function getLanguages(page) {

  let getLanguagesData = await page.evaluate(() => {
    let languageDataMap = new Map();

    let charSet = document.querySelector('meta[charset=""]')
    languageDataMap.languageCharSet = charSet ? charSet.getAttribute('charset') : null;

    let contentLanguage = document.querySelector('meta[http-equiv="Content-Language"]')
    languageDataMap.contentLanguage = contentLanguage ? contentLanguage.getAttribute('content') : null;

    let languageLocale = document.querySelector('meta[property="og:locale"]')
    languageDataMap.languageLocale = languageLocale ? languageLocale.getAttribute('content') : null;

    let htmlLang = document.querySelector('html')
    languageDataMap.languageHtmtlLang = htmlLang ? htmlLang.getAttribute('lang') : null;

    return languageDataMap;
  })
  return getLanguagesData;
}


async function getCopyrightText() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://naukri.com', {
    "waituntil": "domcontentloaded"
  });

  const element = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*[innertext=""]')).find(element => element.textContent.toLowerCase().includes('all rights reserved'));
  });
  console.log(element);
  await browser.close();
}



module.exports = { getMetaDataLanguageAndCopyright, closeBrowser, startBrowser, navigateToUrl, getAllUrlsFromPage, countMatchingKeywordsFromGivenSetOfLinks, divideArrayIntoFiveSmallerArrays, getMetaNames, getLanguages, getCopyrightText }