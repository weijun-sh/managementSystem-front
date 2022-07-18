import React, {useEffect, useState} from 'react';
import './todolist.less'
import Services from '../services/api';
import {message} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";

function ToDoList(props) {

    const [list, setList] = useState([]);
    const {visible} = props;

    useEffect(() => {
        getToDoList()
    }, [visible])

    function getToDoList() {
        Services.getToDoList({}).then((res) => {
            setList(res.data)
        }).catch(() => {

        })
    }

    if(!list.length){
        return (
            <div className={"todolist-container"}>
                暂无代办
            </div>
        )
    }

    return (
        <div className={"todolist-container"}>
            {
                list.map((item, index) => {
                    const {subject, image, content, href, id, cc, to} = item;
                    return (
                        <div key={index} className={"item"}>
                            <div className={"left"}>
                                <div className={"title"}>
                                    处理人<span className={"value"}>{to}</span>
                                </div>
                                <div className={"title"}>
                                    协助<span className={"value"}>{cc}</span>
                                </div>
                                <div className={"title"}>
                                    主题<span className={"value"}>{subject}</span>
                                </div>
                                <div className={"content"}>
                                    内容
                                    <span className={"value"}>{content}</span>
                                </div>
                            </div>

                            <div
                                className={"preview"}
                            >
                                <img
                                    onClick={() => {
/*                                        Services.deleteToDoList({
                                            params: {
                                                id: id
                                            }
                                        }).then(() => {

                                        })*/
                                        window.open(href);
                                    }}
                                    src={image}
                                />

                            </div>

                            <CloseCircleOutlined
                                className={"close"}
                                onClick={() => {
                                    Services.deleteToDoList({
                                        params: {
                                            id: id
                                        }
                                    }).then(() => {
                                        message.success("删除成功").then(() => {
                                        })
                                    }).catch(() => {

                                    })
                                }}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ToDoList
