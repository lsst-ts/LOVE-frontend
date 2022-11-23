import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './RebDetail.module.css';
import { rgb } from 'd3';

class RebDetail extends Component {
  constructor() {
    super();
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
    const refs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];
    return (
      <div className={styles.plotsContainer}>
        {plots.map((p, i) => (
          <div ref={refs[i]} className={styles.plot}>
            <PlotContainer
              inputs={p}
              containerNode={refs[i]}
              xAxisTitle="Time"
              yAxisTitle="Value"
              // legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { reb, selectNeighboorReb } = this.props;
    const barHeight = 20;
    return (
      <div className={styles.container} style={{ padding: barHeight }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: barHeight,
            backgroundColor: 'rgb(255,0,0,.5)',
          }}
          onClick={() => selectNeighboorReb('top')}
        >
          UP
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: barHeight,
            backgroundColor: 'rgb(255,50,0,.5)',
            transformOrigin: 'center',
            transform: 'rotate(90deg) translate(50%, -230px)',
          }}
          onClick={() => selectNeighboorReb('right')}
        >
          RIGHT
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: barHeight,
            backgroundColor: 'rgb(255,150,50,.5)',
          }}
          onClick={() => selectNeighboorReb('bottom')}
        >
          BOTTOM
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: barHeight,
            backgroundColor: 'rgb(50,255,50,.5)',
            transformOrigin: 'center',
            transform: 'rotate(90deg) translate(50%, 230px)',
          }}
          onClick={() => selectNeighboorReb('left')}
        >
          LEFT
        </div>
        {this.renderPlots()}
      </div>
    );
  }
}

export default RebDetail;
