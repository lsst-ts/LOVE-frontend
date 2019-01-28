import React, { Component } from 'react'
import RawTelemetryTable from './RawTelemetryTable/RawTelemetryTable';
import Button from './Button/Button';
import ExportIcon from '../icons/ExportIcon/ExportIcon';
import styles from './HealthStatusSummary.module.css'
import saveAs from 'file-saver';
import UploadButton from './Button/UploadButton';
import PropTypes from 'prop-types';

/**
 * Configurable summary displaying the health status of an arbitrary subset
 * of telemetries provided in the component props. The user first faces the
 * [**RawTelemetryTable**](#rawtelemetrytable) component for filtering, 
 * selecting telemetries and configuring the definition of health 
 * status. Then the user launches another YET TO BE IMPLEMENTED "printed" table.  
 * 
 */
export default class HealthStatusSummary extends Component {
    static propTypes = {
        /** Dictionary of telemetries that are displayed. See examples below
         */
        telemetries: PropTypes.object
    }
    constructor() {
        super();
        // eslint-disable-next-line
        RegExp.prototype.toJSON = RegExp.prototype.toString;

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
            healthFunctions: healthFunctions,
            setHealthFunctions: this.setHealthFunctions,
        };
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
            <React.Fragment>
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
                <RawTelemetryTable telemetries={this.props.telemetries} 
                    {...this.state} 
                    displaySelectionColumn 
                    checkedFilterColumn='units'
                    onClick={()=>console.log('RawTel Click')}>
                </RawTelemetryTable>
            </React.Fragment >
        )
    }
}
