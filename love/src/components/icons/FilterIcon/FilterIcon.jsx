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
import styles from './FilterIcon.module.css';
import PropTypes from 'prop-types';

export default class FilterIcon extends Component {
  static propTypes = {
    active: PropTypes.bool,
  };

  render() {
    const statusStyle = this.props.active ? styles.active : styles.inactive;

    const icons = {
      default: (
        <g>
          <line x1="6.29" y1="13.7" x2="11.58" y2="13.7" />
          <line x1="4.53" y1="9.29" x2="13.34" y2="9.29" />
          <line x1="1" y1="4" x2="16.87" y2="4" />
        </g>
      ),
      filtered: (
        <path
          className={styles.funnel}
          d="M16.94,1.44A.68.68,0,0,0,16.27,1H1.73a.68.68,0,0,0-.67.44.67.67,0,0,0,.16.8l5.6,5.6V13a.7.7,0,0,0,.22.52l2.9,3.26a.67.67,0,0,0,.51.22.79.79,0,0,0,.29-.06.68.68,0,0,0,.44-.67V7.84l5.6-5.6A.67.67,0,0,0,16.94,1.44Z"
        />
      ),
    };

    let icon = icons.default;
    if (this.props.isFiltered) {
      icon = icons.filtered;
    }

    return (
      <svg className={[styles.filterIcon, statusStyle].join(' ')} viewBox="0 0 18 18">
        {icon}
      </svg>
    );
  }
}
