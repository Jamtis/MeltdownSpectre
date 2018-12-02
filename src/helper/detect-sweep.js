export default
function detectSweep(array, weight = .5) {
    let max = -Infinity;
    let max_index;
    let is_at_max;
    let min_since_max;
    let min_since_max_index;
    let is_threshold_hitting;
    let threshold;
    for (let i = 0; i < array.length; ++i) {
        const value = array[i];
        if (value > max) {
            max = value;
            max_index = i;
            min_since_max = max;
            is_at_max = true;
            is_threshold_hitting = false;
        } else {
            if (value < min_since_max) {
                min_since_max = value;
                min_since_max_index = i;
                threshold = min_since_max * weight + max * (1 - weight);
                is_threshold_hitting = false;
            } else {
                if (value > threshold) {
                    is_threshold_hitting = true;
                }
            }
            is_at_max = false;
        }
    }
    return is_threshold_hitting;
}