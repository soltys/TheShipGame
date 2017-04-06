import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Options } from './component/Options';
import Game from './Game';
import InitState from './state/InitState';
import './styles/main.scss';

const gameWidth = 640;
const gameHeight = 704;
const game = new Game(gameWidth, gameHeight);
game.gotoState(new InitState());


ReactDOM.render(
    <Options gameConfig={game.config} />,
    document.getElementById('options')
);
