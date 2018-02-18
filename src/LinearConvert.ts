export default function LinearConvert(from: number, to: number, value: number): number {
    if (to < from) {
        return LinearConvertReverse(from, to, value);
    }
    if (value <= from) {
        return 0;
    }

    if (value >= to) {
        return 1;
    }


    return (value - from) / Math.abs(to - from);
}

function LinearConvertReverse(from: number, to: number, value: number): number {
    if (value >= from) {
        return 0;
    }

    if (value <= to) {
        return 1;
    }

    return Math.abs((value - from) / Math.abs(to - from));
}
