import { Card, Table, Form, Input, Select, Checkbox, Button } from 'antd';
import React from 'react';
import WrapedCheckBox from '../checkbox/WrapedCheckBox';


export default class SearchTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
            loading: false,
            columnsData: this.filterColumns() || [],
            formInfo: {
                searchList: []
            }
        }
        this.formRef = null;
        this.searchList = this.filterSearch(props);
    }

    filterSearch() {
        const { columns } = this.props;
        let searchs = columns.map((item) => {
            if (item.search) {
                return item.search;
            }
        });
        searchs = searchs.filter((item) => { return !!item })
        return searchs;
    }

    filterColumns = () => {
        const { columns } = this.props;

        let c = columns.filter((item) => {
            return !item.hidden
        })
        return c;
    }

    fetchData = () => {
        const { getList } = this.props;
        if (!this.formRef) {
            return;
        }
        this.formRef.validateFields().then((values) => {
            this.setState({ loading: true });
            getList({
                params: values
            }).then((list) => {
                list = list.map((item, index) => {
                    item.rowKey = index; return item;
                })
                this.setState({
                    list: list
                })
            }).catch(() => {

            }).finally(() => {
                this.setState({
                    loading: false
                })
            })
        }).catch((err) => {
            console.log("catch ==>", err)
        })
    }

    render() {
        const { list, loading, columnsData } = this.state;
        let { getRef, scroll } = this.props;
        scroll = { x: 820, ...scroll };
        return (
            <div style={{ marginBottom: 10 }}>
                <Card hidden={!this.searchList.length}>
                    <Form
                        ref={(node) => {
                            if (!node) {
                                return;
                            }
                            this.formRef = node
                            getRef(this);
                        }}
                        layout='inline'
                    >
                        {
                            this.searchList.map((item, index) => {
                                let {
                                    type,
                                    label,
                                    name,
                                    rules,
                                    initialValue,
                                    options,
                                    style,
                                    className,
                                    componentProps
                                } = item;
                                style = { marginBottom: 4, ...style }
                                switch (type) {
                                    case 'input':
                                        return (
                                            <Form.Item
                                                key={index}
                                                label={label}
                                                name={name}
                                                rules={rules}
                                                initialValue={initialValue}
                                                style={style}
                                                className={className}
                                            >
                                                <Input {...componentProps} />
                                            </Form.Item>
                                        );
                                    case 'select':
                                        return (

                                            <Form.Item
                                                key={index}
                                                label={label}
                                                name={name}
                                                rules={rules}
                                                initialValue={initialValue}
                                                style={style}
                                                className={className}
                                            >

                                                <Select {...componentProps}>
                                                    {
                                                        options.map((item, optionsIndex) => {
                                                            return (
                                                                <Select.Option
                                                                    value={item.value}
                                                                    key={optionsIndex}
                                                                >
                                                                    {item.label}
                                                                </Select.Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>

                                        );
                                    case 'checkbox':
                                        return (
                                            <Form.Item
                                                key={index}
                                                label={label}
                                                name={name}
                                                rules={rules}
                                                initialValue={initialValue}
                                                style={style}
                                                className={className}
                                            >
                                                <WrapedCheckBox {...componentProps} />
                                            </Form.Item>
                                        )
                                }
                            })
                        }

                        <Button
                            type='primary'
                            onClick={() => {
                                this.fetchData()
                            }}
                        >
                            查询
                        </Button>
                    </Form>
                </Card>
                <Card
                    style={{ marginTop: 10 }}
                    extra={this.searchList.length === 0 && (
                        <Button
                            type='primary'
                            onClick={() => {
                                this.fetchData()
                            }}
                        >
                            刷新
                        </Button>
                    )}
                >
                    <Table
                        scroll={scroll}
                        rowKey={'rowKey'}
                        loading={loading}
                        dataSource={list}
                        columns={columnsData}
                    />
                </Card>
            </div>
        )
    }


}