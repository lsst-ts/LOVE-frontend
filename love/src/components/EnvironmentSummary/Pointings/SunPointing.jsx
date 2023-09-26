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
import styles from './SunPointing.module.css';

function SunPointing({ className, ...props }) {
  return (
    <svg viewBox="0 0 23.7 23.7" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <polygon
        id="Sun"
        className={styles.cls1}
        points="11.85 1.85 13.73 0 14.94 2.34 17.3 1.16 17.73 3.76 20.34 3.37 19.94 5.97 22.54 6.4 21.36 8.76 23.7 9.98 21.85 11.85 23.7 13.73 21.36 14.94 22.54 17.3 19.94 17.73 20.34 20.34 17.73 19.94 17.3 22.54 14.94 21.36 13.73 23.7 11.85 21.85 9.98 23.7 8.76 21.36 6.4 22.54 5.97 19.94 3.37 20.34 3.76 17.73 1.16 17.3 2.34 14.94 0 13.73 1.85 11.85 0 9.98 2.34 8.76 1.16 6.4 3.76 5.97 3.37 3.37 5.97 3.76 6.4 1.16 8.76 2.34 9.98 0 11.85 1.85"
      />
    </svg>
  );
}

export default SunPointing;
