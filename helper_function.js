const puppeteer = require('puppeteer');

let keywords={"About":['About','Company','Enterprise','Corporate','History','Values','Mission', 'Vision', 'Story','What we do', 'Who we are','Who we serve','Firm',  'Profile'],
"Contact":["Contact","Office","Location","Map", "Direction", "Get in touch", "Submit","Send","Form","Consult","Consultation", "Free", "Appointment", "Request"],
"Team":["Management", "Leadership", "Leaders", "Founder", "Staff", "People", "Meet", "Partner", "Board", "Committee", "Trustee", "President", "Owner", "Director", "Chair"], 
"Investor":["Investor"],
"Product":["Product","Service", "Solution", "Compare", "Demo", "Feature", "Portfolio", "Featured", "Practice", "Area", "Project"], 
"Career":['Career','Jobs','Hiring','Employment'],
"News":["News","Press", "Newsroom", "Awards", "Press kit"],//temporarily removed keyword "PR"
"ECommerce":["E-Commerce","Cart","Store","Shop"],
"Resources":["Resources","Support", "Download", "Chat", "Schedule", "Developers", "FAQ", "Tour", "Help", "Webinar", "Community", "Marketplace", "Feedback", "Knowledge"],
"Pricing":["Pricing","Offer", "Special", "Deal"],
"Social":["Social","Facebook,", "Twitter", "Instagram", "Youtube", "LinkedIn", "RSS", "Feed", "Houzz", "Pinterest"],
"Portal":["Portal","Login", "Sign in", "Sign up", "Cart", "Subscribe", "Log in", "Register", "Stay in touch"],
"Legal":['Legal','Privacy', 'Terms', 'Disclaimer'],
"Metanames":["title.textContent", `meta[http-equiv="Content-Type"].content`, `meta[name="description"].content`, 
`meta[name="keywords"].content`, `meta[property="og:title"].content`,`meta[property="og:description"].content`,
`meta[property="og:url"].content`, `meta[property="og:site_name"].content`, `meta[property="profile:username"].content`,
`meta[property="profile:first_name"].content`,`meta[property="profile:last_name"].content`],
"Language":['Language',`html.lang`, `meta[charset=""].charset`, `meta[http-equiv="Content-Language"].content`, `meta[property="og:locale"].content`],
"Copyright":[],
"Blog":["Articles", "Customer Stories", "Testimonials", "Reviews", "Newsletter", "Gallery", "Photo", "Guide", "Case Studies", "White Papers", "Client", "Event"],
"Exclude":["Page Not found", "lorem ipsum", "domain for sale", "parked for free"]};

async function getAllUrlsFromPage(url){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
  
    //navigating to page
    await page.goto(url,{
      "waituntil": "domcontentloaded"
    });
    //await page.waituntil({"waituntil": "domcontentloaded"});
  
  //getting all urls from the page
    const PageUrlsAndUrlTexts = await page.evaluate(() => {
      const urlHrefAndTextArray = Array.from(document.links).map((link) => [link.href, link.text]);
     // const urlTextArray = Array.from(document.links).map((link) => link.text);
      const uniqueUrlArray = [...new Set(urlHrefAndTextArray)];
      //return uniqueUrlArray;
      return urlHrefAndTextArray;
    });
  
    // PageUrlsAndUrlTexts.forEach(UrlsAndUrlText=>{
    //   console.log(UrlsAndUrlText[1]);
    // })
    
    
    await browser.close();
    return PageUrlsAndUrlTexts;
  }



async function countMatchingKeywordsFromGivenSetOfLinks(PageUrlsAndUrlTexts){
    //console.log(pageUrls);
    //const browser = await puppeteer.launch({headless: false});
    //const page = await browser.newPage();
    //page.setDefaultNavigationTimeout(60000);

    let csvData=[];
    for(const UrlsAndUrlText of PageUrlsAndUrlTexts){ 
    //console.log(`navigating to ${url}`)
    try{
      //await page.goto(`${url}`);
      //let pagedata= await page.content({"waituntil": "domcontentloaded"}) 
      //console.log(pagedata); 
      const keywordMatchCountData=  await checkKeywordsOnUrl(`${UrlsAndUrlText}`);
      csvData.push(keywordMatchCountData);
    }catch(error){
      console.log(`failed to classify ${url}`)
      console.log(error)
      continue;
    }
    
    }
    // page.close();
    // browser.close();
    return csvData;
  }


async function checkKeywordsOnUrl(urlHrefAndTextArray){
  const urlAndTextArray = urlHrefAndTextArray.split(",");
let Categories = {"HREF":urlAndTextArray[0], "linkText":urlAndTextArray[1],"About":'No',"Contact":'No',"Team":'No', "Investor":'No',"Product":'No', "Career":'No',"News":'No',"ECommerce":'No',"Resources":'No',"Pricing":'No',"Social":'No',"Portal":'No',"Legal":'No',"Metanames":'No',"Language": 'No',"Copyright":'No',"Blog": 'No',"Exclude": 'No'};
let keywordsArry=Object.entries(keywords);

//console.log(Categories)

for(let [category,keywordset] of keywordsArry){
    const word =category.toString()
    let count=Categories[`${word}`];     
        for(let keyword of keywordset){
          if(Categories.HREF.toLowerCase().includes(keyword.toLowerCase())||Categories.linkText.toLowerCase().includes(keyword.toLowerCase())){
            Categories[`${word}`]='Yes';
          }
        }
     }
     //console.log(`The keyword match count for ${url} is as follows: \n`);
     console.log(Categories);
 
    // let categoryMatchValues=Object.values(Categories);
    // console.log(categoryMatchValues);
    // categoryMatchValues.shift();
    

    // let maxCount=Math.max(...categoryMatchValues);
    // console.log(maxCount);
    // let IndexOfMaxValue=categoryMatchValues.indexOf(maxCount)
    //  console.log("index number is "+IndexOfMaxValue);

    // let urlBelongsToCategory=Object.keys(keywords)[IndexOfMaxValue];
    // console.log("category is "+ urlBelongsToCategory)
      return Categories;
}


function divideArrayIntoFiveSmallerArrays(largeArray){
//console.log(largeArray);
let sizeOfSmallerArrays= Math.ceil(largeArray.length/1);
//console.log(sizeOfSmallerArrays)
let newDividedArray=[]
for(let i=0; i<2; i++){
  newDividedArray.push(largeArray.splice(0, sizeOfSmallerArrays));
  //console.log(largeArray)
}
//console.log(newDividedArray);
return newDividedArray;
}




  module.exports={getAllUrlsFromPage,countMatchingKeywordsFromGivenSetOfLinks,divideArrayIntoFiveSmallerArrays}