import {Button, Modal, Input, Checkbox, Select, Form, message} from 'antd';

import React, {forwardRef, useEffect, useRef, useState} from 'react';
import html2canvas from 'html2canvas'
import {ShareAltOutlined} from '@ant-design/icons'
import './sharing.less'
import Services from '../../../services/api';

const {TextArea} = Input;

let loading = false;
function setLoading(b){
    loading = b;
}

function Sharing() {


    const formRef = useRef(0);
    const [receivers, setReceivers] = useState([])

    useEffect(() => {
        loading = false
        Services.emailReceivers({

        }).then((res) => {
            setReceivers(res.data)
        }).catch((err) => {

        })
    }, [])

    const EmailOptions = forwardRef(function (props, ref) {
        return (
            <Select
                ref={ref}
                mode={props.mode}
                className={"select"}
                onChange={props.onChange}
            >
                {
                    receivers.map((item, index) => {
                        return (
                            <Select.Option value={item.email} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    })
                }
            </Select>
        )
    })


    function confirm(imageURL, close) {
        if (!formRef || !formRef.current) {
            close();
            return;
        }
        if(loading){
            message.warn("正在发送中")
            return
        }
        setLoading(true)
        formRef.current.validateFields().then((params) => {

            if(Array.isArray(params.cc) && params.cc.length){
                params.cc = params.cc.join(',')
            }else {
                params.cc = null
            }

            if(!params.content){
                params.content = '';
            }

            params.html = `
                <div>
                    <div style="font-size: 12px; color: gray">链接地址:</div> 
                    <a href="${window.location.href}">${window.location.href}</a>
                    <br/>
                    <div style="font-size: 12px; color: gray">预览图:</div> 
                    <img src="${imageURL}"/>
                    <br/>
                    ${params.content}
                </div>
              `
            Services.sendEmail({
                params: params
            }).then((res) => {
                message.success("发送成功", 1).then(() => {
                    close()
                })
            }).catch((err) => {
                window.error("send err", err);
            }).finally(() => {
                setLoading(false)
            })
        }).catch(() => {
            setLoading(false)
        })

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
                            confirm(imageURL, close)
                        },
                        content: (
                            <div className={"sharing-container"}>

                                <div className={"content"}>
                                    <img src={imageURL}/>
                                    <div className={"url"}>
                                        页面地址: {window.location.href}
                                    </div>
                                </div>
                                <Form
                                    ref={formRef}
                                    className={"email"}
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 18,
                                    }}
                                >
                                    <Form.Item
                                        label={"收件人"}
                                        className={"line"}
                                        rules={[{required: true, message: '请选择收件人'}]}
                                        name={"to"}
                                    >
                                        <EmailOptions/>
                                    </Form.Item>
                                    <Form.Item name={"cc"} label={"抄送"} className={"line"}>
                                        <EmailOptions mode={"tags"}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={"标题"}
                                        className={"line"}
                                        name={"subject"}
                                        initialValue={"跨链交易报告"}
                                    >
                                        <Input
                                            className={"select"}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={"内容"}
                                        className={"line"}
                                        name={"content"}
                                    >
                                        <TextArea
                                            className={"select text-area"}
                                        />
                                    </Form.Item>
                                </Form>
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