import React, { useState } from 'react';
import PropTypes from "prop-types";
import './index.less'
function PageContainer(props){
    const {children,className} = props;
    return (
        <div className={` ${className}`}>
            {children}
        </div>
    ) 
}

PageContainer.defaultProps = {
    className: null
}

PageContainer.propTypes = {
    className: PropTypes.any
}

export default PageContainer;
