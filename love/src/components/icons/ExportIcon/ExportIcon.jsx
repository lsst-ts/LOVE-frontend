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
import styles from './ExportIcon.module.css';

export default class ExportIcon extends Component {
  render() {
    return (
      <svg className={styles.exportIcon} id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.671 67.671">
        <path d="M52.946,23.348H42.834v6h10.112c3.007,0,5.34,1.536,5.34,2.858v26.606c0,1.322-2.333,2.858-5.34,2.858H14.724 c-3.007,0-5.34-1.536-5.34-2.858V32.207c0-1.322,2.333-2.858,5.34-2.858h10.11v-6h-10.11c-6.359,0-11.34,3.891-11.34,8.858v26.606 c0,4.968,4.981,8.858,11.34,8.858h38.223c6.358,0,11.34-3.891,11.34-8.858V32.207C64.286,27.239,59.305,23.348,52.946,23.348z" />
        <path d="M24.957,14.955c0.768,0,1.535-0.293,2.121-0.879l3.756-3.756v13.028v6v11.494c0,1.657,1.343,3,3,3s3-1.343,3-3V29.348v-6 V10.117l3.959,3.959c0.586,0.586,1.354,0.879,2.121,0.879s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242l-8.957-8.957 C35.492,0.291,34.725,0,33.958,0c-0.008,0-0.015,0-0.023,0s-0.015,0-0.023,0c-0.767,0-1.534,0.291-2.12,0.877l-8.957,8.957 c-1.172,1.171-1.172,3.071,0,4.242C23.422,14.662,24.189,14.955,24.957,14.955z" />
      </svg>
    );
  }
}
