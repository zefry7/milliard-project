import $ from "jquery";

$.event.special.screenMouseMove = { add, remove };

const position = {x: 0, y: 0, u: 0, v: 0};
const handlers = [];
const $window = $(window);

function add(handleObj) {
  handlers.push({
    target: this,
    handleObj
  });

  handleObj.handler.call(this, null, position);
}

function remove(handleObj) {
  for (let i = handlers.length; i-- > 0; ) { // eslint-disable-line no-plusplus
    if (handlers[i].handleObj === handleObj) {
      handlers.splice(i, 1);
    }
  }
}

/* function teardown() {
  const target = this;
  $window.off(".screenEventMouseMove");
}

function setup() {
  const target = this;
} */

$window
  .on("mousemove.screenEventMouseMove", onMouseMove)
  .on("touchstart.screenEventMouseMove touchmove.screenEventMouseMove", onTouchMove);

function onTouchMove(event) {
  const t = event.touches[0];
  trigger(t.pageX || t.clientX, t.pageY || t.clientY, "touch");
}

function onMouseMove(event) {
  trigger(event.pageX || event.clientX, event.pageY || event.clientY, "mouse");
}

function trigger(x, y, source) {
  position.source = source;
  position.x = x;
  position.y = y;
  position.u = position.x / $window.width();
  position.v = position.y / $window.height();

  handlers.forEach(({ target }) => {
    $(target).trigger("screenMouseMove", position);
  });
}
