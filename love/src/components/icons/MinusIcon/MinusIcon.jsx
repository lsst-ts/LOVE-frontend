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
import styles from './MinusIcon.module.css';

export default function MinusIcon(props) {
  const className = props.className ? [styles.cls1, props.className].join(' ') : styles.cls1;
  return (
    <svg viewBox="0 0 15.56 15.56" className={className}>
      <path
        d="M2.66,10.36a7.78,7.78,0,1,0,7.78-7.78A7.79,7.79,0,0,0,2.66,10.36ZM14.51,9.17a1.19,1.19,0,1,1,0,2.38H6.36a1.19,1.19,0,1,1,0-2.38Z"
        transform="translate(-2.66 -2.58)"
      />
    </svg>
  );
}
