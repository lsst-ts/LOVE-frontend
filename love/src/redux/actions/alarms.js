import { RECEIVE_ALARM } from './actionTypes';

export const receiveAlarm = (alarm) => {
  return {
    type: RECEIVE_ALARM,
    alarm,
  };
};
