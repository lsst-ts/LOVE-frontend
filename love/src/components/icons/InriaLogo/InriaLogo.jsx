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
import styles from './InriaLogo.module.css';

function InriaLogo(props) {
  const style = [styles, props.className].join(' ');
  return (
    <svg viewBox="0 0 171.43 50" {...props}>
      <title>{props.title}</title>
      <path
        className={style.path}
        d="m34.3,6.47c2.34-1.41,4.76-3.3,6.92-5.49,1.69-1.72-5.76-.95-7.55.58-1.93,1.65-3.91,3.47-5.73,5.59-1.06,1.24,4.03.72,6.36-.67Zm136.28,38.63c1.32.79,1.26-3.34-1.4-5-9.55-5.94-35.66,4.41-45.57,5.59-1.86.22-2.53-.25-2.09-1.5.84-2.43,4.15-6.89,4.82-8.43.63-1.47.54-6.51-6.92-6.51-6.1,0-11.7,2.83-15.63,6.39-3.75,3.19-11.01,9.51-15.48,9.51s8.93-13.97,9.68-14.68c2.02-1.89-4.34-1.42-7.01.61-1.07.81-5.33,5.36-7.99,9.77-7.71,5.32-15.38,6.56-11.73,2.13,1.94-2.36,5.23-5.52,7.49-8.02,3.15-3.5,2.58-5.79-4.38-5.79-9.32,0-10.31.81-15.57,6.96-.98,1.14-.47,4.01.54,3.02,6.31-6.24,6.17-5.73,14.52-5.73-1.34,1.43-3.74,2.85-7.8,7.99-3.62,4.59-1.25,8.3,3.89,8.3,2.84,0,7.08-1.33,10.96-4.06-.46,2.39.5,4.11,4.16,4.11,4.24,0,9.08-2.52,13.09-5.32-.5,3.04,1.06,5.32,5.55,5.32,3.45,0,7.47-1.35,11.62-4.95-.02,2.75,1.92,4.93,5.53,4.93,8.8,0,39.19-11.03,49.76-4.66Zm-64.55.72c-5.77,0,5.78-13.17,13.31-13.17,4.51,0-7.75,13.17-13.31,13.17Zm-4.58-20.37c2.34-1.41,6.75-4.83,8.92-7.02,1.69-1.72-5.76-.95-7.55.58-1.93,1.65-5.14,4.6-6.95,6.73-1.06,1.24,3.27,1.12,5.59-.28Zm-45.55,14.03c-2.26,2.2-7.21,5.9-11.53,5.9-3.2,0,3.17-5.72,6.33-10.34,3.01-4.41.55-5.73-1.94-5.73-6.16,0-12.17,4.32-16.25,7.35,1.23-1.65,3.15-3.76,5.19-6.46,1.13-1.5-5.65-.96-7.39,1.32-.55.72-1.16,1.53-1.81,2.4-5.89,7.07-14.79,11.85-19.16,11.85-2.43,0-3.32-1.67-1.8-4.84,3.65-7.63,16.23-22.14,23.07-28.49,3.1-2.91-6.22-1.72-8.36.42C12.79,22.41,3.25,33.04.56,41.31c-1.49,4.58-.11,8.69,5.58,8.69,4.67,0,9.85-2.31,14.24-5.06-1.08,1.47-2.07,2.81-2.86,3.89-1.24,1.68,5.05,1.07,6.37-.63,4.97-6.36,16.92-14.17,20.25-14.17,3.03,0-7.4,7.81-7.3,12.59.12,6.28,14.67,2.43,19.61-4.03.77-1.01.17-3.78-.53-3.11Z"
      />
    </svg>
  );
}

export default InriaLogo;
