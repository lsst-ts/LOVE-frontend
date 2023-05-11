import { RECEIVE_ALARM, RECEIVE_ALL_ALARMS } from './actionTypes';

export const receiveAlarm = (alarm) => {
  return {
    type: RECEIVE_ALARM,
    alarm,
  };
};

export const receiveAllAlarms = (alarmsStream) => {
  return {
    type: RECEIVE_ALL_ALARMS,
    alarmsStream,
  };
};
