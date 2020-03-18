import React from 'react';
import { connect } from 'react-redux';
import {
  getUsername,
  getLastSALCommand,
  getMode,
  getViewSummary,
  getViewsStatus,
  getViews,
  getLastManagerHeartbeat,
} from '../../redux/selectors';
import { logout } from '../../redux/actions/auth';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import { clearViewToEdit } from '../../redux/actions/uif';
import Layout from './Layout';

const LayoutContainer = ({ ...props }) => {
  return <Layout {...props} />;
};

const mapStateToProps = (state) => {
  const user = getUsername(state);
  const lastSALCommand = getLastSALCommand(state);
  const mode = getMode(state);
  const getCurrentView = (id) => getViewSummary(state, id);
  const getManagerHeartbeat = () => getLastManagerHeartbeat(state);
  const viewsStatus = getViewsStatus(state);
  const views = getViews(state);
  return {
    user,
    lastSALCommand,
    mode,
    getCurrentView,
    viewsStatus,
    getLastManagerHeartbeat: getManagerHeartbeat,
    views,
  };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  clearViewToEdit: () => dispatch(clearViewToEdit),
  subscribeToStreams: () => dispatch(addGroupSubscription('heartbeat-manager-0-stream')),
  unsubscribeToStreams: () => dispatch(requestGroupSubscriptionRemoval('heartbeat-manager-0-stream')),
});

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
