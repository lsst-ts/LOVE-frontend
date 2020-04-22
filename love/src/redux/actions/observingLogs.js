import { RECEIVE_OBSERVING_LOG } from './actionTypes';

export const receiveObservingLog = (data) => {
    return {
      type: RECEIVE_OBSERVING_LOG,
      data: data
    };
  };