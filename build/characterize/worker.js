define(["./sweep-parameter.js", "../timer.js"], function (_sweepParameter, _timer) {
  "use strict";

  _sweepParameter = _interopRequireDefault(_sweepParameter);
  _timer = _interopRequireDefault(_timer);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  (async () => {
    try {
      console.log("worker start");
      const timer = await _timer.default;
      console.log("timer resolved in worker", timer);
      const sweepParameter = await _sweepParameter.default;
      console.log("sweep resovled in worker");
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
    } catch (error) {
      console.error(error);
    }
  })();
});