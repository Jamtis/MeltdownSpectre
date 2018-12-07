import plot from "./helper/plot.mjs";

const worker = new Worker("worker.mjs", {
    type: "module"
});

const draw = ({data}) => {
    // plot(data, ["successes", "ratio", "success_rate"]);
    plot(data, ["max_indicator_index", "max_indicator"]);
};
worker.addEventListener("message", draw);