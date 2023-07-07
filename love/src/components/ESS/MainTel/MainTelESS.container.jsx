import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getMainTelESSState } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import MainTelESS from './MainTelESS';

export const schema = {
  description: 'View of Simonyi Telescope Environmental Awareness System',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi ESS',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
    minTemperatureLimit: {
      type: 'number',
      description: 'Minimum temperature limit for the limit of gradiant',
      isPrivate: false,
      default: -20,
    },
    maxTemperatureLimit: {
      type: 'number',
      description: 'Maximum temperature limit for the limit of gradiant',
      isPrivate: false,
      default: 40,
    },
  },
};

const MainTelESSContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <MainTelESS {...props} />;
};

const mapStateToProps = (state) => {
  const essState = getMainTelESSState(state);
  return {...essState};
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-ESS-1-temperature',
  ];
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
export default connect(mapStateToProps, mapDispatchToProps)(MainTelESSContainer);
