import React, { Component } from 'react';
import * as d3 from 'd3';
import RaftDetail from './RaftDetail/RaftDetail';
import FocalPlane from './FocalPlane/FocalPlane';
import CCDDetail from './CCDDetail/CCDDetail';
import PropTypes from 'prop-types';
import styles from './MTCamera.module.css';
import FocalPlaneSummaryDetail from './FocalPlaneSummaryDetail/FocalPlaneSummaryDetail';
import { mtcameraRaftsNeighborsMapping } from 'Config';

const rafts = [];
const secondaryRafts = [0, 4, 20, 24];
for (let i = 0; i < 25; i++) {
  const ccds = [];
  const rebs = [];
  if (!secondaryRafts.includes(i)) {
    for (let j = 0; j < 9; j++) {
      ccds.push({
        id: i * 9 + (j + 1),
        status: Math.ceil(Math.random() * 3),
      });
    }
    for (let j = 0; j < 3; j++) {
      rebs.push({
        id: i * 3 + (j + 1),
      });
    }
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
      selectedCCDVar: 'gDV',
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
    d3.select('#ccddetail').call(d3.zoom().scaleExtent([0.5, 5]).on('zoom', this.zoomed));
  }

  zoomed = () => {
    const { zoomLevel } = this.state;
    const targetId = this.state.activeViewId;

    let baseK = 0;
    if (targetId == null) return;
    if (targetId === 'focalplane') baseK = 0;
    else if (targetId === 'raftdetail') baseK = 1;
    else if (targetId === 'ccddetail') baseK = 2;

    const k = d3.event.transform.k + baseK;
    let newActiveViewId, newSelectedRaft;
    if (k >= 0 && k < 2) {
      newActiveViewId = 'focalplane';
    }
    if (k >= 2 && k < 3) {
      newActiveViewId = 'raftdetail';
      newSelectedRaft = this.state.hoveredRaft;
    }
    if (k >= 3 && k < 4) {
      newActiveViewId = 'ccddetail';
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
    } else if (targetId === 'ccddetail') {
      d3.select('#ccddetail').style('transform', d3TransformToString(d3.event.transform));
      d3.select('#ccddetail').style('transform-origin', '0 0');
    }

    this.setState((prevState) => ({
      activeViewId: newActiveViewId,
      selectedRaft: newSelectedRaft ?? prevState.selectedRaft,
      zoomLevel: k,
    }));
  };

  render() {
    const { selectedCCD, hoveredRaft, selectedRaft, hoveredCCD } = this.state;
    return this.getComponent();
  }

  getComponent() {
    const { selectedRaft, selectedCCD, selectedReb, selectedCCDVar, selectedRebVar, zoomLevel } = this.state;
    const { tempControlActive, hVBiasSwitch, anaV, power, gDV, oDI, oDV, oGV, rDV, temp } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.focalPlanceContainer}>
          {zoomLevel >= 3 && zoomLevel < 4 && this.getCCDdetail()}
          {zoomLevel >= 2 && zoomLevel < 3 && this.getRaftdetail()}
          {zoomLevel >= 0 && zoomLevel < 2 && this.getMTCamera()}
        </div>
        <div className={styles.summaryDetailContainer}>
          {selectedRaft ? (
            <div className={styles.summaryDetail}>
              <FocalPlaneSummaryDetail
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
      <div id="ccddetail">
        <CCDDetail
          ccd={selectedCCD}
          showNeighbors={true}
          selectNeighborCCD={this.selectNeighborCCD}
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
}

export default MTCamera;
