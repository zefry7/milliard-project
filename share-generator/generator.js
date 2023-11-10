const puppeteer = require('puppeteer');
const path = require('path');
let i = 0;

exports.generator = async function generator(host, iterator, _path){
  let item;
  _path = path.resolve(__dirname, _path);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({width: 1200, height: 630});

  while (!(item = iterator.next()).done) {
    let j = i++;
    let startAt = now();
    console.log(`${j} open ${item.value.id}`);
    let _h = host(item.value);
    while (true) {
      try {
        await page.goto(_h);
        break;
      } catch (e) {
        console.error(`${j} error ${item.value.id}`, e);
      }

    }
    try {
      console.log(`${j} save to ${path.join(_path, `${item.value.id}.jpg`)}`);
      await page.screenshot({
        path: path.join(_path, `${item.value.id}.jpg`),
        type: "jpeg",
        quality: 90
      });
    } catch (e) {
      console.error(`${j} error ${item.value.id}`, e);
    }
    console.log(`${j} done ${item.value.id}, duration ${now() - startAt}`);
  }

  await browser.close();
};

function wrap(h) {
  return ()=>h;
}

function now() {
  return new Date().getTime();
}
