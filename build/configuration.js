define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.probe_index = _exports.speculative_repetitions = _exports.probe_length = _exports.repetitions = _exports.max_cache_hit_number = _exports.min_iterations = _exports.page_size = void 0;
  const page_size = 5000;
  _exports.page_size = page_size;
  const min_iterations = 3;
  _exports.min_iterations = min_iterations;
  const max_cache_hit_number = 3;
  _exports.max_cache_hit_number = max_cache_hit_number;
  const repetitions = 500;
  _exports.repetitions = repetitions;
  const probe_length = 1 << 8;
  _exports.probe_length = probe_length;
  const speculative_repetitions = 10;
  _exports.speculative_repetitions = speculative_repetitions;
  const probe_index = undefined;
  _exports.probe_index = probe_index;
  const configuration = {
    probe_length,
    page_size,
    repetitions,
    min_iterations,
    max_cache_hit_number,
    speculative_repetitions
  };
  var _default = configuration;
  _exports.default = _default;
});