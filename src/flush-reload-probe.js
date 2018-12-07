import wasm_configuration_promise from "./wasm-configuration.js";
import evictCache from "./evict-cache.js";
import timer_promise from "./timer.js";
import deopt from "./helper/deopt.js";

export default (async () => {
    let deopt_counter = 0;
    const timer = await timer_promise;
    const {
        page_size,
        probe_length,
        probe_table
    } = await wasm_configuration_promise;
    const time_table = new Uint32Array(probe_length);
    return flushReloadProbe;
    
    async function flushReloadProbe(probe_index, cache_size) {
        // probe_index = _probe_index;
        evictCache(cache_size);
        
        // opt variant
        // reloadIndex(probe_index);
        // inline variant
        // probe_table[probe_index * page_size];
        // deopt variant
        const deopt_reloadIndex = await deopt(reloadIndex);
        deopt_reloadIndex(probe_index);
        
        // opt variant
        // probeTable();
        // deopt variant
        const deopt_probeTable = await deopt(probeTable);
        await deopt_probeTable(time_table, reloadIndex);
        
        return time_table;
    }
    function reloadIndex(probe_index) {
        return probe_table[probe_index * page_size];
    }
    async function probeTable(time_table, reloadIndex) {
        let junk = 0;
            const deopt_reloadIndex = await deopt(reloadIndex);
        for (let i = -2; i < probe_length; ++i) {
            timer.restore();
            // deopt variant
            junk ^= deopt_reloadIndex(i);
            // inline variant
            // junk ^= reloadIndex(i);
            time_table[i] = timer.load();
        }
    }
})();