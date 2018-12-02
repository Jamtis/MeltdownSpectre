const offset = 64;
// prevent optimization
let junk = 0;
const size = 20 * 4 * (1 << 20);
const dataview = new DataView(new ArrayBuffer(size));
function evictCache(_size = size) {
    for (let i = 0; i < _size / 4; ++i) {
        // read array value into cache
        junk ^= dataview.getUint32(i);
    }
    return junk;
}

export default evictCache;