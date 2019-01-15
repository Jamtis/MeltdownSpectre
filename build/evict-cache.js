define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = evictCache;
  let junk = 0;
  let array;
  const CACHE_LINE_SIZE = 64 * 8; // bits

  const BITS_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT * 8; // bits

  const INDEX_DELTA = CACHE_LINE_SIZE / BITS_PER_ELEMENT;

  function evictCache(cache_size) {
    if (!array || cache_size > array.byteLength) {
      const buffer_size = 1 << (Math.ceil(Math.log2(cache_size)) | 2);
      array = new Uint32Array(new ArrayBuffer(buffer_size));
    } // console.timeStamp("evict");


    const index_limit = cache_size / Uint32Array.BYTES_PER_ELEMENT;

    for (let i = 0; i < index_limit; i += INDEX_DELTA) {
      // read array value into cache
      junk ^= array[i];
    }

    return junk;
  }

  ;
});