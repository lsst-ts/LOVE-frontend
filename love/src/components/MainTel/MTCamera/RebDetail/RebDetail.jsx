/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import styles from './RebDetail.module.css';

class RebDetail extends Component {
  constructor(props) {
    super(props);
    const rebIndex = this.props.reb;
    const plotsRebs = [
      {
        anal: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'anal',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        anaV: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'anaV',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        aspicl_Temp0: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'aspicl_Temp0',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        aspicl_Temp1: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'aspicl_Temp1',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        aspicl_Temp2: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'aspicl_Temp2',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        aspicu_Temp0: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'aspicu_Temp0',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        aspicu_Temp1: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'aspicu_Temp1',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        aspicu_Temp2: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'aspicu_Temp2',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        clkHI: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'clkHI',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        clkHV: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'clkHV',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        clkLI: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'clkLI',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        clkLV: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'clkLV',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        digI: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'digI',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        digV: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'digV',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        hVBiasSwitch: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'hVBiasSwitch',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        htrPI: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'htrPI',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        htrPV: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'htrPV',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        htrV: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'htrV',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        htrW: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'htrW',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        oDI: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'oDI',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        oDV: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'oDV',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        pClk0: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'pClk0',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        pClk1: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'pClk1',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        pClkL: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'pClkL',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        pClkU: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'pClkU',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        power: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'power',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        rG0: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'rG0',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        rG1: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'rG1',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        rGL: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'rGL',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        rGU: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'rGU',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        rTDTemp: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'rTDTemp',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        ref05V: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'ref05V',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        ref125V: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'ref125V',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        ref15V: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'ref15V',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        ref25V: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'ref25V',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        refN12: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'refN12',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        refP12: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'refP12',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        sClk0: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'sClk0',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        sClk1: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'sClk1',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        sClkL: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'sClkL',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        sClkU: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'sClkU',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp1: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp1',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp10: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp10',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp2: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp2',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp3: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp3',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp4: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp4',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp5: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp5',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp6: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp6',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp7: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp7',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp8: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp8',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
      {
        temp9: {
          category: 'telemetry',
          csc: 'MTCamera',
          salindex: 0,
          topic: 'focal_plane_Reb',
          item: 'temp9',
          type: 'line',
          accessor: (x) => x[rebIndex],
        },
      },
    ];
    this.refs = [];
    plotsRebs.map((plot) => {
      this.refs.push(React.createRef());
    });
    this.state = {
      plots: plotsRebs,
    };
  }
  renderPlots() {
    return (
      <div className={styles.plotsContainer}>
        {this.state.plots.map((p, i) => (
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
