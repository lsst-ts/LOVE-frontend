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
import styles from './MutedIcon.module.css';

const MutedIcon = ({ active }) => (
  <svg viewBox="0 0 23 19.42">
    <title>{active ? 'Mute' : 'Muted'}</title>
    <path
      className={active ? styles.active : styles.inactive}
      d="M15.22.08a.49.49 0 00-.52 0L7.47 5.44H1.2a.5.5 0 100 1h5.93v4.18a.5.5 0 00.5.49.49.49 0 00.49-.49V6.18L14.5 1.5V18l-6.58-4.87a.48.48 0 00-.29-.13H1.69V9.19a.5.5 0 10-1 0v4.34a.5.5 0 00.5.5h6.28l7.23 5.32a.5.5 0 00.29.09.64.64 0 00.23-.05.52.52 0 00.27-.44V.52a.49.49 0 00-.27-.44zM20.52 9.36l2.24-2.25a.48.48 0 000-.7.5.5 0 00-.7 0l-2.24 2.25-2.24-2.25a.5.5 0 00-.7 0 .48.48 0 000 .7l2.24 2.25-2.24 2.24a.48.48 0 000 .7.46.46 0 00.35.14.49.49 0 00.35-.14l2.24-2.24 2.24 2.24a.49.49 0 00.35.14.46.46 0 00.35-.14.48.48 0 000-.7z"
      transform="translate(0 -.02)"
    />
  </svg>
);

export default MutedIcon;
