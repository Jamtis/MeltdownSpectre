import download from "../download.js";
// import _console from "../console.js";
import divideInterval from "../divideInterval.js";
import plot from "../plot.js";
import SpectreReader from "../SpectreReader.js";

let interval = [0, 64];
try {
    interval = JSON.parse(location.search.substr(1));
} catch (error) {}
const length = 50;
const cache_duration = 60;
const iteration_count = 1e1;
const z_threshold = 10;
const min_step_width = .1;
const spectre_reader = new SpectreReader(iteration_count, z_threshold, cache_duration);
const storage = {};
setTimeout(async () => {
    const pairs = await divideInterval({
        interval,
        length,
        getter: wrap_data,
        min_step_width
    });
    download("spectre.json", JSON.stringify({
        storage,
        date: Date.now(),
        length,
        cache_duration,
        iteration_count,
        z_threshold,
        min_step_width,
        interval
    }));
}, 0);

async function wrap_data(cache_size) {
    // perform spectre
    const result = await spectre_reader.getDataAnalysis(cache_size);
    // save result
    storage[cache_size] = result;
    // plot current state
    plot(storage, ["ratio", "rate", "duration"]);
    // display current state
    document.querySelector("#storage").innerHTML += JSON.stringify(storage);
    // return measure
    return result.ratio;
}