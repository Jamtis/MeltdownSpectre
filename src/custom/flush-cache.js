const offset = 64;
// prevent optimization
let junk = 0;
const size = 4 * (1 << 20);
const dataview = new DataView(new ArrayBuffer(size));
function flushCache() {
    for (let i = 0; i < size / offset; ++i) {
        // read array value into cache
        junk ^= dataview.getUint32(i * offset);
    }
    return junk;
}

export default flushCache;