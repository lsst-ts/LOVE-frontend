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
import styles from './RightArrowIcon.module.css';

export default class RightArrowIcon extends Component {
  static defaultProps = {
    style: '',
  };

  render() {
    return (
      <svg data-name="Layer 1" viewBox="0 0 16.39 12.34">
        <title>{'target-arrow'}</title>
        <path
          className={styles.arrow}
          fill="none"
          stroke="#f9f9f9"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M.0 6.24l9.72-.07L10.17.5l5.72 5.62-5.63 5.72-.02-2.52"
        />
      </svg>
    );
  }
}
