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

type ScaleAction = PlayerActionType.ScaleUp | PlayerActionType.ScaleDown;

type Axis<TValue> = { x: TValue, y: TValue };
type Dimension = { width: number, height: number };
export default class Ship extends GameObject implements IGame.IGameDisplayObject, IGame.IShip {

    private shipSprite: PIXI.Sprite;
    private normalShipTexture: PIXI.Texture;
    private leftShipTexture: PIXI.Texture;
    private rightShipTexture: PIXI.Texture;

    private boundingBox: BoundingBox;
    private boundingBoxWings: BoundingBox;
    private boundingBoxAll: BoundingBox;

    private scaleFactor = 2;

    private readonly initialVelocity = 0;
    private velocity: Axis<number> = { x: this.initialVelocity, y: this.initialVelocity };

    private readonly initialAcceleration = 1;
    private acceleration: Axis<number> = { x: this.initialAcceleration, y: this.initialAcceleration };

    private readonly frictionValue = 0.1;
    private readonly friction: Axis<number> = { x: this.frictionValue, y: this.frictionValue };

    private readonly maxVelocityValue = 10;
    private readonly maxVelocity: Axis<number> = { x: this.maxVelocityValue, y: this.maxVelocityValue };

    private readonly minSizeValue = 20;
    private readonly minSize: Dimension = { width: this.minSizeValue, height: this.minSizeValue };

    private readonly maxSizeValue = 100;
    private readonly maxSize: Dimension = { width: this.maxSizeValue, height: this.maxSizeValue };

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
        this.calculateShipVelocity(playerActions);
        this.scaleAction(playerActions, timeDelta, context);

        this.velocity.x *= (1 - this.friction.x);
        this.velocity.y *= (1 - this.friction.y);

        let deltaX = this.velocity.x * timeDelta;
        let deltaY = this.velocity.y * timeDelta;

        const tempBoundingBox = this.boundingBoxAll.clone();
        tempBoundingBox.x += deltaX;
        tempBoundingBox.y += deltaY;

        const self = this;
        context.objects.borders.forEach(gameObject => {
            if (self === gameObject) {
                return;
            }

            //Future collision
            const collisionData = gameObject.collideWith(tempBoundingBox);

            if (collisionData.isColliding && collisionData.name === 'GameBorder') {

                if (collisionData.direction === CollisionDirection.Up) {
                    deltaY = -Math.abs(collisionData.collisionBox.y + collisionData.collisionBox.height - self.boundingBoxAll.y);
                }
                if (collisionData.direction === CollisionDirection.Down) {
                    deltaY = Math.abs((collisionData.collisionBox.y) - (self.boundingBoxAll.y + self.boundingBoxAll.height));
                }
                if (collisionData.direction === CollisionDirection.Left) {
                    deltaX = Math.abs((collisionData.collisionBox.x + collisionData.collisionBox.width) - self.boundingBoxAll.x) * -1;
                    console.log('cd left');
                }
                if (collisionData.direction === CollisionDirection.Right) {
                    deltaX = Math.abs((collisionData.collisionBox.x) - (self.boundingBoxAll.x + self.boundingBoxAll.width));
                    console.log('cd right');
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

    private calculateShipVelocity(playerActions: IGame.IPlayerActionData[]) {
        this.shipSprite.texture = this.normalShipTexture;
        const moveLeft: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveLeft));
        if (moveLeft) {
            this.velocity.x = Math.max(
                this.velocity.x - (this.acceleration.x * moveLeft.value),
                this.maxVelocity.x * -1
            );
            this.shipSprite.texture = this.leftShipTexture;
        }

        const moveRight: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveRight));
        if (moveRight) {
            this.velocity.x = Math.min(
                this.velocity.x + (this.acceleration.x * moveRight.value),
                this.maxVelocity.x
            );
            this.shipSprite.texture = this.rightShipTexture;
        }
        const moveUp: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveUp));
        if (moveUp) {
            this.velocity.y = Math.max(
                this.velocity.y - (this.acceleration.y * moveUp.value),
                this.maxVelocity.y * -1
            );
        }
        const moveDown: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', PlayerActionType.MoveDown));
        if (moveDown) {
            this.velocity.y = Math.min(
                this.velocity.y + (this.acceleration.y * moveDown.value),
                this.maxVelocity.y
            );
        }
    }
    private scaleAction(playerActions: IGame.IPlayerActionData[], timeDelta: number, context: IGame.IGameContext) {

        const scaleFunc = (scaleFactor: number, baseBox: BoundingBox, scaleValue: number): BoundingBox => {
            const ratioWidth = (baseBox.width < baseBox.height) ? baseBox.width / baseBox.height : 1;
            const ratioHeight = (baseBox.height < baseBox.width) ? baseBox.height / baseBox.width : 1;

            const newSize: Dimension = {
                width: baseBox.width + scaleFactor * timeDelta * scaleValue * ratioWidth,
                height: baseBox.height + scaleFactor * timeDelta * scaleValue * ratioHeight
            };

            const newPosition: Axis<number> = {
                x: Math.max(0, baseBox.x + (baseBox.width - newSize.width) / 2),
                y:Math.max(0, baseBox.y + (baseBox.height - newSize.height) / 1.28125)
            };

            return new BoundingBox(new PIXI.Rectangle(newPosition.x, newPosition.y, newSize.width, newSize.height));
        };

        const getScaleFactor = (actionType: ScaleAction): number => {
            if (actionType === PlayerActionType.ScaleUp) {
                return this.scaleFactor;
            }
            return -this.scaleFactor;
        };

        const checkSizeBounds = (actionType: ScaleAction, newSize: BoundingBox): boolean => {
            if (actionType === PlayerActionType.ScaleUp) {
                return (newSize.height < this.maxSize.height || newSize.width < this.maxSize.width);
            }
            return (newSize.height > this.minSize.height || newSize.width > this.minSize.width);
        };
        const self = this;
        [PlayerActionType.ScaleUp, PlayerActionType.ScaleDown].forEach((actionType: ScaleAction) => {
            const scale: IGame.IPlayerActionData = _.find(playerActions, _.matchesProperty('action', actionType));
            if (scale) {
                const scaleFactor = getScaleFactor(actionType);
                const newSize = scaleFunc(scaleFactor, this.boundingBoxAll, scale.value);
                const isColliding = context.objects.borders
                    .map(border => border.collideWith(newSize))
                    .filter(cd => cd.isColliding)
                    .length > 0;
                if (!isColliding && checkSizeBounds(actionType, newSize)) {
                    [this.boundingBoxAll, this.boundingBox, this.boundingBoxWings].forEach(box => {
                        box.update(scaleFunc(scaleFactor, box, scale.value));
                    });
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
