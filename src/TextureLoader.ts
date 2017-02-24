import * as PIXI from 'pixi.js';
import Dictionary from './common/Dictionary';
class TextureLoader {
    private textureDictionry: Dictionary;


    constructor() {
        this.textureDictionry = new Dictionary();

    }

    /**
     * File path to texture located in assets folder
     * 
     * @param {string} name
     * @returns
     * 
     * @memberOf TextureLoader
     */
    public addOrGet(name: string) {
        if (this.textureDictionry.containsKey(name)) {
            return this.textureDictionry["name"];
        }
        else {
            const texture = PIXI.Texture.fromImage(`assets/${name}`, undefined, PIXI.SCALE_MODES.NEAREST);
            this.textureDictionry.add(name, texture);
            return texture;
        }
    }
}

export default TextureLoader;