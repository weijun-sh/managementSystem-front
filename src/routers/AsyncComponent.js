import React, { Component } from "react";
import {Skeleton, Spin} from "antd";

export default function asyncComponent(importComponent) {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null,
            };
        }

        async componentDidMount() {
            const { default: component } = await importComponent();

            this.setState({
                component: component,
            });
        }

        render() {
            const C = this.state.component;

            if(C){
                return <C {...this.props} />
            }
            return (
                <div style={{marginTop: 10, background: 'white', padding: 20}}>
                    <Skeleton active />
                    <Skeleton active />
                </div>
            )

        }
    }

    return AsyncComponent;
}
