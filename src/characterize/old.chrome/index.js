import plot from "../../helper/plot.js";
import download from "../../helper/download.js";

const worker = new Worker("./worker.prep.js" + location.search, {
    type: "classic"
});
worker.addEventListener("message", draw);

const trace_names = ["success_ratio",
                     "success_rate",
                     "mean_second_ratio",
                     "second_ratio_SNR",
                     "mean_time",
                     "mean_total_iterations_failing",
                     "mean_total_iterations",
                     "total_iterations_SNR",
                     "probe_index",
                     "order_index"];

function draw({data}) {
    const {
        storage,
        download: download_string
    } = data;
    const {
        division_results,
        sequential_results
    } = storage;
    // plot(data, ["successes", "ratio", "success_rate"]);
    if (typeof download_string == "string") {
        download(download_string, JSON.stringify(storage));
    }
    plot(storage.division_results, trace_names, trace_name => trace_name + " (division)");
    plot(storage.sequential_results, trace_names, trace_name => trace_name + " (sequential)");
};