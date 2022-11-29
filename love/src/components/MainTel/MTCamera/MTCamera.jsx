import React, { Component } from 'react';
import * as d3 from 'd3';
import RaftDetail from './RaftDetail/RaftDetail';
// import RebDetail from './RebDetail/RebDetail';
import FocalPlane from './FocalPlane/FocalPlane';
import CCDDetail from './CCDDetail/CCDDetail';
import PropTypes from 'prop-types';
import styles from './MTCamera.module.css';
import MTCameraSummaryDetail from './MTCameraSummaryDetail/MTCameraSummaryDetail';

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
      activeViewId: 'focalplane',
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
    d3.select('#focalplane').call(d3.zoom().scaleExtent([0, Infinity]).on('zoom', this.zoomed));
    d3.select('#raftdetail').call(d3.zoom().scaleExtent([0, Infinity]).on('zoom', this.zoomed));
    d3.select('#ccddetail').call(d3.zoom().scaleExtent([0, Infinity]).on('zoom', this.zoomed));
  }

  zoomed = () => {
    let baseK = 0;
    const targetId = this.state.activeViewId;
    if (targetId == null) return;
    if (targetId === 'focalplane') baseK = 0;
    else if (targetId === 'raftdetail') baseK = 1;
    else if (targetId === 'ccddetail') baseK = 2;

    const k = d3.event.transform.k + baseK;
    console.log(targetId, k);
    let newActiveViewId, newSelectedRaft;
    if (k >= 0 && k < 2) {
      // d3.select('#focalplane').style('visibility', 'visible');
      // d3.select('#raftdetail').style('visibility', 'hidden');
      // d3.select('#ccddetail').style('visibility', 'hidden');
      newActiveViewId = 'focalplane';
    }
    if (k >= 2 && k < 3) {
      // d3.select('#focalplane').style('visibility', 'hidden');
      // d3.select('#raftdetail').style('visibility', 'visible');
      // d3.select('#ccddetail').style('visibility', 'hidden');
      newActiveViewId = 'raftdetail';
      newSelectedRaft = this.state.hoveredRaft;
    }
    if (k >= 3 && k < 4) {
      // d3.select('#focalplane').style('visibility', 'hidden');
      // d3.select('#raftdetail').style('visibility', 'hidden');
      // d3.select('#ccddetail').style('visibility', 'visible');
      newActiveViewId = 'ccddetail';
    }

    function d3TransformToString(transform) {
      console.log('X', transform.x);
      console.log('Y', transform.y);
      return `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`;
    }

    if (targetId === 'focalplane') d3.select('#focalplane').style('transform', d3TransformToString(d3.event.transform));
    else if (targetId === 'raftdetail')
      d3.select('#raftdetail').style('transform', d3TransformToString(d3.event.transform));
    else if (targetId === 'ccddetail')
      d3.select('#ccddetail').style('transform', d3TransformToString(d3.event.transform));

    this.setState((prevState) => ({
      activeViewId: newActiveViewId,
      selectedRaft: newSelectedRaft,
      zoomLevel: k,
    }));
  };

  render() {
    const { selectedCCD, hoveredRaft, selectedRaft, hoveredCCD } = this.state;
    // console.log('Selected', selectedCCD);
    // console.log('Hovered', hoveredCCD);
    // console.log('Selected', selectedRaft);
    // console.log('Hovered', hoveredRaft);
    // console.log(this.state.activeViewId);
    return <div className={styles.container}>{this.getComponent()}</div>;
  }

  getComponent() {
    const { zoomLevel, selectedCCD } = this.state;
    return (
      <div>
        <div>
          {zoomLevel >= 3 && zoomLevel < 4 && this.getCCDdetail()}
          {zoomLevel >= 2 && zoomLevel < 3 && this.getRaftdetail()}
          {zoomLevel >= 0 && zoomLevel < 2 && this.getMTCamera()}
        </div>
        <div>{selectedCCD ? MTCameraSummaryDetail : ''}</div>
      </div>
    );
  }

  getMTCamera() {
    return (
      <div id="focalplane" style={{ visibility: 'visible' }}>
        <FocalPlane
          id="focalplane"
          selectedRaft={this.state.selectedRaft}
          setSelectedRaft={this.setSelectedRaft}
          setHoveredRaft={this.setHoveredRaft}
        />
      </div>
    );
  }

  getRaftdetail() {
    const { selectedRaft } = this.state;
    return (
      <div id="raftdetail" /* style={{visibility: 'hidden'}} */>
        <RaftDetail raft={selectedRaft} showNeighboors={true} selectNeighboorRaft={this.selectNeighboorRaft} />
      </div>
    );
  }

  getCCDdetail() {
    const { selectedCCD } = this.state;
    return (
      <div id="ccddetail" /* style={{visibility: 'hidden'}} */>
        <CCDDetail ccd={selectedCCD} showNeighboors={true} selectNeighboorCCD={this.selectNeighboorCCD} />
      </div>
    );
  }
}

export default MTCamera;
