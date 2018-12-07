addEventListener("message", event => {
    const array = new Uint32Array(event.data);
    postMessage("start");
    while (true) {
        // const begin = performance.now();
        // const limit = 1e7;
        // for (let i = 0; i < limit; ++i) {
        Atomics.add(array, 0, 1);
        // ++array[0];
        // }
        // console.log("current rate", (performance.now() - begin) * 1e6 / limit, "ns");
    }
});