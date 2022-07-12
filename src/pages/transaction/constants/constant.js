export const SwapStatus = {
    0: 'TxNotStable',
    1: 'TxVerifyFailed',
    3: 'TxWithWrongValue',
    5: 'TxNotSwapped',
    7: 'TxProcessed',
    8: 'MatchTxEmpty',
    9: 'MatchTxNotStable',
    10: 'MatchTxStable',
    12: 'TxWithBigValue',
    14: 'MatchTxFailed',
    15: 'SwapInBlacklist',
    16: 'ManualMakeFail',
    19: 'TxWithWrongPath',
    20: 'MissTokenConfig',
    21: 'NoUnderlyingToken',
    255: 'KeepStatus',
    256: 'Reswapping',
}

export const ChainID = {
    1: "ETH Mainnet",
    5: "GOERLI Mainnet",
    10: "OPTIMISTIC Mainnet",
    25: "CRONOS Mainnet",
    40: "TLOS Mainnet",
    56: "BSC Mainnet",
    57: "SYSCOIN Mainnet",
    66: "OKT Mainnet",
    86: "gatechain Mainnet",
    100: "XDAI Mainnet",
    106: "VELAS Mainnet",
    122: "FUSE Mainnet",
    128: "HECO Mainnet",
    137: "MATIC Mainnet",
    199: "BTT Mainnet",
    250: "FTM Mainnet",
    321: "KCS Mainnet",
    336: "SHI Mainnet",
    592: "ASTAR Mainnet",
    1024: "clover Mainnet",
    1030: "conflux Mainnet",
    1088: "METIS Mainnet",
    1284: "MOONBEAM Mainnet",
    1285: "MOONRIVER Mainnet",
    4689: "IOTEX Mainnet",
    42161: "ARB Mainnet",
    42220: "CELO Mainnet",
    42262: "OASIS Mainnet",
    43114: "AVAX Mainnet",
    32659: "FSN Mainnet",
    1313161554: "AURORA Mainnet",
    1666600000: "HARMONY Mainnet",
    "BLOCK": "BLOCK Mainnet",
    "BOBA": "BOBA Mainnet",
    "BTC": "BTC Mainnet",
    "CMP": "CMP Mainnet",
    "COLX": "COLX Mainnet",
    "DOGE": "DOGE Mainnet",
    "JEWEL": "JEWEL Mainnet",
    "LTC": "LTC Mainnet",
    "NEBULAS": "NEBULAS Mainnet",
    "REI": "REI Mainnet",
    "RONIN": "RONIN Mainnet",
    "RSK": "RSK Mainnet",
    "TERRA": "TERRA Mainnet",
    "XRP": "XRP Mainnet",
    "2020": "RONIN Mainnet"
}

export const SWAPIN_TYPE = 'swapin';
export const SWAPOUT_TYPE = 'swapout';
export const Router_TYPE = 'Router';

export const SummaryStatus = {
    8: "Sign(8)",
    9: "Routing(9)",
    12: "Big Amount(12)",
    14: "Error(14)",
    17: "ToContract(17)"
}

export const SummarySuccessStatus = {
    0: "Confirm(0)",
    10: "Success(10)",
}

export const SummaryAllStatus = {...SummaryStatus, ...SummarySuccessStatus}

