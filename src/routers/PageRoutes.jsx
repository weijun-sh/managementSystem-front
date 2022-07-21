import Pages from './pages'
import {
    Route,
    Navigate,
    Routes
} from "react-router-dom";
import NotFound from '@/pages/errors/404.jsx'
function PageRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Navigate replace to="/transition/summary"/>}/>

            <Route element={<Pages.TradeChain/>} path='/transition/chain' exact/>
            <Route element={<Pages.TradeHistory/>} path='/transition/history'/>
            <Route element={<Pages.TradeSummary/>} path='/transition/summary' exact/>
            <Route element={<Pages.TradeUnascertained/>} path='/transition/unascertained' exact/>
            <Route element={<Pages.Review/>} path='/transition/review' exact/>

            <Route path="/404" element={<NotFound/>}/>
            <Route path="*" element={<Navigate replace to="/404"/>}/>
        </Routes>

    )

}

export default PageRoutes;
