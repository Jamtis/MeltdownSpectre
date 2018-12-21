/*
class BigTable {
    constructor(size) {
        this.array = new Uint8Array(size);
        this.pointer = 0;
        this.size = size;
    }
    getSubarray(size) {
        if (this.pointer + size >= this.size) {
            this.array = new Uint8Array(this.size);
            this.pointer = 0;
        }
        this.pointer += size;
        return this.array.subarray(this.pointer, this.pointer + size);
    }
};
export default new BigTable(1 << 28);
*/

// seems to mitigate crashes on Chrome but slow
export default {
    getSubarray(size) {
        return new Uint8Array(size);
    }
};