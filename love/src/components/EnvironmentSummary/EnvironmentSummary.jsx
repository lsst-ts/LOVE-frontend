import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Skymap from './Skymap/Skymap';
import styles from './EnvironmentSummary.module.css';
import WindRose from 'components/icons/WindRose/WindRose';
import SimonyiTelescope from './Cartoons/SimonyiTelescope';
import AuxTelescope from './Cartoons/AuxTelescope';
import TemperatureIcon from 'components/icons/TemperatureIcon/TemperatureIcon';
import WindDirection from './Cartoons/WindDirection';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import TemperaturesSummary from './SummaryInformation/TemperaturesSummary';
import WeatherForecastIcon from 'components/icons/WeatherForecastIcon/WeatherForecastIcon';

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
    this.state = {
      hideIconTemperature: false,
    };
  }

  hideIconTemperature() {
    this.setState({ hideIconTemperature: true });
  }

  showIconTemperature() {
    this.setState({ hideIconTemperature: false });
  }

  componentDidMount() {
    this.setState({ test: 1 });
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
          <WindDirection windDirection={windDirection} windSpeed={windSpeed}></WindDirection>
          <div className={styles.windDirectionDetail}>
            <span>Direction: {windDirection}</span>
            <span>Speed: {windSpeed}</span>
          </div>
        </div>
        <div className={styles.windRoseContainer}>
          <WindRose />
        </div>
        <div className={styles.iconLeft}>
          <WeatherForecastIcon pictocode={isRaining ? 23 : 0} />
        </div>
        <div ref={this.containerRef} className={styles.telescopes}>
          <Skymap
            containerNode={this.containerRef?.current}
            className={styles.skymap}
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
          {!hideIconTemperature && (
            <div className={styles.iconTemperature}>
              <Hoverable className={styles.temperaturesHover}>
                <TemperatureIcon />
                <div className={styles.temperaturesSummary}>
                  <TemperaturesSummary numChannels={numChannels} temperature={temperature} location={location} />
                </div>
              </Hoverable>
            </div>
          )}
        </div>
        <div className={styles.iconRight}>
          <WeatherForecastIcon pictocode={isSnowing ? 24 : 0} />
        </div>
      </div>
    );
  }
}
