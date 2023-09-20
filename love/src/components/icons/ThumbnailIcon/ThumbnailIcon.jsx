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
import styles from './ThumbnailIcon.module.css';

export default function ThumbnailIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.thumbnailIcon, props.className, props.style].join(' ');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.76 24.78" className={className}>
      <path
        d="M33.3 2.73H4.45A1.44 1.44 0 003 4.16v21.91a1.45 1.45 0 001.44 1.44h28.89a1.45 1.45 0 001.44-1.44V4.13a1.47 1.47 0 00-1.47-1.4zm-1.4 2.83v15l-5.45-4a1.25 1.25 0 00-1.43 0l-4 2.9-7.21-6.54a1.18 1.18 0 00-1.64 0l-6.32 5.7V5.56z"
        className={styles['cls-1']}
        transform="translate(-3.01 -2.73)"
      ></path>
      <circle cx="18.44" cy="9.02" r="2.64" className={styles['cls-1']}></circle>
    </svg>
  );
}
