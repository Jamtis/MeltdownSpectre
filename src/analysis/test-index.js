import {mean, zIndex} from "../helper/math.js";
import allocReloadProbe_promise from "./alloc-reload-probe.js";
import IndicatorTable from "../indicator-table.js";

export default (async () => {
    const allocReloadProbe = await allocReloadProbe_promise;
    
    return async function testIndex(probe_index, min_iterations, max_cache_hit_number, page_size, probe_length) {
        const indicator_table = new IndicatorTable(probe_length);
        let max_indicator;
        let max_indicator_index;
        const mean_times = [];
        // console.log("probe_index", probe_index);
        let i = 0, total_iterations = 0;
        for (; i < min_iterations; ++total_iterations) {
            // await Promise.resolve();
            // await new Promise(resolve => setTimeout(resolve, 0));
            const time_table = allocReloadProbe(probe_index, page_size, probe_length);
            // for (let i = 0; i < 1e8; ++i);
            // console.log("tt", [...time_table]);
            const mean_time = indicator_table.processTimetable(time_table, max_cache_hit_number);
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
            // analyse using secret information
            // analyseTimetable(time_table, cache_hit_weight, probe_index);
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
        return {
            max_indicator_index,
            second_ratio,
            // normalized_indicator_table: indicator_table.getNormalized(),
            mean_time,
            total_iterations
        };
    };
})();