import React, { Component } from 'react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'; // GridLayout
import PropTypes from 'prop-types';
import styles from './CustomView.module.css';
import '../AuxTel/Mount/MotorTable/MotorTable.container';
import componentIndex from './ComponentIndex';
import Button from '../GeneralPurpose/Button/Button';
import GearIcon from '../icons/GearIcon/GearIcon';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon.jsx';
import ErrorBoundary from '../GeneralPurpose/ErrorBoundary/ErrorBoundary';
import Panel from '../GeneralPurpose/Panel/Panel';
import DashedBox from '../GeneralPurpose/DashedBox/DashedBox';

export const DEVICE_TO_SIZE = {
  '4K': 2560,
  'Laptop L': 1440,
  Laptop: 1024,
  Tablet: 768,
  'Mobile L': 425,
  'Mobile M': 375,
  'Mobile S': 320,
};

export const DEVICE_TO_COLS = {
  Infinity: 100,
  '4K': 100,
  'Laptop L': 100,
  Laptop: 100,
  Tablet: 100,
  'Mobile L': 2,
  'Mobile M': 2,
  'Mobile S': 2,
};

const MOBILE_REFERENCE_COLS_THRESHOLD = 2;
const MOBILE_REFERENCE_LABEL = Object.keys(DEVICE_TO_COLS).find(
  (label) => DEVICE_TO_COLS[label] <= MOBILE_REFERENCE_COLS_THRESHOLD,
);
const MOBILE_REFERENCE_WIDTH = DEVICE_TO_SIZE[MOBILE_REFERENCE_LABEL];

