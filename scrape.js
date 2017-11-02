import * as helpers from './utli/helper.js';

const fileLocation = __dirname + '/output';
const page = 'http://www.coffeereview.com/highest-rated-coffees/';
//scrape groups of links
function groupScrapeUrlHandler(inputGroup, numberOfFiles) {
  return new Promise((resolve, reject) => {
    inputGroup.forEach((linkGroup, index) =>
      helpers
        .scrapeMultiUrl(linkGroup)
        .then(content =>
          helpers.writeFile(`${fileLocation}/data${index}.json`, content)
        )
    );
  });
}

helpers
  .findTotalPageNum(page)
  .then(totalPage => helpers.linkGenerator(totalPage))
  .then(links => helpers.groupLinksHandler(links))
  .then(groups => groupScrapeUrlHandler(groups, groups.length));

// findTotalPageNum(page)
//   .then(totalPage => linkGenerator(totalPage))
//   .then(links => scrapeMultiUrl(links))
//   .then(content => writeFile(fileLocation, content));

// Promise.all([scrapeUrl(page1), scrapeUrl(page)]).then(value => {
//   console.log(value);
//   return value;
// });
