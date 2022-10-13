import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup, requestSALCommand } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ControlPanel from './ControlPanel';
import { getStreamData } from '../../../redux/selectors';

export const schema = {
  description: 'Scheduler Control Panel',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Scheduler Control panel',
    },
    salIndex: {
      type: 'number',
      description: 'Sal index of the Scheduler (1=MT, 2=AT)',
      isPrivate: false,
      default: 1,
    },
  },
};

const ControlPanelContainer = ({
  salIndex,
  summaryStateData,
  detailedStateData,
  generalInfoData,
  largeFileObjectAvailableData,
  requestSALCommand,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <ControlPanel
    salIndex={salIndex}
    summaryStateData={summaryStateData}
    detailedStateData={detailedStateData}
    generalInfoData={generalInfoData}
    largeFileObjectAvailableData={largeFileObjectAvailableData}
    requestSALCommand={requestSALCommand}
    {...props}
  />;
};

const mapStateToProps = (state, ownProps) => {
  let summaryStateData = getStreamData(state, `event-Scheduler-${ownProps.salIndex}-summaryState`);
  let detailedStateData = getStreamData(state, `event-Scheduler-${ownProps.salIndex}-detailedState`);
  let generalInfoData = getStreamData(state, `event-Scheduler-${ownProps.salIndex}-generalInfo`);
  let largeFileObjectAvailableData = getStreamData(state, `event-Scheduler-${ownProps.salIndex}-largeFileObjectAvailable`);

  return {
    summaryStateData: summaryStateData ? summaryStateData?.[0] : undefined,
    detailedStateData: detailedStateData ? detailedStateData?.[0] : undefined,
    generalInfoData: generalInfoData ? generalInfoData?.[0] : undefined,
    largeFileObjectAvailableData: largeFileObjectAvailableData ? largeFileObjectAvailableData?.[0] : undefined,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `event-Scheduler-${ownProps.salIndex}-summaryState`,
    `event-Scheduler-${ownProps.salIndex}-detailedState`,
    `event-Scheduler-${ownProps.salIndex}-generalInfo`,
    `event-Scheduler-${ownProps.salIndex}-largeFileObjectAvailable`,
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
    requestSALCommand: (cmd) => {
      dispatch(
        requestSALCommand(
          {
            ...cmd,
          }
        )
      );
    },
  };
};

const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(ControlPanelContainer);

connectedContainer.defaultProps = {
  salIndex: 1,
};

export default connectedContainer;
