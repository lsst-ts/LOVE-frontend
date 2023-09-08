/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import Skymap from './Skymap/Skymap';
import styles from './EnvironmentSummary.module.css';
import SimonyiTelescope from './Cartoons/SimonyiTelescope';
import AuxTelescope from './Cartoons/AuxTelescope';
import WindDirection from './Cartoons/WindDirection';
import TemperaturesSummary from './SummaryInformation/TemperaturesSummary';
import WeatherForecastIcon from 'components/icons/WeatherForecastIcon/WeatherForecastIcon';
import { defaultNumberFormatter } from 'Utils';

export default class EnvironmentSummary extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Is the simonyi telescope tracking? */
    simonyiTrackingState: PropTypes.bool,
    /** Simonyi telescope altitude */
    simonyiAltitude: PropTypes.number,
    /** Simonyi telescope azimuth */
    simonyiAzimuth: PropTypes.number,
    /** Simonyi telescope rotator position */
    simonyiRotator: PropTypes.number,
    /** Simonyi dome altitude position */
    simonyiDomeAlt: PropTypes.number,
    /** Simonyi dome azimuth position */
    simonyiDomeAz: PropTypes.number,
    /** Expected RA of the moon */
    simonyiMoonRa: PropTypes.number,
    /** Expected Dec of the moon */
    simonyiMoonDec: PropTypes.number,
    /** Expected moon phase/illumination (0-1) */
    simonyiMoonPhase: PropTypes.number,
    /** Expected sun RA */
    simonyiSunRa: PropTypes.number,
    /** Expected sun dec. */
    simonyiSunDec: PropTypes.number,
    /** Is the auxiliary telescope tracking? */
    auxtelTrackingState: PropTypes.bool,
    /** Auxiliary telescope altitude */
    auxtelAltitude: PropTypes.number,
    /** Auxiliary telescope azimuth */
    auxtelAzimuth: PropTypes.number,
    /** Auxiliary telescope rotator position */
    auxtelRotator: PropTypes.number,
    /** Auxiliary dome altitude position */
    auxtelDomeAlt: PropTypes.number,
    /** Auxiliary dome azimuth position */
    auxtelDomeAz: PropTypes.number,
    /** Is it raining? */
    isRaining: PropTypes.bool,
    /** Is it snowing? */
    isSnowing: PropTypes.bool,
    /** Circular mean wind direction: 0 = north, 90 = east */
    windDirection: PropTypes.number,
    /** Median (mean for some sensors) wind speed */
    windSpeed: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {};
  }

  hideIconTemperature() {
    this.setState({ hideIconTemperature: true });
  }

  showIconTemperature() {
    this.setState({ hideIconTemperature: false });
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const {
      simonyiTrackingState,
      simonyiRa,
      simonyiDec,
      simonyiAltitude,
      simonyiAzimuth,
      simonyiRotator,
      simonyiDomeAlt,
      simonyiDomeAz,
      simonyiMoonRa,
      simonyiMoonDec,
      simonyiMoonPhase,
      simonyiSunRa,
      simonyiSunDec,
      auxtelTrackingState,
      auxtelRa,
      auxtelDec,
      auxtelAltitude,
      auxtelAzimuth,
      auxtelRotator,
      auxtelDomeAlt,
      auxtelDomeAz,
      isRaining,
      isSnowing,
      numChannels,
      temperature,
      location,
      windDirection,
      windSpeed,
    } = this.props;
    const { hideIconTemperature } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.windDirection}>
          <WindDirection windDirection={windDirection} windSpeed={windSpeed} />
          <div className={styles.windDirectionDetail}>
            <span>Direction: {defaultNumberFormatter(windDirection, 2)}°</span>
            <span>Speed: {defaultNumberFormatter(windSpeed, 2)} m/s</span>
          </div>
        </div>
        <div className={styles.temperaturesContainer}>
          <TemperaturesSummary numChannels={numChannels} temperature={temperature} location={location} />
        </div>
        <div ref={this.containerRef} className={styles.telescopes}>
          <div className={styles.skymap}>
            <Skymap
              containerNode={this.containerRef?.current}
              simonyiRa={simonyiRa}
              simonyiDec={simonyiDec}
              simonyiMoonRa={simonyiMoonRa}
              simonyiMoonDec={simonyiMoonDec}
              simonyiSunRa={simonyiSunRa}
              simonyiSunDec={simonyiSunDec}
              simonyiMoonPhase={simonyiMoonPhase}
              auxtelRa={auxtelRa}
              auxtelDec={auxtelDec}
            />
            <div className={styles.weatherIcons}>
              <WeatherForecastIcon pictocode={isRaining ? 23 : 0} />
              <WeatherForecastIcon pictocode={isSnowing ? 24 : 0} />
            </div>
          </div>
          <SimonyiTelescope
            className={styles.simonyi}
            simonyiTrackingState={simonyiTrackingState}
            simonyiAltitude={simonyiAltitude}
            simonyiAzimuth={simonyiAzimuth}
            simonyiRotator={simonyiRotator}
            simonyiDomeAlt={simonyiDomeAlt}
            simonyiDomeAz={simonyiDomeAz}
            auxtelRa={auxtelRa}
            auxtelDec0={auxtelDec}
            hideIconTemperature={() => this.hideIconTemperature()}
            showIconTemperature={() => this.showIconTemperature()}
          />
          <AuxTelescope
            className={styles.auxTel}
            auxtelTrackingState={auxtelTrackingState}
            auxtelAltitude={auxtelAltitude}
            auxtelAzimuth={auxtelAzimuth}
            auxtelRotator={auxtelRotator}
            auxtelDomeAlt={auxtelDomeAlt}
            auxtelDomeAz={auxtelDomeAz}
            hideIconTemperature={() => this.hideIconTemperature()}
            showIconTemperature={() => this.showIconTemperature()}
          />
        </div>
      </div>
    );
  }
}
