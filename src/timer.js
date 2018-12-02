const sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);
const array = new Uint32Array(sharedbuffer);

export default
(async () => {
    const worker = new Worker("./time-worker.js");
    const Timer = {
        restore() {
            // array[0] = 0;
            Atomics.store(array, 0, 0);
            // return Timer.load();
        },
        load() {
            // return array[0];
            return Atomics.load(array, 0);
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