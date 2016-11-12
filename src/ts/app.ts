import '../scss/main.scss';
import 'pixi.js';
import Ship from './Ship';
import Coin from './Coin';
import GameBorder from './GameBorder';
import FPSCounter from './FPSCounter';
import TextureLoader from './TextureLoader';

import Game from './Game';
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../local.d.ts" />
const gameWidth=250;
const gameHeight=350;
const game = new Game(gameWidth, gameHeight);


const texLoader = new TextureLoader();
const bunnyTexture = texLoader.addOrGet('ship.png');
PIXI.loader
    .add('assets/animation/coin.json')
    .load(onAssetsLoaded);
function onAssetsLoaded() {

 var frames = [];

    for (var i = 0; i < 7; i++) {
        var val = i.toString();

        // magically works since the spritesheet was loaded with the pixi loader
        const tex = PIXI.Texture.fromFrame(`coin_animation_${val}.png`);
        tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        frames.push(tex);
    }
    const movie = new PIXI.extras.MovieClip(frames);

    game.addObject(new FPSCounter());
    game.addObject(new GameBorder(gameWidth, gameHeight));
    game.addObject(new Ship(bunnyTexture));
    game.addObject(new Coin(movie, 100, 100));
    game.addRendererToElement(document.getElementById("gameHost"));
    game.addEventListenerToElement(document.body);
    game.animate();
}