export default
async function divideInterval(options) {
    let {
        interval: [interval_start, interval_end],
        sample_size,
        getter,
        min_step_width,
        integer
    } = options;
    const pairs = [];
    pairs.push([interval_start, await getter(interval_start)]);
    if (interval_end != interval_start) {
        if (!isNaN(min_step_width)) {
            min_step_width = Math.abs(min_step_width);
            if (integer) {
                min_step_width = Math.ceil(min_step_width);
            }
            if (Math.abs(interval_end - interval_start) + 1 < min_step_width * sample_size) {
                console.warn("interval too narrow for length and min_step_width; adjusting min_step_width adaptively");
            }
        } else {
            min_step_width = integer | 0;
        }
        pairs.push([interval_end, await getter(interval_end)]);
        while (pairs.length < sample_size) {
            pairs.sort(([a], [b]) => a - b);
            let max_index;
            let max_value_difference;
            let max_distance = 0;
            for (let i = 0; i < pairs.length - 1; ++i) {
                const value_difference = Math.abs(pairs[i + 1][1] - pairs[i][1]);
                const distance = pairs[i + 1][0] - pairs[i][0];
                if (distance >= 2 * min_step_width) {
                    if (value_difference > max_value_difference || isNaN(max_value_difference)) {
                        max_value_difference = value_difference;
                        max_distance = distance;
                        max_index = i;
                    } else if (value_difference == max_value_difference) {
                        // select for max_distance
                        if (distance > max_distance) {
                            max_distance = distance;
                            max_index = i;
                        }
                    }
                }
            }
            if (max_index === undefined) {
                console.warn("max_index not found");
                if (integer && min_step_width == 1) {
                    break;
                }
                min_step_width /= 2;
                if (integer) {
                    min_step_width = Math.ceil(min_step_width);
                }
                continue;
            }
            const max_interval_start = pairs[max_index][0];
            const max_interval_end = pairs[max_index + 1][0];
            let max_interval_center = (max_interval_start + max_interval_end) / 2;
            if (integer) {
                max_interval_center |= 0;
            }
            const center_value = await getter(max_interval_center);
            pairs.push([max_interval_center, center_value]);
        }
    }
    return pairs;
};