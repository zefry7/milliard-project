/* eslint-disable */
// ENDLESS
function Endless(method, count_on_page) {
  count_on_page = count_on_page > 0 ? count_on_page : 15;
  let server_count_on_page = 12;
  const info = [];
  let page = 0;
  const $def = new $.Deferred();
  let _isLoading;
  let _totalCount;

  this.promise = $def.promise();

  this.getContent = function(from, to) {
    const _def = new $.Deferred();

    const pagesRequired = [];
    if (_totalCount) to = Math.min(to, _totalCount - 1);

    for (let p = from; p <= to; p++) {
      if (!info.hasOwnProperty(p)) {
        const page = getPageByIndex(p);
        if (pagesRequired.indexOf(page) < 0) {
          pagesRequired.push(page);
        }
      }
    }

    const promises = [];
    while (pagesRequired.length) {
      promises.push(this.getPage(pagesRequired.shift()));
    }

    _isLoading = true;
    $.when.apply($, promises).done(function() {
      _isLoading = false;
      _def.resolve(info.slice(from, to + 1));

      if (to >= _totalCount - 1) {
        $def.resolve(info);
      }
    });

    return _def.promise();
  };

  this.isLoading = function() {
    return _isLoading;
  };

  this.getPage = function(page) {
    return (
      API.post(method, { page })
        .then(function(data) {
          let i = data.result.images.length;
          while (i--) {
            addImageUrl(data.result.images[i]);
            // data.result.images[i].url_image = 'images2018/' + data.result.images[i].file_fb;
            // data.result.images[i].confirm = true;
          }

          return data.result;
        })
        /* //TODO вернуть API
      console.log("GET PAGE", page);
      var $TEST = new $.Deferred();
      $TEST.resolve();
        .then(function () {
          return {
            "images": [
              { "hash": "1", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "2", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "3", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "4", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "5", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "6", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "7", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "8", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "9", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "10", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "11", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" },
              { "hash": "12", "extension": "jpg", "confirm": true, "date_confirm": "дата", "url_image": "images/cat-pic.png" }
            ],
            "count_on_page": 12,
            "count": 25 //общее количество изображений,  если есть hash то 1
          }
        }) */
        .done(function(response) {
          const list = [response.count_on_page * (page - 1), 0].concat(
            response.images
          );
          info.splice.apply(info, list);
          $def.notify({
            page,
            image: response.images
          });

          server_count_on_page = response.count_on_page;
          _totalCount = response.count;
        })
    );
  };

  this.next = function() {
    return this.getContent(page * count_on_page, ++page * count_on_page - 1);
  };

  function getPageByIndex(index) {
    return Math.floor(index / server_count_on_page) + 1;
  }
}
