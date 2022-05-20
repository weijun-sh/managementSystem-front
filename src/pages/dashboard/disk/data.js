let response = {
    code: 0,
    msg: 'success',
    data: {
        time: 'Thu, 19 May 2022 09:00:01 +0800',
        interval: 'ps. update every 60 minutes',
        title: 'DISK CAPACITY OF FULLNODE',
        list: [{
            node: 'node0',
            fs: [{
                path: '/dev/vda1',
                blocks: 95,
                used: 51,
                available: 44,
                percent: 55,
                mountedOn: '/' 
            },{
                path: '/dev/vdb',
                blocks: 1870,
                used: 1416,
                available: 368,
                percent: 80,
                mountedOn: '/opt' 
            }, ]
        }, {
            node: 'node6',
            fs: [{
                path: '/dev/vda1',
                blocks: 99,
                used: 51,
                available: 44,
                percent: 55,
                mountedOn: '/' 
            },{
                path: '/dev/vdb1',
                blocks: 1,
                used: 1416,
                available: 368,
                percent: 88,
                mountedOn: '/mnt' 
            }, ]
        },, {
            node: 'node7',
            fs: [{
                path: '/dev/vda1',
                blocks: 77,
                used: 44,
                available: 33,
                percent: 60,
                mountedOn: '/' 
            },{
                path: '/dev/vdb1',
                blocks: 1,
                used: 1416,
                available: 368,
                percent: 88,
                mountedOn: '/mnt' 
            }, ]
        },, {
            node: 'node8',
            fs: [{
                path: '/dev/vda1',
                blocks: 99,
                used: 51,
                available: 44,
                percent: 55,
                mountedOn: '/' 
            },{
                path: '/dev/vdb1',
                blocks: 1,
                used: 1416,
                available: 368,
                percent: 88,
                mountedOn: '/mnt' 
            }, ]
        },]
    }
}

response = response.data;

export default response;