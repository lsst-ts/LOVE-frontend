import React, { Component } from 'react';
import * as vega from 'vega';
import vegae from 'vega-embed';
import PropTypes from 'prop-types';
import styles from './TimeSeriesPlot.module.css';

/**
 * Simple wrapper around the Vega-lite visualization package.
 * It receives the plot spec and embeds the plot in the DOM using React refs.
 */
export default class TimeSeriesPlot extends Component {
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
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
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
    dataLabel: '',
    dateInterval: 60000,

    dateEnd: Infinity,
    dateStart: -Infinity,
  };

  componentDidUpdate = (prevProps) => {
    const dateInterval = this.props.dateInterval;

    let shouldUpdatePlot = false;
    const value = this.props.data ? this.props.accessor(this.props.data) : undefined;
    const timestamp = this.props.timestamp;

    const vegaData = {
      value: value,
      timestamp: timestamp,
      source: this.props.dataLabel,
      dataType: 'quantitative',
    };
    if (prevProps.timestamp !== this.props.timestamp) {
      this.data.push(vegaData);

      shouldUpdatePlot = true;
    }

    const currDate = new Date();
    if (this.vegaEmbedResult && shouldUpdatePlot) {
      this.data = this.data.filter((data) => {
        const dateDiff = currDate - data.timestamp;
        return dateDiff < dateInterval;
      });

      const changeSet = vega
        .changeset()
        .remove(() => true)
        .insert(this.data);

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
            // labelFontSize,
            // titleFontSize,
            titleLimit: 160 * titleFontSize,
            labelLimit: 15 * labelFontSize,
            orient: 'bottom',
          },
          view: {
            width: 300,
            height: 100,
          },
        },
      },
      dataSpec,
    );

    vegae(this.vegaContainer.current, spec, { renderer: 'svg', actions: false }).then((vegaEmbedResult) => {
      this.vegaEmbedResult = vegaEmbedResult;
    });
  };

  changeSpec = (data, name) => {
    const dataType = this.getSpecDataType(this.props.dataType);
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json',
      description: "Google's stock price over time.",
      data: {
        values: data,
        name: 'telemetries',
      },
      mark: { type: dataType === 'quantitative' ? 'line' : 'point', point: true },
      encoding: {
        x: {
          field: 'timestamp',
          type: 'temporal',
          title: 'date',
        },
        y: {
          field: 'value',
          type: dataType,
          title: this.props.dataLabel,
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

  componentDidMount = () => {
    this.remountPlot(
      this.changeSpec(
        [
          {
            value: undefined,
            timestamp: new Date(),
            source: this.props.dataLabel,
            dataType: 'quantitative',
          },
        ],
        this.props.dataLabel,
      ),
    );
    this.props.subscribeToStream(this.props.groupName);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream(this.props.groupName);
  };

  render() {
    if (this.vegaEmbedResult) {
      const changeSet = vega.changeset();
      this.vegaEmbedResult.view.change('telemetries', changeSet).run();
    }
    return <div className={styles.vegaContainer} ref={this.vegaContainer} />;
  }
}
