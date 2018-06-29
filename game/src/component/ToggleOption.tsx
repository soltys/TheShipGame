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
    constructor(props: ToggleProps) {
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

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        this.setState({
            ['checked']: target.checked
        }, () => {
            this.props.onChange(target.checked);
        });
    }

    render() {
        return (
            <div>
                <input className="tgl tgl-ios" id={this.props.id} type="checkbox" checked={this.state.checked} onChange={(event) => this.handleInputChange(event)} />
                <label className="tgl-btn" htmlFor={this.props.id}></label>
                {this.props.label}
            </div>
        );
    }
}
