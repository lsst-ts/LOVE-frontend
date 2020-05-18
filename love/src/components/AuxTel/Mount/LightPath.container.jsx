import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LightPath from './LightPath';
import { getMountState, getMountSubscriptions } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description:
    'Diagram containing high-level information about the AT mount sub-components, including M1, M2, M3, nasmyth ports, and mirror cover',
  defaultSize: [22, 34],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'AT Lightpath',
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

const LightPathContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <LightPath {...props} />;
};

const mapStateToProps = (state) => {
  const mountState = getMountState(state, 0);
  return mountState;
};

const mapDispatchToProps = (dispatch) => {
  const index = 0;
  const mountSubscriptions = getMountSubscriptions(index);
  return {
    subscriptions: mountSubscriptions,
    subscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

LightPathContainer.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(LightPathContainer);
