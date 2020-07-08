const puppeteer = require("puppeteer");

  (async () => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    let datas = [];
    let urls = [
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=1',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=2',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=3',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=4',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=5',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=6',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=7',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=8',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=9',
        'https://www.bankmega.com/promolainnya.php?product=&subcat=1&page=10'
    ]
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        await page.goto(`${url}`);
        let data = await page.evaluate(() => {
            let kategori = []
            let promo = []
            let subcatpromo = document.querySelectorAll("div[id=subcatpromo] > div");
            let promolain = document.querySelectorAll("div > ul[id=promolain] > li");
            subcatpromo.forEach((item) =>
              kategori.push({
                judul: item.querySelector("img").title,
              })
            );
            promolain.forEach((item) =>
              promo.push({
                link: item.querySelector('a').href,
              })
            );
      
            return {
              promo,
            };
          });
          datas.push(data.promo)
        // await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
    console.log(datas)
    await browser.close()
})();