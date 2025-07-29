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
import { fixedFloat } from 'Utils';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Elevation from 'components/GeneralPurpose/Elevation/Elevation';
import Azimuth from 'components/GeneralPurpose/Azimuth/Azimuth';
import WindRose from 'components/icons/WindRose/WindRose';
import DomePointing from './DomePointing';
import DomeShutter from './DomeShutter';
import MountTopView from './MountTopView';
import DomeSummaryTable from './DomeSummaryTable/DomeSummaryTable';
import styles from './Dome.module.css';

export default class Dome extends Component {
  static propTypes = {
    /** Width for the diferent SVG components */
    width: PropTypes.number,
    /** Height for the diferent SVG components */
    height: PropTypes.number,
    /** Dropout door opening percentage */
    dropoutDoorOpeningPercentage: PropTypes.number,
    /** Main door opening percentage */
    mainDoorOpeningPercentage: PropTypes.number,
    /** Azimuth position */
    azimuthPosition: PropTypes.number,
    /** Azimuth state */
    azimuthState: PropTypes.string,
    /** Azimuth commanded */
    azimuthCommanded: PropTypes.number,
    /** Dome in position */
    domeInPosition: PropTypes.bool,
    /** Dropout door state */
    dropoutDoorState: PropTypes.string,
    /** Main door state */
    mainDoorState: PropTypes.string,
    /** AT mount state */
    atMountState: PropTypes.string,
    /** Mount in position */
    mountInPosition: PropTypes.bool,
    /** Track ID */
    trackID: PropTypes.number,
    /** Target azimuth */
    targetAzimuth: PropTypes.number,
    /** Target elevation */
    targetElevation: PropTypes.number,
    /** Target nasmyth1 */
    targetNasmyth1: PropTypes.number,
    /** Target nasmyth2 */
    targetNasmyth2: PropTypes.number,
    /** M3 state */
    m3State: PropTypes.string,
    /** Min nasmyth1 */
    minNas1: PropTypes.number,
    /** Min nasmyth2 */
    minNas2: PropTypes.number,
    /** Min M3 */
    minM3: PropTypes.number,
    /** Max nasmyth1 */
    maxNas1: PropTypes.number,
    /** Max nasmyth2 */
    maxNas2: PropTypes.number,
    /** Max M3 */
    maxM3: PropTypes.number,
    /** Time azimuth limit */
    timeAzLim: PropTypes.number,
    /** Time rotation limit */
    timeRotLim: PropTypes.number,
    /** Time unobservable */
    timeUnobservable: PropTypes.number,
    /** Time elevation high limit */
    timeElHighLimit: PropTypes.number,
    /** Current pointing azimuth */
    currentPointingAz: PropTypes.number,
    /** Current pointing elevation */
    currentPointingEl: PropTypes.number,
    /** Current pointing nasmyth1 */
    currentPointingNasmyth1: PropTypes.number,
    /** Current pointing nasmyth2 */
    currentPointingNasmyth2: PropTypes.number,
    /** AT dome summary state */
    atDomeSummaryState: PropTypes.string,
    /** ATMCS summary state */
    ATMCSSummaryState: PropTypes.string,
    /** Target name */
    targetName: PropTypes.string,
    /** Telescope current RA in hours */
    telescopeRAHour: PropTypes.number,
    /** Telescope current RA in degrees */
    telescopeRADeg: PropTypes.number,
    /** Telescope current Dec in degrees */
    telescopeDecDeg: PropTypes.number,
    /** Telescope rotator position in degrees */
    telescopeRotatorDeg: PropTypes.number,
    /** Whether to display the RA and DEC in hour format */
    raDecHourFormat: PropTypes.bool,
  };

  static defaultProps = {
    width: 500,
    height: 500,
  };

