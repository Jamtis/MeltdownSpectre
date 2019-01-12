const array = new Uint8Array(1 << 24);
let junk = 0;

for (let i = 0; i < 1 << 24; ++i) {
    junk ^= array[i];
}