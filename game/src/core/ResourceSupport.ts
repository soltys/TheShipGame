import * as PIXI from 'pixi.js';

export type TextureResource =
    'ship' |
    'ship_to_left' |
    'ship_to_right' |
    'border_left' |
    'border_right' |
    'border_top' |
    'border_bottom'
    ;


type AnimationResource =
    'bullet_animation' |
    'coin_animation'
    ;


type Resource =
    TextureResource |
    AnimationResource
    ;


export const Resources: { [key in Resource]: string } = {
    //Textures
    ship: 'assets/ship2.png',
    ship_to_left: 'assets/ship2_to_left.png',
    ship_to_right: 'assets/ship2_to_right.png',
    border_left: 'assets/borders/left.png',
    border_right: 'assets/borders/right.png',
    border_top: 'assets/borders/top.png',
    border_bottom: 'assets/borders/bottom.png',

    //Animations
    bullet_animation: 'assets/animation/bullet.json',
    coin_animation: 'assets/animation/coin.json'
};
export function ResourcesForLoader(): string[] {
    return Object.keys(Resources).map((x: Resource) => Resources[x]);
}

export function createAnimation(name: AnimationResource, frameNumber: number): PIXI.extras.AnimatedSprite {
    const frames = [];

    for (let i = 0; i < frameNumber; i += 1) {
        const val = i.toString();
        const tex = PIXI.Texture.fromFrame(`${name}_${val}.png`);
        tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        frames.push(tex);
    }
    return new PIXI.extras.AnimatedSprite(frames);
}

type Sides = 'left' | 'right';
type TopOrBottom = 'top' | 'bottom';
export function getTexture(res: Resource): PIXI.Texture {
    const tex =  PIXI.Texture.fromImage(Resources[res], false, PIXI.SCALE_MODES.LINEAR);
    tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    return tex;
}

export function getCornerTexture(leftOrRight: Sides, topOrBottom: TopOrBottom): PIXI.Texture {
    return PIXI.Texture.fromImage(`assets/borders/corner_${leftOrRight}_${topOrBottom}.png`, undefined, PIXI.SCALE_MODES.NEAREST);
}
