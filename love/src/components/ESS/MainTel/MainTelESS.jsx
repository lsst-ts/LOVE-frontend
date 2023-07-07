import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Scene from './Scene/Scene';
import Info from './Info/Info';
import TemperatureGradiant from 'components/MainTel/M1M3TS/Temperature/TemperatureGradiant';
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
  };

  static defaultProps = {
    sensorName: '',
    temperatures: [],
    numChannels: 0,
    xPositions: [],
    yPositions: [],
    zPositions: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSensor: 0,
      selectedSensorData: {},
      positions: [],
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

  setSensor( sensorId ) {
    const selectedSensorData = {
      sensorId: sensorId,
      sensorName: this.props.sensorName,
      temperature: this.props.temperatures[sensorId],
      location: this.props.locations[sensorId],
      position: {
        x: this.props.xPositions[sensorId],
        y: this.props.yPositions[sensorId],
        z: this.props.zPositions[sensorId],
      },
    };
    this.setState({
      selectedSensor: sensorId,
      selectedSensorData: selectedSensorData,
    });
  }

  render() {

    const { selectedSensor, selectedSensorData, positions } = this.state;
    const { numChannels } = this.props;
    const referenceId = Array.from({length: numChannels}).fill(0).map((_, index) => index);

    return (
      <div className={styles.sceneAndInfoPlotsContainer}>

        <div className={styles.sceneContainer}>
          <Scene
            positions={positions}
            selectedSensor={selectedSensor}
            setSensor={(id) => this.setSensor(id)}
          />
        </div>

        <div className={styles.infoAndPlotsContainer}>
          <div className={styles.infoContainer}>
            <Info 
              sensor={selectedSensorData}
            /> 
          </div>

          <div className={styles.tempContainer}>

          </div>

          <div className={styles.plotsContainer}>

          </div>
        </div>

      </div>

    );
  } 
}
