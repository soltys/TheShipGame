import '@core/NumberExtensions';

describe('NumberExtension', () => {
    describe('limit', () => {
        it('should return same value when value is between limits', () => {
            const value = 42;
            const result = value.limit(0, 100);

            result.should.be.equal(42);
        });

        it('should return upper-bound limit when value is above limit', () => {
            const value = 101;
            const result = value.limit(0, 100);

            result.should.be.equal(100);
        });

        it('should return lower-bound limit when value is under limit', () => {
            const value = -1;
            const result = value.limit(0, 100);

            result.should.be.equal(0);
        });
    });
});
