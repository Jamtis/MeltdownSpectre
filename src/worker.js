addEventListener("message", event => {
    const array = new Uint32Array(event.data);
    // const array = new BigUint64Array(event.data);
    while (true) {
        // array[0] += 1n;
        Atomics.add(array, 0 ,1);
    }
});