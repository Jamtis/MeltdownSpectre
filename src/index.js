import divideInterval from "./helper/divide-interval.js";
import plot from "./helper/plot.js";
import download from "./helper/download.js";

import testIndexRepeatedly_promise from "./analysis/test-index-repeatedly.js";
import testIndex_promise from "./analysis/test-index.js";
import timer_promise from "./timer.js";
import statisticallyReadMemory_promise from "./analysis/statistically-read-memory.js";
import {
    probe_length,
    page_size,
    repetitions,
    min_iterations,
    max_cache_hit_number
} from "./configuration.js";

const display_data = {};
const parameters = [repetitions, min_iterations, max_cache_hit_number, page_size, probe_length];

(async () => {
    let method_name;
    try {
        const testIndexRepeatedly = await testIndexRepeatedly_promise;
        // const testIndex = await testIndex_promise;
        const timer = await timer_promise;
        const statisticallyReadMemory = await statisticallyReadMemory_promise;
        
        try {
           statisticallyReadMemory(5100, 10, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
        } catch (error) {
            console.error(error);
        }
        timer.terminate();
        return;
        
        console.time("test");
        try {
            // await measureSuccessRatio(32 << 20);
            // await measureSuccessRatio(128 << 20);
            
            // const method = sweepPageSize;
            const method = sweepMinIterations;
            // const method = sweepMaxCacheHitNumber;
            method_name = method.name;
            console.log("task", method_name);
            await method();
            console.log("display_data", display_data);
            
            notify(true);
        } catch (error) {
            console.error(error);
        } finally {
            timer.terminate();
            console.timeEnd("test");
        }
        
        function notify(is_download) {
            if (typeof document != "undefined") {
                if (is_download) {
                    download(method_name + ".json", JSON.stringify({
                        method_name,
                        display_data,
                        parameters,
                        worker: true
                    }));
                }
                plot(display_data, ["success_ratio", "success_rate", "mean_second_ratio"]);
            } else if (typeof postMessage != "undefined") {
                postMessage({
                    display_data,
                    download: is_download && "(worker-script)~" + method_name + ".json",
                    storage: {
                        method_name,
                        display_data,
                        parameters,
                        worker: true
                    }
                });
            }
        }

        async function measureSuccessRatio(arg_number, value) {
            await new Promise(resolve => setTimeout(resolve, 1e0));
            console.log(`%ccurrent value ${value}`, "color:blue");

            const _parameters = [...parameters];
            _parameters[arg_number] = value;
            
            const probe_index = Math.random() * 256 | 0;
            const result = await testIndexRepeatedly(probe_index, ..._parameters);
            display_data[value] = result;

            // notify
            notify(false);

            return result.success_ratio;
        }

        async function sweepMinIterations() {
            const options = {
                interval: [1, 257],
                min_step_width: 1,
                getter: measureSuccessRatio.bind(null, 1),
                length: 20
            };
            const pairs = await divideInterval(options);
        }
        
        async function sweepMaxCacheHitNumber() {
            const options = {
                interval: [2, 258],
                min_step_width: 1,
                getter: measureSuccessRatio.bind(null, 2),
                length: 80
            };
            const pairs = await divideInterval(options);
        }
        
        async function sweepPageSize() {
            const options = {
                interval: [0, 1 << 13],
                min_step_width: 1,
                getter: measureSuccessRatio.bind(null, 3),
                length: 20
            };
            const pairs = await divideInterval(options);
        }
    } catch (error) {
        console.error(error);
    }
})();