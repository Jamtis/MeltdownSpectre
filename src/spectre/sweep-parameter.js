import statisticallyReadMemory_promise from "../analysis/statistically-read-memory.js";
import divideInterval from "../helper/divide-interval.js";
import configuration from "../configuration.js";

export default
(async () => {
    const statisticallyReadMemory = await statisticallyReadMemory_promise;
    
    const method_options = {
        page_size: {
            interval: [0, 8e3],
            min_step_width: 10,
            getter,
            sample_size: 25,
            integer: true,
            configuration: {
                repetitions: 2e2,
                min_iterations: 300,
                max_cache_hit_number: 8,
                speculative_repetitions: 10
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
            probe_index: address,
            probe_length,
            page_size,
            repetitions,
            min_iterations,
            max_cache_hit_number,
            speculative_repetitions
        } = {
            ...options.configuration,
            [method_name]: value
        };
        if (isNaN(address)) {
            address = Math.random() * 256 | 0;
            options.configuration.address = address;
        }
        return await statisticallyReadMemory(address, speculative_repetitions, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
    }
    
    function notify(is_download) {
        const message = JSON.parse(JSON.stringify({
            download: is_download && "(worker-script)~" + method_name + "(spectre).json",
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

/*
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
*/