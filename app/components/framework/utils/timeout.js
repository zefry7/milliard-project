function factory(cb, ...args) {
  return () => cb(...args);
}

export default function timeout(delay) {
  return data => new Promise(resolve => {
    setTimeout(factory(resolve, data), delay);
  })
}
