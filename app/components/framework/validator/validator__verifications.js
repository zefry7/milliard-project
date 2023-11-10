/* eslint-disable */
const email = /.+@.+\..{2,}/;
const name = /^[а-яА-ЯёЁa-zA-Z]+(-[а-яА-ЯёЁa-zA-Z]+)?$/i;
const phone = /^(\+7|8)?\d{10}$/;
const phoneFormatted = /^\+?7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const verifications = {
  required(data, fieldName, verificationParams) {
    const value = getValue(data, fieldName);
    return !!value || verificationParams || false; // || `Заполните поле ${fieldName}`;
  },

  email: test(email, "Неправильный формат"),
  name: test(name, "Неправильный формат"),
  phone: test(phone, "Неправильный формат"),
  "phone-formatted": test(phoneFormatted, "Неправильный формат"),

  regexp(data, fieldName, verificationParams) {
    return test(
      new RegExp(verificationParams.shift()),
      verificationParams.pop()
    )(data, fieldName, verificationParams);
  },

  password(data, fieldName, verificationParams) {
    return true;
  },

  length(data, fieldName, verificationParams) {
    const { length } = data[fieldName];
    switch (typeof verificationParams) {
      case "number":
        return length === verificationParams || getMessage(verificationParams);
      case "object":
        return (
          passed(verificationParams, "min", val => val <= length, true) &&
          passed(verificationParams, "max", val => val >= length, true)
        ) || getMessage(verificationParams);
    }
  },

  chars(data, fieldName, verificationParams) {
    if (typeof verificationParams === "string") {
      verificationParams = { restrict: verificationParams };
    }

    return (
      passed(
        verificationParams,
        "restrict",
        val => new RegExp(`^[${val}]*$`).test(data[fieldName]),
        true
      ) && passed(verificationParams, "require", require, true)
    );

    function require(val) {
      return val.every(group =>
        new RegExp(`[${group}]+`).test(data[fieldName])
      );
    }
  },

  equal(data, fieldName, verificationParams) {
    let message;
    if (Array.isArray(verificationParams)) {
      message = verificationParams.pop();
    }
    const list = init([], verificationParams);
    return (
      list.some(key => getValue(data, fieldName) === data[key]) ||
      message ||
      false
    );

    function init(arr, param) {
      if (Array.isArray(param)) {
        return param.reduce(init, arr);
      }

      return arr.concat(param.split(","));
    }
  },

  // TODO Объединить
  "min-date": dateBounds(1),
  "max-date": dateBounds(-1),

  "min-age": dateBounds(1),
  "max-age": dateBounds(-1)
};

export function registerVerificator(name, validator) {
  verifications[name] = validator;
}

function test(regExp, message) {
  return (data, fieldName, verifyParams) => {
    return (
      regExp.test(getValue(data, fieldName)) ||
      getMessage(verifyParams) ||
      message ||
      false
    );
  };
}

function getValue(data, fieldName) {
  if (data.hasOwnProperty(fieldName)) {
    return data[fieldName];
  }

  if (Array.isArray(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      if (data[i].name === fieldName) {
        return data[i].value;
      }
    }
  }
}
function dateBounds(dir) {
  return function(data, fieldName, verificationParams) {
    // console.log(data, fieldName, verificationParams);
    let message;
    if (Array.isArray(verificationParams)) {
      message = verificationParams[1];
      verificationParams = verificationParams[0];
    }

    return (
      Date.parse(getValue(data, fieldName)) * dir >=
        Date.parse(verificationParams) * dir ||
      message ||
      false
    );
  };
}

function passed(params, key, test, noKey = false) {
  return params.hasOwnProperty(key) ? test(params[key]) : noKey;
}

function getMessage(verifyParams) {
  if (Array.isArray(verifyParams)) {
    return verifyParams.pop();
  }
  if (verifyParams && verifyParams.hasOwnProperty("message")) {
    return verifyParams.message;
  }
}
