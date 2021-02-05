import { RECEIVE_OBSERVING_LOG } from '../actions/actionTypes';

const initialState = {
  logMessages: [],
};
export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_OBSERVING_LOG: {
      const repeated = state.logMessages.some((log) => action.data.some(
        (newLog) => log.private_revCode.value === newLog.private_revCode.value &&
            log.private_sndStamp.value === newLog.private_sndStamp.value &&
            log.private_rcvStamp.value === newLog.private_rcvStamp.value,
      ));
      if (repeated) return state;
      return {
        logMessages: [...state.logMessages, ...action.data],
      };
    }
    default: {
      return state;
    }
  }
}
