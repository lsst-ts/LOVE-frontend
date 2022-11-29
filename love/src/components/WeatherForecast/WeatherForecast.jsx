import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface, { parseCommanderData } from 'Utils';
import { DATE_TIME_FORMAT } from 'Config';
import TimeSeriesControls from 'components/GeneralPurpose/Plot/TimeSeriesControls/TimeSeriesControls';
import styles from './WeatherForecast.module.css';
import WindPlotContainer from './PlotsContainer/WindPlot.container';


export default class WeatherForecast extends Component {
  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
    /* Weather stream data */
    weather: PropTypes.object,
    /* Wind stream data */
    wind: PropTypes.object,
  };

  static defaultProps = {
    subscribeToStreams: () => undefined,
    unsubscribeToStreams: () => undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLive: true,
      timeWindow: 60,
      historicalData: [],
    };

    this.windPlotRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  setHistoricalData = (startDate, timeWindow) => {
    const cscs = {
      WeatherForecast: {
        1: {
          temperatureMax: dailyTrend['temperatureMax'],
          temperatureMin: dailyTrend['temperatureMin'],
          temperatureMean: dailyTrend['temperatureMean'],
          temperatureSpread: dailyTrend['temperatureSpread'],
          windspeedMax: dailyTrend['windspeedMax'],
          windspeedMin: dailyTrend['windspeedMin'],
          windspeedMean: dailyTrend['windspeedMean'],
          windspeedSpread: dailyTrend['windspeedSpread'],
          windDirection: dailyTrend['windDirection'],
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

    const timeSeriesControlsProps = {
      timeWindow: this.state.timeWindow,
      isLive: this.state.isLive,
      historicalData: this.state.historicalData,
    };

    return (
      <div className={styles.container}>

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


        <div className={styles.fullSection}>
          <div className={styles.sectionTitle}>Wind</div>
          <div ref={this.windPlotRef} className={styles.plot}>
            <WindPlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              containerNode={this.windPlotRef.current}
              xAxisTitle="Time"
              yAxisTitle="Wind"
              legendPosition="right"
            />
          </div>
        </div>

        {/* <div className={styles.section}>
          <div className={styles.sectionTitle}>Wind</div>
          <div ref={this.humidityPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.humidityPlot}
              containerNode={this.humidityPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Relative humidity"
              legendPosition="right"
            />
          </div>
        </div> */}

        {/* <div className={styles.section}>
          <div className={styles.sectionTitle}>Temperature</div>
          <div ref={this.precipitationPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.precipitationPlot}
              containerNode={this.precipitationPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Precipitation"
              legendPosition="right"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Preassure</div>
          <div ref={this.snowDepthPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.snowDepthPlot}
              containerNode={this.snowDepthPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Snow depth"
              legendPosition="right"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Precipitation</div>
          <div ref={this.solarPlotRef} className={styles.plot}>
            <PlotContainer
              timeSeriesControlsProps={timeSeriesControlsProps}
              inputs={this.solarPlot}
              containerNode={this.solarPlotRef}
              xAxisTitle="Time"
              yAxisTitle="Solar radiation"
              legendPosition="right"
            />
          </div>
        </div> */}

      </div>
    );
  }
}
