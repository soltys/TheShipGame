
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Options } from './component/Options';
import Game from './Game';
import InitState from './state/InitState';
import './styles/main.scss';

import '@core/NumberExtensions';
import '@core/GamepadExtensions';

const gameWidth = 640;
const gameHeight = 704;
const game = new Game(gameWidth, gameHeight);

class GameApp extends React.Component {
    componentDidMount() {
        game.gotoState(new InitState());
    }

    render() {
        return (
            <div>
                <div id="header">
                    <h1>🕹 The Ship Game 🕹</h1>
                </div>
                <div id="row">
                    <div id="left-side">
                        <div id="fps-counter"></div>
                        <h2>Controls (⌨ keyboard)</h2>
                        <p><kbd>	&larr;</kbd> <kbd>&uarr;</kbd> <kbd>	&darr;</kbd> <kbd>&rarr;</kbd> - Controls your ship</p>
                        <p><kbd>W</kbd> - Grow your ship</p>
                        <p><kbd>S</kbd> - Shrink your ship</p>
                        <h2>Controls (🎮 gamepad - tested only with Xbox 360)</h2>
                        <p className="xbox-row"><img src="assets/site/stick.png" /> <span className="xbox-description">Left stick movement</span></p>
                        <p className="xbox-row"> <img src="assets/site/lb_button.png" /> <img src="assets/site/rb_button.png" /> <span className="xbox-description">Strafe left/right movement</span></p>
                        <p className="xbox-row"><span className="xbox-button xbox-button-green">A</span> <span className="xbox-description"> Grow your ship</span></p>
                        <p className="xbox-row"><span className="xbox-button xbox-button-red">B</span> <span className="xbox-description"> Shrink your ship</span></p>

                    </div>
                    <div id="gameHost"></div>
                    <div id="right-side">
                        <Options gameConfig={game.config} />
                    </div>
                </div>
                <div id="footer">
                    <p><a href="http://blog.soltysiak.it" title="blog">📓 Paweł Sołtysiak</a> - 2016-2018</p>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <GameApp />,
    document.getElementById('gameApp')
);
