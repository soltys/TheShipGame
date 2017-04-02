import InitState from './state/InitState';
import './styles/main.scss';
import Game from './Game';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Options } from './component/Options';

const gameWidth = 640;
const gameHeight = 704;
const game = new Game(gameWidth, gameHeight);
game.gotoState(new InitState());


ReactDOM.render(
    <Options gameConfig={game.config} />,
    document.getElementById('options')
);
