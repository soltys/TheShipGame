import Axis from '@core/Axis';

describe('Axis', () => {
    describe('add', () => {
        it('values are added', () => {
            const a = new Axis(0, 0);
            a.add(new Axis(1, 2));

            a.x.should.be.equal(1);
            a.y.should.be.equal(2);
        });
    });
    describe('multiply', () => {
        it('values are multiplied', () => {
            const a = new Axis(0, 1);
            a.multiply(new Axis(1, 2));

            a.x.should.be.equal(0);
            a.y.should.be.equal(2);
        });
    });

    describe('multiplyByNumber', () => {
        it('values are multiplied by same number', () => {
            const expected = new Axis(0, 5);
            expected.multiplyByNumber(2);

            expected.x.should.be.equal(0);
            expected.y.should.be.equal(10);
        })
    })

    describe('clone', () => {
        it('new object have same values', () => {
            const a = new Axis(7, 1);
            const result = a.clone();

            result.x.should.be.equal(7);
            result.y.should.be.equal(1);
        });
    });

});
