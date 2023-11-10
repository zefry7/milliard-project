export function numberRegEx(prefix, suffix) {
  return new RegExp(`${prefix}(-?(?:\\d+|\\d*\\.\\d+)(?:e-?\\d+)?)${suffix}`);
}

export function toPow2(val) {
  return 2 ** Math.ceil(Math.log2(val));
}
