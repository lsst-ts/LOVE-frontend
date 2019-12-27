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
