import React from 'react';
import {ConfigProvider} from 'antd';
import PropTypes from "prop-types";




/*ConfigProvider.config({
    prefixCls: 'purple',
    theme: {
        primaryColor: '#551A8B',
    },
});
ConfigProvider.config({
    prefixCls: 'blue',
    theme: {
        primaryColor: '#1890ff',
    },
});*/
export function ThemeProvider(props) {
    const {theme} = props;
    return props.children
    if (!theme) {
        return (
            <>
                {props.children}
            </>
        )
    }
    return (
        <ConfigProvider prefixCls={theme}>
            {props.children}
        </ConfigProvider>
    )
}

ThemeProvider.propTypes = {
    theme: PropTypes.string
}

export default {
    ThemeProvider
}
