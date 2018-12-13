import testIndexRepeatedly_promise from "../analysis/test-index-repeatedly.js";
import divideInterval from "../helper/divide-interval.js";
import configuration from "../configuration.js";

export default
(async () => {
    const testIndexRepeatedly = await testIndexRepeatedly_promise;
    
    const method_options = {
        page_size: {
            interval: [0, 6e3],
            min_step_width: 10,
            getter,
            sample_size: 50,
            integer: true,
            configuration: {
                repetitions: 1e3,
                min_iterations: 3
            }
        },
        max_cache_hit_number: {
            interval: [1, 256],
            min_step_width: 1,
            getter,
            sample_size: 80,
            integer: true,
            configuration: {
                repetitions: 5e2,
                page_size: 5e3
            }
        },
        min_iterations: {
            interval: [1, 500],
            min_step_width: 1,
            getter,
            sample_size: 80,
            integer: true,
            configuration: {
                repetitions: 5e1,
                max_cache_hit_number: 3
            }
        },
        probe_length: {
            interval: [2, 256],
            min_step_width: 1,
            getter,
            sample_size: 20,
            integer: true
        }
    };
    let test_results;
    let method_name;
    let options;
    let division_property;
    
    return async function sweepParameter(_method_name, _division_property) {
        method_name = _method_name;
        options = method_options[method_name];
        if (!options) {
            throw Error("invalid method name");
        }
        test_results = {};
        options.configuration = Object.assign({}, configuration, options.configuration);
        division_property = _division_property;
        const pairs = await divideInterval(options);
        notify(true);
        console.log("test results", test_results);
    };

    async function getter(value) {
        await new Promise(resolve => setTimeout(resolve, 1e0));
        console.log(`%ccurrent ${method_name} ${value}`, "color:blue");
        const {
            probe_length,
            page_size,
            repetitions,
            min_iterations,
            max_cache_hit_number
        } = Object.assign({}, options.configuration, {
            [method_name]: value
        });
        const probe_index = 34 || Math.random() * 256 | 0;
        const result = await testIndexRepeatedly(probe_index, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
        test_results[value] = result;
        // notify
        notify(false);
        return result[division_property];
    }
    
    function notify(is_download) {
        const message = JSON.parse(JSON.stringify({
            test_results,
            download: is_download && "(worker-script)~" + method_name + "(characterization).json",
            storage: {
                method_name,
                test_results,
                options,
                worker: true,
                division_property
            }
        }));
        postMessage(message);
    }
})();