import { RECEIVE_ALARMS } from './actionTypes';

export const receiveAlarms = (alarms) => {
  return {
    type: RECEIVE_ALARMS,
    alarms,
  };
};
