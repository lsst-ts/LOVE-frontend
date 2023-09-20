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
import styles from './MoveUpIcon.module.css';

export default class MoveUpIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.9 37.9" className={styles.svg}>
        <title>Move script up</title>
        <path
          className={styles['cls-1']}
          d="M.29,19.39a19,19,0,1,1,19,19A19,19,0,0,1,.29,19.39Zm26.07-3.16L19.51,9.84a.61.61,0,0,0-.86-.1.94.94,0,0,0-.1.1l-6.84,6.39a.62.62,0,0,0,.48,1h5V28a.62.62,0,0,0,.62.62h2.47a.62.62,0,0,0,.62-.62V17.23h5a.61.61,0,0,0,.62-.61A.65.65,0,0,0,26.36,16.23Z"
          transform="translate(-0.29 -0.44)"
        />
      </svg>
    );
  }
}
