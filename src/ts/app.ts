import '../scss/main.scss';
import 'pixi.js';
import * as Matter from 'matter-js';

import RotatingBunny from './bunny';
import FPSCounter from './FPSCounter';
import TextureLoader from './TextureLoader';
import CharacterType from './common/CharacterType';
import Game from './Game';
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../local.d.ts" />

const game = new Game();

const texLoader = new TextureLoader();
const bunnyTexture = texLoader.addOrGet('bunny.png');


game.addObject(new FPSCounter());
game.addObject(new RotatingBunny(bunnyTexture, CharacterType.Player));
game.addObject(new RotatingBunny(bunnyTexture, CharacterType.NPC));
game.addRendererToElement(document.body);
game.addEventListenerToElement(document.body);
game.animate();
/*

// create the root of the scene graph
const stage = new PIXI.Container();

// create a texture from an image path
const texture = PIXI.Texture.fromImage('assets/bunny.png');
const bunny = new RotatingBunny(texture)
const bunny2 = new RotatingBunny(texture);
const fpsCounter = new FPSCounter();


const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

const engine = Engine.create();
const boxA = Bodies.rectangle(200, 150, 40, 40);
const boxB = Bodies.rectangle(300, 150, 40, 40);
const ground = Bodies.rectangle(0, 600, 800, 10, { isStatic: true });
World.add(engine.world, [boxA, boxB, ground]);

Engine.run(engine);
engine.world.gravity.y = 0.5;
*/