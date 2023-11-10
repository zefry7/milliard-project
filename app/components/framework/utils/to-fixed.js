/* eslint-disable */
export default function toFixed(val, len = 2) {
  val = `${val}`;
  while (val.length < len) {
    val = `0${val}`;
  }
  return val;
};
