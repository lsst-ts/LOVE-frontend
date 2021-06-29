import React, { Component } from 'react';
import * as d3 from 'd3';

import {
  M1M3ActuatorPositions,
  m1m3DetailedStateMap,
  m1m3BumpTestMap,
  m1m3HardpointActuatorMotionStateMap,
  m1m3DetailedStateToStyle,
  M1M3ActuatorForces,
} from 'Config';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './M1M3.module.css';

export default class M1M3 extends Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.state = {
      data: [],
      xRadius: 0,
      yRadius: 0,
      maxRadius: 0,
      colormap: () => '#fff',
      width: 512,
      zoomLevel: 1,
      selectedForceType: 0,
      selectedForce: 0,
      showActuatorsID: true,
      showHardpoints: true,
      selectedActuator: 0,
    };
  }

  static defaultFormatter = (value) => {
    if (isNaN(value)) return value;
    return Number.isInteger(value) ? value : value.toFixed(5);
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

  forceTypeSelected = (id) => {
    this.setState({
      selectedForceType: id,
    });
  };

  actuatorSelected = (id) => {
    this.setState({
      selectedActuator: id,
    });
  };

  getActuator = (id) => {
    const actuator = { id, value: 100 * id };
    // TODO: implement obtaining data from websockets
    return actuator;
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

    this.setState({
      data: M1M3ActuatorPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      // colormap: d3.scaleSequential((t) => d3.hsl(360, 1.0 - t * t * 0.1, 0.12 + t * t * 0.58)),
      maxRadius,
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    d3.select('#circle-overlay').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
    if (this.state.data !== prevState.data) {
      // TODO: getActuatorsData
      const data = this.state.data.map(
        (act) => Math.sqrt(act.position[0] ** 2 + act.position[1] ** 2) / this.state.maxRadius,
      );
      this.createColorScale(data);
    }
  }

  zoomed = () => {
    let xRadius = this.state.xRadius;
    let yRadius = this.state.yRadius;
    let scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    d3.event.transform.x = Math.min(
      0,
      Math.max(d3.event.transform.x, 2 * xRadius * scale - 2 * xRadius * scale * d3.event.transform.k),
    );
    d3.event.transform.y = Math.min(
      0,
      Math.max(d3.event.transform.y, 2 * yRadius * scale - 2 * yRadius * scale * d3.event.transform.k),
    );
    d3.select('#scatter').attr('transform', d3.event.transform);
    d3.select('#background-circle').attr('transform', d3.event.transform);
    d3.select('#plot-axis').attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    const forceActuatorsData = this.props.forceActuatorsData;

    const summaryState = CSCDetail.states[this.props.summaryState];
    // const detailedStateValue = {name: m1m3DetailedStateMap[this.props.detailedState],
    //   class: styles[m1m3DetailedStateToStyle[m1m3DetailedStateMap[this.props.detailedState]]]};

    const maxForce = 1000;
    const minForce = 0;
    const selectedActuator = this.getActuator(this.state.selectedActuator);

    return (
      <div className={styles.mirrorContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <div className={styles.state}>
            <Title>STATE</Title>
            <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
          </div>
          <div className={styles.state}>
            <Title>DETAILED STATE</Title>
            {/* <StatusText title={detailedStateValue} status={m1m3DetailedStateToStyle[detailedStateValue]} small>
              {detailedStateValue}
            </StatusText> */}
            <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
          </div>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanelControls}>
          <h2 className={styles.title}>Actuators</h2>
          <div className={styles.controls}>
            <div
              style={{ width: '12em', paddingRight: '1em', borderRight: '1px solid gray' }}
              className={styles.control}
            >
              <span>Select type of input:</span>
              <Select options={M1M3ActuatorForces} option={null} onChange={(selection) => console.log(selection)} />
            </div>
            <div className={styles.control}>
              <span>Select force component:</span>
              <Select
                options={[1, 2, 3, 4, 5]}
                option={{ label: 1 }}
                onChange={(selection) => console.log(selection)}
              />
            </div>
            <div className={styles.control}>
              <span>Show actuators ID:</span>
              <Toggle hideLabels={true} isLive={this.state.showActuatorsID} setLiveMode={this.toggleActuatorsID} />
            </div>
            <div className={styles.control}>
              <span>Show hardoints:</span>
              <Toggle hideLabels={true} isLive={this.state.showHardpoints} setLiveMode={this.toggleHardpoints} />
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
              cx={this.state.xRadius * scale + margin}
              cy={this.state.yRadius * scale + margin}
              key={'overlay'}
              fill={'none'}
              r={this.state.maxRadius * scale * 1.15}
              pointerEvents="all"
            />
            <g id="scatter" className={styles.scatter}>
              {this.state.data.map((act) => {
                return (
                  <g key={act.id} className={styles.actuator} onClick={() => this.actuatorSelected(act.id)}>
                    <circle
                      cx={(act.position[0] + this.state.xRadius) * scale + margin}
                      cy={(act.position[1] + this.state.yRadius) * scale + margin}
                      key={act.id}
                      fill={this.state.colormap(
                        Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)) / this.state.maxRadius,
                      )}
                      r={(this.state.maxRadius * scale) / 21}
                    />
                    <text
                      x={(act.position[0] + this.state.xRadius) * scale + margin}
                      y={(act.position[1] + this.state.yRadius) * scale + margin}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className={this.state.zoomLevel > 1 ? '' : styles.hidden}
                    >
                      {act.id}
                    </text>
                  </g>
                );
              })}
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
                <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
              </div>
              <div className={styles.actuatorValue}>
                <span>Commanded force:</span>
                <span>{selectedActuator.value}</span>
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
