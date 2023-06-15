import React, { Component } from 'react';
import { VegaLite } from 'react-vega';
import PropTypes from 'prop-types';
import styles from './VegaCustomPlot.module.css';

/**
 * Generates plots using different marks (lines, points, bars, etc) on different layers
 * on a canvas that is auto-sized to match its parent node size.
 */
class VegaCustomPlot extends Component {
  static propTypes = {
    /** Width of the plot in pixels */
    width: PropTypes.number,

    /** Height of the plot in pixels */
    height: PropTypes.number,

    /** Node to be used to track width and height.
     *  Use this instead of props.width and props.height for responsive plots.
     *  Will be ignored if both props.width and props.height are provided */
    containerNode: PropTypes.node,

    /** Vega-lite JSON schema.
     *  Some examples can be found here: https://vega.github.io/vega-lite/examples/ */
    schema: PropTypes.object,

    /** classname to be appended to the default one in <VegaLite ...> */
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.resizeObserver = undefined;
    this.state = {
      containerWidth: 400,
      containerHeight: 200,
      spec: {},
      data: {},
    };
  }

  updateSchema = () => {
    this.setState((state) => ({
      spec: {
        mark: this.props.schema.mark,
        encoding: this.props.schema.encoding,
        config: this.props.schema.config ?? {
          background: null,
          title: { color: '#ddd' },
          style: {
            'guide-label': {
              fill: '#ddd',
            },
            'guide-title': {
              fill: '#ddd',
            },
          },
          axis: {
            domainColor: '#626262',
            gridColor: '#424242',
            tickColor: null,
          },
          axisX: {
            titlePadding: 16,
            titleFontWeight: 750,
            labelFontWeight: 750,
            tickCount: 5,
          },
        },
        data: { name: 'values' },
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        width: this.props.width ?? state.containerWidth,
        height: this.props.height ?? state.containerHeight,
      },
      data: { ...this.props.schema.data },
    }));
  };

  setResizeObserver = () => {
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.setState({ containerWidth: width, containerHeight: height }, () => this.updateSchema());
    });

    if (this.props.containerNode.current) {
      this.resizeObserver.observe(this.props.containerNode.current);
    }
  };

  componentDidMount = () => {
    this.updateSchema();
  };

  componentDidUpdate = (prevProps) => {
    if (
      this.props.containerNode.current &&
      !this.resizeObserver &&
      this.props.width === undefined &&
      this.props.height === undefined
    ) {
      this.setResizeObserver();
    }

    if (prevProps.schema !== this.props.schema) {
      this.updateSchema();
    }
  };

  componentWillUnmount = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  };

  render() {
    const { spec, data } = this.state;
    return (
      <VegaLite
        style={{ display: 'flex' }}
        renderer="svg"
        spec={spec}
        data={data}
        className={[styles.plotContainer, this.props.className].join(' ')}
        actions={false}
      />
    );
  }
}

export default VegaCustomPlot;
