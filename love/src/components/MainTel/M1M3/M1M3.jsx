import React, { Component } from 'react';
import * as d3 from 'd3';

import {
  M1M3ActuatorPositions,
  M1M3ActuatorForces,
  m1m3DetailedStateMap,
  m1m3DetailedStateToStyle,
  m1m3HardpointActuatorMotionStateMap,
} from 'Config';
import ManagerInterface from 'Utils';
import Select from 'components/GeneralPurpose/Select/Select';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import CSCDetailStyles from 'components/CSCSummary/CSCDetail/CSCDetail.module.css';
import styles from './M1M3.module.css';

export default class M1M3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actuators: [],
      xRadius: 0,
      yRadius: 0,
      maxRadius: 0,
      colormap: () => '#fff',
      width: 512,
      zoomLevel: 1,
      selectedForceInput: '',
      selectedForceParameter: '',
      showActuatorsID: true,
      showHardpoints: true,
      actuatorsForce: [],
      selectedActuator: 0,
      optionsTree: null,
      forceParameters: [],
    };
  }

  static zip = (arrays) => {
    return arrays[0].map((_, i) => {
      return arrays.map((array) => {
        return array[i];
      });
    });
  };

  static getActuatorsPositions = (ids, positions) => {
    const { xPosition, yPosition, zPosition } = positions;
    // const positionsArray = M1M3.zip([xPosition, yPosition, zPosition]);
    const positionsArray = M1M3.zip([
      xPosition.map((x) => x * 39),
      yPosition.map((x) => x * 39),
      zPosition.map((x) => x * 39),
    ]);
    return positionsArray.map((position, i) => ({ id: ids[i], position }));
  };

  createColorScale = (values) => {
    const height = 300;
    const width = 10;
    const colours = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
    const colourRange = d3.range(0, 1, 1.0 / (colours.length - 1));
    colourRange.push(1);

    const colorScale = d3.scaleLinear().domain(colourRange).range(colours).interpolate(d3.interpolateHcl);

    const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);

    this.setState({
      colormap: (val) => colorScale(colorInterpolate(val)),
    });

    //Create the gradient
    const svg = d3.select('#color-scale svg').attr('width', width).attr('height', height);
    svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'force-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%')
      .selectAll('stop')
      .data(colours)
      .enter()
      .append('stop')
      .attr('offset', (d, i) => i / (colorScale.range().length - 1))
      .attr('stop-color', (d) => d);

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', 10)
      .attr('height', '100%')
      .style('fill', 'url(#force-gradient)');
  };

  actuatorSelected = (id) => {
    this.setState({ selectedActuator: id });
  };

  getActuator = (id) => {
    if (id === 0) return { id: 'None', value: 'None', state: CSCDetail.states[0] };
    const { ilcState, referenceId } = this.props;
    const { actuatorsForce } = this.state;
    const actuatorIndex = referenceId.indexOf(id);
    const actuator = {
      id,
      state: ilcState[actuatorIndex] ?? 'None',
      value: actuatorsForce[actuatorIndex] ?? 'None',
    };

    actuator.state = CSCDetail.states[actuator.state];
    return actuator;
  };

  forceInputSelected = (input) => {
    const force = input.value;
    // Using SAL info
    // const filteredParameters = Object.keys(this.state.optionsTree[force]).filter((x) => {
    //   return !['timestamp', 'priority'].includes(x);
    // });
    const filteredParameters = M1M3ActuatorForces[force];
    this.setState({
      selectedForceInput: force,
      forceParameters: filteredParameters,
    });
  };

  forceParameterSelected = (input) => {
    const force = input.value;
    this.setState({
      selectedForceParameter: force,
    });
  };

  toggleActuatorsID = (show) => {
    this.setState({ showActuatorsID: show });
  };

  toggleHardpoints = (show) => {
    this.setState({ showHardpoints: show });
  };

  componentDidMount() {
    this.props.subscribeToStreams();

    let yMax = -Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let xMin = Infinity;
    let maxRadius = 0;
    M1M3ActuatorPositions.forEach((act) => {
      if (xMax < act.position[0]) xMax = act.position[0];
      if (xMin > act.position[0]) xMin = act.position[0];
      if (yMax < act.position[1]) yMax = act.position[1];
      if (yMin > act.position[1]) yMin = act.position[1];
      if (maxRadius < Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2))) {
        maxRadius = Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2));
      }
    });

    // Using SAL info
    // ManagerInterface.getTopicData('event-telemetry').then((data) => {
    //   this.setState({ optionsTree: data.MTM1M3.event_data });
    // });

    this.setState({
      actuators: M1M3ActuatorPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    d3.select('#circle-overlay').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));

    if (
      this.state.selectedForceParameter !== prevState.selectedForceParameter ||
      this.props[this.state.selectedForceInput] !== prevProps[this.state.selectedForceInput]
    ) {
      const forceData = this.props[this.state.selectedForceInput]?.[this.state.selectedForceParameter]?.value ?? [];
      this.setState({ actuatorsForce: forceData });
    }

    if (this.state.actuators !== prevState.actuators) {
      const data = this.state.actuators.map(
        (act) => Math.sqrt(act.position[0] ** 2 + act.position[1] ** 2) / this.state.maxRadius,
      );
      this.createColorScale(data);
    }

    if (this.state.actuatorsForce !== prevState.actuatorsForce) {
      this.createColorScale(this.state.actuatorsForce);
    }

    const { xPosition, yPosition, zPosition, referenceId } = this.props;
    if (
      prevProps.xPosition !== xPosition ||
      prevProps.yPosition !== yPosition ||
      prevProps.zPosition !== zPosition ||
      prevProps.referenceId !== referenceId
    ) {
      const actuators = M1M3.getActuatorsPositions(referenceId, { xPosition, yPosition, zPosition });
      // const actuators = M1M3ActuatorPositions; // Old implementation

      let yMax = -Infinity;
      let xMax = -Infinity;
      let yMin = Infinity;
      let xMin = Infinity;
      let maxRadius = 0;
      actuators.forEach((act) => {
        if (xMax < act.position[0]) xMax = act.position[0];
        if (xMin > act.position[0]) xMin = act.position[0];
        if (yMax < act.position[1]) yMax = act.position[1];
        if (yMin > act.position[1]) yMin = act.position[1];
        if (maxRadius < Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2))) {
          maxRadius = Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2));
        }
      });
      this.setState({
        actuators,
        xRadius: (xMax - xMin) / 2,
        yRadius: (yMax - yMin) / 2,
        maxRadius,
      });
    }
  }

  zoomed = () => {
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const xRadius = this.state.xRadius + 60; // + margin of render
    const yRadius = this.state.yRadius + 60; // + margin of render

    const transformX = Math.min(
      0,
      Math.max(d3.event.transform.x, 2 * xRadius * scale - 2 * xRadius * scale * d3.event.transform.k),
    );
    const transformY = Math.min(
      0,
      Math.max(d3.event.transform.y, 2 * yRadius * scale - 2 * yRadius * scale * d3.event.transform.k),
    );

    d3.event.transform.x = transformX;
    d3.event.transform.y = transformY;

    d3.select('#scatter').attr('transform', d3.event.transform);
    // d3.select('#background-circle').attr('transform', d3.event.transform);
    // d3.select('#plot-axis').attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    const { zoomLevel, showActuatorsID, showHardpoints, forceParameters } = this.state;
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    const { forceActuatorData } = this.props;
    const { actuatorsForce } = this.state;

    const summaryState = CSCDetail.states[this.props.summaryState];
    const detailedStateValue = {
      name: m1m3DetailedStateMap[this.props.detailedState],
      class: CSCDetailStyles[m1m3DetailedStateToStyle[m1m3DetailedStateMap[this.props.detailedState]]],
    };

    const maxForce = Math.max(...actuatorsForce);
    const minForce = Math.min(...actuatorsForce);

    const selectedActuator = this.getActuator(this.state.selectedActuator);
    const forceInputs = Object.keys(M1M3ActuatorForces);

    return (
      <div className={styles.mirrorContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <div className={styles.state}>
            <Title>STATE</Title>
            <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
          </div>
          <div className={styles.state}>
            <Title>DETAILED STATE</Title>
            <span className={[detailedStateValue.class, styles.summaryState].join(' ')}>{detailedStateValue.name}</span>
          </div>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanelControls}>
          <h2 className={styles.title}>Actuators</h2>
          <div className={styles.controls}>
            <div
              style={{ width: '12em', paddingRight: '1em', borderRight: '1px solid gray' }}
              className={styles.control}
            >
              <span>Select force input:</span>
              <Select
                options={forceInputs}
                option={null}
                onChange={(selection) => this.forceInputSelected(selection)}
              />
            </div>
            <div className={styles.control}>
              <span>Select force parameter:</span>
              <Select
                options={forceParameters}
                option={null}
                onChange={(selection) => this.forceParameterSelected(selection)}
              />
            </div>
            <div className={styles.control}>
              <span>Show actuators ID:</span>
              <div className={styles.toggleContainer}>
                <span>Yes</span>
                <Toggle hideLabels={true} isLive={this.state.showActuatorsID} setLiveMode={this.toggleActuatorsID} />
                <span>No</span>
              </div>
            </div>
            <div className={styles.control}>
              <span>Show hardoints:</span>
              <div className={styles.toggleContainer}>
                <span>Yes</span>
                <Toggle hideLabels={true} isLive={this.state.showHardpoints} setLiveMode={this.toggleHardpoints} />
                <span>No</span>
              </div>
            </div>
          </div>
        </SummaryPanel>

        <div className={styles.plotSection}>
          {/* <svg className={styles.svgContainer} width={this.state.width} height={this.state.width}> */}
          <svg className={styles.svgContainer} viewBox={`0 0 ${this.state.width} ${this.state.width}`}>
            {/* <svg className={styles.svgContainer} viewBox={`0 0 ${this.state.xRadius * scale * 2} ${this.state.yRadius * scale * 2}`}> */}
            {/* <text x='0' y="10">-X</text>
            <text x="20" y="10">+X</text>
            <text x="10" y="20">+Y</text> */}

            <circle
              id="background-circle"
              className={styles.circleOverlay}
              cx={this.state.xRadius * scale + margin}
              cy={this.state.yRadius * scale + margin}
              key={'background'}
              fill={'#04070a'}
              r={this.state.maxRadius * scale * 1.15}
              pointerEvents="all"
            />

            <circle
              id="circle-overlay"
              className={styles.cursorMove}
              cx={this.state.xRadius * scale + margin}
              cy={this.state.yRadius * scale + margin}
              key={'overlay'}
              fill={'none'}
              r={this.state.maxRadius * scale * 1.15}
              pointerEvents="all"
            />

            <g id="scatter" className={styles.scatter}>
              {this.state.actuators.map((act, i) => {
                return (
                  <g key={act.id} className={styles.actuator} onClick={() => this.actuatorSelected(act.id)}>
                    <circle
                      cx={(act.position[0] + this.state.xRadius) * scale + margin}
                      cy={(act.position[1] + this.state.yRadius) * scale + margin}
                      key={act.id}
                      // fill={this.state.colormap(
                      //   Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)) / this.state.maxRadius,
                      // )}
                      fill={actuatorsForce.length > 0 ? this.state.colormap(actuatorsForce[i]) : this.state.colormap(0)}
                      r={(this.state.maxRadius * scale) / 21}
                    />
                    <text
                      x={(act.position[0] + this.state.xRadius) * scale + margin}
                      y={(act.position[1] + this.state.yRadius) * scale + margin}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className={zoomLevel > 1 && showActuatorsID ? '' : styles.hidden}
                    >
                      {act.id}
                    </text>
                  </g>
                );
              })}
            </g>

            <circle
              className={styles.borderCircleOverlay}
              cx={this.state.xRadius * scale + margin}
              cy={this.state.yRadius * scale + margin}
              fill={'none'}
              r={this.state.maxRadius * scale * 1.15}
            />

            <circle
              className={styles.hiddenCircleOverlay}
              cx={this.state.xRadius * scale + margin}
              cy={this.state.yRadius * scale + margin}
              fill={'none'}
              r={(this.state.maxRadius + 2) * scale * 1.28}
            />

            <g id="plot-axis">
              <text
                className={styles.axisLabel}
                x={this.state.xRadius * scale + margin - 5}
                y={15 * scale}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                +Y
              </text>
              <text
                className={styles.axisLabel}
                x={(this.state.xRadius * 2 + 40) * scale + margin}
                y={this.state.yRadius * scale + margin}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                +X
              </text>
              <text
                className={styles.axisLabel}
                x={this.state.xRadius * scale + margin - 5}
                y={(this.state.yRadius * 2 + 40) * scale + margin}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                -Y
              </text>
              <text
                className={styles.axisLabel}
                x={10}
                y={this.state.yRadius * scale + margin}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                -X
              </text>
            </g>
          </svg>

          <div className={styles.actuatorDetails}>
            <div className={styles.forceGradientWrapper}>
              <span>Force</span>
              <div id="color-scale" className={styles.forceGradient}>
                <svg></svg>
                <div className={styles.forceGradientLabels}>
                  <span>{maxForce} [N]</span>
                  <span>{minForce} [N]</span>
                </div>
              </div>
            </div>
            <SummaryPanel className={styles.actuatorInfo}>
              <div className={styles.actuatorValue}>
                <Title>Actuator {selectedActuator.id}</Title>
              </div>
              <div className={styles.actuatorValue}>
                <span>Actuator status:</span>
                <span className={[selectedActuator.state.class, styles.summaryState].join(' ')}>
                  {selectedActuator.state.name}
                </span>
              </div>
              <div className={styles.actuatorValue}>
                <span>Applied force:</span>
                <span>{selectedActuator.value}</span>
              </div>
            </SummaryPanel>
          </div>
        </div>
      </div>
    );
  }
}
