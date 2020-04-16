import React from 'react';
import { connect } from 'react-redux';
import { getStreamData } from '../../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import LabeledStatusText from './LabeledStatusText';

export const schema = {
  description: `Internal use`,
  defaultSize: [13, 2],
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
      default: 'Status',
    },
    label: {
      type: 'string',
      description: 'Status label',
      isPrivate: false,
      default: 'Azimuth state',
    },
    groupName: {
      type: 'string',
      description: 'SAL stream, in the format <stream_type>-<CSC>-<salIndex>-<stream>',
      isPrivate: false,
      default: 'event-ATMCS-0-m3State',
    },
    accessor: {
      type: 'function',
      description: '',
      isPrivate: false,
      default: '(event) => event.state.value',
    },
    stateToLabelMap: {
      type: 'string',
      description: 'Mapping of status number to its label',
      isPrivate: true,
      default: {
        '0': 'UNKOWN',
        '1': 'TRACK_DISABLED',
        '2': 'TRACK_ENABLED',
        '3': 'STOPPING',
      },
    },
    stateToStyleMap: {
      type: 'string',
      description: 'Mapping of status number to style class',
      isPrivate: true,
      default: {
        '0': 'unknown',
        '1': 'ok',
        '2': 'running',
        '3': 'running',
      },
    },
    _functionProps: {
      type: 'array',
      description:
        'Array containing the props that are functions',
      isPrivate: true,
      default: ['accessor'],
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
  },
};

const LabeledStatusTextContainer = ({
  streamState,
  groupName,
  subscribeToStream,
  unsubscribeToStream,
  label,
  accessor,
  stateToLabelMap,
  stateToStyleMap,
}) => {
  return (
    <LabeledStatusText
      streamState={streamState}
      groupName={groupName}
      label={label}
      accessor={accessor}
      stateToLabelMap={stateToLabelMap}
      stateToStyleMap={stateToStyleMap}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const streamState = getStreamData(state, ownProps.groupName);
  return { streamState: streamState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: (groupName) => {
      dispatch(addGroupSubscription(groupName));
    },
    unsubscribeToStream: (groupName) => {
      dispatch(requestGroupSubscriptionRemoval(groupName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabeledStatusTextContainer);
