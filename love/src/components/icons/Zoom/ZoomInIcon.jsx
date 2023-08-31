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
import styles from './Zoom.module.css';

function ZoomInIcon(props) {
  const [cls1, cls2, svg] = props.block
    ? [styles.cls1Not, styles.cls2Not, styles.svgNot]
    : [styles.cls1, styles.cls2, styles.svgNot];
  return (
    <svg id="Capa_3" className={svg} data-name="Capa 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.8 31.8">
      <path className={cls2} d="m.5.5h25.8c2.76,0,5,2.24,5,5v20.8c0,2.76-2.24,5-5,5H.5V.5h0Z" />
      <circle className={styles.cls3} cx="15.9" cy="15.9" r="7.7" />
      <line className={cls1} x1="13.28" y1="15.9" x2="18.52" y2="15.9" />
      <line className={cls1} x1="15.9" y1="18.52" x2="15.9" y2="13.28" />
      <line className={cls1} x1="6.66" y1="25.49" x2="10.37" y2="21.78" />
    </svg>
  );
}

export default ZoomInIcon;
