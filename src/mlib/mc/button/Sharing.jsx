import {Button, Modal, Input, Checkbox, Select} from 'antd';

import React, {forwardRef, useRef, useState} from 'react';
import html2canvas from 'html2canvas'
import {ShareAltOutlined} from '@ant-design/icons'
import './sharing.less'

const {TextArea} = Input;

function Sharing() {

    return null
    let list = [{name: '张工'}, {name: '张国泽'}];
    const emailRef = useRef(0);
    const copyRef = useRef(0);
    const titleRef = useRef(0);
    const contentRef = useRef(0);



    const EmailOptions = forwardRef(function (props, ref){
        return (
            <Select ref={ref} mode={props.mode} className={"select"}>
                {
                    list.map((item, index) => {
                        return (
                            <Select.Option value={item.name} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    })
                }
            </Select>
        )
    })

    function confirm(close){
        let email = emailRef.current;
        let copy = copyRef.current;
        let title = titleRef.current;
        window.groupSuccess("confirm", "email", email, "copy", copy, 'title', title)
        window.groupError("content", 'title', title.input.value)
        debugger
    }

    return (
        <div
            onClick={() => {
                html2canvas(document.querySelector('main.page-content')).then((canvas) => {
                    let imageURL = canvas.toDataURL("image/png");    //canvas转base64图片

                    Modal.confirm({
                        title: '分享',
                        width: 900,
                        okText: '确定',
                        cancelText: '取消',
                        onOk: (close) => {
                            confirm(close)
                        },
                        content: (
                            <div className={"sharing-container"}>

                                <div className={"content"}>
                                    <img src={imageURL}/>
                                    <div>
                                        <span>链接地址</span>
                                        <span>{window.location.href}</span>
                                    </div>

                                </div>
                                <div className={"email"}>
                                    <div className={"line"}>
                                        <span

                                            className={"label"}
                                        >
                                            收件人:
                                        </span>
                                        <EmailOptions
                                            ref={emailRef}
                                        />
                                    </div>
                                    <div className={"line"}>
                                        <span
                                            className={"label"}

                                        >
                                            抄送:
                                        </span>
                                        <EmailOptions
                                            ref={copyRef}
                                            mode={"tags"}
                                        />
                                    </div>
                                    <div className={"line"}>
                                        <span
                                            className={"label"}

                                        >
                                            标题:
                                        </span>
                                        <Input
                                            ref={titleRef}
                                            value={"跨链交易报告"}
                                            className={"select"}
                                        />
                                    </div>
                                    <div className={"line"}>
                                        <span className={"label"}>内容</span>
                                        <TextArea
                                            className={"select"}
                                            ref={contentRef}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }).catch(() => {

                })
            }}
            className={"sharing-icon-container"}
        >
            <ShareAltOutlined
                className={"icon"}
            />
        </div>
    )
}

export default Sharing;
