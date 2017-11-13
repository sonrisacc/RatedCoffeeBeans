import * as helpers from './utli/scrapeHelper.js';
const fileLocation = __dirname + '/output';

const page = 'http://www.coffeereview.com/highest-rated-coffees';
const page1 = 'http://www.coffeereview.com/highest-rated-coffees/page/27';
const beanPage =
  'http://www.coffeereview.com/review/ethiopia-yirga-natural-bedhatu/';

//scrape groups of links
//[  [  [10links],[10links],[]  ], [ [10links],[10links],[10links]  ]   ]
function groupScrapeUrlHandler(inputGroup) {
  var promises = inputGroup.map((linkGroup, index) => {
    return helpers.scrapeMultiUrl(linkGroup, index, fileLocation);
  });

  return Promise.all(promises).then(data => {
    console.log('Whole process complete!', data);
  });
}

helpers
  .findTotalPageNum(page)
  .then(totalPage => helpers.linkGenerator(totalPage))
  .then(links => helpers.groupLinksHandler(links))
  .then(groups => groupScrapeUrlHandler(groups));

// helpers.scrapeOneBeanUrl(
//   'http://www.coffeereview.com/review/hawaii-isla-kona-mauka/'
// );

//helpers.scrapeUrl(page1); working with hawaii

// groupScrapeUrlHandler([
//   ['http://www.coffeereview.com/highest-rated-coffees/page/33',
//    'http://www.coffeereview.com/highest-rated-coffees/page/33'
//    'http://www.coffeereview.com/highest-rated-coffees/page/33']
// ]);
// helpers.scrapeMultiUrl([page, page1], 1, fileLocation);

// findTotalPageNum(page)
//   .then(totalPage => linkGenerator(totalPage))
//   .then(links => scrapeMultiUrl(links))
//   .then(content => writeFile(fileLocation, content));
//
// Promise.all([scrapeUrl(page1), scrapeUrl(page)]).then(value => {
//   console.log(value);
//   return value;
// });
