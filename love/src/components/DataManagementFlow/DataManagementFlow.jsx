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
import styles from './DataManagementFlow.module.css';
import { dmFlowStatusMap, stateToStyleDMFlow } from 'Config';
import PaginatedTable from 'components/GeneralPurpose/PaginatedTable/PaginatedTable';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import PipelineIcon from 'components/icons/DMFlowIcon/PipelineIcon';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';

let dataMock = [];
for (let i = 1; i < 100; i++) {
  dataMock.push({
    thumbnail: 'img',
    imageName: 'CC_O_200202_000' + i.toString(),
    processed: `${Math.floor(Math.random() * 301)}/${Math.floor(Math.random() * 301)}`,
    failed: Math.floor(Math.random() * 201),
    failedPercent: `${Math.floor(Math.random() * 101)}%`,
    phases: {
      0: Math.floor(Math.random() * 4),
      1: Math.floor(Math.random() * 4),
      2: Math.floor(Math.random() * 4),
      3: Math.floor(Math.random() * 4),
      4: Math.floor(Math.random() * 4),
      5: Math.floor(Math.random() * 4),
    },
    imgQlty: 'Unknown',
    status: Math.floor(Math.random() * 7),
  });
}

let schema = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 300,
  height: 200,
  data: { url: 'data/unemployment-across-industries.json' },
  mark: 'area',
  encoding: {
    x: {
      timeUnit: 'yearmonth',
      field: 'date',
      axis: { format: '%Y' },
    },
    y: {
      aggregate: 'sum',
      field: 'count',
      title: 'count',
    },
  },
};
export default class DMFlow extends Component {
  static propTypes = {
    nombre: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  percentageFormatter(value) {
    const numericValue = parseInt(value, 10);
    let style = {};
    if (numericValue >= 50) {
      style = { color: 'var(--status-alert-dimmed-color-2' };
    } else if (numericValue >= 20) {
      style = { color: 'var(--status-warning-dimmed-color-2' };
    }

    return <span style={style}>{value}</span>;
  }

  render() {
    const headers = [
      {
        field: 'thumbnail',
        title: 'Thumbnail',
        type: 'string',
      },
      {
        field: 'imageName',
        title: 'Image Name',
        type: 'string',
      },
      {
        field: 'processed',
        title: 'Processed',
        type: 'string',
      },
      {
        field: 'failed',
        title: 'Failed',
        type: 'string',
      },
      {
        field: 'failedPercent',
        title: 'F %',
        type: 'string',
        render: (value) => this.percentageFormatter(value),
      },
      {
        field: 'phases',
        title: 'Pipeline',
        render: (value) => {
          return <PipelineIcon phases={value} />;
        },
      },
      {
        field: 'imgQlty',
        title: 'Img. Qlty.',
        type: 'string',
      },
      {
        field: 'textStatus',
        title: 'Status',
        render: (value) => {
          return (
            <StatusText small status={stateToStyleDMFlow[value]}>
              {value}
            </StatusText>
          );
        },
      },
    ];

    dataMock.map((value) => {
      value.textStatus = dmFlowStatusMap[value.status];
    });

    const { dmFlowState, oodsState, usdfState } = this.props;

    const dmFlow = dmFlowStatusMap[dmFlowState];
    const oods = dmFlowStatusMap[oodsState];
    const usdf = dmFlowStatusMap[usdfState];

    return (
      <div>
        <div className={styles.summaryContainer}>
          <div className={styles.container}>
            <SummaryPanel>
              <Title>DMFlow State</Title>
              <Value>
                <StatusText status={stateToStyleDMFlow[dmFlow]} small>
                  {dmFlow}
                </StatusText>
              </Value>
            </SummaryPanel>

            <SummaryPanel className={styles.summaryPanel}>
              <Label>OODS State</Label>
              <Value>
                <StatusText status={stateToStyleDMFlow[oods]} small>
                  {oods}
                </StatusText>
              </Value>
              <Label>USDF State</Label>
              <Value>
                <StatusText status={stateToStyleDMFlow[usdf]} small>
                  {usdf}
                </StatusText>
              </Value>
            </SummaryPanel>
          </div>
        </div>
        <div className={styles.divTable}>
          <PaginatedTable headers={headers} data={dataMock} title={'Exposures'}></PaginatedTable>
        </div>
      </div>
    );
  }
}
