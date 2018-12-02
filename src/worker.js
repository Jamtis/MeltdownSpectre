import divideInterval from "./divide-interval.js";
import plot from "./helper/plot.js";
import readMemorySafely_promise from "./read-memory-safely.js";
import readMemory_promise from "./read-memory.js";
import timer_promise from "./timer.js";

import flushCache from "./flush-cache.js";
import wasm_configuration_promise from "./wasm-configuration.js";

const storage = {};
self.storage = storage;
self.c = 0;

(async () => {
    const readMemorySafely = await readMemorySafely_promise;
    const readMemory = await readMemory_promise;
    const timer = await timer_promise;
    
    const {
        page_size,
        probe_length,
        probe_table
    } = await wasm_configuration_promise;
    
    console.log("start tests");
    try {
        // probe_table[64 * page_size];
        // await new Promise(resolve => setTimeout(resolve, 1e3));
        readMemory(20, 82, .5);
        // await readMemorySafely(1);
        // const array = new Uint8Array(probe_table.buffer, 0, probe_table.length);
        // readMemory(1, 82, .5);
        postMessage(storage);
        console.log("storage", storage);
        // await sweepLowerLimit([1<<8, 1 << 8]);
    } catch (error) {
        console.error(error);
    }
    timer.terminate();
    console.log("end tests");

    function sweepLowerLimit(interval) {
        let c = 0;
        return divideInterval({
            interval,
            length: 20,
            async getter(lower_limit) {
                console.log("iteration", c++);
                console.log("current lower limit", lower_limit);
                const result = await readMemorySafely(lower_limit);
                // storage[lower_limit] = result;
                // storage[lower_limit].ratio = result.successes / result.counter;
                // postMessage(storage);
                // plot(storage, ["successes", "ratio", "success_rate"]);
                await new Promise(resolve => setTimeout(resolve, 1e3));
                return result.successes;
            },
            min_step_width: 1
        });
    }
})();