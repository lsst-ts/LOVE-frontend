import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Neighbors from 'components/GeneralPurpose/Neighbors/Neighbors';
import CCDDetail from '../CCDDetail/CCDDetail';
import styles from './RaftDetail.module.css';
import { mtcameraRaftsNeighborsMapping } from 'Config';

const COLOR_MAPPING = {
  1: 'var(--status-ok-dimmed-color-3)',
  2: 'var(--status-warning-dimmed-color-3)',
  3: 'var(--status-alert-dimmed-color-3)',
};

class RaftDetail extends Component {
  constructor(props) {
    super(props);
    this.CCDsrefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];
    this.rebsRefs = [React.createRef(), React.createRef(), React.createRef()];
  }

  renderCCDsPlots() {
    const { raft, selectedCCD, selectedCCDVar, setSelectedCCD, setHoveredCCD, setHoveredReb } = this.props;
    const plots = [];
    raft.ccds.forEach((c) => {
      const ccdIndex = c.id - 1;
      plots.push({
        [`CCD${c.id}`]: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Ccd',
          item: selectedCCDVar,
          type: 'line',
          accessor: (x) => x[ccdIndex],
        },
      });
    });

    return (
      <div className={styles.ccdsContainer}>
        {plots.map((p, i) => (
          <div
            key={`c${i}`}
            ref={this.CCDsrefs[i]}
            // style={{ border: `4px solid ${COLOR_MAPPING[raft.ccds[i].status]}` }}
            style={{ border: selectedCCD?.id === raft.ccds[i].id ? '1px solid white' : `none` }}
            className={styles.plot}
            onClick={() => {
              setSelectedCCD(raft.ccds[i]);
            }}
            onMouseOver={() => {
              setHoveredCCD(raft.ccds[i]);
              setHoveredReb(null);
            }}
          >
            <PlotContainer
              memorySize={50}
              height={100}
              width={300}
              inputs={p}
              // containerNode={this.CCDsrefs[i]?.current}
              xAxisTitle="Time"
              yAxisTitle={`${selectedCCDVar} - ${raft.ccds[i].id}`}
              legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  renderRebsPlots() {
    const { raft, selectedReb, selectedRebVar, setSelectedReb, setHoveredCCD, setHoveredReb } = this.props;
    const plots = [];
    raft.rebs.forEach((r) => {
      const rebIndex = r.id - 1;
      plots.push({
        [`REB${r.id}`]: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: selectedRebVar,
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      });
    });

    return (
      <div className={styles.rebsContainer}>
        {plots.map((p, i) => (
          <div
            key={`r${i}`}
            ref={this.rebsRefs[i]}
            style={{ border: selectedReb?.id === raft.rebs[i].id ? '2px solid white' : `` }}
            className={styles.plot}
            onClick={() => {
              setSelectedCCD(raft.ccds[i]);
            }}
            onMouseOver={() => {
              setHoveredCCD(raft.ccds[i]);
              setHoveredReb(null);
            }}
          >
            <PlotContainer
              memorySize={50}
              height={100}
              width={300}
              inputs={p}
              // containerNode={this.rebsRefs[i]?.current}
              xAxisTitle="Time"
              yAxisTitle={`Value-${i}`}
              legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { raft, showNeighbors, selectedReb, selectNeighborRaft } = this.props;

    const edgesColors = {
      // top: raft.neighbors.top ? COLOR_MAPPING[raft.neighbors.top.status] : 'transparent',
      top: 'transparent',
      // right: raft.neighbors.right ? COLOR_MAPPING[raft.neighbors.right.status] : 'transparent',
      right: 'transparent',
      // bottom: raft.neighbors.bottom ? COLOR_MAPPING[raft.neighbors.bottom.status] : 'transparent',
      bottom: 'transparent',
      // left: raft.neighbors.left ? COLOR_MAPPING[raft.neighbors.left.status] : 'transparent',
      left: 'transparent',
    };
    return showNeighbors ? (
      <div className={styles.container}>
        <Neighbors edgesColors={edgesColors} selectNeighbor={selectNeighborRaft}>
          {this.renderCCDsPlots()}
          {this.renderRebsPlots()}
        </Neighbors>
      </div>
    ) : (
      <div className={styles.container}>
        {this.renderCCDsPlots()}
        {this.renderRebsPlots()}
      </div>
    );
  }
}

export default RaftDetail;
