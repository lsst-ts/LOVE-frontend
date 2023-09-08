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
import styles from './CloseIcon.module.css';

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <title>{'Close'}</title>
      <path
        className={styles.path}
        d="M3.33 22.19A1 1 0 012 20.82l8.26-8.26L2 4.31a1 1 0 010-1.38 1 1 0 011.37 0l8.25 8.25 8.26-8.26a1 1 0 011.37 1.38L13 12.56l8.25 8.26a1 1 0 010 1.37 1 1 0 01-1.38 0l-8.26-8.26z"
      />
    </svg>
  );
}

export default CloseIcon;
