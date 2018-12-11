// import evictCache from "./evict-cache.js";
import timer_promise from "../timer.js";
import big_table from "../big-table.js";

export default (async () => {
    const timer = await timer_promise;
    return flushReloadProbe;
    
    function flushReloadProbe(probe_index, page_size, probe_length) {
        const time_table = new Uint32Array(probe_length);
        
        // const probe_table = new Uint8Array(probe_length * page_size);
        const probe_table = big_table.getSubarray(probe_length * page_size);
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
})();