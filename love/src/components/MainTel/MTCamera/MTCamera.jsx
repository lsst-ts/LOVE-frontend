import React, { Component } from 'react';
import * as d3 from 'd3';
import RaftDetail from './RaftDetail/RaftDetail';
import RebsDetail from './RebsDetail/RebsDetail';
import PropTypes from 'prop-types';
import styles from './MTCamera.module.css';

class MTCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xRadius: 0,
      yRadius: 0,
      maxRadius: 0,
      colormap: () => '#fff',
      width: 480,
      zoomLevel: 1,
    };
  }

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }

  disableScroll = () => {
    document.addEventListener('wheel', this.preventDefault, {
      passive: false,
    });
  };

  enableScroll = () => {
    document.removeEventListener('wheel', this.preventDefault, false);
  };

  componentDidMount() {
    let yMax = -Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let xMin = Infinity;
    let maxRadius = 0;

    xMin = -150;
    xMax = 160;
    yMin = -150;
    yMax = 160;
    maxRadius = 160;

    this.setState({
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentDidUpdate() {
    d3.select('#rect-overlay').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
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

    // d3.event.transform.x = Math.floor(transformX);
    // d3.event.transform.y = Math.floor(transformY);

    const raftTransform = d3.zoomIdentity
      .translate(d3.event.transform.x + 100, d3.event.transform.y + 100)
      .scale(d3.event.transform.k - 1);
    // const raftTransform = d3.zoomIdentity.translate(d3.event.transform.x, d3.event.transform.y).scale(d3.event.transform.k-2);
    console.log(d3.event.transform, raftTransform);

    // d3.select('#scatter').attr('transform', d3.event.transform);
    // d3.select('#mirror-hole').attr('transform', d3.event.transform);
    // d3.select('#background-circle').attr('transform', d3.event.transform);
    // d3.select('#plot-axis').attr('transform', d3.event.transform);
    d3.select('#mtcamera').attr('transform', d3.event.transform);
    d3.select('#raftDetail').attr('transform', raftTransform);
    // d3.event.transform.k = d3.event.transform.k - 2;
    // d3.select('#raftDetail').attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    return <div className={styles.container}>{this.getSvg()}</div>;
  }

  getSvg() {
    const { zoomLevel } = this.state;
    console.log(zoomLevel);

    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    return (
      <svg
        className={styles.svgContainer}
        viewBox={`0 0 ${this.state.width} ${this.state.width}`}
        // onMouseEnter={this.disableScroll}
        // onMouseLeave={this.enableScroll}
      >
        {zoomLevel >= 1 && zoomLevel < 2 && this.getMTCamera()}
        {zoomLevel >= 2 && zoomLevel < 3 && this.getRaftDetail()}
        {this.getBackground()}

        {/* {zoomLevel > 2 && zoomLevel < 3 && (
          <foreignObject x="50" y="50" width="160" height="160">
            <div style={{ backgroundColor: 'red', height: '100%', width: '100%' }}>Hola 2</div>
          </foreignObject>
        )} */}
      </svg>
    );
  }

  getBackground() {
    return (
      <>
        <rect
          id="rect-overlay"
          x={0}
          y={0}
          width={this.state.width}
          height={this.state.width}
          key={'overlay'}
          fill={'none'}
          pointerEvents="all"
          // onMouseEnter={this.enableScroll}
          // onMouseLeave={this.disableScroll}
        />
      </>
    );
  }

  getMTCamera() {
    return (
      <g id="mtcamera">
        <foreignObject x="0" y="0" width={this.state.width} height={this.state.width}>
          <div
            style={{
              backgroundColor: 'darkgray',
              borderColor: 'red',
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span>MTCamera component</span>
          </div>
        </foreignObject>
      </g>
    );
  }

  getRaftDetail() {
    return (
      <g id="raftDetail">
        <foreignObject x="0" y="0" width={this.state.width} height={this.state.width}>
          <RaftDetail />
        </foreignObject>
      </g>
    );
  }
}

export default MTCamera;
