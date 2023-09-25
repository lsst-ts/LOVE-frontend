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
import styles from './ImportIcon.module.css';

export default class ImportIcon extends Component {
  render() {
    const classNames = [styles.importIcon, this.props.className].join(' ');
    return (
      <svg className={classNames} id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.903 60.903">
        <path d="M49.561,16.464H39.45v6h10.111c3.008,0,5.341,1.535,5.341,2.857v26.607c0,1.321-2.333,2.858-5.341,2.858H11.34 c-3.007,0-5.34-1.537-5.34-2.858V25.324c0-1.322,2.333-2.858,5.34-2.858h10.11v-6H11.34C4.981,16.466,0,20.357,0,25.324v26.605 c0,4.968,4.981,8.857,11.34,8.857h38.223c6.357,0,11.34-3.891,11.34-8.857V25.324C60.902,20.355,55.921,16.464,49.561,16.464z" />
        <path d="M39.529,29.004c-0.768,0-1.535,0.294-2.121,0.88l-3.756,3.755V20.612v-6V3.117c0-1.656-1.343-3-3-3s-3,1.344-3,3v11.494v6 v13.23l-3.959-3.958c-0.586-0.586-1.354-0.88-2.121-0.88s-1.535,0.294-2.121,0.88c-1.172,1.17-1.172,3.07,0,4.241l8.957,8.957 c0.586,0.586,1.354,0.877,2.12,0.877c0.008,0,0.016,0,0.023,0s0.015,0,0.022,0c0.768,0,1.534-0.291,2.12-0.877l8.957-8.957 c1.172-1.171,1.172-3.071,0-4.241C41.064,29.298,40.298,29.004,39.529,29.004z" />
      </svg>
    );
  }
}
