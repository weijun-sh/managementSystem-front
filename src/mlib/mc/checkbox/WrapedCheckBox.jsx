import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from "prop-types";
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

WrapedCheckBox.defaultProps = {
    text: null,
    value: null,
    onChange: null
}

WrapedCheckBox.propTypes = {
    text: PropTypes.object,
    value: PropTypes.any,
    onChange: PropTypes.func
}
 
export default WrapedCheckBox;