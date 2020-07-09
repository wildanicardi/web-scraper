const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs");
const baseUrl = "https://www.bankmega.com/promolainnya.php";
let countPage = 1;
let promotions = [];
let results = {};

const getPromoCategories = async () => {
  try {
    const mainHtml = await request(baseUrl);
    const $ = cheerio.load(mainHtml);
    const nameCategory = $("#subcatpromo > div ")
      .map((i, element) => {
        const id = $(element).find("img").attr("id");
        return id;
      })
      .get();
    return nameCategory;
  } catch (error) {
    console.log("error", error);
  }
};
const getPromotions = async (url, subcat) => {
  try {
    let promoResults = [];
    const mainHtml = await request(url);
    const $ = cheerio.load(mainHtml);
    const promoLink = $("#promolain > li")
      .map((i, element) => {
        const href = $(element).find("a").attr("href");
        return href;
      })
      .get();
    if (promoLink.length < 1) {
      countPage = 1;
      return false;
    }
    for (let index = 0; index < promoLink.length; index++) {
      promoResults.push(descriptionPromotion(promoLink[index]));
    }
    Promise.all(promoResults).then((values) => {
      promotions.push(values);
    });
    countPage++;
    nextUrl = `${baseUrl}?subcat=${subcat}&page=${countPage}`;
    return getPromotions(nextUrl, subcat);
  } catch (error) {
    console.log("error", error);
  }
};

const promoScarapper = async () => {
  let categories = await getPromoCategories();
  for (let index = 0; index < categories.length; index++) {
    await getPromotions(
      `${baseUrl}?subcat=${index + 1}&page=${countPage}`,
      index + 1
    );
    results[categories[index]] = [].concat(...promotions);
    promotions = [];
  }
  exportResultsJson(results);
};
const exportResultsJson = async (results) => {
  const fileName = "solution.json";
  fs.writeFile(fileName, JSON.stringify(results, null, 4), (error) => {
    if (error) {
      console.log("error exports ", error);
    }
    console.log("Success Export File " + fileName);
  });
};

const descriptionPromotion = async (url) => {
  const detailUrl = `${baseUrl.substring(0, 24)}/${url}`;
  try {
    const mainHtml = await request(detailUrl);
    const $ = cheerio.load(mainHtml);
    const imageUrl = $(".keteranganinside").find("img").attr("src");
    let promotion = {
      title: $(".titleinside").text().trim(),
      area: $(".area > b").text(),
      periode: $(".periode > b").text(),
      image_url: `${baseUrl.substring(0, 24)}${imageUrl}`.replace(
        /\s+/g,
        "%20"
      ),
    };
    return promotion;
  } catch (error) {
    console.log("error", error);
  }
};

promoScarapper();