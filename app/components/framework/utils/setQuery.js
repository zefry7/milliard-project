/* eslint-disable */
export function setQuery(query) {
  const l = location;
  const map = {};
  let q;
  if (l.search) {
    q = l.search
      .substr(1)
      .split("&")
      .map(val => {
        const arr = val.split("=");
        const key = arr.shift();
        return (map[key] = {
          key,
          value: decodeURIComponent(arr.join("="))
        });
      });
  } else {
    q = [];
  }
  Object.keys(query).forEach(key => {
    if (map[key]) {
      if (query[key] === false) {
        q.splice(q.indexOf(map[key]), 1);
      } else {
        map[key].value = query[key];
      }
    } else if (query[key] !== false) {
      q.push((map[key] = { key, value: query[key] }));
    }
  });
  q = q.map(val => `${val.key}=${encodeURIComponent(val.value)}`).join("&");
  if (global.history) {
    global.history.replaceState(
      {},
      "",
      q ? `?${q}` : `${location.origin}${location.pathname}`
    );
  }
}
