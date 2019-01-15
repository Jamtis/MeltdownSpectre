define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = keepBook;

  function keepBook(value) {
    let distribution;

    try {
      distribution = JSON.parse(localStorage.getItem("distribution"));
    } catch (error) {}

    distribution = distribution || [];
    const current_iteration = parseInt(localStorage.getItem("current_iteration")) | 0;
    distribution[current_iteration] = value;
    localStorage.setItem("distribution", JSON.stringify(distribution));
    localStorage.setItem("current_iteration", current_iteration + 1);
    return current_iteration;
  }

  ;
});