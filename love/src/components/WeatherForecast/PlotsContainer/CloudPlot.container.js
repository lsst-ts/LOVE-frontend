/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamsData, getEfdConfig, getTaiToUtc } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import Plot from 'components/GeneralPurpose/Plot/Plot';

export const schema = {
  description: 'View of Cloud Plot of Weather Forecast ',
  defaultSize: [62, 18],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Cloud Plot Weather Forecast',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: true,
    },
    xAxisTitle: {
      type: 'string',
      description: 'Title of the horizontal axis of this plot',
      default: 'Time',
      isPrivate: false,
    },
    yAxisTitle: {
      type: 'string',
      description: 'Title of the vertical axis of this plot',
      default: '',
      isPrivate: false,
    },
    legendPosition: {
      type: 'string',
      description:
        "Whether to display the legend to the right of the plot or at the bottom. One of 'right' or 'bottom'",
      default: 'bottom',
      isPrivate: false,
    },
    temporalXAxisFormat: {
      type: 'string',
      description: "Format the time, for example the daily use '%Y-%m-%d' and hourly '%d, %H:%M'",
      default: '%Y-%m-%d',
      isPrivate: false,
    },
    isForecast: {
      type: 'boolean',
      description:
        'When is the Weather Forecast, the telemetries receive all data of the interval, and this case, the data its diference process',
      default: true,
      isPrivate: false,
    },
    scaleIndependent: {
      type: 'boolean',
      description: 'When plot contain multi-axis, can set the scale indenpend',
      default: true,
      isPrivate: false,
    },
    scaleDomain: {
      type: 'object',
      description: 'object for domain min and domain max of plot',
      default: {
        domainMin: 0,
        domainMax: 100,
      },
      isPrivate: false,
    },
    inputs: {
      type: 'object',
      description: 'list of inputs',
      isPrivate: false,
      default: {
        'Total cloud cover': {
          type: 'line',
          color: '#ff7f0e',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'totalCloudCoverMean',
              accessor: '(x) => x',
            },
          ],
        },
        'Total cloud cover spread': {
          type: 'spread',
          color: '#ff7f0e',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x',
            },
            {
              variable: 'base',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'totalCloudCoverMean',
              accessor: '(x) => x',
            },
            {
              variable: 'delta',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'totalCloudCoverSpread',
              accessor: '(x) => x',
            },
          ],
        },
        'Total cover Min/Max': {
          type: 'area',
          color: '#ff5f0e',
          dash: [8, 4],
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'totalCloudCoverMax',
              accessor: '(x) => x',
            },
            {
              variable: 'y2',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'totalCloudCoverMin',
              accessor: '(x) => x',
            },
          ],
        },
        Clouds: {
          type: 'heatmap',
          color: '#4682b4',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x.slice(1)',
            },
            {
              variable: 'x2',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x.map((v) => v * 1000 - (60 * 60 * 24 * 1000)).slice(1)',
            },
            {
              variable: 'low',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'lowCloudsMean',
              accessor: '(x) => x',
            },
            {
              variable: 'mid',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'midCloudsMean',
              accessor: '(x) => x',
            },
            {
              variable: 'hi',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'dailyTrend',
              item: 'hiCloudsMean',
              accessor: '(x) => x',
            },
          ],
        },
      },
    },
  },
};

const containerRef = React.createRef();

const CloudPlotContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  const { containerNode } = props;
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  if (!props.containerNode) {
    return (
      <div ref={containerRef}>
        <Plot
          subscribeToStreams={subscribeToStreams}
          unsubscribeToStreams={unsubscribeToStreams}
          {...props}
          containerNode={containerRef?.current?.parentNode}
        />
      </div>
    );
  } else {
    return (
      <Plot
        subscribeToStreams={subscribeToStreams}
        unsubscribeToStreams={unsubscribeToStreams}
        {...props}
        containerNode={containerNode}
      />
    );
  }
};

const getGroupNames = (inputs) => {
  const inputsMap = Object.values(inputs).map((inputConfig) => {
    if (inputConfig.values) {
      const values = Object.values(inputConfig.values).map((value) => {
        return `${value?.category}-${value?.csc}-${value?.salindex}-${value?.topic}`;
      });
      return values;
    } else {
      return `${inputConfig?.category}-${inputConfig?.csc}-${inputConfig?.salindex}-${inputConfig?.topic}`;
    }
  });
  return [...new Set(inputsMap.flat())];
};

const mapStateToProps = (state, ownProps) => {
  const inputs = ownProps.inputs || schema.props.inputs.default;
  const subscriptions = getGroupNames(inputs);
  const streams = getStreamsData(state, subscriptions);
  const taiToUtc = getTaiToUtc(state);
  const efdConfigFile = getEfdConfig(state);
  return {
    inputs,
    streams,
    taiToUtc,
    efdConfigFile,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const inputs = ownProps.inputs || schema.props.inputs.default;
  const subscriptions = getGroupNames(inputs);

  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CloudPlotContainer);
