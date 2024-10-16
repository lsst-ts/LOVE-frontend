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
import styles from './NotificationSoundIcon.module.css';

function NotificationSoundOnIcon(props) {
  const { selected, className } = props;
  const colorClass = !selected ? styles.clsnfc : styles.clsnfcSel;
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.4 24">
      <g>
        <path className={colorClass} d="m10.35,24c1.77,0,3.2-1.43,3.2-3.2h-6.4c0,1.77,1.43,3.2,3.2,3.2Z" />
        <path
          className={colorClass}
          d="m19.31,15.27c-1.77-1.64-2.92-3.81-3.28-6.17l-.15-1.03c-.26-1.69-1.25-3.07-2.61-3.92.13-.34.18-.66.18-1.05,0-1.72-1.38-3.1-3.1-3.1s-3.1,1.38-3.1,3.1c0,.36.08.72.18,1.05-1.36.85-2.36,2.25-2.61,3.92l-.15,1.03c-.36,2.36-1.51,4.53-3.28,6.17-.64.62-1.03,1.47-1.03,2.36,0,.94.77,1.74,1.74,1.74h16.47c.95,0,1.74-.77,1.74-1.74,0-.89-.36-1.74-1-2.36ZM11.6,3.46c-.41-.1-.82-.15-1.25-.15s-.85.05-1.25.15c-.03-.13-.06-.23-.06-.36,0-.72.59-1.3,1.3-1.3s1.31.59,1.31,1.3c0,.13-.03.26-.05.36Z"
        />
      </g>
      <g>
        <path
          className={colorClass}
          d="m18.21,12.09c-.06,0-.12-.03-.16-.08-.07-.09-.05-.21.04-.28.56-.42.89-1.05.89-1.73s-.33-1.32-.89-1.74c-.09-.07-.11-.19-.04-.28.07-.09.19-.11.28-.04.67.49,1.05,1.24,1.05,2.06s-.38,1.56-1.05,2.05c-.04.03-.08.04-.12.04Z"
        />
        <path
          className={colorClass}
          d="m18.81,12.92c-.06,0-.12-.03-.16-.08-.07-.09-.05-.21.04-.28.83-.62,1.31-1.55,1.31-2.56s-.48-1.95-1.32-2.57c-.09-.07-.11-.19-.04-.28.07-.09.19-.11.28-.04.94.69,1.48,1.75,1.48,2.89s-.53,2.18-1.47,2.88c-.04.03-.08.04-.12.04Z"
        />
      </g>
      <g>
        <path
          className={colorClass}
          d="m2.19,12.09c.06,0,.12-.03.16-.08.07-.09.05-.21-.04-.28-.56-.42-.89-1.05-.89-1.73s.33-1.32.89-1.74c.09-.07.11-.19.04-.28-.07-.09-.19-.11-.28-.04-.67.49-1.05,1.24-1.05,2.06s.38,1.56,1.05,2.05c.04.03.08.04.12.04Z"
        />
        <path
          className={colorClass}
          d="m1.59,12.92c.06,0,.12-.03.16-.08.07-.09.05-.21-.04-.28-.83-.62-1.31-1.55-1.31-2.56s.48-1.95,1.32-2.57c.09-.07.11-.19.04-.28-.07-.09-.19-.11-.28-.04-.94.69-1.48,1.75-1.48,2.89s.53,2.18,1.47,2.88c.04.03.08.04.12.04Z"
        />
      </g>
    </svg>
  );
}

export default NotificationSoundOnIcon;
