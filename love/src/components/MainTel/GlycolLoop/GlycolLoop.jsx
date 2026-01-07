/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import ManagerInterface, { parseCommanderData } from 'Utils';
import Summary from './Summary/Summary';
import LoopCartoon from './LoopCartoon/LoopCartoon';
import Mixing from './Mixing/Mixing';
import TemperatureGradient from './TemperatureGradient/TemperatureGradient';
import styles from './GlycolLoop.module.css';

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
      type: 'line',
      color: '#ff7bb5',
      values: [
        {
          category: 'telemetry',
          csc: 'MTM1M3TS',
          salindex: '0',
          topic: 'glycolLoopTemperature',
          item: 'insideCellTemperature1',
          accessor: '(x) => x',
        },
      ],
    },
    'TS3-MC': {
      type: 'line',
      color: '#97e54f',
      dash: [4, 1],
      values: [
        {
          category: 'telemetry',
          csc: 'MTM1M3TS',
          salindex: '0',
          topic: 'glycolLoopTemperature',
          item: 'insideCellTemperature2',
          accessor: (x) => x,
        },
      ],
    },
    'TS4-MC': {
      type: 'line',
      color: '#a9a5ff',
      dash: [4, 1],
      values: [
        {
          category: 'telemetry',
          csc: 'MTM1M3TS',
          salindex: '0',
          topic: 'glycolLoopTemperature',
          item: 'insideCellTemperature3',
          accessor: (x) => x,
        },
      ],
    },
  };

  tsgPlotInputs = {
    'TS5-G': {
      type: 'line',
      color: '#ff7bb5',
      values: [
        {
          category: 'telemetry',
          csc: 'MTM1M3TS',
          salindex: '0',
          topic: 'glycolLoopTemperature',
          item: 'telescopeCoolantSupplyTemperature',
          accessor: '(x) => x',
        },
      ],
    },
    'TS6-G': {
      type: 'line',
      color: '#97e54f',
      dash: [4, 1],
      values: [
        {
          category: 'telemetry',
          csc: 'MTM1M3TS',
          salindex: '0',
          topic: 'glycolLoopTemperature',
          item: 'telescopeCoolantReturnTemperature',
          accessor: '(x) => x',
        },
      ],
    },
    'TS7-G': {
      type: 'line',
      color: '#a9a5ff',
      values: [
        {
          category: 'telemetry',
          csc: 'MTM1M3TS',
          salindex: 0,
          topic: 'glycolLoopTemperature',
          item: 'mirrorCoolantSupplyTemperature',
          accessor: (x) => x,
        },
      ],
    },
    'TS8-G': {
      type: 'line',
      color: '#00b7ff',
      dash: [4, 1],
      values: [
        {
          category: 'telemetry',
          csc: 'MTM1M3TS',
          salindex: 0,
          topic: 'glycolLoopTemperature',
          item: 'mirrorCoolantReturnTemperature',
          accessor: (x) => x,
        },
      ],
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
      rawValvePosition,
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
          <div style={{ height: '54em' }} className={styles.cartoonContainer}>
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
              rotation={forwardRotating}
              direction={forwardCommanded}
            />
            <TemperatureGradient minTemperatureLimit={minTemp} maxTemperatureLimit={maxTemp} />
          </div>
          <div>
            <div>
              <Mixing value={valvePosition} rawValue={rawValvePosition} />
            </div>
            <div>
              <div className={styles.plotContainer}>
                <h2 onClick={() => console.log(this.tsmcPlotRef)}>Inside Mirror Temperatures</h2>
                <div ref={this.tsmcPlotRef}>
                  <PlotContainer
                    inputs={this.tsmcPlotInputs}
                    containerNode={this.tsmcPlotRef}
                    xAxisTitle="Time"
                    yAxisTitle="Temperature"
                    maxHeight={250}
                    scaleDomain={{ domainMin: minTemp, domainMax: maxTemp }}
                  />
                </div>
              </div>
              <div className={styles.plotContainer}>
                <h2>Chiller to Telescope Temperatures</h2>
                <div ref={this.tsgPlotRef}>
                  <div>
                    <PlotContainer
                      inputs={this.tsgPlotInputs}
                      containerNode={this.tsgPlotRef}
                      xAxisTitle="Time"
                      yAxisTitle="Temperature"
                      maxHeight={250}
                      scaleDomain={{ domainMin: minTemp, domainMax: maxTemp }}
                    />
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
