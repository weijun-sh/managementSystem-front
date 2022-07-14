import React from 'react';
import PropTypes from "prop-types";
import Utils from 'mu/index'
import CopyButton from "../../../../mlib/mc/button/CopyButton";
import {sourceHash} from "../../openOuter";
function OuterLink(props){
    const { chainid, hash, ellipsis} = props;

    let show = Utils.Layout.ellipsisCenter(hash);

    return (
        <span>
            <CopyButton
                text={ellipsis ? show : hash}
                copyText={hash}
                onTextClick={(e) => {
                    sourceHash(hash, chainid, )
                    e.stopPropagation()
                }}
            />
        </span>
    )
}

OuterLink.defaultProps = {
    chainid: null,
    hash: null,
    ellipsis: false
}

OuterLink.propTypes = {
    chainid: PropTypes.any,
    hash: PropTypes.any,
    ellipsis: PropTypes.bool
}

export default OuterLink;



