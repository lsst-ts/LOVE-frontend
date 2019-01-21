import React, { PureComponent } from 'react'
import styles from './RawTelemetryTable.module.css';
import StatusText from '../StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import Button from '../Button/Button';
import fakeData from './fakeData';
import ColumnHeader from './ColumnHeader/ColumnHeader';
import TelemetrySelectionTag from './TelemetrySelectionTag/TelemetrySelectionTag';
import PropTypes from 'prop-types';

export default class RawTelemetryTable extends PureComponent {
    static propTypes = {
        /** Display the selection column or not */
        displaySelectionColumn: PropTypes.bool,
        /** Column to use to restrict values when selecting a row, such as limiting only selection of rows with the same units */
        checkedFilterColumn: PropTypes.oneOf(['component', 'stream', 'timestamp', 'name', 'param_name', 'data_type', 'value', 'units']),
    }

    constructor() {
        super();

        let expandedRows = {
            'altitude_maxspeed0': true,
        };
        this.state = {
            expandedRows: expandedRows,
            activeFilterDialog: 'None',
            sortingColumn: 'name',
            sortDirection: 'None',
            selectedRows: [],
        };
        this.defaultCodeText = '// Function should return one of the following global variables:\n// ALERT, WARNING, OK. I.e. \'return OK\'';
        this.healthStatusCodes = {
            0: 'Undefined',
            1: 'OK',
            2: 'Warning',
            3: 'Alert',
            4: 'Invalid',
        }
        this.healthStatusPriorities = {
            3: 5,
            2: 4,
            1: 3,
            4: 2,
            0: 1,
        }
        window.OK = 1;
        window.WARNING = 2;
        window.ALERT = 3;

    }

    clickRow = (rowID) => {
        this.closeFilterDialogs();
    }

    clickGearIcon = (rowID) => {
        this.toggleRow(rowID);
    }

