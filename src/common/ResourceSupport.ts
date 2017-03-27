import * as PIXI from 'pixi.js';
export function createTexture(name: string) {
    const t = PIXI.loader.resources[`assets/${name}`].texture;
    t.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    return t;
}


export function createAnimation(name: string, frameNumber: number): any[] {
    const frames = [];

    for (let i = 0; i < frameNumber; i += 1) {
        const val = i.toString();

        // magically works since the spritesheet was loaded with the pixi loader
        const tex = PIXI.Texture.fromFrame(`${name}_animation_${val}.png`);
        tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        frames.push(tex);
    }
    return frames;
}
