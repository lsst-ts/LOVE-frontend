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

const getCursorPos = (e, props) => {
  let { x, y, height, width } = e.target.getBoundingClientRect();
  let vOff = 0;
  if (props.middle) vOff = height / 2;
  if (props.bottom) vOff = height;
  let hOff = 0;
  if (props.center) hOff = width / 2;
  if (props.right) hOff = width;
  return [x + hOff, y + vOff];
};

const Trigger = (props) => {
  let newProps = {
    onMouseEnter: (e) => {
      props.show(getCursorPos(e, props));
    },
    onMouseLeave: () => props.hide(),
  };
  const trigger = props.children.length > 1 ? props.children[0] : props.children;
  const float = props.children[1];
  if (float) {
    if (trigger.props.children) {
      newProps.children = [trigger.props.children, float];
    } else newProps.children = float;
  }
  return React.cloneElement(trigger, newProps);
};

export default Trigger;
