import React from 'react';
import CustomView from './CustomView';

export default function CustomViewSample() {
  const topComp = {
    properties: { type: 'component', x: 0, y: 0, w: 5, h: 9, i: 3 },
    content: 'SummaryPanel',
  };

  const bottomComp = {
    properties: { type: 'component', x: 0, y: 1, w: 4, h: 14, i: 4 },
    content: 'LightPath',
  };

  const rightPanel = {
    properties: { type: 'container', x: 0, y: 5, w: 5, h: 2, cols: 5, i: 2 },
    content: {
      TopComponent: topComp,
      BottomComponent: bottomComp,
    },
  };

  const leftPanel = {
    properties: { type: 'component', x: 0, y: 0, w: 12, h: 5, i: 1 },
    content: 'MotorTable',
  };

  const mainContainer = {
    properties: { type: 'container', x: 0, y: 0, w: 20, h: 2, cols: 20, i: 0 },
    content: {
      LeftPanel: leftPanel,
      RightPanel: rightPanel,
    },
  };
  return <CustomView layout={mainContainer} baseColWidth={100}></CustomView>;
}
