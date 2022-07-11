import { observable, action } from "mobx";
class TradeStore {
    @observable detailRecord = null;
    @action setDetailRecord = (record) => {
        this.detailRecord = record;
    }
}
export default TradeStore;