import {mean, zIndex} from "../math.js";
import wasm_configuration_promise from "./wasm-configuration.js";

export default (async () => {
    const {probe_length} = await wasm_configuration_promise;
    const indicator_table = new Uint32Array(probe_length);
    return {
        indicator_table,
        reset: indicator_table.fill.bind(indicator_table, 0),
        processTimetable(time_table, cache_hit_weight) {
            let zero_counter = 0;
            let min_index = 0;
            let min_value = 0xffffffff;
            for (let i = 0; i < time_table.length; ++i) {
                const value = time_table[i];
                zero_counter += value == 0;
                if (value < min_value) {
                    min_value = value;
                    min_index = i;
                }
            }

            const time_mean = mean(time_table);
            const unique_threshold = time_mean * (1 - cache_hit_weight) + min_value * cache_hit_weight;

            if (zero_counter > 1 || time_mean < 5) {
                throw Error("timer fault");
            }
            
            // count potential cahce hits
            for (let i = 0; i < time_table.length; ++i) {
                const value = time_table[i];
                if (value <= unique_threshold) {
                    ++indicator_table[i];
                }
            }
        },
        analyseTimetable(time_table, cache_hit_weight, test_probe_index) {
            let zero_counter = 0;
            let min_index = 0;
            let min_value = 0xffffffff;
            for (let i = 0; i < time_table.length; ++i) {
                const value = time_table[i];
                zero_counter += value == 0;
                if (value < min_value) {
                    min_value = value;
                    min_index = i;
                }
            }

            const time_mean = mean(time_table);
            const unique_threshold = time_mean * (1 - cache_hit_weight) + min_value * cache_hit_weight;
            let threshold_counter = 0;
            for (let i = 0; i < time_table.length; ++i) {
                const value = time_table[i];
                threshold_counter += value <= unique_threshold;
            }
            console.log("\n\ntimetable analysis");
            console.log("mean", time_mean);
            console.log("counts under threshold", threshold_counter);

            const z_index = zIndex(time_table, min_value);

            try {
                if (zero_counter > 1 ||
                    time_mean < 5) {
                    console.log("would have been", min_index == test_probe_index ? "success" : "failure", "with", z_index);
                    console.warn("timer fault");
                } else {
                    if (test_probe_index == min_index) {
                        console.log(`success ${test_probe_index}`.padEnd(15), "with", parseFloat(z_index.toFixed(2)));
                        // success_meta_data.push(threshold_counter);
                        // success_meta_data.push(z_index);
                    } else {
                        console.log(`failure ${min_index} for ${test_probe_index}`.padEnd(15), "with", parseFloat(z_index.toFixed(2)));
                        // faulty_meta_data.push(threshold_counter);
                        // faulty_meta_data.push(z_index);
                    }
                }
            } finally {
                // log if no timer fault
                console.groupCollapsed("flush_JS_reload_JS_probe_JS");
                for (let i = 0; i < time_table.length; ++i) {
                    const value = time_table[i];
                    console.log(value + "\t" + i);
                }
                console.groupEnd();
            }
        }
    };
})();