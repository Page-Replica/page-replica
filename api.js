const process = require("process");
const express = require("express");
const Sitemapper = require("sitemapper");
const scrap = require("./index").scrap;

// Set the maximum number of listeners to unlimited to prevent warning messages
process.setMaxListeners(0);

// Create an instance of Express
const app = express();
// Define the port for the Express app
const port = 8080;

// Start the Express app and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/**
 * Endpoint to scrape a single page.
 * @name GET /page
 * @function
 * @memberof app
 * @param {string} url - The URL of the page to be scraped.
 * @returns {void}
 */
app.get("/page", (req, res) => {
  // Extract the URL from the query parameters
  const url = req.query.url;
  // Call the scrap function to scrape the specified page
  scrap(url);
  // Send a response without any content
  res.send();
});

/**
 * Endpoint to scrape pages from a sitemap.
 * @name GET /sitemap
 * @function
 * @memberof app
 * @param {string} url - The URL of the sitemap to be scraped.
 * @returns {void}
 */
app.get("/sitemap", (req, res) => {
  // Create a new instance of Sitemapper
  const sitemap = new Sitemapper();
  // Fetch the sitemap from the specified URL
  sitemap.fetch(req.query.url).then(function ({ sites }) {
    // Extract the list of URLs from the fetched sitemap
    const urls = sites;
    // Set an interval to scrape each URL with a delay of 3000 milliseconds (3 seconds)
    const interval = setInterval(() => {
      const url = urls.shift();
      if (!url) {
        // If there are no more URLs, clear the interval
        clearInterval(interval);
        return;
      }
      // Call the scrap function to scrape the current URL
      scrap(url);
    }, 3000);
  });
  // Send a response without any content
  res.send();
});
