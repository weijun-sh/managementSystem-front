import React, {useEffect, useState} from 'react';
import './jsonout.less'
import PropTypes from "prop-types";

function JsonOut(props) {

    const {obj, className, style} = props;
    const [inner, setInner] = useState("")

    useEffect(() => {
        if(obj){
            let res = syntaxHighlight(obj);
            setInner(res)
        }

    }, [])

    if(obj == null){
        return null
    }

    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        let matchReg = /("(\\u[a-zA-Z0-9]{4},?|\\[^u]|[^\\"])*"(\s*:)?,?|\b(true|false|null)\b,?|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(matchReg, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }

            return `<span class="${cls}">${match}</span>`
        });
    }

    return (
        <div style={{...style}}  className={`json-out-container`}>
            <pre dangerouslySetInnerHTML={{__html: inner}} >
            </pre>
        </div>

    )
}

JsonOut.propTypes = {
    obj: PropTypes.any,
    className: PropTypes.any,
}

JsonOut.defaultProps = {
    obj: null,
    className: PropTypes.any,
}

export default JsonOut;