class CustomView extends Component {
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
    /** Object specifying the device size.
     * It defaults to "DESKTOP" size. Sizes are mapped as:
     * MOBILE:
     * TABLET
     * DESKTOP
     *  */
    device: PropTypes.string,
  };

  static defaultProps = {
    layout: undefined,
    baseColWidth: 20,
    onLayoutChange: () => {},
    isEditable: false,
    onComponentDelete: () => {},
    onComponentConfig: () => {},
    getCurrentView: () => {},
    deviceWidth: undefined,
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
          <Button onClick={() => this.props.onComponentConfig(component)} title="Configure" className={styles.iconButton}>
            <div className={styles.gearIconWrapper}>
              <GearIcon active className={styles.icon}/>
            </div>
          </Button>
          <Button onClick={() => this.props.onComponentDelete(component)} title="Remove" className={styles.iconButton}>
            <div className={styles.gearIconWrapper}>
              <DeleteIcon className={styles.icon}/>
            </div>
          </Button>
        </div>

        {parsedConfig.titleBar ? (
          <ErrorBoundary>
            <Panel title={parsedConfig.title} fit={false} hasRawMode={parsedConfig.hasRawMode} link={parsedConfig.link}>
              {comp}
            </Panel>
          </ErrorBoundary>
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

  getDeviceWidth = () => {
    return !this.props.deviceWidth || !isFinite(this.props.deviceWidth)
      ? window.innerWidth - 1
      : this.props.deviceWidth;
  };

  getColsDict = (container) => {
    return typeof container.properties.cols === 'object' ? container.properties.cols : DEVICE_TO_COLS;
  };

  getDeviceLabel = (width) => {
    const minDevice = Object.entries(DEVICE_TO_SIZE).reduce((previousMinKey, [key, width]) => {
      if (previousMinKey === '') {
        return key;
      }

      if (width < DEVICE_TO_SIZE[previousMinKey]) {
        return key;
      }
      return previousMinKey;
    }, '');

    const entry = Object.entries(DEVICE_TO_SIZE).find(([key, deviceOptionWidth]) => {
      if (deviceOptionWidth <= width) {
        return true;
      }
      return false;
    });
    return entry?.[0] ?? minDevice;
  };

  parseContainer = (container) => {
    const elements = Object.values(container.content).map((x) => {
      return this.parseElement(x);
    });

    const deviceWidth = this.getDeviceWidth();
    const deviceLabel = this.getDeviceLabel(deviceWidth);
    const deviceCols = DEVICE_TO_COLS[deviceLabel];

    // IMPORTANT NOTICE
    // goal: to use same pixel space in larger devices as in a mobile device layout
    // in mobile device it uses  width1 = x.properties.w * mobileDeviceWidth / mobileDeviceColumns
    // in desktop device it uses width2 = x.properties.w * desktopDeviceWidth / desktopDeviceColumns
    // need C such that width2 = C * width1
    // C = mobileDeviceWidth / mobileDeviceColumns * ( desktopDeviceColumns / desktopDeviceWidth )
    // C = mobileDeviceWidth / desktopDeviceWidth * desktopDeviceColumns / mobileDeviceColumns

    // this is only if the container was set with cols < THRESHOLD
    // otherwise x.properties.w must be used

    let colsScalingFactor = 1;
    if (container.properties.cols <= MOBILE_REFERENCE_COLS_THRESHOLD) {
      colsScalingFactor = ((MOBILE_REFERENCE_WIDTH / deviceWidth) * deviceCols) / container.properties.cols;
    }

    const layout = Object.values(container.content).map((x) => {
      return {
        x: colsScalingFactor * x.properties.x,
        y: x.properties.y,
        w: colsScalingFactor * x.properties.w,
        h: x.properties.h,
        i: x.properties.i.toString(),
        allowOverflow: x.properties.allowOverflow,
      };
    });

    const cols = this.getColsDict(container);

    const maxWidthKey = Object.entries(DEVICE_TO_SIZE).reduce((argMaxKey, [key, width]) => {
      if (DEVICE_TO_SIZE[argMaxKey] >= width) {
        return argMaxKey;
      }
      return key;
    }, Object.keys(DEVICE_TO_SIZE)[0]);

    return (
      <div
        key={container.properties.i.toString()}
        className={[
          styles.container,
          this.props.isEditable ? styles.editableContainer : '',
          container.properties.allowOverflow ? styles.allowOverflow : styles.noOverflow,
        ].join(' ')}
      >
        {this.props.isEditable && isFinite(this.props.deviceWidth) && (
          <>
            <div
              className={styles.deviceOutline}
              style={{
                width: `${deviceWidth}px`,
              }}
            >
              <DashedBox />
            </div>

            <div
              className={styles.outsideDeviceArea}
              style={{
                left: `${deviceWidth + Math.max(0.5 * (window.innerWidth - deviceWidth), 100)}px`,
                maxWidth: `${Math.max(window.innerWidth - deviceWidth, 100)}px`,
              }}
            >
              This area will be invisible to the user on the selected device. Please change the device size on the top
              bar before dragging components here.
            </div>
          </>
        )}

        <ResponsiveGridLayout
          layouts={{ [maxWidthKey]: layout }}
          breakpoints={DEVICE_TO_SIZE}
          items={layout.length}
          rowHeight={20}
          onResizeStop={(layout) => {
            document.documentElement.style.setProperty("--min-editor-height", `${0}px`);
            this.onResizeStop(layout);
          }}
          onResizeStart={(a, b, c, d, e) => {
            this.gridRef = document.getElementsByClassName(styles.gridLayout)[0];
            this.minHeight = 0;
            console.log(a, b, c, d, e)
          }}
          onResize={(a, b, c, d, e) => {
            if(this.gridRef.clientHeight > this.minHeight){
              this.minHeight = Math.max(this.minHeight ?? 0, this.gridRef.clientHeight ?? 0);
              document.documentElement.style.setProperty("--min-editor-height", `${this.minHeight}px`);
            }
          }}
          onDragStop={this.onDragStop}
          cols={cols}
          width={deviceWidth + 1}
          margin={[0, 0]}
          compactType={this.state.compactType}
          className={styles.gridLayout}
          draggableCancel=".nonDraggable"
          isDraggable={this.props.isEditable}
          isResizable={this.props.isEditable}
        >
          {elements}
        </ResponsiveGridLayout>
      </div>
    );
  };

  render() {
    const layout = this.props.layout ? this.props.layout : this.state.loadedView.data;
    const parsedTree = this.parseElement(layout, 0);
    return <>{parsedTree}</>;
  }
}

export default CustomView;
