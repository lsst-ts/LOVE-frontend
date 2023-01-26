import React, { Component } from 'react';
import styles from './Plots.module.css';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';

export default class SchedulerPlots extends Component {
    constructor() {
        super();
        this.refs = [
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
    };

    render() {
        return (
            <div className={styles.container}>
                {this.renderPlots()}
            </div>
        );
    };
}
