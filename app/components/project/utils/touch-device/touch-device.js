import {$body} from "../../dom";

function mq(query) {
  return window.matchMedia(query).matches;
}

function isTouchDevice() {

  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0) {
    return true;
  }
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

$body.addClass(isTouchDevice() ? 'touch-enabled' : 'touch-disabled');
