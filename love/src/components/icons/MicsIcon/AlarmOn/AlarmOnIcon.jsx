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
import styles from './AlarmOnIcon.module.css';

function AlarmOnIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.29 24">
      <path
        className={styles.cls1}
        d="m12.62.61L.16,22.24c-.33.56-.14,1.27.42,1.59.18.11.39.16.59.16h24.95c.65,0,1.17-.53,1.17-1.17,0-.2-.05-.4-.16-.58L14.68.61c-.31-.57-1.02-.78-1.59-.47-.2.11-.36.27-.47.47Z"
      />
      <path d="m13.37,6.85c-.77,0-1.39.41-1.39,1.16,0,2.25.26,5.5.26,7.76,0,.59.52.84,1.12.84.45,0,1.1-.25,1.1-.84,0-2.26.26-5.51.26-7.76-.03-.67-.59-1.19-1.26-1.17-.03,0-.07,0-.1,0Z" />
      <path d="m13.39,17.92c-.81-.06-1.51.55-1.56,1.36-.06.81.55,1.51,1.36,1.56.07,0,.14,0,.2,0,.81-.06,1.41-.76,1.36-1.56-.05-.73-.63-1.31-1.36-1.36Z" />
    </svg>
  );
}

export default AlarmOnIcon;
