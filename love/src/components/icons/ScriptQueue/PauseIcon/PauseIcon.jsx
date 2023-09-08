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

import React from 'react';
import styles from './PauseIcon.module.css';

export default function PauseIcon(props) {
  const className = [styles.pauseIcon, props.className].join(' ');
  return (
    <svg className={styles.pauseIcon} viewBox="0 0 37.96 37.96" {...props}>
      <path
        className={styles['cls-1']}
        d="M19.28.47a19,19,0,1,0,19,19A19,19,0,0,0,19.28.47Zm-2.13,27.7a.73.73,0,0,1-.74.74H11.2a.73.73,0,0,1-.75-.74V10.74A.73.73,0,0,1,11.2,10h5.21a.73.73,0,0,1,.74.75Zm11,0a.73.73,0,0,1-.75.74h-5.2a.73.73,0,0,1-.75-.74V10.74a.73.73,0,0,1,.75-.75h5.2a.73.73,0,0,1,.75.75Z"
        transform="translate(-0.29 -0.47)"
      />
    </svg>
  );
}
