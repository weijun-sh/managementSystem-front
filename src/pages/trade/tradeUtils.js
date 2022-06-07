const SwapStatus = {
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

export function renderStatus(status){
  return SwapStatus[status]
}

export function renderSummaryNum(number, onClick){
  if(!number){
    return number
  }
  if(number > 10){
    return (
      <div 
        onClick={onClick}
        style={{background: '#d44f3f', textAlign: 'center', color: '#fff'}}
      >
        <strong>{number}</strong>
      </div>
    )
  }
  if(number > 0){
    return (
      <div
       onClick={onClick} 
       style={{background: '#d48940', textAlign: 'center', color: '#fff'}}
      >
        <strong>{number}</strong>
      </div>
    )
  }
}

export default {
  renderStatus,
  renderSummaryNum
}

