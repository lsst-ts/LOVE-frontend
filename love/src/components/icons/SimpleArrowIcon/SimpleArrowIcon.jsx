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
import styles from './SimpleArrowIcon.module.css';

export default function SimpleArrowIcon(props) {
  const direction = props.direction ? props.direction : '';
  const className = [styles.icon, props.className, props.style].join(' ');

  switch (direction) {
    case 'top':
      return (
        <svg viewBox="0 0 12 22" className={styles.top}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    case 'right':
      return (
        <svg viewBox="0 0 12 22" className={styles.right}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    case 'bottom':
      return (
        <svg viewBox="0 0 12 22" className={styles.bottom}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    case 'left':
      return (
        <svg viewBox="0 0 12 22" className={styles.left}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 12 22" className={styles.right}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
  }
}
