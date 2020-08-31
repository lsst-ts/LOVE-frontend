import {
  UPDATE_LOG_MESSAGE_DATA,
  REMOVE_CSC_LOG_MESSAGES,
  UPDATE_ERROR_CODE_DATA,
  REMOVE_CSC_ERROR_CODE_DATA,
} from '../actions/actionTypes';

const initialState = {
  logMessageData: [],
  errorCodeData: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOG_MESSAGE_DATA: {
      const cscDataIndex = state.logMessageData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      if (cscDataIndex === -1) {
        return {
          errorCodeData: state.errorCodeData,
          logMessageData: [
            ...state.logMessageData.slice(0, 999),
            {
              csc: action.csc,
              salindex: action.salindex,
              messages: action.messages,
            },
          ],
        };
      }

      const newLogMessageData = [...state.logMessageData];
      const cscData = newLogMessageData[cscDataIndex];
      const nonDuplicates = action?.messages?.filter(
        (msg) => cscData?.messages?.findIndex((log) => log?.private_sndStamp?.value === msg?.private_sndStamp?.value) === -1,
      ) ?? [];
      newLogMessageData[cscDataIndex] = {
        csc: action.csc,
        salindex: action.salindex,
        messages: [...nonDuplicates, ...cscData.messages],
      };

      return {
        errorCodeData: state.errorCodeData,
        logMessageData: newLogMessageData,
      };
    }
    case REMOVE_CSC_LOG_MESSAGES: {
      const cscDataIndex = state.logMessageData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      if (cscDataIndex === -1) return state;

      const newLogMessageData = [...state.logMessageData];
      newLogMessageData[cscDataIndex] = {
        csc: action.csc,
        salindex: action.salindex,
        messages: [],
      };

      return {
        errorCodeData: state.errorCodeData,
        logMessageData: newLogMessageData,
      };
    }
    case UPDATE_ERROR_CODE_DATA: {
      const cscDataIndex = state.errorCodeData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      if (cscDataIndex === -1) {
        return {
          logMessageData: state.logMessageData,
          errorCodeData: [
            ...state.errorCodeData.slice(0, 999),
            {
              csc: action.csc,
              salindex: action.salindex,
              errorCodeData: action.errorCodeData,
            },
          ],
        };
      }

      const newErrorCodeData = [...state.errorCodeData];
      const cscData = newErrorCodeData[cscDataIndex];
      const nonDuplicates = action?.messages?.filter(
        (msg) => cscData?.messages?.findIndex((log) => log?.private_sndStamp?.value === msg?.private_sndStamp?.value) === -1,
      ) ?? [];
      newErrorCodeData[cscDataIndex] = {
        csc: action.csc,
        salindex: action.salindex,
        errorCodeData: [...nonDuplicates, ...cscData.errorCodeData],
      };

      return {
        logMessageData: state.logMessageData,
        errorCodeData: newErrorCodeData,
      };
    }
    case REMOVE_CSC_ERROR_CODE_DATA: {
      const cscDataIndex = state.errorCodeData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      if (cscDataIndex === -1) return state;

      const newErrorCodeData = [...state.errorCodeData];
      newErrorCodeData[cscDataIndex] = {
        csc: action.csc,
        salindex: action.salindex,
        errorCodeData: [],
      };

      return {
        logMessageData: state.logMessageData,
        errorCodeData: newErrorCodeData,
      };
    }
    default:
      return state;
  }
}
