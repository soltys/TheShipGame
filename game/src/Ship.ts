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

interface PlayerActionResponse {
    [actionType: number]: (value: number) => void;
}

export default class Ship extends GameObject implements IGame.IGameDisplayObject, IGame.IShip {

    private shipSprite: PIXI.Sprite;
    private readonly normalShipTexture: PIXI.Texture;
    private readonly leftShipTexture: PIXI.Texture;
    private readonly rightShipTexture: PIXI.Texture;

    private coreShipHitBox: BoundingBox;
    private windsHitBox: BoundingBox;
    private fullShipBox: BoundingBox;

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

    private readonly maxSizeValue = 200;
    private readonly maxSize: Dimension = { width: this.maxSizeValue, height: this.maxSizeValue };

    private graphics: PIXI.Graphics;

    private playerResponse: PlayerActionResponse;
    constructor(texture: PIXI.Texture, textureToLeft: PIXI.Texture, textureToRight: PIXI.Texture) {
        super();
        this.shipSprite = new PIXI.Sprite(texture);
        this.shipSprite.height = 64;
        this.shipSprite.width = 64;
        this.normalShipTexture = texture;
        this.leftShipTexture = textureToLeft;
        this.rightShipTexture = textureToRight;

        const startPosition: Axis<number> = {
            x: 200, y: 150
        };

        const shipSize: Dimension = {
            width: 64,
            height: 64
        };

        this.shipSprite.position.set(startPosition.x, startPosition.y);
        this.fullShipBox = new BoundingBox(new PIXI.Rectangle(
            startPosition.x, startPosition.y, shipSize.width, shipSize.height
        ));

        this.coreShipHitBox = new BoundingBox(new PIXI.Rectangle(
            startPosition.x + 25, startPosition.y, 14, 60
        ));

        this.windsHitBox = new BoundingBox(new PIXI.Rectangle(
            startPosition.x, startPosition.y + 35, 64, 18
        ));
        this.fullShipBox.linkSprite(this.shipSprite);

    }

    get position() {
        return new PIXI.Point(this.shipSprite.position.x + this.shipSprite.width / 2, this.shipSprite.position.y + this.shipSprite.height / 2);
    }

