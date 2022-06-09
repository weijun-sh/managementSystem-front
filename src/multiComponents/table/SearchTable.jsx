import { Card, Table, Form, Input, Select, Checkbox, Button } from 'antd';
import React from 'react';


export default class SearchTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
            loading: false,
            columnsData: props.columns || [],
            formInfo: {
                searchList: []
            }
        }
        this.ref = null;
        this.searchList = this.filterSearch(props);
    }

    componentDidMount() {

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

    fetchData = () => {
        const { getList } = this.props;
        this.ref.validateFields().then((err, values) => {
            if (err) {
                return;
            }
            this.setState({ loading: true })
            getList({
                params: values
            }).then((list) => {
                this.setState({
                    list: list
                })
            }).catch(() => {

            }).finally(() => {
                this.setState({
                    loading: false
                })
            })
        }).catch(() => {

        })

    }

    render() {
        const { list, loading, columnsData } = this.state;
        const { } = this.props;
        console.log("searchList ==>", this.searchList);
        return (
            <div style={{ marginBottom: 10 }}>
                <Card>
                    <Form
                        ref={(node) => { this.ref = node }}
                        layout='inline'
                    >
                        {
                            this.searchList.map((item, index) => {
                                const { type, label, name, rules, initialValue } = item;
                                switch (type) {
                                    case 'input':
                                        return (
                                            <Form.Item
                                                key={index}
                                                label={label}
                                                name={name}
                                                rules={rules}
                                                initialValue={initialValue}
                                            >
                                                <Input />
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
                                            >
                                                <Select style={{ minWidth: 200 }}>
                                                    <Select.Option value="123">123</Select.Option>
                                                    <Select.Option value="345">345</Select.Option>
                                                    <Select.Option value="567">567</Select.Option>
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
                                            >
                                                <Checkbox>

                                                </Checkbox>
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
                <Card style={{ marginTop: 10 }}>
                    <Table
                        loading={loading}
                        dataSource={list}
                        columns={columnsData}
                    />
                </Card>
            </div>
        )
    }


}