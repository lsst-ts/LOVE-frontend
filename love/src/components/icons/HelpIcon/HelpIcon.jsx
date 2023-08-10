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
import styles from './HelpIcon.module.css';

class HelpIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 42.4 53.54">
        <path
          d="M4.36.89h24.41L43 15.08v35.56a3.8 3.8 0 01-3.79 3.79H4.36a3.81 3.81 0 01-3.8-3.79v-46A3.81 3.81 0 014.36.89zm18.81 32.19a2.2 2.2 0 01-4.39 0v-1.16a7.67 7.67 0 01.71-3.5 10.76 10.76 0 012.81-3.09 21 21 0 002.53-2.24 3 3 0 00.64-1.86 3.05 3.05 0 00-1.13-2.39 4.39 4.39 0 00-3-1 4.65 4.65 0 00-3.08 1 5.6 5.6 0 00-1.7 3.21 2.23 2.23 0 01-4.45-.28 2.83 2.83 0 010-.29 7.36 7.36 0 012.62-5.22 9.29 9.29 0 016.39-2.15 9.69 9.69 0 016.62 2.17 6.57 6.57 0 012.46 5.05 5.57 5.57 0 01-.9 3 20.18 20.18 0 01-3.86 3.88 7.54 7.54 0 00-1.9 2 7.08 7.08 0 00-.33 2.77zM21 36.91a2.5 2.5 0 11-2.49 2.5 2.5 2.5 0 012.49-2.5z"
          className={styles.helpIcon}
          transform="translate(-.56 -.89)"
        ></path>
      </svg>
    );
  }
}

export default HelpIcon;
