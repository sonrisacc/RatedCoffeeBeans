var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
const groupDividor = 3;
const page = 'http://www.coffeereview.com/highest-rated-coffees/';

//scrape one link from the beanEntry page
export function scrapeUrl(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var output = [];
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
      resolve(output);
    });
  })
    .then(data => {
      return data;
    })
    .catch(err => console.log(err));
}

//Export data to json file
export function writeFile(outputFolder, content) {
  return new Promise((resolve, reject) => {
    if (fs.readFile)
      fs.writeFile(outputFolder, content, 'utf8', err => {
        if (err) {
          console.log(err);
        }
        console.log('File saved');
      });
  });
}

//find total number of pages that contains coffee data
export function findTotalPageNum(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html) {
      if (!error && response.statusCode == 200) {
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
        // var totalPage = 6;
      }
      resolve(totalPage);
    });
  });
}

//create an arr contains all the pages
export function linkGenerator(totalPage) {
  return new Promise((resolve, reject) => {
    var links = [page];
    for (var i = 1; i <= totalPage; i++) {
      var newPage = page;
      links = links.concat(newPage.concat(`page/${i}`));
    }
    console.log('total number of links', links.length);
    resolve(links);
  });
}

//breakdown arr into nested arr of groups of link
export function groupLinksHandler(inputLinks) {
  return new Promise((resolve, reject) => {
    var groupLink = [];
    var counter = 0;
    for (var i = 0; i < inputLinks.length; i += groupDividor) {
      groupLink.push(inputLinks.slice(i, i + groupDividor));
      counter++;
    }

    console.log('groups.length should be ' + counter, groupLink.length);
    resolve(groupLink);
  });
}

//scrape a group of links
export function scrapeMultiUrl(inputLinks) {
  return Promise.all(inputLinks.map(cur => scrapeUrl(cur))).then(value => {
    console.log('number of each group of inputLinks', value.length);
    var result = [].concat(...value);
    return JSON.stringify(result);
  });
}
