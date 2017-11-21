var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
const groupDividor = 3;
const page = 'http://www.coffeereview.com/highest-rated-coffees/';

//scrape specific bean info
export function scrapeOneBeanUrl(url, originalBean) {
  return new Promise((resolve, reject) => {
    let obj = {};
    request(url, function(error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);
        var bean = $('div[class=review-col1]')
          .children('.review-title')
          .last()
          .text();
        var location = $('div[class=review-col1]')
          .children('.review-title')
          .next()
          .text()
          .slice(10);
        var origin = $('div[class=review-col1]')
          .children('.review-title')
          .next()
          .next()
          .text()
          .slice(8);
        var roast = $('div[class=review-col1]')
          .children('.review-title')
          .next()
          .next()
          .next()
          .text()
          .slice(7);
        var agtron = $('div[class=review-col2]')
          .children()
          .first()
          .next()
          .text()
          .slice(8);
        var notes = $('div[class=review-content]')
          .children('.subtitle')
          .first()
          .next()
          .text();

        var aroma = $('div[class=review-col2]')
          .children()
          .first()
          .next()
          .next()
          .text()
          .slice(7);

        //
        // var body = $('div[class=review-col2]')
        //   .children()
        //   .first()
        //   .next()
        //   .next()
        //   .next()
        //   .text()
        //   .slice(6);
        var withMilk = $('div[class=review-col2]')
          .children()
          .last()
          .text();
        // .slice(12);
        if (withMilk.slice(0, 4) === 'With') {
          withMilk = withMilk.slice(11);
          obj = {
            location: location,
            origin: origin,
            roast: roast,
            agtron: agtron,
            aroma: aroma,
            withMilk: withMilk,
            notes: notes
          };
        } else {
          var acidity = $('div[class=review-col2]')
            .children()
            .first()
            .next()
            .next()
            .next()
            .text();
          // .slice(18);
          acidity = acidity.slice(18) || acidity.slice(8);

          obj = {
            location: location,
            origin: origin,
            roast: roast,
            agtron: agtron,
            aroma: aroma,
            acidity: acidity,
            notes: notes
          };
        }
      }
      var finalBean = Object.assign(originalBean, obj);
      resolve(finalBean);
    });
  });
}

//scrape one link from the beanEntry page
export function scrapeUrl(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html) {
      var output = [];
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('div[class=review-content]').each(function(i, element) {
          var rating = $(this)
            .children()
            .children('.review-rating')
            .text();
          var brand = $(this)
            .children()
            .children('.review-rating')
            .next()
            .children()
            .text();
          var bean = $(this)
            .children()
            .children('.review-title')
            .text();
          var reviewDate = $(this)
            .children('.review-col2')
            .children()
            .first()
            .text()
            .slice(13);
          var price = $(this)
            .children('.review-col2')
            .children()
            .last()
            .text()
            .slice(7);
          var brandUrl = $(this)
            .children('.links')
            .children()
            .last()
            .children()
            .attr('href');
          var beanUrl = $(this)
            .children('.links')
            .children()
            .first()
            .children()
            .children()
            .attr('href');

          var obj = {
            rating: parseInt(rating),
            brand: brand,
            bean: bean,
            reviewDate: reviewDate,
            price: price,
            brandUrl: brandUrl,
            beanUrl: beanUrl
          };
          output.push(obj);
        });
      }
      resolve(output || []);
    });
  })
    .then(data => {
      console.log('163 running');
      return detailPageHandler(data);
    })
    .catch(err => console.log(err));
}

//for adding the beandetail to each bean entry that are on onePage
export function detailPageHandler(onePageDataEntry) {
  var promises = onePageDataEntry.map(bean => {
    return scrapeOneBeanUrl(bean.beanUrl, bean);
  });

  return Promise.all(promises).then(data => {
    return data;
  });
}

//Export data to json file
export function writeFile(outputFolder, content) {
  return new Promise((resolve, reject) => {
    if (fs.readFile) {
      fs.writeFile(outputFolder, content, 'utf8', err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(`File written ${outputFolder}`);
      });
    }
  }).catch(err => console.log(err));
}

//find total number of pages that contains coffee data
export function findTotalPageNum(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html) {
      if (!error) {
        var output = [];
        var $ = cheerio.load(html);
        var totalPageKey = $('div[class=wp-pagenavi]')
          .first()
          .text()
          .indexOf('of');
        var totalPage = $('div[class=wp-pagenavi]')
          .first()
          .text()
          .slice(totalPageKey + 3, totalPageKey + 5);
      }
      resolve(totalPage);
    });
  });
}

//create an arr contains all the pages
export function linkGenerator(totalPage) {
  var links = [];
  for (var i = 1; i <= totalPage; i++) {
    var newPage = page;
    links = links.concat(`${newPage}page/${i}`);
  }
  return links;
}

//breakdown arr into nested arr of groups of link
export function groupLinksHandler(inputLinks) {
  var groupLink = [];
  for (var i = 0; i < inputLinks.length; i += groupDividor) {
    groupLink.push(inputLinks.slice(i, i + groupDividor));
  }
  return groupLink;
}

//scrape a group of links [pg1, pg2, pg3]
export function scrapeMultiUrl(inputLinks, index, fileLocation) {
  return Promise.all(
    inputLinks.map(cur => {
      return scrapeUrl(cur);
    })
  )
    .then(value => {
      var result = [].concat(...value);
      var content = JSON.stringify(result);
      return writeFile(`${fileLocation}/data${index}.json`, content);
    })
    .catch(err => console.log(err));
}
