import plot from "./helper/plot.js";

const worker = new Worker("worker.js", {
    type: "module"
});

const draw = ({data}) => {
    // plot(data, ["successes", "ratio", "success_rate"]);
    plot(data, ["max_indicator_index", "max_indicator"]);
};
worker.addEventListener("message", draw);