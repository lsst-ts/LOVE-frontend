import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getHVACTelemetry, getHVACSubscription } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import FacilityMap from './FacilityMap';

export const schema = {
  description: 'Vera C. Rubin Summit Facility Map',
  defaultSize: [70, 50],
  props: {
    title: {
      type: 'string',
      description: 'Observatory Facility Map',
      isPrivate: false,
      default: 'Facility Map',
    },
  },
};

const FacilityMapContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <FacilityMap subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const HVACTelemetry = getHVACTelemetry(state);
  return HVACTelemetry;
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = getHVACSubscription();
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

export default connect(mapStateToProps, mapDispatchToProps)(FacilityMapContainer);
