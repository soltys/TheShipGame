import GameObject from './common/GameObject';
import CharacterType from './common/CharacterType';
import { PlayerAction, GetPlayerAction } from './PlayerAction';
import BoundingBox from './common/BoundingBox';
import * as _ from 'lodash';

export default class Ship extends GameObject implements IGameDisplayObject {

    private shipSprite: PIXI.Sprite;
    private position: PIXI.Point;
    private anchor: PIXI.ObservablePoint;
    private boundingBox: BoundingBox;


    private velocityX = 0;
    private maximumVelocityX = 10;
    private accelerationX = 2;
    private frictionX = 0.1;
    private frictionY = 0.1;
    private velocityY = 0;
    private maximumVelocityY = 10;
    private accelerationY = 2;

    constructor(texture: PIXI.Texture) {
        super();
        this.shipSprite = new PIXI.Sprite(texture);
        this.shipSprite.position.set(200, 150);
        this.boundingBox = new BoundingBox(new PIXI.Rectangle(
            200, 150, 32, 32
        ))
    }

    update(delta: number, state: IGameState) {
        const playerActions = GetPlayerAction(state);
        this.playerInput(playerActions, delta);

        this.velocityX *= (1 - this.frictionX);
        this.velocityY *= (1 - this.frictionY);

        const deltaX = this.velocityX * delta;
        const deltaY = this.velocityY * delta;

        let tempBoundingBox = this.boundingBox.clone();
        tempBoundingBox.x += deltaX;
        tempBoundingBox.y += deltaY;
        let isColliding = false;
        state.objects.forEach(gameObject => {
            if (gameObject.constructor.name === "GameBorder") {
                if (gameObject.collideWith(tempBoundingBox)) {
                    isColliding = true;
                }
            }
        });

        if (!isColliding) {
            this.shipSprite.x += deltaX;
            this.shipSprite.y += deltaY;
            this.boundingBox.x += deltaX;
            this.boundingBox.y += deltaY;
        }

    }

    private playerInput(playerActions: PlayerAction[], delta: number) {

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
            this.shipSprite.width += 2 * delta;
            this.shipSprite.height += 2 * delta;
        }

        if (_.includes(playerActions, PlayerAction.ScaleDown)) {
            this.shipSprite.width += -2 * delta;
            this.shipSprite.height += -2 * delta;
        }
    }

    get displayObject() {
        return this.shipSprite
    }

} 