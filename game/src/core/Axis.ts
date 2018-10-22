export default class Axis {

    private data: { x: number, y: number };

    constructor(x: number, y: number) {
        this.data = {
            x: x,
            y: y
        };
    }


    get x(): number {
        return this.data.x;
    }
    set x(value: number) {
        this.data.x = value;
    }

    get y(): number {
        return this.data.y;
    }
    set y(value: number) {
        this.data.y = value;
    }

    add(value: Axis): Axis {
        return new Axis(
            this.data.x + value.x,
            this.data.y + value.y
        );
    }

    multiply(value: Axis): Axis {
        return new Axis(
            this.data.x * value.x,
            this.data.y * value.y
        );
    }

    multiplyByNumber(value: number): Axis {
        return new Axis(
            this.data.x * value,
            this.data.y * value
        );
    }
}
