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
import styles from './AddIcon.module.css';

function AddIcon({ className, ...props }) {
  return (
    <svg className={className} viewBox="0 0 48.02 48.02" {...props}>
      <path
        d="M24 .47a24 24 0 1024 24 24 24 0 00-24-24zm0 7.68A2.88 2.88 0 0126.84 11v10.59H37.4a2.88 2.88 0 110 5.76H26.84v10.57a2.89 2.89 0 01-5.77 0V27.35H10.51a2.88 2.88 0 110-5.76h10.56V11A2.88 2.88 0 0124 8.15z"
        className={[styles['cls-1'], className].join(' ')}
        transform="translate(.05 -.47)"
      ></path>
    </svg>
  );
}

export default AddIcon;
