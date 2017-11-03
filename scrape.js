import * as helpers from './utli/helper.js';
const fileLocation = __dirname + '/output';

const page = 'http://www.coffeereview.com/highest-rated-coffees/page/7';
const page1 = 'http://www.coffeereview.com/highest-rated-coffees/page/8';
const beanPage =
  'http://www.coffeereview.com/review/el-aquila-pacamara-espresso/';

//scrape groups of links
function groupScrapeUrlHandler(inputGroup) {
  console.log('how many groups of links', inputGroup);
  var promises = [];

  inputGroup.forEach((linkGroup, index) => {
    console.log('15,hey', linkGroup);
    promises.push(helpers.scrapeMultiUrl(linkGroup, index, fileLocation));
  });

  return Promise.all(promises).then(data => {
    console.log('Whole process complete!');
  });
}

// helpers
//   .findTotalPageNum(page)
//   .then(totalPage => helpers.linkGenerator(totalPage))
//   .then(links => helpers.groupLinksHandler(links))
//   .then(groups => groupScrapeUrlHandler(groups));

// helpers.scrapeOneBeanUrl(beanPage);
// helpers.scrapeUrl(page);

groupScrapeUrlHandler([
  [
    'http://www.coffeereview.com/highest-rated-coffees/',
    'http://www.coffeereview.com/highest-rated-coffees/page/1',
    'http://www.coffeereview.com/highest-rated-coffees/page/2'
  ],
  [
    'http://www.coffeereview.com/highest-rated-coffees/page/3',
    'http://www.coffeereview.com/highest-rated-coffees/page/4',
    'http://www.coffeereview.com/highest-rated-coffees/page/5'
  ]
]);
// helpers.scrapeMultiUrl([page, page1]);

// findTotalPageNum(page)
//   .then(totalPage => linkGenerator(totalPage))
//   .then(links => scrapeMultiUrl(links))
//   .then(content => writeFile(fileLocation, content));
//
// Promise.all([scrapeUrl(page1), scrapeUrl(page)]).then(value => {
//   console.log(value);
//   return value;
// });
