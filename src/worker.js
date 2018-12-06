import divideInterval from "./divide-interval.js";
import plot from "./helper/plot.js";
import readMemorySafely_promise from "./read-memory-safely.js";
import readMemory_promise from "./read-memory.js";
import timer_promise from "./timer.js";

import evictCache from "./evict-cache.js";
import wasm_configuration_promise from "./wasm-configuration.js";

const storage = {};
// self.storage = storage;
const repetitions = 50;
const min_iterations = 15;

(async () => {
    try {
        const readMemorySafely = await readMemorySafely_promise;
        const readMemory = await readMemory_promise;
        const timer = await timer_promise;

        console.time("test");
        try {
            const options = {
                interval: [0, 128 << 20],
                min_step_width: 1 << 10,
                getter: measureSuccessRatio,
                length: 20
            };
            const pairs = await divideInterval(options);
            console.timeEnd("test");
            console.log(storage);
            plot(storage, ["mean_success_ratio"]);
        } catch (error) {
            console.error(error);
        } finally {
            timer.terminate();
        }
        
        async function measureSuccessRatio(cache_size) {
            await new Promise(resolve => setTimeout(resolve, 1e3));
            console.log(`%ccurrent cache size ${cache_size}`, "color:blue");
            const {success_ratio} = await readMemorySafely(min_iterations, cache_size);
            return success_ratio;
            
            let sum = 0;
            let counter = 0;
            const probe_index = Math.random() * 256 | 0;
            for (let i = 0; i < repetitions || counter == 0; ++i) {
                const {max_indicator_index} = readMemory(min_iterations, probe_index, .5, cache_size);
                if (!isNaN(max_indicator_index)) {
                    sum += max_indicator_index == probe_index;
                    ++counter;
                }
            }
            const mean_success_ratio = sum / counter;
            storage[cache_size] = {
                mean_success_ratio
            };
            return mean_success_ratio;
        }
    } catch (error) {
        console.error(error);
    }
})();