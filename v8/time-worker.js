const {performance} = require('perf_hooks');
const {workerData} = require('worker_threads');

console.log("worker init");

// (async () => {
    try {
        const array = new Uint32Array(new SharedArrayBuffer(4));
        console.log("array setup");
        // const array = new Uint32Array(workerData);
        while (true) {
            const begin = performance.now();
            const limit = 1e7;
            for (let i = 0; i < limit; ++i) {
            Atomics.add(array, 0, 1);
            // ++array[0];
            }
            console.log("current rate", (performance.now() - begin) * 1e6 / limit, "ns");
        }
    } catch (error) {
        console.error(error);
    }
// })();