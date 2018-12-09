import testIndex_promise from "./test-index.js";

import {mean, zIndex} from "./helper/math.js";
import flushReloadProbe_promise from "./flush-reload-probe.js";
import indicator_table_promise from "./indicator-table.js";

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
    
    return async function testIndexRepeatedly(probe_index, repetitions, min_iterations, max_cache_hit_number) {
        const begin = performance.now();
        let successes = 0;
        let second_ratio_mean = 0;
        // for (let j = 0; i < 100 && performance.now() - begin < 1e4; ++j) {
        for (var i = 0; i < repetitions; ++i) {
            // new microtask
            // await Promise.resolve();
            // new task
            await new Promise(resolve => setTimeout(resolve, 1e3));
            // const deopt_testIndex = await deopt(testIndex);
            const {
                max_indicator_index,
                second_ratio
            } = testIndex(probe_index, min_iterations, max_cache_hit_number);
            console.assert(max_indicator_index === undefined ^ second_ratio < 1, "second_ratio is 1 iff index test failed");
            successes += max_indicator_index == probe_index;
            console.log("sir", second_ratio);
            // second_ratio_mean = (counter * second_ratio_mean + second_ratio) / (counter + 1);
        }
        if (i < repetitions) {
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
    
    function deopt(_function) {
        const function_name = _function.name;
        const new_function_string = _function.toString().replace(`function ${function_name}`, `function deopt_${function_name}_${Math.random().toString().substr(2)}`);
        return eval(`(${new_function_string})`);
    }
})();