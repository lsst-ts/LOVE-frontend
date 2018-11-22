import React, { PureComponent } from 'react'

export default class RawTelemetryTable extends PureComponent {
    constructor() {
        super();
        let data = {
            'scheduler': {
                'domeConfig': {
                    'timestamp': '2022/04/25 20:03:10',
                    'nParams': 3,
                    'parameters': [
                        {
                            'name': 'Altitude max speed',
                            'param_name': 'altitude_maxspeed',
                            'data_type': 'double',
                            'value': 1,
                            'units': 'm/s'
                        },
                        {
                            'name': 'Altitude acceleration',
                            'param_name': 'altitude_accel',
                            'data_type': 'double',
                            'value': 2,
                            'units': 'm/s²'
                        },
                        {
                            'name': 'Altitude deceleration',
                            'param_name': 'altitude_decel',
                            'data_type': 'double',
                            'value': 3,
                            'units': 'm/s²'
                        },
                    ]
                },
                'cloud': {
                    'timestamp': '2022/04/25 20:04:10',
                    'nParams': 2,
                    'parameters': [
                        {
                            'name': 'timestamp',
                            'param_name': 'timestamp',
                            'data_type': 'timestamp',
                            'value': '2022/04/25 10:04:10',
                            'units': 'YYYY/MM/DD HH:MM:SS'
                        },
                        {
                            'name': 'cloud',
                            'param_name': 'cloud',
                            'data_type': 'double',
                            'value': 2.0,
                            'units': '?'
                        },
                    ]
                },
            }
        }

        let filters = {
            'component': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            'stream': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            'timestamp': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            'name': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            'param_name': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            'data_type': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            'value': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            'units': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
            // 'health_status': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
        }

        let parsedData = this.convertData(data);

        this.state = {
            data: parsedData,
            filters: filters,
        };

        console.log(parsedData);
    }

    convertData = (data) => {
        let newData = [];
        for (let i = 0; i < Object.keys(data).length; i++) {
            let component = data[Object.keys(data)[i]];
            let componentName = Object.keys(data)[i];
            for (let j = 0; j < Object.keys(component).length; j++) {
                let telemetryStream = component[Object.keys(component)[j]];
                let telemetryStreamName = Object.keys(component)[j];
                let streamTimestamp = telemetryStream['timestamp'];
                let parameters = telemetryStream['parameters'];
                for (let k = 0; k < parameters.length; k++) {
                    let parameter = parameters[k];
                    newData.push({//change to fixed length
                        'component': componentName,
                        'stream': telemetryStreamName,
                        'timestamp': streamTimestamp,
                        'name': parameter['name'],
                        'param_name': parameter['param_name'],
                        'data_type': parameter['data_type'],
                        'value': parameter['value'],
                        'units': parameter['units'],
                    })
                }
            }
        }
        return newData;
    }

    testFilter = (row) => {
        let values = Object.keys(row).map((rowKey) => {
            console.log(this.state.filters[rowKey].value);
            console.log(row[rowKey]);
            console.log(this.state.filters[rowKey].value.test(row[rowKey]));
            return this.state.filters[rowKey].value.test(row[rowKey]);
        });
        let value = values.reduce((a, b) => a && b, true);
        console.log(values)
        return value;
    }

    changeFilter = (column) => {
        return (event) => {
            console.log(event.target.value)
            let filters = {...this.state.filters};
            filters[column].value = new RegExp(event.target.value);
            this.setState({
                filters: filters
            })
        }
    }

    render() {
        const { data } = this.state;
        return (
            <>
                <table>
                    <tbody>
                        <tr>
                            <th>Component</th>
                            <th>Stream</th>
                            <th>Timestamp</th>
                            <th>Name</th>
                            <th>Parameter</th>
                            <th>Data type</th>
                            <th>Value</th>
                            <th>Units</th>
                            <th>Health status</th>
                        </tr>
                        <tr>
                            <td><input type="text" onChange={this.changeFilter('component')} /></td>
                            <td><input type="text" onChange={this.changeFilter('stream')} /></td>
                            <td><input type="text" onChange={this.changeFilter('timestamp')} /></td>
                            <td><input type="text" onChange={this.changeFilter('name')} /></td>
                            <td><input type="text" onChange={this.changeFilter('param_name')} /></td>
                            <td><input type="text" onChange={this.changeFilter('data_type')} /></td>
                            <td><input type="text" onChange={this.changeFilter('value')} /></td>
                            <td><input type="text" onChange={this.changeFilter('units')} /></td>
                        </tr>
                        {
                            data.map((row) => {
                                if (this.testFilter(row))
                                    return (
                                        <tr key={row.param_name}>
                                            <td>{row.component}</td>
                                            <td>{row.stream}</td>
                                            <td>{row.timestamp}</td>
                                            <td>{row.name}</td>
                                            <td>{row.param_name}</td>
                                            <td>{row.data_type}</td>
                                            <td>{row.value}</td>
                                            <td>{row.units}</td>
                                            <td>-</td>
                                        </tr>
                                    )
                            })
                        }
                        {/* {
                        Object.keys(data).map((componentName) => {
                            let component = data[componentName];
                            let componentParams = Object.keys(component).map((streamName) => {
                                return component[streamName].nParams;
                            }).reduce((a, b) => a + b, 0);
                            console.log('componentParams', componentParams);
                            return (
                                <tr>
                                <td rowSpan={2}>{componentName}</td>
                                {
                                    Object.keys(component).map((streamName) => {
                                        let stream = component[streamName];
                                        console.log('stream', stream);
                                        return (
                                            <>
                                            <td rowSpan={2}>{streamName}</td>
                                            {
                                                stream.parameters.map((param) => {
                                                    console.log('param', param)
                                                    return (
                                                        <>
                                                        <td>{stream.timestamp}</td>
                                                        <td>{param.name}</td>
                                                        <td>{param.param_name}</td>
                                                        <td>{param.data_type}</td>
                                                        <td>{param.value}</td>
                                                        <td>{param.units}</td>
                                                        </>
                                                        )
                                                    })
                                                }
                                                </>
                                                )
                                            })
                                        }
                                        </tr>
                                        )
                                    })
                                } */}
                    </tbody>
                </table>
                <span>
                    {JSON.stringify(this.state)}
                </span>
            </>
        );
    }
}
