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
import styles from './BeachIcon.module.css';

export default function BeachIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.icon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 18.34 20" className={className}>
      <path
        className={status}
        d="m.98,9.77c.13.66.84,1.02,1.47.8l.83-.3C1.78,5.99,3.08,1.64,6.21.5,2.36,1.89.21,5.88.98,9.77Z"
      />
      <path className={status} d="m6.02,9.26l5.97-2.17C10.41,2.85,7.84-.1,6.21.5c-1.63.59-1.71,4.51-.19,8.77Z" />
      <path
        className={status}
        d="m16.17,4.24C14.26.76,10.05-.9,6.21.5c3.13-1.14,6.92,1.36,8.52,5.6l.83-.3c.63-.23.94-.97.61-1.55Z"
      />
      <path className={status} d="m9.85,12.06h1.14l-2.69-7.38c-.1-.28-.41-.42-.69-.32-.28.1-.42.41-.32.69l2.55,7.02Z" />
      <path
        className={status}
        d="m16.77,12.06h-5.79l1.11,3.06c.1.28-.04.59-.32.69-.06.02-.12.03-.18.03-.22,0-.42-.14-.5-.35l-1.25-3.42h-4.51c-1.11,0-2.06.79-2.26,1.89-.14.77-.6,1.46-1.27,1.88l-.91.58c-.69.44-1.03,1.27-.86,2.06.19.89.99,1.53,1.9,1.53h14.83c.87,0,1.57-.7,1.57-1.57v-4.8c0-.87-.7-1.57-1.57-1.57Zm-13.47,6.32c.03.19.1.37.19.54h-1.54c-.41,0-.77-.29-.86-.69-.08-.36.08-.73.39-.93l.91-.58c.92-.58,1.55-1.53,1.75-2.59.11-.58.62-1.01,1.21-1.01h.71c-.17.27-.3.57-.34.9-.11.76-.5,1.44-1.1,1.92l-.62.5c-.56.45-.82,1.16-.69,1.94Zm4.88-4.26l-.02.23c-.06.6-.31,1.15-.71,1.6l-.54.6c-.38.42-.55.98-.48,1.54l.03.2c.03.23.1.44.2.63h-1.43c-.43,0-.79-.31-.88-.81-.05-.32.07-.64.32-.84l.62-.5c.81-.65,1.34-1.57,1.49-2.6.09-.6.61-1.05,1.22-1.05h.55c-.19.29-.31.62-.35.99Z"
      />
    </svg>
  );
}
