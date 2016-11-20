import GameObject from './common/GameObject';
import { GetPlayerAction } from './PlayerAction';
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
    private accelerationX = 1;
    private frictionX = 0.1;
    private frictionY = 0.1;
    private velocityY = 0;
    private maximumVelocityY = 10;
    private accelerationY = 1;

    private scaleFactor = 2;

    private minWidth = 10;
    private minHeight = 10;

    private maxWidth = 75;
    private maxHeight = 75;

    private graphics: PIXI.Graphics;
    constructor(texture: PIXI.Texture) {
        super();
        this.shipSprite = new PIXI.Sprite(texture);
        this.shipSprite.position.set(200, 150);
        this.boundingBox = new BoundingBox(new PIXI.Rectangle(
            200, 150, 32, 32
        ))



    }

    init(state: IGame.IGameContext): void {

    }

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        var data = super.checkCollision(this.boundingBox, boundingBox);
        return {
            name: this.constructor.name,
            isColliding: data.isColliding,
            direction: data.direction,
            collisionBox: this.boundingBox
        }
    }

    update(timeDelta: number, state: IGame.IGameContext) {



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
            if (this === gameObject) {
                return;
            }

            //Future colision
            collisionData = gameObject.collideWith(tempBoundingBox);

            if (collisionData.isColliding && collisionData.name === "GameBorder") {

                if (collisionData.direction == IGame.CollisionDirection.Up) {
                    deltaY = Math.abs(collisionData.collisionBox.y + collisionData.collisionBox.height - this.boundingBox.y);
                }
                if (collisionData.direction == IGame.CollisionDirection.Down) {
                    deltaY = - Math.abs((collisionData.collisionBox.y - collisionData.collisionBox.height) - (this.boundingBox.y + this.boundingBox.height));
                }
                if (collisionData.direction == IGame.CollisionDirection.Left) {
                    deltaX = Math.abs((collisionData.collisionBox.x + collisionData.collisionBox.width) - this.boundingBox.x);
                }
                if (collisionData.direction == IGame.CollisionDirection.Right) {
                    deltaX = -Math.abs((collisionData.collisionBox.x - collisionData.collisionBox.width) - (this.boundingBox.x + this.boundingBox.width));
                }
            }


        });
        this.shipSprite.x += deltaX;
        this.shipSprite.y += deltaY;
        this.boundingBox.x += deltaX;
        this.boundingBox.y += deltaY;


    }

    private playerInput(playerActions: IGame.IPlayerActionData[], timeDelta: number) {
        let moveLeft: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', IGame.PlayerAction.MoveLeft))
        if (moveLeft) {
            this.velocityX = Math.max(
                (this.velocityX - this.accelerationX) * moveLeft.value,
                this.maximumVelocityX * -1
            );
        }

        if (_.find(playerActions, _.matchesProperty('action', IGame.PlayerAction.MoveRight))) {
            this.velocityX = Math.min(
                this.velocityX + this.accelerationX,
                this.maximumVelocityX
            );
        }
        const moveUp: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', IGame.PlayerAction.MoveUp))
        if (moveUp) {
            this.velocityY = Math.max(
                (this.velocityY - this.accelerationY) * moveUp.value,
                this.maximumVelocityY * -1
            );
        }
        const moveDown: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', IGame.PlayerAction.MoveDown))
        if (moveDown) {
            this.velocityY = Math.min(
                (this.velocityY + this.accelerationY) * moveDown.value,
                this.maximumVelocityY
            );
        }

        const scaleUp: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', IGame.PlayerAction.ScaleUp))
        if (scaleUp) {
            const newWidth = this.shipSprite.width + this.scaleFactor * timeDelta * scaleUp.value;
            const newHeight = this.shipSprite.height + this.scaleFactor * timeDelta * scaleUp.value;

            if (newHeight < this.maxHeight || newWidth < this.maxWidth) {
                this.shipSprite.width = newWidth
                this.shipSprite.height = newHeight;
                this.boundingBox.width = newWidth
                this.boundingBox.height = newHeight;
            }
        }
        const scaleDown: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', IGame.PlayerAction.ScaleDown))
        if (scaleDown) {
            const newWidth = this.shipSprite.width + -this.scaleFactor * timeDelta * scaleDown.value;
            const newHeight = this.shipSprite.height + -this.scaleFactor * timeDelta * scaleDown.value;

            if (newHeight > this.minHeight || newWidth > this.minWidth) {
                this.shipSprite.width = newWidth
                this.shipSprite.height = newHeight;
                this.boundingBox.width = newWidth
                this.boundingBox.height = newHeight;
            }
        }
    }

    get displayObject() {
        return this.shipSprite
    }

} 