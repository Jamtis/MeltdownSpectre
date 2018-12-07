import divideInterval from "./divide-interval.js";
import plot from "./helper/plot.js";
import testIndexRepeatedly_promise from "./test-index-repeatedly.js";
import testIndex_promise from "./test-index.js";
import timer_promise from "./timer.js";

import evictCache from "./evict-cache.js";
import wasm_configuration_promise from "./wasm-configuration.js";

const storage = {};
// self.storage = storage;
const repetitions = 20;
const min_iterations = 8;
const cache_hit_weight = .5;

(async () => {
    try {
        const testIndexRepeatedly = await testIndexRepeatedly_promise;
        const testIndex = await testIndex_promise;
        const timer = await timer_promise;

        console.time("test");
        try {
            await measureSuccessRatio(32 << 20);
            await measureSuccessRatio(128 << 20);
            /*
            const options = {
                interval: [0, 128 << 20],
                min_step_width: 1 << 10,
                getter: measureSuccessRatio,
                length: 20
            };
            const pairs = await divideInterval(options);
            console.log(storage);
            */
            if (typeof document != "undefined") {
                plot(storage, ["success_ratio"]);
            } 
        } catch (error) {
            console.error(error);
        } finally {
            timer.terminate();
            console.timeEnd("test");
        }
        
        async function measureSuccessRatio(cache_size) {
            await new Promise(resolve => setTimeout(resolve, 1e3));
            console.log(`%ccurrent cache size ${cache_size}`, "color:blue");
            
            const probe_index = Math.random() * 256 | 0;
            const {success_ratio} = await testIndexRepeatedly(probe_index, repetitions, min_iterations, cache_size, cache_hit_weight);
            storage[cache_size] = {
                success_ratio
            };
            return success_ratio;
        }
    } catch (error) {
        console.error(error);
    }
})();