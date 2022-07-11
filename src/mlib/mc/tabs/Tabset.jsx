import React from 'react';
import './index.less'
import { Tabs } from 'antd';
import PropTypes from "prop-types";

function Tabset(props){
    const {children, defaultActiveKey, onChange, ...otherProps} = props;
    return (
        <div className='tabset-container'>
            <Tabs 
                defaultActiveKey={defaultActiveKey} 
                onChange={onChange} 
                {...otherProps}
            >
                {children}
            </Tabs>
        </div>

    )
}

export function TabsetPane(props){
    const {children, tab, key, ...otherProps} = props;
    return (
        <Tabs.TabPane 
            tab={tab} 
            key={key} 
            {...otherProps}
        >
            {children}
        </Tabs.TabPane>
    )
}



Tabset.defaultProps = {
    defaultActiveKey: null,
    onChange: null,
}

Tabset.propTypes = {
    defaultActiveKey: PropTypes.any,
    onChange: PropTypes.func
}


export default Tabset;