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

import React, { Component } from 'react';
import styles from './SimonyiPointing.module.css';

function SimonyiPointing({ className, ...props }) {
  return (
    <svg viewBox="0 0 14.63 14.63" className={className} {...props}>
      <g id="Simonyi">
        <circle className={styles.cls2} cx="7.32" cy="7.32" r="6.82" />
        <text className={styles.cls1} transform="translate(3.49 11.43)">
          <tspan x="0" y="0">
            S
          </tspan>
        </text>
      </g>
    </svg>
  );
}

export default SimonyiPointing;
