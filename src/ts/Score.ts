import GameObject from './common/GameObject';
import * as IGame from './common/IGame';
export default class Score extends GameObject implements IGame.IGameDisplayObject {
    private lastCalledTime: number
    private score: number
    private scoreDisplay: PIXI.Text
    private textStyle: Object;

    constructor(gameWidth) {
        super();
        this.score = 0;

        this.textStyle = {
            fontFamily: 'Fira Sans',
            fontSize: '8px',
            fontWeight: 'bold',
            fill: IGame.Colors.TextColor,
            stroke: IGame.Colors.TextOutlineColor,
            strokeThickness: 2
        };
        this.scoreDisplay = new PIXI.Text('Score: 0000000', this.textStyle);
        this.scoreDisplay.y = 10;
        this.scoreDisplay.x = gameWidth/2 - this.scoreDisplay.width/2;
    }

    init(state:IGame.IGameState):void{
        state.score = this;
    }

    public addToScore(value:number):void{        
        this.score += value;
        this.updateScoreDisplay();
    }

    private updateScoreDisplay() {
        let score = this.leftPad(this.score, 7, '0');
        this.scoreDisplay.text = `Score: ${score}`;
    }

    private cache = [
        '',
        ' ',
        '  ',
        '   ',
        '    ',
        '     ',
        '      ',
        '       ',
        '        ',
        '         '
    ];

    leftPad(str, len, ch) {
        // convert `str` to `string`
        str = str + '';
        // `len` is the `pad`'s length now
        len = len - str.length;
        // doesn't need to pad
        if (len <= 0) return str;
        // `ch` defaults to `' '`
        if (!ch && ch !== 0) ch = ' ';
        // convert `ch` to `string`
        ch = ch + '';
        // cache common use cases
        if (ch === ' ' && len < 10) return this.cache[len] + str;
        // `pad` starts with an empty string
        var pad = '';
        // loop
        while (true) {
            // add `ch` to `pad` if `len` is odd
            if (len & 1) pad += ch;
            // divide `len` by 2, ditch the remainder
            len >>= 1;
            // "double" the `ch` so this operation count grows logarithmically on `len`
            // each time `ch` is "doubled", the `len` would need to be "doubled" too
            // similar to finding a value in binary search tree, hence O(log(n))
            if (len) ch += ch;
            // `len` is 0, exit the loop
            else break;
        }
        // pad `str`!
        return pad + str;
    }

    get displayObject(): PIXI.DisplayObject {
        return this.scoreDisplay
    }
}