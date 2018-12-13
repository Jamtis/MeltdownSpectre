import {mean, zIndex} from "../helper/math.js";
import testIndex_promise from "./test-index.js";

let performance_promise = (async () => {
    if (typeof performance == "undefined") {
        const performance = await eval(`import("perf_hooks")`);
        return performance.default.performance;
    }
    return performance;
})();

export default (async () => {
    const performance = await performance_promise;
    
    const testIndex = await testIndex_promise;
    
    return async function testIndexRepeatedly(probe_index, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
        const begin = performance.now();
        let successes = 0;
        let second_ratios = [];
        // console.groupCollapsed("probe_index " + probe_index);
        for (let i = 0; i < repetitions; ++i) {
            // new microtask
            // await Promise.resolve();
            // new task
            // await new Promise(resolve => setTimeout(resolve, 1e3));
            const {
                max_indicator_index,
                second_ratio
            } = testIndex(probe_index, min_iterations, max_cache_hit_number, page_size, probe_length);
            console.assert(max_indicator_index === undefined ^ second_ratio < 1, "second_ratio is 1 iff index test failed");
            if (max_indicator_index == probe_index) {
                ++successes;
                second_ratios.push(second_ratio);
            }
            // console.log("sir", second_ratio);
        }
        // console.groupEnd("probe_index " + probe_index);
        const mean_second_ratio = mean(second_ratios);
        const second_ratio_SNR = -zIndex(second_ratios);
        return {
            success_ratio: successes / repetitions,
            success_rate: successes / (performance.now() - begin) * 1e3,
            mean_second_ratio,
            second_ratio_SNR
        };
    };
})();