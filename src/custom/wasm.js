import TimerPromise from "./timer.js";
import {zIndex, mean} from "../math.js";
import cache from "./cache.js";
import codeBuffer from "./wasm.buffer.js";
let Timer;
const AsyncFunction = (async () => {}).constructor;

const success_meta_data = [];
const faulty_meta_data = [];

async function initWASM() {
    let i = 0;
    const wasm_memory = new WebAssembly.Memory({initial: 110});
    const {instance} = await WebAssembly.instantiate(codeBuffer, {
        js: {
            mem: wasm_memory
        },
        env: {
            _Z10startTimerv: Timer.restore,
            _Z9stopTimerv: Timer.load
            /*_Z3logj(argument) {
              console.log("log", argument, i++);
            },
            _ZNSt3__115__thread_structC1Ev(...args) {
                console.log("_ZNSt3__115__thread_structC1Ev args", args);
            },
            _ZNSt3__115__thread_structD1Ev(...args) {
                console.log("_ZNSt3__115__thread_structD1Ev args", args);
            },
            _ZNSt3__119__thread_local_dataEv(...args) {
                console.log("_ZNSt3__119__thread_local_dataEv args", args);
            },
            _ZNSt3__120__throw_system_errorEiPKc(...args) {
                console.log("_ZNSt3__120__throw_system_errorEiPKc args", args);
            },
            _ZNSt3__16threadD1Ev(...args) {
                console.log("_ZNSt3__16threadD1Ev args", args);
            },
            _ZdlPv(...args) {
                console.log("_ZdlPv args", args);
            },
            _Znwj(...args) {
                console.log("_Znwj args", args);
            },
            pthread_create(...args) {
                console.log("pthread_create args", args);
            },
            pthread_getspecific(...args) {
                console.log("pthread_getspecific args", args);
            },
            pthread_setspecific(...args) {
                console.log("pthread_setspecific args", args);
            }*/
        }
    });
    // console.log("exports", instance.exports);
    const init_result = instance.exports._Z10initializev();
    console.log("init result", init_result);

    const page_size = instance.exports._Z11getPageSizev();
    const probe_length = instance.exports._Z14getProbeLengthv();
    const probe_size = probe_length * page_size;
    const probe_address = instance.exports._Z15getProbeAddressv();
    const probe_table = new Uint8Array(wasm_memory.buffer, probe_address, probe_size);
    const secret_address = instance.exports._Z16getSecretAddressv();
    const secret_table = new Uint8Array(wasm_memory.buffer, secret_address, probe_size);
    for (let i = 0; i < probe_size; i += page_size) {
        secret_table[i] = Math.random() * 256 | 0;
    }

    return {
        page_size,
        probe_size,
        probe_length,
        probe_table,
        secret_table,
        exports: instance.exports
    };
}

(async () => {
    Timer = await TimerPromise;
    try {
        const wasm_configuration = await initWASM();
        cache.flush();
        let junk = 0;
        const {
            page_size,
            probe_size,
            probe_length,
            probe_table,
            secret_table,
            exports
        } = wasm_configuration;
        // initialize probe data to mitigate first access effects
        for (let i = 0; i < probe_length; ++i) {
            const probe_index = i * page_size;
            // junk ^= other_table[probe_index];
            probe_table[probe_index] = Math.random() * 256 | 0;
        }
        console.log("start tests");
        const timer_limit = 50;
        for (var i = 0, c = 0, t = 0; i < 1e2 && t < timer_limit; ++i) {
            // try deoptimization
            const test_probe_index = Math.random() * probe_length | 0;
            await new Promise(async (resolve, reject) => {
                // setTimeout(async () => {
                    try {
                        const success = await run_tests(wasm_configuration, test_probe_index);
                        keep_book(success);
                        c += success;
                        t = 0;
                        resolve();
                    } catch (error) {
                        if (error.message == "deopt") {
                            resolve();
                        } else if (error.message == "timer fault") {
                            console.warn("timer fault", t + 1);
                            ++t;
                            --i;
                            resolve();
                            // setTimeout(resolve, 0);
                        } else {
                            reject(error);
                        }
                    }
                // }, 0);
            });
        }
        if (t >= timer_limit) {
            console.warn("critical timer issue");
        }
        console.log("match ratio", c / (i + 1));
        const success_z_mean = mean(success_meta_data);
        const faulty_z_mean = mean(faulty_meta_data);
        console.log("success_meta_data", success_z_mean, success_meta_data);
        console.log("faulty_meta_data", faulty_z_mean, faulty_meta_data);
    } catch (error) {
        console.error(error);
    }
    Timer.terminate();
    // location.reload();
})();

