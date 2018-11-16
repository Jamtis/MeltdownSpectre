const cache_size = 3 * 2 ** 20; // ~x MB
const buffer = new ArrayBuffer(cache_size);
const dataview = new DataView(buffer);
const offset = 2 ** 6;
// prevent optimization
let temp = 0;
export default function flushCache(temp) {
    for (let i = 0; i < cache_size / offset; ++i) {
        // read array value into cache
        temp ^= dataview.getUint32(i * offset);
    }
};