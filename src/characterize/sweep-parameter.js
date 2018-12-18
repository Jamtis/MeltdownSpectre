import testIndexRepeatedly_promise from "../analysis/test-index-repeatedly.js";
import divideInterval from "../helper/divide-interval.js";
import configuration from "../configuration.js";

export default
(async () => {
    const testIndexRepeatedly = await testIndexRepeatedly_promise;
    
    const method_options = {
        page_size: {
            interval: [0, 2e4],
            min_step_width: 40,
            getter,
            sample_size: 100,
            integer: true,
            configuration: {
                repetitions: 1e2,
                min_iterations: 100,
                max_cache_hit_number: 8
            }
        },
        max_cache_hit_number: {
            interval: [1, 256],
            min_step_width: 1,
            getter,
            sample_size: 25,
            integer: true,
            configuration: {
                repetitions: 1e2,
                page_size: 6e3,
                min_iterations: 100
            }
        },
        min_iterations: {
            interval: [1, 500],
            min_step_width: 1,
            getter,
            sample_size: 25,
            integer: true,
            configuration: {
                repetitions: 1e2,
                max_cache_hit_number: 8
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
        options.configuration = {
            ...configuration,
            ...options.configuration
        };
        division_property = _division_property;
        order_index = 0;
        // division testing
        const pairs = await divideInterval(options);
        // sequential testing
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
        division_results[value] = result;
        // notify
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
        } = {
            ...options.configuration,
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
                division_property
            }
        }));
        postMessage(message);
    }
})();