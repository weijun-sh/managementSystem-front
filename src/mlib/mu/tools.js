

import {message} from 'antd'
export function copy(copy_file){
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', copy_file);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        message.success("复制成功！",1).then(() => {});
    }
    document.body.removeChild(input);
}

export default {
    copy
}