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
import PolarPlotContainer from 'components/GeneralPurpose/Plot/PolarPlot/PolarPlot.container';
import { COLORS } from 'components/GeneralPurpose/Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import CurrentValues from './CurrentValues/CurrentValues';
import styles from './WeatherStation.module.css';

export default class WeatherStation extends Component {
  static propTypes = {
    /* Weather stream data */
    weather: PropTypes.object,
    /* Wind speed stream data */
    windSpeed: PropTypes.object,
  };

  temperaturePlot = {
    Temp: {
      type: 'line',
      color: COLORS[1],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ESS',
          salindex: this.props.salindex,
          topic: 'temperature',
          item: 'temperatureItem',
          isArray: true,
          arrayIndex: 0,
          accessor: '(x) => x[0]',
        },
      ],
    },
    DewPoint: {
      type: 'line',
      color: COLORS[2],
      orient: 'left',
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ESS',
          salindex: this.props.salindex,
          topic: 'dewPoint',
          item: 'dewPointItem',
          accessor: '(x) => x',
        },
      ],
    },
  };

  humidityPlot = {
    Humidity: {
      type: 'line',
      color: COLORS[0],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ESS',
          salindex: this.props.salindex,
          topic: 'relativeHumidity',
          item: 'relativeHumidityItem',
          accessor: '(x) => x',
        },
      ],
    },
  };

  pressurePlot = {
    'Air pressure': {
      type: 'line',
      color: COLORS[0],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ESS',
          salindex: this.props.salindex,
          topic: 'pressure',
          item: 'pressureItem',
          isArray: true,
          arrayIndex: 0,
          accessor: '(x) => x[0]',
        },
      ],
    },
  };

  solarPlot = {
    'Solar radiation': {
      type: 'line',
      color: COLORS[0],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ESS',
          salindex: this.props.salindex,
          topic: 'solarRadiation',
          item: 'solarRadiationItem',
          accessor: '(x) => x',
        },
      ],
    },
  };

  precipitationPlot = {
    Precipitation: {
      type: 'line',
      color: COLORS[0],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ESS',
          salindex: this.props.salindex,
          topic: 'rainRate',
          item: 'rainRateItem',
          accessor: '(x) => x',
        },
      ],
    },
  };

  snowDepthPlot = {
    'Snow depth': {
      type: 'line',
      color: COLORS[0],
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'ESS',
          salindex: this.props.salindex,
          topic: 'snowRate',
          item: 'snowRateItem',
          accessor: '(x) => x',
        },
      ],
    },
  };

  windPlot = {
    title: 'Time series plot',
    inputs: {
      WindSpeed: {
        category: 'telemetry',
        csc: 'ESS',
        salindex: this.props.salindex,
        topic: 'airFlow',
        item: 'speed',
        accessor: '(x) => x',
        group: 0,
        encoding: 'radial',
      },
      WindDirection: {
        category: 'telemetry',
        csc: 'ESS',
        salindex: this.props.salindex,
        topic: 'airFlow',
        item: 'direction',
        accessor: '(x) => x',
        group: 0,
        encoding: 'angular',
      },
    },
    titleBar: false,
    hasRawMode: false,
    xAxisTitle: 'Time',
    yAxisTitle: '',
    displayDome: true,
    groupTitles: ['Wind', 'Gust'],
    radialUnits: 'm/s',
    colorInterpolation:
      '(value, minValue, maxValue, group) => { \n    if(group == 1){\n        const proportion = maxValue !== minValue ? (value - minValue) / (maxValue - minValue) : 0; \n        return [255 * (1 - proportion), 255 * (1 - proportion), 255 * (1 - proportion)]; \n    }\n  const proportion = maxValue !== minValue ? (value - minValue) / (maxValue - minValue) : 0; \n  return [255 * (1 - proportion), 255, 255 * (1 - proportion)]; \n}',
    opacityInterpolation:
      '(value, minValue, maxValue, group) => {\n  if (maxValue === minValue) return 1;\n  return 0.01 + ((value - minValue) / (maxValue - minValue)) * 0.9;\n}',
  };

  constructor(props) {
    super(props);
    this.temperaturePlotRef = React.createRef();
    this.humidityPlotRef = React.createRef();
    this.windDirectionPlotRef = React.createRef();
    this.windSpeedPlotRef = React.createRef();
    this.solarPlotRef = React.createRef();
    this.pressurePlotRef = React.createRef();
    this.precipitationPlotRef = React.createRef();
    this.snowDepthPlotRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  render() {
    const currentTemperature = fixedFloat(this.props.temperature?.temperatureItem?.value[0], 2);
    const currentHumidity = fixedFloat(this.props.relativeHumidity?.relativeHumidityItem?.value, 2);
    const currentPressure = fixedFloat(this.props.pressure?.pressureItem?.value[0], 2);
    const currentWindSpeed = fixedFloat(this.props.airFlow?.speed?.value, 2);
    const currentWindSpeedUnits = this.props.airFlow?.speed?.units;

    const maxHeightPlot = 220;

    return (
      <div className={styles.container}>
        <CurrentValues
          currentTemperature={currentTemperature}
          currentHumidity={currentHumidity}
          currentPressure={currentPressure}
          currentWindSpeed={currentWindSpeed}
          currentWindSpeedUnits={currentWindSpeedUnits}
        />

        <div className={styles.windPlotSection}>
          <div className={styles.sectionTitle}>Wind</div>
          <div ref={this.windDirectionPlotRef} className={styles.windPlotContainer}>
            <div className={styles.windPlotFullWidth}>
              <PolarPlotContainer containerNode={this.windDirectionPlotRef} {...this.windPlot} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Temperature</div>
          <div ref={this.temperaturePlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.temperaturePlot}
              containerNode={this.temperaturePlotRef}
              xAxisTitle="Time"
              yAxisTitle="Temperature"
              legendPosition="bottom"
              maxHeight={maxHeightPlot}
              scaleDomain={{
                domainMax: 40,
                domainMin: -20,
              }}
            />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Humidity</div>
          <div ref={this.humidityPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.humidityPlot}
              containerNode={this.humidityPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Relative humidity"
              legendPosition="bottom"
              maxHeight={maxHeightPlot}
              scaleDomain={{
                domainMax: 100,
                domainMin: 0,
              }}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Air pressure</div>
          <div ref={this.pressurePlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.pressurePlot}
              containerNode={this.pressurePlotRef}
              xAxisTitle="Time"
              yAxisTitle="Air pressure"
              legendPosition="bottom"
              maxHeight={maxHeightPlot}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Solar radiation</div>
          <div ref={this.solarPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.solarPlot}
              containerNode={this.solarPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Solar radiation"
              legendPosition="bottom"
              maxHeight={maxHeightPlot}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Precipitation</div>
          <div ref={this.precipitationPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.precipitationPlot}
              containerNode={this.precipitationPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Precipitation"
              legendPosition="bottom"
              maxHeight={maxHeightPlot}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Snow Depth</div>
          <div ref={this.snowDepthPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.snowDepthPlot}
              containerNode={this.snowDepthPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Snow depth"
              legendPosition="bottom"
              maxHeight={maxHeightPlot}
            />
          </div>
        </div>
      </div>
    );
  }
}
