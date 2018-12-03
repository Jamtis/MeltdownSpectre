import divideInterval from "./divide-interval.js";
import plot from "./helper/plot.js";
// import readMemorySafely_promise from "./read-memory-safely.js";
import readMemory_promise from "./read-memory.js";
import timer_promise from "./timer.js";

import evictCache from "./evict-cache.js";
import wasm_configuration_promise from "./wasm-configuration.js";

const storage = {};
// self.storage = storage;

(async () => {
    try {
        // const readMemorySafely = await readMemorySafely_promise;
        const readMemory = await readMemory_promise;
        const timer = await timer_promise;

        console.time("test");
        try {
            await new Promise(resolve => setTimeout(resolve, 1e3));
            for (let i = 0; i < 100; ++i) {
                // new Promise(resolve => setTimeout(resolve, 1));
                readMemory(1, 82, .5);
            }
            // await readMemorySafely(1);
            // const array = new Uint8Array(probe_table.buffer, 0, probe_table.length);
            // readMemory(1, 82, .5);
            // postMessage(storage);
            console.log("storage", storage);
            // await sweepLowerLimit([1<<8, 1 << 8]);
        } catch (error) {
            console.error(error);
        }
        timer.terminate();
        console.timeEnd("test");
    } catch (error) {
        console.error(error);
    }
})();