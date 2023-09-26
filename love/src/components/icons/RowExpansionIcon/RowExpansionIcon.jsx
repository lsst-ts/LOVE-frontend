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
import styles from './RowExpansionIcon.module.css';

export default class RowExpansionIcon extends Component {
  render() {
    const transform = this.props.expanded ? 'rotate(90, 256.004, 256.004)' : '';
    return (
      <svg
        className={[styles.icon, styles.color, this.props.style].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512.008 512.008"
      >
        <path
          className="cls-1"
          d="M381.048,248.633L146.381,3.299c-3.021-3.146-7.646-4.167-11.688-2.521c-4.042,1.615-6.688,5.542-6.688,9.896v42.667c0,2.729,1.042,5.354,2.917,7.333l185.063,195.333L130.923,451.341c-1.875,1.979-2.917,4.604-2.917,7.333v42.667c0,4.354,2.646,8.281,6.688,9.896c1.292,0.521,2.646,0.771,3.979,0.771c2.854,0,5.646-1.146,7.708-3.292l234.667-245.333C384.986,259.258,384.986,252.758,381.048,248.633z"
          transform={transform}
        />
      </svg>
    );
  }
}

RowExpansionIcon.defaultProps = {
  style: '',
};
