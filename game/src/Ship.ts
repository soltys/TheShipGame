import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import Bullet from './Bullet';
import BoundingBox from './BoundingBox';
import { CollisionDirection } from '@core/CollisionDirection';
import { DisplayLayer } from '@core/DisplayLayer';
import GameObject from '@core/GameObject';
import * as IGame from '@IGame';
import { PlayerActionType } from '@base/PlayerActionType';
import Timer from './Timer';
import { PlayerActionManager } from './PlayerActionManager';

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

    private maxWidth = 100;
    private maxHeight = 100;

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
            225, 150, 14, 60
        ));

        this.boundingBoxWings = new BoundingBox(new PIXI.Rectangle(
            200, 185, 64, 18
        ));
        this.boundingBoxAll.linkSprite(this.shipSprite);

    }
    get position() {
        return new PIXI.Point(this.shipSprite.position.x + this.shipSprite.width / 2, this.shipSprite.position.y + this.shipSprite.height / 2);
    }
    init(context: IGame.IGameContext): void {
        this.graphics = new PIXI.Graphics();
        context.objects.ship = this;

        context.timerService.add(Timer.create(100, () => {
            context.game.addObject(Bullet.create(this.boundingBoxAll.x + (this.boundingBoxAll.width / 2), this.boundingBoxAll.y));
        }));

    }

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        const data = super.checkCollision(this.boundingBox, boundingBox);
        const dataWings = super.checkCollision(this.boundingBoxWings, boundingBox);
        if (data.isColliding) {
            return {
                name: 'Ship',
                isColliding: data.isColliding,
                direction: data.direction,
                collisionBox: this.boundingBox
            };
        } else {
            return {
                name: 'Ship',
                isColliding: dataWings.isColliding,
                direction: dataWings.direction,
                collisionBox: this.boundingBoxWings
            };
        }

    }

    update(timeDelta: number, context: IGame.IGameContext) {
        const playerActions = PlayerActionManager.update(context);
        this.playerInput(playerActions, timeDelta, context);

        this.velocityX *= (1 - this.frictionX);
        this.velocityY *= (1 - this.frictionY);

        let deltaX = this.velocityX * timeDelta;
        let deltaY = this.velocityY * timeDelta;

        const tempBoundingBox = this.boundingBoxAll.clone();
        tempBoundingBox.x += deltaX;
        tempBoundingBox.y += deltaY;


        context.objects.borders.forEach(gameObject => {
            if (this === gameObject) {
                return;
            }

            //Future colision
            const collisionData = gameObject.collideWith(tempBoundingBox);

            if (collisionData.isColliding && collisionData.name === 'GameBorder') {

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

        this.boundingBox.x += deltaX;
        this.boundingBox.y += deltaY;
        this.boundingBoxWings.x += deltaX;
        this.boundingBoxWings.y += deltaY;
        this.boundingBoxAll.x += deltaX;
        this.boundingBoxAll.y += deltaY;

        const drawBoundingBox = (box: BoundingBox, color: number) => {
            this.graphics.beginFill(color);
            this.graphics.drawRect(box.x, box.y, box.width, box.height);
            this.graphics.endFill();
        };
        this.graphics.clear();

        drawBoundingBox(this.boundingBoxAll, 0x0000ff);
        drawBoundingBox(this.boundingBoxWings, 0xff0000);
        drawBoundingBox(this.boundingBox, 0x00ff00);
    }

    private playerInput(playerActions: IGame.IPlayerActionData[], timeDelta: number, context: IGame.IGameContext) {
        this.shipSprite.texture = this.normalShipTexture;
        const moveLeft: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveLeft));
        if (moveLeft) {
            this.velocityX = Math.max(
                this.velocityX - (this.accelerationX * moveLeft.value),
                this.maximumVelocityX * -1
            );
            this.shipSprite.texture = this.leftShipTexture;
        }

        const moveRight: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveRight));
        if (moveRight) {
            this.velocityX = Math.min(
                this.velocityX + (this.accelerationX * moveRight.value),
                this.maximumVelocityX
            );
            this.shipSprite.texture = this.rightShipTexture;
        }
        const moveUp: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveUp));
        if (moveUp) {
            this.velocityY = Math.max(
                this.velocityY - (this.accelerationY * moveUp.value),
                this.maximumVelocityY * -1
            );
        }
        const moveDown: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveDown));
        if (moveDown) {
            this.velocityY = Math.min(
                this.velocityY + (this.accelerationY * moveDown.value),
                this.maximumVelocityY
            );
        }

        const scaleFunc = (scaleFactor: number, baseBox: BoundingBox, scaleValue: number, updateThis: BoundingBox): BoundingBox => {
            const ratioWidth = (baseBox.width < baseBox.height) ? baseBox.width / baseBox.height : 1;
            const ratioHeight = (baseBox.height < baseBox.width) ? baseBox.height / baseBox.width : 1;

            const newWidth = baseBox.width + scaleFactor * timeDelta * scaleValue * ratioWidth;
            const newHeight = baseBox.height + scaleFactor * timeDelta * scaleValue * ratioHeight;

            let newX = baseBox.x;
            let newY = baseBox.y;
            if (updateThis) {
                newX = updateThis.x + (baseBox.width - newWidth) / 2;
                newY = updateThis.y + (baseBox.height - newHeight) / 1.28125;
                updateThis.x = newX;
                updateThis.y = newY;
                updateThis.width = newWidth;
                updateThis.height = newHeight;
            }
            return new BoundingBox(new PIXI.Rectangle(newX, newY, newWidth, newHeight));
        };

        const getScaleFactor = (actionType: PlayerActionType.ScaleUp | PlayerActionType.ScaleDown): number => {
            if (actionType === PlayerActionType.ScaleUp) {
                return this.scaleFactor;
            }
            return -this.scaleFactor;
        };

        const checkBounds = (actionType: PlayerActionType.ScaleUp | PlayerActionType.ScaleDown, newSize: BoundingBox): boolean => {
            if (actionType === PlayerActionType.ScaleUp) {
                return (newSize.height < this.maxHeight || newSize.width < this.maxWidth);
            }
            return (newSize.height > this.minHeight || newSize.width > this.minWidth);
        };

        [PlayerActionType.ScaleUp, PlayerActionType.ScaleDown].forEach((actionType: PlayerActionType.ScaleUp | PlayerActionType.ScaleDown) => {
            const scale: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', actionType));
            if (scale) {
                const scaleFactor = getScaleFactor(actionType);
                const newSize = scaleFunc(scaleFactor, this.boundingBoxAll, scale.value, undefined);
                const isColliding = context.objects.borders
                    .map(border => border.collideWith(newSize))
                    .filter(cd => cd.isColliding)
                    .length > 0;
                if (!isColliding && checkBounds(actionType, newSize)) {
                    scaleFunc(scaleFactor, this.boundingBoxAll, scale.value, this.boundingBoxAll);
                    scaleFunc(scaleFactor, this.boundingBox, scale.value, this.boundingBox);
                    scaleFunc(scaleFactor, this.boundingBoxWings, scale.value, this.boundingBoxWings);
                }
            }
        });
    }

    get displayObjects() {
        return [this.graphics, this.shipSprite];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Main;
    }
}
