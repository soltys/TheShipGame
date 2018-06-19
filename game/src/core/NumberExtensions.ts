Number.prototype.limit = function (lowEnd, highEnd) {
    const val = <number>this;

    return Math.max(Math.min(val, highEnd), lowEnd);
};
