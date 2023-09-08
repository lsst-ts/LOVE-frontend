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
import styles from './VolumeIcon.module.css';

const VOL100 =
  'M321.709,39.084c-5.081-2.54-11.162-1.993-15.708,1.417l-150,112.5l-150,112.5 c-5.165,3.874-7.272,10.618-5.23,16.743c2.042,6.125,7.774,10.257,14.23,10.257h150h150c8.284,0,15-6.716,15-15v-225 C330.001,46.819,326.791,41.625,321.709,39.084z';
const VOL50 =
  'M321.709,39.084c-5.081-2.54-11.162-1.993-15.708,1.417l-150,112.5l-150,112.5 c-5.165,3.874-7.272,10.618-5.23,16.743c2.042,6.125,7.774,10.257,14.23,10.257h150h150c8.284,0,15-6.716,15-15v-225 C330.001,46.819,326.791,41.625,321.709,39.084z M300.001,262.5h-120v-90l120-90V262.5z';
const VOL0 =
  'M321.709,39.084c-5.081-2.54-11.162-1.993-15.708,1.417l-150,112.5l-150,112.5 c-5.165,3.874-7.272,10.618-5.23,16.743c2.042,6.125,7.774,10.257,14.23,10.257h150h150c8.284,0,15-6.716,15-15v-225 C330.001,46.819,326.791,41.625,321.709,39.084z M200.001,262.5h-120v-15l120-90V262.15z M320.001,262.5h-120v-100l100-90V262.5z';

function VolumeIcon(props) {
  const { isOpacity, volumeValue } = props;
  const d = volumeValue < 0.5 ? VOL0 : volumeValue < 1.5 ? VOL50 : VOL100;

  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330.001 330.001">
      <path className={isOpacity ? styles.cls2 : styles.cls1} d={d} />
    </svg>
  );
}

export default VolumeIcon;
