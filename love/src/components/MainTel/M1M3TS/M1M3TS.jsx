import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Summary from'./Summary/Summary';
import Menu from'./Menu/Menu';
import Selector from'./Selector/Selector';
import Mixing from'./Mixing/Mixing';
import TemperatureGradiant from'./Temperature/TemperatureGradiant';
import Info from'./Info/Info';

import styles from './M1M3TS.module.css';


export default class M1M3TS extends Component {

  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,

    /** Current summary state of the CSC. High level state machine state identifier. */
    summaryState: PropTypes.number,

    /** Number of the minimum force limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  }
  static defaultProps = {
    minTemperatureLimit: 0,
    maxTemperatureLimit: 1000,
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  arrayReferenceId = () => {
    const array = [];
    for (let i = 0; i < 96; i++) {
      array.push(i + 1);
    }
    return array;
  };



  render() {
    const sensorReferenceId = this.arrayReferenceId();

    // Summary
    const {
      summaryState,
      fanHeaters,
      coolantPump,
    } = this.props;

    // Temperature
    const {
      setpoint,
      minTemperatureLimit,
      maxTemperatureLimit,
    } = this.props;

    // Info
    const {
      enabledFCU,
      absoluteTemperature,
      differentialTemperature,
      fanRPM,
    } = this.props;

    console.log('absolute', absoluteTemperature[0]);
    console.log('differential', differentialTemperature[0]);

    return (
      <div className={styles.container}>
        
        <div className={styles.summaryContainer}>
          <Summary 
            summaryState={summaryState}
            fanHeaters={fanHeaters}
            coolantPump={coolantPump}
          />
        </div>

        <div className={styles.menuContainer}>
          <Menu />
        </div>

        <div className={styles.selectorContainer}>
          <Selector />
        </div>

        <div className={styles.mixingContainer}>
          <Mixing />
        </div>

        <div className={styles.temperatureContainer}>
          <TemperatureGradiant 
            setpoint={setpoint}
            minTemperatureLimit={minTemperatureLimit}
            maxTemperatureLimit={maxTemperatureLimit}
            absoluteTemperature={absoluteTemperature}
            differentialTemperature={differentialTemperature}
            sensorReferenceId={sensorReferenceId}
          />
        </div>

        <div className={styles.infoContainer}>
          <Info 
            sensorReferenceId={sensorReferenceId}
            enabledFCU={enabledFCU}
            absoluteTemperature={absoluteTemperature}
            differentialTemperature={differentialTemperature}
            fanRPM={fanRPM}
          />
        </div>

      </div>
    );
  }
}