import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as d3 from 'd3';
import Scene from './Scene/Scene';
import Info from './Info/Info';
import TemperatureGradiant from './Temperature/TemperatureGradiant';
import styles from './MainTelESS.module.css';


export default class MainTelESS extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    sensorName: PropTypes.string,
    temperatures: PropTypes.arrayOf(PropTypes.number),
    locations: PropTypes.arrayOf(PropTypes.string),
    numChannels: PropTypes.number,
    xPositions: PropTypes.arrayOf(PropTypes.number),
    yPositions: PropTypes.arrayOf(PropTypes.number),
    zPositions: PropTypes.arrayOf(PropTypes.number),
    minTemperatureLimit: PropTypes.number,
    maxTemperatureLimit: PropTypes.number,
  };

  static defaultProps = {
    sensorName: '',
    temperatures: [],
    numChannels: 0,
    xPositions: [],
    yPositions: [],
    zPositions: [],
    minTemperatureLimit: -20,
    maxTemperatureLimit: 40,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSensor: 0,
      selectedSensorData: {},
      positions: [],
      referenceId: Array.from({length: props.numChannels}).fill(0).map((_, index) => index + 1),
    };
  }

  componentDidMount() {
    this.props.subscribeToStreams();
    const positions = [];
      for(let i = 0; i < this.props.numChannels; i++) {
        positions.push({
          x: this.props.xPositions[i],
          y: this.props.yPositions[i],
          z: this.props.zPositions[i],
        });
      }
    this.setState({positions: positions});
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.numChannels !== this.props.numChannels ||
      !isEqual(prevProps.xPositions, this.props.xPositions) ||
      !isEqual(prevProps.yPositions, this.props.yPositions) ||
      !isEqual(prevProps.zPositions, this.props.zPositions)
    ) {
      const positions = [];
      for(let i = 0; i < this.props.numChannels; i++) {
        positions.push({
          x: this.props.xPositions[i],
          y: this.props.yPositions[i],
          z: this.props.zPositions[i],
        });
      }
      this.setState({positions: positions});
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  getGradiantColorX = (value) => {
    const { minTemperatureLimit, maxTemperatureLimit } = this.props;
    const colorInterpolate = d3
      .scaleLinear()
      .domain(d3.extent([minTemperatureLimit, maxTemperatureLimit]))
      .range([0, 1]);
    return TemperatureGradiant.COLOR_SCALE(1 - colorInterpolate(value));
  };

  setSensor( sensorId ) {
    const {referenceId} = this.state;
    const index = referenceId.indexOf(sensorId);
    const selectedSensorData = {
      sensorId: sensorId,
      sensorName: this.props.sensorName,
      temperature: this.props.temperatures[index],
      location: this.props.locations[index],
      position: {
        x: this.props.xPositions[index],
        y: this.props.yPositions[index],
        z: this.props.zPositions[index],
      },
    };
    this.setState({
      selectedSensor: sensorId,
      selectedSensorData: selectedSensorData,
    });
  }

  render() {

    const { selectedSensor, selectedSensorData, positions, referenceId } = this.state;
    const { temperatures, minTemperatureLimit, maxTemperatureLimit } = this.props;

    return (
      <div className={styles.sceneAndInfoPlotsContainer}>

        <div className={styles.sceneContainer}>
          <Scene
            positions={positions}
            selectedSensor={selectedSensor}
            sensorReferenceId={referenceId}
            setSensor={(id) => this.setSensor(id)}
            temperatures={temperatures}
            getGradiantColorX={this.getGradiantColorX}
          />
        </div>

        <div className={styles.infoAndPlotsContainer}>
          <div className={styles.infoContainer}>
            <Info 
              sensor={selectedSensorData}
            /> 
          </div>

          <div className={styles.tempContainer}>
            <TemperatureGradiant
              sensorReferenceId={referenceId}
              selectedId={selectedSensor}
              setpoint={selectedSensorData?.temperature}
              absoluteTemperature={temperatures}
              minTemperatureLimit={minTemperatureLimit}
              maxTemperatureLimit={maxTemperatureLimit}
            />
          </div>

          <div className={styles.plotsContainer}>

          </div>
        </div>

      </div>

    );
  } 
}
