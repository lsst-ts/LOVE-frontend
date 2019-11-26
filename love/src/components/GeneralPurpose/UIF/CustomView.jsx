import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import styles from './CustomView.module.css';

export default class CustomView extends Component {
  constructor() {
    super();

    const topComp = {
      properties: { type: 'component', x: 0, y: 0, w: 5, h: 1 },
      content: 'MotorTable',
    };

    const bottomComp = {
      properties: { type: 'component', x: 0, y: 1, w: 5, h: 1 },
      content: 'TimeSeries',
    };

    const rightPanel = {
      properties: { type: 'container', x: 5, y: 0, w: 5, h: 2, cols: 5 },
      content: {
        TopComponent: topComp,
        BottomComponent: bottomComp,
      },
    };

    const leftPanel = {
      properties: { type: 'component', x: 0, y: 0, w: 5, h: 2 },
      content: 'LightPath',
    };

    const mainContainer = {
      properties: { type: 'container', x: 0, y: 0, w: 10, h: 2, cols: 10 },
      content: {
        LeftPanel: leftPanel,
        RightPanel: rightPanel,
      },
    };

    this.state = {
      mainContainer,
      baseColWidth: 100,
    };
  }

  parseElement = (element, index) => {
    return element.properties.type === 'container'
      ? this.parseContainer(element, index)
      : this.parseComponent(element, index);
  };

  parseComponent = (component, index) => {
    return (
      <div key={index.toString()} className={styles.componentWrapper}>
        <span>{`${component.content}-${index}`}</span>
      </div>
    );
  };

  parseContainer = (container, index) => {
    const elements = Object.values(container.content).map((x, i) => {
      return this.parseElement(x, i);
    });
    const layout = Object.values(container.content).map((x, i) => {
      return {
        x: x.properties.x,
        y: x.properties.y,
        w: x.properties.w,
        h: x.properties.h,
        i: i.toString(),
      };
    });
    return (
      <div key={index} className={styles.container}>
        <GridLayout
          layout={layout}
          items={layout.length}
          rowHeight={50}
          onLayoutChange={() => {}}
          cols={container.properties.cols}
          width={this.state.baseColWidth * container.properties.w}
          margin={[0, 0]}
          verticalCompact={false}
        >
          {elements}
        </GridLayout>
      </div>
    );
  };

  render() {
    const parsedTree = this.parseElement(this.state.mainContainer, 0);
    return parsedTree;
  }
}
