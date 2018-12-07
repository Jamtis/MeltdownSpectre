import timer_promise from "./timer.mjs";
import code_buffer from "./wasm-buffer.mjs";

export default
(async () => {
    const Timer = await timer_promise;
    const wasm_memory = new WebAssembly.Memory({initial: 110});
    const {instance} = await WebAssembly.instantiate(code_buffer, {
        js: {
            mem: wasm_memory
        },
        env: {
            _Z10startTimerv: Timer.restore,
            _Z9stopTimerv: Timer.load
        }
    });
    // console.log("exports", instance.exports);
    const init_result = instance.exports._Z10initializev();
    // console.log("init result", init_result);

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
})();