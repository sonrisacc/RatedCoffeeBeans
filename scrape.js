var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var fileLocation = __dirname + '/output/data.json';
var page = 'http://www.coffeereview.com/highest-rated-coffees/';

function findTotalPageNum(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var output = [];
        var $ = cheerio.load(html);
        var totalPageKey = $('div[class=wp-pagenavi]')
          .first()
          .text()
          .indexOf('of');
        // var totalPage = $('div[class=wp-pagenavi]')
        //   .first()
        //   .text()
        //   .slice(totalPageKey + 3, totalPageKey + 5);
        var totalPage = 3;
      }
      resolve(totalPage);
    });
  });
}

function scrapeUrl(url) {
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

function scrapeMultiUrl(inputLinks) {
  return Promise.all(inputLinks.map(cur => scrapeUrl(cur))).then(value => {
    console.log(value.length);
    return JSON.stringify(value);
  });
}

function linkGenerator(totalPage) {
  return new Promise((resolve, reject) => {
    var links = [];
    for (var i = 0; i <= totalPage; i++) {
      var newPage = page;
      links = links.concat(newPage.concat(`page/${i}`));
    }
    resolve(links);
  });
}

function writeFile(outputFolder, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outputFolder, content, 'utf8', err => {
      if (err) {
        console.log(err);
      }
      console.log('File saved');
    });
  });
}

findTotalPageNum(page)
  .then(totalPage => linkGenerator(totalPage))
  .then(links => scrapeMultiUrl(links))
  .then(content => writeFile(fileLocation, content));

// Promise.all([scrapeUrl(page1), scrapeUrl(page)]).then(value => {
//   console.log(value);
//   return value;
// });
