var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
const groupDividor = 3;
const page = 'http://www.coffeereview.com/highest-rated-coffees/';

//scrape specific bean info
export function scrapeOneBeanUrl(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var bean = $('div[class=review-col1]')
          .children('.review-title')
          .last()
          .text();
        var location = $('div[class=review-col1]')
          .children('.review-title')
          .next()
          .text();
        var origin = $('div[class=review-col1]')
          .children('.review-title')
          .next()
          .next()
          .text();
        var roast = $('div[class=review-col1]')
          .children('.review-title')
          .next()
          .next()
          .next()
          .text();
        var agtron = $('div[class=review-col2]')
          .children()
          .first()
          .next()
          .text();
        var aroma = $('div[class=review-col2]')
          .children()
          .first()
          .next()
          .next()
          .text();
        var body = $('div[class=review-col2]')
          .children()
          .first()
          .next()
          .next()
          .next()
          .text();
        var withMilk = $('div[class=review-col2]')
          .children()
          .last()
          .text();
        var obj = {
          bean: bean,
          location: location,
          origin: origin,
          roast: roast,
          agtron: agtron,
          aroma: aroma,
          body: body,
          withMilk: withMilk
        };
      }
      console.log('64data,', !!obj);
      resolve(obj);
    });
  });
}

//scrape one link from the beanEntry page
export function scrapeUrl(url) {
  console.log('scrapeUrlRunning');
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
      console.log('132', !!output);
      resolve(output);
    });
  })
    .then(data => {
      console.log('scrapeEntryPageReturned Obj', data.length);
      return detailPageHandler(data);
    })
    .catch(err => console.log(err));
}

//for adding the beandetail to each bean entry that are on onePage
export function detailPageHandler(onePageDataEntry) {
  var promises = [];
  console.log('onePageDataEntry', onePageDataEntry.length);
  onePageDataEntry.map(bean => {
    console.log('148 helper');
    promises.push(
      scrapeOneBeanUrl(bean.beanUrl)
        .then(beanDetailData => {
          return Object.assign(bean, beanDetailData);
        })
        .catch(err => console.log(err))
    );
  });

  return Promise.all(promises).then(data => {
    console.log('data161 what is data', typeof data);
    return data;
  });
}

//Export data to json file
export function writeFile(outputFolder, content) {
  return new Promise((resolve, reject) => {
    if (fs.readFile) {
      fs.writeFile(outputFolder, content, 'utf8', err => {
        if (err) {
          console.log(err);
        }
        console.log('File saved');
        resolve();
      });
    }
  }).catch(err => console.log(err));
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
        // var totalPage = 3;
        console.log('totalPage', totalPage);
      }
      resolve(totalPage);
    });
  });
}

//create an arr contains all the pages
export function linkGenerator(totalPage) {
  console.log('totalPage', totalPage);
  return new Promise((resolve, reject) => {
    var links = [page];
    for (var i = 1; i <= totalPage; i++) {
      var newPage = page;
      links = links.concat(newPage.concat(`page/${i}`));
    }
    console.log('total number of links send ', links.length);
    resolve(links);
  });
}

//breakdown arr into nested arr of groups of link
export function groupLinksHandler(inputLinks) {
  console.log('total number of links received ', inputLinks.length);
  return new Promise((resolve, reject) => {
    var groupLink = [];
    for (var i = 0; i < inputLinks.length; i += groupDividor) {
      groupLink.push(inputLinks.slice(i, i + groupDividor));
    }
    console.log('number of groups:', groupLink.length);
    resolve(groupLink);
  });
}

//scrape a group of links
export function scrapeMultiUrl(inputLinks, index, fileLocation) {
  console.log('226 inputLinks', Array.isArray(inputLinks));
  return Promise.all(
    inputLinks.map(cur => {
      console.log('228, wtf', cur);
      return scrapeUrl(cur);
    })
  )
    .then(value => {
      console.log('number of each group of inputLinks', value[0]);
      var result = [].concat(...value);
      console.log('240', result.length);
      var content = JSON.stringify(result);
      return writeFile(`${fileLocation}/data${index}.json`, content);
    })
    .catch(err => console.log(err));
}
