import plot from "./helper/plot.js";
import requestAnimationFunction from "https://unpkg.com/requestanimationfunction@1.0.0/requestAnimationFunction.js";

const worker = new Worker("worker.js", {
    type: "module"
});
const draw = requestAnimationFunction(({data}) => {
    // plot(data, ["successes", "ratio", "success_rate"]);
    plot(data, ["max_indicator_index", "max_indicator"]);
});
worker.addEventListener("message", draw);