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
import styles from './NotificationIcon.module.css';

function NotificationIcon(props) {
  return (
    <svg viewBox="0 0 31.9 39.2" {...props}>
      <path
        className={styles.path}
        d="M15.48,37.18c2.74,0,4.96-2.22,4.96-4.96h-9.92C10.52,34.96,12.74,37.18,15.48,37.18z"
      />
      <path
        className={styles.path}
        d="M29.37,23.65c-2.74-2.54-4.52-5.91-5.08-9.56l-0.24-1.59c-0.4-2.62-1.94-4.76-4.05-6.07
    c0.2-0.52,0.28-1.03,0.28-1.63c0-2.66-2.14-4.8-4.8-4.8c-2.66,0-4.8,2.14-4.8,4.8c0,0.56,0.12,1.11,0.28,1.63
    C8.85,7.74,7.3,9.92,6.91,12.5l-0.24,1.59c-0.56,3.65-2.34,7.02-5.08,9.56C0.6,24.61,0,25.92,0,27.31C0,28.77,1.19,30,2.7,30h25.52
    c1.47,0,2.7-1.19,2.7-2.7C30.92,25.92,30.36,24.61,29.37,23.65z M17.42,5.36c-0.64-0.16-1.27-0.24-1.94-0.24
    c-0.67,0-1.31,0.08-1.94,0.24C13.49,5.16,13.45,5,13.45,4.8c0-1.11,0.91-2.02,2.02-2.02S17.5,3.69,17.5,4.8
    C17.5,5,17.46,5.2,17.42,5.36z"
      />
    </svg>
  );
}

export default NotificationIcon;
