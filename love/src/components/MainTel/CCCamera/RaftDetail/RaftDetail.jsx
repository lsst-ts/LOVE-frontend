import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Neighbors from 'components/GeneralPurpose/Neighbors/Neighbors';
import CCDDetail from '../CCDDetail/CCDDetail';
import styles from './RaftDetail.module.css';

const COLOR_MAPPING = {
  1: 'var(--status-ok-dimmed-color-3)',
  2: 'var(--status-warning-dimmed-color-3)',
  3: 'var(--status-alert-dimmed-color-3)',
};

class RaftDetail extends Component {
  constructor(props) {
    super(props);
    const rebIndex = [0, 1, 2];
    const plotsRebs0 = [
      {
        hVBiasSwitch: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'hVBiasSwitch',
          type: 'line',
          accessor: (x) => x[0],
        },
        anaV: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'anaV',
          type: 'line',
          accessor: (x) => x[0],
        },
        power: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'power',
          type: 'line',
          accessor: (x) => x[0],
        },
      },
    ];
    const plotsRebs1 = [
      {
        hVBiasSwitch: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'hVBiasSwitch',
          type: 'line',
          accessor: (x) => x[1],
        },
        anaV: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'anaV',
          type: 'line',
          accessor: (x) => x[1],
        },
        power: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'power',
          type: 'line',
          accessor: (x) => x[1],
        },
      },
    ];
    const plotsRebs2 = [
      {
        hVBiasSwitch: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'hVBiasSwitch',
          type: 'line',
          accessor: (x) => x[2],
        },
        anaV: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'anaV',
          type: 'line',
          accessor: (x) => x[2],
        },
        power: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'power',
          type: 'line',
          accessor: (x) => x[2],
        },
      },
    ];
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
    this.rebsRefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      // React.createRef(),
      // React.createRef(),
      // React.createRef(),
      // React.createRef(),
      // React.createRef(),
      // React.createRef(),
    ];
    this.state = {
      plotsRebs0: plotsRebs0,
      plotsRebs1: plotsRebs1,
      plotsRebs2: plotsRebs2,
    };
  }

  renderCCDsPlots() {
    const { raft, selectedCCD, selectedCCDVar, setSelectedCCD, setHoveredCCD, setHoveredReb } = this.props;
    const plots = [];
    raft.ccds.forEach((c) => {
      const ccdIndex = c.id - 1;
      plots.push({
        [`CCD${c.id}`]: {
          category: 'telemetry',
          csc: 'CCCamera',
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
    return (
      <div className={styles.divContainerRebsPlot}>
        <div className={styles.plotsContainer}>
          {this.state.plotsRebs0.map((p, i) => (
            <div key={p} ref={this.rebsRefs[i]} className={styles.plot}>
              <PlotContainer
                inputs={p}
                containerNode={this.rebsRefs[i]}
                xAxisTitle="Time"
                yAxisTitle="Value"
                legendPosition="right"
              />
            </div>
          ))}
        </div>
        <div className={styles.plotsContainerRebs}>
          {this.state.plotsRebs1.map((p, i) => (
            <div key={p} ref={this.rebsRefs[i]} className={styles.plot}>
              <PlotContainer
                inputs={p}
                containerNode={this.rebsRefs[i]}
                xAxisTitle="Time"
                yAxisTitle="Value"
                legendPosition="right"
              />
            </div>
          ))}
        </div>
        <div className={styles.plotsContainer}>
          {this.state.plotsRebs2.map((p, i) => (
            <div key={p} ref={this.rebsRefs[i]} className={styles.plot}>
              <PlotContainer
                inputs={p}
                containerNode={this.rebsRefs[i]}
                xAxisTitle="Time"
                yAxisTitle="Value"
                legendPosition="right"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  // const { raft, selectedReb, selectedRebVar, setSelectedReb, setHoveredCCD, setHoveredReb } = this.props;
  // const rebsItems = ['hVBiasSwitch', 'anaV', 'power'];
  // const plots = [];
  // raft.rebs.forEach((r) => {
  //   const rebIndex = r.id - 1;
  //   plots.push({
  //     [`REB${r.id}`]: {
  //       category: 'telemetry',
  //       csc: 'CCCamera',
  //       salindex: 0,
  //       topic: 'focal_plane_Reb',
  //       item: rebsItems[r],
  //       type: 'line',
  //       accessor: (x) => x[rebIndex],
  //     },
  //   });
  // });
  // return (
  //   <div className={styles.rebsContainer}>
  //     {plots.map((p, i) => (
  //       <div
  //         key={`r${i}`}
  //         ref={this.rebsRefs[i]}
  //         style={{ border: selectedReb?.id === raft.rebs[i].id ? '2px solid white' : `` }}
  //         className={styles.plot}
  //         // onClick={() => {
  //         //   setSelectedReb(raft.rebs[i]);
  //         // }}
  //         // onMouseOver={() => {
  //         //   setHoveredReb(raft.rebs[i]);
  //         //   setHoveredCCD(null);
  //         // }}
  //       >
  //         <PlotContainer
  //           memorySize={50}
  //           height={100}
  //           width={300}
  //           inputs={p}
  //           containerNode={this.rebsRefs[i]}
  //           xAxisTitle="Time"
  //           yAxisTitle={`Value-${i}`}
  //           legendPosition="bottom"
  //         />
  //       </div>
  //     ))}
  //   </div>
  // );
  // }

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
