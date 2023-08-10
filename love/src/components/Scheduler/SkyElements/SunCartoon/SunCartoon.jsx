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
import styles from './SunCartoon.module.css';

function Sun({ className, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.29 76" {...props}>
      <g style={{ scale: '2', transformOrigin: 'center' }}>
        <circle className={[styles['cls1'], className].join(' ')} cx="32.14" cy="38.11" r="5" />
        <g>
          <line className={[styles['cls2'], className].join(' ')} x1="32.14" y1="29.61" x2="32.14" y2="31.61" />
          <line className={[styles['cls2'], className].join(' ')} x1="32.14" y1="44.61" x2="32.14" y2="46.61" />
        </g>
        <g>
          <line className={[styles['cls2'], className].join(' ')} x1="40.64" y1="38.11" x2="38.64" y2="38.11" />
          <line className={[styles['cls2'], className].join(' ')} x1="25.64" y1="38.11" x2="23.64" y2="38.11" />
        </g>
        <g>
          <line className={[styles['cls2'], className].join(' ')} x1="38.15" y1="32.1" x2="36.74" y2="33.51" />
          <line className={[styles['cls2'], className].join(' ')} x1="27.55" y1="42.71" x2="26.13" y2="44.12" />
        </g>
        <g>
          <line className={[styles['cls2'], className].join(' ')} x1="38.15" y1="44.12" x2="36.74" y2="42.71" />
          <line className={[styles['cls2'], className].join(' ')} x1="27.55" y1="33.51" x2="26.13" y2="32.1" />
        </g>
      </g>
    </svg>
  );
}

export default Sun;
