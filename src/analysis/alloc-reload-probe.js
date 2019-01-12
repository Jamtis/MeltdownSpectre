// import evictCache from "./evict-cache.js";
import timer_promise from "../timer.js";
// import big_table from "../big-table.js";

let junk = 0;

export default (async () => {
    const timer = await timer_promise;
    return allocReloadProbe;
    // return (...args) => deopt(allocReloadProbe)(...args);
    
    function allocReloadProbe(probe_index, page_size, probe_length) {
        const time_table = new Uint32Array(probe_length);
        
        const probe_table = new Uint8Array(probe_length * page_size);
        // const probe_table = big_table.getSubarray(probe_length * page_size);
        
        // probeTable[0] is always fast for sme reason so average that access out by randomizing the acutal probing index
        const random_offset = Math.random() * probe_length | 0;
        // console.log("random offset", random_offset);
        
        junk ^= probe_table[((probe_index + probe_length - random_offset) % probe_length) * page_size];
        
        // const deopt_reloadIndex = await deopt(reloadIndex);
        for (let i = 0; i < probe_length; ++i) {
            timer.restore();
            junk ^= probe_table[i * page_size];
            time_table[(i + random_offset) % probe_length] = timer.load();
        }
        
        return time_table;
    }
    
    /*function deopt(_function) {
        const new_function_string = _function.toString().replace(`function ${_function.name}`, `function deopt_${_function.name}_${Math.random().toString(36).substr(2)}`);
        return eval(`(${new_function_string})`);
    }*/
})();