let _export;
if (typeof performance != "undefined") {
    const sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);
    const array = new Uint32Array(sharedbuffer);
    _export = (async () => {
        const worker = new Worker("./time-worker.js");
        const Timer = {
            restore() {
                Atomics.store(array, 0, 0);
                // array[0] = 0;
                // console.log("dl", array[0]);
                // return Timer.load();
            },
            load() {
                return Atomics.load(array, 0);
                // return array[0];
            },
            terminate() {
                worker.terminate();
            }
        };
        return new Promise(resolve => {
            worker.addEventListener("message", () => {
                resolve(Timer);
            });
            worker.postMessage(sharedbuffer);
        });
    })();
} else {
    let begin;
    _export = (async () => {
        const {hrtime} = (await eval(`import("process")`)).default;
        const Timer = {
            restore() {
                begin = hrtime.bigint();
            },
            load() {
                return parseInt(hrtime.bigint() - begin);
            },
            terminate() {
            }
        };
        return Timer;
    })();
}

export default _export;

/*
const sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);
const array = new Uint32Array(sharedbuffer);
export default
(async () => {
    const worker = new Worker("./time-worker.js");
    const Timer = {
        restore() {
            Atomics.store(array, 0, 0);
            // array[0] = 0;
            // console.log("dl", array[0]);
            // return Timer.load();
        },
        load() {
            return Atomics.load(array, 0);
            // return array[0];
        },
        terminate() {
            worker.terminate();
        }
    };
    return new Promise(resolve => {
        worker.addEventListener("message", () => {
            resolve(Timer);
        });
        worker.postMessage(sharedbuffer);
    });
})();
*/