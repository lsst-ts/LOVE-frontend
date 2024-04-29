/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Neighbors from 'components/GeneralPurpose/Neighbors/Neighbors';
import styles from './CCDDetail.module.css';

class CCDDetail extends Component {
  constructor(props) {
    super(props);
    this.refs = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()];
    this.state = {};
  }
  renderPlots() {
    const plots = [
      {
        gDV: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Ccd',
              item: 'gDV',
              accessor: (x) => x,
            },
          ],
        },
      },
      {
        oDV: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Ccd',
              item: 'oDV',
              accessor: (x) => x,
            },
          ],
        },
      },
      {
        oGV: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Ccd',
              item: 'oGV',
              accessor: (x) => x,
            },
          ],
        },
      },
      {
        rDV: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Ccd',
              item: 'rDV',
              accessor: (x) => x,
            },
          ],
        },
      },
      {
        temp: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Ccd',
              item: 'temp',
              accessor: (x) => x,
            },
          ],
        },
      },
    ];

    return (
      <div className={styles.plotsContainer}>
        {plots.map((p, i) => (
          <div ref={this.refs[i]} className={styles.plot}>
            <PlotContainer
              height={150}
              width={240}
              inputs={p}
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
