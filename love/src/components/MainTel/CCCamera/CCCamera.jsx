import React, { Component } from 'react';
import * as d3 from 'd3';
import RaftDetail from './RaftDetail/RaftDetail';
import FocalPlane from './FocalPlane/FocalPlane';
import CCDDetail from './CCDDetail/CCDDetail';
import PropTypes from 'prop-types';
import styles from './CCCamera.module.css';
import FocalPlaneSummaryDetail from './FocalPlaneSummaryDetail/FocalPlaneSummaryDetail';
import { cccameraRaftsNeighborsMapping } from 'Config';
import RebDetail from './RebDetail/RebDetail';

const rafts = [];

for (let i = 0; i < 1; i++) {
  const ccds = [];
  const rebs = [];
  for (let j = 0; j < 9; j++) {
    const ccdId = i * 9 + (j + 1);
    ccds.push({
      id: ccdId,
      status: 1,
    });
  }
  for (let j = 0; j < 3; j++) {
    rebs.push({
      id: i * 3 + (j + 1),
    });
  }

  rafts.push({ id: 1, status: 1, ccds, rebs });
}
class CCCamera extends Component {
  static propsTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** True if loop is active */
    tempControlActive: PropTypes.bool,
    /** HV bias switch */
    hVBiasSwitch: PropTypes.number,
    /** Analog PS voltage */
    anaV: PropTypes.number,
    /** Total power */
    power: PropTypes.number,
    /** GD 0 voltage */
    gDV: PropTypes.number,
    /**  */
    // oDI,
    /** OD 0 voltage */
    oDV: PropTypes.number,
    oGV: PropTypes.number,
    rDV: PropTypes.number,
    temp: PropTypes.number,
  };

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
    this.zoom = null;
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

  componentDidMount() {
    this.props.subscribeToStreams();
    this.zoom = d3.zoom().scaleExtent([1, 2]).on('zoom', this.zoomed);
    d3.select('#zoom-overlay').call(this.zoom);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeViewId !== this.state.activeViewId) {
      // Reset zoom level when switching views
      // a value of 1.01 is used to prevent the zoom level from being set to 1
      d3.select('#zoom-overlay').call(this.zoom.transform, d3.zoomIdentity.scale(1.01));
    }
  }

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  /**
   * Function to handle zooming in/out of the focalplane, raftdetail, and ccdrebdetail views
   * It defines a baseK value that is added to the zoom level to determine which view to show
   * Makes transformations to the shown view based on the zoom level
   * Set the activeViewId and prevActiveViewId state variables and selectedRaft, selectedCCD, and selectedRebS
   */
  zoomed = () => {
    const {
      zoomLevel,
      activeViewId: targetId,
      prevActiveViewId: prevTargetId,
      hoveredRaft,
      hoveredCCD,
      hoveredReb,
      selectedCCDVar,
      selectedCCD,
      selectedReb,
    } = this.state;

    let newActiveViewId, newSelectedRaft, newSelectedCCD, newSelectedReb, newSelectedCCDVar;
    newSelectedCCDVar = selectedCCDVar;
    newSelectedCCD = selectedCCD;
    newSelectedReb = selectedReb;
    const k = d3.event.transform.k;

    const zoomReset = k === 1;
    if (zoomReset) {
      // From raft detail to focal plane
      if (targetId === 'raftdetail') {
        newActiveViewId = 'focalplane';
        newSelectedCCD = null;
        newSelectedCCDVar = null;
      }

      // From ccdreb detail to raft detail
      if (targetId === 'ccdrebdetail') {
        newActiveViewId = 'raftdetail';
        newSelectedCCD = hoveredCCD;
        newSelectedReb = hoveredReb;
      }
    }

    const zoomIn = k > zoomLevel;
    if (zoomIn && k > 1.5) {
      // From focal plane to raft detail
      if (targetId === 'focalplane') {
        newActiveViewId = 'raftdetail';
        newSelectedRaft = hoveredRaft;
        newSelectedCCDVar = selectedCCDVar ?? 'gDV';
      }

      // From raft detail to ccdreb detail
      if (targetId === 'raftdetail') {
        newActiveViewId = 'ccdrebdetail';
        newSelectedCCD = hoveredCCD;
        newSelectedReb = hoveredReb;
      }
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
      activeViewId: newActiveViewId ?? prevState.activeViewId,
      selectedRaft: newSelectedRaft ?? prevState.selectedRaft,
      selectedCCD: newSelectedCCD,
      selectedReb: newSelectedReb,
      selectedCCDVar: newActiveViewId === 'focalplane' ? null : newSelectedCCDVar,
      zoomLevel: k,
    }));
  };

  render() {
    const { selectedCCD, hoveredRaft, selectedRaft, hoveredCCD, hoveredReb } = this.state;
    return this.getComponent();
  }

  getComponent() {
    const { selectedRaft, selectedCCD, selectedReb, selectedCCDVar, selectedRebVar, zoomLevel, activeViewId } =
      this.state;
    const { tempControlActive, hVBiasSwitch, anaV, power, gDV, oDI, oDV, oGV, rDV, temp } = this.props;

    return (
      <div className={styles.container}>
        <div id="zoom-overlay" className={styles.focalPlanceContainer}>
          <div style={{ display: activeViewId === 'ccdrebdetail' ? 'block' : 'none' }}>
            {selectedCCD && this.getCCDdetail()}
            {/* {selectedReb && this.getRebDetail()} */}
          </div>
          <div style={{ display: activeViewId === 'raftdetail' ? 'block' : 'none' }}>
            {selectedRaft && this.getRaftdetail()}
          </div>
          <div style={{ display: activeViewId === 'focalplane' ? 'block' : 'none' }}>{this.getCCCamera()}</div>
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
                // oDI={oDI}
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

  getCCCamera() {
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
          // oDI={oDI}
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

    // const raftWithNeighbors = {
    //   ...selectedRaft,
    //   neighbors: {
    //     top: rafts.find((r) => r.id === selectedRaft.neighborsIds.top),
    //     right: rafts.find((r) => r.id === selectedRaft.neighborsIds.right),
    //     bottom: rafts.find((r) => r.id === selectedRaft.neighborsIds.bottom),
    //     left: rafts.find((r) => r.id === selectedRaft.neighborsIds.left),
    //   },
    // };

    const raftWithoutNeighbors = {
      ...selectedRaft,
    };

    return (
      <div id="raftdetail">
        <RaftDetail
          raft={raftWithoutNeighbors}
          showNeighbors={false}
          selectedCCD={selectedCCD}
          selectedReb={selectedReb}
          selectedCCDVar={selectedCCDVar}
          setSelectedCCD={this.setSelectedCCD}
          setSelectedReb={this.setSelectedReb}
          setSelectedCCDVar={this.setSelectedCCDVar}
          setHoveredCCD={this.setHoveredCCD}
          setHoveredReb={this.setHoveredReb}
          // selectNeighborRaft={this.selectNeighborRaft}
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
        <CCDDetail ccd={selectedCCD} showNeighbors={false} selectNeighborCCD={this.selectNeighborCCD} />
      </div>
    );
  }

  getRebDetail() {
    const { selectedReb } = this.state;
    return (
      <div id="ccdrebdetail">
        <RebDetail reb={selectedReb} />
      </div>
    );
  }
}

export default CCCamera;