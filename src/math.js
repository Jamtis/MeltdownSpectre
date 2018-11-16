export function mean(array) {
    let sum = 0;
    for (const value of array) {
        sum += value;
    }
    return sum / array.length;
};

export function zIndex(index, array) {
    let sum = 0;
    let ssum = 0;
    for (const value of array) {
        sum += value;
        ssum += value ** 2;
    }
    const mean = sum / array.length;
    // console.log("mean", mean);
    const deviation = (ssum - sum ** 2 / array.length) ** .5 / (array.length - 1);
    // console.log("deviation", deviation);
    return (array[index] - mean) / deviation;
};

export function min(array) {
    let min = Infinity;
    for (const value of array) {
        if (value < min) {
            min = value;
        }
    }
    return min;
};