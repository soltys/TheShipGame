/// <reference path="../../typings/index.d.ts" />

import '../scss/main.scss';
import 'pixi.js';

import Ship from './Ship';
import Coin from './Coin';
import Bullet from './Bullet';
import GameBorder from './GameBorder';
import FPSCounter from './FPSCounter';
import Score from './Score';
import TextureLoader from './TextureLoader';

import Game from './Game';



const gameWidth = 300;
const gameHeight = 350;
const game = new Game(gameWidth, gameHeight);



PIXI.loader
    .add('assets/animation/coin.json')
    .add('assets/animation/bullet.json')
    .add('assets/ship_to_left.png')
    .add('assets/ship_to_right.png')
    .add('assets/ship.png')
    .load(onAssetsLoaded);


function onAssetsLoaded(load, res) {
    console.log(load);
    console.log(res);

    const coinAnimationFrames = createAnimation("coin", 7);
    const bulletAnimationFrames = createAnimation("bullet", 2);

    game.addObject(new FPSCounter());
    for (let border of getGameBorders()) {
        game.addObject(border);
    }

    game.addObject(new Ship(createTexture('ship.png'), createTexture('ship_to_left.png'), createTexture('ship_to_right.png')));
    game.addObject(new Score(gameWidth));

    setInterval(function () {
        game.addObject(new Coin(new PIXI.extras.MovieClip(coinAnimationFrames), getRandomInt(20, gameWidth - 20), getRandomInt(20, gameHeight - 20)));
    }, 1000);
    //game.addObject(new Bullet(bulletAnimation, 200, 100));
    game.addRendererToElement(document.getElementById("gameHost"));
    game.addEventListenerToElement(document.body);
    game.animate();
}


function createTexture(name: string) {
    const texture = PIXI.Texture.fromImage(`assets/${name}`, undefined, PIXI.SCALE_MODES.NEAREST);
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    return texture;
}


function createAnimation(name: string, frameNumber: number): any[] {
    const frames = [];

    for (var i = 0; i < frameNumber; i++) {
        var val = i.toString();

        // magically works since the spritesheet was loaded with the pixi loader
        const tex = PIXI.Texture.fromFrame(`${name}_animation_${val}.png`);
        tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        frames.push(tex);
    }
    return frames;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getGameBorders(): GameBorder[] {
    const borderSize = 5
    const gameBorders: GameBorder[] = [];
    //up
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(0, 0, gameWidth, borderSize)
    ));
    //down
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(0, gameHeight - borderSize, gameWidth, borderSize)
    ));
    //left
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(0, 0, borderSize, gameHeight)
    ));
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(gameWidth - borderSize, 0, borderSize, gameHeight)
    ));

    return gameBorders;
}