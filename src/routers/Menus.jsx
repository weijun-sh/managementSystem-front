import {Menu, Layout} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './menu.less'
import {useNavigate, useLocation,} from "react-router-dom";
import configs from './menuConfig'
import React, {useEffect, useState} from 'react';

const {Sider} = Layout;

function Menus(props) {
    const navigate = useNavigate();

    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState(location.pathname);

    function reload(e) {
        if (current === e.key) {
            window.location.reload()
            return;
        }
        navigate(e.key, {});
        setCurrent(e.key);
    }

    function col(){
        let col = !collapsed
        setCollapsed(col);
        props.onCollapse(col)
    }

    const toRoot = () => {
        navigate('/');
    };

    useEffect(() => {
        setCurrent(location.pathname)
    }, [location.pathname]);

    return (
        <Sider className={"menu-aside"}>
            <div onClick={toRoot} className={"logo-wrap"}>
                <img
                    className={"logo-image"}
                    src={require('../assets/favicon.ico')}
                />
                <span className={"menu-brand"}>MultiChain</span>
            </div>

            <Menu
                defaultOpenKeys={['/transition']}
                theme="dark"
                mode="inline"
                items={configs()}
                onClick={reload}
                selectedKeys={[current]}
            />

            <div
                onClick={col}
                className={"col-button"}
            >
                <LeftOutlined></LeftOutlined>
            </div>

        </Sider>
    )
}

export default Menus;
