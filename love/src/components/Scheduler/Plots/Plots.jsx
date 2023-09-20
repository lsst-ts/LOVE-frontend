/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

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
        Cloud: {
          category: 'event',
          csc: 'Scheduler',
          salindex: this.props.salindex,
          topic: 'target',
          item: 'cloud',
          type: 'line',
          accessor: (x) => x,
        },
        Airmass: {
          category: 'event',
          csc: 'Scheduler',
          salindex: this.props.salindex,
          topic: 'target',
          item: 'airmass',
          type: 'line',
          accessor: (x) => x,
        },
        Seeing: {
          category: 'event',
          csc: 'Scheduler',
          salindex: this.props.salindex,
          topic: 'target',
          item: 'seeing',
          type: 'line',
          accessor: (x) => x,
        },
      },
    ];
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
              containerNode={this.refs[i]}
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
