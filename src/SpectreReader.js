import {zIndex} from "./math.js";

export default
class SpectreReader {
    constructor(iteration_count, z_threshold, cache_duration) {
        // setup
        this.worker = new Worker("../check-worker.js");
        this.__iteration_count = iteration_count;
        this.__z_threshold = z_threshold;
        // iframe callback
        this.worker.addEventListener("message", event => {
            // deconstruct return value
            const [match_count, length, cache_size] = event.data;
            // ratio of the current iteration
            const match_ratio = match_count / length;
            this.__match_array.push(match_ratio);
            // updat ethe counters
            this.__overall_length += length;
            this.__overall_match_count += match_count;
            // overall ratio the current cache iteration
            const overall_ratio = this.__overall_match_count / this.__overall_length;
            // overall time difference
            const time_difference = (performance.now() - this.__start_time) / 1e3;
            // overall (correct) match rate
            const overall_rate = this.__overall_match_count / time_difference;
            // log current state
            console.log(`
cache size:\t${cache_size}
match ratio:\t${match_ratio}
overall ratio:\t${overall_ratio}
correct data rate:\t${overall_rate} b/s`);
            
            // return if the specified iterations are done
            if (time_difference >= cache_duration) {
            // if (this.__current_iteration >= this.__iteration_count) {
                const z_index = zIndex(this.__match_array);
                console.log("z index:\t", z_index);
                if (z_index >= this.__z_threshold || this.__z_threshold === undefined) {
                    // result data
                    const result = {
                        duration: time_difference,
                        ratio: overall_ratio,
                        rate: overall_rate,
                        data_length: this.__overall_length,
                        cache_size,
                        z_index
                    };
                    // resolve the temp promise
                    this.__resolve(result);
                    return;
                }
            }
            // trigger next iteration
            this.worker.postMessage(cache_size);
            ++this.__current_iteration;
        });
    }
    getDataAnalysis(cache_size) {
        const temp_promise = new Promise(resolve => {
            this.__resolve = resolve;
        });
        // init counters for cache iteration
        this.__overall_length = 0;
        this.__match_array = [];
        this.__overall_match_count = 0;
        this.__current_iteration = 0;
        // give the worker work
        this.worker.postMessage(cache_size);
        // init start time
        this.__start_time = performance.now();
        // return the promse that is resolved by the iframe callback
        return temp_promise;
    }
}