async function run_tests(wasm_configuration, test_probe_index) {
    const {
        page_size,
        probe_size,
        probe_length,
        probe_table,
        secret_table,
        exports
    } = wasm_configuration;
    
    // let probe_result;
    // eval("probe_result=(" + flush_JS_reload_JS_probe_JS.toString() + ")();");
    let probe_result = flush_JS_reload_JS_probe_JS(); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    return probe_result == test_probe_index;
    
    function flush_WASM_reload_WASM_probe_WASM() {
        // console.groupCollapsed("flush_WASM_reload_WASM_probe_WASM");
        exports._Z10flushCachev();
        exports._Z6reloadh(test_probe_index);
        const result = exports._Z10probeTablev();
        // console.groupEnd();
        if (result == -1) {
            throw Error("timer fault");
        }
        if (test_probe_index == result) {
            console.log("success");
        } else {
            console.log("failure", result, "for", test_probe_index);
        }
        return result;
    }
    function flush_WASM_reload_JS_probe_WASM() {
        // console.groupCollapsed("flush_WASM_reload_JS_probe_WASM");
        const probe_index = test_probe_index * page_size;
        exports._Z10flushCachev();
        let junk = 0;
        junk ^= probe_table[probe_index];
        const result = exports._Z10probeTablev() | (junk & 0);
        // console.groupEnd();
        if (result == -1) {
            throw Error("timer fault");
        }
        // console.groupEnd();
        if (test_probe_index == result) {
            console.log("success");
        } else {
            console.log("failure", result, "for", test_probe_index);
        }
        return result;
    }
    function flush_WASM_reload_JS_probe_JS() {
        const time_table = new Uint32Array(probe_length);
        let junk = 0;
        exports._Z10flushCachev();
        junk ^= probe_table[test_probe_index * page_size];
        for (let i = 0; i < probe_length; ++i) {
            const probe_index = i * page_size;
            Timer.restore();
            // access the probe table
            junk ^= probe_table[probe_index];
            time_table[i] = Timer.load();
        }
        let zero_counter = 0;
        let min_index = 0 & junk;
        let min_value = 0xffffffff;
        for (let i = 0; i < probe_length; ++i) {
            const value = time_table[i];
            zero_counter += value == 0;
            if (value < min_value) {
                min_value = value;
                min_index = i;
            }
        }
        if (zero_counter > 1) {
            throw Error("timer fault");
        }
        // log if no timer fault
        console.groupCollapsed("flush_WASM_reload_JS_probe_JS");
        for (let i = 0; i < probe_length; ++i) {
            const value = time_table[i];
            console.log(value + "\t" + i);
        }
        console.groupEnd();
        const z_index = zIndex(time_table, min_value).toFixed(2);
        if (test_probe_index == min_index) {
            console.log("success for", test_probe_index, "with", z_index);
        } else {
            console.log("failure", min_index, "for", test_probe_index, "with", z_index);
        }
        return min_index;
    }
    function flush_JS_reload_JS_probe_JS(indicator_table) {
        const time_table = new Uint32Array(probe_length);
        let junk = 0;
        cache.flush();
        // for (let i = 0; i < 1e2; ++i) {
            junk ^= probe_table[test_probe_index * page_size];
        // }
        eval("(" + probeTable.toString() + ")();");
        /*for (let i = 0; i < probe_length; ++i) {
            const probe_index = i * page_size; // i % 2 ? "string" : i * page_size / 2;
            Timer.restore();
            // access the probe table
            junk ^= probe_table[probe_index];
            time_table[i] = Timer.load();
        }*/
        indicator_table.processTimetable(time_table);
        return analyseTimetable(time_table, indicator_table, test_probe_index) | (junk & 0);
    }
    function flush_JS_reload_WASM_probe_JS() {
        const time_table = new Uint32Array(probe_length);
        let junk = 0;
        cache.flush();
        junk ^= exports._Z6reloadh(test_probe_index);
        for (let i = 0; i < probe_length; ++i) {
            const probe_index = i * page_size;
            Timer.restore();
            // access the probe table
            junk ^= probe_table[probe_index];
            time_table[i] = Timer.load();
        }
        let zero_counter = 0;
        let min_index = 0 & junk;
        let min_value = 0xffffffff;
        for (let i = 0; i < probe_length; ++i) {
            const value = time_table[i];
            zero_counter += value == 0;
            if (value < min_value) {
                min_value = value;
                min_index = i;
            }
        }
        if (zero_counter > 1) {
            throw Error("timer fault");
        }
        // log if no timer fault
        console.groupCollapsed("flush_JS_reload_WASM_probe_JS");
        for (let i = 0; i < probe_length; ++i) {
            const value = time_table[i];
            console.log(value + "\t" + i);
        }
        console.groupEnd();
        const z_index = zIndex(time_table, min_value).toFixed(2);
        if (test_probe_index == min_index) {
            console.log("success for", test_probe_index, "with", z_index);
        } else {
            console.log("failure", min_index, "for", test_probe_index, "with", z_index);
        }
        return min_index;
    }
}

