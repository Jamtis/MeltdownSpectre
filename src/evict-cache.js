// prevent optimization
let junk = 0;
let array;

export default
function evictCache(cache_size) {
    if (!array || cache_size > array.byteLength) {
        array = new Uint32Array(new ArrayBuffer(1 << (Math.ceil(Math.log2(cache_size)) | 2)));
    }
    // console.timeStamp("evict");
    for (let i = 0; i < cache_size; i += 1) {
        // read array value into cache
        junk ^= array[i];
    }
    return junk;
};