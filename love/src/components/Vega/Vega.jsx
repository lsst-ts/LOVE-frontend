import React, { Component } from 'react';
import * as vega from 'vega-lib';
import vegae from 'vega-embed';
import PropTypes from 'prop-types';
import { getFakeUnits } from '../../Utils';

/**
 * Simple wrapper around the Vega-lite visualization package.
 * It receives the plot spec and embeds the plot in the DOM using React refs.
 */
export default class Vega extends Component {
  constructor() {
    super();
    this.vegaContainer = React.createRef();
    this.vegaEmbedResult = null;
    this.data = [];
    this.state = {
      specDataType: 'quantitative',
    };
  }

  static propTypes = {
    /**
     * Object that defines the properties to be used by Vega-lite
     */
    spec: PropTypes.object,
    dateStart: PropTypes.any,
    dateEnd: PropTypes.any,
    lastMessageData: PropTypes.array,
    historicalData: PropTypes.array,
    telemetryName: PropTypes.string,
    dataType: PropTypes.string,
  };

  static defaultProps = {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'A simple bar chart with embedded data.',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
          { a: 'C', b: 43 },
          { a: 'D', b: 91 },
          { a: 'E', b: 81 },
          { a: 'F', b: 53 },
          { a: 'G', b: 19 },
          { a: 'H', b: 87 },
          { a: 'I', b: 52 },
        ],
      },
      mark: 'bar',
      encoding: {
        x: { field: 'a', type: 'ordinal' },
        y: { field: 'b', type: 'quantitative' },
      },
    },

    dateEnd: Infinity,
    dateStart: -Infinity,
  };

  componentDidUpdate = (prevProps) => {
    const { dateStart, dateEnd } = this.props;
    const dateOffset = new Date().getTimezoneOffset() * 60 * 1000;

    let shouldUpdatePlot = false;
    if (prevProps.lastMessageData !== this.props.lastMessageData) {
      this.data.push(...this.props.lastMessageData);

      shouldUpdatePlot = true;
    }

    if (prevProps.historicalData !== this.props.historicalData) {
      this.remountPlot(this.changeSpec(this.props.historicalData, this.props.telemetryName));
      shouldUpdatePlot = true;
    }

    if (this.vegaEmbedResult && shouldUpdatePlot) {
      this.data = this.data.filter((data) => {
        const date = new Date(data.date) - dateOffset;
        return date >= dateStart && date <= dateEnd;
      });

      const changeSet = vega.changeset().insert(this.data);
      this.vegaEmbedResult.view.change('telemetries', changeSet).run();
    }
  };

  getCSSColorByVariableName = (varName) => getComputedStyle(this.vegaContainer.current).getPropertyValue(varName);

  remountPlot = (dataSpec) => {
    this.data = [];
    const labelFontSize = 14;
    const titleFontSize = 16;
    const spec = Object.assign(
      {
        config: {
          axis: {
            labelColor: this.getCSSColorByVariableName('--base-font-color'),
            titleColor: this.getCSSColorByVariableName('--base-font-color'),
            grid: false,
          },
          legend: {
            labelColor: this.getCSSColorByVariableName('--base-font-color'),
            titleColor: this.getCSSColorByVariableName('--base-font-color'),
            labelFontSize,
            titleFontSize,
            titleLimit: 160 * titleFontSize,
            labelLimit: 15 * labelFontSize,
          },
          view: {
            width: 600,
          },
          background: 'null',
        },
      },
      dataSpec,
    );

    vegae(this.vegaContainer.current, spec, { renderer: 'svg' }).then((vegaEmbedResult) => {
      this.vegaEmbedResult = vegaEmbedResult;
    });
  };

  changeSpec = (data, name) => {
    const dataType = this.getSpecDataType(this.props.dataType);
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: "Google's stock price over time.",
      data: {
        values: data,
        name: 'telemetries',
      },
      mark: dataType === 'quantitative' ? 'line' : 'point',
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          title: 'date',
        },
        y: {
          field: 'value',
          type: dataType,
          title: getFakeUnits(name),
        },
        color: {
          field: 'source',
          type: 'nominal',
          legend: {
            title: `Parameter Names${' '.repeat(32)}`,
          },
        },
      },
    };
  };

  getSpecDataType = (dataType) => {
    if (dataType === 'String') return 'nominal';
    return 'quantitative';
  };

  componentDidMount() {
    this.remountPlot(this.changeSpec(this.props.historicalData, this.props.telemetryName));
  }

  render() {
    if (this.vegaEmbedResult) {
      const dateOffset = new Date().getTimezoneOffset() * 60 * 1000;
      const { dateStart, dateEnd } = this.props;
      const changeSet = vega
        .changeset()
        .remove((data) => {
          const date = new Date(data.date) - dateOffset;
          return date < dateStart || date > dateEnd;
        })
        .insert(this.data);

      this.vegaEmbedResult.view.change('telemetries', changeSet).run();
    }

    return <div ref={this.vegaContainer}></div>;
  }
}
