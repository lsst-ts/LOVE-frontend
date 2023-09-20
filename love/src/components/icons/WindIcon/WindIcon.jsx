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
// import PropTypes from 'prop-types';
import styles from './WindIcon.module.css';

function WindIcon(props) {
  return (
    <svg className={styles.svg} viewBox="0 0 55.99 45.91" {...props}>
      <path
        className={styles.path}
        d="M55.99,15.85c0-5.07-4.13-9.19-9.19-9.19s-9.19,4.13-9.19,9.19c0,1.24,1,2.24,2.24,2.24s2.24-1,2.24-2.24
          c0-2.59,2.12-4.71,4.71-4.71c2.59,0,4.71,2.12,4.71,4.71s-2.12,4.71-4.71,4.71H2.24C1,20.57,0,21.57,0,22.81
          c0,1.24,1,2.24,2.24,2.24h37.25c2.59,0,4.71,2.12,4.71,4.71c0,2.59-2.12,4.71-4.71,4.71s-4.71-2.12-4.71-4.71
          c0-1.24-1-2.24-2.24-2.24s-2.24,1-2.24,2.24c0,5.07,4.13,9.19,9.19,9.19s9.19-4.13,9.19-9.19c0-1.77-0.47-3.36-1.36-4.77
          C52.16,24.75,55.99,20.75,55.99,15.85z"
      />
      <path
        className={styles.path}
        d="M19.63,28.47H2.24C1,28.47,0,29.47,0,30.71s1,2.24,2.24,2.24h17.39c2.36,0,4.24,1.89,4.24,4.24
          c0,2.36-1.89,4.24-4.24,4.24s-4.24-1.89-4.24-4.24c0-1.24-1-2.24-2.24-2.24s-2.24,1-2.24,2.24c0,4.77,3.89,8.72,8.72,8.72
          c4.77,0,8.72-3.89,8.72-8.72S24.4,28.47,19.63,28.47z"
      />
      <path
        className={styles.path}
        d="M2.24,17.21h24.69c4.77,0,8.6-3.89,8.6-8.6c0-4.77-3.89-8.6-8.6-8.6c-4.77,0-8.6,3.89-8.6,8.6
          c0,1.24,1,2.24,2.24,2.24s2.24-1,2.24-2.24c0-2.3,1.89-4.13,4.13-4.13c2.3,0,4.13,1.89,4.13,4.13c0,2.3-1.89,4.13-4.13,4.13H2.24
          C1,12.73,0,13.73,0,14.97S1,17.21,2.24,17.21z"
      />
    </svg>
  );
}

export default WindIcon;
