import '../scss/main.scss';
import 'pixi.js';
import PlayState from './states/PlayState';

import Game from './Game';

const gameWidth = 300;
const gameHeight = 350;
const game = new Game(gameWidth, gameHeight);

PIXI.loader.add([
    'assets/animation/coin.json',
    'assets/animation/bullet.json',
    'assets/ship_to_left.png',
    'assets/ship_to_right.png',
    'assets/ship.png'
])
    //.on("progress", loadProgressHandler)
    .load(onAssetsLoaded);


function onAssetsLoaded(load, res) {
    game.gotoState(new PlayState());
    game.addRendererToElement(document.getElementById("gameHost"));
    game.addEventListenerToElement(document.body);
    game.animate();
}
