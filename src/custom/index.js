import divideInterval from "../divideInterval.js";
import plot from "../plot.js";
import readMemorySafely_promise from "./read-memory-safely.js";
// import timer_promise from "./timer.js";

const worker = new Worker("worker.js", {
    type: "module"
});
worker.addEventListener("message", ({data}) => {
    plot(data, ["successes", "ratio", "success_rate"]);
});