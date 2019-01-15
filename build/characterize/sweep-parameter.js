define(["exports", "../analysis/test-index-repeatedly.js", "../helper/divide-interval.js", "../configuration.js"], function (_exports, _testIndexRepeatedly, _divideInterval, _configuration) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _testIndexRepeatedly = _interopRequireDefault(_testIndexRepeatedly);
  _divideInterval = _interopRequireDefault(_divideInterval);
  _configuration = _interopRequireDefault(_configuration);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const sweepParameter = (async () => {
    const testIndexRepeatedly = await _testIndexRepeatedly.default;
    const method_options = {
      page_size: {
        interval: [0, 1e4],
        min_step_width: 1,
        getter,
        sample_size: 300,
        integer: true,
        configuration: {
          repetitions: 5e2,
          min_iterations: 10,
          max_cache_hit_number: 20
        }
      },
      max_cache_hit_number: {
        interval: [1, 256],
        min_step_width: 1,
        getter,
        sample_size: 256,
        integer: true,
        configuration: {
          repetitions: 1e2,
          page_size: 6e3,
          min_iterations: 1e2
        }
      },
      min_iterations: {
        interval: [1, 500],
        min_step_width: 1,
        getter,
        sample_size: 100,
        integer: true,
        configuration: {
          repetitions: 1e2,
          max_cache_hit_number: 60,
          page_size: 6e3
        }
      },
      probe_length: {
        interval: [2, 256],
        min_step_width: 1,
        getter,
        sample_size: 20,
        integer: true
      },
      probe_index: {
        interval: [0, 255],
        min_step_width: 1,
        getter,
        sample_size: 256,
        integer: true,
        configuration: {
          repetitions: 5e1,
          page_size: 5e3,
          min_iterations: 300,
          max_cache_hit_number: 8
        }
      }
    };
    let division_results;
    let sequential_results;
    let order_index;
    let method_name;
    let options;
    let division_property;
    return async function sweepParameter(_method_name, _division_property) {
      method_name = _method_name;
      options = method_options[method_name];

      if (!options) {
        throw Error("invalid method name");
      }

      division_results = {};
      sequential_results = {};
      options.configuration = { ..._configuration.default,
        ...options.configuration
      };
      division_property = _division_property;
      order_index = 0; // division testing

      const pairs = await (0, _divideInterval.default)(options); // sequential testing

      for (const [value] of pairs) {
        const result = await prepareTest(value);
        sequential_results[value] = result;
        notify(false);
      }

      notify(true);
    };

    async function getter(value) {
      const result = await prepareTest(value);
      result.order_index = order_index++;
      division_results[value] = result; // notify

      notify(false);
      return result[division_property];
    }

    async function prepareTest(value) {
      await new Promise(resolve => setTimeout(resolve, 1e0));
      console.log(`%ccurrent ${method_name} ${value}`, "color:blue");
      let {
        probe_index,
        probe_length,
        page_size,
        repetitions,
        min_iterations,
        max_cache_hit_number
      } = { ...options.configuration,
        [method_name]: value
      };

      if (isNaN(probe_index)) {
        probe_index = Math.random() * 256 | 0;
        options.configuration.probe_index = probe_index;
      }

      return await testIndexRepeatedly(probe_index, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
    }

    function notify(is_download) {
      const message = JSON.parse(JSON.stringify({
        download: is_download && "(worker-script)~" + method_name + "(characterization).json",
        storage: {
          method_name,
          division_results,
          sequential_results,
          options,
          worker: true,
          division_property,
          userAgent: navigator.userAgent
        }
      }));
      postMessage(message);
    }
  })();

  var _default = sweepParameter;
  _exports.default = _default;
});