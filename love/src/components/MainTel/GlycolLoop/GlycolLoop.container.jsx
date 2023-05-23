import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import GlycolLoop from './GlycolLoop';
import { getGlycolPumpStatus, getGlycolTemps } from 'redux/selectors';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Glycol Loop',
  defaultSize: [90, 53],
  props: {
    title: {
      type: 'string',
      description: 'Glycol Loop',
      isPrivate: false,
      default: 'Glycol Loop',
    },
  },
};

const GlycolLoopContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <GlycolLoop subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const glycolPumpStatus = getGlycolPumpStatus(state);
  const glycolTemps = getGlycolTemps(state);
  return {
    ...glycolPumpStatus,
    ...glycolTemps,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-MTM1M3TS-0-glycolPumpStatus', 'telemetry-MTM1M3TS-0-glycolLoopTemperature'];
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

GlycolLoopContainer.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlycolLoopContainer);
