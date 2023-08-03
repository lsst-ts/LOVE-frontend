import React, { Component } from 'react';
import styles from './Plots.module.css';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';

export default class SchedulerPlots extends Component {
  constructor(props) {
    super(props);
    const plots = [
      {
        skyBrightness: {
          category: 'event',
          csc: 'Scheduler',
          salindex: this.props.salindex,
          topic: 'target',
          item: 'skyBrightness',
          type: 'line',
          accessor: (x) => x,
        },
        // Cloud: {
        //   category: 'event',
        //   csc: 'Scheduler',
        //   salindex: this.props.salindex,
        //   topic: 'target',
        //   item: 'cloud',
        //   type: 'line',
        //   accessor: (x) => x,
        // },
        // Airmass: {
        //   category: 'event',
        //   csc: 'Scheduler',
        //   salindex: this.props.salindex,
        //   topic: 'target',
        //   item: 'airmass',
        //   type: 'line',
        //   accessor: (x) => x,
        // },
        // Seeing: {
        //   category: 'event',
        //   csc: 'Scheduler',
        //   salindex: this.props.salindex,
        //   topic: 'target',
        //   item: 'seeing',
        //   type: 'line',
        //   accessor: (x) => x,
        // },
      },
    ];
    // this.refs = plots.map((plot) => {
    //   return React.createRef();
    // });
    this.refs = React.createRef();
    this.state = {
      plots: plots,
    };
  }

  renderPlots() {
    return (
      <div className={styles.plotsContainer}>
        {this.state.plots.map((p, i) => (
          <div key={p} ref={this.refs[i]} className={styles.plot}>
            <PlotContainer
              inputs={p}
              // containerNode={this.refs[i]}
              containerNode={this.refs?.current}
              xAxisTitle="Time"
              yAxisTitle="Value"
              legendPosition="right"
            />
            <div>Plot</div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return <div className={styles.container}>{this.renderPlots()}</div>;
  }
}
