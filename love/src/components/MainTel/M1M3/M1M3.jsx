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
      selectedActuator: 0,
      showActuatorsID: true,
      showHardpoints: true,
    };
  }

  static defaultFormatter = (value) => {
    if (isNaN(value)) return value;
    return Number.isInteger(value) ? value : value.toFixed(5);
  };

  static forceTableHeaders() {
    return [
      {
        field: 'name',
        title: 'Forces',
      },
      {
        field: 'x',
        title: (
          <>
            X <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'y',
        title: (
          <>
            Y <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'z',
        title: (
          <>
            Z <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'mx',
        title: (
          <>
            MX <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'my',
        title: (
          <>
            MY <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'mz',
        title: (
          <>
            MZ <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'magnitude',
        title: (
          <>
            Magnitude <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
    ];
  }

  static mirrorPositionTableHeaders() {
    return [
      {
        field: 'name',
        title: 'Forces',
      },
      {
        field: 'x',
        title: (
          <>
            X <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'y',
        title: (
          <>
            Y <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'z',
        title: (
          <>
            Z <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'rx',
        title: (
          <>
            RX <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'ry',
        title: (
          <>
            RY <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
      {
        field: 'rz',
        title: (
          <>
            RZ <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: M1M3.defaultFormatter,
      },
    ];
  }

  createColorScale = () => {
    const height = 300,
      width = 10;
    const svg = d3.select('#color-scale svg').attr('width', width).attr('height', height);

    const colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.state.data, (d) => d.id) / 2, d3.max(this.state.data, (d) => d.id)])
      .range([this.state.colormap(0), this.state.colormap(0.5), this.state.colormap(1)]);

    const countScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.state.data, (d) => d.id)])
      .range([0, height]);

    //Calculate the variables for the temp gradient
    const numStops = 10;
    const countRange = countScale.domain();
    countRange[2] = countRange[1] - countRange[0];
    const countPoint = [];
    for (let i = 0; i < numStops; i++) {
      countPoint.push((i * countRange[2]) / (numStops - 1) + countRange[0]);
    }

    //Create the gradient
    svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'force-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data(d3.range(numStops))
      .enter()
      .append('stop')
      .attr('offset', (d, i) => countScale(countPoint[i]) / height)
      .attr('stop-color', (d, i) => colorScale(countPoint[i]));

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

  getForceTableData = () => {
    const data = {
      commanded: {
        name: 'Commanded',
        x: 0,
        y: 0,
        z: 0,
        mx: 0,
        my: 0,
        mz: 0,
        magnitude: 0,
      },
      measured: {
        name: 'Measured',
        x: 0,
        y: 0,
        z: 0,
        mx: 0,
        my: 0,
        mz: 0,
        magnitude: 0,
      },
      hardpoints: {
        name: 'Hardpoints',
        x: 0,
        y: 0,
        z: 0,
        mx: 0,
        my: 0,
        mz: 0,
        magnitude: 0,
      },
    };
    return data;
  };

  getMirrorPositionTableData = () => {
    const data = {
      hardpoints: {
        name: 'Hardpoints',
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
      },
      IMS: {
        name: 'IMS',
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
      },
    };
    return data;
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
      colormap: d3.scaleSequential((t) => d3.hsl(360, 1.0 - t * t * 0.1, 0.12 + t * t * 0.58)),
      maxRadius,
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    d3.select(`#circle-overlay-${this.props.id}`).call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
    this.createColorScale();
  }

  zoomed = () => {
    let xRadius = this.state.xRadius;
    let yRadius = this.state.yRadius;
    let scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    let id = this.props.id;
    d3.event.transform.x = Math.min(
      0,
      Math.max(d3.event.transform.x, 2 * xRadius * scale - 2 * xRadius * scale * d3.event.transform.k),
    );
    d3.event.transform.y = Math.min(
      0,
      Math.max(d3.event.transform.y, 2 * yRadius * scale - 2 * yRadius * scale * d3.event.transform.k),
    );
    d3.select(`#scatter-${id}`).attr('transform', d3.event.transform);
    d3.select(`#background-circle-${id}`).attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 50;

    const summaryState = CSCDetail.states[this.props.summaryState];
    const detailedStateValue = m1m3DetailedStateMap[this.props.detailedState];

    const selectedActuator = this.getActuator(this.state.selectedActuator);

    const forceSimpleTableData = Object.values(this.getForceTableData());
    const mirrorPositionSimpleTableData = Object.values(this.getMirrorPositionTableData());

    return (
      <div className={styles.mirrorContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <div className={styles.state}>
            <Title>STATE</Title>
            <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
          </div>
          <div className={styles.state}>
            <Title>DETAILED STATE</Title>
            <StatusText title={detailedStateValue} status={m1m3DetailedStateToStyle[detailedStateValue]} small>
              {detailedStateValue}
            </StatusText>
          </div>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanelControls}>
          <h2 className={styles.title}>Actuators</h2>
          <div className={styles.controls}>
            <div style={{ width: '12em' }} className={styles.control}>
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
          <svg className={styles.svgContainer} viewBox={`0 0 ${this.state.width} ${this.state.width}`}>
            <circle
              id={`background-circle-${this.props.id}`}
              className={styles.circleOverlay}
              cx={this.state.xRadius * scale + margin}
              cy={this.state.yRadius * scale + margin}
              key={'background'}
              fill={'#04070a'}
              r={this.state.maxRadius * scale * 1.15}
              pointerEvents="all"
            />
            <circle
              id={`circle-overlay-${this.props.id}`}
              cx={this.state.xRadius * scale + margin}
              cy={this.state.yRadius * scale + margin}
              key={'overlay'}
              fill={'none'}
              r={this.state.maxRadius * scale * 1.15}
              pointerEvents="all"
            />
            <g id={`scatter-${this.props.id}`} className={styles.scatter}>
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
                  <span>Max</span>
                  <span>Min</span>
                </div>
              </div>
            </div>
            <SummaryPanel className={styles.actuatorInfo}>
              <div className={styles.state}>
                <Title>Actuator ID:</Title>
                <span>{selectedActuator.id}</span>
              </div>
              <div className={styles.state}>
                <Title>Actuator value:</Title>
                <span>{selectedActuator.value}</span>
              </div>
            </SummaryPanel>
          </div>
        </div>

        <div className={styles.forceSummary}>
          <SimpleTable headers={M1M3.forceTableHeaders()} data={forceSimpleTableData} />
          <SimpleTable headers={M1M3.mirrorPositionTableHeaders()} data={mirrorPositionSimpleTableData} />
        </div>
      </div>
    );
  }
}
