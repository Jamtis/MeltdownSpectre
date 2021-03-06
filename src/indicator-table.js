import {mean, zIndex} from "./helper/math.js";

export default
class IndicatorTable extends Uint32Array {
    processTimetable(time_table, max_cache_hit_number) {
        let min_index = 0;
        let min_value = Infinity;
        for (let i = 0; i < time_table.length; ++i) {
            const value = time_table[i];
            if (value < min_value) {
                min_value = value;
                min_index = i;
            }
        }

        const mean_time = mean(time_table);
        // console.log(`%cmean ${mean_time | 0}`, "font-size: 1em");

        if (mean_time > 0) {
            // count potential cache hits
            // percentile variant
            // accumulate counts / histogram
            const time_counts = [];
            for (const time of time_table) {
                time_counts[time] = (time_counts[time] | 0) + 1;
            }
            let selector_threshold = 0;
            for (var sum_counts = 0; sum_counts < max_cache_hit_number && sum_counts < time_table.length; ++selector_threshold) {
                sum_counts += time_counts[selector_threshold] | 0;
            }
            --selector_threshold;
            // unique threshold variant
            // const selector_threshold = mean_time * (1 - cache_hit_weight) + min_value * cache_hit_weight;
            // select all times lower than threshold
            if (selector_threshold && sum_counts) {
                for (let i = 0; i < time_table.length; ++i) {
                    const value = time_table[i];
                    if (value <= selector_threshold) {
                        ++this[i];
                    }
                }
                return mean_time;
            }
        } else {
            // console.warn("timer fault");
        }
    }
    getNormalized() {
        const normalized_indicator_table = new Float32Array(this);
        let sum = 0;
        for (let i = 0; i < this.length; ++i) {
            sum += this[i];
        }
        for (let i = 0; i < this.length; ++i) {
            normalized_indicator_table[i] /= sum;
        }
        return normalized_indicator_table;
    }
}