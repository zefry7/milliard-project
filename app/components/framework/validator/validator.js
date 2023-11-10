/* eslint-disable */
/**
 * Проверки:
 * 1. Поле заполнено {"fieldName": "required"}
 *
 * 2. имя {"fieldName": "name"}
 *
 * 3. email {"fieldName": "email"}
 *
 * 4. телефон {"fieldName": "phone"}
 *
 * 5. Ограничение длины
 *    {"fieldName": {"length": 10}}, - длина точно соответсвует числу
 *    {"fieldName": {"length": {"max":10}}} - длина ограничена сверху
 *    {"fieldName": {"length": {"min":3, "max":10}}} - длина ограничена снизу и сверху
 *
 * 6. Обязательные символы
 *    {"fieldName": {"chars": "а-яА-Я"}} - допустимые символы
 *    {"fieldName": {"chars": {"restrict": "а-яА-Я"}}} - аналогично первому
 *    {"fieldName": {"chars": {"require": ["а-яА-Я", "0-9"]}}} - массив обязательных символов (должен быть хотя бы 1 символ из каждой группы)
 *
 * 7. Совпадает с другим полем
 *    {"fieldName": {"equal": "password1"}}
 *    {"fieldName": {"equal": "password1,password2"}}
 *    {"fieldName": {"equal": ["password1"]}}
 *
 * 8. Своё условие
 *    {"fieldName": RegExp}
 *    {"fieldName": Function}
 */

/**
 * @typedef {object|object[]} verification
 */

import { ApiError } from "../api/api-error/api-error";
import { verifications } from "./validator__verifications";

/**
 *
 * @param {object} data
 * @param {verification|verification[]} verifications
 * @return {ApiError}
 * @return {ApiError|boolean}
 */
export function verificate(data, verifications) {
  return doVerification(data, verifications);
}

/**
 *
 * @param {string} string
 */
export function parseDataAttribute(string) {
  return typeof string !== "string"
    ? string
    : string.split(",").map(itm => {
        const arr = itm.split(":");
        if (arr.length === 1) {
          return itm;
        }
        const res = {};
        res[arr.shift()] = arr;
        return res;
      });
}

/**
 * Выполнение проверок
 * @param data
 * @param verifications
 * @return {ApiError|boolean}
 */
function doVerification(data, verifications) {
  const error = new ApiError({ code: ApiError.VERIFICATION_ERROR });
  if (Array.isArray(verifications)) {
    verifications.forEach(itm => error.extend(doVerification(data, itm)));
  } else if (verifications) {
    Object.keys(verifications).forEach(key => {
      error.addErrorMessage(
        key,
        doFieldVerifications(data, verifications[key], key)
      );
    });
  }

  return error.isError() ? error : false;
}

/**
 * Выполнение проверок для одного поля
 * @param data - данные формы
 * @param fieldVerifications - список проверок
 * @param fieldName - верифицируемое поле
 * @return {Array}
 */
function doFieldVerifications(data, fieldVerifications, fieldName) {
  let messages = [];
  if (Array.isArray(fieldVerifications)) {
    fieldVerifications.forEach(verification => {
      messages = messages.concat(
        doFieldVerifications(data, verification, fieldName)
      );
    });
  } else {
    switch (typeof fieldVerifications) {
      case "string":
        fieldVerifications
          .split(",")
          .forEach(verification =>
            pass(verifyField(data, fieldName, verification))
          );
        break;
      case "function":
        pass(fieldVerifications(data, fieldName));
        break;
      case "object":
        Object.keys(fieldVerifications).forEach(key =>
          pass(verifyField(data, fieldName, key, fieldVerifications[key]), key)
        );
        break;
    }
  }

  return messages;

  function pass(value, fieldName) {
    if (value !== true) {
      const msg = {};
      msg[fieldName || fieldVerifications] = value;
      messages.push(msg);
    }
  }
}

function verifyField(data, fieldName, verifyName, verifyParams) {
  let tester;
  if (verifications.hasOwnProperty(verifyName)) {
    tester = verifications[verifyName];
  } else {
    tester = new RegExp(verifyName);
  }

  switch (typeof tester) {
    case "function":
      return tester(data, fieldName, verifyParams);

    default:
      if (typeof tester.test === "function") {
        return tester.test(data[fieldName], data, verifyParams);
      }
  }
}

/* TESTS */
/*

console.log(false, validator({val: '1'}, {val: {length: 2}}));
console.log(true, validator({val: '12'}, {val: {length: 2}}));
console.log(false, validator({val: '123'}, {val: {length: 2}}));

console.log(true, validator({val: '123'}, {val: {length: {min: 1}}}));
console.log(!true, validator({val: '123'}, {val: {length: {min: 4}}}));

console.log(true, validator({val: '123'}, {val: {length: {max: 10}}}));
console.log(!true, validator({val: '123'}, {val: {length: {max: 2}}}));

console.log(true, validator({val: '123'}, {val: {length: {min:1, max: 10}}}));
console.log(!true, validator({val: '123'}, {val: {length: {min:2, max: 2}}}));

console.log('---------------');

console.log(validator({val: 'Привет, мир'}, {val: {chars: 'а-я'}}));
console.log(validator({val: 'Иванов-Петров Иван Иванович'}, {val: {chars: '- А-Яа-я'}}));
console.log(validator({val: '123'}, {val: {chars: '0-9'}}));
console.log(validator({val: '123'}, {val: {chars: {require: ['a-z', 'A-Z', '^a-zA-Z']}}}));
console.log(validator({val: 'password'}, {val: {chars: {require: ['a-z', 'A-Z', '^a-zA-Z']}}}));
console.log(validator({val: '123password'}, {val: {chars: {require: ['a-z', 'A-Z', '^a-zA-Z']}}}));
console.log(validator({val: '123Password'}, {val: {chars: {require: ['a-z', 'A-Z', '^a-zA-Z']}}}));



console.log('---------------');

console.log(validator({val: '123password'}, {val: /^1.+d$/}));
console.log(validator({val: '123Password'}, {val: function(data, key){ return +data[key] > 1000; }}));



console.log('---------------');
console.log(true, validator({}, [undefined]));
console.log(false, validator({}, {"name": "required"}));
console.log(true, validator({"name": "My_name"}, [{"name": "required"}, undefined]));
console.log(true, validator({"name": "My_name"}, {"name": "required"}));
console.log(true, validator({"name": "My_name", "phone": "+79605445149"}, {"name": "required", "phone": "phone"}));
console.log(false, validator(
  {
    "name": "Имя",
    "phone": "+79605445149",
    "email": "j.selin@peppers-studio.ru",
    "password1": "12345",
    "password2": "12345",
    "password3": "12345",
    "password4": "12345"
  },
  {
    "name": "required",
    "phone": "phone",
    "email": "required,email",
    "password1": ["required", {"length": 6}],
    "password2": ["required", {"equal": "password1"}],
    "password3": {"equal": "password1", "required": ""},
    "password4": {"equal": "password1,password2", "required": ""},
    "password5": {"equal": "password1,password2", "required": ""}
  }
));
*/

/* TESTS END */
