import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getAuxTelESSState } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import AuxTelESS from './AuxTelESS';

export const schema = {
  description: 'View of Auxiliary Telescope Environmental Awareness System',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'AuxTel ESS',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
  },
};

const AuxTelESSContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <AuxTelESS {...props} />;
};

const mapStateToProps = (state) => {
  const easState = getAuxTelESSState(state);
  return {...easState};
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
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
export default connect(mapStateToProps, mapDispatchToProps)(AuxTelESSContainer);
