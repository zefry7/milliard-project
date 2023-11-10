/* eslint-disable */
const _id = {};
export function unique(prefix) {
  prefix = prefix || "_";
  _id[prefix] = ~~_id[prefix];
  return `${prefix}${++_id[prefix]}`;
}
