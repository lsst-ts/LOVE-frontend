Example 1:

``` jsx
const telemetries =  {
    interestedProposal: {
        parameters: {},
        receptionTimeStamp: "2018/11/23 21:12:24."
    },
    bulkCloud: {
        parameters: {
            bulkCloud: 0.6713680575252166,
            timestamp: 0.5309269973966433
          },
          receptionTimeStamp: "2018/11/25 12:21:12"
        }
};
const healthFunctions = {
    'scheduler-bulkCloud-bulkCloud': 'return WARNING;'
};


const onSetSelection = (rows,ev) =>{
    alert(rows);
}

const setHealthFunctions = (healthFunctions) => {
    alert(healthFunctions)
}

<div style={{'width': '100%', 'overflowX': 'scroll', 'height':'400px'}}>
<RawTelemetryTable 
    telemetries={telemetries} 
    healthFunctions={healthFunctions} 
    setHealthFunctions={setHealthFunctions}
    displaySelectionColumn 
    checkedFilterColumn='units'
    onSetSelection={onSetSelection}></RawTelemetryTable>
</div>
```