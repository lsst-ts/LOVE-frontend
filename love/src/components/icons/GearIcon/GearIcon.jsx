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
import styles from './GearIcon.module.css';

export default function GearIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.gearIcon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 45.29 47.01" className={className}>
      <path
        d="M35.48,3.2V8.37A16.32,16.32,0,0,1,39,10.42l4.48-2.59a2.77,2.77,0,0,1,2.09-.27,2.68,2.68,0,0,1,1.68,1.3l3.85,6.65a2.77,2.77,0,0,1-1,3.79l-4.48,2.58a15.72,15.72,0,0,1,.14,2.06,17.19,17.19,0,0,1-.13,2l4.47,2.6a2.76,2.76,0,0,1,1,3.77L47.29,39a2.76,2.76,0,0,1-3.77,1L39,37.45a16.73,16.73,0,0,1-3.56,2v5.16a2.78,2.78,0,0,1-2.77,2.78H25a2.79,2.79,0,0,1-2.78-2.78V39.5a16.42,16.42,0,0,1-3.55-2L14.22,40a2.86,2.86,0,0,1-1.39.37,2.94,2.94,0,0,1-.71-.09A2.8,2.8,0,0,1,10.43,39L6.59,32.35a2.77,2.77,0,0,1,1-3.78L12.07,26a17.21,17.21,0,0,1-.14-2,17.52,17.52,0,0,1,.14-2.06L7.6,19.3a2.78,2.78,0,0,1-1-3.78l3.84-6.67a2.78,2.78,0,0,1,3.78-1l4.48,2.59a16,16,0,0,1,3.55-2.05V3.2A2.78,2.78,0,0,1,25,.43h7.69A2.77,2.77,0,0,1,35.48,3.2ZM28.86,13.44a10.5,10.5,0,1,0,10.5,10.49A10.5,10.5,0,0,0,28.86,13.44Z"
        transform="translate(-6.22 -0.43)"
      />
      <path d="M28.87,17.93a5.7,5.7,0,1,0,5.69,5.7A5.7,5.7,0,0,0,28.87,17.93Z" transform="translate(-6.22 -0.43)" />
    </svg>
  );
}
