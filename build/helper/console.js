define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const log = document.querySelector("#log");
  const _console = {
    log(...args) {
      log.insertAdjacentHTML("afterbegin", args.join(" ") + "<br>");
    },

    error(...args) {
      log.insertAdjacentHTML("afterbegin", "error: " + args.join(" ") + "<br>");
    }

  };
  var _default = _console;
  _exports.default = _default;
});