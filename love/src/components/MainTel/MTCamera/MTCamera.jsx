import React, { Component } from 'react';
import * as d3 from 'd3';
import RaftDetail from './RaftDetail/RaftDetail';
// import RebDetail from './RebDetail/RebDetail';
import FocalPlane from './FocalPlane/FocalPlane';
import CCDDetail from './CCDDetail/CCDDetail';
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
      activeViewId: 'mtcamera',
      selectedRaft: { id: 100, top: 1, right: 2, bottom: 3, left: 4 },
      selectedCCD: { id: 100, top: 1, right: 2, bottom: 3, left: 4 },
      hoveredRaft: null,
      hoveredCCD: null,
      hoveredReb: null,
    };
  }

  setSelectedRaft = (id) => {
    this.setState({ selectedRaft: id });
  };

  setHoveredRaft = (id) => {
    this.setState({ hoveredRaft: id });
  };

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

  findRaftById(id) {
    return { id, top: 100, right: 101, bottom: 102, left: 103 };
  }

  findCCDById(id) {
    return { id, top: 100, right: 101, bottom: 102, left: 103 };
  }

  selectNeighboorRaft = (direction) => {
    const { selectedRaft } = this.state;
    const nextRaftId = selectedRaft[direction];
    const nextRaft = this.findRaftById(nextRaftId);
    console.log(selectedRaft, direction, nextRaftId, nextraft);
    this.setState({ selectedRaft: nextRaft });
  };

  selectNeighboorCCD = (direction) => {
    const { selectedCCD } = this.state;
    const nextCCDId = selectedCCD[direction];
    const nextCCD = this.findCCDById(nextCCDId);
    console.log(selectedCCD, direction, nextCCDId, nextCCD);
    this.setState({ selectedCCD: nextCCD });
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
    d3.select('#mtcamera').call(d3.zoom().scaleExtent([0, Infinity]).on('zoom', this.zoomed));
    d3.select('#raftdetail').call(d3.zoom().scaleExtent([0, Infinity]).on('zoom', this.zoomed));
    d3.select('#ccddetail').call(d3.zoom().scaleExtent([0, Infinity]).on('zoom', this.zoomed));
  }

  zoomed = () => {
    let baseK = 0;
    // const targetId = d3.event.sourceEvent.path[8].getAttribute('id');
    const targetId = this.state.activeViewId;
    if (targetId == null) return;
    if (targetId === 'mtcamera') baseK = 0;
    else if (targetId === 'raftdetail') baseK = 2;
    else if (targetId === 'ccddetail') baseK = 4;

    const k = d3.event.transform.k + baseK;
    // console.log("K", k);
    let newActiveViewId, newSelectedRaft;
    if (k >= 0 && k < 3) {
      d3.select('#mtcamera').attr('visibility', 'visible');
      d3.select('#raftdetail').attr('visibility', 'hidden');
      d3.select('#ccddetail').attr('visibility', 'hidden');
      newActiveViewId = 'mtcamera';
    }
    if (k >= 3 && k < 5) {
      d3.select('#mtcamera').attr('visibility', 'hidden');
      d3.select('#raftdetail').attr('visibility', 'visible');
      d3.select('#ccddetail').attr('visibility', 'hidden');
      newActiveViewId = 'raftdetail';
      newSelectedRaft = this.state.hoveredRaft;
    }
    if (k >= 5 && k < 7) {
      d3.select('#mtcamera').attr('visibility', 'hidden');
      d3.select('#raftdetail').attr('visibility', 'hidden');
      d3.select('#ccddetail').attr('visibility', 'visible');
      newActiveViewId = 'ccddetail';
    }

    if (targetId === 'mtcamera') d3.select('#mtcamera').attr('transform', d3.event.transform);
    else if (targetId === 'raftdetail') d3.select('#raftdetail').attr('transform', d3.event.transform);
    else if (targetId === 'ccddetail') d3.select('#ccddetail').attr('transform', d3.event.transform);

    this.setState((prevState) => ({
      activeViewId: newActiveViewId,
      selectedRaft: newSelectedRaft,
      zoomLevel: k,
    }));
  };

  render() {
    const { selectedCCD, hoveredRaft, selectedRaft } = this.state;
    // console.log('Selected', selectedRaft);
    // console.log('Hovered', hoveredRaft);
    // console.log(this.state.activeViewId);
    return <div className={styles.container}>{this.getSvg()}</div>;
  }

  getSvg() {
    const { zoomLevel } = this.state;

    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    return (
      <svg className={styles.svgContainer} viewBox={`0 0 ${this.state.width} ${this.state.width}`}>
        {/* {zoomLevel >= 5 && zoomLevel < 7 && this.getCCDdetail()}
        {zoomLevel >= 3 && zoomLevel < 5 && this.getRaftdetail()}
        {zoomLevel >= 0 && zoomLevel < 3 && this.getMTCamera()} */}
        {this.getCCDdetail()}
        {this.getRaftdetail()}
        {this.getMTCamera()}
        {/* {this.getCCDdetail()}
        {this.getRaftdetail()} */}
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
        />
      </>
    );
  }

  getMTCamera() {
    return (
      <g id="mtcamera" pointerEvents="all" visibility="visible">
        <foreignObject
          className={styles.foreignObjectSvg}
          x="0"
          y="0"
          width={this.state.width}
          height={this.state.width + 10}
        >
          <FocalPlane
            selectedRaft={this.state.selectedRaft}
            setSelectedRaft={this.setSelectedRaft}
            setHoveredRaft={this.setHoveredRaft}
          />
        </foreignObject>
      </g>
    );
  }

  getRaftdetail() {
    const { selectedRaft } = this.state;
    return (
      <g id="raftdetail" visibility="hidden">
        <foreignObject
          className={styles.foreignObjectSvg}
          x="0"
          y="0"
          width={this.state.width}
          height={this.state.width}
        >
          <RaftDetail raft={selectedRaft} showNeighboors={true} selectNeighboorRaft={this.selectNeighboorRaft} />
        </foreignObject>
      </g>
    );
  }

  getCCDdetail() {
    const { selectedCCD } = this.state;
    return (
      <g id="ccddetail" visibility="hidden">
        <foreignObject
          className={styles.foreignObjectSvg}
          x="0"
          y="0"
          width={this.state.width}
          height={this.state.width}
        >
          <CCDDetail ccd={selectedCCD} showNeighboors={true} selectNeighboorCCD={this.selectNeighboorCCD} />
        </foreignObject>
      </g>
    );
  }
}

export default MTCamera;
