import '../scss/main.scss';
import 'pixi.js';
import * as Matter from 'matter-js';
import Ship from './Ship';
import Coin from './Coin';
import Bullet from './Bullet';
import GameBorder from './GameBorder';
import FPSCounter from './FPSCounter';
import TextureLoader from './TextureLoader';

import Game from './Game';

(<any>window).Matter = Matter;
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../local.d.ts" />
const gameWidth = 250;
const gameHeight = 350;
const game = new Game(gameWidth, gameHeight);


const texLoader = new TextureLoader();
const bunnyTexture = texLoader.addOrGet('ship.png');
PIXI.loader
    .add('assets/animation/coin.json')
    .add('assets/animation/bullet.json')
    .load(onAssetsLoaded);
function onAssetsLoaded() {
    const coinAnimation = createAnimation("coin", 7);
    const bulletAnimation = createAnimation("bullet", 2);
    game.addObject(new FPSCounter());
    game.addObject(new GameBorder(gameWidth, gameHeight));
    game.addObject(new Ship(bunnyTexture));
    game.addObject(new Coin(coinAnimation, 100, 100));
    game.addObject(new Bullet(bulletAnimation, 200, 100));
    game.addMatterRendererToElement(document.getElementById("physicsHost"))
    game.addRendererToElement(document.getElementById("gameHost"));
    game.addEventListenerToElement(document.body);
    game.animate();
}

function createAnimation(name: string, frameNumber: number): PIXI.extras.MovieClip {
    const frames = [];

    for (var i = 0; i < frameNumber; i++) {
        var val = i.toString();

        // magically works since the spritesheet was loaded with the pixi loader
        const tex = PIXI.Texture.fromFrame(`${name}_animation_${val}.png`);
        tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        frames.push(tex);
    }
    return new PIXI.extras.MovieClip(frames);
}