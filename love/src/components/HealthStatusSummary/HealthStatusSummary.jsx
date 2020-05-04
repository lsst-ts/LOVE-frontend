import React, { Component } from 'react';
import saveAs from 'file-saver';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import TelemetrySelectionTableContainer from './TelemetrySelectionTable/TelemetrySelectionTable.container';
import Button from './Button/Button';
import ExportIcon from '../icons/ExportIcon/ExportIcon';
import styles from './HealthStatusSummary.module.css';
import UploadButton from './Button/UploadButton';
import ManagerInterface, { formatTimestamp } from '../../Utils';

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

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };
  render() {
    const { telemetryMetadata, streams } = this.props;

    console.log('streams', this.props.streams);
    return (
      <div className={styles.container}>
        {Object.keys(telemetryMetadata).map((indexedComponentName) => {
          const [component, salindex] = indexedComponentName.split('-');
          const componentName = `${component}${parseInt(salindex) === 0 ? '' : `.${salindex}`}`;

          return (
            <div key={indexedComponentName} className={styles.componentContainer}>
              <div className={styles.componentName}>{componentName}</div>
              {Object.keys(telemetryMetadata[indexedComponentName]).map((topic) => {
                let timestamp = streams[`telemetry-${indexedComponentName}-${topic}`]?.private_rcvStamp;
                timestamp = timestamp?.value !== undefined ? formatTimestamp(timestamp.value * 1000) : '-';

                return (
                  <React.Fragment key={`${indexedComponentName}${topic}`}>
                    <div className={styles.topic}>
                      <div className={styles.topicName}>{topic}</div>
                      <div className={styles.topicTimestamp}>{timestamp}</div>
                    </div>
                    <div className={styles.divider}></div>
                    {telemetryMetadata[indexedComponentName][topic].map((parameterName) => {
                      const parameterValue = streams[`telemetry-${indexedComponentName}-${topic}`]?.[parameterName];
                      let renderedValue = '';
                      if (parameterValue?.value !== undefined) {
                        if (Array.isArray(parameterValue.value)) {
                          renderedValue = '[Array]';
                        } else {
                          renderedValue = parameterValue.value.toFixed(4);
                        }
                      }
                      return (
                        <div
                          key={`${indexedComponentName}${topic}${parameterName}`}
                          className={styles.parameterContainer}
                        >
                          <div className={styles.parameterName}> {parameterName} </div>
                          <div className={styles.healthStatus}>
                            <div className={styles.parameterValue}> {renderedValue}</div>
                            <div className={styles.parameterUnits}> {parameterValue?.units ?? ''}</div>
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
