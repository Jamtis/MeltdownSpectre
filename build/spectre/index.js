define(["../helper/plot.js", "../helper/download.js"], function (_plot, _download) {
  "use strict";

  _plot = _interopRequireDefault(_plot);
  _download = _interopRequireDefault(_download);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const worker = new Worker("./worker.js" + location.search, {
    type: "module"
  });
  worker.addEventListener("message", draw);
  const trace_names = ["success_ratio", "success_rate", "mean_second_ratio", "second_ratio_SNR", "mean_time", "mean_total_iterations_failing", "mean_total_iterations", "total_iterations_SNR", "address", "order_index"];

  function draw({
    data
  }) {
    const {
      storage,
      download: download_string
    } = data;
    const {
      division_results,
      sequential_results
    } = storage; // plot(data, ["successes", "ratio", "success_rate"]);

    if (typeof download_string == "string") {
      (0, _download.default)(download_string, JSON.stringify(storage));
    }

    (0, _plot.default)(storage.division_results, trace_names, trace_name => trace_name + " (division)");
    (0, _plot.default)(storage.sequential_results, trace_names, trace_name => trace_name + " (sequential)");
  }

  ;
});