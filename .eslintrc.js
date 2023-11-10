module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "off",
    "no-underscore-dangle": "off",
    "no-use-before-define": ["error", { "functions": false }],
    "no-param-reassign": ["error", { "props": false }],
    "no-plusplus": ["error", {"allowForLoopAfterthoughts": true}],
  },
};
