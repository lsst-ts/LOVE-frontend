import React, { PureComponent } from 'react'
import styles from './RawTelemetryTable.module.css';
import StatusText from '../StatusText/StatusText';
import EditIcon from '../EditIcon/EditIcon';

export default class RawTelemetryTable extends PureComponent {
    constructor() {
        super();

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
        }

        let healthFunctions = {
            'timestamp': '//asdasdadsa',
            'altitude_decel': '//dsasdssa\nreturn 1;',
            'altitude_accel': 'return 2;',
            'altitude_maxspeed': 'return 3;',
        }


        this.state = {
            filters: filters,
            healthFunctions: healthFunctions,
        };

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
                    for(let n=0;n<10;n++)
                    newData.push({//change to fixed length
                        'component': componentName,
                        'stream': telemetryStreamName,
                        'timestamp': streamTimestamp,
                        'name': parameter['name'],
                        'param_name': parameter['param_name'],
                        'data_type': parameter['data_type'],
                        'value': parameter['value'],
                        'units': parameter['units'],
                        'health_status': (value) => 'Not defined',
                    })
                }
            }
        }
        return newData;
    }

    testFilter = (row) => {
        let values = Object.keys(row).map((rowKey) => {
            if (this.state.filters[rowKey].type === 'regexp')
                return this.state.filters[rowKey].value.test(row[rowKey]);
            if (this.state.filters[rowKey].type === 'health') {
                let healthStatus = this.getHealthText(this.getHealthStatusCode(row.param_name, row.value));
                return this.state.filters[rowKey].value.test(healthStatus);
            }
            return true;
        });
        let value = values.reduce((a, b) => a && b, true);
        return value;
    }

    changeFilter = (column) => {
        return (event) => {
            let filters = { ...this.state.filters };
            filters[column].value = new RegExp(event.target.value, 'i');
            this.setState({
                filters: filters
            })
        }
    }

    getHealthStatusCode = (param_name, value) => {
        let statusCode = 0;
        if (this.state.healthFunctions[param_name]) {
            try {
                // eslint-disable-next-line
                let user_func = new Function("value", this.state.healthFunctions[param_name]);
                statusCode = user_func(value);
            } catch (err) {
                statusCode = -1;
                console.log('Error parsing custom function');
            }
        }
        return statusCode;
    }

    getHealthText = (statusCode) => {
        if (statusCode === 0)
            return 'Undefined';
        if (statusCode === 1)
            return 'OK';
        if (statusCode === 2)
            return 'Warning';
        if (statusCode === 3)
            return 'Alert';
        return 'Invalid';
    }

    render() {
        let data = this.props.data;
        if(Object.keys(this.props.telemetry.parameters).length>0){
            data["scheduler"][this.props.telemetry.name] = {
                'timestamp': this.props.telemetry.receptionTimestamp,
                'nParams': Object.keys(this.props.telemetry.parameters).length,
                'parameters': Object.entries(this.props.telemetry.parameters).map( parameter=>{
                    const [name, value] = parameter;
                    return {
                        'name': name +'????',
                        'param_name': name,
                        'data_type': 'double?',
                        'value': value,
                        'units': 'm/s??'
                    }
                })
            }

        }
        data = this.convertData(data);

        return (
            <table className={styles.rawTelemetryTable}>
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
                        <td><input type="text" onChange={this.changeFilter('health_status')} /></td>
                    </tr>
                    {
                        data.map((row) => {
                            // console.log('this.getHealthStatusCode', row.param_name, row.value, this.getHealthStatusCode(row.param_name, row.value))
                            if (this.testFilter(row)) {
                                return (
                                    <tr key={row.param_name+Math.random()}>
                                        <td>{row.component}</td>
                                        <td>{row.stream}</td>
                                        <td>{row.timestamp}</td>
                                        <td>{row.name}</td>
                                        <td>{row.param_name}</td>
                                        <td>{row.data_type}</td>
                                        <td>{row.value}</td>
                                        <td>{row.units}</td>
                                        <td className={styles.healthStatusCell}>
                                            <div className={styles.healthStatusWrapper}>
                                                <div className={styles.statusTextWrapper}>
                                                <StatusText statusCode={this.getHealthStatusCode(row.param_name, row.value)} getHealthText={this.getHealthText}>
                                                </StatusText>
                                                </div>
                                                <div className={styles.editIconWrapper}>
                                                    <EditIcon active></EditIcon>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                            return null;
                        })
                    }
                </tbody>
            </table>
        );
    }
}
