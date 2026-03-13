/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import styles from './Style.module.css';

function Exclamation() {
  return (
    <svg viewBox="0 0 1.25 6">
      <path
        className={styles.alert}
        d="m.62,0C.28,0,.03.18.03.5.03,1.47.14,2.86.14,3.83c0,.25.22.36.48.36.2,0,.47-.11.47-.36,0-.97.11-2.36.11-3.33,0-.32-.27-.5-.59-.5Z"
      />
      <path className={styles.alert} d="m.63,4.75c-.35,0-.63.28-.63.63s.28.63.63.63.63-.28.63-.63-.28-.63-.63-.63Z" />
    </svg>
  );
}

export default Exclamation;
