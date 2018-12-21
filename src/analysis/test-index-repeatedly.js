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
        let mean_times = [];
        let total_iterations_array = [];
        let total_iterations_failing_array = [];
        // console.groupCollapsed("probe_index " + probe_index);
        for (let i = 0; i < repetitions; ++i) {
            // new microtask
            // await Promise.resolve();
            // new task
            // await new Promise(resolve => setTimeout(resolve, 1e3));
            const {
                max_indicator_index,
                second_ratio,
                normalized_indicator_table,
                mean_time,
                total_iterations
            } = await testIndex(probe_index, min_iterations, max_cache_hit_number, page_size, probe_length);
            // console.assert(max_indicator_index === undefined ^ second_ratio < 1, "second_ratio is 1 iff index test failed");
            if (max_indicator_index == probe_index) {
                ++successes;
                second_ratios.push(second_ratio);
                mean_times.push(mean_time);
                total_iterations_array.push(total_iterations);
            } else {
                total_iterations_failing_array.push(total_iterations);
            }
            // console.log("sir", second_ratio);
        }
        const success_rate = successes / (performance.now() - begin) * 1e3;
        // console.groupEnd("probe_index " + probe_index);
        const mean_second_ratio = mean(second_ratios);
        const second_ratio_SNR = -zIndex(second_ratios);
        const mean_time = mean(mean_times);
        const mean_total_iterations = mean(total_iterations_array);
        const total_iterations_SNR = -zIndex(total_iterations_array);
        const mean_total_iterations_failing = mean(total_iterations_failing_array);
        return {
            success_ratio: successes / repetitions,
            success_rate,
            mean_second_ratio,
            second_ratio_SNR,
            probe_index,
            mean_time,
            mean_total_iterations,
            total_iterations_SNR,
            mean_total_iterations_failing
        };
    };
})();