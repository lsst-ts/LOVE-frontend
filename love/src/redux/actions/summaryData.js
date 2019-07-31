import { UPDATE_LOG_MESSAGE_DATA} from './actionTypes';

export const receiveLogMessageData = (csc, salindex, messages) => {
  return {
    type: UPDATE_LOG_MESSAGES,
    csc,
    salindex,
    messages,
  };
};
