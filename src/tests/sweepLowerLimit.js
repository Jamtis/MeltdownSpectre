export default
function sweepLowerLimit(interval) {
    let c = 0;
    return divideInterval({
        interval,
        length: 20,
        async getter(lower_limit) {
            console.log("iteration", c++);
            console.log("current lower limit", lower_limit);
            const result = await readMemorySafely(lower_limit);
            // storage[lower_limit] = result;
            // storage[lower_limit].ratio = result.successes / result.counter;
            // postMessage(storage);
            // plot(storage, ["successes", "ratio", "success_rate"]);
            await new Promise(resolve => setTimeout(resolve, 1e3));
            return result.successes;
        },
        min_step_width: 1
    });
}