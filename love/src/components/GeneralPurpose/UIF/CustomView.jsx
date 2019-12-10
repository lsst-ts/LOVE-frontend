import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import PropTypes from 'prop-types';
import styles from './CustomView.module.css';
import '../../AuxTel/Mount/MotorTable/MotorTable.container';
import componentIndex from './ComponentIndex';
import Panel from '../Panel/Panel';

export default class CustomView extends Component {
  static propTypes = {
    /** Layout object describing the view, composed of recursively nested Elements, with the following format:
      <Element>: {
        "properties": {
          "type": <string:element type, one of ["container","component"]>,
          "x": <int:x position>,
          "y": <int:y position>,
          "w": <int:element width>,
          "h": <int:element height>,
          "i": <int:element index>,
          "cols": <int:number of columns>
        },
        "content": <ContainerContent> or ComponentContent>,
        "config": <string:element configuration>,
      }

      <ContainerContent>: {
        <string:Element name>: <Element>,
        <string:Element name>: <Element>,
        ...
      }

      <ComponentContent>: <string: component name>

      The config object may contain a special field '_functionProps', an array containing the
      prop fields which are functions, to be parsed with eval
     */
    layout: PropTypes.object,
    /** Width for each column defined in layout */
    baseColWidth: PropTypes.number,
    /** Callback called when layout changes */
    onLayoutChange: PropTypes.func,
  };

  static defaultProps = {
    layout: undefined,
    baseColWidth: 20,
    onLayoutChange: () => {},
  };

  parseConfig = (config) => {
    const newConfig = { ...config };
    if (config && config._functionProps) {
      config._functionProps.forEach((fProp) => {
        // eslint-disable-next-line
        newConfig[fProp] = eval(config[fProp]);
      });
    }
    return newConfig;
  };

  parseElement = (element) => {
    if (!element || !element.properties) return null;
    return element.properties.type === 'container' ? this.parseContainer(element) : this.parseComponent(element);
  };

  parseComponent = (component) => {
    let comp = '';
    const LoveComp = componentIndex[component.content];
    const { config } = component;
    const parsedConfig = this.parseConfig(config);
    comp = <LoveComp {...parsedConfig} />;
    return (
      <div
        key={component.properties.i.toString()}
        className={[styles.componentWrapper, component.properties.allowOverflow ? '' : styles.noOverflow].join(' ')}
      >
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
        allowOverflow: x.allowOverflow,
      };
    });
    return (
      <div
        key={container.properties.i.toString()}
        className={[styles.container, layout.allowOverflow ? '' : styles.noOverflow].join(' ')}
      >
        <Panel title={`Component ${container.properties.i.toString()}`} className={styles.containerPanel}>
          <GridLayout
            layout={layout}
            items={layout.length}
            rowHeight={20}
            onLayoutChange={this.props.onLayoutChange}
            cols={container.properties.cols}
            width={this.props.baseColWidth * container.properties.w}
            margin={[0, 0]}
            verticalCompact={false}
            className={styles.gridLayout}
          >
            {elements}
          </GridLayout>
        </Panel>
      </div>
    );
  };

  render() {
    const parsedTree = this.parseElement(this.props.layout, 0);
    return <>{parsedTree}</>;
  }
}
