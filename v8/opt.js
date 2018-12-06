try {
    const process = require('process');
    const {performance} = require('perf_hooks');

    /*const sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);
    const time_array = new Uint32Array(sharedbuffer);
    // const worker = new Worker("./time-worker.js");
    const worker = new Worker("./time-worker.js", {
        workerData: sharedbuffer
    });*/

    const storage = {};
    
    let junk = 0;
    const page_size = 1 << 12;
    const cache_size = 20 * 4 * (1 << 20);
    const cache_array = new Uint32Array(cache_size / 4);
    const probe_table = new Uint32Array(256 * page_size);
    // const time_table = new Uint32Array(256);
    const time_table = [];
    let try_to_deopt = 0;
    const deopt_objects = [257, undefined, {}, []];

    console.log("\x1b[32m", "start", "\x1b[0m");
    for (let i = 0; i < 256 * 2; ++i) {
        console.log("\n\x1b[32miteration", i, "\x1b[0m");
        // evictReloadFlush(i % 256, !(i < 120 || (i % 5)));
        try {
            evictReloadFlush(i % 256, try_to_deopt ? deopt_objects[0] : 0, i);
        } catch (error) {
            console.error(error);
        }
    }
    console.log(storage);
    
    function evictCache() {
        const quarter_size = cache_size / 4;
        // console.timeStamp("evict");
        for (let i = 0; i < quarter_size; ++i) {
            // read array value into cache
            junk ^= cache_array[i];
        }
    }

    function reloadIndex(index) {
        return probe_table[index * page_size];
    }

    function probeTable(deopt) {
        // reloadIndex(0);
        for (let i = 0; i < 256; ++i) {
            // const begin = performance.now();
            const hrTime = process.hrtime.bigint();
            junk ^= reloadIndex(i | deopt);
            // time_table[i] = performance.now() - begin;
            time_table[i] = process.hrtime.bigint() - hrTime;
        }
    }

    function evictReloadFlush(index, deopt, iteration) {
        evictCache();
        junk ^= reloadIndex(index);
        let dynamic_probeTable;
        eval("dynamic_probeTable="+ probeTable.toString().replace(/probeTable/, "probeTable" + index));
        dynamic_probeTable(deopt);
        // probeTable(deopt);
        console.log("\x1b[32mdeopt", deopt, "\x1b[0m");
        displayTimetable(iteration, deopt);
        if (!isNaN(index)) {
            return time_table;
        }
        // console.log("time_table", time_table);
    }
    
    function displayTimetable(iteration, deopt) {
        let sum = 0n;
        for (const time of time_table) {
            sum += time;
        }
        const mean_time = parseInt(sum) / time_table.length;
        console.log("\x1b[32mmean time", mean_time, "\x1b[0m");
        storage[iteration] = {
            mean_time,
            deopt
        };
        if (mean_time < 100) {
            if (try_to_deopt) {
                deopt.push(deopt_objects.shift());
            }
            try_to_deopt = true;
        } else {
            try_to_deopt = false;
        }
    }
    
    function getRandomArgument(index) {
        if (index < 50) {
            // opt case
            return 0;
        }
        if (index == 50)
            return (index + 1) % 2 * 257;
        if (index < 100) {
            // deopt training
            return 0;
        }
        if (index < 150) {
            // opt again
            return 0;
        }
        if (index < 200) {
            return;
        }
        return 0;
        // r /= 256;
        const r = Math.random();
        if (r > .75) {
            return {};
        } else if (r > .5) {
            return "fdjslg";
        } else if (r > .25) {
            return 1e9;
        } else  {
            return 0;
        }
    }
} catch (error) {
    console.error(error);
}
