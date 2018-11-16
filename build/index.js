import download from "./download.js";
import _console from "./console.js";
import divideInterval from "./divideInterval.js";

class SpectreReader {
  constructor(iteration_count) {
    // setup
    this.__iframe = document.querySelector("iframe");
    this.__iteration_count = iteration_count; // iframe callback

    addEventListener("message", event => {
      // deconstruct return value
      const [match_count, length, cache_size] = event.data; // ratio of the current iteration

      const match_ratio = match_count / length; // updat ethe counters

      this.__overall_length += length;
      this.__overall_match_count += match_count; // overall ratio the current cache iteration

      const overall_ratio = this.__overall_match_count / this.__overall_length; // overall time difference

      const time_difference = (performance.now() - this.__start_time) / 1e3; // overall (correct) match rate

      const overall_rate = this.__overall_match_count / time_difference; // log current state

      _console.log(`<br>
cache size:\t${cache_size}<br>
match ratio:\t${match_ratio}<br>
overall ratio:\t${overall_ratio}<br>
correct data rate:\t${overall_rate} b/s<br>`); // return if the specified iterations are done


      if (this.__current_iteration >= this.__iteration_count) {
        // result data
        const result = {
          duration: time_difference,
          ratio: overall_ratio,
          rate: overall_rate,
          data_length: this.__overall_length,
          cache_size
        }; // resolve the temp promise

        this.__resolve(result);
      } else {
        // trigger next iteration
        this.__iframe.contentWindow.location.reload();

        ++this.__current_iteration;
      }
    });
  }

  getDataAnalysis(cache_size) {
    const temp_promise = new Promise(resolve => {
      this.__resolve = resolve;
    }); // init counters for cache iteration

    this.__overall_length = 0;
    this.__overall_match_count = 0;
    this.__current_iteration = 0; // reload the iframe

    this.__iframe.contentWindow.location.search = cache_size; // init start time

    this.__start_time = performance.now(); // return the promse that is resolved by the iframe callback

    return temp_promise;
  }

}

const interval = [0, 20];
const length = 1e2;
const iteration_count = 1e1;
const spectre_reader = new SpectreReader(iteration_count);
const storage = {};

(async () => {
  const pairs = await divideInterval(interval, length, wrap_data);
  download("spectre.json", JSON.stringify(storage));
})();

async function wrap_data(cache_size) {
  const result = await spectre_reader.getDataAnalysis(cache_size);
  storage[cache_size] = result;
  return result.ratio;
}