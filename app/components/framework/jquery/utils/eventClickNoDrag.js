import $ from "jquery";
import { now } from "../../../project/utils/utils";

$.event.special.clickNoDrag = { setup, teardown };

function teardown() {
  const target = this;
  $(target).off(".eventClickNoDrag");
}

function setup() {
  const target = this;
  $(target).on("mousedown.eventClickNoDrag", onMouseDown);

  function onMouseDown(event) {
    $(target)
      .on("mouseup.eventClickNoDrag", onTargetMouseUp)
      .on("mousemove.eventClickNoDrag", onTargetMouseMove)
      .on("mouseleave.eventClickNoDrag", onMouseLeave);

    $(document.documentElement).on("mouseup.eventClickNoDrag", onMouseUp);
    $.data(target).mousedown = {
      time: now(),
      track: [event]
    }
  }

  function onTargetMouseMove(event) {
    $.data(target).mousedown.track.push(event);
  }

  function onMouseLeave() {
    off();
  }

  function onMouseUp() {
    off();
  }

  function off() {
    $(target)
      .off("mouseup.eventClickNoDrag", onTargetMouseUp)
      .off("mousemove.eventClickNoDrag", onTargetMouseMove)
      .off("mouseleave.eventClickNoDrag", onMouseUp);
    $(document.documentElement).off("mouseup.eventClickNoDrag", onMouseUp);
    delete $.data(target).mousedown;
  }

  function onTargetMouseUp() {
    const dataObj = $.data(target).mousedown;
    const duration = now() - dataObj.time;

    if (
      dataObj.track.length < 2 ||
      duration < 500 &&
      trackDistance(dataObj.track) < 50 &&
      trackLength(dataObj.track) < 100
    ) {
      $(target).trigger("clickNoDrag");
    }
  }

}

function trackLength(track) {
  return track.reduce((res, p) => {
    if (res.prev) {
      res.length += distance(res.prev, p);
    }
    res.prev = p;
    return res;
  }, {length: 0}).length;
}

function trackDistance(track) {
  return distance(track[0], track[track.length - 1]);
}

function distance(e0, e1) {
  const p0 = pos(e0);
  const p1 = pos(e1);
  const x = p0.x - p1.x;
  const y = p0.y - p1.y;
  return Math.sqrt(x * x + y * y);
}

function pos(event) {
  return {x: event.pageX, y: event.pageY};
}
