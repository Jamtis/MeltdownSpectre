import {mean, zIndex} from "./math.js";
import flushReloadProbe_promise from "../flush-reload-probe.js";
import indicator_table_promise from "../indicator-table.js";
import wasm_configuration_promise from "../wasm-configuration.js";
import evictCache from "../evict-cache.js";
import timer_promise from "../timer.js";
import testIndex_promise from "../test-index.js";
import testIndexRepeatedly_promise from "../test-index-repeatedly.js";
import divideInterval from "../divide-interval.js";
import plot from "./plot.js";

let counter = 0;

export default
async function deopt(_function) {
    // provide global modules
    const testIndexRepeatedly = testIndexRepeatedly_promise;
    const testIndex = await testIndex_promise;
    const indicator_table = await indicator_table_promise;
    const flushReloadProbe = await flushReloadProbe_promise;
    const timer = await timer_promise;
    const {
        page_size,
        probe_length,
        probe_table
    } = await wasm_configuration_promise;
    
    // to prevent timer precision degradation due to optimizations
    // stamp the function each time anew with a new name
    const function_name = _function.name;
    const new_function_string = _function.toString().replace(`function ${function_name}`, `function deopt_${function_name}${counter++}`);
    return eval(`(${new_function_string})`);
}