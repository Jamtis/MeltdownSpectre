import wasm_configuration_promise from "./wasm-configuration.mjs";
import evictCache from "./evict-cache.mjs";
import timer_promise from "./timer.mjs";

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
    
    function flushReloadProbe(probe_table, probe_index, cache_size) {
        // probe_index = _probe_index;
        evictCache(cache_size);
        
        // opt variant
        // reloadIndex(probe_index);
        // inline variant
        probe_table[probe_index * page_size];
        // deopt variant
        // const deopt_reloadIndex = await deopt(reloadIndex);
        // deopt_reloadIndex(probe_index);
        
        // opt variant
        probeTable(probe_table);
        // deopt variant
        // const deopt_probeTable = await deopt(probeTable);
        // await deopt_probeTable(time_table, reloadIndex);
        
        return time_table;
        
        function probeTable() {
            let junk = 0;
            // const deopt_reloadIndex = await deopt(reloadIndex);
            for (let i = -2; i < probe_length; ++i) {
                timer.restore();
                // deopt variant
                // junk ^= deopt_reloadIndex(i);
                // opt variant
                // junk ^= reloadIndex(i);
                // inline variant
                junk ^= probe_table[i * page_size];
                time_table[i] = timer.load();
            }
        }
    }
    
    function deopt(_function) {
        const function_name = _function.name;
        const new_function_string = _function.toString().replace(`function ${function_name}`, `function deopt_${function_name}_${Math.random().toString().substr(2)}`);
        return eval(`(${new_function_string})`);
    }
})();