import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface, { parseCommanderData } from 'Utils';
import { DATE_TIME_FORMAT } from 'Config';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import PolarPlotContainer from 'components/GeneralPurpose/Plot/PolarPlot/PolarPlot.container';
import { COLORS } from 'components/GeneralPurpose/Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import TimeSeriesControls from 'components/GeneralPurpose/Plot/TimeSeriesControls/TimeSeriesControls';
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
    'Air temperature': {
      category: 'telemetry',
      csc: 'WeatherStation',
      salindex: this.props.salindex,
      topic: 'airTemperature',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[0],
    },
    'Soil temperature': {
      category: 'telemetry',
      csc: 'WeatherStation',
      salindex: this.props.salindex,
      topic: 'soilTemperature',
      item: 'avg1M',
      type: 'line',
      accessor: (x) => x,
      color: COLORS[1],
    },
    'Dew point': {
      category: 'telemetry',
      csc: 'WeatherStation',
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
      csc: 'WeatherStation',
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
      csc: 'WeatherStation',
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
      csc: 'WeatherStation',
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
      csc: 'WeatherStation',
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
      csc: 'WeatherStation',
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
        csc: 'WeatherStation',
        item: 'avg2M',
        group: 1,
        topic: 'windSpeed',
        accessor: '(x) => x',
        category: 'telemetry',
        encoding: 'radial',
        salindex: 1,
      },
      WindSpeed: {
        csc: 'WeatherStation',
        item: 'avg2M',
        group: 0,
        topic: 'windSpeed',
        accessor: '(x) => x',
        category: 'telemetry',
        encoding: 'radial',
        salindex: 1,
      },
      GustDirection: {
        csc: 'WeatherStation',
        item: 'value10M',
        group: 1,
        topic: 'windGustDirection',
        accessor: '(x) => x',
        category: 'telemetry',
        encoding: 'angular',
        salindex: 1,
      },
      WindDirection: {
        csc: 'WeatherStation',
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

    this.state = {
      isLive: true,
      timeWindow: 60,
      historicalData: [],
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  setHistoricalData = (startDate, timeWindow) => {
    const cscs = {
      WeatherStation: {
        1: {
          airTemperature: ['avg1M'],
          soilTemperature: ['avg1M'],
          dewPoint: ['avg1M'],
          relativeHumidity: ['avg1M'],
          airPressure: ['paAvg1M'],
          solarNetRadiation: ['avg1M'],
          precipitation: ['prSum1M'],
          snowDepth: ['avg1M'],
          windSpeed: ['avg2M'],
          windSpeed: ['avg2M'],
          windGustDirection: ['value10M'],
          windDirection: ['avg2M'],
        },
      },
    };
    const parsedDate = startDate.format('YYYY-MM-DDTHH:mm:ss');
    // historicalData
    ManagerInterface.getEFDTimeseries(parsedDate, timeWindow, cscs, '1min').then((data) => {
      const polarData = Object.keys(data)
        .filter((key) => key.includes('wind'))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});
      const plotData = Object.keys(data)
        .filter((key) => !key.includes('wind'))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});
      const parsedPolarData = parseCommanderData(polarData, 'time', 'value');
      const parsedPlotData = parseCommanderData(plotData, 'x', 'y');
      this.setState({ historicalData: { ...parsedPolarData, ...parsedPlotData } });
    });
  };

  render() {

    console.log('weather', this.props.weather);
    const currentTemperature = this.props.weather?.ambient_temp?.value;
    const currentHumidity = this.props.weather?.humidity?.value;
    const currentPressure = this.props.weather?.pressure?.value; // Math.round(this.props.weather?.pressure?.value * 100) / 100;
    const currentWindSpeed = this.props.windSpeed?.value?.value;
    const currentWindSpeedUnits = this.props.windSpeed?.value?.units;

    const timeSeriesControlsProps = {
      timeWindow: this.state.timeWindow,
      isLive: this.state.isLive,
      historicalData: this.state.historicalData,
    };

    return (
      <div className={styles.container}>
        <CurrentValues 
          currentTemperature={currentTemperature}
          currentHumidity={currentHumidity}
          currentPressure={currentPressure}
          currentWindSpeed={currentWindSpeed}
          currentWindSpeedUnits={currentWindSpeedUnits}
        />

        {this.props.controls && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Timeseries Controls</div>
            <div className={styles.timeSeriesControls}>
              <TimeSeriesControls
                setTimeWindow={(timeWindow) => this.setState({ timeWindow })}
                timeWindow={this.state.timeWindow}
                setLiveMode={(isLive) => this.setState({ isLive })}
                isLive={this.state.isLive}
                setHistoricalData={this.setHistoricalData}
              />
            </div>
            {this.props.controls && (
              <div className={styles.timeSeriesControls}>
                {this.state.isLive && (
                  <span>
                    Displaying last{' '}
                    <strong>{this.state.timeWindow != 1 ? this.state.timeWindow + ' minutes' : 'minute'}</strong> of data
                  </span>
                )}
                {!this.state.isLive && (
                  <span>
                    Displaying data from <strong>{this.state.historicalData?.[0]?.format(DATE_TIME_FORMAT)}</strong> to{' '}
                    <strong>{this.state.historicalData?.[1]?.format(DATE_TIME_FORMAT)}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className={styles.windPlotSection}>
          <div className={styles.sectionTitle}>Wind</div>
          <div ref={this.windDirectionPlotRef} className={styles.windPlotContainer}>
            <div className={styles.windPlotFullWidth}>
              <PolarPlotContainer
                timeSeriesControlsProps={timeSeriesControlsProps}
                containerNode={this.windDirectionPlotRef.current?.parentNode}
                {...this.windPlot}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Temperature</div>
          <div ref={this.temperaturePlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.temperaturePlot}
              containerNode={this.temperaturePlotRef.current?.parentNode}
              xAxisTitle="Time"
              yAxisTitle="Temperature"
              legendPosition="bottom"
              maxHeight={220}
            />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Humidity</div>
          <div ref={this.humidityPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.humidityPlot}
              containerNode={this.humidityPlotRef.current?.parentNode}
              xAxisTitle="Time"
              yAxisTitle="Relative humidity"
              legendPosition="bottom"
              maxHeight={220}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Precipitation</div>
          <div ref={this.precipitationPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.precipitationPlot}
              containerNode={this.precipitationPlotRef.current?.parentNode}
              xAxisTitle="Time"
              yAxisTitle="Precipitation"
              legendPosition="bottom"
              maxHeight={220}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Snow Depth</div>
          <div ref={this.snowDepthPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.snowDepthPlot}
              containerNode={this.snowDepthPlotRef.current?.parentNode}
              xAxisTitle="Time"
              yAxisTitle="Snow depth"
              legendPosition="bottom"
              maxHeight={220}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Solar radiation</div>
          <div ref={this.solarPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.solarPlot}
              containerNode={this.solarPlotRef.current?.parentNode}
              xAxisTitle="Time"
              yAxisTitle="Solar radiation"
              legendPosition="bottom"
              maxHeight={220}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Air pressure</div>
          <div ref={this.pressurePlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.pressurePlot}
              containerNode={this.pressurePlotRef.current?.parentNode}
              xAxisTitle="Time"
              yAxisTitle="Air pressure"
              legendPosition="bottom"
              maxHeight={220}
            />
          </div>
        </div>
      </div>
    );
  }
}
