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
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import InfoHeaderContainer from './InfoHeader/InfoHeader.container';
import {weatherForecastStateMap, weatherForecastStatetoStyle} from 'Config';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
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

    this.frecuencyOptions = ['daily', 'hourly'];
    this.sliceSizeOptions = {'daily': 15, 'hourly': 382};
    this.temporalFormatOptions = {'daily': '%Y-%m-%d', 'hourly': '%H:%M:%S'};

    this.windPlotRef = React.createRef();
    this.temperaturePlotRef = React.createRef();
    this.rainPlotRef = React.createRef();
    this.cloudPlotRef = React.createRef();

    this.state = {
      frecuency: 'daily',
      cloud: WEATHER['cloud'],
      wind: WEATHER['wind'],
      temperature: WEATHER['temperature'],
      rain: WEATHER['rain'],
      sliceSize: this.sliceSizeOptions['daily'],
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

  getTopicWithFrecuency(prevTopic, frecuency){
    if (prevTopic === 'dailyTrend' || prevTopic === 'hourlyTrend') {
      if (frecuency === 'daily') return 'dailyTrend';
      if (frecuency === 'hourly') return 'hourlyTrend';
    } else {
      return prevTopic;
    }
  }

  getInput(plotName, frecuency) {
    const inputs = this.props.weather[plotName];
    let newInputs = {};
    Object.entries(inputs).forEach(([name, input]) => {
      newInputs[name] = {};
      Object.entries(input).forEach(([key, value]) => {
        if (key === 'values') {
          newInputs[name]['values'] = [];
          value.forEach((v) => {
            let newValue = v;
            newValue['topic'] = this.getTopicWithFrecuency(v.topic, frecuency);
            newInputs[name][key].push(newValue);
          })
        } else {
          newInputs[name][key] = value;
        }
      });
    });
    return newInputs;
  }

  toggleFrecuency(optionHourly) {
    const option = optionHourly ? this.frecuencyOptions[1] : this.frecuencyOptions[0];
    this.setState({
      frecuency: option,
      cloud: this.getInput('cloud', option),
      wind: this.getInput('wind', option),
      temperature: this.getInput('temperature', option),
      rain: this.getInput('rain', option),
      sliceSize: this.getSliceSize(option),
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
                labels={['14 days', '28 hours']}
                isLive={this.state.frecuency === this.frecuencyOptions[1]}
                setLiveMode={(optionHours) => this.toggleFrecuency(optionHours)}
              />
            </div>
          </span>
        </div>

        {this.props.infoHeader && (
          <div className={styles.fullSection}>
            <InfoHeaderContainer
              frecuency={this.state.frecuency}
            />
          </div>
        )}

        {this.props.cloud && (
          <div className={styles.fullSection}>
            <div className={styles.sectionTitle}>Cloud</div>
            <div ref={this.cloudPlotRef} className={styles.plot}>
              <PlotContainer
                containerNode={this.cloudPlotRef.current}
                xAxisTitle="Time"
                yAxisTitle="Cloud"
                legendPosition="bottom"
                inputs={this.state.cloud}
                sliceSize={this.state.sliceSize}
                temporalXAxisFormat={this.state.temporalXAxisFormat}
                isForecast={true}
                scaleDomain={{domainMin: 0, domainMax:100}}
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
                containerNode={this.windPlotRef.current}
                xAxisTitle="Time"
                yAxisTitle="Wind"
                legendPosition="bottom"
                inputs={this.state.wind}
                sliceSize={this.state.sliceSize}
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
                containerNode={this.temperaturePlotRef.current}
                xAxisTitle="Time"
                yAxisTitle="Temperature"
                legendPosition="bottom"
                inputs={this.state.temperature}
                sliceSize={this.state.sliceSize}
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
                containerNode={this.rainPlotRef.current}
                xAxisTitle="Time"
                yAxisTitle="Precipitation"
                legendPosition="bottom"
                inputs={this.state.rain}
                sliceSize={this.state.sliceSize}
                temporalXAxisFormat={this.state.temporalXAxisFormat}
                isForecast={true}
                scaleIndependent={true}
                scaleDomain={{domainMin: 0, domainMax:100}}
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
