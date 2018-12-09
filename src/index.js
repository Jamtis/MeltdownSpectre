import plot from "./helper/plot.js";
import download from "./helper/download.js";

const worker = new Worker("worker.js", {
    type: "module"
});

const draw = ({data}) => {
    // plot(data, ["successes", "ratio", "success_rate"]);
    download("sweep_max_cache_hit_number.json", JSON.stringify(data));
    plot(data, ["success_ratio", "success_rate"]);
};
worker.addEventListener("message", draw);