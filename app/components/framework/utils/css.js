export default function css(el, props) {
  Object.keys(props)
    .forEach(key => {
      el.style[key] = props[key];
    })
}

function getBackgroundPositionAxis(pos, size, imageSize) {
  return imageSize > size ? percentage(pos / (imageSize - size)) : 0;
}
export function percentage(val) {
  return `${val * 100}%`;
}

export function getBackgroundPosition(x, y, w, h, iw, ih) {
  return `${getBackgroundPositionAxis(x, w, iw)} ${getBackgroundPositionAxis(y, h, ih)}`;
}

export function getBackgroundSize(x, y, w, h, iw, ih) {
  return `${percentage(iw / w)} ${percentage(ih / h)}`
}


export function getPosition(pos, size) {
  return percentage(pos / size);
}
export function getSize(w, iw) {
  return percentage(w / iw);
}
