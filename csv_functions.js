const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

function createCsvFileForMetaData(url) {
     let filepath;
     if (`${url}`.includes('https')) { filepath = `${url}`.replace('https://', ''); } else { filepath = `${url}`.replace('http://', ''); };


     const csvWriter = createCsvWriter({
          path: path.resolve(__dirname, `${filepath}MetaData.csv`),
          header: [
               { id: 'metaTitleContent', title: 'metaTitleContent' },
               { id: 'metaContenType', title: 'metaContenType' },
               { id: 'metaKeywords', title: 'metaKeywords' },
               { id: 'metaDescription', title: 'metaDescription' },
               { id: 'metaOgTitle', title: 'metaOgTitle' },
               { id: 'metaOgDescription', title: 'metaOgDescription' },
               { id: 'metaOgUrl', title: 'metaOgUrl' },
               { id: 'metaOgSitename', title: 'metaOgSitename' },
               { id: 'metaProfileUsername', title: 'metaProfileUsername' },
               { id: 'metaProfileFirstname', title: 'metaProfileFirstname' },
               { id: 'metaprofileLastname', title: 'metaprofileLastname' },
               { id: 'languageCharSet', title: 'languageCharSet' },
               { id: 'contentLanguage', title: 'contentLanguage' },
               { id: 'languageLocale', title: 'languageLocale' },
               { id: 'languageHtmtlLang', title: 'languageHtmtlLang' },
          ]
     });

     return csvWriter;
}

function createCsvFileForCategories(url) {
     let filepath;
     if (`${url}`.includes('https')) { filepath = `${url}`.replace('https://', ''); } else { filepath = `${url}`.replace('http://', ''); };

     console.log(filepath)
     const csvWriter = createCsvWriter({
          path: path.resolve(__dirname, `${filepath}.csv`),
          header: [
               { id: 'HREF', title: 'HREF' },
               { id: 'linkText', title: 'linkText' },
               { id: 'About', title: 'About' },
               { id: 'Contact', title: 'Contact' },
               { id: 'Team', title: 'Team' },
               { id: 'Investor', title: 'Investor' },
               { id: 'Product', title: 'Product' },
               { id: 'Career', title: 'Career' },
               { id: 'News', title: 'News' },
               { id: 'ECommerce', title: 'ECommerce' },
               { id: 'Resources', title: 'Resources' },
               { id: 'Pricing', title: 'Pricing' },
               { id: 'Social', title: 'Social' },
               { id: 'Portal', title: 'Portal' },
               { id: 'Legal', title: 'Legal' },
               { id: 'Blog', title: 'Blog' },
               { id: 'Exclude', title: 'Exclude' }
          ]
     });

     return csvWriter;
}


module.exports = { createCsvFileForCategories, createCsvFileForMetaData }