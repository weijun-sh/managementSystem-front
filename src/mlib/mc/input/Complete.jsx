import {AutoComplete} from "antd";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import _ from 'lodash'

function Complete(props) {
    const {onChange, value, completeKey, ...other} = props;

    const [options, setOptions] = useState([]);
    const saveKey = `complete-${completeKey}`;
    useEffect(() => {

        if (!completeKey) {
            return
        }

        let inputoptions = getOptionsFromLocal();
        inputoptions = unshiftHistory(inputoptions, value)
        localStorage.setItem(saveKey, JSON.stringify(inputoptions))

    }, []);

    function getOptionsFromLocal(){
        let inputoptions = [];
        let getLocal = localStorage.getItem(saveKey);
        if (getLocal) {
            inputoptions = JSON.parse(getLocal);
        }
        return inputoptions
    }

    function isExit(list, value){
        let exit = false;
        list.map(item => {
            if(item.label === value){
                exit = true
            }
        })
        return exit;
    }

    function unshiftHistory(list, value){
        if(!value || value === ''){
            return list;
        }
        if(!isExit(list, value)){
            let option = {
                label: value,
                value: value
            }
            list = [option, ...list]
        }
        list = list.slice(0, 5);
        return list;
    }

    function saveHistory(value) {
        if (!completeKey || !value || value === '') {
            return
        }
        if(isExit(options, value)){
            return
        }

        let newOptions = unshiftHistory(options, value)

        localStorage.setItem(saveKey, JSON.stringify(newOptions))
    }

    const save = _.debounce(saveHistory, 2000);

    return (
        <AutoComplete
            onFocus={() => {
                window.success("onFocus");
                setOptions(getOptionsFromLocal);
            }}
            onBlur={() => {
                setOptions([])
            }}
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
