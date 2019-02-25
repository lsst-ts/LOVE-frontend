Example 1:

``` jsx
const telemetries = {
        scheduler: {
          interestedProposal: {
            parameters: {},
            receptionTimeStamp: '2018/11/23 21:12:24.',
          },
          bulkCloud: {
            parameters: {
              bulkCloud: {
                value: 0.6713680575252166,
                dataType: 'Float',
              },
              timestamp: {
                value: 0.5309269973966433,
                dataType: 'Float',
              },
            },
            receptionTimeStamp: '2018/11/25 12:21:12',
          },
        },
        ScriptQueue: {
          stream1: {
            parameters: {
              exists: {
                value: 1,
                dataType: 'Boolean',
              },
            },
          },
        },
      };

<div style={{'width': '100%', 'overflowX': 'scroll', 'height':'400px'}}>
<RawTelemetryTable 
    telemetries={telemetries} 
    displaySelectionColumn 
    checkedFilterColumn='units'/>
    
</div>
```