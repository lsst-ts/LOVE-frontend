import React, { Component } from 'react';
import * as d3 from 'd3';

import { M1M3ActuatorPositions } from 'Config.js';
import { m1m3DetailedStateMap, m1m3BumpTestMap, m1m3HardpointActuatorMotionStateMap } from 'Config';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
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
      width: 500,
      zoomLevel: 1,
      selectedActuator: null,
    };
  }

  static getActuator(id) {
    console.log(this.props);
    const actuator = { id };
    // TODO: implement obtaining data from websockets
    return actuator;
  }

  actuatorSelected(id) {
    this.setState({
      selectedActuator: M1M3.getActuator(id),
    });
  }

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
      if (maxRadius < Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)))
        maxRadius = Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2));
    });

    this.setState({
      data: M1M3ActuatorPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius: maxRadius,
      colormap: d3.scaleSequential((t) => d3.hsl(360, 1.0 - t * t * 0.1, 0.12 + t * t * 0.58) + ''),
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    d3.select('#circle-overlay-' + this.props.id).call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
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
    d3.select('#scatter-' + id).attr('transform', d3.event.transform);
    d3.select('#background-circle-' + id).attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 50;

    // Telemetry
    // Events
    const summaryStateValue = m1m3DetailedStateMap[this.props.summaryState];
    const detailedStateValue = m1m3DetailedStateMap[this.props.detailedState];

    return (
      <div className={styles.mirrorContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <Title>STATE</Title>
          <StatusText title={summaryStateValue} status={summaryStateValue}>
            {summaryStateValue}
          </StatusText>
          <Title>DETAILED STATE</Title>
          <StatusText title={detailedStateValue} status={detailedStateValue}>
            {detailedStateValue}
          </StatusText>
        </SummaryPanel>
        {/* <SummaryPanel className={styles.summaryPanelControls}>
        </SummaryPanel> */}
        <svg className={styles.svgContainer} height={this.props.height + 'px'} width={this.state.width + 'px'}>
          <circle
            id={'background-circle-' + this.props.id}
            className={styles.circleOverlay}
            cx={this.state.xRadius * scale + margin}
            cy={this.state.yRadius * scale + margin}
            key={'background'}
            fill={'#04070a'}
            r={this.state.maxRadius * scale * 1.15}
            pointerEvents="all"
          />
          <g id={'scatter-' + this.props.id} className={styles.scatter}>
            {this.state.data.map((act) => {
              return (
                <>
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
                    className={this.state.zoomLevel > 2 ? '' : styles.hidden}
                  >
                    {act.id}
                  </text>
                </>
              );
            })}
          </g>
          <circle
            id={'circle-overlay-' + this.props.id}
            cx={this.state.xRadius * scale + margin}
            cy={this.state.yRadius * scale + margin}
            key={'overlay'}
            fill={'none'}
            r={this.state.maxRadius * scale * 1.15}
            pointerEvents="all"
          />
        </svg>
      </div>
    );
  }
}