export const SummaryBridgeList = [
    {
        bridge: 'BTC2BSC',
        org: '1 BTC2BSC'
    }, {
        bridge: 'ETH2BSC',
        org: '2 ETH2BSC'
    }, {
        bridge: 'FSN2BSC',
        org: '3 FSN2BSC'
    }, {
        bridge: 'ETH2FSN',
        org: '4 ETH2FSN'
    }, {
        bridge: 'ETH2Fantom',
        org: '5 ETH2Fantom'
    }, {
        bridge: 'FSN2Fantom',
        org: '6 FSN2Fantom'
    }, {
        bridge: 'FSN2ETH',
        org: '7 FSN2ETH'
    }, {
        bridge: 'BTC2ETH',
        org: '8 BTC2ETH'
    }, {
        bridge: 'LTC2FSN',
        org: '9 LTC2FSN'
    }, {
        bridge: 'LTC2ETH',
        org: '10 LTC2ETH'
    }, {
        bridge: 'LTC2BSC',
        org: '11 LTC2BSC'
    }, {
        bridge: 'LTC2Fantom',
        org: '12 LTC2Fantom'
    }, {
        bridge: 'BLOCK2ETH',
        org: '13 BLOCK2ETH'
    }, {
        bridge: 'ETH2HT',
        org: '14 ETH2HT'
    }, {
        bridge: 'FSN2HT',
        org: '15 FSN2HT'
    }, {
        bridge: 'BTC2HT',
        org: '16 BTC2HT'
    }, {
        bridge: 'BSC2HT',
        org: '17 BSC2HT'
    }, {
        bridge: 'Fantom2ETH',
        org: '18 Fantom2ETH'
    }, {
        bridge: 'foreignETH2Fantom',
        org: '19 foreignETH2Fantom'
    }, {
        bridge: 'HT2BSC',
        org: '20 HT2BSC'
    }, {
        bridge: 'foreignETH2BSC',
        org: '21 foreignETH2BSC'
    }, {
        bridge: 'FSN2Matic',
        org: '22 FSN2Matic',
    }, {
        bridge: 'FSN2XDAI',
        org: '23 FSN2XDAI',
    }, {
        bridge: 'USDT2Fantom',
        org: '24 USDT2Fantom',
    }, {
        bridge: 'ETH2XDAI',
        org: '25 ETH2XDAI',
    }, {
        bridge: 'ETH2MATIC',
        org: '26 ETH2MATIC',
    }, {
        bridge: 'ETH2AVAX',
        org: '27 ETH2AVAX',
    }, {
        bridge: 'FSN2AVAX',
        org: '28 FSN2AVAX',
    }, {
        bridge: 'BLOCK2AVAX',
        org: '29 BLOCK2AVAX',
    }, {
        bridge: 'BSC2AVAX',
        org: '30 BSC2AVAX',
    }, {
        bridge: 'BSC2Matic',
        org: '31 BSC2Matic',
    }, {
        bridge: 'BSC2ETH',
        org: '32 BSC2ETH',
    }, {
        bridge: 'BSC2Fantom',
        org: '33 BSC2Fantom'
    }, {
        bridge: 'ETH2OKEX',
        org: '35 ETH2OKEX'
    }, {
        bridge: 'Harmony2Matic',
        org: '36 Harmony2Matic'
    }, {
        bridge: 'BTC2Harmony',
        org: '37 BTC2Harmony'
    }, {
        bridge: 'COLX2BSC',
        org: '38 COLX2BSC'
    }, {
        bridge: 'Fantom2BSC',
        org: '39 Fantom2BSC',
    }, {
        bridge: 'COLX2ETH',
        org: '40 COLX2ETH'
    }, {
        bridge: 'HT2Matic',
        org: '41 HT2Matic'
    }, {
        bridge: 'ETH2Goerli',
        org: '42 ETH2Goerli',
    }, {
        bridge: 'Matic2BSC',
        org: '43 Matic2BSC',
    }, {
        bridge: 'Matic2AVAX',
        org: '44 Matic2AVAX',
    }, {
        bridge: 'BSC2KCS',
        org: '45 BSC2KCS',
    }, {
        bridge: 'Matic2ETH',
        org: '46 Matic2ETH',
    }, {
        bridge: 'ETH2KCS',
        org: '47 ETH2KCS',
    }, {
        bridge: 'BSC2Harmony',
        org: '48 BSC2Harmony',
    }, {
        bridge: 'BSC2OKT',
        org: '49 BSC2OKT',
    }, {
        bridge: 'Matic2OEC',
        org: '50 Matic2OEC',
    }, {
        bridge: 'BLOCK2Matic',
        org: '51 BLOCK2Matic',
    }, {
        bridge: 'BLOCK2BSC',
        org: '52 BLOCK2BSC',
    }, {
        bridge: 'Matic2Harmony',
        org: '54 Matic2Harmony',
    }, {
        bridge: 'ETH2MOON',
        org: '55 ETH2MOON',
    }, {
        bridge: 'BSC2MOON',
        org: '56 BSC2MOON'
    }, {
        bridge: 'Matic2Fantom',
        org: '57 Matic2Fantom'
    }, {
        bridge: 'ETH2ARB',
        org: '58 ETH2ARB'
    }, {
        bridge: 'Arbitrum2ETH',
        org: '59 Arbitrum2ETH',
    }, {
        bridge: 'BSC2Arbitrum',
        org: '60 BSC2Arbitrum',
    }, {
        bridge: 'Matic2MOON',
        org: '61 Matic2MOON',
    }, {
        bridge: 'BSC2IOTEX',
        org: '62 BSC2IOTEX',
    }, {
        bridge: 'ETH2SHI',
        org: '63 ETH2SHI',
    }, {
        bridge: 'BSC2SHI',
        org: '64 BSC2SHI',
    }, {
        bridge: 'MOON2ETH',
        org: '65 MOON2ETH',
    }, {
        bridge: 'BSC2CELO',
        org: '66 BSC2CELO',
    }, {
        bridge: 'AVAX2Fantom',
        org: '67 AVAX2Fantom',
    }, {
        bridge: 'ETH2Harmony',
        org: '68 ETH2Harmony',
    }, {
        bridge: 'HT2Fantom',
        org: '69 HT2Fantom',
    }, {
        bridge: 'ARB2MOON',
        org: '70 ARB2MOON',
    }, {
        bridge: 'AVAX2BSC',
        org: '71 AVAX2BSC',
    }, {
        bridge: 'MOON2BSC',
        org: '72 MOON2BSC',
    }, {
        bridge: 'ARB2Matic',
        org: '73 ARB2Matic',
    }, {
        bridge: 'ETH2TLOS',
        org: '74 ETH2TLOS',
    }, {
        bridge: 'CELO2BSC',
        org: '75 CELO2BSC',
    }, {
        bridge: 'TERRA2Fantom',
        org: '76 TERRA2Fantom',
    }, {
        bridge: 'MOON2SHI',
        org: '77 MOON2SHI',
    }, {
        bridge: 'MATIC2HT',
        org: '78 MATIC2HT',
    }, {
        bridge: 'ETH2IOTEX',
        org: '79 ETH2IOTEX',
    }, {
        bridge: 'Harmony2BSC',
        org: '80 Harmony2BSC',
    }, {
        bridge: 'ETH2MOONBEAM',
        org: '81 ETH2MOONBEAM',
    }, {
        bridge: 'BSC2MOONBEAM',
        org: '82 BSC2MOONBEAM',
    }, {
        bridge: 'ETH2BOBA',
        org: '83 ETH2BOBA',
    }, {
        bridge: 'SHI2BSC',
        org: '84 SHI2BSC',
    }, {
        bridge: 'Matic2MOONBEAM',
        org: '85 Matic2MOONBEAM',
    }, {
        bridge: 'AVAX2MOONBEAM',
        org: '86 AVAX2MOONBEAM',
    }, {
        bridge: 'ETH2astar',
        org: '87 ETH2astar',
    }, {
        bridge: 'BSC2astar',
        org: '88 BSC2astar',
    }, {
        bridge: 'ETH2ROSE',
        org: '89 ETH2ROSE',
    }, {
        bridge: 'BSC2ROSE',
        org: '90 BSC2ROSE',
    }, {
        bridge: 'ETH2VELAS',
        org: '90 ETH2VELAS',
    }, {
        bridge: 'Matic2Xdai',
        org: '91 Matic2Xdai',
    }, {
        bridge: 'IOTEX2BSC',
        org: '92 IOTEX2BSC',
    }, {
        bridge: 'XRP2AVAX',
        org: '93 XRP2AVAX',
    }, {
        bridge: 'ETH2CLV',
        org: '94 ETH2CLV',
    }, {
        bridge: 'ETH2MIKO',
        org: '95 ETH2MIKO',
    }, {
        bridge: 'ETH2CONFLUX',
        org: '96 ETH2CONFLUX',
    }, {
        bridge: 'KCC2CONFLUX',
        org: '97 KCC2CONFLUX',
    }, {
        bridge: 'ETH2OPTIMISM',
        org: '98 ETH2OPTIMISM',
    }, {
        bridge: 'ETH2RSK',
        org: '99 ETH2RSK',
    }, {
        bridge: 'BSC2RSK',
        org: '100 BSC2RSK',
    }, {
        bridge: 'JEWEL2Harmony',
        org: '101 JEWEL2Harmony',
    }, {
        bridge: 'BSC2CLV',
        org: '102 BSC2CLV',
    }, {
        bridge: 'RONIN2BSC',
        org: '103 RONIN2BSC',
    }, {
        bridge: 'TERRA2ETH',
        org: '104 TERRA2ETH',
    }, {
        bridge: 'ETH2EVMOS',
        org: '106 ETH2EVMOS',
    }, {
        bridge: 'ETH2DOGE',
        org: '107 ETH2DOGE',
    }, {
        bridge: 'ETH2ETC',
        org: '108 ETH2ETC',
    }, {
        bridge: 'ETH2CMP',
        org: '109 ETH2CMP',
    }, {
        bridge: 'ETH2CELO',
        org: '110 ETH2CELO',
    }
];


export const SummaryRouterList = [
    {
        bridge: 'Router'
    }, {
        bridge: 'Router-Nevm'
    },
]

export const SummaryList = [
    ...SummaryRouterList,
    ...SummaryBridgeList
]

const TradeConst = {
    SwapStatus,
    ChainID,
    SummaryStatus,
    SummarySuccessStatus,
    SummaryAllStatus,
    SummaryList,
    SummaryRouterList
}

export default TradeConst;
