import React from 'react';
import { connect } from 'react-redux';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';
import CreateOLETabs from './CreateOLETabs';
import Exposure from './Exposure/Exposure';
import NonExposure from './NonExposure/NonExposure';

export const schema = {
  description: 'View of Log Create Service',
  defaultSize: [60, 23],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Log Create Service',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    isLogCreate: {
      type: 'boolean',
      description: 'if this component used for create Logs',
      isPrivate: true,
      default: true,
    },
  },
};

const CreateOLETabsContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <CreateOLETabs isLogCreate={props.isLogCreate} subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />
  );
};

const mapStateToProps = (state) => {
  const tabs = [
    {name: 'Non-Exposure Logs', value: 'non-exposure', component: NonExposure, },
    {name: 'Exposure Logs', value: 'exposure', component: Exposure, },
  ];
  return {tabs};
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [];
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateOLETabsContainer);