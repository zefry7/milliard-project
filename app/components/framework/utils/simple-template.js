/* eslint-disable */
export function simpleTemplate($tpl) {
  return info => $tpl.replace(/{{(.+?)}}/g, (str, $0) => reduce(info, $0));
}

function reduce(info, key) {
  return key.split(".").reduce((res, key) => res && res[key], info);
}
