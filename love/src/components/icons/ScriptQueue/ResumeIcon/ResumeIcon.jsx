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
import styles from './ResumeIcon.module.css';

export default function ResumeIcon(props) {
  const className = [styles.svg, props.className].join(' ');
  return (
    <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.94 37.94" {...props}>
      <path
        className={styles['cls-1']}
        d="M19,0A19,19,0,1,0,38,19,19,19,0,0,0,19,0Zm8.36,20.35L14.46,28.92a1.66,1.66,0,0,1-2.58-1.38V10.41A1.66,1.66,0,0,1,14.46,9l12.88,8.56A1.66,1.66,0,0,1,27.34,20.35Z"
        transform="translate(-0.01)"
      />
    </svg>
  );
}
