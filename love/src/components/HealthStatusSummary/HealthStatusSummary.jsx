import React, { Component } from 'react'
import RawTelemetryTable from './RawTelemetryTable/RawTelemetryTable';
import Button from './Button/Button';
import ExportIcon from '../icons/ExportIcon/ExportIcon';
import styles from './HealthStatusSummary.module.css'
import saveAs from 'file-saver';
import UploadButton from './Button/UploadButton';

export default class HealthStatusSummary extends Component {

    constructor() {
        super();
        // eslint-disable-next-line
        RegExp.prototype.toJSON = RegExp.prototype.toString;

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

        let healthFunctions = localStorage.getItem('healthFunctions');
        if (!healthFunctions) {
            healthFunctions = {
                'timestamp0': '//asdasdadsa',
                'altitude_decel0': '//dsasdssa\nreturn ALERT;',
                'altitude_accel0': 'return WARNING;',
                'altitude_maxspeed0': 'return OK;',
            }
        } else {
            healthFunctions = JSON.parse(healthFunctions);
        }

        this.state = {
            filters: filters,
            setFilters: this.setFilters,
            healthFunctions: healthFunctions,
            setHealthFunctions: this.setHealthFunctions,
        };
    }

    setFilters = (filters) => {
        Object.keys(filters).map((key) => {
            if(filters[key]['type'] === 'regexp' && typeof filters[key]['value'] === 'string')
                filters[key]['value'] = new RegExp(filters[key]['value'].replace(/^\/|\/$/g, ''));
            return null;
        })
        this.setState({
            filters: filters,
        });
    }

    setHealthFunctions = (healthFunctions) => {
        this.setState({
            healthFunctions: {...healthFunctions},
        });
    }

    download = (data, filename) => {
        let jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/javascript;charset=utf-8' });
        saveAs(jsonBlob, filename);
    }

    onLoadFile = (data) => {
        try {
            let parsedData = JSON.parse(data);
            console.log('onLoadFile', parsedData);
            this.setFilters(parsedData.filters);
            this.setHealthFunctions(parsedData.healthFunctions);
        } catch (error) {
            console.error(error);
        }
    }

    getOutputConfig = () => {
        return {
            filters: this.state.filters,
            healthFunctions: this.state.healthFunctions,
        }
    }

    render() {
        return (
            <div>
                <div className={styles.topButtons}>
                    <div className={styles.buttonWrapper}>
                        {/* <Button>

                            <ImportIcon>
                            </ImportIcon>Import
                            </Button> */}
                        <div className={styles.buttonWrapper}>
                            <UploadButton onLoadFile={this.onLoadFile}></UploadButton>
                        </div>
                    </div>
                    <div className={styles.buttonWrapper} onClick={() => this.download(this.getOutputConfig(), 'data.json')}>
                        {/* <a href={{data: "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({'adsas': 1}))}} download="data.json"> */}
                        <Button><ExportIcon></ExportIcon>Export</Button>
                        {/* </a> */}
                    </div>
                </div>
                <RawTelemetryTable telemetries={this.props.telemetries} {...this.state}></RawTelemetryTable>
            </div >
        )
    }
}
