export function once(fn: () => void) {
  return function () {
    if (fn) fn.call();
    fn = null;
  };
}

export function preventDefault(fn: Function) {
  return function (event) {
    event.preventDefault();
    fn.call(this, event);
  };
}