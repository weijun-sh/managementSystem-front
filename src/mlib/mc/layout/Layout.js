import {Button, Layout} from 'antd';
import './index.less'
import PropTypes from "prop-types";
const {Header, Content, Footer} = Layout;

function PageLayout(props){
    const {children, className, ...others } = props;
    return (
        <Layout className={`page-layout ${className}`} {...others}>
            {children}
        </Layout>
    )
}

export function PageHeader(props){
    const {children,className, getRight, getLeft, ...others } = props;
    return (
        <Header
            className={`page-header ${className}`}
            {...others}
        >
            <div className={"left"}>
                {getLeft && getLeft()}
            </div>

            {children}
            <div className={"right"}>
                {getRight && getRight()}
            </div>

        </Header>
    )
}

PageHeader.propTypes = {
    getRight: PropTypes.func,
    getLeft: PropTypes.func,
    className: PropTypes.string,
}

export function PageFooter(props){
    const {children,className, ...others } = props;
    return (
        <Footer className={`page-footer ${className}`} {...others}>
            {children}
        </Footer>
    )
}

PageHeader.propTypes = {
    className: PropTypes.string,
}

export function PageContent(props){
    const {children, className,...others } = props;
    return (
        <Content className={`page-content ${className}`} {...others}>
            {children}
        </Content>
    )
}



export default PageLayout;
