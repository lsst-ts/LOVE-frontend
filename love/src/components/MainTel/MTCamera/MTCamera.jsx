import React, { Component } from 'react';
import * as d3 from 'd3';
import RaftDetail from './RaftDetail/RaftDetail';
import RebsDetail from './RebsDetail/RebsDetail';
import FocalPlane from './FocalPlane/FocalPlane';
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
    // d3.select('#rect-overlay').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
    d3.select('#mtcamera').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
    d3.select('#raftDetail').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
  }

  zoomed = () => {
    let baseK = 0;
    const targetId = d3.event.sourceEvent.path[4].getAttribute('id');
    console.log(targetId);
    if (targetId == null) return;
    if (targetId === 'mtcamera') baseK = 0;
    else if (targetId === 'raftDetail') baseK = 2;

    const k = d3.event.transform.k + baseK;
    if (k >= 1 && k < 3) {
      d3.select('#mtcamera').attr('visibility', 'visible');
      d3.select('#raftDetail').attr('visibility', 'hidden');
    }
    if (k >= 3 && k < 5) {
      d3.select('#mtcamera').attr('visibility', 'hidden');
      d3.select('#raftDetail').attr('visibility', 'visible');
    }

    if (targetId === 'mtcamera') d3.select('#mtcamera').attr('transform', d3.event.transform);
    else if (targetId === 'raftDetail') d3.select('#raftDetail').attr('transform', d3.event.transform);

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
        {zoomLevel >= 2 && zoomLevel < 3 && this.getRaftDetail()}
        {zoomLevel >= 1 && zoomLevel < 2 && this.getMTCamera()}
        {/* {this.getBackground()} */}

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
      <g id="mtcamera" pointerEvents="all">
        <foreignObject x="0" y="0" width={this.state.width} height={this.state.width}>
          <FocalPlane />
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
