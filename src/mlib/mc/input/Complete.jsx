import {AutoComplete} from "antd";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import _ from 'lodash'

function Complete(props) {
    const {onChange, value, completeKey} = props;

    const [options, setOptions] = useState([]);
    const saveKey = `complete-${completeKey}`;
    useEffect(() => {
        if (!completeKey) {
            return
        }
        let inputoptions = localStorage.getItem(saveKey);
        if (inputoptions) {
            inputoptions = JSON.parse(inputoptions);
            setOptions(inputoptions)
        }
    }, [])

    function saveHistory(value) {
        if (!completeKey || !value) {
            return
        }
        let exit = false;
        options.map(item => {
            if(item.label === value){
                exit = true
            }
        })
        if(exit){
            return
        }
        let option = {
            label: value,
            value: value
        }
        let newOptions = [option, ...options];
        newOptions = newOptions.slice(0, 5);

        setOptions(newOptions)
        localStorage.setItem(saveKey, JSON.stringify(newOptions))
    }

    const save = _.debounce(saveHistory, 2500);

    return (
        <AutoComplete
            value={value}
            options={options}
            allowClear={true}
            onChange={(value) => {
                save(value)
                onChange(value)
            }}
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
