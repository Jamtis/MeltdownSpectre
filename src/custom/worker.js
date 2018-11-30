import divideInterval from "../divideInterval.js";
import plot from "../plot.js";
import readMemorySafely_promise from "./read-memory-safely.js";
import readMemory_promise from "./read-memory.js";
import timer_promise from "./timer.js";

const storage = {};

(async () => {
    const readMemorySafely = await readMemorySafely_promise;
    const readMemory = await readMemory_promise;
    const timer = await timer_promise;
    console.log("start tests");
    try {
        await readMemorySafely(1e2);
        // await sweepLowerLimit([1<<6, 1 << 6]);
        postMessage(storage);
    } catch (error) {
        console.error(error);
    }
    timer.terminate();
    console.log("end tests");

    function sweepLowerLimit(interval) {
        let c = 0;
        return divideInterval({
            interval,
            length: 20,
            async getter(lower_limit) {
                console.log("iteration", c++);
                console.log("current lower limit", lower_limit);
                const result = await readMemorySafely(lower_limit);
                storage[lower_limit] = result;
                storage[lower_limit].ratio = result.successes / result.counter;
                // plot(storage, ["successes", "ratio", "success_rate"]);
                await new Promise(resolve => setTimeout(resolve, 1e3));
                return result.successes;
            },
            min_step_width: 1
        });
    }
})();