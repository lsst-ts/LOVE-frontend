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
import { VegaLite } from 'react-vega';

export default class HeatMap extends Component {
  static propTypes = {
    /**
     * Info of the current mic to plot
     */
    infoPlot: PropTypes.object,
    /** Node to be used to track width and height.
     *  Use this instead of props.width and props.height for responsive plots.
     */
    containerNode: PropTypes.object,
  };

  static defaultProps = {
    infoPlot: {},
    containerNode: undefined,
  };

  static COLOURS = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];

  constructor(props) {
    super(props);

    const initialContainerHeight = 206;
    const initialContainerWidth = 390;

    const domain =
      props.minDecibels !== undefined && props.maxDecibels !== undefined
        ? [props.minDecibels, props.maxDecibels]
        : [-100, 0];

    this.state = {
      infoPlot: null,
      containerWidth: initialContainerWidth,
      containerHeight: initialContainerHeight,
      spec: {
        width: initialContainerWidth,
        height: initialContainerHeight,
        autosize: { resize: 'true' },
        data: { name: 'table' },
        mark: { type: 'rect' },
        encoding: {
          x: { field: 't', type: 'temporal', axis: { title: 'TIME', format: '%H:%M:%S', grid: true } },
          y: {
            field: 'f',
            type: 'quantitative',
            axis: { title: 'FREQUENCY [Hz]', grid: true, labels: true },
            scale: { domain: [0, this.bufferLength + 1] },
          },
          color: {
            type: 'quantitative',
            field: 'amp',
            scale: {
              range: [...HeatMap.COLOURS],
              domain: domain,
            },
            legend: {
              labelColor: '#ddd',
              labelFontSize: 14,
              titleColor: '#ddd',
              title: 'dB',
              gradientLength: initialContainerHeight,
            },
          },
        },
        config: {
          background: null,
          axis: {
            gridColor: '#424242',
            tickColor: null,
            titleColor: '#ddd',
            labelColor: '#ddd',
            titleFontWeight: 750,
            labelFontWeight: 750,
            titlePadding: 16,
          },
        },
      },
    };

    this.resizeObserver = undefined;
  }

  componentDidMount() {
    if (this.props.containerNode) {
      this.resizeObserver = new ResizeObserver((entries) => {
        const container = entries[0];
        if (container.contentRect.height !== 0 && container.contentRect.width !== 0) {
          this.setState({
            containerHeight: container.contentRect.height - 19,
            containerWidth: container.contentRect.width,
            resizeObserverListener: true,
          });
        }
      });
      if (!(this.props.containerNode instanceof Element)) return;
      this.resizeObserver.observe(this.props.containerNode);
      return () => {
        this.resizeObserver.disconnect();
      };
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.containerNode !== this.props.containerNode) {
      if (this.props.containerNode && !this.state.resizeObserverListener) {
        this.resizeObserver = new ResizeObserver((entries) => {
          const container = entries[0];
          this.setState({
            containerHeight: container.contentRect.height - 19,
            containerWidth: container.contentRect.width,
          });
        });
        this.resizeObserver.observe(this.props.containerNode);
      }
    }

    if (this.props.infoPlot !== null) {
      if (this.props.infoPlot.timeDomain !== undefined) {
        const { timeDomain, windowTimePlot, bufferLength } = this.props.infoPlot;
        const prevTimeDomain = prevProps.infoPlot?.timeDomain;
        if (timeDomain !== false) {
          if (prevTimeDomain !== timeDomain) {
            this.constructSpec(timeDomain, windowTimePlot, bufferLength);
          }
        }
      }
    }

    if (this.props.containerNode && prevProps.containerNode !== this.props.containerNode) {
      if (!(this.props.containerNode instanceof Element)) return;
      this.resizeObserver.observe(this.props.containerNode);
      return () => {
        this.resizeObserver.disconnect();
      };
    }
  };

  /**
   * Function that update the spec inpu to Vega Lite Heat Map.
   * @param {Array} timeDomain, x-axis heat map.
   * @param {number} windowTimePlot, x-axis amount of elements.
   * @param {number} bufferLength, y-axis amount of elements.
   */
  constructSpec = (timeDomain, windowTimePlot, bufferLength) => {
    const height = this.state.containerHeight;
    const width = this.state.containerWidth;
    const { minDecibels, maxDecibels } = this.props.infoPlot;
    const domain = minDecibels !== undefined && maxDecibels !== undefined ? [minDecibels, maxDecibels] : undefined;

    const spec = {
      width: width,
      height: height,
      autosize: { resize: 'true' },
      data: { name: 'table' },
      mark: { type: 'rect' },
      encoding: {
        x: {
          field: 't_min',
          type: 'temporal',
          axis: { title: 'TIME', format: '%H:%M:%S', tickCount: windowTimePlot - 1, grid: true },
          scale: { domain: timeDomain },
        },
        x2: {
          field: 't_max',
          type: 'temporal',
        },
        y: {
          field: 'f_min',
          type: 'quantitative',
          axis: { title: 'FREQUENCY [Hz]', grid: true, labels: true },
          scale: { domain: [0, bufferLength + 1] },
        },
        y2: { field: 'f_max', type: 'quantitative' },
        color: {
          type: 'quantitative',
          field: 'amp',
          scale: {
            range: [...HeatMap.COLOURS],
            domain: domain,
          },
          legend: {
            labelColor: '#ddd',
            labelFontSize: 14,
            titleColor: '#ddd',
            title: 'dB',
            gradientLength: height,
          },
        },
      },
      config: {
        background: null,
        axis: {
          gridColor: '#424242',
          tickColor: null,
          titleColor: '#ddd',
          labelColor: '#ddd',
          titleFontWeight: 750,
          labelFontWeight: 750,
          titlePadding: 16,
        },
      },
    };
    this.setState({ spec: spec });
  };

  componentWillUnmount = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  };

  render() {
    if (!this.props.infoPlot) {
      return <></>;
    }
    const { data3D } = this.props.infoPlot;
    return (
      <>
        {<VegaLite style={{ display: 'flex' }} renderer="svg" spec={this.state.spec} data={data3D} actions={false} />}
      </>
    );
  }
}
