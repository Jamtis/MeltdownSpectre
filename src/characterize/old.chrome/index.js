import plot from "../../helper/plot.js";
import download from "../../helper/download.js";

/*const worker = new Worker("./worker.js" + location.search, {
    type: "module"
});
worker.addEventListener("message", draw);*/

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

window.draw = function draw({data}) {
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

import sweepParameter_promise from "./sweep-parameter.js";
import timer_promise from "../../timer.js";

(async () => {
    const timer = await timer_promise;
    // overwrite
    /*let before;
    timer.restore = () => {
        before = performance.now();
    };
    timer.load = () => {
        return performance.now() - before;
    };*/
    const sweepParameter = await sweepParameter_promise;
    
    console.time("test");
    try {
        const method_name = new URL(location).searchParams.get("method");
        const division_property = new URL(location).searchParams.get("division") || "success_ratio";
        console.log("start sweep", method_name);
        await sweepParameter(method_name, division_property);
    } catch (error) {
        console.error(error);
    } finally {
        timer.terminate();
        console.timeEnd("test");
    }
})();