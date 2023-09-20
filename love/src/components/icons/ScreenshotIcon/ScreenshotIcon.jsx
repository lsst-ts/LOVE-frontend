/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React from 'react';
import styles from './ScreenshotIcon.module.css';

export default function ScreenshotIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.userIcon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 38 39.2" className={className}>
      <g>
        <g>
          <g>
            <path
              className={status}
              d="M6.9,13.1c0,0.7,0.6,1.2,1.2,1.2s1.2-0.6,1.2-1.2V10h3c0.7,0,1.2-0.6,1.2-1.2s-0.6-1.2-1.2-1.2h-3V5.1     c0-0.7-0.6-1.2-1.2-1.2S6.9,4.4,6.9,5.1v2.5H4.5c-0.7,0-1.2,0.6-1.2,1.2S3.8,10,4.5,10h2.5V13.1z"
            />
            <path
              className={status}
              d="M29.8,16.8c-0.7,0-1.2,0.6-1.2,1.2v3.2c0,0.7,0.6,1.2,1.2,1.2s1.2-0.6,1.2-1.2V18     C31.1,17.4,30.5,16.8,29.8,16.8z"
            />
            <path
              className={status}
              d="M25.5,10h0.6c1.4,0,2.5,1.1,2.5,2.5v0.6c0,0.7,0.6,1.2,1.2,1.2s1.2-0.6,1.2-1.2v-0.6c0-2.7-2.2-4.9-4.9-4.9     h-0.6c-0.7,0-1.2,0.6-1.2,1.2S24.8,10,25.5,10z"
            />
            <path
              className={status}
              d="M8.2,16.8c-0.7,0-1.2,0.6-1.2,1.2v3.2c0,0.7,0.6,1.2,1.2,1.2s1.2-0.6,1.2-1.2V18C9.4,17.4,8.9,16.8,8.2,16.8     z"
            />
            <path
              className={status}
              d="M12.5,29.2h-0.6c-1.4,0-2.5-1.1-2.5-2.5v-0.6c0-0.7-0.6-1.2-1.2-1.2s-1.2,0.6-1.2,1.2v0.6     c0,2.7,2.2,4.9,4.9,4.9h0.6c0.7,0,1.2-0.6,1.2-1.2C13.7,29.7,13.2,29.2,12.5,29.2z"
            />
            <path
              className={status}
              d="M33.5,29.2h-2.5v-3c0-0.7-0.6-1.2-1.2-1.2s-1.2,0.6-1.2,1.2v3h-3.1c-0.7,0-1.2,0.6-1.2,1.2     c0,0.7,0.6,1.2,1.2,1.2h3.1v2.5c0,0.7,0.6,1.2,1.2,1.2s1.2-0.6,1.2-1.2v-2.5h2.5c0.7,0,1.2-0.6,1.2-1.2     C34.7,29.7,34.2,29.2,33.5,29.2z"
            />
            <path
              className={status}
              d="M20.6,7.6h-3.2c-0.7,0-1.2,0.6-1.2,1.2s0.6,1.2,1.2,1.2h3.2c0.7,0,1.2-0.6,1.2-1.2S21.3,7.6,20.6,7.6z"
            />
            <path
              className={status}
              d="M20.6,29.2h-3.2c-0.7,0-1.2,0.6-1.2,1.2c0,0.7,0.6,1.2,1.2,1.2h3.2c0.7,0,1.2-0.6,1.2-1.2     C21.8,29.7,21.3,29.2,20.6,29.2z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
