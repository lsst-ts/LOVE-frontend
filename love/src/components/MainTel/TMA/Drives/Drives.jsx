/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { range } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SimpleTable from '../../../GeneralPurpose/SimpleTable/SimpleTable';
import styles from './Drives.module.css';

export default class Drives extends Component {
  static propTypes = {
    /** Array data of Drivers about the azimuth */
    azimuthDrives: PropTypes.arrayOf(PropTypes.number),
    /** Array data of Drivers about the elevation */
    elevationDrivers: PropTypes.arrayOf(PropTypes.number),
    /** Array data of mirror covers position */
    mirrorCoversPosition: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    azimuthDrives: [],
    elevationDrivers: [],
    mirrorCoversPosition: [],
  };

  getFieldName(num) {
    return 'angle-' + num;
  }
  getHeaderAngle(num) {
    return {
      field: this.getFieldName(num),
      title: num,
      type: 'number',
      className: styles.angleColumn,
      render: (value) => (isNaN(value) || Number.isInteger(value) ? value : `${value.toFixed(2)}º`),
    };
  }

  render() {
    const li = Array.from({ length: 16 }, (_, i) => i + 1).map((value) => this.getHeaderAngle(value));
    const headers = [
      {
        field: 'name',
        title: 'Drivers',
      },
      ...li,
    ];
    const { azimuthDrives, elevationDrives, mirrorCoversPosition } = this.props;

    const data = {
      azimuth: {
        name: (
          <>
            Azimuth <span className={styles.units}>[%]</span>
          </>
        ),
      },
      elevation: {
        name: (
          <>
            Elevation <span className={styles.units}>[%]</span>
          </>
        ),
      },
      covers: {
        name: (
          <>
            Mirror covers <span className={styles.units}>[%]</span>
          </>
        ),
      },
    };

    for (const i in range(16)) {
      data.azimuth[this.getFieldName(parseInt(i) + 1)] = azimuthDrives[i] >= 0 ? azimuthDrives[i] : '-';
      data.elevation[this.getFieldName(parseInt(i) + 1)] = elevationDrives[i] >= 0 ? elevationDrives[i] : '-';
    }
    for (const i in range(4)) {
      data.covers[this.getFieldName(parseInt(i) + 1)] = mirrorCoversPosition[i] >= 0 ? mirrorCoversPosition[i] : '-';
    }

    const simpleData = Object.values(data);

    return (
      <div className={styles.container}>
        <SimpleTable headers={headers} data={simpleData} />
      </div>
    );
  }
}
