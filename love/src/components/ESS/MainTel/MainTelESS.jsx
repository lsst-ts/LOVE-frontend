import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as d3 from 'd3';
import Scene from './Scene/Scene';
import Info from './Info/Info';
import Gradiant from './Gradiant/Gradiant';

import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './MainTelESS.module.css';

export default class MainTelESS extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    temperature: PropTypes.arrayOf(PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      indexArr: PropTypes.number,
      location: PropTypes.string,
      numChannels: PropTypes.number,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
    })),
    relativeHumidity: PropTypes.arrayOf(PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      location: PropTypes.string,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
    })),
    airFlow: PropTypes.arrayOf(PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      location: PropTypes.string,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
    })),
    airTurbulence: PropTypes.arrayOf(PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      location: PropTypes.string,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
    })),
    minGradiantLimit: PropTypes.number,
    maxGradiantLimit: PropTypes.number,
    option: PropTypes.oneOf(['temperature', 'relativeHumidity', 'airflow', 'airTurbulence']),
  };

  static defaultProps = {
    temperature: [{
      sensorName: '',
      value: 0,
      indexArr: 0,
      numChannels: 0,
      xPosition: 0,
      yPosition: 0,
      zPosition: 0,
    }],
    relativeHumidity: [{
      sensorName: '',
      value: 0,
      xPosition: 0,
      yPosition: 0,
      zPosition: 0,
    }],
    airFlow: [{
      sensorName: '',
      value: 0,
      xPosition: 0,
      yPosition: 0,
      zPosition: 0,
    }],
    airTurbulence: [{
      sensorName: '',
      value: 0,
      xPosition: 0,
      yPosition: 0,
      zPosition: 0,
    }],
    minGradiantLimit: -20,
    maxGradiantLimit: 40,
    option: 'temperature',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSensor: 0,
      selectedSensorData: {},
      positions: [],
      referenceIds: [],
      plot: this.getBasePlot(undefined, undefined, undefined, undefined),
    };
    this.plotRef = React.createRef();
  }

  getBasePlot(salindex, topic, item, indexArr=undefined) {
    const config = {};
    const accessor = indexArr !== undefined ? `(x) => x[${indexArr}]` : '(x) => x';
    config[`${topic}`] = {
      'type': 'line',
      // 'color': '#ff7f0e',
      'dash': [
        4,
        0
      ],
      'values': [
        {
          'variable': 'x',
          'category': 'telemetry',
          'csc': 'ESS',
          'salindex': salindex,
          'topic': topic,
          'item': 'timestamp',
          'accessor': accessor,
        },
        {
          'variable': 'y',
          'category': 'telemetry',
          'csc': 'ESS',
          'salindex': salindex,
          'topic': topic,
          'item': item,
          'accessor': accessor,
        }
      ]
    };
    return config;
  }

  componentDidMount() {
    this.props.subscribeToStreams();
    const positions = [];
    const option =  this.props.option ?? 'temperature';
    for(let i = 0; i < this.props[option].length; i++) {
      positions.push({
        x: this.props[option][i].xPosition,
        y: this.props[option][i].yPosition,
        z: this.props[option][i].zPosition,
      });
    }

    const referenceIds = Array.from({length: this.props[option].length}).fill(0).map((_, index) => index + 1);

    this.setState({
      positions: positions,
      referenceIds: referenceIds,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const option =  this.props.option ?? 'temperature';

    if (
      !isEqual(prevProps[option], this.props[option])
    ) {
      const positions = [];
      for(let i = 0; i < this.props[option].length; i++) {
        positions.push({
          x: this.props[option][i].xPosition,
          y: this.props[option][i].yPosition,
          z: this.props[option][i].zPosition,
        });
      }
      const referenceIds = Array.from({length: this.props[option].length}).fill(0).map((_, index) => index + 1);

      this.setState({
        positions: positions,
        referenceIds: referenceIds,
      });
    }

    if (prevState.selectedSensor !== this.state.selectedSensor ||
        prevProps.option !== this.props.option
    ) {
      const telemetry = this.state.selectedSensorData?.telemetry ?? 'telemetry-ESS-1-temperature';
      const indexArr = this.state.selectedSensorData?.indexArr !== undefined ? this.state.selectedSensorData?.indexArr : undefined;
      const [category, csc, salindex, topic] = telemetry.split('-');

      const option = this.props.option;
      this.setState({plot: this.getBasePlot(salindex, option, option, indexArr)});
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  getGradiantColorX = (value) => {
    const { minGradiantLimit, maxGradiantLimit } = this.props;
    const colorInterpolate = d3
      .scaleLinear()
      .domain(d3.extent([minGradiantLimit, maxGradiantLimit]))
      .range([0, 1]);
    return Gradiant.COLOR_SCALE(1 - colorInterpolate(value));
  };

  setSensor( sensorId ) {
    const { referenceIds } = this.state;
    const option =  this.props.option ?? 'temperature';
    const index = referenceIds.indexOf(sensorId);
    const selectedSensorData = {
      sensorId: sensorId,
      telemetry: this.props[option][index].telemetry,
      sensorName: this.props[option][index].sensorName,
      numChannels: this.props[option][index].numChannels,
      indexArr: this.props[option][index].indexArr,
      value: this.props[option][index].value,
      location: this.props[option][index].location,
      position: {
        x: this.props[option][index].xPosition,
        y: this.props[option][index].yPosition,
        z: this.props[option][index].zPosition,
      },
    };
    this.setState({
      selectedSensor: sensorId,
      selectedSensorData: selectedSensorData,
    });
  }

  render() {
    const { selectedSensor, selectedSensorData, positions, referenceIds } = this.state;
    const { minGradiantLimit, maxGradiantLimit, option } = this.props;
    const sensors = this.props[option] ?? [];
    const values = sensors.map((sensor) => sensor.value ?? 0) ?? [];
    
    return (
      <div className={styles.sceneAndInfoPlotsContainer}>

        <div className={styles.sceneContainer}>
          <Scene
            positions={positions}
            selectedSensor={selectedSensor}
            sensorReferenceId={referenceIds}
            setSensor={(id) => this.setSensor(id)}
            values={values}
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
            <Gradiant
              sensorReferenceId={referenceIds}
              selectedId={selectedSensor}
              setpoint={selectedSensorData?.value}
              absoluteGradiant={values}
              minGradiantLimit={minGradiantLimit}
              maxGradiantLimit={maxGradiantLimit}
              option={option}
            />
          </div>

          <div className={styles.plotsContainer}>
            <div className={styles.title}>Plot</div>
            <div className={styles.plots} ref={this.plotRef} >
              <PlotContainer
                containerNode={this.plotRef?.current}
                xAxisTitle="Time"
                legendPosition="bottom"
                inputs={this.state.plot}
              />
            </div>
          </div>
        </div>

      </div>

    );
  } 
}
