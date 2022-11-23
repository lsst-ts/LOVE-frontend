import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './RaftDetail.module.css';

class RaftDetail extends Component {
  renderCCDsPlots() {
    const plots = [
      {
        CCD1: {
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
        CCD2: {
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
        CCD3: {
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
        CCD4: {
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
        CCD5: {
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
        CCD6: {
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
        CCD7: {
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
        CCD8: {
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
        CCD9: {
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
    const refs = [
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
    return (
      <div className={styles.ccdsContainer}>
        {plots.map((p, i) => (
          <div ref={refs[i]} className={styles.plot}>
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
