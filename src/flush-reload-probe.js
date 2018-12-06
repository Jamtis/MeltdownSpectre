import wasm_configuration_promise from "./wasm-configuration.js";
import evictCache from "./evict-cache.js";
import timer_promise from "./timer.js";

export default (async () => {
    let deopt_counter = 0;
    let junk = 0;
    const timer = await timer_promise;
    const {
        page_size,
        probe_length,
        probe_table
    } = await wasm_configuration_promise;
    const time_table = new Uint32Array(probe_length);
    return flushReloadProbe;
    
    function flushReloadProbe(probe_index, cache_size) {
        // probe_index = _probe_index;
        evictCache(cache_size);
        reloadIndex(probe_index);
        // probeTable();
        deopt_probeTable();
        return time_table;
    }
    function reloadIndex(index) {
        return probe_table[index * page_size];
    }
    function deopt_probeTable() {
        // to prevent timer precision degradation due to optimizations
        // stamp the probeTable function each time anew with a new name
        let _deopt_probeTable;
        eval("_deopt_probeTable=" + probeTable.toString().replace(/probeTable/, "dynamic_probeTable" + deopt_counter++));
        _deopt_probeTable();
    }
    function probeTable() {
        for (let i = -2; i < 256; ++i) {
            timer.restore();
            junk ^= reloadIndex(i);
            time_table[i] = timer.load();
        }
    }
})();