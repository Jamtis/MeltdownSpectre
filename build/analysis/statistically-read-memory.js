define(["exports", "../helper/math.js", "./speculatively-read-memory.js"], function (_exports, _math, _speculativelyReadMemory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _speculativelyReadMemory = _interopRequireDefault(_speculativelyReadMemory);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = (async () => {
    const {
      speculativelyReadMemory
    } = await _speculativelyReadMemory.default;
    const speculative_provider = await _speculativelyReadMemory.default;
    return function statisticallyReadMemory(address, speculative_repetitions, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
      const begin = performance.now();
      let successes = 0;
      let second_ratios = [];
      let mean_times = [];
      let total_iterations_array = [];
      let total_iterations_failing_array = [];

      for (let i = 0; i < repetitions; ++i) {
        const {
          max_indicator_index,
          second_ratio,
          normalized_indicator_table,
          mean_time,
          total_iterations
        } = speculativelyReadMemory(address, speculative_repetitions, min_iterations, max_cache_hit_number, page_size, probe_length); // console.log("estimated memory value", max_indicator_index);
        // console.log("sir", second_ratio);

        if (max_indicator_index == speculative_provider.secret_table[address]) {
          ++successes;
          second_ratios.push(second_ratio);
          mean_times.push(mean_time);
          total_iterations_array.push(total_iterations);
        } else {
          total_iterations_failing_array.push(total_iterations);
        }
      }

      const success_rate = successes / (performance.now() - begin) * 1e3;
      const mean_second_ratio = (0, _math.mean)(second_ratios);
      const second_ratio_SNR = -(0, _math.zIndex)(second_ratios);
      const mean_time = (0, _math.mean)(mean_times);
      const mean_total_iterations = (0, _math.mean)(total_iterations_array);
      const total_iterations_SNR = -(0, _math.zIndex)(total_iterations_array);
      const mean_total_iterations_failing = (0, _math.mean)(total_iterations_failing_array);
      return {
        success_ratio: successes / repetitions,
        success_rate,
        mean_second_ratio,
        second_ratio_SNR,
        address,
        mean_time,
        mean_total_iterations,
        total_iterations_SNR,
        mean_total_iterations_failing
      };
    };
  })();

  _exports.default = _default;
});