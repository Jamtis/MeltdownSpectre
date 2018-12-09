import plot from "./helper/plot.js";
import download from "./helper/download.js";

const worker = new Worker("index.js", {
    type: "module"
});

const draw = ({data}) => {
    const {
        display_data,
        storage,
        download: download_string
    } = data;
    // plot(data, ["successes", "ratio", "success_rate"]);
    if (download_string) {
        download(download_string, JSON.stringify(storage));
    }
    plot(display_data, ["success_ratio", "success_rate", "mean_second_ratio"]);
};
worker.addEventListener("message", draw);