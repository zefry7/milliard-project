const querystring = require("querystring");
const {generator} = require("./generator");
const {server} = require("./server");
const yargs = require('yargs');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');



if (yargs.argv.debug) {
  run({
    params: {
      title: "Этой весной меня ждет",
      text1: "Во время прогулки по непривычному маршруту",
      text2: "вы обязательно встретите человека на коне, белом или любом другом.",
      text3: "Не упустите своё счастье.",
      image: "images/collections/10.jpg"
    }
  });
} else if (yargs.argv.main) {
  run({save_to_dir: '../app/images/share/', _i: iterator_pro('../app/images/share/')});
} else {
  run({save_to_dir: '../app/images/easter-eggs/share/', _i: iterator_easters()});
}

function run({save_to_dir, _i, params}) {
  const PORT = 8800;
  params = _.assign({ title: '', text1: '', text2: '', text3: '', image: '' }, params);
  server(PORT, params)
    .then(async (app)=>{
      if (_i) {
        let startAt = now();
        await Promise.all([
          generator(getPath, _i, save_to_dir),
          generator(getPath, _i, save_to_dir),
          generator(getPath, _i, save_to_dir),
          generator(getPath, _i, save_to_dir),
        ]);
        console.log(`end duration ${now() - startAt}ms`);

        app.close();

        function getPath(p) {
          return `http://localhost:${PORT}/?${querystring.stringify(p)}`;
        }
      }

    });
}
function now() {
  return new Date().getTime()
}




function* iterator_easters(){
  const predictions = require("../app/components/project/p-easter-eggs/p-easter-eggs.json");
  for (let i = 0; i < predictions.length; i++) {
    yield {
      id: predictions[i].image.split('/').pop().replace(/\.(jpg|png)$/, ''),
      image: predictions[i].image,
      title: 'Воу!',//predictions[i].title,
      text1: 'Воу! У меня нашлась пасхалка во время гадания на&nbsp;Яндекс.Картах!',
      text2: "",
      text3: "",
    }
  }
}

function* iterator_dev(){
  let i = 0;
  while (i++ < 100) {
    yield {
      id: i,
      image: `images/collections/${(i - 1) % 26 + 1}.jpg`,
      title: 'Вот что вас ждет',
      text1: 'Во&nbsp;время прогулки по&nbsp;непривычному маршруту',
      text2: 'вы&nbsp;узнаете, где в&nbsp;этом городе есть мидии. Ультимативно и&nbsp;беспощадно. А&nbsp;потом вы&nbsp;их&nbsp;будете есть. И&nbsp;будете сыты. И&nbsp;довольны. Если вы&nbsp;вообще их&nbsp;едите.',
      text3: 'Тогда вы&nbsp;поймёте&nbsp;&mdash; долг уплачен.'
    }
  }
}
function* iterator_pro($save_to){
  /*{
    "collections": {
      3: [1],
      12: [1],
      15: [1],
      17: [0, 1],
      19: [0],
      20: [0,1],
      21: [0],
      22: [0],
      24: [1],
      26: [0],
    },
    "before": [4,9,],
    "after": []
  }*/
  const is_new = isNew();
  let exist = fs.readdirSync(path.resolve(__dirname, $save_to))
    .map(str=>{
      let n = /([^\/\\]+)\.jpg$/.exec(str);
      return n && n[1];
    });

  const predictions = require("../app/data/predictions");
  for (let j = 0; j < predictions.collections.length; j++) {
    for (let i = 0; i < predictions.before.length; i++) {
      for (let k = 0; k < predictions.collections[j].texts.length; k++) {
        for (let l = 0; l < predictions.after.length; l++) {
          if (is_new(predictions.collections[j].id, i, k, l)) {
            let id = `${predictions.collections[j].id}_${i}_${k}_${l}`;
            if (exist.indexOf(id) >= 0 )continue;
            yield {
              id,
              title: 'Мне предсказали',
              image: predictions.collections[j].image,
              text1: predictions.before[i],
              text2: predictions.collections[j].texts[k],
              text3: predictions.after[l]
            }
          }

        }
      }
    }
  }

  function isNew(val) {
    if (val) {
      return (collectionId, before, collectionNum, after)=>{
        return val.collections.hasOwnProperty(collectionId) && test(val.collections[collectionId], collectionNum)
          ||
          test(val.before, before)
          ||
          test(val.after, after)
      }
    }

    return ()=>true;

    function test(arr, val) {
      return !(arr && arr.indexOf(val) < 0);
    }
  }
}
