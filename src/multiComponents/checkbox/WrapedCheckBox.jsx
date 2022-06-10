import React from 'react';
import { Checkbox } from 'antd';
class WrapedCheckBox extends React.Component {
 
    render() {
        let status = true;
        if (this.props.value === false || this.props.value === 'false') status=false;
        return (
            <Checkbox
                checked={status}
                onChange={this.props.onChange}>
                {this.props.text}
            </Checkbox>
        );
    }
}
 
export default WrapedCheckBox;