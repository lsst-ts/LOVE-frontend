import React, { Component } from 'react';
import saveAs from 'file-saver';
import PropTypes from 'prop-types';
import RawTelemetryTable from './RawTelemetryTable/RawTelemetryTable';
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
  static propTypes = {
    /** Dictionary of telemetries that are displayed. See examples below
     */
    telemetries: PropTypes.object,
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
      telemetries: {},
    };
  }

  componentDidMount = () => {
    this.managerInterface.subscribeToTelemetry('all', 'all', this.receiveAllMsg);
  };

  componentWillUnmount = () => {
    this.managerInterface.unsubscribeToTelemetry('all', 'all', () => 0);
  };

  receiveAllMsg = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.category !== 'telemetry') return;
    if (typeof data.data === 'object') {
      let newTelemetries = Object.assign({}, this.state.telemetries);
      let timestamp = new Date();
      timestamp = timestamp
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, '/')
        .replace('T', ' ');
      Object.entries(data.data).forEach((entry) => {
        const [csc, cscDataString] = entry;
        const cscData = JSON.parse(cscDataString);
        const telemetry = {};
        const stream = {};
        Object.entries(cscData).forEach((cscStream) => {
          const [streamName, parameters] = cscStream;
          stream[streamName] = {};
          stream[streamName].parameters = parameters;
          stream[streamName].receptionTimestamp = timestamp;
        });
        telemetry[csc] = {
          ...stream,
        };
        Object.assign(newTelemetries, telemetry);
      }, this);

      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({ telemetries: newTelemetries });
    }
  };

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
        <RawTelemetryTable
          telemetries={this.state.telemetries !== {} ? this.state.telemetries : this.props.telemetries}
          {...this.state}
          checkedFilterColumn="units"
          // eslint-disable-next-line
          onClick={() => console.log('RawTel Click')}
        />
      </React.Fragment>
    );
  }
}
