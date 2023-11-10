/* eslint-disable */
/**
 * Удаляет пробельные символы в начале и конце строки
 * @param value
 * @return {string}
 */

export default function trim(value) {
  return (value || "").replace(/^\s+|\s+$/g, "");
}
