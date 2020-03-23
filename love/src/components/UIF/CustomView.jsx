import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import PropTypes from 'prop-types';
import styles from './CustomView.module.css';
import '../AuxTel/Mount/MotorTable/MotorTable.container';
import componentIndex from './ComponentIndex';
import Button from '../GeneralPurpose/Button/Button';
import GearIcon from '../icons/GearIcon/GearIcon';
import ErrorBoundary from '../GeneralPurpose/ErrorBoundary/ErrorBoundary';
import Panel from '../GeneralPurpose/Panel/Panel';

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
          "cols": <int:number of columns>,
          "allowOverflow": <bool: whether to allow component to overflow or not>
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
    /** Whether the view is editable */
    isEditable: PropTypes.bool,
    /** Callback called when a component is deleted */
    onComponentDelete: PropTypes.func,
    /** Callback called when a component is configured */
    onComponentConfig: PropTypes.func,
    /** Function to load the current view from redux */
    getCurrentView: PropTypes.func,
    /** Location object from router */
    location: PropTypes.object,
  };

  static defaultProps = {
    layout: undefined,
    baseColWidth: 20,
    onLayoutChange: () => {},
    isEditable: false,
    onComponentDelete: () => {},
    onComponentConfig: () => {},
    getCurrentView: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      loadedView: {},
      id: null,
      compactType: 'vertical',
    };
  }

  componentDidMount() {
    if (this.props.location) {
      const id = parseInt(new URLSearchParams(this.props.location.search).get('id'), 10);
      if (id !== null && !isNaN(id)) {
        this.props.requestView(id).then(() => {
          const loadedView = this.props.getCurrentView(id);
          this.setState({
            loadedView: loadedView || {},
            id,
          });
        });
      }
    }
  }

  parseConfig = (config) => {
    const newConfig = { ...config };
    if (config && config._functionProps) {
      config._functionProps.forEach((fProp) => {
        // eslint-disable-next-line
        newConfig[fProp] = eval(`(${config[fProp]})`);
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
    const LoveComp = componentIndex[component.content].component;
    const { config } = component;
    const parsedConfig = this.parseConfig(config);
    comp = <LoveComp {...parsedConfig} />;
    return (
      <div
        key={component.properties.i.toString()}
        className={[
          styles.componentWrapper,
          parsedConfig.margin ? styles.marginComponentPanel : '',
          component.properties.allowOverflow ? '' : styles.noOverflow,
          this.props.isEditable ? styles.editable : '',
        ].join(' ')}
      >
        <div className={styles.editableComponentActions}>
          <Button onClick={() => this.props.onComponentConfig(component)}>
            <div className={styles.gearIconWrapper}>
              <GearIcon active />
            </div>
          </Button>
          <Button onClick={() => this.props.onComponentDelete(component)}>&#10005;</Button>
        </div>
        {parsedConfig.titleBar ? (
          <Panel title={parsedConfig.title} fit={false}>
            <ErrorBoundary>{comp}</ErrorBoundary>
          </Panel>
        ) : (
          <ErrorBoundary>{comp}</ErrorBoundary>
        )}
      </div>
    );
  };

  onResizeStop = (layout) => {
    this.props.onLayoutChange(layout);
  };

  onDragStop = (layout) => {
    this.props.onLayoutChange(layout);
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
        allowOverflow: x.properties.allowOverflow,
      };
    });
    return (
      <div
        key={container.properties.i.toString()}
        className={[
          styles.container,
          container.properties.allowOverflow ? styles.allowOverflow : styles.noOverflow,
        ].join(' ')}
      >
        <GridLayout
          layout={layout}
          items={layout.length}
          rowHeight={20}
          onResizeStop={this.onResizeStop}
          onDragStop={this.onDragStop}
          cols={container.properties.cols}
          width={this.props.baseColWidth * container.properties.w}
          margin={[0, 0]}
          compactType={this.state.compactType}
          className={styles.gridLayout}
          draggableCancel=".nonDraggable"
          isDraggable={this.props.isEditable}
          isResizable={this.props.isEditable}
        >
          {elements}
        </GridLayout>
      </div>
    );
  };

  render() {
    const layout = this.props.layout ? this.props.layout : this.state.loadedView.data;
    const parsedTree = this.parseElement(layout, 0);
    return <>{parsedTree}</>;
  }
}
