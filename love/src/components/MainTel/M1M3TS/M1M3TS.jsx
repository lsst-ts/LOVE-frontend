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
    /** True if Fan Coils/Heaters are on. */
    fanHeaters: PropTypes.bool,
    /** True if Coolant Pump is on. */
    coolantPump: PropTypes.bool,
    /** Applied setpoint. */
    setpoint: PropTypes.number,
    /** True if this fan unit is enabled. */
    enabled: PropTypes.arrayOf(PropTypes.bool),
    /** Thermal status response data. Absolute temperature. */
    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data.  Differential temperature. */
    differentialTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data.  Measured fan RPM-0 to 2550 RPM. */
    fanRPM: PropTypes.arrayOf(PropTypes.number),
    /** Object with boolean arrays for indicates of warning. */
    thermalWarnings: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.bool)),
    /** Mixing valve measured position. */
    valvePosition: PropTypes.number,
    /** Number of the minimum temperature limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum temerature limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  }
  static defaultProps = {
    summaryState: 1,
    fanHeaters: false,
    coolantPump: false,
    setpoint: 0,
    enabled: [],
    absoluteTemperature: [],
    differentialTemperature: [],
    fanRPM: [],
    thermalWarnings: [],
    valvePosition: 0,
    minTemperatureLimit: 0,
    maxTemperatureLimit: 1000,
  }

  constructor(props) {
    super(props);
    this.state = {
      showFcuIDs: true,
      showDifferentialTemp: true,
      showWarnings: true,
      selectedSensor: undefined,
    };
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
      enabled,
      absoluteTemperature,
      differentialTemperature,
      fanRPM,
    } = this.props;

    const thermalWarnings = this.props.thermalWarnings;

    // Mixing
    const {
      valvePosition,
    } = this.props;

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
          <Menu 
            showFcuIDs={this.state.showFcuIDs}
            showDifferentialTemp={this.state.showDifferentialTemp}
            showWarnings={this.state.showWarnings}
            toggleFcuIDs={(show) => this.setState({showFcuIDs: show})}
            toggleTemperature={(show) => this.setState({showDifferentialTemp: show})}
            toggleWarnings={(show) => this.setState({showWarnings: show})}
          />
        </div>

        <div className={styles.selectorContainer}>
          <Selector
            sensorReferenceId={sensorReferenceId}
            enabled={enabled}
            showFcuIDs={this.state.showFcuIDs}
            showDifferentialTemp={this.state.showDifferentialTemp}
            showWarnings={this.state.showWarnings}
            selectedSensor={this.state.selectedSensor}
            sensorSelect={(sensor) => { this.setState({selectedSensor: sensor})}}
            absoluteTemperature={absoluteTemperature}
            differentialTemperature={differentialTemperature}
            minTemperatureLimit={minTemperatureLimit}
            maxTemperatureLimit={maxTemperatureLimit}
            thermalWarnings={thermalWarnings}
          />
        </div>

        <div className={styles.mixingContainer}>
          <Mixing 
            value={valvePosition}
          />
        </div>

        <div className={styles.temperatureContainer}>
          <TemperatureGradiant 
            setpoint={setpoint}
            minTemperatureLimit={minTemperatureLimit}
            maxTemperatureLimit={maxTemperatureLimit}
            absoluteTemperature={absoluteTemperature}
            differentialTemperature={differentialTemperature}
            sensorReferenceId={sensorReferenceId}
            selectedId={this.state.selectedSensor}
            showDifferentialTemp={this.state.showDifferentialTemp}
          />
        </div>

        <div className={styles.infoContainer}>
          <Info 
            sensorReferenceId={sensorReferenceId}
            enabled={enabled}
            absoluteTemperature={absoluteTemperature}
            differentialTemperature={differentialTemperature}
            fanRPM={fanRPM}
            selectedSensor={this.state.selectedSensor}
            thermalWarnings={thermalWarnings}
          />
        </div>

      </div>
    );
  }
}