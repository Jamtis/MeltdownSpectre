let window = this;
const {Worker} = require('worker_threads');

// ------------------------------------------------------------------------------------------------------

const sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);
const array = new Uint32Array(sharedbuffer);
const TimerPromise =
(async () => {
    const worker = new Worker("./time-worker.js", {workerData: sharedbuffer});
    /*const response = await fetch("./time-worker.js");
    const encoded_string = btoa(await response.text());
    const script_url = "data:text/javascript;base64," + encoded_string;
    const worker = new Worker(script_url);*/
    const Timer = {
        restore() {
            // array[0] = 0;
            Atomics.store(array, 0, 0);
            return Timer.load();
        },
        load() {
            // return array[0];
            return Atomics.load(array, 0);
        },
        terminate() {
            worker.terminate();
        }
    };
    window.Timer = Timer;
    return new Promise(resolve => {
        worker.on("message", () => {
            resolve(Timer);
        });
        // worker.postMessage(sharedbuffer);
    });
})();

// ------------------------------------------------------------------------------------------------------

let Timer;
(async () => {
    Timer = await TimerPromise;
})();

const offset = 64;
// prevent optimization
let junk = 0;
class Cache {
    constructor(size) {
        this.size = size;
        const buffer = new ArrayBuffer(size);
        this.dataview = new DataView(buffer);
    }
    flush() {
        Timer.restore();
        for (let i = 0; i < this.size / offset; ++i) {
            // read array value into cache
            junk ^= this.dataview.getUint32(i * offset);
        }
        console.log("average cache time", Timer.load() / (this.size / offset));
        return junk;
    };
}

// -------------------------------------------------------------------------------------------------------

const cache = new Cache(4 * (1 << 20));

const code_promise = (async () => {
    return new Uint8Array([0,97,115,109,1,0,0,0,1,141,128,128,128,0,3,96,0,0,96,0,1,127,96,1,127,1,127,2,171,128,128,128,0,2,3,101,110,118,15,95,90,49,48,115,116,97,114,116,84,105,109,101,114,118,0,0,3,101,110,118,13,95,90,57,115,116,111,112,84,105,109,101,114,118,0,1,3,137,128,128,128,0,8,1,1,1,1,1,1,1,2,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,33,6,129,128,128,128,0,0,7,165,129,128,128,0,9,6,109,101,109,111,114,121,2,0,15,95,90,49,48,112,114,111,98,101,84,97,98,108,101,118,0,2,15,95,90,49,48,102,108,117,115,104,67,97,99,104,101,118,0,3,15,95,90,49,48,105,110,105,116,105,97,108,105,122,101,118,0,4,16,95,90,49,49,103,101,116,80,97,103,101,83,105,122,101,118,0,5,19,95,90,49,52,103,101,116,80,114,111,98,101,76,101,110,103,116,104,118,0,6,20,95,90,49,53,103,101,116,80,114,111,98,101,65,100,100,114,101,115,115,118,0,7,21,95,90,49,54,103,101,116,83,101,99,114,101,116,65,100,100,114,101,115,115,118,0,8,10,95,90,54,114,101,108,111,97,100,104,0,9,10,148,130,128,128,0,8,128,129,128,128,0,1,7,127,65,128,120,33,2,3,64,16,0,32,2,65,144,136,129,1,106,16,1,54,2,0,32,2,65,4,106,34,2,13,0,11,65,127,33,2,65,0,33,4,65,144,128,129,1,33,3,65,0,33,5,65,0,33,6,3,64,32,3,40,2,0,34,0,32,2,32,0,32,2,73,34,1,27,33,2,32,4,32,5,32,1,27,33,5,32,3,65,4,106,33,3,32,6,32,0,69,106,33,6,32,4,65,1,106,34,4,65,128,2,71,13,0,11,65,127,32,5,32,6,65,1,75,27,11,192,128,128,128,0,1,3,127,65,0,33,1,65,144,128,128,1,33,0,65,0,33,2,3,64,32,0,40,2,0,32,2,65,255,1,113,115,33,2,32,0,65,128,2,106,33,0,32,1,65,192,0,106,34,1,65,128,32,73,13,0,11,32,2,65,255,1,113,11,132,128,128,128,0,0,65,0,11,133,128,128,128,0,0,65,128,32,11,135,128,128,128,0,0,65,128,128,192,0,11,132,128,128,128,0,0,65,16,11,135,128,128,128,0,0,65,144,128,192,0,11,144,128,128,128,0,0,32,0,65,12,116,65,16,106,45,0,0,16,2,114,11]);
})();

(async () => {
    Timer = await TimerPromise;
    try {
            const wasm_configuration = await initWASM();
        for (let i = 0; i < 20; ++i) {
            await new Promise((resolve, reject) => setTimeout(async () => {
            try {
                const success = await run_tests(wasm_configuration);
                // keep_book(success);
            resolve();
            } catch (error) {
                if (error.message != "timer fault") {
                    reject(error);
                } else {
                    // console.warn("timer fault");
                    --i;
                    resolve();
                }
            }
            }, 0));
        }
    } catch (error) {
        console.error(error);
    }
    Timer.terminate();
    // location.reload();
})();

async function initWASM() {
    let i = 0;
    const wasm_memory = new WebAssembly.Memory({initial: 110});
    const {instance} = await WebAssembly.instantiate(await code_promise, {
        js: {
            mem: wasm_memory
        },
        env: {
            _Z10startTimerv: Timer.restore,
            _Z9stopTimerv: Timer.load,
            _Z3logj(argument) {
              console.log("log", argument, i++);
            }
        }
    });
    // console.log("exports", instance.exports);
    instance.exports._Z10initializev();

    const page_size = instance.exports._Z11getPageSizev();
    const probe_length = instance.exports._Z9getProbeLengthv();
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

async function run_tests(wasm_configuration) {
    const {
        page_size,
        probe_size,
        probe_length,
        probe_table,
        secret_table,
        exports
    } = wasm_configuration;
    let test_probe_index = Math.random() * probe_length | 0;
    cache.flush();
    let probe_result = flush_JS_reload_JS_probe_JS();
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
        const result = exports._Z10probeTablev() | junk;
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
        // console.groupCollapsed("flush_WASM_reload_JS_probe_JS");
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
            // console.log(value, i);
            if (value < min_value) {
                min_value = value;
                min_index = i;
            }
        }
        // console.groupEnd();
        if (zero_counter > 1) {
            throw Error("timer fault");
        }
        const z_index = zIndex(time_table, min_value).toFixed(2);
        if (test_probe_index == min_index) {
            console.log("success for", test_probe_index, "with", z_index);
        } else {
            console.log("failure", min_index, "for", test_probe_index, "with", z_index);
        }
        return min_index;
    }
    function flush_JS_reload_JS_probe_JS() {
        // console.groupCollapsed("flush_WASM_reload_JS_probe_JS");
        const time_table = new Uint32Array(probe_length);
        let junk = 0;
        cache.flush();
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
            // console.log(value + "\t" + i);
            if (value < min_value) {
                min_value = value;
                min_index = i;
            }
        }
        // console.groupEnd();
        if (zero_counter > 1) {
            throw Error("timer fault");
        }
        // const z_index = zIndex(time_table, min_value).toFixed(2);
        if (test_probe_index == min_index) {
            console.log("success for", test_probe_index);//, "with", z_index);
        } else {
            console.log("failure", min_index, "for", test_probe_index);//, "with", z_index);
        }
        return min_index;
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