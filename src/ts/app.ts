import '../scss/main.scss';
import 'pixi.js';
import Ship from './Ship';
import GameBorder from './GameBorder';
import FPSCounter from './FPSCounter';
import TextureLoader from './TextureLoader';

import Game from './Game';
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../local.d.ts" />

const game = new Game();

const texLoader = new TextureLoader();
const bunnyTexture = texLoader.addOrGet('ship.png');


game.addObject(new FPSCounter());
game.addObject(new GameBorder());
game.addObject(new Ship(bunnyTexture));

game.addRendererToElement(document.body);
game.addEventListenerToElement(document.body);
game.animate();
