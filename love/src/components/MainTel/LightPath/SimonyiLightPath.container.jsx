import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SimonyiLightPath from './SimonyiLightPath';
import { getMTLightPathStatus } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description:
    'Diagram containing high-level information about the Simonyi mount sub-components, including M2, M1M3, Cameras, and mirror covers',
  defaultSize: [22, 34],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi Lightpath',
    },
    lightPath: {
      type: 'boolean',
      description: 'Whether to display a representation of the light coming into the telescope',
      isPrivate: false,
      default: true,
    },
  },
  allowOverflow: true,
};

const SimonyiLightPathContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <SimonyiLightPath {...props} />;
};

const mapStateToProps = (state) => {
  const mtLightPathStatus = getMTLightPathStatus(state);
  return {
    ...mtLightPathStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTM2-0-m2AssemblyInPosition',
    'telemetry-MTM2-0-position',
    'event-MTM1M3-0-detailedState',
    'event-MTMount-0-mirrorCoversMotionState',
    'event-CCCamera-0-imageReadinessDetailedState',
    'event-CCCamera-0-shutterDetailedState',
    'event-CCCamera-0-raftsDetailedState',
    'event-CCCamera-0-calibrationDetailedState',
    'event-CCCamera-0-ccsCommandState',
    'event-CCCamera-0-filterChangerDetailedState',
    'event-CCCamera-0-offlineDetailedState',
    'event-CCCamera-0-endSetFilter',
    'event-MTCamera-0-imageReadinessDetailedState',
    'event-MTCamera-0-shutterDetailedState',
    'event-MTCamera-0-raftsDetailedState',
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

SimonyiLightPathContainer.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(SimonyiLightPathContainer);