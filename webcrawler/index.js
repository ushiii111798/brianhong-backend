import puppeteer from 'puppeteer';

//Setting Up Env File
import dotenv from 'dotenv';

import mongoose from 'mongoose';
import { Products } from './models/product.model.js';
import { Images } from './models/img.model.js';

dotenv.config();

async function productCrawling() {
  const browser = await puppeteer.launch({ headless: false }).catch((err) => console.log(err));
  const page = await browser.newPage().catch((err) => console.log(err));
  const viewSize = { width: 1280, height: 720 };
  await page.setViewport(viewSize).catch((err) => console.log(err));

  await page
    .goto(`https://www.coupang.com/np/campaigns/82?page=5`, {
      timeout: 5000,
      waitUntil: 'domcontentloaded',
    })
    .catch((err) => console.log(err));
  await page.waitForTimeout(1500);
  console.log('**');

  const parent_products = await page.evaluate(async () => {
    const elements = document.querySelectorAll('.baby-product-link');
    // do something with elements, like mapping elements to an attribute:
    const arr1 = Array.from(elements).map((element) => element.querySelector('dl dd.descriptions div.name').textContent);
    const arr2 = Array.from(elements).map((element) => element.querySelector('dl dt img').src);
    const arr3 = Array.from(elements).map(
      (element) => element.querySelector('dl dd.descriptions div.price-area div.price-wrap div.price em.sale strong').textContent,
    );
    const arr4 = Array.from(elements).map((element) => element.href);

    return [arr1, arr2, arr3, arr4];
  });
  console.log(parent_products[0].length);
  for (let idx = 0; idx < parent_products[0].length; idx++) {
    const data = {
      title: strFilter(parent_products[0][idx]),
      img: parent_products[1][idx],
      seller: 'Coupang',
      salePrice: parent_products[2][idx],
      gotoURL: parent_products[3][idx],
    };
    console.log(data);
    await new Products(data).save();
  }

  await page.close().catch((err) => console.log(err));
  await browser.close().catch((err) => console.log(err));
  return;
}

async function imageCrawling(url) {
  const browser = await puppeteer.launch({ headless: false }).catch((err) => console.log(err));
  const page = await browser.newPage().catch((err) => console.log(err));
  const viewSize = { width: 1280, height: 720 };
  await page.setViewport(viewSize).catch((err) => console.log(err));

  await page
    .goto(url, {
      timeout: 5000,
      waitUntil: 'domcontentloaded',
    })
    .catch((err) => console.log(err));
  await page.waitForTimeout(2000);
  console.log('**');

  const img_data = await page.evaluate(async () => {
    const elements = document.querySelectorAll('._aagu');
    const arr1 = Array.from(elements).map((element) => element.querySelector('._aagv img').src);

    return arr1;
  });
  console.log(img_data);

  for (let idx = 0; idx < img_data.length; idx++) {
    const check = await Images.findOne({ img: img_data[idx] }).catch((err) => console.log(err));
    console.log(check);
    if (check !== null) continue;
    const data = {
      img: img_data[idx],
      /* Crawling the instagram page of the member of the group Seventeen. */
      name: 13,
    };
    console.log(data);
    await new Images(data).save();
  }

  await page.close().catch((err) => console.log(err));
  await browser.close().catch((err) => console.log(err));
  return;
}

// 에스쿱스
// imageCrawling('https://www.instagram.com/sound_of_coups/');

// 정한
// imageCrawling('https://www.instagram.com/jeonghaniyoo_n/');

// 조슈아
// imageCrawling('https://www.instagram.com/joshu_acoustic/');

// 디노
// imageCrawling('https://www.instagram.com/feat.dino/');

// 우지
// imageCrawling('https://www.instagram.com/woozi_universefactory/');

// 원우
// imageCrawling('https://www.instagram.com/everyone_woo/');

// 버논
// imageCrawling('https://www.instagram.com/vernonline/');

// 호시
// imageCrawling('https://www.instagram.com/ho5hi_kwon/');

// 명호
// imageCrawling('https://www.instagram.com/xuminghao_o/');

// 승관
// imageCrawling('https://www.instagram.com/pledis_boos/');

// 민규
// imageCrawling('https://www.instagram.com/min9yu_k/');

// 준휘
// imageCrawling('https://www.instagram.com/junhui_moon/');

// 도겸
imageCrawling('https://www.instagram.com/dk_is_dokyeom/');

function strFilter(str) {
  const re3 = new RegExp('\\s{2,}', 'g');
  const re2 = new RegExp('\\n*', 'g');
  const re1 = new RegExp('\\t*', 'g');
  str = str.replace(re1, '');
  str = str.replace(re2, '');
  str = str.replace(re3, '');

  return str;
}

const dbConnOptions = {
  authSource: 'admin',
  user: 'brianhong',
  pass: 'qwermw940210',
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbConnUrl = 'mongodb://dev-one.duckdns.org:27017/dbo';

mongoose.connect(dbConnUrl, dbConnOptions).catch((error) => {
  console.log(error);
});
