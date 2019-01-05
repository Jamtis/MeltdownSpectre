import {mean, zIndex} from "../helper/math.js";
import speculativelyReadMemory_promise from "./speculatively-read-memory.js";

export default
(async () => {
    const {speculativelyReadMemory} = await speculativelyReadMemory_promise;
    const speculative_provider = await speculativelyReadMemory_promise;
    
    return function statisticallyReadMemory(address, speculative_repetitions, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
        const begin = performance.now();
        let successes = 0;
        let second_ratios = [];
        let mean_times = [];
        let total_iterations_array = [];
        let total_iterations_failing_array = [];
        for (let i = 0; i < repetitions; ++i) {
            const {
                max_indicator_index,
                second_ratio,
                normalized_indicator_table,
                mean_time,
                total_iterations
            } = speculativelyReadMemory(address, speculative_repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
            // console.log("estimated memory value", max_indicator_index);
            // console.log("sir", second_ratio);
            if (max_indicator_index == speculative_provider.secret_table[address]) {
                ++successes;
                second_ratios.push(second_ratio);
                mean_times.push(mean_time);
                total_iterations_array.push(total_iterations);
            } else {
                total_iterations_failing_array.push(total_iterations);
            }
        }
        const success_rate = successes / (performance.now() - begin) * 1e3;
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
            address,
            mean_time,
            mean_total_iterations,
            total_iterations_SNR,
            mean_total_iterations_failing
        };
    }
})();