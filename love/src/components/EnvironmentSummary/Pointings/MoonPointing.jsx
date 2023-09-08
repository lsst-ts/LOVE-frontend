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
import styles from './MoonPointing.module.css';

function Moon({ className, ...props }) {
  let { ilumination } = props;
  ilumination = ilumination * 100 ?? 0;
  const fill = ilumination < 50 ? '#0c171e' : '#a6bac6';
  const rx = ilumination < 50 ? (50 - ilumination).toString() : (-50 + ilumination).toString();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} {...props}>
      <path className={styles.cls20} d="m50,0c27.61,0,50,22.39,50,50s-22.39,50-50,50V0Z" />
      <path className={styles.cls10} d="m50,0C22.39,0,0,22.39,0,50s22.39,50,50,50V0Z" />
      <ellipse style={{ fill: fill }} cx="50" cy="50" rx={rx} ry="50" />
    </svg>
  );
}

export default Moon;
