import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface, { parseCommanderData } from 'Utils';
import { DATE_TIME_FORMAT } from 'Config';
import TimeSeriesControls from 'components/GeneralPurpose/Plot/TimeSeriesControls/TimeSeriesControls';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import styles from './WeatherForecast.module.css';
import WindPlotContainer from './PlotsContainer/WindPlot.container';
import TemperaturePlotContainer from './PlotsContainer/TemperaturePlot.container';
import RainPlotContainer from './PlotsContainer/RainPlot.container';
import CloudPlotContainer from './PlotsContainer/CloudPlot.container';
import InfoHeader from './InfoHeader/InfoHeader';
import WEATHER from './WeatherForecastInputs.json';


export default class WeatherForecast extends Component {
  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
    /* Weather stream data */
    weather: PropTypes.object,    
    controls: PropTypes.bool,
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
  }

  constructor(props) {
    super(props);
    this.state = {
      frecuency: 'daily',
    };

    this.frecuencyOptions = ['daily', 'hourly'];

    this.windPlotRef = React.createRef();
    this.temperaturePlotRef = React.createRef();
    this.rainPlotRef = React.createRef();
    this.cloudPlotRef = React.createRef();

  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  render() {

    const weatherForecastState = {
      class: styles.ok,
      name: 'ENABLED'
    };

    return (
      <div className={styles.container}>
        
        <div className={styles.weatherForecastControls}>
          <span className={styles.title}>WeatherForecast</span>
          <span className={[weatherForecastState.class, styles.weatherForecastState].join(' ')}>{weatherForecastState.name}</span>
          <span>
            <div className={styles.toggleContainer}>
              <Toggle
                labels={['14 days', '28 hours']}
                isLive={this.state.frecuency === this.frecuencyOptions[1]}
                setLiveMode={(optionHours) => this.setState({frecuency: optionHours ? this.frecuencyOptions[1] : this.frecuencyOptions[0]})}
              />
            </div>
          </span>
        </div>

        {this.props.infoHeader && (
          <div className={styles.fullSection}>
            <InfoHeader
              frecuency={this.state.frecuency}
            />
          </div>
        )}

        {this.props.cloud && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Cloud</div>
            <div ref={this.cloudPlotRef} className={styles.plot}>
              <CloudPlotContainer
                containerNode={this.cloudPlotRef.current}
                xAxisTitle="Time"
                yAxisTitle=""
                legendPosition="bottom"
                inputs={this.props.weather[this.state.frecuency]?.['cloud'] ?? {}}
              />
            </div>
          </div>
        )}

        {this.props.wind && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Wind</div>
            <div ref={this.windPlotRef} className={styles.plot}>
              <WindPlotContainer
                containerNode={this.windPlotRef.current}
                xAxisTitle="Time"
                yAxisTitle="Wind"
                legendPosition="bottom"
                inputs={this.props.weather[this.state.frecuency]?.['wind'] ?? {}}
              />
            </div>
          </div>
        )}

        {this.props.temperature && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Temperature</div>
            <div ref={this.temperaturePlotRef} className={styles.plot}>
              <TemperaturePlotContainer
                containerNode={this.temperaturePlotRef.current}
                xAxisTitle="Time"
                yAxisTitle="Temperature"
                legendPosition="bottom"
                inputs={this.props.weather[this.state.frecuency]?.['temperature'] ?? {}}
              />
            </div>
          </div>
        )}

        {this.props.rain && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Rain</div>
            <div ref={this.rainPlotRef} className={styles.plot}>
              <RainPlotContainer
                containerNode={this.rainPlotRef.current}
                xAxisTitle="Time"
                yAxisTitle="Precipitation"
                legendPosition="bottom"
                inputs={this.props.weather[this.state.frecuency]?.['rain'] ?? {}}
              />
            </div>
          </div>
        )}

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

      </div>
    );
  }
}
