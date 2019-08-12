import { UPDATE_LOG_MESSAGE_DATA, UPDATE_ERROR_CODE_DATA, REMOVE_CSC_LOG_MESSAGES } from './actionTypes';

export const receiveLogMessageData = (csc, salindex, messages) => {
  return {
    type: UPDATE_LOG_MESSAGE_DATA,
    csc,
    salindex,
    messages,
  };
};

export const removeCSCLogMessages = (csc, salindex) => {
  return {
    type: REMOVE_CSC_LOG_MESSAGES,
    csc,
    salindex,
  };
};

export const receiveErrorCodeData = (csc, salindex, errorCodeData) => {
  return {
    type: UPDATE_ERROR_CODE_DATA,
    csc,
    salindex,
    errorCodeData,
  };
};
