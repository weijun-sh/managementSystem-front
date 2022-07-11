import Utils from '../../mu';
import PropTypes from "prop-types";
import {CopyOutlined} from "@ant-design/icons/lib/icons";
import './copybutton.less'
function CopyButton(props) {
    const {text, children, style, onTextClick, className, copyText} = props;
    if (children) {
        if (!children || children.length === 0) {
            return ''
        }
        return (
            <span
                className={`copy-button ${className}`}
                style={style}
            >
                <a className={"text"} onClick={onTextClick}>{children}</a>
                <CopyOutlined
                    className={"icon"}
                    onClick={(e) => {
                        Utils.tools.copy(copyText || children);
                        e.stopPropagation();
                    }}
                />
            </span>
        )
    }

    if (!text || text.length === 0) {
        return ''
    }
    return (
        <span
            className={`copy-button ${className}`}
            style={style}
        >
            <a className={"text"} onClick={onTextClick}>{text}</a>
            <CopyOutlined
                className={"icon"}
                onClick={() => {
                    Utils.tools.copy(copyText || text)
                }}
            />
        </span>
    )
}

CopyButton.defaultProps = {
    style: null,
    onTextClick: null,
    text: null,
    className: null,
    copyText: null
}

CopyButton.propTypes = {
    style: PropTypes.object,
    onTextClick: PropTypes.func,
    text: PropTypes.string,
    className: PropTypes.any,
    copyText: PropTypes.any
}

export default CopyButton;
