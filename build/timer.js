define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let Timer_promise;

  if (typeof Worker == "undefined") {
    // in worker in old chrome
    Timer_promise = (async () => {
      const sharedbuffer = await new Promise(resolve => {
        addEventListener("message", event => {
          resolve(event.data);
        });
      });
      const array = new Uint32Array(sharedbuffer);
      const Timer = {
        restore() {
          Atomics.store(array, 0, 0); // array[0] = 0;
          // console.log("dl", array[0]);
          // return Timer.load();
        },

        load() {
          return Atomics.load(array, 0); // return array[0];
        },

        terminate() {
          worker.terminate();
        }

      };
      return Timer;
    })();
  } else if (typeof performance != "undefined") {
    const sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);
    const array = new Uint32Array(sharedbuffer);

    Timer_promise = (async () => {
      const worker = new Worker("../time-worker.js");
      const Timer = {
        restore() {
          Atomics.store(array, 0, 0); // array[0] = 0;
          // console.log("dl", array[0]);
          // return Timer.load();
        },

        load() {
          return Atomics.load(array, 0); // return array[0];
        },

        terminate() {
          worker.terminate();
        }

      };
      const promise = new Promise(resolve => {
        worker.addEventListener("message", () => {
          resolve(Timer);
        });
        worker.postMessage(sharedbuffer);
      });
      promise.buffer = sharedbuffer;
      return promise;
    })();
  } else {
    let begin;

    Timer_promise = (async () => {
      const {
        hrtime
      } = (await eval(`import("process")`)).default;
      const Timer = {
        restore() {
          begin = hrtime.bigint();
        },

        load() {
          return parseInt(hrtime.bigint() - begin);
        },

        terminate() {}

      };
      return Timer;
    })();
  }

  var _default = Timer_promise;
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

  _exports.default = _default;
});