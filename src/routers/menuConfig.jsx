import {ContainerOutlined} from '@ant-design/icons'

function menuConfig() {
    return [
        {
            name: '',
            key: '/transition',
            label: '跨链交易',
            icon: <ContainerOutlined/>,
            children: [
                {
                    key: '/transition/summary',
                    label: '总览',
                    icon: ''
                },
                {
                    key: '/transition/history',
                    label: '历史记录',
                    icon: '',
                    hidden: true
                },
                {
                    key: '/transition/unascertained',
                    label: '未到账交易',
                    icon: ''
                }, {
                    key: '/transition/chain',
                    label: '交易查询',
                    icon: ''
                },{
                    key: '/transition/review',
                    label: '交易复查',
                    icon: ''
                },
            ]
        }

    ]
}

export default menuConfig;
