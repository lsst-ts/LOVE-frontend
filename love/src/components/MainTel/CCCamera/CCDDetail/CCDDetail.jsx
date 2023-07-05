import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Neighbors from 'components/GeneralPurpose/Neighbors/Neighbors';
import styles from './CCDDetail.module.css';

class CCDDetail extends Component {
  constructor(props) {
    super(props);
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
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Ccd',
          item: 'gDV',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT2: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Ccd',
          item: 'oDI',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT3: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Ccd',
          item: 'oDV',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT4: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Ccd',
          item: 'oGV',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT5: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Ccd',
          item: 'rDV',
          type: 'line',
          accessor: (x) => x,
        },
      },
      {
        PLOT6: {
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Ccd',
          item: 'temp',
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
    const { ccd, showNeighbors, selectNeighborCCD } = this.props;
    return showNeighbors ? (
      <Neighbors selectNeighbor={selectNeighborCCD}>{this.renderPlots()}</Neighbors>
    ) : (
      <div>{this.renderPlots()}</div>
    );
  }
}

export default CCDDetail;
