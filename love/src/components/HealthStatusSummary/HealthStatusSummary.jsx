import React, { Component } from 'react';
import saveAs from 'file-saver';
import PropTypes from 'prop-types';
import RawTelemetryTableContainer from './RawTelemetryTable/RawTelemetryTable.container';
import Button from './Button/Button';
import ExportIcon from '../icons/ExportIcon/ExportIcon';
import styles from './HealthStatusSummary.module.css';
import UploadButton from './Button/UploadButton';
import ManagerInterface from '../../Utils';

/**
 * Configurable summary displaying the health status of an arbitrary subset
 * of telemetries provided in the component props. The user first faces the
 * [**RawTelemetryTable**](#rawtelemetrytable) component for filtering,
 * selecting telemetries and configuring the definition of health
 * status. Then the user launches another YET TO BE IMPLEMENTED "printed" table.
 *
 */
export default class HealthStatusSummary extends Component {
  constructor() {
    super();
    // eslint-disable-next-line
    RegExp.prototype.toJSON = RegExp.prototype.toString;

    let healthFunctions = localStorage.getItem('healthFunctions');
    if (!healthFunctions) {
      healthFunctions = {
        timestamp0: '//asdasdadsa',
        altitude_decel0: '//dsasdssa\nreturn ALERT;',
        altitude_accel0: 'return WARNING;',
        altitude_maxspeed0: 'return OK;',
      };
    } else {
      healthFunctions = JSON.parse(healthFunctions);
    }
    this.managerInterface = new ManagerInterface();

    this.state = {
      healthFunctions,
      setHealthFunctions: this.setHealthFunctions,
    };
  }

  setHealthFunctions = (healthFunctions) => {
    this.setState({
      healthFunctions: { ...healthFunctions },
    });
  };

  download = (data, filename) => {
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/javascript;charset=utf-8' });
    saveAs(jsonBlob, filename);
  };

  onLoadFile = (data) => {
    try {
      const parsedData = JSON.parse(data);
      // console.log('onLoadFile', parsedData);
      this.setFilters(parsedData.filters);
      this.setHealthFunctions(parsedData.healthFunctions);
    } catch (error) {
      // console.error(error);
    }
  };

  getOutputConfig = () => ({
    filters: this.state.filters,
    healthFunctions: this.state.healthFunctions,
  });

  render() {
    return (
      <React.Fragment>
        <div className={styles.topButtons}>
          <div className={styles.buttonWrapper}>
            <UploadButton onLoadFile={this.onLoadFile} />
          </div>
          <div className={styles.buttonWrapper} onClick={() => this.download(this.getOutputConfig(), 'data.json')}>
            <Button>
              <ExportIcon />
              Export
            </Button>
            {/* </a> */}
          </div>
        </div>
        <RawTelemetryTableContainer
          {...this.state}
          checkedFilterColumn="units"
          // eslint-disable-next-line
          onClick={() => console.log('RawTel Click')}
        />
      </React.Fragment>
    );
  }
}
