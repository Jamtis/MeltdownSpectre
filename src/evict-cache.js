const offset = 64;
// prevent optimization
let junk = 0;
const size = 20 * 4 * (1 << 20);
const array = new Uint32Array(new ArrayBuffer(size));
function evictCache(_size = size) {
    console.timeStamp("evict");
    for (let i = 0; i < _size / 4; ++i) {
        // read array value into cache
        junk ^= array[i];
    }
    return junk;
}

export default evictCache;