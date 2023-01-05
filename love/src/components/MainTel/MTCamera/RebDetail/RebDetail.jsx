import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Neighbors from 'components/GeneralPurpose/Neighbors/Neighbors';
import styles from './RebDetail.module.css';

class RebDetail extends Component {
  constructor() {
    super();
    this.refs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];
    this.state = {};
  }
  renderPlots() {
    const plots = [
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
    ];

    return (
      <div className={styles.plotsContainer}>
        {plots.map((p, i) => (
          <div ref={this.refs[i]} className={styles.plot}>
            <PlotContainer
              inputs={p}
              containerNode={this.refs[i]}
              xAxisTitle="Time"
              yAxisTitle="Value"
              legendPosition="bottom"
            />
            <div>Plot</div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { reb, showNeighbors, selectNeighborReb } = this.props;
    return showNeighbors ? (
      <Neighbors selectNeighbor={selectNeighborReb}>{this.renderPlots()}</Neighbors>
    ) : (
      <div>{this.renderPlots()}</div>
    );
  }
}

export default RebDetail;
