import wasm_configuration_promise from "./wasm-configuration.js";
import flushCache from "./flush-cache.js";
import timer_promise from "./timer.js";

export default (async () => {
    let junk = 0;
    const probeTable_string = "(" + probeTable.toString() + ")();";
    const timer = await timer_promise;
    const {
        page_size,
        probe_length,
        probe_table
    } = await wasm_configuration_promise;
    const time_table = new Uint32Array(probe_length);
    return function flushReloadProbe(probe_index) {
        // probe_index = _probe_index;
        flushCache();
        // for (let i = 0; i < 1e2; ++i) {
        junk ^= probe_table[probe_index * page_size];
        // }
        eval(probeTable_string);
        // probeTable(probe_index);
        return time_table;
    };
    
    function probeTable() {
        for (let i = 0; i < probe_length; ++i) {
            const probe_index = i * page_size; // i % 2 ? "string" : i * page_size / 2;
            timer.restore();
            // access the probe table
            junk ^= probe_table[probe_index];
            time_table[i] = timer.load();
        }
    }
})();