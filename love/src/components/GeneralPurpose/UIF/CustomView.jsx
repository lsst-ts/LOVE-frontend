import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import PropTypes from 'prop-types';
import styles from './CustomView.module.css';
import '../../AuxTel/Mount/MotorTable/MotorTable.container';

export default class CustomView extends Component {
  static propTypes = {
    layout: PropTypes.object,
    baseColWidth: PropTypes.number,
  };

  static defaultProps = {};

  parseElement = (element, index) => {
    return element.properties.type === 'container'
      ? this.parseContainer(element, index)
      : this.parseComponent(element, index);
  };

  parseComponent = (component, index) => {
    return (
      <div key={index.toString()} className={styles.componentWrapper}>
        {typeof component.content === 'string' ? (
          <span>
            `${component.content}-${index}`
          </span>
        ) : (
          <component.content />
        )}
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
          width={this.props.baseColWidth * container.properties.w}
          margin={[0, 0]}
          verticalCompact={false}
        >
          {elements}
        </GridLayout>
      </div>
    );
  };

  render() {
    const parsedTree = this.parseElement(this.props.layout, 0);
    return parsedTree;
  }
}
