export default
async function divideInterval([interval_start, interval_end], length, getter) {
    const pairs = [];
    pairs.push([interval_start, await getter(interval_start)]);
    pairs.push([interval_end, await getter(interval_end)]);
    
    while (pairs.length < length) {
        pairs.sort(([a], [b]) => a - b);
        let max_index = 0;
        let max_value_difference = 0;
        for (let i = 0; i < pairs.length - 1; ++i) {
            const value_difference = Math.abs(pairs[i + 1][1] - pairs[i][1]);
            if (value_difference > max_value_difference) {
                max_value_difference = value_difference;
                max_index = i;
            }
        }
        const max_interval_start = pairs[max_index][0];
        const max_interval_end = pairs[max_index + 1][0];
        const max_interval_center = (max_interval_start + max_interval_end) / 2;
        const center_value = await getter(max_interval_center);
        pairs.push([max_interval_center, center_value]);
    }
    return pairs;
};