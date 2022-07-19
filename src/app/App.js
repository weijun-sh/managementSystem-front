import PageRoutes from '../routers/PageRoutes'

import {BackTop, Dropdown, Menu} from 'antd';
import Menus from '../routers/Menus'
import React, {useState} from 'react';
import {HashRouter as Router,} from 'react-router-dom';
import {Provider} from "mobx-react";
import stores from "@/stores";
import {ThemeProvider} from "mu/theme";
import './App.less'
import PageLayout, {PageContent, PageFooter, PageHeader} from "mc/layout/Layout";
import Sharing from "../mlib/mc/button/Sharing";
import ToDoList from "./ToDoList";

const App = function () {
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState('blue');
    const [visibleToDo, setVisibleToDo] = useState(false);

    const change = (theme) => {
        setTheme(theme)
    }

    function HeaderComponent() {
        const menu = (
            <Menu
                items={[
                    {
                        key: 'blue',
                        label: (
                            <a
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    setTheme("blue")
                                }}

                            >
                                蓝色主题
                            </a>
                        ),
                        disabled: theme === 'blue',
                    },
                    {
                        key: 'purple',
                        label: (
                            <a
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    setTheme("purple")
                                }}
                            >
                                紫色主题
                            </a>
                        ),
                        disabled: theme === 'purple',
                    },
                ]}
            />
        );
        return (
            <PageHeader
                getRight={() => {
                    return (
                        <Dropdown

                            onVisibleChange={(visible) => {
                                setVisibleToDo(visible)
                            }}
                            overlay={(
                                <Menu>
                                    <Menu.Item>
                                        <ToDoList visible={visibleToDo}/>
                                    </Menu.Item>
                                </Menu>

                            )}
                        >
                            <span style={{marginRight: 30, cursor: "pointer", fontSize: 16}}>admin</span>
                        </Dropdown>
                    )
                }}
            />
        )
    }

    function MainComponent() {
        return (
            <PageLayout
                hasSider
                className="site-layout"
                style={{
                    marginLeft: collapsed ? 80 : 160,
                    transition: 'all 0.2s',
                }}
            >
                <Menus onCollapse={(col) => {
                    setCollapsed(col)
                }}/>
                <PageContent>
                    <PageRoutes/>

                    <Sharing/>
                    <BackTop style={{bottom: 20}}/>

                    <FooterComponent/>
                </PageContent>
            </PageLayout>
        )
    }

    function FooterComponent() {
        return (
            <PageFooter>
                Copyright © 2022 Multichain 管理系统 All rights reserved.
            </PageFooter>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Provider {...stores}>
                <Router>
                    <PageLayout>
                        <HeaderComponent/>

                        <MainComponent/>


                    </PageLayout>
                </Router>
            </Provider>
        </ThemeProvider>

    );
}


export default App;
