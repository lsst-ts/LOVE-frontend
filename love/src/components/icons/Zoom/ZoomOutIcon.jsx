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
import styles from './Zoom.module.css';

function ZoomOutIcon(props) {
  const [cls1, cls2, svg] = props.block
    ? [styles.cls1Not, styles.cls2Not, styles.svgNot]
    : [styles.cls1, styles.cls2, styles.svgNot];

  return (
    <svg id="Capa_3" className={svg} data-name="Capa 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.8 31.8">
      <path className={cls2} d="m5.5.5h25.8v30.8H5.5c-2.76,0-5-2.24-5-5V5.5C.5,2.74,2.74.5,5.5.5Z" />
      <circle className={styles.cls3} cx="16.43" cy="15.12" r="7.7" />
      <line className={cls1} x1="13.8" y1="15.12" x2="19.05" y2="15.12" />
      <line className={cls1} x1="7.19" y1="24.7" x2="10.89" y2="20.99" />
    </svg>
  );
}

export default ZoomOutIcon;
