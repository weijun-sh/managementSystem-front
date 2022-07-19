import {Card, Table, Form, Input, Button, AutoComplete} from 'antd';
import React from 'react';
import WrapedCheckBox from '../checkbox/WrapedCheckBox';
import PropTypes from "prop-types";
import FetchSelect from "mc/select/FetchSelect";
import Complete from "../input/Complete";

function showTotal(total) {
    return `总共 ${total} 条数据`
}

function colorList(list, field) {
    let obj = [];
    let colors = ['rgb(24, 144, 255)', '#8247e5', '#3f56b9', '#b98b3f'];
    let ci = 0;
    list.map((item, index) => {
        if (index < list.length - 1) {
            let after = list[index + 1];

            if (after[field] === item[field]) {
                obj[index + 1] = {
                    field: 'bridge',
                    background: colors[ci],
                    color: '#fff'
                };
                obj[index] = {
                    field: field,
                    background: colors[ci],
                    color: '#fff'
                };
            } else {
                if (index > 0 && obj[index - 1]) {
                    if (++ci === colors.length) {
                        ci = 0;
                    }
                }
            }
        }
    });
    return obj
}

class SearchTable extends React.Component {
    constructor(props) {
        super(props);

        let pg = {
            current: 1,
            pageSize: 10,
            showTotal,
            pageSizeOptions: [10, 50, 100, 150],
            showSizeChanger: true
        }
        if(props.pagination === false){
            pg = false;
        }
        if(props.pagination){
            pg = {
                ...pg,
                ...props.pagination
            }
        }
        this.state = {
            list: [],
            loading: false,
            pagination: pg
        }
        this.formRef = null;
    }

    filterSearch() {
        const {columns} = this.props;
        let searchs = columns.map((item) => {
            if (item.search) {
                return item.search;
            }
            return null
        });
        searchs = searchs.filter((item) => {
            return !!item
        })
        return searchs;
    }

    filterColumns = () => {
        let {columns, columnIndex} = this.props;

        //add Index to line
        if (columnIndex) {
            //已经存在则不添加
            let indexcolumns = columns.filter((item) => {
                return item.dataIndex === 'rowKey'
            });
            if (indexcolumns.length === 0) {
                columns.unshift({
                    title: '#',
                    dataIndex: 'rowKey',
                    key: 'rowKey',
                    width: 44,
                    render: (data, record, index) => {
                        const {pagination} = this.state;
                        if (!pagination) {
                            return (
                                <div>{data}</div>
                            )
                        }
                        const {pageSize, current} = pagination;
                        if (!pageSize || !current) {
                            return (
                                <div>{data}</div>
                            )
                        }
                        return (
                            <div>{(current - 1) * pageSize + (index + 1)}</div>
                        )
                    }
                })
            }

        }
        columns = columns.filter((item) => {
            return !item.hidden
        })
        columns = columns.map((item, index) => {
            if (item.render) {
                let render = item.render;
                item.render = (data, record, index,) => {
                    const {list} = this.state;
                    const {combineField} = this.props;
                    let cs = {};
                    let line = record.rowKey - 1
                    if (item.dataIndex === combineField) {
                        cs = colorList(list, combineField)[line];
                    }
                    return render(data, record, index, {
                        list,
                        line,
                        pagination: this.state.pagination,
                        cs
                    })
                }
            }
            return {...item}
        })

        return columns;
    }

    fetchData = () => {

        this.setState({loading: true});
        if (this.filterSearch().length === 0) {
            this.getList();
            return;
        }
        if (!this.formRef) {
            return;
        }
        this.formRef.validateFields().then((values) => {
            this.getList(values)
        }).catch((err) => {
            this.setState({loading: false});
        }).finally(() => {

        })
    }

    getList = (values) => {
        const {loadedSuccess, loadedFail, loadFinal, loadStart} = this.props;
        loadStart()
        this.props.getList && this.props.getList({
            params: values
        }).then((list) => {
            list = list.map((item, index) => {
                item.rowKey = index + 1;
                return item;
            })
            this.setState({
                list: list
            }, () => {
                loadedSuccess(list)
            })
        }).catch((err) => {
            this.setState({
                list: []
            }, () => {
                loadedFail(err)
            })
        }).finally(() => {
            this.setState({
                loading: false
            }, () => {
                loadFinal()
            })
        })
    }

