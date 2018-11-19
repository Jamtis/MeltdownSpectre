addEventListener("message", event => {
    const array = new Uint32Array(event.data);
    postMessage("start");
    while (true) {
        // array[0] += 1n;
        Atomics.add(array, 0 ,1);
    }
});