function analyseTimetable(time_table, test_probe_index) {
    let zero_counter = 0;
    let min_index = 0;
    let min_value = 0xffffffff;
    for (let i = 0; i < time_table.length; ++i) {
        const value = time_table[i];
        zero_counter += value == 0;
        if (value < min_value) {
            min_value = value;
            min_index = i;
        }
    }

    const time_mean = mean(time_table);
    const threshold_weight = 0.5;
    const unique_threshold = time_mean * (1 - threshold_weight) + min_value * threshold_weight;
    let threshold_counter = 0;
    for (let i = 0; i < time_table.length; ++i) {
        const value = time_table[i];
        threshold_counter += value <= unique_threshold;
    }
    console.log("mean", time_mean);
    console.log("count under threshold", threshold_counter);

    const z_index = zIndex(time_table, min_value);
    
    try {
        if (zero_counter > 1 ||
            threshold_counter > 1 ||
            time_mean < 5) {
            console.log("would have been", min_index == test_probe_index ? "success" : "failure", "with", z_index);
            throw Error("timer fault");
        }
        /*const snr = zIndex(time_table, 0);
        // console.log("snr", snr);
        if (snr > -10) {
            throw Error("timer fault");
        }*/
        /*if (z_index > -10) {
            throw Error("timer fault");
        }*/
        if (test_probe_index == min_index) {
            console.log(`success ${test_probe_index}`.padEnd(15), "with", parseFloat(z_index.toFixed(2)));
            success_meta_data.push(threshold_counter);
            // success_meta_data.push(z_index);
        } else {
            console.log(`failure ${min_index} for ${test_probe_index}`.padEnd(15), "with", parseFloat(z_index.toFixed(2)));
            faulty_meta_data.push(threshold_counter);
            // faulty_meta_data.push(z_index);
        }
    } finally {
        // log if no timer fault
        console.groupCollapsed("flush_JS_reload_JS_probe_JS");
        for (let i = 0; i < time_table.length; ++i) {
            const value = time_table[i];
            console.log(value + "\t" + i);
        }
    console.groupEnd();
    }
    return min_index;
}

function probeTable() {
    for (let i = 0; i < probe_length; ++i) {
        const probe_index = i * page_size; // i % 2 ? "string" : i * page_size / 2;
        Timer.restore();
        // access the probe table
        junk ^= probe_table[probe_index];
        time_table[i] = Timer.load();
    }
}

function keep_book(success) {
    let distribution;
    try {
        distribution = JSON.parse(localStorage.getItem("distribution"));
    } catch (error) {}
    distribution = distribution || [];
    let current_iteration = parseInt(localStorage.getItem("current_iteration")) | 0;
    if (success) {
        ++current_iteration;
    } else {
        distribution[current_iteration] = (distribution[current_iteration] | 0) + 1;
        localStorage.setItem("distribution", JSON.stringify(distribution));
        current_iteration = 0;
    }
    localStorage.setItem("current_iteration", current_iteration);
}