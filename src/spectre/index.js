import plot from "../helper/plot.js";
import download from "../helper/download.js";

const worker = new Worker("./worker.js" + location.search, {
    type: "module"
});
worker.addEventListener("message", draw);

function draw({data}) {
    const {
        test_results,
        storage,
        download: download_string
    } = data;
    // plot(data, ["successes", "ratio", "success_rate"]);
    if (typeof download_string == "string") {
        download(download_string, JSON.stringify(storage));
    }
    plot(test_results, ["success_ratio", "success_rate", "mean_second_ratio"]);
};