    toggleRow = (rowId) => {
        this.closeFilterDialogs();
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
            let key = [row.component, row.stream, row.param_name].join('-');
            if (this.props.filters[rowKey] !== undefined && this.props.filters[rowKey].type === 'regexp') {
                let regexpFilterResult = this.props.filters[rowKey].value.test(row[rowKey]);
                let checkedFilterResult = true;
                if (this.state.checkedFilter && this.state.checkedFilter[rowKey]) {
                    checkedFilterResult = this.state.checkedFilter[rowKey].test(row[rowKey]);
                }
                return regexpFilterResult && checkedFilterResult;
            }
            if (this.props.filters[rowKey] !== undefined && this.props.filters[rowKey].type === 'health') {
                let healthStatus = this.getHealthText(this.getHealthStatusCode(key, row.value));
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
                statusCode = 4;
                // console.log('Error parsing custom function');
                // console.log(err);
            }
        }
        return statusCode;
    }

    getHealthText = (statusCode) => {
        if (statusCode === undefined)
            statusCode = 0;
        return this.healthStatusCodes[statusCode];
    }

    setHealthFunction = (param_name) => {
        console.log(param_name + '-healthFuncion')
        console.log(this.props.healthFunctions);
        let healthFunctions = this.props.healthFunctions;
        healthFunctions[param_name] = document.getElementById(param_name + '-healthFunction').value;
        this.props.setHealthFunctions(healthFunctions);
        localStorage.setItem('healthFunctions', JSON.stringify(healthFunctions));
        this.toggleRow(param_name);
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

    renderValueAsList = (values) => {
        let elements = values.map((elem, index) => {
            return <li key={index} className={styles.valuesListItem}>
                <span className={styles.valuesListItemValue}>{JSON.stringify(elem)}</span>
            </li>
        });
        return <ol className={styles.valuesList}>
            {elements}
        </ol>;
    }

    columnOnClick = (ev, filterName) => {
        if (this.state.activeFilterDialog === filterName) {
            this.closeFilterDialogs();
            return;
        }
        this.setState({ activeFilterDialog: filterName });
    }

    closeFilterDialogs = () => {
        this.setState({ activeFilterDialog: 'None' });
    }


    changeSortDirection = (direction, column) => {
        /*
            direction can be "ascending" or "descending", otherwise no
            sorting will be applied
            Sorting is applied before filtering
        */
        this.setState({ sortDirection: direction, sortingColumn: column });
    }

    sortData = (a, b) => {

        const column = this.state.sortingColumn;
        if (this.state.sortDirection !== 'ascending' && this.state.sortDirection !== 'descending') {
            return 0;
        }

        let direction = this.state.sortDirection === 'ascending' ? 1 : -1;
        if (column === 'health_status') {
            let aValue = this.healthStatusPriorities[a['healthStatusCode']];
            let bValue = this.healthStatusPriorities[b['healthStatusCode']];
            return (aValue < bValue) ? -direction : direction;
        }
        return (a[column] <= b[column]) ? -direction : direction;
    }

    setCheckedFilterColumn = (column, value) => {
        if (column === undefined || value === undefined) {
            this.setState({
                checkedFilter: undefined
            })
            return;
        }
        let checkedFilter = {};
        checkedFilter[column] = new RegExp(value, 'i');
        this.setState({
            checkedFilter: checkedFilter
        })
    }

    updateSelectedList = (checked, key) => {

        let selectedRows = this.state.selectedRows;
        if (checked)
            selectedRows.push(key);
        else
            selectedRows.splice(selectedRows.indexOf(key), 1);
        if (selectedRows.length === 0)
            this.setCheckedFilterColumn();
        this.setState({
            selectedRows: [... selectedRows]
        })
    }

    onRowSelection = (checked, key, row) => {
        let checkedFilterColumn = this.props.checkedFilterColumn;
        if (row[checkedFilterColumn] !== undefined){
            let value = row[checkedFilterColumn].replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
            this.setCheckedFilterColumn(checkedFilterColumn, value);
        }
        this.updateSelectedList(checked, key)
        //this.props.callback(event.row)
    }

    render() {
        let data = Object.assign({}, fakeData); // load "fake" data as template;
        let telemetryNames = Object.keys(this.props.telemetries); // the raw telemetry as it comes from the manager
        let fake_units = ['unit1', 'unit2', 'unit3', 'unit4'];
        telemetryNames.forEach((telemetryName, telemetryIndex) => {
            // look at one telemetry
            let telemetryData = this.props.telemetries[telemetryName];

            data["scheduler"][telemetryName] = {
                'timestamp': telemetryData.receptionTimestamp,
                'nParams': telemetryData.parameters.length,
                'parameters': Object.entries(telemetryData.parameters).map(parameter => {
                    // look at one parameter 
                    const [name, value, data_type, units] = parameter;

                    return {
                        'name': name,
                        'param_name': name,
                        'data_type': data_type ? data_type : '?',
                        'value': value,
                        'units': units ? units : fake_units[name.charCodeAt(0) % 4]
                    }
                })
            }
        }, this);


        data = this.convertData(data);
        data = data.map((row) => {
            let key = [row.component, row.stream, row.param_name].join('-');
            return {
                'healthStatusCode': this.getHealthStatusCode(key, row.value),
                ...row,
            };
        });
        return (
            <React.Fragment>
                <table className={styles.rawTelemetryTable}>
                    <thead>
                        <tr>

                            {
                                (() => {
                                    let defaultColumnProps = {
                                        changeFilter: this.changeFilter,
                                        activeFilterDialog: this.state.activeFilterDialog,
                                        closeFilterDialogs: this.closeFilterDialogs,
                                        columnOnClick: this.columnOnClick,
                                        changeSortDirection: this.changeSortDirection,
                                        sortDirection: this.state.sortDirection,
                                        sortingColumn: this.state.sortingColumn
                                    }

                                    return (
                                        <>
                                            <ColumnHeader {...defaultColumnProps} header={'Component'} filterName={'component'} filter={this.props.filters['component']} />
                                            <ColumnHeader {...defaultColumnProps} header={'Stream'} filterName={'stream'} filter={this.props.filters['stream']} />
                                            <ColumnHeader {...defaultColumnProps} header={'Timestamp'} filterName={'timestamp'} filter={this.props.filters['timestamp']} secondaryText={'YYYY/MM/DD'} />
                                            <ColumnHeader {...defaultColumnProps} header={'Name'} filterName={'name'} filter={this.props.filters['name']} />
                                            <ColumnHeader {...defaultColumnProps} header={'Parameter'} filterName={'param_name'} filter={this.props.filters['param_name']} />
                                            <ColumnHeader className={styles.mediumCol} {...defaultColumnProps} header={'Data type'} filterName={'data_type'} filter={this.props.filters['data_type']} />
                                            <ColumnHeader {...defaultColumnProps} header={'Value'} filterName={'value'} filter={this.props.filters['value']} />
                                            <ColumnHeader className={styles.narrowCol} {...defaultColumnProps} header={'Units'} filterName={'units'} filter={this.props.filters['units']} />
                                            <ColumnHeader {...defaultColumnProps} header={'Health status'} filterName={'health_status'} filter={this.props.filters['health_status']} />
                                        </>
                                    )
                                })()
                            }
                            {
                                this.props.displaySelectionColumn ?
                                    <th className={styles.addedColumn}>Added</th> :
                                    null
                            }
                        </tr>
                    </thead>
                    <tbody onClick={this.closeFilterDialogs}>
                        {
                            data.sort(this.sortData).map((row) => {
                                if (this.testFilter(row)) {
                                    let key = [row.component, row.stream, row.param_name].join('-');
                                    return (
                                        <React.Fragment key={key}>
                                            <tr className={styles.dataRow} onClick={() => this.clickRow(key)} >
                                                <td className={styles.string}>{row.component}</td>
                                                <td className={styles.string}>{row.stream}</td>
                                                <td className={styles.string}>{row.timestamp}</td>
                                                <td className={styles.string}>{row.name}</td>
                                                <td className={styles.string}>{row.param_name}</td>
                                                <td className={[styles.string, styles.mediumCol].join(' ')}>{row.data_type}</td>
                                                <td className={[styles.number, styles.valueCell].join(' ')}>{JSON.stringify(row.value)}</td>
                                                <td className={[styles.string, styles.narrowCol].join(' ')}>{row.units}</td>
                                                <td className={[styles.healthStatusCell, this.state.expandedRows[key] ? styles.selectedHealthStatus : ''].join(' ')}
                                                    key={key + '-row'}>
                                                    <div className={styles.healthStatusWrapper}>
                                                        <div className={styles.statusTextWrapper}>
                                                            <StatusText statusCode={row.healthStatusCode} getHealthText={this.getHealthText}>
                                                            </StatusText>
                                                        </div>
                                                        <div onClick={() => this.clickGearIcon(key)} className={styles.gearIconWrapper}>
                                                            <GearIcon active={this.state.expandedRows[key]}></GearIcon>
                                                        </div>
                                                    </div>
                                                </td>
                                                {
                                                    this.props.displaySelectionColumn ?
                                                        <td><input onChange={(event) => (this.onRowSelection(event.target.checked, key, row))} type="checkbox" alt={`select ${key}`} /></td> :
                                                        null
                                                }
                                            </tr>
                                            {
                                                (this.state.expandedRows[key]) ?
                                                    <tr onClick={this.closeFilterDialogs} key={key + '-expanded'} className={styles.expandedRow}>
                                                        <td colSpan={4}>
                                                            <div>
                                                                <p>Value</p>
                                                                {
                                                                    row.value.length > 1 ?
                                                                        this.renderValueAsList(row.value) :
                                                                        this.renderValueAsList([row.value])
                                                                }
                                                            </div>
                                                        </td>
                                                        <td colSpan={4}>
                                                            <div>
                                                                <p>
                                                                    {'function ( value ) {'}
                                                                </p>
                                                                <textarea id={key + '-healthFunction'} defaultValue={this.props.healthFunctions[key] ? this.props.healthFunctions[key] : this.defaultCodeText}>
                                                                </textarea>
                                                                <p>
                                                                    {'}'}
                                                                </p>
                                                                <div onClick={() => this.setHealthFunction(key)}>
                                                                    <Button className={styles.setButton}>
                                                                        <span>Set</span>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td colSpan={1}>
                                                            <div>
                                                                <div className={styles.snippetsContainer}>

                                                                    <p className={styles.lineJump}>   </p>

                                                                    <div className={styles.snippetsTitle}>Snippets</div>
                                                                    <div className={styles.snippetsList}>
                                                                        <div className={styles.snippetButtonWrapper}>
                                                                            <Button secondary className={styles.snippetButton}>
                                                                                <span onClick={() => this.displayHealthFunction(key, 'range')}>Range</span>
                                                                            </Button>
                                                                        </div>
                                                                        <div className={styles.snippetButtonWrapper}>
                                                                            <Button secondary className={styles.snippetButton}>
                                                                                <span onClick={() => this.displayHealthFunction(key, 'text')}>Text value</span>
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.statusConfigTitle}>  Available Status:</div>
                                                                    <div className={styles.statusList}>
                                                                        <div> OK</div>
                                                                        <div> WARNING</div>
                                                                        <div> ALERT</div>
                                                                    </div>

                                                                </div>
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

            <div className={styles.selectionContainer}>
                    TELEMETRIES:
                    <span className={styles.selectionList}>
                        {this.state.selectedRows.map((telemetryKey)=>{
                            const telemetryName = telemetryKey.split('-')[2];
                            return <TelemetrySelectionTag 
                                    key={telemetryKey} 
                                    telemetryKey={telemetryKey}
                                    telemetryName={telemetryName}></TelemetrySelectionTag>
                        })}
                    </span>
            </div>
            </React.Fragment>

        );
    }
}
