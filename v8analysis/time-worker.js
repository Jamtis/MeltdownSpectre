const {parentPort, workerData} = require('worker_threads');
setTimeout(() => {
    const array = new Uint32Array(workerData);
    parentPort.postMessage("start");
    while (true) {
        // const begin = performance.now();
        // for (let i = 0; i < 1e8; ++i) {
        Atomics.add(array, 0, 1);
        // }
        // console.log("current rate", 1e5 / (performance.now() - begin), "MHz");
        // ++array[0];
    }
}, 1000);