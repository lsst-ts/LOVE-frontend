Example 1:

``` jsx
let telemetries =  {
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

<div style={{'width': '100%', 'overflowX': 'scroll'}}>
<HealthStatusSummary telemetries={telemetries}/>
</div>
```