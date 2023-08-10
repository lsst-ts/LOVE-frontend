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

const Float = (props) => {
  let vOff = 0;
  if (props.middle) vOff = 50;
  if (props.top) vOff = 100;

  let hOff = 0;
  if (props.center) hOff = 50;
  if (props.left) hOff = 100;

  let style = {
    position: 'absolute',
    left: props.position[0],
    top: props.position[1],
  };
  if (hOff !== 0 || vOff !== 0) style.transform = `translate(-${hOff}%, -${vOff}%)`;
  const newProps = {
    style,
    onMouseLeave: () => props.hide(),
  };
  return React.cloneElement(props.children, newProps);
};

export default Float;
