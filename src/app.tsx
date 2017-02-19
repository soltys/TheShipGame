import './styles/main.scss';
import * as PIXI from 'pixi.js';
import PlayState from './states/PlayState';
//import MenuState from './states/MenuState';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Options } from "./components/Options";

import Game from './Game';

const gameWidth = 640;
const gameHeight = 704;
const game = new Game(gameWidth, gameHeight);

PIXI.loader.add([
    'assets/animation/coin.json',
    'assets/animation/bullet.json',
    'assets/ship_to_left.png',
    'assets/ship_to_right.png',
    'assets/ship.png',
    'assets/borders/top.png',
    'assets/borders/bottom.png',
    'assets/borders/left.png',
    'assets/borders/right.png',
    'assets/borders/corner_right_top.png',
    'assets/borders/corner_left_top.png',
    'assets/borders/corner_right_bottom.png',
    'assets/borders/corner_left_bottom.png',

])
    //.on("progress", loadProgressHandler)
    .load(onAssetsLoaded);


ReactDOM.render(
    <Options gameConfig={game.config} />,
    document.getElementById("options")
);

function onAssetsLoaded(load, res) {
    game.gotoState(new PlayState());
    game.addRendererToElement(document.getElementById("gameHost"));
    game.addFPSCounter(document.getElementById("fps-counter"));
    game.addEventListenerToElement(document.body);
    game.animate();
}
