var request = require('request');
var cheerio = require('cheerio');
var page = 'http://www.coffeereview.com/highest-rated-coffees/';
var page1 = 'http://www.coffeereview.com/highest-rated-coffees/page/1';
var page2 = 'http://www.coffeereview.com/highest-rated-coffees/page/2';
var links = [page, page1, page2];

var result = [];
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

          var metadata = {
            rating: parseInt(rating)
            // brand: brand,
            // bean: bean,
            // reviewDate: reviewDate,
            // price: price,
            // brandUrl: brandUrl,
            // beanUrl: beanUrl
          };
          output.push(metadata);
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

// Promise.all([scrapeUrl(page1), scrapeUrl(page)]).then(value => {
//   console.log(value);
//   return value;
// });
function scrapeMultiUrl() {
  return Promise.all(links.map(cur => scrapeUrl(cur))).then(value => {
    console.log(value.length);
    return value;
  });
}

scrapeMultiUrl();
