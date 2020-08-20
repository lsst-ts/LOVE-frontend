import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import PolarPlotContainer from 'components/GeneralPurpose/Plot/PolarPlot/PolarPlot.container';
import { COLORS } from 'components/GeneralPurpose/Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import styles from './WeatherStation.module.css';

export default class WeatherStation extends Component {
  static propTypes = {
    /* Weather stream data */
    weather: PropTypes.object,
    /* Wind speed stream data */
    windSpeed: PropTypes.object,
  };

  temperaturePlot = {
    'Air temperature': {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'airTemperature',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[0],
    },
    'Soil temperature': {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'soilTemperature',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[1],
    },
    'Dew point': {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'dewPoint',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[2],
    },
  };

  humidityPlot = {
    Humidity: {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'relativeHumidity',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[0],
    },
  };

  pressurePlot = {
    'Air pressure': {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'airPressure',
      item: 'paAvg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[0],
    },
  };

  solarPlot = {
    'Solar radiation': {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'solarNetRadiation',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[0],
    },
  };

  precipitationPlot = {
    Precipitation: {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'precipitation',
      item: 'prSum1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[0],
    },
  };

  snowDepthPlot = {
    'Snow depth': {
      category: 'telemetry',
      csc: 'Environment',
      salindex: this.props.salindex,
      topic: 'snowDepth',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[0],
    },
  };

  windPlot = {
    title: 'Time series plot',
    inputs: {
      GustSpeed: {
        csc: 'Environment',
        item: 'avg2M',
        group: 1,
        topic: 'windSpeed',
        accessor: '(x) => x',
        category: 'telemetry',
        encoding: 'radial',
        salindex: 1,
      },
      WindSpeed: {
        csc: 'Environment',
        item: 'avg2M',
        group: 0,
        topic: 'windSpeed',
        accessor: '(x) => x',
        category: 'telemetry',
        encoding: 'radial',
        salindex: 1,
      },
      GustDirection: {
        csc: 'Environment',
        item: 'value10M',
        group: 1,
        topic: 'windGustDirection',
        accessor: '(x) => x',
        category: 'telemetry',
        encoding: 'angular',
        salindex: 1,
      },
      WindDirection: {
        csc: 'Environment',
        item: 'avg2M',
        group: 0,
        topic: 'windDirection',
        accessor: '(x) => x',
        category: 'telemetry',
        encoding: 'angular',
        salindex: 1,
      },
    },
    titleBar: false,
    hasRawMode: false,
    xAxisTitle: 'Time',
    yAxisTitle: '',
    displayDome: true,
    groupTitles: ['Wind', 'Gust'],
    radialUnits: 'km/s',
    colorInterpolation:
      '(value, minValue, maxValue, group) => { \n    if(group == 1){\n        const proportion = (value - minValue) / (maxValue - minValue); \n        return [255 * (1 - proportion), 255, 255 * (1 - proportion)]; \n    }\n  const proportion = (value - minValue) / (maxValue - minValue); \n  return [255 * (1 - proportion), 255 * (1 - proportion), 255]; \n}',
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
    const currentTemperature = this.props.weather?.ambient_temp?.value;
    const currentHumidity = this.props.weather?.humidity?.value;
    const currentPressure = Math.round(this.props.weather?.pressure?.value * 100) / 100;
    const currentWindSpeed = this.props.windSpeed?.value?.value;
    const currentWindSpeedUnits = this.props.windSpeed?.value?.units;
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Current values</div>
          <div className={styles.summary}>
            <div className={styles.summaryVariable}>
              <div className={styles.summaryLabel}>Temperature</div>
              <div className={styles.summaryValue}>{currentTemperature !== undefined ? `${currentTemperature}ºC` : '-'}</div>
            </div>
            <div className={styles.summaryVariable}>
              <div className={styles.summaryLabel}>Humidity</div>
              <div className={styles.summaryValue}>{currentHumidity !== undefined ? `${currentHumidity}%` : '-'}</div>
            </div>
            <div className={styles.summaryVariable}>
              <div className={styles.summaryLabel}>Pressure</div>
              <div className={styles.summaryValue}>{currentPressure ? `${currentPressure} pa` : '-'}</div>
            </div>
            <div className={styles.summaryVariable}>
              <div className={styles.summaryLabel}>Wind speed</div>
              <div className={styles.summaryValue}>
                {currentWindSpeed !== undefined
                  ? `${currentWindSpeed} ${currentWindSpeedUnits !== 'unitless' ? currentWindSpeedUnits : ''}`
                  : '-'}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.windPlotSection}>
          <div className={styles.sectionTitle}>Wind</div>
          <div className={styles.windPlotContainer}>
            <PolarPlotContainer {...this.windPlot} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Temperature</div>
          <div ref={this.temperaturePlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.temperaturePlot}
              containerNode={this.temperaturePlotRef?.current}
              xAxisTitle="Time"
              yAxisTitle="Temperature"
            />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Humidity</div>
          <div ref={this.humidityPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.humidityPlot}
              containerNode={this.humidityPlotRef?.current}
              xAxisTitle="Time"
              yAxisTitle="Relative humidity"
            />
          </div>
        </div>

        <div className={styles.doubleSection}>
          <div className={styles.sectionTitle}>Precipitation</div>
          <div ref={this.precipitationPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.precipitationPlot}
              containerNode={this.precipitationPlotRef?.current}
              xAxisTitle="Time"
              yAxisTitle="Precipitation"
            />
          </div>

          <div ref={this.snowDepthPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.snowDepthPlot}
              containerNode={this.snowDepthPlotRef?.current}
              xAxisTitle="Time"
              yAxisTitle="Snow depth"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Solar radiation</div>
          <div ref={this.solarPlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.solarPlot}
              containerNode={this.solarPlotRef?.current}
              xAxisTitle="Time"
              yAxisTitle="Solar radiation"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Air pressure</div>
          <div ref={this.pressurePlotRef} className={styles.plot}>
            <PlotContainer
              inputs={this.pressurePlot}
              containerNode={this.pressurePlotRef?.current}
              xAxisTitle="Time"
              yAxisTitle="Air pressure"
            />
          </div>
        </div>
      </div>
    );
  }
}
