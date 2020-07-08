const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const request = require("request-promise");
const description = require("./description");

(async function () {
  try {
    const baseUrl = "https://www.bankmega.com/";
    const base = "https://www.bankmega.com/promolainnya.php";
    const mainHtml = await request(base);
    const $ = cheerio.load(mainHtml);

    const href = $("#promolain > li > a")
      .map((i, element) => {
        const href = element.attribs.href;
        return baseUrl + href;
      })
      .get();
    console.log(href);

    const idCategory = $("#subcatpromo > div > img")
      .map((i, element) => {
        const id = element.attribs.id;
        return id;
      })
      .get();
    Promise.all(
      href.map(async (link) => {
        try {
          const desc = await description(link);
          console.log(desc);
        } catch (error) {
          console.log("error", error);
        }
      })
    );
  } catch (error) {
    console.log("error", error);
  }
})();
// app.use(morgan("dev"));

// app.listen(port, () =>
//   console.log(`Example app listening at http://localhost:${port}`)
// );
