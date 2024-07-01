<img width="321" alt="Screenshot 2024-06-30 at 21 50 13" src="https://github.com/html5-ninja/page-replica/assets/2590579/d606e994-b6ac-4235-9ff6-5ec7a76fa095">

# Page Replica Now Available as a Web Service!

We are excited to announce that Page Replica is now available as a web service! No installation is required—simply visit [page-replica.com](https://page-replica.com) and start using it right away.

### Pricing
Page Replica is free to use for up to 1000 requests per month.

### Need Assistance?
If you have any questions or need support, we're here to help! Join our [GitHub Discussion](https://github.com/html5-ninja/page-replica/discussions/3) to get in touch with us.

Thank you for choosing Page Replica. We look forward to providing you with the best possible service.

---

# Page Replica free tool

"Page Replica" is a versatile web scraping and caching tool built with Node.js, Express, and Puppeteer. It helps prerender web app (React, Angular, Vue,...) pages, which can be served via Nginx for SEO or other purposes.

The tool allows you to scrape individual web pages or entire sitemaps trough an api, selectively removing JavaScript, and caching the resulting HTML.

Additionally, it features an Nginx configuration that optimally handles user and search engine bot traffic.


## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/html5-ninja/page-replica.git
   cd page-replica
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Settings:**
- index.js 
   ```bash
   const CONFIG = {
   baseUrl: "https://example.com",
   removeJS: true,
   addBaseURL: true,
   cacheFolder: "path_to_cache_folder",
   }
   ```
- app.js : set the port for your API

4. **Start the API:**

   ```bash
   npm start
   ```

## Usage

By scraping a page or a sitemap, a copy of the prerendered page will be stored in the cache folder.

### Scraping Individual Pages

To scrape a single page, make a GET request to `/page` with the `url` query parameter:

```bash
curl http://localhost:8080/page?url=https://example.com
```

### Scraping Sitemaps

To scrape pages from a sitemap, make a GET request to `/sitemap` with the `url` query parameter:

```bash
curl http://localhost:8080/sitemap?url=https://example.com/sitemap.xml
```

## Serve the Cached Pages to Bots with Nginx (My Recipe)

In this case, the cached pages are served using Nginx. You can adapt this configuration to your needs and your server.

The Nginx configuration, residing in `nginx_config_sample/example.com.conf`, thoughtfully manages traffic. 
It efficiently routes regular users to the main application server and redirects search engine bots to a dedicated server block for cached HTML delivery.

Please review the `nginx_config_sample/example.com.conf` file to gain an understanding of its functionality.

## Contribution
We welcome contributions! If you have ideas for new features or server/cloud configurations that could enhance this tool, feel free to:

- Open an issue to discuss your ideas.
- Fork the repository and make your changes.
- Submit a pull request with a clear description of your changes.

### Feature Requests and Suggestions
If you have any feature requests or suggestions for server/cloud configurations beyond Nginx, please open an issue to start a discussion.

## Folder Structure

- `nginx_config_sample`: Presents a sample Nginx configuration for redirecting bot traffic to the cached content server.
- `api.js`: An Express application responsible for handling web scraping requests.
- `index.js`: The core web scraping logic employing Puppeteer.
- `package.json`: Node.js project configuration.
