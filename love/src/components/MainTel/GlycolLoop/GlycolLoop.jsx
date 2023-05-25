import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './GlycolLoop.module.css';
import Summary from './Summary/Summary';
import LoopCartoon from './LoopCartoon/LoopCartoon';
import Mixing from './Mixing/Mixing';
import TemperatureGradient from './TemperatureGradient/TemperatureGradient';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import TimeSeriesControls from 'components/GeneralPurpose/Plot/TimeSeriesControls/TimeSeriesControls';

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

    /** Mixing valve measured position */
    valvePosition: PropTypes.number,
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

  constructor(props) {
    super(props);
    this.state = {
      az: 0,
      el: 0,
      timeWindow: 60,
      isLive: true,
      historicalData: [],
    };

    this.tsmcPlotRef = React.createRef();
    this.tsgPlotRef = React.createRef();
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  tsmcPlotInputs = {
    'TS2-MC': {
      category: 'telemetry',
      csc: 'MTM1M3TS',
      salindex: '0',
      topic: 'glycolLoopTemperature',
      item: 'insideCellTemperature1',
      type: 'line',
      accessor: (x) => x,
      color: '#ff7bb5',
    },
    'TS3-MC': {
      category: 'telemetry',
      csc: 'MTM1M3TS',
      salindex: '0',
      topic: 'glycolLoopTemperature',
      item: 'insideCellTemperature2',
      type: 'line',
      accessor: (x) => x,
      color: '#97e54f',
      dash: [4, 1],
    },
    'TS4-MC': {
      category: 'telemetry',
      csc: 'MTM1M3TS',
      salindex: '0',
      topic: 'glycolLoopTemperature',
      item: 'insideCellTemperature3',
      type: 'line',
      accessor: (x) => x,
      color: '#a9a5ff',
      dash: [4, 1],
    },
  };

  tsgPlotInputs = {
    'TS5-G': {
      category: 'telemetry',
      csc: 'MTM1M3TS',
      salindex: 0,
      topic: 'glycolLoopTemperature',
      item: 'telescopeCoolantSupplyTemperature',
      type: 'line',
      accessor: (x) => x,
      color: '#ff7bb5',
    },
    'TS6-G': {
      category: 'event',
      csc: 'MTM1M3TS',
      salindex: 0,
      topic: 'glycolLoopTemperature',
      item: 'telescopeCoolantReturnTemperature',
      type: 'line',
      accessor: (x) => x,
      color: '#97e54f',
      dash: [4, 1],
    },
    'TS7-G': {
      category: 'telemetry',
      csc: 'MTM1M3TS',
      salindex: 0,
      topic: 'glycolLoopTemperature',
      item: 'mirrorCoolantSupplyTemperature',
      type: 'line',
      accessor: (x) => x,
      color: '#a9a5ff',
    },
    'TS8-G': {
      category: 'telemetry',
      csc: 'MTM1M3TS',
      salindex: 0,
      topic: 'glycolLoopTemperature',
      item: 'mirrorCoolantReturnTemperature',
      type: 'line',
      accessor: (x) => x,
      color: '#00b7ff',
      dash: [4, 1],
    },
  };

  setHistoricalData = (startDate, timeWindow) => {
    const cscs = {
      MTM1M3TS: {
        0: {
          glycolLoopTemperature: ['insideCellTemperature1'],
          glycolLoopTemperature: ['insideCellTemperature2'],
          glycolLoopTemperature: ['insideCellTemperature3'],
          glycolLoopTemperature: ['telescopeCoolantSupplyTemperature'],
          glycolLoopTemperature: ['telescopeCoolantReturnTemperature'],
          glycolLoopTemperature: ['mirrorCoolantSupplyTemperature'],
          glycolLoopTemperature: ['mirrorCoolantReturnTemperature'],
        },
      },
    };
    const parsedDate = startDate.format('YYYY-MM-DDTHH:mm:ss');
    // historicalData
    ManagerInterface.getEFDTimeseries(parsedDate, timeWindow, cscs, '1min').then((data) => {
      const parsedPlotData = parseCommanderData(data, 'x', 'y');
      this.setState({ historicalData: parsedPlotData });
    });
  };

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
      errorReport,
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
      valvePosition,
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

    const minTemp = Math.floor(Math.min(...tempsArray));
    const maxTemp = Math.ceil(Math.max(...tempsArray));

    const timeSeriesControlsProps = {
      timeWindow: this.state.timeWindow,
      isLive: this.state.isLive,
      historicalData: this.state.historicalData,
    };

    return (
      <>
        <div className={styles.summaryContainer}>
          <Summary
            faulted={faulted}
            ready={ready}
            running={running}
            forwardCommanded={forwardCommanded}
            forwardRotating={forwardRotating}
            accelerating={accelerating}
            decelerating={decelerating}
            mainFrequencyControlled={mainFrequencyControlled}
            operationCommandControlled={operationCommandControlled}
            parametersLocked={parametersLocked}
            errorCode={errorCode}
            errorReport={errorReport}
          />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.cartoonContainer}>
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
              colours={COLOURS}
              height={'54em'}
              rotation={forwardRotating}
              direction={forwardCommanded}
            />
          </div>
          <div>
            <div className={styles.rightRow}>
              <div className={styles.mixingContainer}>
                <Mixing value={valvePosition} />
              </div>
              <div className={styles.tempGradientContainer}>
                <TemperatureGradient minTemperatureLimit={minTemp} maxTemperatureLimit={maxTemp} width={width} />
              </div>
            </div>
            <div className={styles.plotContainer}>
              {this.props.controls && (
                <div>
                  <TimeSeriesControls
                    setTimeWindow={(timeWindow) => this.setState({ timeWindow })}
                    timeWindow={this.state.timeWindow}
                    setLiveMode={(isLive) => this.setState({ isLive })}
                    isLive={this.state.isLive}
                    setHistoricalData={this.setHistoricalData}
                  />
                </div>
              )}
              <div className={styles.telemetryTable}>
                <div className={styles.tsmcSection}>
                  <h2>Inside Mirror Temperatures</h2>
                  <div ref={this.tsmcPlotRef} className={styles.tsmcPlot}>
                    <div>
                      <PlotContainer
                        inputs={this.tsmcPlotInputs}
                        containerNode={this.tsmcPlotRef?.current}
                        xAxisTitle="Time"
                        yAxisTitle="Temperature"
                        timeSeriesControlsProps={timeSeriesControlsProps}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.tsgSection}>
                  <h2>Chiller to Telescope Temperatures</h2>
                  <div ref={this.tsgPlotRef} className={styles.tsgPlot}>
                    <div>
                      <PlotContainer
                        inputs={this.tsgPlotInputs}
                        containerNode={this.tsgPlotRef?.current}
                        xAxisTitle="Time"
                        yAxisTitle="Temperature"
                        timeSeriesControlsProps={timeSeriesControlsProps}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
