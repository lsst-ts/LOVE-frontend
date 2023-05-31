import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup, requestGroupRemoval } from 'redux/actions/ws';
import { getStreamsData, getEfdConfig, getTaiToUtc } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import Plot from './Plot';

export const defaultStyles = [
  {
    color: '#ff7bb5',
    shape: 'circle',
    filled: false,
    orient: 'left',
    dash: [4, 0],
  },
  {
    color: '#00b7ff',
    shape: 'square',
    filled: true,
    orient: 'right',
    dash: [4, 0],
  },
  {
    color: '#97e54f',
    shape: 'diamond',
    filled: true,
    orient: 'left',
    dash: [4, 0],
  },
];

export const schema = {
  description: 'Time series plot for any data stream coming from SAL',
  defaultSize: [60, 30],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Time series plot',
    },
    inputs: {
      externalStep: 'TimeSeriesConfigure',
      type: 'object',
      description: 'list of inputs',
      isPrivate: false,
      default: {
        'ATMCS Elevation': {
          type: 'area',
          ...defaultStyles[0],
          values: [
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: '0',
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => x[0] - 30',
            },
            {
              variable: 'y2',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: '0',
              topic: 'mount_AzEl_Encoders',
              item: 'elevationCalculatedAngle',
              accessor: '(x) => x[0]',
            }
          ],
        },
        'ATMCS Azimuth': {
          type: 'arrow',
          ...defaultStyles[1],
          values: [
            {
              variable: 'y',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: '0',
              topic: 'mount_AzEl_Encoders',
              item: 'azimuthCalculatedAngle',
              accessor: '(x) => x[0] + 10',
            },
            {
              variable: 'angle',
              category: 'telemetry',
              csc: 'ATMCS',
              salindex: '0',
              topic: 'mount_AzEl_Encoders',
              item: 'azimuthCalculatedAngle',
              accessor: '(x) => x[0] + 90',
            }
          ],
        },
      },
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
      default: 'right',
      isPrivate: false,
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: true,
    },
  },
};

const containerRef =  React.createRef();

const PlotContainer = ({
  subscriptions,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) => {

  const { containerNode } = props;

  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={subscriptions}></SubscriptionTableContainer>;
  }

  if (!props.containerNode) {
    return (
      <div ref={containerRef}>
        <Plot
          subscriptions={subscriptions}
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
          subscriptions={subscriptions}
          subscribeToStreams={subscribeToStreams}
          unsubscribeToStreams={unsubscribeToStreams}
          {...props}
          containerNode={containerNode}
      />);
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

const mapStateToProps = (state, ownProps) => {
  const inputs = ownProps.inputs || schema.props.inputs.default;
  const groupNames = getGroupNames(inputs);
  const streams = getStreamsData(state, groupNames);
  const taiToUtc = getTaiToUtc(state);
  const efdConfigFile = getEfdConfig(state);
  return {
    inputs,
    streams,
    taiToUtc,
    efdConfigFile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotContainer);
