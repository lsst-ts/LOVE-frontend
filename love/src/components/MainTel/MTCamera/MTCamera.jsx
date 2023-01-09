import React, { Component } from 'react';
import * as d3 from 'd3';
import RaftDetail from './RaftDetail/RaftDetail';
import FocalPlane from './FocalPlane/FocalPlane';
import CCDDetail from './CCDDetail/CCDDetail';
import PropTypes from 'prop-types';
import styles from './MTCamera.module.css';
import FocalPlaneSummaryDetail from './FocalPlaneSummaryDetail/FocalPlaneSummaryDetail';
import { mtcameraRaftsNeighborsMapping } from 'Config';
import RebDetail from './RebDetail/RebDetail';

const rafts = [];
const secondaryCCDs = [
  0, 1, 2, 3, 4, /* 5, */ 6, /* 7, */ /* 8, */
  36, 37, 38, /* 39, */ 40, 41, /* 42, */ /* 43, */ 44,
  180, /* 181, */ /* 182, */ 183, 184, /* 185, */ 186, 187, 188,
  /* 216, */ /* 217, */ 218, /* 219, */ 220, 221, 222, 223, 224,
];
for (let i = 0; i < 25; i++) {
  const ccds = [];
  const rebs = [];
  for (let j = 0; j < 9; j++) {
    const ccdId = i * 9 + (j + 1);
    ccds.push({
      id: ccdId,
      status: !secondaryCCDs.includes(ccdId-1) ? Math.ceil(Math.random() * 3) : 0,
    });
  }
  for (let j = 0; j < 3; j++) {
    rebs.push({
      id: i * 3 + (j + 1),
    });
  }

  const neighborsIds = mtcameraRaftsNeighborsMapping[i + 1];
  rafts.push({ id: i + 1, status: 1, ccds, rebs, neighborsIds });
}
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
      selectedRaft: null,
      selectedCCD: null,
      selectedReb: null,
      hoveredRaft: null,
      hoveredCCD: null,
      hoveredReb: null,
      // selectedCCDVar: 'gDV',
      selectedCCDVar: null,
      selectedRebVar: 'anaI',
    };
  }

  setSelectedRaft = (raft) => {
    this.setState({ selectedRaft: raft });
  };

  setHoveredRaft = (raft) => {
    this.setState({ hoveredRaft: raft });
  };

  setSelectedCCD = (ccd) => {
    this.setState({ selectedCCD: ccd });
  };

  setHoveredCCD = (ccd) => {
    this.setState({ hoveredCCD: ccd });
  };

  setSelectedReb = (reb) => {
    this.setState({ selectedReb: reb });
  };

  setHoveredReb = (reb) => {
    this.setState({ hoveredReb: reb });
  };

  setSelectedCCDVar = (variable) => {
    this.setState({ selectedCCDVar: variable });
  };

  setSelectedRebVar = (variable) => {
    this.setState({ selectedRebVar: variable });
  };

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }

  findRaftById(id) {
    return rafts.find((r) => r.id === id);
  }

  findCCDById(id) {
    return { id, top: 100, right: 101, bottom: 102, left: 103 };
  }

  selectNeighborRaft = (direction) => {
    const { selectedRaft } = this.state;
    const nextRaftId = selectedRaft.neighborsIds[direction];
    if (nextRaftId) {
      const nextRaft = this.findRaftById(nextRaftId);
      this.setSelectedRaft(nextRaft);
    }
  };

  selectNeighborCCD = (direction) => {
    const { selectedCCD } = this.state;
    const nextCCDId = selectedCCD[direction];
    const nextCCD = this.findCCDById(nextCCDId);
    this.setSelectedCCD(nextCCD);
  };

  // componentDidMount() {}

  componentDidUpdate() {
    d3.select('#focalplane').call(d3.zoom().scaleExtent([0.5, 5]).on('zoom', this.zoomed));
    d3.select('#raftdetail').call(d3.zoom().scaleExtent([0.5, 5]).on('zoom', this.zoomed));
    d3.select('#ccdrebdetail').call(d3.zoom().scaleExtent([0.5, 5]).on('zoom', this.zoomed));
  }

  /**
   * Function to handle zooming in/out of the focalplane, raftdetail, and ccdrebdetail views
   * It defines a baseK value that is added to the zoom level to determine which view to show
   * Makes transformations to the shown view based on the zoom level
   * Set the activeViewId and prevActiveViewId state variables and selectedRaft, selectedCCD, and selectedRebS
   * @param {Object} d3.event - d3 event object
   */
  zoomed = () => {
    const { zoomLevel, activeViewId:targetId, prevActiveViewId:prevTargetId, selectedCCDVar } = this.state;

    let baseK = 0;
    if (targetId == null) return;
    if (targetId === 'focalplane') baseK = 0;
    else if (targetId === 'raftdetail') baseK = 1;
    else if (targetId === 'ccdrebdetail') baseK = 2;

    const k = d3.event.transform.k + baseK;
    console.log(targetId, d3.event.transform.k, baseK);
    let newActiveViewId, newPrevActiveId, newSelectedRaft, newSelectedCCD, newSelectedReb, newSelectedCCDVar;
    if (k >= 0 && k <= 1.5) {
      newActiveViewId = 'focalplane';
      newSelectedCCDVar = null;
    }
    if (k > 1.5 && k <= 2.5) {
      newActiveViewId = 'raftdetail';
      newSelectedRaft = this.state.hoveredRaft;
      newSelectedCCDVar = selectedCCDVar ?? 'gDV';
    }
    if (k > 2.5 && k <= 3.5) {
      newActiveViewId = 'ccdrebdetail';
      if (this.state.hoveredCCD) newSelectedCCD = this.state.hoveredCCD;
      else if (this.state.hoveredReb) newSelectedReb = this.state.hoveredReb;
    }

    function d3TransformToString(transform) {
      return `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`;
    }

    if (targetId === 'focalplane') {
      d3.select('#focalplane').style('transform', d3TransformToString(d3.event.transform));
      d3.select('#focalplane').style('transform-origin', '0 0');
    } else if (targetId === 'raftdetail') {
      d3.select('#raftdetail').style('transform', d3TransformToString(d3.event.transform));
      d3.select('#raftdetail').style('transform-origin', '0 0');
    } else if (targetId === 'ccdrebdetail') {
      d3.select('#ccdrebdetail').style('transform', d3TransformToString(d3.event.transform));
      d3.select('#ccdrebdetail').style('transform-origin', '0 0');
    }

    this.setState((prevState) => ({
      activeViewId: newActiveViewId,
      selectedRaft: newSelectedRaft ?? prevState.selectedRaft,
      selectedCCD: newSelectedCCD,
      selectedReb: newSelectedReb,
      selectedCCDVar: newActiveViewId === 'focalplane' ? null : newSelectedCCDVar,
      zoomLevel: k,
    }));
  };

  render() {
    const { selectedCCD, hoveredRaft, selectedRaft, hoveredCCD, hoveredReb } = this.state;
    // console.log(hoveredCCD, hoveredReb);
    return this.getComponent();
  }

  getComponent() {
    const { selectedRaft, selectedCCD, selectedReb, selectedCCDVar, selectedRebVar, zoomLevel, activeViewId } = this.state;
    const { tempControlActive, hVBiasSwitch, anaV, power, gDV, oDI, oDV, oGV, rDV, temp } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.focalPlanceContainer}>
          {zoomLevel > 2.5 && zoomLevel <= 3.5 && selectedCCD && this.getCCDdetail()}
          {zoomLevel > 2.5 && zoomLevel <= 3.5 && selectedReb && this.getRebDetail()}
          {zoomLevel > 1.5 && zoomLevel <= 2.5 && this.getRaftdetail()}
          {zoomLevel >= 0 && zoomLevel <= 1.5 && this.getMTCamera()}
        </div>
        <div className={styles.summaryDetailContainer}>
          {selectedRaft ? (
            <div className={styles.summaryDetail}>
              <FocalPlaneSummaryDetail
                activeViewId={activeViewId}
                selectedRaft={selectedRaft}
                selectedCCD={selectedCCD}
                selectedReb={selectedReb}
                selectedCCDVar={selectedCCDVar}
                selectedRebVar={selectedRebVar}
                setSelectedCCDVar={this.setSelectedCCDVar}
                setSelectedRebVar={this.setSelectedRebVar}
                tempControlActive={tempControlActive}
                hVBiasSwitch={hVBiasSwitch}
                anaV={anaV}
                power={power}
                gDV={gDV}
                oDI={oDI}
                oDV={oDV}
                oGV={oGV}
                rDV={rDV}
                temp={temp}
              />
            </div>
          ) : (
            <div className={styles.emptySummaryDetail}>Nothing to show, No CCD select</div>
          )}
        </div>
      </div>
    );
  }

  getMTCamera() {
    const { selectedRaft } = this.state;
    const { hVBiasSwitch, anaV, power, gDV, oDI, oDV, oGV, rDV, temp } = this.props;
    return (
      <div id="focalplane">
        <FocalPlane
          id="focalplane"
          rafts={rafts}
          selectedRaft={this.state.selectedRaft}
          setSelectedRaft={this.setSelectedRaft}
          setHoveredRaft={this.setHoveredRaft}
          hVBiasSwitch={hVBiasSwitch}
          anaV={anaV}
          power={power}
          gDV={gDV}
          oDI={oDI}
          oDV={oDV}
          oGV={oGV}
          rDV={rDV}
          temp={temp}
        />
      </div>
    );
  }

  getRaftdetail() {
    const { selectedRaft, selectedCCD, selectedCCDVar, selectedReb } = this.state;
    const { hVBiasSwitch, anaV, power } = this.props;

    const raftWithNeighbors = {
      ...selectedRaft,
      neighbors: {
        top: rafts.find((r) => r.id === selectedRaft.neighborsIds.top),
        right: rafts.find((r) => r.id === selectedRaft.neighborsIds.right),
        bottom: rafts.find((r) => r.id === selectedRaft.neighborsIds.bottom),
        left: rafts.find((r) => r.id === selectedRaft.neighborsIds.left),
      },
    };
    return (
      <div id="raftdetail">
        <RaftDetail
          raft={raftWithNeighbors}
          showNeighbors={true}
          selectedCCD={selectedCCD}
          selectedReb={selectedReb}
          selectedCCDVar={selectedCCDVar}
          setSelectedCCD={this.setSelectedCCD}
          setSelectedReb={this.setSelectedReb}
          setSelectedCCDVar={this.setSelectedCCDVar}
          setHoveredCCD={this.setHoveredCCD}
          setHoveredReb={this.setHoveredReb}
          selectNeighborRaft={this.selectNeighborRaft}
          hVBiasSwitch={hVBiasSwitch}
          anaV={anaV}
          power={power}
        />
      </div>
    );
  }

  getCCDdetail() {
    const { selectedCCD } = this.state;
    return (
      <div id="ccdrebdetail">
        <CCDDetail
          ccd={selectedCCD}
          showNeighbors={true}
          selectNeighborCCD={this.selectNeighborCCD}
        />
      </div>
    );
  }

  getRebDetail() {
    const { selectedReb } = this.state;
    return (
      <div id="ccdrebdetail">
        <RebDetail
          reb={selectedReb}
        />
      </div>
    );
  }
}

export default MTCamera;
