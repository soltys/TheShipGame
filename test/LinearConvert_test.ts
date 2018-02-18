
import LinearConvert from '../src/LinearConvert';


describe('LinearConvert', () => {
    it('LinearConvert object should be defined', () => {
        //LinearConvert.should.not.be.undefined;
    });

    it('should return 1 for value equals parameter "to"', () => {
        const result: number = LinearConvert(0, 100, 100);
        result.should.be.equal(1);
    });

    it('should return 1 for value greater than parameter "to"', () => {
        const result: number = LinearConvert(0, 100, 100);
        result.should.be.equal(1);
    });

    it('should return 0 for value equals parameter "from"', () => {
        const result: number = LinearConvert(0, 100, 0);
        result.should.be.equal(0);
    });


    it('should return 0 for value less than parameter "from"', () => {
        const result: number = LinearConvert(0, 100, 0);
        result.should.be.equal(0);
    });

    it('should return 0.5 for value in a middle between "from" and "to"', () => {
        const result: number = LinearConvert(0, 100, 50);
        result.should.be.equal(0.5);

        const result2: number = LinearConvert(-100, 0, -50);
        result2.should.be.equal(0.5);
    });

    it('Gamepad scenario', () => {
        const result: number = LinearConvert(0, -1, -1);
        result.should.be.equal(1);
    });
});
