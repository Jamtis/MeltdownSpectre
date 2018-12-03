import wasm_configuration_promise from "./wasm-configuration.js";
import evictCache from "./evict-cache.js";
import timer_promise from "./timer.js";

export default (async () => {
    let junk = 0;
    const timer = await timer_promise;
    const {
        page_size,
        probe_length,
        probe_table
    } = await wasm_configuration_promise;
    const time_table = new Uint32Array(probe_length);
    return function flushReloadProbe(probe_index) {
        // probe_index = _probe_index;
        evictCache();
        // for (let i = 0; i < 1e2; ++i) {
        console.timeStamp("reload");
        junk ^= probe_table[probe_index * page_size];
        console.timeStamp("probe");
        // probe the probe_table
        for (let i = -2; i < probe_length; ++i) {
            timer.restore();
            // access the probe table
            junk ^= probe_table[i * page_size];
            time_table[i] = timer.load();
        }
        return time_table;
    };
})();