    renderFormItem = () => {
        return this.filterSearch().map((item, index) => {
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
            style = {marginBottom: 4, ...style}
            switch (type) {
                case 'input':
                    let {completes, ...other} = componentProps;
                    if(completes){
                        completes = completes.map(item => {
                            if(typeof item === 'string'){
                                item = {
                                    label: item,
                                    value: item
                                }
                            }
                            return item;
                        })
                    }
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
{/*                            <Complete
                                defaultOpen={false}
                                autoFocus={false}
                                options={null}
                                completeKey={"13579"}
                                {...other}
                            />*/}
                            <AutoComplete
                                defaultOpen={false}
                                autoFocus={false}
                                options={completes}

                                {...other}
                            />
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
                            <FetchSelect
                                options={options}
                                {...componentProps}
                            />

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

    renderCard2Extra = () => {
        const {loading} = this.state;
        if (typeof this.props.card2Extra === 'function') {
            return this.props.card2Extra();
        }
        if (this.props.card2Extra != null) {
            return this.props.card2Extra;
        }

        if (this.filterSearch().length !== 0) {
            return null;
        }
        return (
            <Button
                type='primary'
                onClick={() => {
                    if (loading) {
                        return;
                    }
                    this.fetchData()
                }}
                disabled={loading}
                // style={{background: loading? 'gray': '', border: loading? 'gray': ''}}

            >
                刷新
            </Button>
        )
    }

    renderCard2Title = () => {
        const {card2Title} = this.props;

        if (typeof card2Title === "function") {
            return card2Title()
        }

        if (card2Title) {
            return (
                <div style={{width: 200, textAlign: 'left'}}>
                    {card2Title}
                </div>
            )
        }
        return (
            <div style={{width: 200, textAlign: 'left'}}>
                查询结果
            </div>
        )
    }


    getRef = (node) => {
        if (!node) {
            return;
        }
        this.formRef = node
        this.props.getRef(this);
    }

    setList = (list) => {
        list = list.map((item, index) => {
            item.rowKey = index + 1
            return item;
        })
        this.setState({
            list: list
        }, () => {
        })
    }

    setLoading = (loading) => {
        this.setState({
            loading
        })
    }

    render() {
        const {list, loading, pagination} = this.state;
        let {scroll, expandable, tableSize, rowKey} = this.props;
        scroll = {x: 820, ...scroll};
        let columnsData = this.filterColumns() || [];
        if(window.innerHeight < 500){
            //scroll.y = undefined
        }
        return (
            <div style={{marginBottom: 10}}>
                <Card hidden={!this.filterSearch().length}>
                    <Form
                        autoComplete={"on"}
                        ref={(node) => {
                            this.getRef(node)
                        }}
                        layout='inline'
                    >
                        {this.renderFormItem()}

                        <Button
                            type='primary'
                            onClick={() => {
                                this.fetchData()
                            }}
                            disabled={loading}
                        >
                            查询
                        </Button>
                    </Form>
                </Card>
                <Card
                    title={this.renderCard2Title()}
                    style={{marginTop: 10}}
                    extra={this.renderCard2Extra()}
                >
                    <Table
                        size={"small"}
                        expandable={expandable}
                        scroll={scroll}
                        rowKey={(record)=> {
                            return rowKey || record.rowKey
                        }}
                        loading={loading}
                        dataSource={list}
                        columns={columnsData}
                        pagination={pagination}
                        onChange={(pagination) => {
                            pagination.showTotal = showTotal;
                            this.setState({
                                pagination: pagination
                            })
                        }}
                    />
                </Card>
            </div>
        )
    }


}

SearchTable.defaultProps = {
    columnIndex: true,
    card2Title: null,
    columns: null,
    pagination: null,
    getList: null,
    scroll: null,
    card2Extra: null,
    combineField: null,
    rowKey: null,
    loadedSuccess: () => {},
    loadedFail: () => {},
    loadFinal: () => {},
    loadStart: () => {},

    //tableSize: 'small'
}

SearchTable.propTypes = {
    columnIndex: PropTypes.bool,
    card2Title: PropTypes.any,
    columns: PropTypes.array,
    pagination: PropTypes.any,
    getList: PropTypes.func,
    scroll: PropTypes.object,
    card2Extra: PropTypes.any,
    combineField: PropTypes.any,
    rowKey: PropTypes.any,
    loadedSuccess: PropTypes.any,
    loadedFail: PropTypes.any,
    loadFinal:PropTypes.any,
    loadStart:PropTypes.any,
    //tableSize: 'small' | 'middle' | 'large'

}

export default SearchTable;
