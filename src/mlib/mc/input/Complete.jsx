import {AutoComplete} from "antd";
import React from "react";
import PropTypes from "prop-types";

function Complete(props){
    const {defaultOpen, autoFocus, options, onChange, completeKey, ...other} = props;


    return (
        <AutoComplete
            defaultOpen={false}
            autoFocus={false}
            options={options}
            onChange={(value, option) => {
                onChange(value, option)
            }}
            {...other}
        />
    )
}

Complete.propTypes = {
    defaultOpen: PropTypes.bool,
    autoFocus: PropTypes.bool,
    options: PropTypes.array,
    onChange: PropTypes.func,
}

Complete.defaultProps = {
    defaultOpen: false,
    autoFocus: false,
    options: [],
    onChange: null,
}

export default Complete;
