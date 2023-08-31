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

import React from 'react';
import styles from './Sky.module.css';

function Sky(props) {
  let { ilumination } = props;
  ilumination = ilumination ?? 0;

  const translate = ilumination < 50 ? `0 ${25 - ilumination}px` : `0 ${-75 + ilumination}px`;

  let opacity = 1;
  if (ilumination > 12) {
    if (ilumination < 23) opacity = 1 - (-12 + ilumination) * 0.1;
    else if (ilumination <= 75) opacity = 0;
    else if (ilumination < 86) opacity = 0 + (-75 + ilumination) * 0.1;
    else opacity = 1;
  }
  return (
    <svg id="Isolation_Mode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.29 76">
      <rect className={styles.cls4} x="0" y="0" width="64.29" height="38" />
      <g id="star" style={{ opacity: opacity }}>
        <path
          className={styles.cls1}
          d="m12.61,9.98l3.21.92c.39.15.39.71,0,.86l-3.21.92c-.13.05-.22.14-.27.27l-.92,3.21c-.15.39-.71.39-.86,0l-.92-3.21c-.05-.13-.14-.22-.27-.27l-3.21-.92c-.39-.15-.39-.71,0-.86l3.21-.92c.13-.05.22-.14.27-.27l.92-3.21c.15-.39.71-.39.86,0l.92,3.21c.05.13.14.22.27.27Z"
        />
        <path
          className={styles.cls1}
          d="m47.29,28.7l2.02.58c.25.09.25.45,0,.54l-2.02.58c-.08.03-.14.09-.17.17l-.58,2.02c-.09.25-.45.25-.54,0l-.58-2.02c-.03-.08-.09-.14-.17-.17l-2.02-.58c-.25-.09-.25-.45,0-.54l2.02-.58c.08-.03.14-.09.17-.17l.58-2.02c.09-.25.45-.25.54,0l.58,2.02c.03.08.09.14.17.17Z"
        />
        <circle className={styles.cls1} cx="18.25" cy="28.65" r="1.7" />
        <circle className={styles.cls1} cx="32.57" cy="13.51" r=".99" />
        <circle className={styles.cls1} cx="50.78" cy="13.6" r="2.5" />
      </g>
      <g id="sun" style={{ translate: translate }}>
        <circle className={styles.cls1} cx="32.14" cy="38.11" r="5" />
        <g>
          <line className={styles.cls2} x1="32.14" y1="29.61" x2="32.14" y2="31.61" />
          <line className={styles.cls2} x1="32.14" y1="44.61" x2="32.14" y2="46.61" />
        </g>
        <g>
          <line className={styles.cls2} x1="40.64" y1="38.11" x2="38.64" y2="38.11" />
          <line className={styles.cls2} x1="25.64" y1="38.11" x2="23.64" y2="38.11" />
        </g>
        <g>
          <line className={styles.cls2} x1="38.15" y1="32.1" x2="36.74" y2="33.51" />
          <line className={styles.cls2} x1="27.55" y1="42.71" x2="26.13" y2="44.12" />
        </g>
        <g>
          <line className={styles.cls2} x1="38.15" y1="44.12" x2="36.74" y2="42.71" />
          <line className={styles.cls2} x1="27.55" y1="33.51" x2="26.13" y2="32.1" />
        </g>
      </g>
      <rect className={styles.cls5} x="0" y="38" width="64.29" height="38" />
      <line className={styles.cls3} y1="38.11" x2="64.29" y2="38.11" />
    </svg>
  );
}

export default Sky;
