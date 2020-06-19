import React from 'react';
import { connect } from 'react-redux';
import { getAllAlarms, getLastestAlarms, getAlarmConfig } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import AlarmAudio from './AlarmAudio';

const AlarmAudioContainer = ({ ...props }) => {
  return <AlarmAudio {...props} />;
};

const mapStateToProps = (state) => {
  const alarms = getAllAlarms(state);
  const newAlarms = getLastestAlarms(state);
  const alarmsConfig = getAlarmConfig(state);
  return {
    alarms,
    newAlarms,
    alarmsConfig,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-Watcher-0-alarm'];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AlarmAudioContainer);
