/**
 * Находит в массиве первый элемент удовлетворяющий query
 * @param {Array} list
 * @param {object} query - условие поиска, пары ключ-значение, которые должны быть в искомом объекте
 * @return {*}
 */
export function find(list, query) {
  for (let i = 0; i < list.length; i++) {
    if (_is(list[i], query)) {
      return list[i];
    }
  }
  return undefined;
}

/**
 * Находит все значения в массиве удовлетворяющие query
 * @param {Array} list
 * @param {Array} query
 */
export function select(list, query) {
  return list.filter(item => _is(item, query));
}

/**
 * Проверяет obj1 на соответствие условиям
 * @param obj1
 * @param conditions
 * @return {boolean}
 * @private
 */
export function _is(obj1, conditions) {
  switch (typeof conditions) {
    case "object":
      return Object.keys(conditions).every(key => {
        return _is(obj1[key], conditions[key])
      });
    case "string":
    case "number":
    case "boolean":
    case "undefined":
    default:
      return obj1 === conditions;
  }
}

export function getProperty(data, prop) {
  return prop.split(".").reduce((res, key) => res && res[key], data);
}
