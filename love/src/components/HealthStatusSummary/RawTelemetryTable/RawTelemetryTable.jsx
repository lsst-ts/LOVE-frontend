import React, { PureComponent } from 'react'
import styles from './RawTelemetryTable.module.css';
import StatusText from '../StatusText/StatusText';
import EditIcon from '../../icons/EditIcon/EditIcon';

export default class RawTelemetryTable extends PureComponent {
    constructor() {
        super();

        let expandedRows = {
            'altitude_maxspeed0': true,
        };

        this.state = {
            expandedRows: expandedRows,
        };

        window.OK = 1;
        window.WARNING = 2;
        window.ALERT = 3;

    }

    toggleRow = (rowId) => {
        let expandedRows = this.state.expandedRows;
        if (expandedRows[rowId])
            expandedRows[rowId] = false;
        else {
            expandedRows = {};
            expandedRows[rowId] = true;
        }
        this.setState({
            expandedRows: { ...expandedRows },
        })
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
                    for (let n = 0; n < 10; n++)
                        newData.push({//change to fixed length
                            'component': componentName,
                            'stream': telemetryStreamName,
                            'timestamp': streamTimestamp,
                            'name': parameter['name'],
                            'param_name': parameter['param_name'] + n,
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
            if (this.props.filters[rowKey].type === 'regexp')
                return this.props.filters[rowKey].value.test(row[rowKey]);
            if (this.props.filters[rowKey].type === 'health') {
                let healthStatus = this.getHealthText(this.getHealthStatusCode(row.param_name, row.value));
                return this.props.filters[rowKey].value.test(healthStatus);
            }
            return true;
        });
        let value = values.reduce((a, b) => a && b, true);
        return value;
    }

    changeFilter = (column) => {
        return (event) => {
            let filters = { ...this.props.filters };
            filters[column].value = new RegExp(event.target.value, 'i');
            this.props.setFilters(filters);
        }
    }

    getHealthStatusCode = (param_name, value) => {
        let statusCode = 0;
        if (this.props.healthFunctions[param_name]) {
            try {
                // eslint-disable-next-line
                let user_func = new Function("value", this.props.healthFunctions[param_name]);
                statusCode = user_func(value);
            } catch (err) {
                statusCode = -1;
                console.log('Error parsing custom function');
                console.log(err);
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

    setHealthFunction = (param_name) => {
        console.log(param_name + '-healthFuncion')
        let healthFunctions = this.props.healthFunctions;
        healthFunctions[param_name] = document.getElementById(param_name + '-healthFunction').value;
        this.props.setHealthFunctions(healthFunctions);
        localStorage.setItem('healthFunctions', JSON.stringify(healthFunctions));
    }

    displayHealthFunction = (param_name, functionType) => {
        let textArea = document.getElementById(param_name + '-healthFunction');
        let text = '';
        if (functionType === 'text')
            text = 'if(value === <targetValue>)\n    return ALERT;';
        if (functionType === 'range')
            text = 'if(value > <targetValue1>)\n    return WARNING;\nif(value > <targetValue1>)\n    return ALERT;\n return OK\n';
        textArea.value = text;
        return 0;
    }

    render() {
        let data = this.props.data;
        if (Object.keys(this.props.telemetry.parameters).length > 0) {
            data["scheduler"][this.props.telemetry.name] = {
                'timestamp': this.props.telemetry.receptionTimestamp,
                'nParams': Object.keys(this.props.telemetry.parameters).length,
                'parameters': Object.entries(this.props.telemetry.parameters).map(parameter => {
                    const [name, value] = parameter;
                    return {
                        'name': name + '????',
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
                                    <React.Fragment key={row.param_name}>
                                        <tr className={styles.dataRow} onClick={() => this.toggleRow(row.param_name)} key={row.param_name + '-row'}>
                                            <td>{row.component}</td>
                                            <td>{row.stream}</td>
                                            <td>{row.timestamp}</td>
                                            <td>{row.name}</td>
                                            <td>{row.param_name}</td>
                                            <td>{row.data_type}</td>
                                            <td className={styles.valueCell}>{JSON.stringify(row.value)}</td>
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
                                        {
                                            (this.state.expandedRows[row.param_name]) ?
                                                <tr key={row.param_name + '-expanded'} className={styles.expandedRow}>
                                                    <td colSpan={3}>
                                                    </td>
                                                    <td colSpan={2}>
                                                    </td>
                                                    <td colSpan={3}>
                                                        <div>
                                                            <p>
                                                                {'function ( value ) {'}
                                                            </p>
                                                            <textarea id={row.param_name + '-healthFunction'} defaultValue={this.props.healthFunctions[row.param_name]}>
                                                            </textarea>
                                                            <p>
                                                                {'}'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td colSpan={1}>
                                                        <div>
                                                            <div>
                                                                <ul>
                                                                    <li>
                                                                        <span onClick={() => this.displayHealthFunction(row.param_name, 'range')}>Range</span>
                                                                    </li>
                                                                    <li>
                                                                        <span onClick={() => this.displayHealthFunction(row.param_name, 'text')}>Text value</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <span>{JSON.stringify(row.value)}</span>
                                                            </div>
                                                            <button onClick={() => this.setHealthFunction(row.param_name)}>Set</button>
                                                        </div>
                                                    </td>
                                                </tr> :
                                                null
                                        }
                                    </React.Fragment>
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
