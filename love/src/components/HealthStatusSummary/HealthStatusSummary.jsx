import React, { Component } from 'react';
import saveAs from 'file-saver';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import TelemetrySelectionTableContainer from './TelemetrySelectionTable/TelemetrySelectionTable.container';
import Button from './Button/Button';
import ExportIcon from '../icons/ExportIcon/ExportIcon';
import styles from './HealthStatusSummary.module.css';
import UploadButton from './Button/UploadButton';
import ManagerInterface, { saveGroupSubscriptions } from '../../Utils';

/**
 * Configurable summary displaying the health status of an arbitrary subset
 * of telemetries provided in the component props. The user first faces the
 * [**TelemetrySelectionTable**](#TelemetrySelectionTable) component for filtering,
 * selecting telemetries and configuring the definition of health
 * status. Then the user launches another YET TO BE IMPLEMENTED "printed" table.
 *
 */

const healthStatusCodes = {
  0: 'Undefined',
  1: 'OK',
  2: 'Warning',
  3: 'Alert',
  4: 'Invalid',
};
export default class HealthStatusSummary extends Component {
  static defaultProps = {
    telemetriesToMonitor: {},
  };

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
    const { telemetryMetadata } = this.props;

    return (
      <div className={styles.container}>
        {Object.keys(telemetryMetadata).map((indexedComponentName) => {
          const [component, salindex] = indexedComponentName.split('-');
          const componentName = `${component}${parseInt(salindex) === 0 ? '' : `.${salindex}`}`;

          return (
            <div key={indexedComponentName} className={styles.componentContainer}>
              <div className={styles.componentName}>{componentName}</div>
              {Object.keys(telemetryMetadata[indexedComponentName]).map((topic) => {
                return (
                  <React.Fragment>
                    <div className={styles.topic}>
                      <div className={styles.topicName}>{topic}</div>
                      <div className={styles.topicTimestamp}>2012-01-01 12:34:12</div>
                    </div>
                    <div className={styles.divider}></div>
                    {telemetryMetadata[indexedComponentName][topic].map((parameter) => {
                      return (
                        <div key={`${indexedComponentName}${topic}${parameter}`} className={styles.parameterContainer}>
                          <div className={styles.parameterName}> {parameter} </div>
                          {/* <div className={styles.parameterDescription}> */}
                          {/* </div> */}
                          <div className={styles.healthStatus}>
                            <div className={styles.parameterValue}> {(12312123.123123).toFixed(4)}</div>
                            <div className={styles.parameterUnits}> second</div>
                            <StatusText status={healthStatusCodes[3].toLowerCase()}>{healthStatusCodes[3]}</StatusText>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
        {/* <div className={styles.topButtons}>
          <div className={styles.buttonWrapper}>
            <UploadButton onLoadFile={this.onLoadFile} />
          </div>
          <div className={styles.buttonWrapper} onClick={() => this.download(this.getOutputConfig(), 'data.json')}>
            <Button>
              <ExportIcon />
              Export
            </Button>
          </div>
        </div> */}
        {/* <div className={styles.telemetryTableWrapper}>
          <TelemetrySelectionTableContainer
            {...this.state}
            // eslint-disable-next-line
            onClick={() => console.log('RawTel Click')}
            showSelection={false}
          />
        </div> */}
      </div>
    );
  }
}
