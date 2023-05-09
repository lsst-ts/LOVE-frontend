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
  getEfdConfig,
  getSALConfig,
  getObservatoryState,
  getControlLocation,
} from '../../redux/selectors';
import { logout, receiveConfig, requireSwapToken, cancelSwapToken } from '../../redux/actions/auth';
import { addGroup, removeGroup, requestSALCommand, resetSubscriptions } from '../../redux/actions/ws';
import { fetchControlLocationLoopStart, fetchControlLocationLoopStop } from '../../redux/actions/observatoryState';
import { clearViewToEdit } from '../../redux/actions/uif';
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
  const efdConfigFile = getEfdConfig(state);
  const salConfigFile = getSALConfig(state);
  const observatorySummary = getObservatoryState(state);
  const controlLocation = getControlLocation(state);
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
    efdConfigFile,
    salConfigFile,
    observatorySummary,
    controlLocation,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'heartbeat-manager-0-stream',
    /* Watcher states */
    'event-Watcher-0-alarm',
    'event-Watcher-0-stream',
    /* Simonyi states */
    'event-Scheduler-1-observingMode',
    'event-Scheduler-1-observatoryState',
    /* Auxtel states */
    'event-Scheduler-2-observingMode',
    'event-Scheduler-2-observatoryState',
  ];
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
    setConfig: (config) => dispatch(receiveConfig(config)),
    startControlLocationLoop: () => {
      dispatch(fetchControlLocationLoopStart());
    },
    stopControlLocationLoop: () => {
      dispatch(fetchControlLocationLoopStop());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
