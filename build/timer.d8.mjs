import {hrtime} from "process";

let begin;
export default
(async () => {
    const worker = new Worker("./time-worker.mjs");
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