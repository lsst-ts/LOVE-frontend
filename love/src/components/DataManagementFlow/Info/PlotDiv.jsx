/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
