import * as PIXI from 'pixi.js';
import GameObject from './common/GameObject';
import CollisionDirection from './common/CollisionDirection';
import { GetPlayerAction } from './PlayerAction';
import PlayerAction from './common/PlayerAction';
import BoundingBox from './common/BoundingBox';
import Bullet from './Bullet';
import Timer from './common/Timer';
import * as IGame from './common/IGame';
import * as _ from 'lodash';

export default class Ship extends GameObject implements IGame.IGameDisplayObject, IGame.IShip {

    private shipSprite: PIXI.Sprite;
    private normalShipTexture: PIXI.Texture;
    private leftShipTexture: PIXI.Texture;
    private rightShipTexture: PIXI.Texture;

    private boundingBox: BoundingBox;
    private boundingBoxWings: BoundingBox;
    private boundingBoxAll: BoundingBox;
    private velocityX = 0;
    private maximumVelocityX = 10;
    private accelerationX = 1;
    private frictionX = 0.1;
    private frictionY = 0.1;
    private velocityY = 0;
    private maximumVelocityY = 10;
    private accelerationY = 1;

    private scaleFactor = 2;

    private minWidth = 20;
    private minHeight = 20;

    private maxWidth = 150;
    private maxHeight = 150;

    private graphics: PIXI.Graphics;
    constructor(texture: PIXI.Texture, textureToLeft: PIXI.Texture, textureToRight: PIXI.Texture) {
        super();
        this.shipSprite = new PIXI.Sprite(texture);
        this.shipSprite.height = 64;
        this.shipSprite.width = 64;
        this.normalShipTexture = texture;
        this.leftShipTexture = textureToLeft;
        this.rightShipTexture = textureToRight;

        this.shipSprite.position.set(200, 150);
        this.boundingBoxAll = new BoundingBox(new PIXI.Rectangle(
            200, 150, 64, 64
        ));

        this.boundingBox = new BoundingBox(new PIXI.Rectangle(
            210, 150, 24, 64
        ));

        this.boundingBoxWings = new BoundingBox(new PIXI.Rectangle(
            200, 163, 64, 28
        ));



    }
    get position() {
        return new PIXI.Point(this.shipSprite.position.x + this.shipSprite.width / 2, this.shipSprite.position.y + this.shipSprite.height / 2);
    }
    init(state: IGame.IGameContext): void {
        this.graphics = new PIXI.Graphics();
        state.objects.ship = this;

        state.timerService.add(Timer.create(100, () => {
            state.game.addObject(Bullet.create(this.boundingBoxAll.x + (this.boundingBoxAll.width / 2), this.boundingBoxAll.y));
        }));

    }

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        const data = super.checkCollision(this.boundingBox, boundingBox);
        const dataWings = super.checkCollision(this.boundingBoxWings, boundingBox);
        if (data.isColliding) {
            return {
                name: "Ship",
                isColliding: data.isColliding,
                direction: data.direction,
                collisionBox: this.boundingBox
            };
        } else {
            return {
                name: "Ship",
                isColliding: dataWings.isColliding,
                direction: dataWings.direction,
                collisionBox: this.boundingBoxWings
            };
        }

    }

    update(timeDelta: number, context: IGame.IGameContext) {
        const playerActions = GetPlayerAction(context);
        this.playerInput(playerActions, timeDelta);

        this.velocityX *= (1 - this.frictionX);
        this.velocityY *= (1 - this.frictionY);

        let deltaX = this.velocityX * timeDelta;
        let deltaY = this.velocityY * timeDelta;

        let tempBoundingBox = this.boundingBoxAll.clone();
        tempBoundingBox.x += deltaX;
        tempBoundingBox.y += deltaY;


        context.objects.all.forEach(gameObject => {
            if (this === gameObject) {
                return;
            }

            //Future colision
            const collisionData = gameObject.collideWith(tempBoundingBox);

            if (collisionData.isColliding && collisionData.name === "GameBorder") {

                if (collisionData.direction === CollisionDirection.Up) {
                    deltaY = -Math.abs(collisionData.collisionBox.y + collisionData.collisionBox.height - this.boundingBoxAll.y);
                }
                if (collisionData.direction === CollisionDirection.Down) {
                    deltaY = Math.abs((collisionData.collisionBox.y) - (this.boundingBoxAll.y + this.boundingBoxAll.height));
                }
                if (collisionData.direction === CollisionDirection.Left) {
                    deltaX = Math.abs((collisionData.collisionBox.x + collisionData.collisionBox.width) - this.boundingBoxAll.x) * -1;
                }
                if (collisionData.direction === CollisionDirection.Right) {
                    deltaX = Math.abs((collisionData.collisionBox.x) - (this.boundingBoxAll.x + this.boundingBoxAll.width));
                }
            }
        });

        this.shipSprite.x += deltaX;
        this.shipSprite.y += deltaY;
        this.boundingBox.x += deltaX;
        this.boundingBox.y += deltaY;
        this.boundingBoxWings.x += deltaX;
        this.boundingBoxWings.y += deltaY;
        this.boundingBoxAll.x += deltaX;
        this.boundingBoxAll.y += deltaY;

        // const drawBoundingBox = (box) => {
        //     this.graphics.drawRect(box.x, box.y, box.width, box.height);
        // };
        // this.graphics.clear();
        // this.graphics.beginFill(0xff0000);
        // drawBoundingBox(this.boundingBoxWings);
        // this.graphics.endFill();

    }

    private playerInput(playerActions: IGame.IPlayerActionData[], timeDelta: number) {
        this.shipSprite.texture = this.normalShipTexture;
        const moveLeft: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerAction.MoveLeft));
        if (moveLeft) {
            this.velocityX = Math.max(
                this.velocityX - (this.accelerationX * moveLeft.value),
                this.maximumVelocityX * -1
            );
            this.shipSprite.texture = this.leftShipTexture;
        }

        const moveRight: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerAction.MoveRight));
        if (moveRight) {
            this.velocityX = Math.min(
                this.velocityX + (this.accelerationX * moveRight.value),
                this.maximumVelocityX
            );
            this.shipSprite.texture = this.rightShipTexture;
        }
        const moveUp: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerAction.MoveUp));
        if (moveUp) {
            this.velocityY = Math.max(
                this.velocityY - (this.accelerationY * moveUp.value),
                this.maximumVelocityY * -1
            );
        }
        const moveDown: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerAction.MoveDown));
        if (moveDown) {
            this.velocityY = Math.min(
                this.velocityY + (this.accelerationY * moveDown.value),
                this.maximumVelocityY
            );
        }

        const scaleUp: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerAction.ScaleUp));
        if (scaleUp) {
            const scaleUpFunc = (baseWidth, baseHeight, updateThis: any[]) => {
                const newWidth = baseWidth + this.scaleFactor * timeDelta * scaleUp.value;
                const newHeight = baseHeight + this.scaleFactor * timeDelta * scaleUp.value;
                for (const update of updateThis) {
                    update.width = newWidth;
                    update.height = newHeight;
                }
            };
            const newWidth = this.shipSprite.width + this.scaleFactor * timeDelta * scaleUp.value;
            const newHeight = this.shipSprite.height + this.scaleFactor * timeDelta * scaleUp.value;

            if (newHeight < this.maxHeight || newWidth < this.maxWidth) {
                scaleUpFunc(this.boundingBox.width, this.boundingBox.height, [this.boundingBox]);
                scaleUpFunc(this.boundingBoxWings.width, this.boundingBoxWings.height, [this.boundingBoxWings]);
                scaleUpFunc(this.shipSprite.width, this.shipSprite.height, [this.shipSprite, this.boundingBoxAll]);
                //scaleUpFunc(this.boundingBox.width, this.boundingBox.height, [this.boundingBox]);



            }
        }
        const scaleDown: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerAction.ScaleDown));
        if (scaleDown) {

            const scaleDownFunc = (baseWidth, baseHeight, updateThis: any[]) => {
                const newWidth = baseWidth + -this.scaleFactor * timeDelta * scaleDown.value;
                const newHeight = baseHeight + -this.scaleFactor * timeDelta * scaleDown.value;
                for (const update of updateThis) {
                    update.width = newWidth;
                    update.height = newHeight;
                }
            };
            const newWidth = this.shipSprite.width + -this.scaleFactor * timeDelta * scaleDown.value;
            const newHeight = this.shipSprite.height + -this.scaleFactor * timeDelta * scaleDown.value;

            if (newHeight > this.minHeight || newWidth > this.minWidth) {
                scaleDownFunc(this.shipSprite.width, this.shipSprite.height, [this.shipSprite, this.boundingBoxAll]);
                scaleDownFunc(this.boundingBox.width, this.boundingBox.height, [this.boundingBox]);
                scaleDownFunc(this.boundingBoxWings.width, this.boundingBoxWings.height, [this.boundingBoxWings]);

            }
        }
    }

    get displayObjects() {
        return [this.shipSprite];
    }

} 
