import React from 'react';
import { connect } from 'react-redux';
import GIS from './GIS';
import { addGroup, removeGroup } from 'redux/actions/ws';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary view of GIS. Contains general information about Global Interlock System',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Global Interlock System',
    },
    controls: {
      type: 'boolean',
      description: 'Whether to display controls to configure periods of time',
      default: true,
      isPrivate: false,
    },
  },
};

const GISContainer = ({ subscribeToStream, unsubscribeToStream, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <GIS subscribeToStream={subscribeToStream} unsubscribeToStream={unsubscribeToStream} />;
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [];
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GISContainer);
