import React from 'react';
import {SearchOutlined} from '@ant-design/icons';
import PropTypes from "prop-types";
import './index.less'

function ToChainLink({hash, chainid}) {
    if (!hash) {
        return null
    }
    if (!chainid) {
        return (
            <SearchOutlined
                className={"to-chain-link"}
                style={{opacity: 0.5}}
                onClick={() => {
                    window.open(`/#/transition/chain?hash=${hash}`, '_blank')
                }}
            />
        )
    }
    return (
        <SearchOutlined
            className={"to-chain-link"}
            onClick={() => {
                window.open(`/#/transition/chain?hash=${hash}&chainid=${chainid}`, '_blank')
            }}
        />
    )
}

ToChainLink.propTypes = {
    hash: PropTypes.any,
    chainid: PropTypes.any,
}

export default ToChainLink;
