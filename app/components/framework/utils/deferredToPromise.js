export default function deferredToPromise($def) {
  return new Promise((resolve, reject) => {
    $def.then(resolve, reject);
  })
}
