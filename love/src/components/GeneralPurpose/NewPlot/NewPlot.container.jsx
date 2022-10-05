import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from 'redux/actions/ws';
import { getStreamsData, getEfdConfig, getTaiToUtc } from 'redux/selectors';
import NewPlot from './NewPlot';

export const defaultStyles = [
  {
    color: '#ff7bb5',
    shape: 'circle',
    filled: false,
    dash: [4, 0],
  },
  {
    color: '#00b7ff',
    shape: 'square',
    filled: true,
    dash: [4, 0],
  },
  {
    color: '#97e54f',
    shape: 'diamond',
    filled: true,
    dash: [4, 0],
  },
];

export const schema = {
  description: 'Time series plot for any data stream coming from SAL',
  defaultSize: [8, 8],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: true,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: true,
      default: 'Time series plot',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    inputs: {
      externalStep: 'TimeSeriesConfig',
      type: 'object',
      description: 'list of inputs',
      isPrivate: false,
      default: {
        Elevation: {
          category: 'telemetry',
          csc: 'ATMCS',
          salindex: '0',
          topic: 'mount_AzEl_Encoders',
          item: 'elevationCalculatedAngle',
          type: 'line',
          accessor: '(x) => x[0]',
          ...defaultStyles[0],
        },
        'ATDome azimuth': {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: '0',
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: '(x) => x',
          ...defaultStyles[1],
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
  },
};

const NewPlotContainer = ({
  subscriptions,
  getStreamData,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) => {
  const containerRef =  React.createRef();
  //const { containerNode, width, height } = props;
  //console.log('NewPlot.container', containerNode, 'width', width, 'height', height);
  /* if (!width && !height && !containerNode) {
    console.log('new containerNode', containerRef, 'parentNode', containerRef.current?.parentNode);
    return (
      <div ref={containerRef}>
        <NewPlot
          subscriptions={subscriptions}
          subscribeToStreams={subscribeToStreams}
          unsubscribeToStreams={unsubscribeToStreams}
          getStreamData={getStreamData}
          {...props}
          containerNode={containerRef.current?.parentNode}
        />
      </div>
    );
  } else { */
    return (
      <div ref={containerRef}>
        <NewPlot
          subscriptions={subscriptions}
          subscribeToStreams={subscribeToStreams}
          unsubscribeToStreams={unsubscribeToStreams}
          getStreamData={getStreamData}
          {...props}
          containerNode={containerRef} // .current?.parentNode}
          width={1000}
          height={400}
        />;
      </div>);
  //}
};

const getGroupNames = (inputs) =>
  Object.values(inputs).map(
    (inputConfig) => `${inputConfig?.category}-${inputConfig?.csc}-${inputConfig?.salindex}-${inputConfig?.topic}`,
  );

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      const inputs = ownProps.inputs || schema.props.inputs.default;
      const groupNames = getGroupNames(inputs);
      groupNames.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: () => {
      const inputs = ownProps.inputs || schema.props.inputs.default;
      const groupNames = getGroupNames(inputs);
      groupNames.forEach((groupName) => {
        dispatch(requestGroupRemoval(groupName));
      });
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
    streams,
    taiToUtc,
    efdConfigFile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPlotContainer);