    init(context: IGame.IGameContext): void {
        this.graphics = new PIXI.Graphics();
        context.objects.ship = this;

        context.timerService.add(Timer.create(100, () => {
            context.game.addObject(Bullet.create(this.fullShipBox.x + (this.fullShipBox.width / 2), this.fullShipBox.y));
        }));

        this.playerResponse = this.getResponsesForPlayerActions(context);
    }

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        const data = super.checkCollision(this.coreShipHitBox, boundingBox);
        const dataWings = super.checkCollision(this.windsHitBox, boundingBox);
        if (data.isColliding) {
            return {
                name: 'Ship',
                isColliding: data.isColliding,
                direction: data.direction,
                collisionBox: this.coreShipHitBox
            };
        } else {
            return {
                name: 'Ship',
                isColliding: dataWings.isColliding,
                direction: dataWings.direction,
                collisionBox: this.windsHitBox
            };
        }

    }

    update(timeDelta: number, context: IGame.IGameContext) {
        this.shipSprite.texture = this.normalShipTexture;
        const playerActions = PlayerActionManager.update(context);
        playerActions.forEach((playerAction) => {
            if (this.playerResponse[playerAction.action]) {
                this.playerResponse[playerAction.action](playerAction.value);
            }
        });

        this.velocity.x *= (1 - this.friction.x);
        this.velocity.y *= (1 - this.friction.y);

        let deltaX = this.velocity.x * timeDelta;
        let deltaY = this.velocity.y * timeDelta;

        const tempBoundingBox = this.fullShipBox.clone();
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
                    deltaY = -Math.abs(collisionData.collisionBox.y + collisionData.collisionBox.height - self.fullShipBox.y);
                }
                if (collisionData.direction === CollisionDirection.Down) {
                    deltaY = Math.abs((collisionData.collisionBox.y) - (self.fullShipBox.y + self.fullShipBox.height));
                }
                if (collisionData.direction === CollisionDirection.Left) {
                    deltaX = Math.abs((collisionData.collisionBox.x + collisionData.collisionBox.width) - self.fullShipBox.x) * -1;
                }
                if (collisionData.direction === CollisionDirection.Right) {
                    deltaX = Math.abs((collisionData.collisionBox.x) - (self.fullShipBox.x + self.fullShipBox.width));
                }
            }
        });

        this.coreShipHitBox.x += deltaX;
        this.coreShipHitBox.y += deltaY;
        this.windsHitBox.x += deltaX;
        this.windsHitBox.y += deltaY;
        this.fullShipBox.x += deltaX;
        this.fullShipBox.y += deltaY;

        const drawBoundingBox = (box: BoundingBox, color: number) => {
            this.graphics.beginFill(color);
            this.graphics.drawRect(box.x, box.y, box.width, box.height);
            this.graphics.endFill();
        };
        this.graphics.clear();

        drawBoundingBox(this.fullShipBox, 0x0000ff);
        drawBoundingBox(this.windsHitBox, 0xff0000);
        drawBoundingBox(this.coreShipHitBox, 0x00ff00);
    }

    private getResponsesForPlayerActions(context: IGame.IGameContext): PlayerActionResponse {
        const actionResponse: PlayerActionResponse = {};
        actionResponse[PlayerActionType.MoveLeft] = (value) => {
            this.velocity.x = Math.max(
                this.velocity.x - (this.acceleration.x * value),
                this.maxVelocity.x * -1
            );
            this.shipSprite.texture = this.leftShipTexture;
        };

        actionResponse[PlayerActionType.MoveRight] = (value) => {
            this.velocity.x = Math.min(
                this.velocity.x + (this.acceleration.x * value),
                this.maxVelocity.x
            );
            this.shipSprite.texture = this.rightShipTexture;
        };

        actionResponse[PlayerActionType.MoveUp] = (value) => {
            this.velocity.y = Math.max(
                this.velocity.y - (this.acceleration.y * value),
                this.maxVelocity.y * -1
            );
        };

        actionResponse[PlayerActionType.MoveDown] = (value) => {
            this.velocity.y = Math.min(
                this.velocity.y + (this.acceleration.y * value),
                this.maxVelocity.y
            );
        };

        const timeDelta = context.frameDeltaResolver();
        const scaleFunc = (scaleFactor: number, baseBox: BoundingBox, scaleValue: number): BoundingBox => {
            const ratioWidth = (baseBox.width < baseBox.height) ? baseBox.width / baseBox.height : 1;
            const ratioHeight = (baseBox.height < baseBox.width) ? baseBox.height / baseBox.width : 1;

            const newSize: Dimension = {
                width: baseBox.width + scaleFactor * timeDelta * scaleValue * ratioWidth,
                height: baseBox.height + scaleFactor * timeDelta * scaleValue * ratioHeight
            };

            const newPosition: Axis<number> = {
                x: Math.max(0, baseBox.x + (baseBox.width - newSize.width) / 2),
                y: Math.max(0, baseBox.y + (baseBox.height - newSize.height) / 1.28125)
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


        [PlayerActionType.ScaleUp, PlayerActionType.ScaleDown].forEach((actionType: ScaleAction) => {
            actionResponse[actionType] = (value) => {
                const scaleFactor = getScaleFactor(actionType);
                const newSize = scaleFunc(scaleFactor, this.fullShipBox, value);
                const isColliding = context.objects.borders
                    .map(border => border.collideWith(newSize))
                    .filter(cd => cd.isColliding)
                    .length > 0;
                if (!isColliding && checkSizeBounds(actionType, newSize)) {
                    [this.fullShipBox, this.coreShipHitBox, this.windsHitBox].forEach(box => {
                        box.update(scaleFunc(scaleFactor, box, value));
                    });
                }
            };
        });

        return actionResponse;
    }

    get displayObjects() {
        return [this.graphics, this.shipSprite];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Main;
    }
}
