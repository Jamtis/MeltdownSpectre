import download from "../download.js";
// import _console from "../console.js";
import plot from "../plot.js";
import SpectreReader from "../SpectreReader.js";

let cache_size = 16;
let duration = 600;
try {
    [duration, cache_size] = JSON.parse(location.search.substr(1));
} catch (error) {}
const spectre_reader = new SpectreReader(1, undefined, 0);
const storage = {};
setTimeout(async () => {
    const start = performance.now();
    let now = 0;
    while (now - start < duration * 1e3) {
        now = await performMeasurement(cache_size);
    }
    download("spectre.json", JSON.stringify({
        storage,
        date: Date.now(),
        duration,
        cache_size
    }));
    alert("finished");
}, 0);

async function performMeasurement(cache_size) {
    // perform spectre
    const result = await spectre_reader.getDataAnalysis(cache_size);
    result.time_stamp = performance.now();
    // save result
    storage[result.time_stamp] = result;
    // plot current state
    plot(storage, ["ratio"]);
    // display current state
    document.querySelector("#storage").innerHTML += JSON.stringify(storage);
    return result.time_stamp;
}