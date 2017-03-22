import * as React from 'react';
import * as IGame from '../common/IGame';
import GameConfig from './../GameConfig';
import { ToggleOption } from './ToggleOption';
export interface OptionsProps { gameConfig: GameConfig; }

export class Options extends React.Component<OptionsProps, IGame.IConfig> {
    /**
     *
     */
    constructor(props) {
        super(props);
        this.state = this.props.gameConfig.getAll();
        this.setGameOptionsConfig = this.setGameOptionsConfig.bind(this);
    }

    componentDidMount() {
        this.setGameOptionsConfig();
    }

    setGameOptionsConfig() {
        this.setState((prevState, props) => {
            return this.props.gameConfig.getAll();
        });

    }

    updateGameConfig(name, value) {
        this.setState({
            [name]: value
        }, () => {
            this.props.gameConfig.update(name, value);
        });
    }

    render() {
        return (
            <div>
                <h2>Options</h2>
                <ul className='options-list'>
                    <li><ToggleOption id='isMouseEnabled' label='Enable mouse' value={this.state.isMouseEnabled} onChange={(val) => this.updateGameConfig('isMouseEnabled', val)} /></li>
                    <li><ToggleOption id='showFPSCounter' label='Show FPS counter' value={this.state.showFPSCounter} onChange={(val) => this.updateGameConfig('showFPSCounter', val)} /></li>
                </ul>
            </div>
        );
    }
}
