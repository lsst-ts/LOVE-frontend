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
import styles from './DownloadIcon.module.css';

function DownloadIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.1 20.38">
      <polyline className={styles.cls2} points="22.1 15.79 22.1 19.38 1 19.38 1 15.79" />
      <polygon
        className={styles.cls1}
        points="13.26 7.91 13.26 0 9.85 0 9.85 7.91 7.05 7.91 9.3 11.29 11.55 14.68 13.8 11.29 16.06 7.91 13.26 7.91"
      />
    </svg>
  );
}

export default DownloadIcon;
