import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Info.module.css';
import { dmFlowStatusMap, stateToStyleDMFlow } from 'Config';
import { VegaLite } from 'react-vega';

class PlotDiv extends Component {
  static propTypes = {
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
        mark: this.props.schema?.mark,
        encoding: this.props.schema?.encoding,
        data: { name: 'values' },
        autosize: {
          type: 'fit',
          contains: 'padding',
        },
        width: state.containerWidth,
        height: state.containerHeight,
      },
      data: { ...this.props.schema?.data },
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
    if (this.props.containerNode.current && !this.resizeObserver) {
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

export default PlotDiv;
