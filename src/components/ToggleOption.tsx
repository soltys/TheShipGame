import * as React from 'react';
export interface ToggleProps {
    onChange: (newValue: boolean) => void;
    value: boolean;
    label: string;
    id: string;
}
export interface ToggleState {
    checked: boolean;
}

export class ToggleOption extends React.Component<ToggleProps, ToggleState> {
    /**
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };

        this.setInitialToggleOption = this.setInitialToggleOption.bind(this);
    }

    componentDidMount() {
        this.setInitialToggleOption();
    }

    setInitialToggleOption() {
        const checked = this.props.value;
        this.setState({
            checked
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ['checked']: value
        }, () => {
            this.props.onChange(value);
        });
    }

    render() {
        return (
            <div>
                <input className='tgl tgl-ios' id={ this.props.id } type='checkbox' checked={ this.state.checked } onChange={ (event) => this.handleInputChange(event) } />
                <label className='tgl-btn' htmlFor={ this.props.id }></label>
                { this.props.label } 
            </div>
        );                                                                                                                                                             
    }
}
