define(["../../helper/plot.js", "../../helper/download.js", "./sweep-parameter.js", "../../timer.js"], function (_plot, _download, _sweepParameter, _timer) {
  "use strict";

  _plot = _interopRequireDefault(_plot);
  _download = _interopRequireDefault(_download);
  _sweepParameter = _interopRequireDefault(_sweepParameter);
  _timer = _interopRequireDefault(_timer);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const worker = new Worker("./worker.prep.js" + location.search, {
    type: "classic"
  });
  worker.addEventListener("message", draw);
  const trace_names = ["success_ratio", "success_rate", "mean_second_ratio", "second_ratio_SNR", "mean_time", "mean_total_iterations_failing", "mean_total_iterations", "total_iterations_SNR", "probe_index", "order_index"];

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

  (async () => {
    const timer = await _timer.default; // overwrite

    /*let before;
    timer.restore = () => {
        before = performance.now();
    };
    timer.load = () => {
        return performance.now() - before;
    };*/

    worker.postMessage(timer.sharedbuffer);
    return;
    const sweepParameter = await _sweepParameter.default;
    console.time("test");

    try {
      const method_name = new URL(location).searchParams.get("method");
      const division_property = new URL(location).searchParams.get("division") || "success_ratio";
      console.log("start sweep", method_name);
      await sweepParameter(method_name, division_property);
    } catch (error) {
      console.error(error);
    } finally {
      timer.terminate();
      console.timeEnd("test");
    }
  })();
});