  constructor(props) {
    super(props);
    this.azimuthPlotRef = React.createRef();
    this.elevationPlotRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  elevationPlotInputs = {
    'Mount elevation': {
      type: 'line',
      color: 'hsl(201, 70%, 40%)',
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ATMCS',
          salindex: '0',
          topic: 'mount_AzEl_Encoders',
          item: 'elevationCalculatedAngle',
          isArray: true,
          arrayIndex: 0,
          accessor: '(x) => x[0]',
        },
      ],
    },
    'Mount target': {
      type: 'line',
      color: 'white',
      dash: [4, 1],
      values: [
        {
          variable: 'y',
          category: 'event',
          csc: 'ATMCS',
          salindex: '0',
          topic: 'target',
          item: 'elevation',
          accessor: '(x) => x',
        },
      ],
    },
  };

  azimuthPlotInputs = {
    'Dome Azimuth': {
      type: 'line',
      color: 'hsl(201, 70%, 40%)',
      dash: [4, 0],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ATDome',
          salindex: '0',
          topic: 'position',
          item: 'azimuthPosition',
          accessor: '(x) => x',
        },
      ],
    },
    'Dome Target Az': {
      type: 'line',
      color: 'hsl(201, 70%, 40%)',
      dash: [4, 1],
      values: [
        {
          variable: 'y',
          category: 'event',
          csc: 'ATDome',
          salindex: '0',
          topic: 'azimuthCommandedState',
          item: 'azimuth',
          accessor: '(x) => x',
        },
      ],
    },
    'Mount Azimuth': {
      type: 'line',
      color: 'hsl(160, 70%, 40%)',
      dash: [4, 0],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ATMCS',
          salindex: '0',
          topic: 'mount_AzEl_Encoders',
          item: 'azimuthCalculatedAngle',
          isArray: true,
          arrayIndex: 0,
          accessor: '(x) => (x[0] < 0 ? x[0] + 360 : x[0])',
        },
      ],
    },
    'Mount Target': {
      type: 'line',
      color: 'hsl(160, 70%, 40%)',
      dash: [4, 1],
      values: [
        {
          variable: 'y',
          category: 'event',
          csc: 'ATMCS',
          salindex: '0',
          topic: 'target',
          item: 'azimuth',
          accessor: '(x) => x',
        },
      ],
    },
  };

  render() {
    const {
      width,
      height,
      dropoutDoorOpeningPercentage,
      mainDoorOpeningPercentage,
      azimuthPosition,
      azimuthState,
      azimuthCommanded,
      domeInPosition,
      dropoutDoorState,
      mainDoorState,
      atMountState,
      mountInPosition,
      trackID,
      targetAzimuth,
      targetElevation,
      targetNasmyth1,
      targetNasmyth2,
      m3State,
      minNas1,
      minNas2,
      minM3,
      maxNas1,
      maxNas2,
      maxM3,
      timeAzLim,
      timeRotLim,
      timeUnobservable,
      timeElHighLimit,
      currentPointingAz,
      currentPointingEl,
      currentPointingNasmyth1,
      currentPointingNasmyth2,
      atDomeSummaryState,
      ATMCSSummaryState,
      targetName,
      telescopeRAHour,
      telescopeRADeg,
      telescopeDecDeg,
      telescopeRotatorDeg,
      raDecHourFormat,
    } = this.props;

    const isProjected = true;
    let azDiff = Math.abs(azimuthPosition - currentPointingAz);
    if (azDiff > 180) azDiff = azDiff - 360;

    const vignettingDistance = fixedFloat(Math.abs(azDiff) * Math.cos((currentPointingEl * Math.PI) / 180), 2);

    const azScaleDomain = {
      domainMax: 360,
      domainMin: 0,
    };

    const elScaleDomain = {
      domainMax: 90,
      domainMin: 0,
    };

    return (
      <div className={styles.domeContainer}>
        <div className={styles.topRow}>
          <div className={styles.skymapGridContainer}>
            <div className={styles.windRoseContainer}>
              <WindRose />
            </div>
            <div className={styles.elevationContainer}>
              <Elevation
                height={height}
                width={width}
                radius={width / 2}
                maxL3={90}
                maxL2={85}
                maxL1={80}
                minL1={10}
                minL2={5}
                minL3={0}
                currentValue={currentPointingEl}
                targetValue={targetElevation}
              />
            </div>
            <Azimuth
              className={styles.svgAzimuth}
              width={width}
              height={height}
              currentValue={azimuthPosition}
              targetValue={azimuthCommanded}
            />
            <MountTopView
              currentPointing={{
                az: currentPointingAz,
                el: currentPointingEl,
                nasmyth1: currentPointingNasmyth1,
                nasmyth2: currentPointingNasmyth2,
              }}
            />
            <DomeShutter
              width={width}
              height={height}
              azimuthPosition={azimuthPosition}
              dropoutDoorOpeningPercentage={dropoutDoorOpeningPercentage}
              mainDoorOpeningPercentage={mainDoorOpeningPercentage}
              targetAzimuthPosition={azimuthCommanded}
            />
            <DomePointing
              width={width}
              height={height}
              currentPointing={{
                az: currentPointingAz,
                el: currentPointingEl,
                nasmyth1: currentPointingNasmyth1,
                nasmyth2: currentPointingNasmyth2,
              }}
              targetPointing={{
                az: targetAzimuth,
                el: targetElevation,
                nasmyth1: targetNasmyth1,
                nasmyth2: targetNasmyth2,
              }}
              isProjected={isProjected}
            />
            <div
              className={styles.vignettingDistanceContainer}
              title="Difference between telescope and dome azimuth, multiplied by cos(telescope altitude)"
            >
              <span>Vignetting distance: </span>
              <span className={styles.value}>{vignettingDistance}°</span>
            </div>
          </div>
          <DomeSummaryTable
            currentPointing={{
              az: currentPointingAz,
              el: currentPointingEl,
              nasmyth1: currentPointingNasmyth1,
              nasmyth2: currentPointingNasmyth2,
            }}
            targetPointing={{
              az: targetAzimuth,
              el: targetElevation,
              nasmyth1: targetNasmyth1,
              nasmyth2: targetNasmyth2,
            }}
            azimuthPosition={azimuthPosition}
            azimuthCommanded={azimuthCommanded}
            domeInPosition={domeInPosition}
            azimuthState={azimuthState}
            dropoutDoorState={dropoutDoorState}
            mainDoorState={mainDoorState}
            atMountState={atMountState}
            trackID={trackID}
            mountInPosition={mountInPosition}
            m3State={m3State}
            timeAzLim={timeAzLim}
            timeRotLim={timeRotLim}
            timeUnobservable={timeUnobservable}
            timeElHighLimit={timeElHighLimit}
            maxEl={85}
            maxAz={360}
            maxNas1={maxNas1}
            maxNas2={maxNas2}
            maxM3={maxM3}
            minEl={5}
            minAz={0}
            minNas1={minNas1}
            minNas2={minNas2}
            minM3={minM3}
            atDomeSummaryState={atDomeSummaryState}
            ATMCSSummaryState={ATMCSSummaryState}
            targetName={targetName}
            telescopeRAHour={telescopeRAHour}
            telescopeRADeg={telescopeRADeg}
            telescopeDecDeg={telescopeDecDeg}
            telescopeRotatorDeg={telescopeRotatorDeg}
            raDecHourFormat={raDecHourFormat}
          />
        </div>
        <div className={styles.telemetryTable}>
          <div className={styles.azimuthSection}>
            <h2>Azimuth</h2>
            <div ref={this.azimuthPlotRef} className={styles.azimuthPlot}>
              <PlotContainer
                inputs={this.azimuthPlotInputs}
                containerNode={this.azimuthPlotRef}
                xAxisTitle="Time"
                scaleDomain={azScaleDomain}
              />
            </div>
          </div>
          <div className={styles.elevationSection}>
            <h2>Elevation</h2>
            <div ref={this.elevationPlotRef} className={styles.elevationPlot}>
              <PlotContainer
                inputs={this.elevationPlotInputs}
                containerNode={this.elevationPlotRef}
                xAxisTitle="Time"
                yAxisTitle="Elevation"
                scaleDomain={elScaleDomain}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
