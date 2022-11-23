import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './CCDDetail.module.css';
import { rgb } from 'd3';

class CCDDetail extends Component {
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
      /* React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(), */
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
              legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { ccd, selectNeighboorCCD } = this.props;
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
          onClick={() => selectNeighboorCCD('top')}
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
            transform: 'translate(calc(50% - 10px), calc(240px - 10px)) rotate(90deg)',
          }}
          onClick={() => selectNeighboorCCD('right')}
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
          onClick={() => selectNeighboorCCD('bottom')}
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
            // transform: 'rotate(90deg) translate(-90%, 0)',
            transform: 'translate(calc(-50% + 10px), calc(240px - 10px)) rotate(90deg)',
          }}
          onClick={() => selectNeighboorCCD('left')}
        >
          LEFT
        </div>
        {this.renderPlots()}
      </div>
    );
  }
}

export default CCDDetail;
