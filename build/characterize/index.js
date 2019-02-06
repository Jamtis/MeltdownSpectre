define(["../helper/plot.js", "../helper/download.js", "../timer.js"], function (_plot, _download, _timer) {
  "use strict";

  _plot = _interopRequireDefault(_plot);
  _download = _interopRequireDefault(_download);
  _timer = _interopRequireDefault(_timer);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  (async () => {
    const is_build = location.pathname.indexOf("src") == -1;
    const trace_names = ["success_ratio", "success_rate", "mean_second_ratio", "second_ratio_SNR", "mean_time", "mean_total_iterations_failing", "mean_total_iterations", "total_iterations_SNR", "probe_index", "order_index"];
    const worker = new Worker("./worker.prep.js" + location.search, {
      type: is_build ? "classic" : "module"
    });
    worker.addEventListener("message", draw);
    window.worker = worker;
    const timer = await _timer.default; // forware shared array buffer

    if (is_build) {
      worker.addEventListener("message", event => {
        if (event.data == "terminate") {
          timer.terminate();
        }
      });
      await new Promise(resolve => setTimeout(resolve, 5e3));
      console.log("forward sharedbuffer", timer.buffer, timer);
      worker.postMessage(timer.buffer);
    } else {
      timer.terminate();
    }

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
  })();
});