import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './GlycolLoop.module.css';
import Summary from './Summary/Summary';
import LoopCartoon from './LoopCartoon/LoopCartoon';
import TemperatureGradient from './TemperatureGradient/TemperatureGradient';
import { fixedFloat } from 'Utils';

export default class GlycolLoop extends Component {
  static propTypes = {
    /** True if the pump can be started */
    ready: PropTypes.bool,
    /** True if the pump is running */
    running: PropTypes.bool,
    /** True if pump motor is commanded to run forward, false for backward command */
    forwardCommanded: PropTypes.bool,
    /** True if pump motor is rotating forward, false for backward rotation. */
    forwardRotating: PropTypes.bool,
    /** True if motor is accelerating */
    accelerating: PropTypes.bool,
    /** True if motor is decelerating */
    decelerating: PropTypes.bool,
    /** True if motor faulted */
    faulted: PropTypes.bool,
    /** True if main frequency is controlled by the active communication. */
    mainFrequencyControlled: PropTypes.bool,
    /** True if pump motor operation is controlled by the active communication. */
    operationCommandControlled: PropTypes.bool,
    /** True if pump motor parameters are locked. */
    parametersLocked: PropTypes.bool,
    /** Motor controller error code. Please see VFD documentation for details. */
    errorCode: PropTypes.number,

    /** Air temperature measured above mirror level by sensor TS1-A */
    aboveMirrorTemperature: PropTypes.number,
    /** Cell temperature measured inside mirror cell by sensor TS2-MC */
    insideCellTemperature1: PropTypes.number,
    /** Cell temperature measured inside mirror cell by sensor TS3-MC */
    insideCellTemperature2: PropTypes.number,
    /** Cell temperature measured inside mirror cell by sensor TS4-MC */
    insideCellTemperature3: PropTypes.number,
    /** Temperature of input glycol (flowing from telescope/chillers), sensor TS5-G */
    telescopeCoolantSupplyTemperature: PropTypes.number,
    /** Temperature of returned glycol (returning to chillers), sensor TS6-G */
    telescopeCoolantReturnTemperature: PropTypes.number,
    /** Temperature of mirror glycol loop supply (measured after mixing valve), sensor TS7-G */
    mirrorCoolantSupplyTemperature: PropTypes.number,
    /** Temperature of mirror glycol loop return (measured before mixing valve), sensor TS8-G */
    mirrorCoolantReturnTemperature: PropTypes.number,
  };

  static defaultProps = {
    ready: false,
    running: false,
    forwardCommanded: false,
    forwardRotating: false,
    accelerating: false,
    decelerating: false,
    faulted: false,
    mainFrequencyControlled: false,
    operationCommandControlled: false,
    parametersLocked: false,
    errorCode: 0,
    aboveMirrorTemperature: 0,
    insideCellTemperature1: 0,
    insideCellTemperature2: 0,
    insideCellTemperature3: 0,
    telescopeCoolantSupplyTemperature: 0,
    telescopeCoolantReturnTemperature: 0,
    mirrorCoolantSupplyTemperature: 0,
    mirrorCoolantReturnTemperature: 0,
    minTemp: 9,
    maxTemp: 11.5,
    with: 350,
    COLOURS: ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'],
  };

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const {
      ready,
      running,
      forwardCommanded,
      forwardRotating,
      accelerating,
      decelerating,
      faulted,
      mainFrequencyControlled,
      operationCommandControlled,
      parametersLocked,
      errorCode,
      aboveMirrorTemperature,
      insideCellTemperature1,
      insideCellTemperature2,
      insideCellTemperature3,
      telescopeCoolantSupplyTemperature,
      telescopeCoolantReturnTemperature,
      mirrorCoolantSupplyTemperature,
      mirrorCoolantReturnTemperature,
      width,
      COLOURS,
    } = this.props;

    const tempsArray = [
      insideCellTemperature1,
      insideCellTemperature2,
      insideCellTemperature3,
      telescopeCoolantSupplyTemperature,
      telescopeCoolantReturnTemperature,
      mirrorCoolantSupplyTemperature,
      mirrorCoolantReturnTemperature,
    ];

    const minTemp = fixedFloat(Math.min(...tempsArray), 2);
    const maxTemp = fixedFloat(Math.max(...tempsArray), 2);

    return (
      <>
        <div className={styles.summaryContainer}>
          <Summary
            ready={ready}
            running={running}
            forwardCommanded={forwardCommanded}
            forwardRotating={forwardRotating}
            accelerating={accelerating}
            decelerating={decelerating}
            faulted={faulted}
            mainFrequencyControlled={mainFrequencyControlled}
            operationCommandControlled={operationCommandControlled}
            parametersLocked={parametersLocked}
            errorCode={errorCode}
          />
        </div>
        <div className={styles.mirrorAndElevationContainer}>
          <div className={styles.mirrorCoversContainer}>
            <LoopCartoon
              ts1={aboveMirrorTemperature}
              ts2={tempsArray[0]}
              ts3={tempsArray[1]}
              ts4={tempsArray[2]}
              ts5={tempsArray[3]}
              ts6={tempsArray[4]}
              ts7={tempsArray[5]}
              ts8={tempsArray[6]}
              minTemperatureLimit={minTemp}
              maxTemperatureLimit={maxTemp}
              width={width}
              colours={COLOURS}
            />
          </div>
          <div className={styles.elevationContainer}>
            <div className={styles.svgElevationContainer}>
              <TemperatureGradient minTemperatureLimit={minTemp} maxTemperatureLimit={maxTemp} width={width} />
            </div>
          </div>
        </div>
      </>
    );
  }
}
