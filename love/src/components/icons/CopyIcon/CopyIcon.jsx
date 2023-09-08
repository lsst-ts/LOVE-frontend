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
import styles from './CopyIcon.module.css';

function CopyIcon({ title, className, ...props }) {
  return (
    <svg viewBox="0 0 90 120" className={[styles.svg, className].join(' ')} {...props}>
      <title>{title}</title>
      <rect y="20" width="70" height="100" rx="10" ry="10" />
      <path d="m80,0H31c-5.52,0-10,4.48-10,10v4h40c8.27,0,15,6.73,15,15v70h4c5.52,0,10-4.48,10-10V10c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}

export default CopyIcon;
