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
import styles from './Stars.module.css';

function Stars({ className, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.29 38" {...props}>
      <g id="star">
        <path
          className={[styles['cls1'], className].join(' ')}
          d="m12.61,9.98l3.21.92c.39.15.39.71,0,.86l-3.21.92c-.13.05-.22.14-.27.27l-.92,3.21c-.15.39-.71.39-.86,0l-.92-3.21c-.05-.13-.14-.22-.27-.27l-3.21-.92c-.39-.15-.39-.71,0-.86l3.21-.92c.13-.05.22-.14.27-.27l.92-3.21c.15-.39.71-.39.86,0l.92,3.21c.05.13.14.22.27.27Z"
        />
        <path
          className={[styles['cls1'], className].join(' ')}
          d="m47.29,28.7l2.02.58c.25.09.25.45,0,.54l-2.02.58c-.08.03-.14.09-.17.17l-.58,2.02c-.09.25-.45.25-.54,0l-.58-2.02c-.03-.08-.09-.14-.17-.17l-2.02-.58c-.25-.09-.25-.45,0-.54l2.02-.58c.08-.03.14-.09.17-.17l.58-2.02c.09-.25.45-.25.54,0l.58,2.02c.03.08.09.14.17.17Z"
        />
        <circle className={[styles['cls1'], className].join(' ')} cx="18.25" cy="28.65" r="1.7" />
        <circle className={[styles['cls1'], className].join(' ')} cx="32.57" cy="13.51" r=".99" />
        <circle className={[styles['cls1'], className].join(' ')} cx="50.78" cy="13.6" r="2.5" />
      </g>
    </svg>
  );
}

export default Stars;
