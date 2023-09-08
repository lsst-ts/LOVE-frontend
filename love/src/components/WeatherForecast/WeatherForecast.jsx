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
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import styles from './WeatherForecast.module.css';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import InfoHeaderContainer from './InfoHeader/InfoHeader.container';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import WEATHER from './WeatherForecastInputs.json';

export default class WeatherForecast extends Component {
  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
    /* Weather stream data */
    weather: PropTypes.object,
    infoHeader: PropTypes.bool,
    cloud: PropTypes.bool,
    wind: PropTypes.bool,
    temperature: PropTypes.bool,
    rain: PropTypes.bool,
  };

  static defaultProps = {
    subscribeToStreams: () => undefined,
    unsubscribeToStreams: () => undefined,
    weather: WEATHER,
  };

  constructor(props) {
    super(props);

    this.frecuencyOptions = ['daily', 'hourly'];
    this.sliceSizeOptions = { daily: 14, hourly: 48 };
    this.temporalFormatOptions = { daily: '%Y-%m-%d', hourly: '%d, %H:%M' };
    this.deltaTimeOptions = { daily: 60 * 60 * 24, hourly: 60 * 60 };
    this.sliceInvert = { daily: false, hourly: true };
    this.sizeLimit = { daily: 14, hourly: 382 };

    this.windPlotRef = React.createRef();
    this.temperaturePlotRef = React.createRef();
    this.rainPlotRef = React.createRef();
    this.cloudPlotRef = React.createRef();
    this.cloudComplementPlotRef = React.createRef();

    this.state = {
      frecuency: 'daily',
      cloud: WEATHER['daily']['cloud'],
      cloudComplement: WEATHER['daily']['cloudComplement'],
      wind: WEATHER['daily']['wind'],
      temperature: WEATHER['daily']['temperature'],
      rain: WEATHER['daily']['rain'],
      sliceSize: this.sliceSizeOptions['daily'],
      sliceInvert: false,
      temporalXAxisFormat: this.temporalFormatOptions['daily'],
    };
  }

  getTemporalFormat(frecuency) {
    if (frecuency === this.frecuencyOptions[0] || frecuency === this.frecuencyOptions[1]) {
      return this.temporalFormatOptions[frecuency];
    } else {
      this.temporalFormatOptions[this.frecuencyOptions[0]]; // DEFAULT
    }
  }

  getSliceSize(frecuency) {
    if (frecuency === this.frecuencyOptions[0] || frecuency === this.frecuencyOptions[1]) {
      return this.sliceSizeOptions[frecuency];
    } else {
      return this.sliceSizeOptions[this.frecuencyOptions[0]]; // DEFAULT
    }
  }

  getInput(plotName, frecuency) {
    return this.props.weather[frecuency][plotName];
  }

  toggleFrecuency(optionHourly) {
    const option = optionHourly ? this.frecuencyOptions[1] : this.frecuencyOptions[0];
    this.setState({
      frecuency: option,
      cloud: this.getInput('cloud', option),
      cloudComplement: this.getInput('cloudComplement', option),
      wind: this.getInput('wind', option),
      temperature: this.getInput('temperature', option),
      rain: this.getInput('rain', option),
      sliceSize: this.getSliceSize(option),
      sliceInvert: this.sliceInvert[option],
      sizeLimit: this.sizeLimit[option],
      temporalXAxisFormat: this.getTemporalFormat(option),
    });
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  render() {
    const { weatherForecastState } = this.props;
    const summaryState = CSCDetail.states[weatherForecastState];
    const detailedStateValue = {
      name: summaryState.name,
      class: summaryState.class,
    };

    return (
      <div className={styles.container}>
        <div className={styles.weatherForecastControls}>
          <span className={styles.title}>WeatherForecast</span>
          <span className={[detailedStateValue.class, styles.weatherForecastState].join(' ')}>{summaryState.name}</span>
          <span>
            <div className={styles.toggleContainer}>
              <Toggle
                labels={['14 days', '48 hours']}
                toggled={this.state.frecuency === this.frecuencyOptions[1]}
                onToggle={(optionHours) => this.toggleFrecuency(optionHours)}
              />
            </div>
          </span>
        </div>

        {this.props.infoHeader && (
          <div className={styles.fullSection}>
            <InfoHeaderContainer frecuency={this.state.frecuency} />
          </div>
        )}

        {this.props.cloud && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Cloud</div>
            <div ref={this.cloudPlotRef} className={styles.plot}>
              <PlotContainer
                containerNode={this.cloudPlotRef}
                xAxisTitle="Time"
                yAxisTitle=""
                legendPosition=""
                inputs={this.state.cloud}
                sliceSize={this.state.sliceSize}
                sliceInvert={this.state.sliceInvert}
                sizeLimit={this.state.sizeLimit}
                temporalXAxisFormat={this.state.temporalXAxisFormat}
                isForecast={true}
                scaleDomain={{ domainMin: 0, domainMax: 100 }}
                maxHeight={130}
              />
            </div>
            <div ref={this.cloudComplementPlotRef} className={styles.plot}>
              <PlotContainer
                containerNode={this.cloudComplementPlotRef}
                xAxisTitle="Time"
                yAxisTitle="Cloud"
                legendPosition="bottom"
                inputs={this.state.cloudComplement}
                sliceSize={this.state.sliceSize}
                sliceInvert={this.state.sliceInvert}
                sizeLimit={this.state.sizeLimit}
                temporalXAxisFormat={this.state.temporalXAxisFormat}
                isForecast={true}
                scaleDomain={{ domainMin: 0, domainMax: 100 }}
                scaleIndependent={true}
              />
            </div>
          </div>
        )}

        {this.props.wind && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Wind</div>
            <div ref={this.windPlotRef} className={styles.plot}>
              <PlotContainer
                containerNode={this.windPlotRef}
                xAxisTitle="Time"
                yAxisTitle=""
                legendPosition="bottom"
                inputs={this.state.wind}
                sliceSize={this.state.sliceSize}
                sliceInvert={this.state.sliceInvert}
                sizeLimit={this.state.sizeLimit}
                temporalXAxisFormat={this.state.temporalXAxisFormat}
                isForecast={true}
              />
            </div>
          </div>
        )}

        {this.props.temperature && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Temperature</div>
            <div ref={this.temperaturePlotRef} className={styles.plot}>
              <PlotContainer
                containerNode={this.temperaturePlotRef}
                xAxisTitle="Time"
                yAxisTitle="Temperature"
                legendPosition="bottom"
                inputs={this.state.temperature}
                sliceSize={this.state.sliceSize}
                sliceInvert={this.state.sliceInvert}
                sizeLimit={this.state.sizeLimit}
                temporalXAxisFormat={this.state.temporalXAxisFormat}
                isForecast={true}
              />
            </div>
          </div>
        )}

        {this.props.rain && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Rain</div>
            <div ref={this.rainPlotRef} className={styles.plot}>
              <PlotContainer
                containerNode={this.rainPlotRef}
                xAxisTitle="Time"
                yAxisTitle=""
                legendPosition="bottom"
                inputs={this.state.rain}
                sliceSize={this.state.sliceSize}
                sliceInvert={this.state.sliceInvert}
                sizeLimit={this.state.sizeLimit}
                temporalXAxisFormat={this.state.temporalXAxisFormat}
                isForecast={true}
                scaleIndependent={true}
                scaleDomain={{ domainMin: 0, domainMax: 100 }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
