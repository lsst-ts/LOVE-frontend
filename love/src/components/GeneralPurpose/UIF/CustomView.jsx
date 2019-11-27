import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import PropTypes from 'prop-types';
import styles from './CustomView.module.css';
import '../../AuxTel/Mount/MotorTable/MotorTable.container';
import componentIndex from './ComponentIndex';

export default class CustomView extends Component {
  static propTypes = {
    layout: PropTypes.object,
    baseColWidth: PropTypes.number,
    onLayoutChange: PropTypes.func,
  };

  static defaultProps = {
    layout: undefined,
    baseColWidth: 100,
    onLayoutChange: () => {},
  };

  parseElement = (element) => {
    if (!element || !element.properties) return null;
    return element.properties.type === 'container' ? this.parseContainer(element) : this.parseComponent(element);
  };

  parseComponent = (component) => {
    let comp = '';
    const LoveComp = componentIndex[component.content];
    comp = <LoveComp />;
    return (
      <div key={component.properties.i.toString()} className={[styles.componentWrapper, styles.noOverflow].join(' ')}>
        {comp}
      </div>
    );
  };

  parseContainer = (container) => {
    const elements = Object.values(container.content).map((x) => {
      return this.parseElement(x);
    });
    const layout = Object.values(container.content).map((x) => {
      return {
        x: x.properties.x,
        y: x.properties.y,
        w: x.properties.w,
        h: x.properties.h,
        i: x.properties.i.toString(),
      };
    });
    return (
      <div key={container.properties.i.toString()} className={[styles.container, styles.noOverflow].join(' ')}>
        <GridLayout
          layout={layout}
          items={layout.length}
          rowHeight={50}
          onLayoutChange={this.props.onLayoutChange}
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
    return <>{parsedTree}</>;
  }
}
