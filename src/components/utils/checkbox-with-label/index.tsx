import * as React from 'react';

interface CheckboxWithLabelProps {
  labelOn: string,
  labelOff: string,
}

interface CheckboxWithLabelState {
  isChecked: boolean,
}

export class CheckboxWithLabel extends React.Component<CheckboxWithLabelProps, CheckboxWithLabelState> {

  state = {
    isChecked: false,
  }

  onChange = () => {
    this.setState({ isChecked: !this.state.isChecked });
  }

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={this.onChange}
        />
        {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
      </label>
    );
  }
}
