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
import CCDDetail from '../CCDDetail/CCDDetail';
import styles from './RaftDetail.module.css';

const COLOR_MAPPING = {
  1: 'var(--status-ok-dimmed-color-3)',
  2: 'var(--status-warning-dimmed-color-3)',
  3: 'var(--status-alert-dimmed-color-3)',
};

function getRebPlots(index) {
  return {
    hVBiasSwitch: {
      type: 'line',
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'hVBiasSwitch',
          accessor: (x) => x[index],
        },
      ],
    },
    anaV: {
      type: 'line',
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'anaV',
          accessor: (x) => x[index],
        },
      ],
    },
    power: {
      type: 'line',
      values: [
        {
          variable: 'y',
          category: 'telemetry',
          csc: 'CCCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'power',
          accessor: (x) => x[index],
        },
      ],
    },
  };
}

class RaftDetail extends Component {
  constructor(props) {
    super(props);
    const plotsRebs0 = [
      {
        hVBiasSwitch: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'hVBiasSwitch',
              accessor: (x) => x[0],
            },
          ],
        },
        anaV: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'anaV',
              accessor: (x) => x[0],
            },
          ],
        },
        power: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'power',
              accessor: (x) => x[0],
            },
          ],
        },
      },
    ];
    const plotsRebs1 = [
      {
        hVBiasSwitch: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'hVBiasSwitch',
              accessor: (x) => x[1],
            },
          ],
        },
        anaV: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'anaV',
              accessor: (x) => x[1],
            },
          ],
        },
        power: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'power',
              accessor: (x) => x[1],
            },
          ],
        },
      },
    ];

    const plotsRebs2 = [
      {
        hVBiasSwitch: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'hVBiasSwitch',
              accessor: (x) => x[2],
            },
          ],
        },
        anaV: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'anaV',
              accessor: (x) => x[2],
            },
          ],
        },
        power: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Reb',
              item: 'power',
              accessor: (x) => x[2],
            },
          ],
        },
      },
    ];

    this.CCDsrefs = [
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
    this.rebsRefs = [
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
  }

  renderCCDsPlots() {
    const { raft, selectedCCD, selectedCCDVar, setSelectedCCD, setHoveredCCD, setHoveredReb } = this.props;
    const plots = [];
    raft.ccds.forEach((c) => {
      const ccdIndex = c.id - 1;
      plots.push({
        [`CCD${c.id}`]: {
          type: 'line',
          values: [
            {
              category: 'telemetry',
              csc: 'CCCamera',
              salindex: 0,
              topic: 'focal_plane_Ccd',
              item: selectedCCDVar,
              accessor: (x) => x[ccdIndex],
            },
          ],
        },
      });
    });

    return (
      <div className={styles.ccdsContainer}>
        {plots.map((p, i) => (
          <div
            key={`c${i}`}
            ref={this.CCDsrefs[i]}
            // style={{ border: `4px solid ${COLOR_MAPPING[raft.ccds[i].status]}` }}
            style={{ border: selectedCCD?.id === raft.ccds[i].id ? '1px solid white' : `none` }}
            className={styles.plot}
            onClick={() => {
              setSelectedCCD(raft.ccds[i]);
            }}
            onMouseOver={() => {
              setHoveredCCD(raft.ccds[i]);
              setHoveredReb(null);
            }}
          >
            <PlotContainer
              memorySize={50}
              height={150}
              width={180}
              inputs={p}
              xAxisTitle="Time"
              yAxisTitle={`${selectedCCDVar} - ${raft.ccds[i].id}`}
              legendPosition="right"
            />
          </div>
        ))}
      </div>
    );
  }

  renderRebsPlots() {
    const { raft } = this.props;
    const plots = [];
    raft.rebs?.forEach((r) => {
      const rebIndex = r.id - 1;
      plots.push(
        {
          [`REB${r.id}`]: {
            type: 'line',
            values: [
              {
                variable: 'y',
                category: 'telemetry',
                csc: 'CCCamera',
                salindex: 0,
                topic: 'focal_plane_Reb',
                item: 'hVBiasSwitch',
                accessor: (x) => x[rebIndex],
              },
            ],
          },
        },
        {
          [`REB${r.id}`]: {
            type: 'line',
            values: [
              {
                variable: 'y',
                category: 'telemetry',
                csc: 'CCCamera',
                salindex: 0,
                topic: 'focal_plane_Reb',
                item: 'anaV',
                accessor: (x) => x[rebIndex],
              },
            ],
          },
        },
        {
          [`REB${r.id}`]: {
            type: 'line',
            values: [
              {
                variable: 'y',
                category: 'telemetry',
                csc: 'CCCamera',
                salindex: 0,
                topic: 'focal_plane_Reb',
                item: 'power',
                accessor: (x) => x[rebIndex],
              },
            ],
          },
        },
      );
    });

    return (
      <div className={styles.rebsContainer}>
        {plots.map((p, i) => (
          <div key={`r${i}`} ref={this.rebsRefs[i]} className={styles.plot}>
            <PlotContainer
              memorySize={50}
              height={150}
              width={180}
              inputs={p}
              xAxisTitle="Time"
              legendPosition="right"
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { raft, showNeighbors, selectedReb, selectNeighborRaft } = this.props;

    const edgesColors = {
      // top: raft.neighbors.top ? COLOR_MAPPING[raft.neighbors.top.status] : 'transparent',
      top: 'transparent',
      // right: raft.neighbors.right ? COLOR_MAPPING[raft.neighbors.right.status] : 'transparent',
      right: 'transparent',
      // bottom: raft.neighbors.bottom ? COLOR_MAPPING[raft.neighbors.bottom.status] : 'transparent',
      bottom: 'transparent',
      // left: raft.neighbors.left ? COLOR_MAPPING[raft.neighbors.left.status] : 'transparent',
      left: 'transparent',
    };
    return showNeighbors ? (
      <div className={styles.container}>
        <Neighbors edgesColors={edgesColors} selectNeighbor={selectNeighborRaft}>
          {this.renderCCDsPlots()}
          {this.renderRebsPlots()}
        </Neighbors>
      </div>
    ) : (
      <div className={styles.container}>
        <h1>CCDs</h1>
        {this.renderCCDsPlots()}
        <h1>Rebs</h1>
        {this.renderRebsPlots()}
      </div>
    );
  }
}

export default RaftDetail;
