import React from 'react';
import Prolayout from '@ant-design/pro-layout';


import DocumentTitle from 'react-document-title';
const BasicLayout = function (props) {

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )

    return (
        <DocumentTitle
            onPageChange={(...args) => {
                console.log(" ==> ", args)
            }}
            title={"Multichain 管理系统"}
        >

            <div>{props.children}</div>
        </DocumentTitle>

    )
}




export default BasicLayout;