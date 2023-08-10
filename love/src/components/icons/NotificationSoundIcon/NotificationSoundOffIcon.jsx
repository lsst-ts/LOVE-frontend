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

import React from 'react';
import styles from './NotificationSoundIcon.module.css';

function NotificationSoundOffIcon(props) {
  const { selected, className } = props;
  const colorClass = !selected ? styles.clsnfc : styles.clsnfcSel;
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.96 24">
      <g className={styles.clsnfc2}>
        <path className={colorClass} d="m9.99,24c1.77,0,3.2-1.43,3.2-3.2h-6.4c0,1.77,1.43,3.2,3.2,3.2Z" />
        <g>
          <path
            className={colorClass}
            d="m4.36,8.76l-.05.34c-.36,2.36-1.51,4.53-3.28,6.17-.64.62-1.03,1.47-1.03,2.36,0,.94.77,1.74,1.74,1.74h13.22L4.36,8.76Z"
          />
          <path
            className={colorClass}
            d="m4.83,6.75l12.61,12.61h.77c.95,0,1.74-.77,1.74-1.74,0-.89-.36-1.74-1-2.36-1.77-1.64-2.92-3.81-3.28-6.17l-.15-1.03c-.26-1.69-1.25-3.07-2.61-3.92.13-.34.18-.66.18-1.05,0-1.72-1.38-3.1-3.1-3.1s-3.1,1.38-3.1,3.1c0,.36.08.72.18,1.05-.99.61-1.78,1.52-2.24,2.6ZM9.99,1.79c.72,0,1.31.59,1.31,1.3,0,.13-.03.26-.05.36-.41-.1-.82-.15-1.25-.15s-.85.05-1.25.15c-.03-.13-.06-.23-.06-.36,0-.72.59-1.3,1.3-1.3Z"
          />
        </g>
        <path
          className={colorClass}
          d="m18.67,21.36l-4.02-4.03L6.31,8.98,2.29,4.95c-.12-.12-.27-.09-.35.06-.07.15-.04.36.08.48l4.02,4.03h0s12.36,12.37,12.36,12.37c.06.06.13.08.19.07s.12-.05.16-.13c.07-.15.04-.36-.08-.48Z"
        />
      </g>
    </svg>
  );
}

export default NotificationSoundOffIcon;
