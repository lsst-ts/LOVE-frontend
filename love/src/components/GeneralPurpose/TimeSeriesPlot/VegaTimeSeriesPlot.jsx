import React, { Component } from 'react';
import { VegaLite } from 'react-vega'
import styles from './VegaTimeSeriesPlot.module.css';
export const SHAPES = [
  "circle",
  "square",
  "diamond",
  "triangle-up",
  "triangle-down",
  "triangle-right",
  "triangle-left",
  "cross",
];

export const COLORS = [
  "#ff7bb5", // pink
  "#97e54f", // green
  "#00b7ff", // light blue
  "#f9b200", // orange-ish
  "#a9a5ff", // purple-ish
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


class VegaTimeseriesChart extends Component {

  static defaultProps = {
    /** List of {name, x, y} with points of lines to be plotted
     *  name distinguishes a line from another
     *  x,y are the plot-axis coordinates of a point in that line
     */
    data: [],

    /** List of {name, value} fields of horizontal lines to be plotted.
     * name must be in props.names
     * value must be quantitative
     */
    horizontalLinesData: [],

    /** List of {name, x, y} fields of horizontal lines to be plotted.
     * name must be in props.names
     * y must be quantitative
     */
    barsData: [],
    /**
     * Array with data gaps (areas where there is no data).
     * Defaults to undefined to use vega-lite defaults.
     */
    gapsData: [],
    /**
     * Object with {data, horizontalLinesData, barsData and gapsData} to be 
     * plotted along the right-side axis.
     */
    rightAxisData: {},

    /** Title of the plot's x-axis. Will be rendered in upper case. */
    xAxisTitle: 'FECHA DE MEDICIÓN',

    /** Title of the plot's y-axis. Will be rendered in upper case. */
    yAxisTitle: 'VALOR',

    /** Title of the plot's y-axis on the right side of the plot. Will be rendered in upper case. */
    yRightAxisTitle: '',

    /** If true the x-axis labels will be rendered as dates, otherwise
     *  as numbers (e.g., distances)
     */
    temporalXAxis: true,

    /** Dictionary describing the measurement units of the x and y axis
     * it must have this shape: {x: 'unitx', y: 'unity', yRightAxis: ''}
     * yRightAxis if props.rightAxisData is used
     */
    units: { x: '', y: '', yRightAxis: '' },
    /** List of dicts of {color:  filled,  shape,  dash} of each line to be plotted.
     * Its indices must match those of the "names" to have the desired styles applied
     */
    linesStyles: [],

    /**
     * Number of timeseries point to skip when drawing point marks.
     */
    skipPointEvery: 1,

    /**
     * Array to force an x axis domain (interval).
     * Defaults to undefined to use vega-lite defaults.
     */
    xDomain: undefined
  }

  makeAxisTitle = (title, units) => {

    return `${title.toUpperCase()} ${units ? `[${units}]` : ''}`;
  }

  makeStyleEncoding = () => {
    const names = this.props.linesStyles.map(l => l.name);
    return {
      stroke: {
        field: 'name',
        type: "nominal",
        scale: {
          domain: names.filter(n => n !== '' && !n.labelOnly),
          range: this.props.linesStyles.filter(l => l.name !== '' && !l.labelOnly).map(style => style.color ?? COLORS[0])
        }
      },
      fill: {
        field: 'name',
        type: "nominal",
        scale: {
          domain: names.filter(n => n !== '' && !n.labelOnly),
          range: this.props.linesStyles.filter(l => l.name !== '' && !l.labelOnly).map(style => {
            if (style.filled !== undefined && !style.filled) {
              return 'none';
            }
            return style.color ?? COLORS[0];
          })
        }
      },
      shape: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names.filter(n => n !== '' && !n.labelOnly),
          range: this.props.linesStyles.filter(l => l.name !== '' && !l.labelOnly).map(style => style.shape ?? "black")
        },
        legend: false
      },
      strokeDash: {
        field: 'name',
        type: 'nominal',
        scale: {
          domain: names.filter(n => n !== '' && !n.labelOnly),
          range: this.props.linesStyles.filter(l => l.name !== '' && !l.labelOnly).map(style => style.dash ?? "black")
        },
        legend: false
      }
    }
  }

  makeLineLayer = (dataName) => {

    const styleEncoding = this.makeStyleEncoding();

    return [
      {
        data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
        mark: {
          type: 'line',
          clip: true,
        },
        encoding: {
          x: {
            field: 'x',
            type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
            axis: {
              title: this.makeAxisTitle(this.props.xAxisTitle, this.props.units?.x)
            },
            scale: this.props.xDomain ? {
              domain: this.props.xDomain,
            } : undefined,
          },
          y: {
            field: 'y',
            type: 'quantitative',
            axis: {
              title: this.makeAxisTitle(this.props.yAxisTitle, this.props.units?.y)
            }
          },
          stroke: styleEncoding.stroke,
          strokeDash: styleEncoding.strokeDash
        }
      },
      // line points
      {
        data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
        mark: {
          type: "point",
          size: 80,
          clip: true,
        },
        encoding: {
          x: {
            field: 'x',
            type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
          },
          y: {
            field: 'y',
            type: 'quantitative',
            scale: {
              type: "continuous",
              zero: false,
            },
          },
          stroke: styleEncoding.stroke,
          fill: styleEncoding.fill,
          shape: styleEncoding.shape,
        },
        transform: [{
          filter: `floor(${this.props.skipPointsEvery}*(datum.index/${this.props.skipPointsEvery} - floor(datum.index/${this.props.skipPointsEvery})))==0`
        }]
      }

    ]
  }

  makeRuleLayer = (dataName) => {
    return {
      data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
      mark: {
        type: "rule",
        point: {
          size: 80
        }
      },
      encoding: {
        y: {
          field: "value",
        },
        ...this.makeStyleEncoding(),
      }
    }

  }

  makeBarLayer = (dataName, rightTitle) => {
    const names = this.props.linesStyles.map(l => l.name);
    return {
      data: { name: dataName },
      mark: {
        type: 'bar',
      },
      encoding: {
        x: {
          field: 'x',
          type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
        },
        y: {
          field: 'y',
          type: 'quantitative',
          axis: {
            title: rightTitle
          }
          // scale: {
          //     y: "independent"
          // }
        },
        color: {
          field: 'name',
          type: 'nominal',
          scale: {
            domain: names.filter(n => n !== '' && !n.labelOnly),
            range: this.props.linesStyles.filter(l => l.name !== '' && !l.labelOnly).map(style => style.color ?? "black")
          }
        }
      }
    }
  }
  makeRectangleLayer = (dataName) => {
    return {
      data: { name: dataName }, // note: vega-lite data attribute is a plain object instead of an array
      mark: {
        type: "rect",
        clip: true,
        fill: "#c9c9c9"
      },
      encoding: {
        x: {
          field: "x",
          type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
        },
        x2: {
          field: "x2",
          type: this.props.temporalXAxis ? 'temporal' : 'quantitative',
        },
        opacity: { "value": 1 }
      }
    }

  }

  makeLayers = () => {

    if (!this.props.rightAxisData ||
      Object.keys(this.props.rightAxisData).length === 0 ||
      !(Object.entries(this.props.rightAxisData).some(([key, data]) => data?.length > 0))
    ) {
      return [{
        layer: [
          this.makeBarLayer('bars'),
          this.makeRuleLayer('horizontalLines'),
          ...this.makeLineLayer('table'),
          this.makeRectangleLayer('gaps'),
        ]
      }];

    }

    return [
      {
        layer: [
          this.makeBarLayer('bars'),
          this.makeRuleLayer('horizontalLines'),
          ...this.makeLineLayer('table'),
          this.makeRectangleLayer('gaps'),
        ]
      },
      {
        layer: [
          this.makeBarLayer('barsRightAxis', this.makeAxisTitle(this.props.yRightAxisTitle, this.props.units?.yRightAxis)),
          this.makeRuleLayer('horizontalLinesRightAxis'),
          // ...this.makeLineLayer('tableRightAxis'),
          // this.makeRectangleLayer('gapsRightAxis')
        ]
      }
    ]
  }

  render() {
    const spec = {
      width: "container",
      height: 150,
      config: {
        padding: 5,
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
          gridColor: '#626262',
          tickColor: null,
        },
        axisX:
          this.props.temporalXAxis ? {
            titlePadding: 16,
            titleFontWeight: 1000,
            format: "%d-%m-%y",
            labelAngle: -90,
            labelFontWeight: 1000,
            tickCount: 15,
          } :
            {
              titlePadding: 16,
              titleFontWeight: 1000,
              format: ",.0f",
              labelAngle: -90,
              labelFontWeight: 1000,
              tickCount: 15,
            },
        axisLeft: {
          titlePadding: 16,
          titleFontWeight: 1000,
          labelFontWeight: 1000,
        },
        axisRight: {
          titlePadding: 16,
          titleFontWeight: 1000,
          labelFontWeight: 1000,
        },
        bar: {
          continuousBandSize: Math.max(0.1, Math.min(12, 300 / (this.props.rightAxisData?.barsData?.length || 1))),
        }
      },
      layer: [
        ...this.makeLayers()
      ],
      resolve: {
        scale: {
          y: "independent"
        },
        axis: {
          y: "independent"
        }
      }
    }

    let rightAxisData = {}
    if (this.props.rightAxisData &&
      Object.keys(this.props.rightAxisData).length > 0 &&
      Object.entries(this.props.rightAxisData).some(([key, data]) => data?.length > 0)) {

      rightAxisData = {
        barsRightAxis: this.props.rightAxisData.barsData ?? [],
        horizontalLinesRightAxis: this.props.rightAxisData.horizontalLinesData ?? [],
      }

    }

    return (
      (<VegaLite
        renderer="svg"
        spec={spec}
        data={{
          table: this.props.data,
          horizontalLines: this.props.horizontalLinesData,
          bars: this.props.barsData,
          gaps: this.props.gapsData,
          ...rightAxisData
        }}
        className={styles.plotContainer}
        actions={false} />)
    );
  }
}

export default VegaTimeseriesChart;
