/*
import asyncComponent from "./AsyncComponent";

const Chain = asyncComponent(() => import('@/pages/transaction/chain'))
const History = asyncComponent(() => import('@/pages/transaction/history'))
const Summary = asyncComponent(() => import('@/pages/transaction/summary'))
const Unascertained = asyncComponent(() => import('@/pages/transaction/unascertained'))
const Detail = asyncComponent(() => import('@/pages/transaction/detail'))

const Pages = {
    TradeChain: Chain,
    TradeHistory: History,
    TradeSummary: Summary,
    TradeUnascertained: Unascertained,
    TradeDetail: Detail
}

export default Pages;
*/

import Chain from '@/pages/transaction/chain';
import History from '@/pages/transaction/history';
import Summary from '@/pages/transaction/summary';
import Unascertained from '@/pages/transaction/unascertained';


const Pages = {
    TradeChain: Chain,
    TradeHistory: History,
    TradeSummary: Summary,
    TradeUnascertained: Unascertained,
}

export default Pages;

