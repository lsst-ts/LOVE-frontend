import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
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
    this.state = {
      raftId: '',
    };
  }

  renderCCDsPlots() {
    return (
      <div className={styles.ccdsContainer}>
        {ccds.map((ccd, i) => (
          <CCDDetail ccd={ccd} selectNeighboorCCD={this.selectNeighboorCCD} />
        ))}
      </div>
    );
  }

  renderRebsPlots() {
    const plots = [
      {
        REB1: {
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
        REB2: {
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
        REB3: {
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

    const refs = [React.createRef(), React.createRef(), React.createRef()];

    return (
      <div className={styles.rebsContainer}>
        {plots.map((p, i) => (
          <div ref={refs[i]} className={styles.plot}>
            {/* <PlotContainer
              inputs={p}
              containerNode={refs[i]}
              xAxisTitle="Time"
              yAxisTitle="Value"
              legendPosition="bottom"
            /> */}
            <div style={{ backgroundColor: 'green', width: '70px', height: '20px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <span>RaftDetail component</span>
        {this.renderCCDsPlots()}
        {this.renderRebsPlots()}
      </div>
    );
  }
}

export default RaftDetail;
