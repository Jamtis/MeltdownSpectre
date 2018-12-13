import statisticallyReadMemory_promise from "../analysis/staistically-read-memory.js";
import divideInterval from "../helper/divide-interval.js";
import configuration from "../configuration.js";

export default
(async () => {
    const statisticallyReadMemory = await statisticallyReadMemory_promise;
    
    const method_options = {
        page_size: {
            interval: [0, 1e4],
            min_step_width: 1,
            getter,
            sample_size: 20,
            integer: true,
            configuration: {
                repetitions: 1e4
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
                repetitions: 5e2,
                max_cache_hit_number: 10
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
    
    return async function sweepParameter(_method_name) {
        method_name = _method_name;
        options = method_options[method_name];
        if (!options) {
            throw Error("invalid method name");
        }
        test_results = {};
        options.configuration = Object.assign({}, configuration, options.configuration);
        try {
            return await divideInterval(options);
        } finally {
            console.log("test results", test_results);
            notify(true);
        }
    };

    async function getter(value) {
        await new Promise(resolve => setTimeout(resolve, 1e0));
        console.log(`%ccurrent ${method_name} ${value}`, "color:blue");
        const {
            probe_length,
            page_size,
            repetitions,
            min_iterations,
            max_cache_hit_number,
            speculative_repetitions
        } = Object.assign({}, options.configuration, {
            [method_name]: value
        });
        const address = Math.random() * 1e4 | 0;
        const result = await statisticallyReadMemory_promise(address, speculative_repetitions, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
        test_results[value] = result;
        // notify
        notify(false);
        return result.success_ratio;
    }
    
    function notify(is_download) {
        const message = JSON.parse(JSON.stringify({
            test_results,
            download: is_download && "(worker-script)~" + method_name + "(spectre).json",
            storage: {
                method_name,
                test_results,
                options,
                worker: true
            }
        }));
        postMessage(message);
    }
})();