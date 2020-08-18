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
  getLastComponentHeartbeat,
  getAllTime,
  getAllAlarms,
  getTaiToUtc,
  getPermCmdExec,
  getTokenSwapStatus,
  getConfig,
} from '../../redux/selectors';
import { logout } from '../../redux/actions/auth';
import { addGroup, removeGroup, requestSALCommand, resetSubscriptions } from '../../redux/actions/ws';
import { clearViewToEdit } from '../../redux/actions/uif';
import { requireSwapToken, cancelSwapToken } from '../../redux/actions/auth';
import Layout from './Layout';

const LayoutContainer = ({ ...props }) => {
  return <Layout {...props} />;
};

const mapStateToProps = (state) => {
  const user = getUsername(state);
  const config = getConfig(state);
  const lastSALCommand = getLastSALCommand(state);
  const mode = getMode(state);
  const getCurrentView = (id) => getViewSummary(state, id);
  const getManagerHeartbeat = () => getLastManagerHeartbeat(state);
  const getComponentHeartbeat = (component) => getLastComponentHeartbeat(state, component);
  const viewsStatus = getViewsStatus(state);
  const views = getViews(state);
  const timeData = getAllTime(state);
  const alarms = getAllAlarms(state);
  const taiToUtc = getTaiToUtc(state);
  const execPermission = getPermCmdExec(state);
  const getExecPermission = () => getPermCmdExec(state);
  const tokenSwapStatus = getTokenSwapStatus(state);
  return {
    user,
    config,
    lastSALCommand,
    mode,
    getCurrentView,
    viewsStatus,
    getLastManagerHeartbeat: getManagerHeartbeat,
    getLastComponentHeartbeat: getComponentHeartbeat,
    views,
    timeData,
    alarms,
    taiToUtc,
    execPermission,
    getExecPermission,
    tokenSwapStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['heartbeat-manager-0-stream', 'event-Watcher-0-alarm'];
  return {
    subscriptions,
    logout: () => dispatch(logout()),
    clearViewToEdit: () => dispatch(clearViewToEdit),
    resetSubscriptions: () => dispatch(resetSubscriptions()),
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
    ackAlarm: (name, severity, acknowledgedBy) => {
      return dispatch(
        requestSALCommand({
          cmd: 'cmd_acknowledge',
          component: 'Watcher',
          salindex: 0,
          params: {
            name,
            severity,
            acknowledgedBy,
          },
        }),
      );
    },
    requireUserSwap: (bool) => {
      if (bool) dispatch(requireSwapToken);
      else dispatch(cancelSwapToken);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
