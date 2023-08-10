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
import styles from './DeleteIcon.module.css';

export default function DeleteIcon(props) {
  const className = [styles.deleteIcon, props.className].join(' ');
  return (
    <svg viewBox="0 0 43.55 54.44" className={className}>
      <path
        d="M43.64,7.05V9.77a1.36,1.36,0,0,1-1.36,1.36H1.45A1.36,1.36,0,0,1,.09,9.77V7.05A1.36,1.36,0,0,1,1.45,5.69H13.7V3A2.72,2.72,0,0,1,16.42.25H27.31A2.72,2.72,0,0,1,30,3V5.69H42.28A1.36,1.36,0,0,1,43.64,7.05ZM5.18,49.62a5.45,5.45,0,0,0,5.45,5.07H33.16a5.45,5.45,0,0,0,5.45-5.07l2.31-33H2.81Z"
        transform="translate(-0.09 -0.25)"
      />
    </svg>
  );
}
