const sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);
const array = new Uint32Array(sharedbuffer);
const worker = new Worker("./worker.js");
worker.postMessage(sharedbuffer);
const Timer = {
  restore() {
    Atomics.store(array, 0, 0);
    return Timer.load();
  },

  load() {
    return Atomics.load(array, 0);
  },

  terminate() {
    worker.terminate();
  }

};
export default Timer;