import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamsData, getEfdConfig, getTaiToUtc } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import Plot from 'components/GeneralPurpose/Plot/Plot';


export const schema = {
  description: 'View of Wind Plot of Weather Forecast',
  defaultSize: [62, 18],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Wind Plot Weather Forecast',
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
      default: 'Wind',
      isPrivate: false,
    },
    legendPosition: {
      type: 'string',
      description:
        "Whether to display the legend to the right of the plot or at the bottom. One of 'right' or 'bottom'",
      default: 'bottom',
      isPrivate: false,
    },
    inputs: {
      type: 'object',
      description: 'list of inputs',
      isPrivate: false,
      default: {
        'Wind speed': {
          type: 'area',
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
              topic: 'WeatherForecast_dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'windspeedMin',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'y2',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'windspeedMax',
              accessor: '(x) => x[0]',
            }
          ],
        },
        'Windspeed spread': {
          type: 'spread',
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
              topic: 'WeatherForecast_dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'mean',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'windspeedMean',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'delta',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'windspeedSpread',
              accessor: '(x) => x[0]',
            }
          ],
        },
        'Wind direction': {
          type: 'arrow',
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
              topic: 'WeatherForecast_dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'windspeedMean',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'angle',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'windDirection',
              accessor: '(x) => x[0]',
            }
          ],
        },
        'Gust Wind': {
          type: 'line',
          color: '#97e54f',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'gust',
              accessor: '(x) => x[0]',
            },
          ],
        },
        'Ex Gust': {
          type: 'line',
          color: '#97e54f',
          shape: 'circle',
          filled: false,
          dash: [4, 0],
          values: [
            {
              variable: 'x',
              category: 'telemetry',
              csc: 'WeatherForecast',
              salindex: 0,
              topic: 'WeatherForecast_dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: 0,
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => 15',
            },
          ],
        },
        'Ex direction': {
          type: 'arrow',
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
              topic: 'WeatherForecast_dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: 0,
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => x[0] - 40',
            },
            {
              variable: 'angle',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: 0,
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => 40',
            }
          ],
        },
        'Ex windspread': {
          type: 'spread',
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
              topic: 'WeatherForecast_dailyTrend',
              item: 'timestamp',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'mean',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: 0,
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => x[0]',
            },
            {
              variable: 'delta',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: 0,
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => 10',
            }
          ],
        },
      }
    }
  },
};

const containerRef =  React.createRef();

const WindPlotContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
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
          containerNode={containerRef?.current}
        />
      </div>
    );

  } else {
    return <Plot
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      {...props}
      containerNode={containerNode}
    />;
  }
};

const getGroupNames = (inputs) => {
  const inputsMap = Object.values(inputs).map(
    (inputConfig) => {
      if (inputConfig.values) {
        const values = Object.values(inputConfig.values).map((value) => {
          return `${value?.category}-${value?.csc}-${value?.salindex}-${value?.topic}`;
        });
        return values;
      } else {
        return `${inputConfig?.category}-${inputConfig?.csc}-${inputConfig?.salindex}-${inputConfig?.topic}`;
      }
    },
  );
  return [...new Set(inputsMap.flat())];
}

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
export default connect(mapStateToProps, mapDispatchToProps)(WindPlotContainer);
