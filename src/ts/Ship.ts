import GameObject from './common/GameObject';
import CharacterType from './common/CharacterType';
import { PlayerAction, GetPlayerAction } from './PlayerAction';
import BoundingBox from './common/BoundingBox';
import * as IGame from './common/IGame';
import * as _ from 'lodash';

export default class Ship extends GameObject implements IGame.IGameDisplayObject {

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

    update(timeDelta: number, state: IGame.IGameState) {
        const playerActions = GetPlayerAction(state);
        this.playerInput(playerActions, timeDelta);

        this.velocityX *= (1 - this.frictionX);
        this.velocityY *= (1 - this.frictionY);

        let deltaX = this.velocityX * timeDelta;
        let deltaY = this.velocityY * timeDelta;

        let tempBoundingBox = this.boundingBox.clone();
        tempBoundingBox.x += deltaX;
        tempBoundingBox.y += deltaY;
        let collisionData: IGame.ICollisionData = super.collideWith(this.boundingBox);
        state.objects.forEach(gameObject => {
            if (gameObject.constructor.name === "GameBorder") {
                collisionData = gameObject.collideWith(tempBoundingBox);
                if (collisionData.direction == IGame.CollisionDirection.Up || collisionData.direction == IGame.CollisionDirection.Down) {
                    deltaY = 0
                }
                if (collisionData.direction == IGame.CollisionDirection.Left || collisionData.direction == IGame.CollisionDirection.Right) {
                    deltaX = 0
                }

            }
        });

        this.shipSprite.x += deltaX;
        this.shipSprite.y += deltaY;
        this.boundingBox.x += deltaX;
        this.boundingBox.y += deltaY;
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