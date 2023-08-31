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
import CustomView from './CustomView';

export default function CustomViewSample() {
  const layout = {
    properties: {
      type: 'container',
      x: 0,
      y: 0,
      w: 100,
      h: 2,
      i: 0,
      allowOverflow: true,
      cols: 100,
    },
    content: {
      LeftPanel: {
        properties: {
          type: 'component',
          x: 0,
          y: 0,
          w: 13,
          h: 17,
          i: 1,
        },
        content: 'CSCGroup',
        config: {
          name: 'ATMCS',
          cscs: [
            {
              name: 'ATMCS',
              salindex: 0,
            },
            {
              name: 'ATPtg',
              salindex: 0,
            },
            {
              name: 'ATDome',
              salindex: 0,
            },
            {
              name: 'ATDomeTrajectory',
              salindex: 0,
            },
            {
              name: 'ATAOS',
              salindex: 0,
            },
            {
              name: 'ATPneumatics',
              salindex: 0,
            },
            {
              name: 'ATHexapod',
              salindex: 0,
            },
          ],
        },
      },
      RightPanel: {
        properties: {
          type: 'component',
          x: 13,
          y: 0,
          w: 13,
          h: 17,
          i: 2,
        },
        content: 'CSCGroup',
        config: {
          name: 'ATCalSys',
          cscs: [
            {
              name: 'ATMonochromator',
              salindex: 0,
            },
            {
              name: 'FiberSpectrograph',
              salindex: 0,
            },
            {
              name: 'ATWhiteLight',
              salindex: 0,
            },
            {
              name: 'Electrometer',
              salindex: 1,
            },
            {
              name: 'Electrometer',
              salindex: 2,
            },
            {
              name: 'LinearStage',
              salindex: 1,
            },
            {
              name: 'LinearStage',
              salindex: 2,
            },
          ],
        },
      },
    },
  };
  return <CustomView layout={layout}></CustomView>;
}
