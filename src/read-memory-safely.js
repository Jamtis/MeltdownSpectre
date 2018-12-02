import readMemory_promise from "./read-memory.js";

export default (async () => {
    const readMemory = await readMemory_promise;
    return async function readMemorySafely(lower_limit) {
        const begin = performance.now();
        let successes = 0;
        let second_ratio_mean = 0;
        let i = 0;
        // for (let j = 0; i < 100 && performance.now() - begin < 1e4; ++j) {
        for (let j = 0; i < 100 && j < 1e3 /*performance.now() - begin < 1e4*/; ++j) {
            // new microtask
            await Promise.resolve();
            // new task
            // await new Promise(resolve => setTimeout(resolve, 0));
            // console.log("\n\n");
            console.log("read memory");
            const probe_index = Math.random() * 256 | 0;
            const {
                result,
                second_ratio
            } = readMemory(lower_limit, probe_index, .5);
            // if (second_ratio < second_ratio_mean) {
            if (second_ratio < .96 && result !== undefined) {
                successes += result == probe_index;
                ++i;
                // console.log("%csuccess rate", "green", successes / i);
            }
            console.log("sir", second_ratio);
            // second_ratio_mean = (counter * second_ratio_mean + second_ratio) / (counter + 1);
        }
        if (i < 100) {
            console.warn("high undetected error rate");
        }
        /*console.log("read", i, "bytes");
        console.log("read", successes, "bytes correctly");
        console.log("with", successes / (performance.now() - begin) * 1e3, "B/s");*/
        return {
            successes,
            counter: i,
            success_rate: successes / (performance.now() - begin) * 1e3
        };
    };
})();