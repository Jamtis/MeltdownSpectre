import testIndex_promise from "./test-index.mjs";

import {mean, zIndex} from "./helper/math.mjs";
import flushReloadProbe_promise from "./flush-reload-probe.mjs";
import indicator_table_promise from "./indicator-table.mjs";

import deopt from "./helper/deopt.mjs";

let performance_promise = (async () => {
    if (typeof performance == "undefined") {
        const performance = await import("perf_hooks");
        return performance.default.performance;
    }
    return performance;
})();

export default (async () => {
    const performance = await performance_promise;
    
    const testIndex = await testIndex_promise;
    const indicator_table = await indicator_table_promise;
    const flushReloadProbe = await flushReloadProbe_promise;
    
    return async function testIndexRepeatedly(probe_index, repetitions, min_iterations, cache_size, cache_hit_weight) {
        const begin = performance.now();
        let successes = 0;
        let second_ratio_mean = 0;
        let i = 0;
        // for (let j = 0; i < 100 && performance.now() - begin < 1e4; ++j) {
        for (let j = 0; i < repetitions && j < repetitions * 10; ++j) {
            // new microtask
            await Promise.resolve();
            // new task
            await new Promise(resolve => setTimeout(resolve, 1e3));
            const deopt_testIndex = await deopt(testIndex);
            const {
                max_indicator_index,
                second_ratio
            } = await deopt_testIndex(probe_index, min_iterations, cache_size, cache_hit_weight);
            // if (second_ratio < second_ratio_mean) {
            if (second_ratio < .96 && max_indicator_index !== undefined) {
                successes += max_indicator_index == probe_index;
                ++i;
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
            success_ratio: successes / i,
            success_rate: successes / (performance.now() - begin) * 1e3
        };
    };
})();