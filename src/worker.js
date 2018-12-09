import divideInterval from "./helper/divide-interval.js";
import plot from "./helper/plot.js";
import download from "./helper/download.js";

import testIndexRepeatedly_promise from "./test-index-repeatedly.js";
import testIndex_promise from "./test-index.js";
import timer_promise from "./timer.js";

const storage = {};
// self.storage = storage;
const repetitions = 50;
const min_iterations = 3;
const max_cache_hit_number = 3;

(async () => {
    try {
        const testIndexRepeatedly = await testIndexRepeatedly_promise;
        const testIndex = await testIndex_promise;
        const timer = await timer_promise;

        console.time("test");
        try {
            // await measureSuccessRatio(32 << 20);
            // await measureSuccessRatio(128 << 20);
            
            const options = {
                interval: [1, 257],
                min_step_width: 1,
                getter: measureSuccessRatio,
                length: 20
            };
            const pairs = await divideInterval(options);
            console.log("storage", storage);
            
            if (typeof document != "undefined") {
                download("sweep_max_cache_hit_number.json", JSON.stringify(storage));
                plot(storage, ["success_ratio", "success_rate"]);
            } else if (typeof postMessage != "undefined") {
                postMessage(storage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            timer.terminate();
            console.timeEnd("test");
        }
        
        async function measureSuccessRatio(value) {
            await new Promise(resolve => setTimeout(resolve, 1e3));
            console.log(`%ccurrent value ${value}`, "color:blue");
            const min_iterations = value;
            
            const probe_index = Math.random() * 256 | 0;
            const result = await testIndexRepeatedly(probe_index, repetitions, min_iterations, max_cache_hit_number);
            storage[value] = result;
            return result.success_ratio;
        }
    } catch (error) {
        console.error(error);
    }
})();