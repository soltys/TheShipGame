import * as React from "react";
import * as IGame from '../common/IGame';
export interface OptionsProps { gameConfig: IGame.IConfig; }

export class Options extends React.Component<OptionsProps, IGame.IConfig> {
    /**
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            isMouseEnabled: false,
        };

        this.setGameOptionsConfig = this.setGameOptionsConfig.bind(this);
    }

    componentDidMount() {
        this.setGameOptionsConfig();
    }

    setGameOptionsConfig() {
        const isMouseEnabled = this.props.gameConfig.isMouseEnabled;
        this.setState({
            isMouseEnabled
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        }, () => {
            this.props.gameConfig[name] = value;
        });
    }

    render() {
        return (
            <div>
                <h2>Options</h2>
                <div>
                    <input className="tgl tgl-ios" id="cb2" type="checkbox" name="isMouseEnabled" checked={this.state.isMouseEnabled} onChange={(event) => this.handleInputChange(event)} />
                    <label className="tgl-btn" htmlFor="cb2"></label>
                    Enable mouse
                </div>
            </div>
        );
    }
}