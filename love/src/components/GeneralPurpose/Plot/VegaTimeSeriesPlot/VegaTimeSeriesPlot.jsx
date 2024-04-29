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

import { Component } from 'react';
import { VegaLite } from 'react-vega';
import { isEqual } from 'lodash';
import styles from './VegaTimeSeriesPlot.module.css';
import PropTypes from 'prop-types';

export const SHAPES = [
  'circle',
  'square',
  'diamond',
  'triangle-up',
  'triangle-down',
  'triangle-right',
  'triangle-left',
  'cross',
];

export const COLORS = [
  '#ff7bb5', // pink
  '#97e54f', // green
  '#00b7ff', // light blue
  '#f9b200', // orange-ish
  '#a9a5ff', // purple-ish
];

export const DASHES = [
  [4, 0], // continous line
  [4, 1],
  [4, 2],
  [2, 1],
  [2, 2],
  [8, 4],
  [8, 2],
  [8, 1],
];

export const ORIENT = ['left', 'right'];

/**
 * Generates plots using different marks (lines, points, bars, etc) on different layers
 * on a canvas that is auto-sized to match its parent node size.
 */
class VegaTimeseriesPlot extends Component {
  static propTypes = {
    /** classname to be appended to the default one in <VegaLite ...> */
    className: PropTypes.string,

    /** Width of the plot in pixels */
    width: PropTypes.number,

    /** Height of the plot in pixels */
    height: PropTypes.number,

    /** Object with data separated on different keys to be plotted in different layers.
     * Passed directly as <VegaLite data={layers} ...>
     */
    layers: PropTypes.shape({
      /** List of {name, x, y} with points of lines to be plotted as lines
       *  - name distinguishes a mark from another
       *  - x, y are the plot-axis coordinates of a point in that line
       */
      lines: PropTypes.arrayOf(PropTypes.object),
      /**
       * ------ PENDING see example-------
       * List of {name, x, y} with points of lines to be plotted as lines with points
       *  - name distinguishes a mark from another
       *  - x, y are the plot-axis coordinates of a point in that line
       */
      pointLines: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, y}` of bars to be plotted.
       *  - name distinguishes a mark from another
       *  - x, y are the plot-axis coordinates of a point in that line
       */
      bars: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, y, angle}` of line plot with arrow direction to be plotted.
       *  - name distinguishes a mark from another
       *  - x, y are the plot-axis coordinates of a point in that line
       *  - angle is the direction of the arrow in degrees
       */
      arrows: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, y, y2}` of area plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x, y, y2 are the plot-axis coordinates of a point in that area
       *  - The area limit is defined by y and y2
       */
      areas: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, base, y, y2}` of area plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x, base are the plot-axis coordinates of a point in the baseline
       *  - The spread area is defined by y and y2
       */
      spreads: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, base, delta}` of bar plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x, base, delta are the plot-axis coordinates of a point in bar
       */
      bigotes: PropTypes.arrayOf(PropTypes.object),
      /**
       * List of `{name, x, x2, y, y2}` of rect plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x, x2 are the x-axis plot-axis coordinates of points in rectangle
       *  - y, y2 are the y-axis plot-axis coordinates of points in rectangle
       */
      rects: PropTypes.arrayOf(PropTypes.object),
      /** List of `{name, x, x2, low, mid, high}` of heatmap plot to be plotted.
       *  - name distinguishes a mark from another
       *  - x, x2 are the x-axis plot-axis coordinates of points in rectangle
       *  - low, mid, high define the color from the scale of the heatmap
       */
      heatmaps: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,

    /**
     * Defines the styles of each mark to be plotted.
     */
    marksStyles: PropTypes.arrayOf(
      PropTypes.shape({
        /** (All layers) `name` attribute of the data to apply these styles.
         * Rows of data with no name-matching markStyle will not be rendered.
         */
        name: PropTypes.string.isRequired,
        /** (All layers) hex color */
        color: PropTypes.string.isRequired,
        /** (Only `lines` layer). Dash pattern for segmented lines passed to the strokeDash channel. E.g, [2, 1] draws
         * a line with a pattern of 2 "filled" pixels and 1 "empty" pixel.
         */
        dash: PropTypes.arrayOf(PropTypes.number),
        /** (Only `pointLines` layer). Shape of the points to be drawn https://vega.github.io/vega-lite/docs/point.html*/
        shape: PropTypes.string,
        /** (Only `pointLines` layer). Whether to draw a filled point or only its border. */
        filled: PropTypes.bool,
        /** (All layers). Which side to put the y-axis legent: left or right */
        orient: PropTypes.string,
        /** (All layers). Offset in pixels of the y-axis legend */
        offset: PropTypes.number,
        /** (All layers). If true, the axis will be hidden */
        hideAxis: PropTypes.bool,
      }),
    ).isRequired,

    /** Title of the x axis */
    xAxisTitle: PropTypes.string,

    /** If true, x axis labels will be rendered as timestamps */
    temporalXAxis: PropTypes.bool,

    /** Time format to be used by marks tooltips, e.g. `%H:%M:%S` */
    temporalXAxisFormat: PropTypes.string,

    /** If true, the plot will have independent scales for each layer */
    scaleIndependent: PropTypes.bool,

    /** Scale domain to be applied to all layers */
    scaleDomain: PropTypes.shape({
      domainMax: PropTypes.number,
      domainMin: PropTypes.number,
    }),
  };

  static defaultProps = {
    className: '',
    width: 400,
    height: 240,
    layers: {},
    marksStyles: [],
    xAxisTitle: 'time',
    temporalXAxis: true,
    temporalXAxisFormat: '%H:%M:%S',
    scaleIndependent: false,
    scaleDomain: {},
  };

  makeAxisTitle = (title, units) => {
    return `${title} ${units ? `[${units}]` : ''}`;
  };

  /**
   * Generates the style encoding dictionary to be used
   * by the functions to make layers, such as makeLineLayer.
   * It reads the marksStyles prop and generates the style encoding object.
   * @returns {Object} The style encoding object.
   */
  makeStyleEncoding = () => {
    const { marksStyles } = this.props;
    const filteredMarksStyles = marksStyles.filter((l) => l.name !== '' && !l.labelOnly);
    const names = filteredMarksStyles.map((style) => style.name);

    return {
      fill: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: filteredMarksStyles.map((style) => {
            if (style.filled !== undefined && !style.filled) {
              return 'none';
            }
            return style.color ?? COLORS[0];
          }),
        },
        legend: names,
      },
      shape: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: filteredMarksStyles.map((style) => style.shape ?? SHAPES[0]),
        },
        legend: null,
      },
      color: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: filteredMarksStyles.map((style) => style.color ?? COLORS[0]),
        },
        legend: null,
      },
      stroke: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: filteredMarksStyles.map((style) => style.color ?? COLORS[0]),
        },
        legend: null,
      },
      strokeDash: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names,
          range: filteredMarksStyles.map((style) => style.dash ?? DASHES[0]),
        },
        legend: null,
      },
    };
  };

  /**
   * Generates an axis specification object based on the given mark style.
   * If the mark style has the hideAxis property set to true, it returns null.
   * A title limit of 70% of the height is set to avoid sizing issues when the title is too long.
   * @param {object} markStyle - The mark style object. Obtained from the marksStyles prop.
   * @returns {object} The axis specification object.
   */
  makeAxisSpec = (markStyle) => {
    const { height } = this.props;
    if (markStyle.hideAxis) return null;
    return {
      title: markStyle.name,
      titleColor: markStyle.color,
      titleLimit: height * 0.7,
      orient: markStyle.orient,
      offset: markStyle.offset,
    };
  };

  /**
   * Creates a lines layer configuration for the VegaTimeSeriesPlot component.
   * This is the simplest layer form, with just 1 mark.
   * @returns {Object} The line layer configuration.
   */
  makeLineLayer = () => {
    const { marksStyles, scaleDomain } = this.props;
    const layerName = 'lines';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'line');
    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: axisSpec,
              scale: scaleDomain,
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
      ];
    });

    return {
      data: { name: layerName }, // note: vega-lite data attribute is a plain object instead of an array
      layer: marksLayers.flat(),
    };
  };

  /**
   * Creates a pointLines layer configuration for the VegaTimeSeriesPlot component.
   * This layer is composed of two marks: point and line.
   * Also a ruler is added to show the value of the point when hovering over it.
   * @returns {Object} The points layer configuration.
   */
  makePointsLayer = () => {
    const { marksStyles, scaleDomain, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'pointLines';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'pointLine');
    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'point',
            size: 80,
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: axisSpec,
              scale: scaleDomain,
            },
            stroke: styleEncoding.stroke,
            fill: styleEncoding.fill,
            shape: styleEncoding.shape,
          },
        },
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
      ];
    });

    return {
      data: { name: layerName }, // note: vega-lite data attribute is a plain object instead of an array
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY',
        },
      ],
      layer: [
        ...marksLayers.flat(),
        {
          mark: 'rule',
          params: [
            {
              name: 'hover',
              select: { type: 'point', on: 'mouseover' },
            },
          ],
          encoding: {
            color: {
              condition: {
                param: 'hover',
                empty: false,
                value: 'white',
              },
              value: 'transparent',
            },
            size: { value: 4 },
            tooltip: [
              {
                title: 'name',
                field: 'labelY',
              },
              {
                field: 'x',
                type: temporalXAxis ? 'temporal' : 'quantitative',
                format: temporalXAxisFormat,
              },
              {
                field: 'y',
                format: '.2f',
              },
            ],
          },
        },
      ],
    };
  };

  /**
   * Creates a bars layer for the VegaTimeSeriesPlot component.
   * The layer is composed by a bar mark.
   * @returns {Object} The bar layer configuration object.
   */
  makeBarLayer = () => {
    const { marksStyles, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'bars';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'bar');
    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'bar',
            size: 25,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: axisSpec,
            },
            color: styleEncoding.color,
            tooltip: [
              {
                title: 'name',
                field: 'labelY',
              },
              {
                field: 'x',
                type: temporalXAxis ? 'temporal' : 'quantitative',
                format: temporalXAxisFormat,
              },
              {
                field: 'y',
                format: '.2f',
              },
            ],
          },
        },
      ];
    });

    return {
      data: { name: layerName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY',
        },
      ],
      layer: marksLayers.flat(),
    };
  };

  /**
   * Creates an arrows layer for the VegaTimeSeriesPlot component.
   * The layer is composed by a line mark and a text mark with an arrow character.
   * @returns {Object} The arrow layer configuration object.
   */
  makeArrowLayer = () => {
    const { marksStyles, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'arrows';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'arrow');

    const sharedTooltipSpec = [
      {
        title: 'name',
        field: 'labelY',
      },
      {
        field: 'x',
        type: temporalXAxis ? 'temporal' : 'quantitative',
        format: temporalXAxisFormat,
      },
      {
        field: 'y',
        format: '.2f',
      },
    ];
    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: axisSpec,
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
            tooltip: sharedTooltipSpec,
          },
        },
        {
          mark: {
            type: 'text',
            dx: 0,
            fontSize: 24,
            color: '#d3e1eb',
          },
          encoding: {
            text: {
              value: '➟',
            },
            y: {
              field: 'y',
              type: 'quantitative',
            },
            angle: {
              field: 'angle',
              type: 'quantitative',
              scale: { domain: [360, 0] },
            },
            tooltip: [
              ...sharedTooltipSpec,
              {
                field: 'angle',
                format: '.2f',
              },
            ],
          },
        },
      ];
    });

    return {
      data: { name: layerName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.angle + "]"',
          as: 'labelY',
        },
      ],
      layer: marksLayers.flat(),
    };
  };

  /**
   * Creates an areas layer for the VegaTimeSeriesPlot component.
   * The layer is composed by two line marks and an area mark.
   * @returns {Object} The area layer configuration.
   */
  makeAreaLayer = () => {
    const { marksStyles, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'areas';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'area');

    const sharedTooltipSpec = [
      {
        title: 'name',
        field: 'labelY',
      },
      {
        field: 'x',
        type: temporalXAxis ? 'temporal' : 'quantitative',
        format: temporalXAxisFormat,
      },
      {
        field: 'y',
        format: '.2f',
      },
    ];
    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              type: 'quantitative',
              axis: axisSpec,
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
            tooltip: sharedTooltipSpec,
          },
        },
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y2',
              type: 'quantitative',
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
            tooltip: sharedTooltipSpec,
          },
        },
        {
          mark: {
            type: 'area',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              aggregate: 'max',
              type: 'quantitative',
            },
            y2: {
              field: 'y2',
              aggregate: 'min',
              type: 'quantitative',
            },
            color: styleEncoding.color,
            opacity: {
              value: 0.3,
            },
            tooltip: [
              ...sharedTooltipSpec,
              {
                field: 'y2',
                format: '.2f',
              },
            ],
          },
        },
      ];
    });

    return {
      data: { name: layerName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY',
        },
      ],
      layer: marksLayers.flat(),
    };
  };

  /**
   * Creates a spreads layer for the VegaTimeSeriesPlot component.
   * The layer is composed by a line mark and an area mark.
   * @returns {Object} The spread layer configuration.
   */
  makeSpreadLayer = () => {
    const { marksStyles, scaleDomain, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'spreads';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'spread');

    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'line',
            clip: true,
          },
          encoding: {
            y: {
              field: 'base',
              type: 'quantitative',
              axis: axisSpec,
              scale: scaleDomain,
            },
            color: styleEncoding.color,
            strokeDash: styleEncoding.strokeDash,
          },
        },
        {
          mark: {
            type: 'area',
            clip: true,
          },
          encoding: {
            y: {
              field: 'y',
              aggregate: 'min',
              type: 'quantitative',
            },
            y2: {
              field: 'y2',
              aggregate: 'max',
              type: 'quantitative',
            },
            color: styleEncoding.color,
            opacity: {
              value: 0.4,
            },
            tooltip: [
              {
                title: 'name',
                field: 'labelY',
              },
              {
                field: 'x',
                type: temporalXAxis ? 'temporal' : 'quantitative',
                format: temporalXAxisFormat,
              },
              {
                field: 'base',
                format: '.2f',
              },
              {
                field: 'delta',
                format: '.2f',
              },
            ],
          },
        },
      ];
    });

    return {
      data: { name: layerName },
      transform: [
        {
          calculate: '(datum.base + datum.delta)',
          as: 'y2',
        },
        {
          calculate: '(datum.base - datum.delta)',
          as: 'y',
        },
        {
          calculate: 'datum.name + " [" + datum.units.base + "]"',
          as: 'labelY',
        },
      ],
      layer: marksLayers.flat(),
    };
  };

  /**
   * Creates a bigotes (whiskers) layer for the VegaTimeSeriesPlot component.
   * The layer is composed by 4 bar marks.
   * @returns {Object} The Vega layer configuration.
   */
  makeBigoteLayer = () => {
    const { marksStyles, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'bigotes';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'bigote');

    const sharedTooltipSpec = [
      {
        title: 'name',
        field: 'labelY',
      },
      {
        field: 'x',
        type: temporalXAxis ? 'temporal' : 'quantitative',
        format: temporalXAxisFormat,
      },
      {
        field: 'base',
        format: '.2f',
      },
    ];
    const color = '#bcddf7';
    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'bar',
            size: 25,
          },
          encoding: {
            y: {
              field: 'base',
              type: 'quantitative',
              axis: axisSpec,
            },
            color: styleEncoding.color,
            tooltip: sharedTooltipSpec,
          },
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 25,
            color: color,
          },
          encoding: {
            y: {
              field: 'plus_limit',
              type: 'quantitative',
            },
            y2: {
              aggregate: 'max',
              field: 'plus',
              type: 'quantitative',
            },
            tooltip: [
              ...sharedTooltipSpec,
              {
                field: 'delta',
                format: '.2f',
              },
            ],
          },
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 25,
            color: color,
          },
          encoding: {
            y: {
              field: 'minus_limit',
              type: 'quantitative',
            },
            y2: {
              field: 'minus',
              type: 'quantitative',
            },
            tooltip: [
              ...sharedTooltipSpec,
              {
                field: 'delta',
                format: '.2f',
              },
            ],
          },
        },
        {
          mark: {
            type: 'bar',
            clip: true,
            size: 3,
            color: color,
          },
          encoding: {
            y: {
              aggregate: 'max',
              field: 'plus',
              type: 'quantitative',
            },
            y2: {
              field: 'minus',
              type: 'quantitative',
            },
            tooltip: [
              ...sharedTooltipSpec,
              {
                field: 'delta',
                format: '.2f',
              },
            ],
          },
        },
      ];
    });

    return {
      data: { name: layerName },
      transform: [
        {
          calculate: '(datum.base + datum.delta)',
          as: 'plus',
        },
        {
          calculate:
            '(datum.base !== 0 || datum.delta !== 0) && (datum.base - datum.delta) > 0 ? datum.base - datum.delta : 0',
          as: 'minus',
        },
        {
          calculate:
            '(datum.base !== 0 || datum.delta !== 0) && (datum.base + datum.delta) - (datum.plus) * 0.05 > 0 ? (datum.base + datum.delta) - (datum.plus) * 0.05 : 0',
          as: 'plus_limit',
        },
        {
          calculate:
            '(datum.base !== 0 || datum.delta !== 0) && (datum.base - datum.delta) + (datum.plus) * 0.05 > 0 ? (datum.base - datum.delta) + (datum.plus) * 0.05 : 0',
          as: 'minus_limit',
        },
        {
          calculate: 'datum.name + " [" + datum.units.base + "]"',
          as: 'labelY',
        },
      ],
      layer: marksLayers.flat(),
    };
  };

  /**
   * Creates a rects layer for the VegaTimeSeriesPlot component.
   * The layer is composed just by a rect mark.
   * @returns {Object} The rectangular layer configuration.
   */
  makeRectLayer = () => {
    const { marksStyles, xDomain, xAxisTitle, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'rects';
    const styleEncoding = this.makeStyleEncoding();
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'rect');

    const marksLayers = filteredMarksStyles.map((style) => {
      const axisSpec = this.makeAxisSpec(style);
      return [
        {
          mark: {
            type: 'rect',
            clip: true,
            strokeWidth: 3,
          },
          encoding: {
            x2: {
              field: 'x2',
              type: temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(xAxisTitle, ''),
                format: temporalXAxisFormat,
              },
              scale: xDomain ? { domain: xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y',
              type: 'quantitative',
              axis: axisSpec,
              scale: {},
            },
            y2: {
              field: 'y2',
              type: 'quantitative',
              scale: {},
            },
            fill: styleEncoding.color,
            fillOpacity: {
              value: 0.5,
            },
            stroke: styleEncoding.color,
            tooltip: [
              {
                name: 'name',
                field: 'labelY',
              },
              {
                field: 'x',
                type: temporalXAxis ? 'temporal' : 'quantitative',
                format: temporalXAxisFormat,
              },
              {
                field: 'x2',
                type: temporalXAxis ? 'temporal' : 'quantitative',
                format: temporalXAxisFormat,
              },
              {
                field: 'y',
                format: '.2f',
              },
            ],
          },
        },
      ];
    });

    return {
      data: { name: layerName },
      transform: [
        {
          calculate: 'datum.name + " [" + datum.units.y + "]"',
          as: 'labelY',
        },
      ],
      layer: marksLayers.flat(),
    };
  };

  /**
   * Creates a heatmaps layer configuration for the VegaTimeSeriesPlot component.
   * The layer is composed by three rect marks.
   * This is currently just specified and used for the CloudPlot component.
   * @returns {Object} The heatmap layer configuration.
   */
  makeHeatmapLayer = () => {
    const { marksStyles, xDomain, xAxisTitle, temporalXAxis, temporalXAxisFormat } = this.props;
    const layerName = 'heatmaps';
    const filteredMarksStyles = marksStyles.filter((ms) => ms.markType === 'heatmap');

    const sharedTooltipSpec = [
      {
        field: 'x',
        type: temporalXAxis ? 'temporal' : 'quantitative',
        format: temporalXAxisFormat,
      },
      {
        field: 'x2',
        type: temporalXAxis ? 'temporal' : 'quantitative',
        format: temporalXAxisFormat,
      },
    ];
    const color = filteredMarksStyles[0].color.slice(0, 7);
    const colorScaleSpec = {
      type: 'quantize',
      domain: [0, 100],
      zero: true,
      scheme: [color + '00', color + '10', color + '88', color + 'bb', color + 'ff'],
    };
    const marksLayers = filteredMarksStyles.map((style) => {
      return [
        {
          mark: {
            type: 'rect',
          },
          encoding: {
            x2: {
              field: 'x2',
              type: temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(xAxisTitle, ''),
                format: temporalXAxisFormat,
              },
              scale: xDomain ? { domain: xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y0',
              type: 'quantitative',
              axis: {
                grid: false,
                labels: false,
              },
            },
            y2: {
              field: 'y1',
              type: 'quantitative',
              axis: {
                grid: false,
                labels: false,
              },
            },
            color: {
              scale: colorScaleSpec,
              field: 'low',
              type: 'quantitative',
              title: style.name,
            },
            tooltip: [
              {
                title: 'Lowclouds',
                field: 'low',
              },
              ...sharedTooltipSpec,
            ],
          },
        },
        {
          mark: {
            type: 'rect',
          },
          encoding: {
            x2: {
              field: 'x2',
              type: temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(xAxisTitle, ''),
                format: temporalXAxisFormat,
              },
              scale: xDomain ? { domain: xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y1',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              },
            },
            y2: {
              field: 'y2',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              },
            },
            color: {
              scale: colorScaleSpec,
              field: 'mid',
              type: 'quantitative',
              title: style.name,
            },
            tooltip: [
              {
                title: 'Midclouds',
                field: 'mid',
              },
              ...sharedTooltipSpec,
            ],
          },
        },
        {
          mark: {
            type: 'rect',
          },
          encoding: {
            x2: {
              field: 'x2',
              type: temporalXAxis ? 'temporal' : 'quantitative',
              axis: {
                title: this.makeAxisTitle(xAxisTitle, ''),
                format: temporalXAxisFormat,
              },
              scale: xDomain ? { domain: xDomain } : { type: 'utc' },
            },
            y: {
              field: 'y2',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              },
            },
            y2: {
              field: 'y3',
              type: 'quantitative',
              title: '',
              axis: {
                grid: false,
                labels: false,
              },
            },
            color: {
              scale: colorScaleSpec,
              field: 'hi',
              type: 'quantitative',
              title: style.name,
            },
            tooltip: [
              {
                title: 'Hiclouds',
                field: 'hi',
              },
              ...sharedTooltipSpec,
            ],
          },
        },
      ];
    });

    return {
      data: { name: layerName },
      transform: [
        {
          calculate: '0',
          as: 'y0',
        },
        {
          calculate: '1',
          as: 'y1',
        },
        {
          calculate: '2',
          as: 'y2',
        },
        {
          calculate: '3',
          as: 'y3',
        },
      ],
      layer: marksLayers.flat(),
    };
  };

  getVegaSpec = () => {
    const { layers, width, height, scaleIndependent, temporalXAxis, xAxisTitle, temporalXAxisFormat, xDomain } =
      this.props;

    // Order of layers is important
    // VegaLite will render them in the order they are defined and will resolve
    // the scales in the order they are defined.
    const layer = [];
    if (layers.heatmaps) layer.push(this.makeHeatmapLayer());
    if (layers.areas) layer.push(this.makeAreaLayer());
    if (layers.spreads) layer.push(this.makeSpreadLayer());
    if (layers.rects) layer.push(this.makeRectLayer());
    if (layers.bars) layer.push(this.makeBarLayer());
    if (layers.bigotes) layer.push(this.makeBigoteLayer());
    if (layers.pointLines) layer.push(this.makePointsLayer());
    if (layers.lines) layer.push(this.makeLineLayer());
    if (layers.arrows) layer.push(this.makeArrowLayer());

    return {
      width: width,
      height: height,
      autosize: {
        type: 'fit',
        contains: 'padding',
      },
      config: {
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
        legend: {
          gradientLength: height - 45,
          gradientHorizontalMaxLength: height - 45,
          gradientVerticalMaxLength: height - 45,
        },
      },
      transform: [
        {
          calculate: 'datetime(datum.x)',
          as: 'convertedDatetime',
        },
      ],
      encoding: {
        x: {
          field: 'x',
          type: temporalXAxis ? 'temporal' : 'quantitative',
          axis: {
            title: this.makeAxisTitle(xAxisTitle, undefined),
            format: temporalXAxisFormat,
          },
          scale: xDomain ? { domain: xDomain } : { type: 'utc' },
        },
      },
      layer: [...layer],
      resolve: {
        scale: scaleIndependent ? { y: 'independent' } : {},
      },
    };
  };

  /** We are explicitly defining the shouldComponentUpdate method to avoid unnecessary re-renders.
   * This is because the VegaLite component is not a PureComponent and will re-render every time
   * the parent component re-renders, even if the props have not changed.
   * This method will compare the props that are relevant to the plot and return true if they have changed.
   * The layers prop is compared using the isEqual function from lodash to compare the content of the object because
   * the VegaLite component will re-render if the object reference changes, which happens every time the parent component re-renders.
   * @param {object} nextProps - The next props object.
   * @returns {boolean} - Whether the component should update or not.
   */
  shouldComponentUpdate(nextProps) {
    const {
      className,
      width,
      height,
      layers,
      marksStyles,
      xAxisTitle,
      temporalXAxis,
      temporalXAxisFormat,
      scaleIndependent,
      scaleDomain,
    } = this.props;
    if (
      className !== nextProps.className ||
      width !== nextProps.width ||
      height !== nextProps.height ||
      !isEqual(layers, nextProps.layers) ||
      !isEqual(marksStyles, nextProps.marksStyles) ||
      xAxisTitle !== nextProps.xAxisTitle ||
      temporalXAxis !== nextProps.temporalXAxis ||
      temporalXAxisFormat !== nextProps.temporalXAxisFormat ||
      scaleIndependent !== nextProps.scaleIndependent ||
      !isEqual(scaleDomain, nextProps.scaleDomain)
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { layers, className } = this.props;
    const vegaSpec = this.getVegaSpec();
    return (
      <VegaLite
        style={{
          display: 'flex',
        }}
        renderer="svg"
        spec={vegaSpec}
        data={layers}
        className={[styles.plotContainer, className].join(' ')}
        actions={false}
      />
    );
  }
}

export default VegaTimeseriesPlot;
