
import CharacterType from './common/CharacterType';
import { PlayerAction, GetPlayerAction } from './PlayerAction';
import * as _ from 'lodash';

export default class RotatingBunny implements IGameDisplayObject {
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

    update(delta: number, state: IGameState) {
        if (this.who == CharacterType.NPC) {
            this.sprite.rotation += 0.1 * delta;
            return;
        }
        var playerActions = GetPlayerAction(state);

        if (_.includes(playerActions, PlayerAction.MoveLeft)) {
            this.velocityX = Math.max(
                this.velocityX - this.accelerationX,
                this.maximumVelocityX * -1
            );
        }

        if (_.includes(playerActions, PlayerAction.MoveRight)) {
            this.velocityX = Math.min(
                this.velocityX + this.accelerationX,
                this.maximumVelocityX
            );
        }

        if (_.includes(playerActions, PlayerAction.MoveUp)) {
            this.velocityY = Math.max(
                this.velocityY - this.accelerationY,
                this.maximumVelocityY * -1
            );
        }

        if (_.includes(playerActions, PlayerAction.MoveDown)) {
            this.velocityY = Math.min(
                this.velocityY + this.accelerationY,
                this.maximumVelocityY
            );
        }

        if (_.includes(playerActions, PlayerAction.ScaleUp)) {
            this.sprite.width += 2 * delta;
            this.sprite.height += 2 * delta;
        }

        if (_.includes(playerActions, PlayerAction.ScaleDown)) {
            this.sprite.width += -2 * delta;
            this.sprite.height += -2 * delta;
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