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
import styles from './AcknowledgeIcon.module.css';

const AcknowledgeIcon = ({ active, className, nonAcknowledge }) => (
  <svg viewBox="0 0 13.81 9.55">
    {nonAcknowledge && <title>{active ? 'Acknowledge' : 'Acknowledged'}</title>}
    <path
      className={[active ? styles.active : styles.inactive, className].join(' ')}
      d="M12.25,2.21C9.3-.74,4.51-.74,1.56,2.21L0,3.78l1.56,1.56c2.95,2.95,7.74,2.95,10.69,0l1.56-1.56-1.56-1.56ZM6.91,6.28c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5,2.5,1.12,2.5,2.5-1.12,2.5-2.5,2.5Z"
    />
  </svg>
);

export default AcknowledgeIcon;
