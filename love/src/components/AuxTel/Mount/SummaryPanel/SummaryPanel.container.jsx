import React from 'react';
import { connect } from 'react-redux';
import SummaryPanel from './SummaryPanel';
import { getMountState, getMountSubscriptions } from '../../../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../../redux/actions/ws';

export const schema = {
  description: `Panel containing summary information about the AT, including the ATMCS, ATPneumatics and ATHexapod`,
  defaultSize: [15, 22],
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
      default: 'AT summary',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
};

const SummaryPanelContainer = ({ ...props }) => {
  return <SummaryPanel {...props} />;
};

const mapStateToProps = (state) => {
  const mountState = getMountState(state, 0);
  return mountState;
};

const mapDispatchToProps = (dispatch) => {
  const index = 0;
  const mountSubscriptions = getMountSubscriptions(index);
  return {
    subscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(addGroupSubscription(stream)));
    },
    unsubscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(requestGroupSubscriptionRemoval(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPanelContainer);
