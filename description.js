const cheerio = require("cheerio");
const request = require("request-promise");

const description = async (url) => {
  try {
    const mainHtml = await request(url);
    const $ = cheerio.load(mainHtml);
    return {
      title: $("#contentpromolain2 > div.titleinside").text(),
      area: $("#contentpromolain2 > div.area").text(),
      periode: $("#contentpromolain2 > div.periode").text(),
      imageUrl:
        "https://www.bankmega.com" +
        $("#contentpromolain2 > div.keteranganinside > img")[0].attribs.src,
    };
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = description;
