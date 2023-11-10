/* eslint-disable */
import Handlebars from "handlebars";
import CamelCase from "../utils/camel-case";
import _getEnd from "../utils/get-end";
import toFixed from "../utils/to-fixed";
// import Typograf from 'Typograf';

initHelpers({
  date,
  number,
  getEnd,
  templateEngine,
  percentage,
  toFixed,
  json,
  initName,
  p: bothBlockAndSimpleNormalize(p),
  initLinks: bothBlockAndSimpleNormalize(initLinks),
  sequence,
  switch: switch_switch,
  case: switch_case,
  default: switch_default
  // typograf: initTypograf(Typograf)
});

function initHelpers(obj) {
  Object.keys(obj).forEach(key => {
    Handlebars.registerHelper(CamelCase.from(key), obj[key]);
  });
}

/**
 * Форматирование числа - разбиение большого числа на блоки по 3 цифры
 * @param {'floor'|'ceil'|'round'|'abs'} floor=null - функция округления числа
 * @param {number} val - форматируемое число
 * @return {string}
 */
function number(floor, val) {
  const SEP = "&nbsp;";

  if (arguments.length === 2) {
    val = parseFloat(floor);
  } else {
    val = parseFloat(val);
    if (Math.hasOwnProperty(floor)) {
      val = Math[floor](val);
    }
  }

  const num = `${val}`.split(".");
  num[0] = formatInt(num[0]);
  return num.join(".");

  function formatInt(val) {
    for (let n = val.length - 3; n > 0; n -= 3) {
      val = val.substr(0, n) + SEP + val.substr(n);
    }
    return val;
  }
}

/**
 * Окончание слов для изменения по числу 1 яблокО, 2 яблокА, 5 яблок
 * @param {number} val количество
 * @param {string} end1=''
 * @param {string} end2=''
 * @param {string} end3=''
 * @param info - Handlebars объект
 * @return {string}
 */
function getEnd(val, end1, end2, end3, info) {
  const args = [];
  while (args.length < 5) {
    args.unshift(
      arguments.length > args.length
        ? arguments[arguments.length - args.length - 1]
        : ""
    );
  }

  return _getEnd(args[0] || 0, args.slice(1, 4));
}

/**
 * Перевод дробного числа в проценты 0,35 -> 35%
 * @param val
 * @return {string}
 */
function percentage(val) {
  return `${parseFloat(val) * 100}%`;
}

/**
 * Кодирование объекта в JSON
 * @param val
 */
function json(val) {
  return JSON.stringify(val, null, "  ");
}

/**
 * Форматирование вывода имени и фамилии человека
 *
 * @param {string|object} name - Имя и Фамилия
 * @param options
 * @return {*}
 */
function initName(name, options) {
  const regex = /\s|<br\/?>/g;
  let index = 0;
  const name2 = name.replace(regex, function(str) {
    index++;
    switch (str) {
      case " ":
        return index === 2 ? "&nbsp;" : str;
      case "\n":
        return "<br>";
    }
  });

  return index === 2 ? name2 : name;
}

/**
 * Нормализует параметры для хэлперов, которые могут использоваться как блочные
 * или как обычные
 */
function bothBlockAndSimpleNormalize(fn) {
  return (str, options) => {
    if (typeof options === "undefined") {
      options = str;
      str = options.fn(this);
    }
    return fn(str, options);
  }
}

/**
 * Текст с переносами строк (\n) преобразует в html параграфы (тег P)
 * @param [str] {string}
 * @param options {object}
 * @param options.fn {function}
 * @return {string}
 */
function p(str, options) {
  return str
    .replace(/\r/g, "")
    .split(/\n+/g)
    .map(str => `<p>${str}</p>`)
    .join("\n");
}

function initLinks(str, options) {
  const url = /\b([a-z]+:\/\/|\/\/)?([^\s]+@)?([^\s]+\.[a-zа-я]{2,})\b/g;
  const phoneNative = /(\+7|8)[-\s()\d]+/g;
  const phoneNormal = /^(\+7|8)\d{10}$/g;
  return str
    .replace(url, u => a(u.indexOf("@") > 0 ? "mailto:" : "", u))
    .replace(phoneNative, p => a("tel:", p, isPhone(p)));

  function isPhone(p) {
    const result = p.replace(/[-\s()]/g, '');
    return phoneNormal.test(result) && result;
  }

  function a(prefix, str, val) {
    if (val === false) {
      return str;
    } else {
      return `<a href="${prefix}${val || str}" target="_blank">${str}</a>`
    }
  }
}

function sequence(...args) {
  const options = args.pop();
  return args.reduce((res, item) => {
    return Handlebars.helpers[item].call(this, res, options);
  }, options.fn(this));
}

function templateEngine(options) {
  return options
    .fn()
    .replace(/^\s*<template/, "<script")
    .replace(/<\/template>\s*$/, "</script>");
}

/**
 *
 * @type {Array}
 * @private
 */

const __switch_stack__ = [];
function switch_switch(value, options) {
  __switch_stack__.unshift({
    _switch_value_: value,
    _switch_break_: false
  });
  const html = options.fn(this);
  __switch_stack__.shift();
  return html;
}
function switch_case(...caseValues) {
  const options = caseValues.pop();

  if (
    __switch_stack__[0]._switch_break_ ||
    caseValues.indexOf(__switch_stack__[0]._switch_value_) === -1
  ) {
    return "";
  }

  __switch_stack__[0]._switch_break_ = options.hash.break !== false;
  return options.fn(this);
}
function switch_default(options) {
  if (!__switch_stack__[0]._switch_break_) {
    return options.fn(this);
  }
}

/* Handlebars.registerHelper('closest', function (param, options) {
  let res;
  let info = options.data.root;

  while (!res && info) {
    res = data.getParam(info, param);
    info = info.$$parent;
  }
  return res;
}); */

function initTypograf(Typograf) {
  if (typeof Typograf === "function") {
    const typograf = new Typograf({
      locale: ["ru", "en-US"],
      htmlEntity: { type: "name" },
      disableRule: ["common/space/delRepeatN"],
      enableRule: ["common/html/nbr"]
    });

    return function(str, options) {
      // let res = typograf.execute(str.replace(/\n/g, '<br>'));
      // res = res.replace(/\n+/g, '<br>');
      // return res.split(/\n+/).map(wrap('<p>', '</p>')).join('');
      return typograf.execute(str.replace(/\n/g, "<br>"));
    };
  }
}


const dateFormat = (function() {
  const MM = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  ];
  return {
    dd: d => d.getDate(),
    MM: d => MM[d.getMonth()],
    YYYY: d => d.getFullYear()
  }
}());

function date(...args) {
  const obj = args.pop();
  const d = new Date(args.shift() * 1000);
  const tpl = args.shift();
  if (tpl) {
    return tpl.replace(/dd|MM|YYYY/g, $0 => dateFormat[$0](d));
  }

  return d.toLocaleDateString("ru-RU", {day: "numeric", month: "long", year: "numeric"});
}
