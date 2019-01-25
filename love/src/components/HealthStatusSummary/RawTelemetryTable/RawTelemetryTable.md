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
let healthFunctions = {
    'scheduler-bulkCloud-bulkCloud': 'return WARNING;',
};

let filters = {
    'component': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'stream': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'timestamp': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'name': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'param_name': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'data_type': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'value': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'units': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'health_status': { 'type': 'health', 'value': (new RegExp('(?:)')) },
};

<div style={{'width': '100%', 'overflowX': 'scroll', 'height':'300px'}}>
<RawTelemetryTable telemetries={telemetries} healthFunctions={healthFunctions} filters={filters} displaySelectionColumn checkedFilterColumn='units'></RawTelemetryTable>
</div>
```