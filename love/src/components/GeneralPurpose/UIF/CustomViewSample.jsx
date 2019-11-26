import React from 'react';
import CustomView from './CustomView';

export default function CustomViewSample() {
  const topComp = {
    properties: { type: 'component', x: 0, y: 0, w: 5, h: 9 },
    content: require('../../AuxTel/Mount/SummaryPanel/SummaryPanel.container').default,
  };

  const bottomComp = {
    properties: { type: 'component', x: 0, y: 1, w: 4, h: 14 },
    content: require('../../AuxTel/Mount/LightPath.container').default,
  };

  const rightPanel = {
    properties: { type: 'container', x: 0, y: 5, w: 5, h: 2, cols: 5 },
    content: {
      TopComponent: topComp,
      BottomComponent: bottomComp,
    },
  };

  const leftPanel = {
    properties: { type: 'component', x: 0, y: 0, w: 12, h: 5 },
    content: require('../../AuxTel/Mount/MotorTable/MotorTable.container').default,
  };

  const mainContainer = {
    properties: { type: 'container', x: 0, y: 0, w: 20, h: 2, cols: 20 },
    content: {
      LeftPanel: leftPanel,
      RightPanel: rightPanel,
    },
  };

  return <CustomView layout={mainContainer} baseColWidth={100}></CustomView>;
}
