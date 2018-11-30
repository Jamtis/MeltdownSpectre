export default
async function divideInterval(options) {
    let {
        interval: [interval_start, interval_end],
        length,
        getter,
        min_step_width
    } = options;
    const pairs = [];
    pairs.push([interval_start, await getter(interval_start)]);
    if (interval_end != interval_start) {
        if (!isNaN(min_step_width)) {
            if (Math.abs(interval_end - interval_start) < min_step_width * length) {
                console.warn("interval too narrow for length and min_step_width; adjusting min_step_width adaptively");
            }
        } else {
            min_step_width = 0;
        }
        pairs.push([interval_end, await getter(interval_end)]);
        while (pairs.length < length) {
            debugger;
            pairs.sort(([a], [b]) => a - b);
            let max_index;
            let max_value_difference = -Infinity;
            for (let i = 0; i < pairs.length - 1; ++i) {
                const value_difference = Math.abs(pairs[i + 1][1] - pairs[i][1]);
                if (value_difference > max_value_difference && pairs[i + 1][0] - pairs[i][0] > min_step_width) {
                    max_value_difference = value_difference;
                    max_index = i;
                }
            }
            if (max_index === undefined) {
                min_step_width /= 2;
                continue;
            }
            const max_interval_start = pairs[max_index][0];
            const max_interval_end = pairs[max_index + 1][0];
            const max_interval_center = (max_interval_start + max_interval_end) / 2;
            const center_value = await getter(max_interval_center);
            pairs.push([max_interval_center, center_value]);
        }
    }
    return pairs;
};