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

import * as React from 'react';

export const AdvancedLinkSegmentWidget = ({ forwardRef, selected, hovered, link, extras, path, buttonLocation }) => {
  const highlightedColor = React.useMemo(
    () => getComputedStyle(document.body).getPropertyValue('--second-quinary-background-color'),
    [],
  );

  const topCircle = React.useRef();
  const bottomCircle = React.useRef();

  React.useEffect(() => {
    if (!topCircle.current || !bottomCircle.current || !buttonLocation) {
      return;
    }
    const path = forwardRef.current;
    const midPoint = path.getPointAtLength(path.getTotalLength() * buttonLocation);

    topCircle.current.setAttribute('cx', '' + midPoint.x);
    topCircle.current.setAttribute('cy', '' + midPoint.y);
    bottomCircle.current.setAttribute('cx', '' + midPoint.x);
    bottomCircle.current.setAttribute('cy', '' + midPoint.y);
  });

  const commonProps = {
    pointerEvents: 'all',
    style: { cursor: 'pointer' },
    ...extras,
  };

  const color = selected || link.isSelected() ? link.getOptions().selectedColor : link.getOptions().color;
  return (
    <g>
      <path
        strokeLinecap="round"
        stroke={highlightedColor}
        opacity={hovered ? 0.7 : 0}
        strokeWidth={link.getOptions().width + 10}
        d={path}
        {...commonProps}
      />
      <path ref={forwardRef} stroke={color} strokeWidth={link.getOptions().width} d={path} {...commonProps} />

      {buttonLocation !== undefined && (
        <>
          <circle ref={bottomCircle} r={6.4} stroke={color} fill={color} opacity={0.5} {...commonProps} />
          <circle ref={topCircle} r={3.2} stroke={color} fill={color} {...commonProps} />
        </>
      )}
    </g>
  );
};
