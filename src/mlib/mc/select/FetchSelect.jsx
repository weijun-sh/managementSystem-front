import React, {useState} from 'react';
import PropTypes from "prop-types";
import {Select} from 'antd'

const {Option} = Select;

class FetchSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {options, ...otherProps} = this.props;
        return (
            <Select
                showSearch
                filterOption={(input, option) => {
                    return option.children.toLowerCase().includes(input.toLowerCase())
                }}
                {...otherProps}
            >
                {
                    options.map((item, index) => {
                        const {value, label} = item;
                        return (
                            <Option key={index} value={value}>
                                {label}
                            </Option>
                        )
                    })
                }

            </Select>
        );
    }
}

FetchSelect.defaultProps = {
}

FetchSelect.propTypes = {
    options: PropTypes.any,
}

export default FetchSelect;
