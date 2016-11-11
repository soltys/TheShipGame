
import CharacterType from './common/CharacterType';
import Keys from './common/Keys';
export default class RotatingBunny implements ThisGame.IGameDisplayObject {
    private sprite: PIXI.Sprite;
    private position: PIXI.Point;
    private anchor: PIXI.ObservablePoint;
    private who: CharacterType;


    private velocityX = 0;
    private maximumVelocityX = 10;
    private accelerationX = 2;
    private frictionX = 0.1;
    private frictionY = 0.1;
    private velocityY = 0;
    private maximumVelocityY = 10;
    private accelerationY = 2;

    constructor(texture: PIXI.Texture, who: CharacterType) {
        this.sprite = new PIXI.Sprite(texture);

        this.who = who;
        if (who == CharacterType.Player) {
            this.sprite.position.set(200, 150);
        }
        else {
            this.sprite.position.set(300, 150);
            this.sprite.anchor.set(0.5, 0.5)
        }
    }

    update(delta: number, state: ThisGame.IGameState) {
        if (this.who == CharacterType.NPC) {
            this.sprite.rotation += 0.1 * delta;
            return;
        }

        if (state.keys[Keys.LEFT_ARROW]) {
            this.velocityX = Math.max(
                this.velocityX - this.accelerationX,
                this.maximumVelocityX * -1
            );
        }

        if (state.keys[Keys.RIGHT_ARROW]) {
            this.velocityX = Math.min(
                this.velocityX + this.accelerationX,
                this.maximumVelocityX
            );
        }

        if (state.keys[Keys.UP_ARROW]) {
            this.velocityY = Math.max(
                this.velocityY - this.accelerationY,
                this.maximumVelocityY * -1
            );
        }

        if (state.keys[Keys.DOWN_ARROW]) {
            this.velocityY = Math.min(
                this.velocityY + this.accelerationY,
                this.maximumVelocityY
            );
        }
        this.velocityX *= (1 - this.frictionX);
        this.velocityY *= (1 - this.frictionY);

        this.sprite.x += this.velocityX * delta;
        this.sprite.y += this.velocityY * delta;
    }

    get displayObject() {
        return this.sprite
    }

} 