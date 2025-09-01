const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/**
 * Configuration settings for the web scraper.
 * @typedef {Object} Config
 * @property {string} baseUrl - The base URL used for creating absolute URLs.
 * @property {boolean} removeJS - Whether to remove JavaScript code from the scraped HTML.
 * @property {boolean} addBaseURL - Whether to add a base URL to the head of the HTML.
 * @property {string} cacheFolder - The folder for caching scraped HTML content.
 */

/**
 * Configuration object with settings.
 * @type {Config}
 */
const CONFIG = {
  baseUrl: process.env.BASE_URL || "https://example.com",
  removeJS: process.env.REMOVE_JS ? process.env.REMOVE_JS === "true" : true,
  addBaseURL: process.env.ADD_BASE_URL ? process.env.ADD_BASE_URL === "true" : true,
  cacheFolder: process.env.CACHE_FOLDER || "/tmp/page-replica",
};

/**
 * Function to create necessary folders based on the provided directory path.
 * @param {string} directory - The directory path to create folders for.
 */
const createFolders = (directory) => {
  const folders = directory.split(path.sep);
  folders.shift();
  let currentPath = CONFIG.cacheFolder;
  folders.forEach((folder) => {
    currentPath = path.join(currentPath, folder);
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  });
};

/**
 * Main scraping function.
 * @param {string} pathUrl - The URL to scrape.
 */
const scrap = async (pathUrl) => {
  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    // Create a new page in the browser
    const page = await browser.newPage();
    // Navigate to the specified URL and wait until the page is fully loaded
    await page.goto(pathUrl, { waitUntil: "networkidle2" });
    // Get the outer HTML of the entire document
    let html = await page.evaluate(() => document.documentElement.outerHTML);

    // Remove JavaScript code from the HTML if configured to do so
    if (CONFIG.removeJS) {
      html = html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        "",
      );
    }

    // Add base URL to the head if configured to do so
    if (CONFIG.addBaseURL) {
      html = html.replace(/<head>/gi, `<head><base href="${CONFIG.baseUrl}">`);
    }

    // Create necessary folders for caching based on the URL
    createFolders(pathUrl);
    // Generate a path for caching by removing the protocol (http/https)
    const path = pathUrl.replace(/(^\w+:|^)\/\//, "");
    // Write the HTML content to a file in the cache folder
    fs.writeFileSync(`${CONFIG.cacheFolder}/${path}/index.html`, html);

    // Close the Puppeteer browser
    await browser.close();
  } catch (error) {
    // Log any errors that occur during the scraping process
    console.error(error);
  }
};

// Export the scraping function for external use
exports.scrap = scrap;