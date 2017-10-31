var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.coffeereview.com/highest-rated-coffees/';
var output = [];
request(url, function(error, response, html) {
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

      var metadata = {
        rating: parseInt(rating),
        brand: brand,
        bean: bean,
        reviewDate: reviewDate,
        price: price,
        brandUrl: brandUrl,
        beanUrl: beanUrl
      };
      output.push(metadata);
    });
    console.log(output.length);
  }
});
