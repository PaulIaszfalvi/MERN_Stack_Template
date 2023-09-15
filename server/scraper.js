<<<<<<< HEAD
const axios = require('axios'); 

async function fetchData() {
  try {
    const response = await axios.get('https://www.reddit.com/r/programming.json');
    const jsonData = response.data;

    const myArray = jsonData.data.children.slice(0, 15).map(child => {
      let childData = child.data;
      let title = childData ? childData.title : undefined;
      let user = childData ? childData.author : undefined;
      let score = childData ? childData.score : undefined;
      const permalink = childData ? childData.permalink : undefined;
      let selftext = childData ? childData.selftext : undefined;
      let sourceLink = childData ? childData.url : undefined;
      // If the post isn't a discussion, return the link to what it points to instead of the discussion
      if (selftext === "") {
        selftext = childData ? childData.url : undefined;
      }

      return ({
        title: title,
        user: user,
        score: score,
        selfText: selftext,
        sourceLink: sourceLink,
      });
    });
    console.log(myArray)
    return myArray; // Return the array outside the for loop
  } catch (error) {
    console.error('Error:', error);
    throw error; // Throw the error to handle it outside this function
  }
}

module.exports = { fetchData };

=======
const reddit = require("./templates/reddit");
const ycombinator = require("./templates/ycombinator");

/**
 * Asynchronous function that scrapes data from different websites based on the links provided in a JSON file.
 * It uses different templates for different websites and retrieves a specified number of results for each website.
 * 
 * @param {number} numResults - The number of results to retrieve for each website.
 * @returns {Promise<Array<Array<any>>>} - An array of arrays, where each inner array contains the sub-site and the corresponding results for that sub-site.
 */

console.log("accessing scraper")
const scraper = async (numResults) => {

  console.log("scrapper started")
  // Get the links
  const linkList = getList();
  const templates = {};

  console.log("template is being accessed")

  // Dynamically import templates based on the title provided in the JSON file
  for (const link of linkList.links) {
    const title = link.title;
    templates[title] = await import(`./templates/${title}`);
  }

  console.log("creating promise")

  // Create an array of promises using Array.prototype.map()
  const promises = linkList.links.map(async (link) => {
    const title = link.title;

    // Determine which template to use based on which site will be scraped
    const myTemplate = templates[title];

    // Check if template exists
    if (!myTemplate) {
      throw new Error(`Invalid title '${title}' provided in JSON file.`);
    }
   
    // Loop through subs
    const subPromises = link.subs.map(async (subSite) => {
      subSite = subSite || "ycombinator";
      await myTemplate.initialize(subSite);
      let result = await myTemplate.getResults(numResults);
      return [subSite, result];
    });

    // Return sub promises
    return Promise.all(subPromises);
  });

  // Wait for all promises to resolve using Promise.all()
  const resultsArray = await Promise.all(promises);
  console.log(resultsArray)
  return resultsArray;
};
//Get a list (json format) with the titles, links, and subs for the websites that will be scraped
function getList() {
  var json = require("./textFiles/links.json");
  
  return json;
}

module.exports = scraper;
>>>>>>> github/main
