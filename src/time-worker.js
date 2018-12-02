addEventListener("message", event => {
    const array = new Uint32Array(event.data);
    postMessage("start");
    while (true) {
        const begin = performance.now();
        for (let i = 0; i < 1e7; ++i) {
        Atomics.add(array, 0, 1);
        }
        console.log("current rate", (performance.now() - begin) / 10, "ns");
    }
});