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

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './TemperatureIcon.module.css';

function TemperatureIcon(props) {
  return (
    <svg className={styles.svg} viewBox="0 0 36 74" {...props}>
      <path
        className={styles.path}
        d="M28,41.04V29h0V10c0-5.51-4.49-10-10-10S8,4.49,8,10v31.04C3.18,44.26,0,49.76,0,56c0,9.94,8.06,18,18,18
          c9.94,0,18-8.06,18-18C36,49.76,32.82,44.26,28,41.04z M18,6c2.21,0,4,1.79,4,4v3.31h-2.59c-1.1,0-2,0.9-2,2s0.9,2,2,2H22v3h-2.59
          c-1.1,0-2,0.9-2,2s0.9,2,2,2H22V29h-8V10C14,7.79,15.79,6,18,6z"
      />
    </svg>
  );
}

export default TemperatureIcon;
