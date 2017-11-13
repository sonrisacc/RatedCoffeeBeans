import * as helpers from './utli/helper.js';
const fileLocation = __dirname + '/output';

const page = 'http://www.coffeereview.com/highest-rated-coffees';

// const beanPage =
//   'http://www.coffeereview.com/review/el-aquila-pacamara-espresso/';

//scrape groups of links
//[  [  [10links],[10links],[]  ], [ [10links],[10links],[10links]  ]   ]
function groupScrapeUrlHandler(inputGroup) {
  var promises = inputGroup.map((linkGroup, index) => {
    return helpers.scrapeMultiUrl(linkGroup, index, fileLocation);
  });

  return Promise.all(promises).then(data => {
    console.log('Whole process complete!', data);
    //an arr of 'file written...'
  });
}

helpers
  .findTotalPageNum(page)
  .then(totalPage => helpers.linkGenerator(totalPage))
  .then(links => helpers.groupLinksHandler(links))
  .then(groups => groupScrapeUrlHandler(groups));

// helpers.scrapeOneBeanUrl(beanPage);
// helpers.scrapeUrl(page);

// groupScrapeUrlHandler([
//   ['http://www.coffeereview.com/highest-rated-coffees/page/33',
//    'http://www.coffeereview.com/highest-rated-coffees/page/33'
//    'http://www.coffeereview.com/highest-rated-coffees/page/33']
// ]);
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
