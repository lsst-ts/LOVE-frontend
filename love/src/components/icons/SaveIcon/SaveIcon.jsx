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
import styles from './SaveIcon.module.css';

function SaveIcon(props) {
  return (
    <svg viewBox="0 0 55.34 55.34" x="0px" y="0px" className={styles['svg']}>
      <path
        className={styles['cls-1']}
        d="M16.89,1.19V15h0a1.38,1.38,0,0,0,1.38,1.39H37.64A1.38,1.38,0,0,0,39,15V1.19h0A1.39,1.39,0,0,1,40.41-.2h1.85a5.58,5.58,0,0,1,3.92,1.62L54,9.25h0a5.53,5.53,0,0,1,1.62,3.91V49.61h0a5.52,5.52,0,0,1-5.53,5.53H5.82A5.53,5.53,0,0,1,.28,49.61V5.34h0A5.54,5.54,0,0,1,5.82-.2H15.5A1.39,1.39,0,0,1,16.89,1.19ZM29.34-.2H32.1a1.39,1.39,0,0,1,1.39,1.39v8.3h0a1.38,1.38,0,0,1-1.39,1.38H29.34A1.38,1.38,0,0,1,28,9.49V1.19h0A1.39,1.39,0,0,1,29.34-.2Zm-11.07,36h0A9.69,9.69,0,0,0,28,45.46h0a9.69,9.69,0,0,0,9.69-9.69h0A9.69,9.69,0,0,0,28,26.09h0A9.69,9.69,0,0,0,18.27,35.77Z"
        transform="translate(-0.28 0.2)"
      />
    </svg>
  );
}

export default SaveIcon;
