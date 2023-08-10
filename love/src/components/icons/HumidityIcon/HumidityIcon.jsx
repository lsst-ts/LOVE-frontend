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
// import PropTypes from 'prop-types';
import styles from './HumidityIcon.module.css';

function HumidityIcon(props) {
  return (
    <svg className={styles.svg} viewBox="0 0 49.29 71.74" {...props}>
      <path
        className={styles.path}
        d="M49.29,46.47c0,13.71-11.34,25.27-24.25,25.27C12.04,71.74,0,60.01,0,46.47c0-5.97,3.08-12.6,9.62-22.85
    c0.69-1.09,1.42-2.2,2.36-3.64c7.26-11.12,9.05-14.11,10.4-18.06c0.88-2.58,4.54-2.54,5.36,0.06c1.24,3.93,2.95,6.89,10.06,18.14
    c0.96,1.51,1.69,2.68,2.39,3.82C46.35,33.97,49.29,40.56,49.29,46.47z M31.43,58.44c1.56,0,2.82-1.26,2.82-2.82
    c0-1.56-1.26-2.82-2.82-2.82s-2.82,1.26-2.82,2.82C28.61,57.17,29.88,58.44,31.43,58.44z M17.73,42.32c1.56,0,2.82-1.26,2.82-2.82
    c0-1.56-1.26-2.82-2.82-2.82c-1.56,0-2.82,1.26-2.82,2.82C14.91,41.05,16.17,42.32,17.73,42.32z M30.44,37.43L15.43,54.89
    c-0.78,0.9-0.67,2.26,0.24,3.03c0.91,0.77,2.28,0.66,3.05-0.24l15.01-17.46c0.78-0.9,0.67-2.26-0.24-3.03S31.22,36.53,30.44,37.43z
    "
      />
    </svg>
  );
}

export default HumidityIcon;
