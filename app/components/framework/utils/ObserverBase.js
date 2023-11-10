const notify = (data) => {
  return fn => fn(data);
};

export default class ObserverBase {
  #notify = notify(false);

  #prevData;

  list = [];

  subscribe(fn, ret) {
    this.list.push(fn);
    const unsubscribe = () => {
      this.unsubscribe(fn);
    };

    if (ret) {
      ret.do = unsubscribe;
    }

    if (this.#notify) {
      this.#notify(fn);
    }
    return unsubscribe;
  }

  unsubscribe(fn) {
    this.list = this.list.filter(subscriber => subscriber !== fn);
  }

  repeatBroadcast() {
    if (this.#prevData)
      this.broadcast(this.#prevData);
  }

  broadcast(data) {
    this.#prevData = data;
    this.list.forEach(this.#notify = notify(data));
  }
}
