import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Neighboors from 'components/GeneralPurpose/Neighboors/Neighboors';
import CCDDetail from '../CCDDetail/CCDDetail';
import styles from './RaftDetail.module.css';

const ccds = [
  { id: 101, top: 1, right: 2, bottom: 3, left: 4 },
  { id: 102, top: 5, right: 2, bottom: 3, left: 6 },
  { id: 103, top: 7, right: 8, bottom: 3, left: 4 },
  { id: 104, top: 9, right: 10, bottom: 11, left: 12 },
  { id: 105, top: 13, right: 21, bottom: 23, left: 43 },
  { id: 106, top: 14, right: 22, bottom: 31, left: 44 },
  { id: 107, top: 15, right: 23, bottom: 31, left: 47 },
  { id: 108, top: 16, right: 24, bottom: 23, left: 43 },
  { id: 109, top: 17, right: 26, bottom: 31, left: 42 },
];
class RaftDetail extends Component {
  constructor(props) {
    super(props);
    this.refs = [
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
  }

  renderCCDsPlots() {
    const ccds = [
      {
        PLOT1: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT2: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT3: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT4: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT5: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT6: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT7: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT8: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT9: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      },
    ];

    return (
      <div className={styles.ccdsContainer}>
        {ccds.map((ccd, i) => (
          <div ref={this.refs[i]} className={styles.plot}>
            <PlotContainer
              inputs={ccd}
              containerNode={this.refs[i]}
              xAxisTitle="Time"
              yAxisTitle="Value"
              legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  renderRebsPlots() {
    const { raft, selectedReb, setSelectedReb } = this.props;
    const plots = [];
    raft.rebs.forEach((r) => {
      plots.push({
        [`REB${r.id}`]: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
      });
    });

    const refs = [React.createRef(), React.createRef(), React.createRef()];

    return (
      <div className={styles.rebsContainer}>
        {plots.map((p, i) => (
          <div
            key={`r${i}`}
            ref={refs[i]}
            style={{ border: selectedReb?.id === raft.rebs[i].id ? '2px solid white' : `` }}
            className={styles.plot}
            onClick={() => {
              setSelectedReb(raft.rebs[i]);
            }}
          >
            <PlotContainer
              inputs={p}
              containerNode={refs[i]}
              xAxisTitle="Time"
              yAxisTitle="Value"
              legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  // render() {
  //   const { ccd, showNeighboors, selectNeighboorCCD } = this.props;
  //   const barHeight = 20;
  //   return showNeighboors ? (
  //     <Neighboors selectNeighboor={selectNeighboorCCD}>{this.renderPlots()}</Neighboors>
  //   ) : (
  //     <div style={{ height: '100%' }}>{this.renderPlots()}</div>
  //   );
  // }

  render() {
    const { raft, showNeighboors, selectedReb, selectNeighboorRaft } = this.props;
    const barHeight = 20;
    return showNeighboors ? (
      <Neighboors selectNeighboor={selectNeighboorRaft}>
        {this.renderCCDsPlots()}
        {this.renderRebsPlots()}
      </Neighboors>
    ) : (
      <div style={{ height: '100%' }}>
        <span>RaftDetail component</span>
        {this.renderCCDsPlots()}
        {this.renderRebsPlots()}
      </div>
    );

    // return (
    //   <div className={styles.container}>
    //     <span>RaftDetail component</span>
    //     {this.renderCCDsPlots()}
    //     {this.renderRebsPlots()}
    //   </div>
    // );
  }
}

export default RaftDetail;
