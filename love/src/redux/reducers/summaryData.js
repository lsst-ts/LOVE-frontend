import { UPDATE_LOG_MESSAGE_DATA, REMOVE_CSC_LOG_MESSAGES } from '../actions/actionTypes';

const initialState = {
  logMessageData: [],
  errorCodeData: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOG_MESSAGE_DATA: {
      let pastMessages = [];
      if (state.logMessageData.length > 0) {
        pastMessages = state.logMessageData;
      }

      const cscDataIndex = state.logMessageData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      if (cscDataIndex === -1) {
        return {
          errorCodeData: state.errorCodeData,
          logMessageData: [
            ...state.logMessageData,
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
      newLogMessageData[cscDataIndex] = {
        csc: action.csc,
        salindex: action.salindex,
        messages: [...cscData.messages, ...action.messages],
      };

      return {
        errorCodeData: state.errorCodeData,
        logMessageData: newLogMessageData,
      };
    }
    case REMOVE_CSC_LOG_MESSAGES: {
      console.log(REMOVE_CSC_LOG_MESSAGES)
      const cscDataIndex = state.logMessageData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      if (cscDataIndex === -1) return state;

      const newLogMessageData = [...state.logMessageData];
      const cscData = newLogMessageData[cscDataIndex];
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
    default:
      return state;
  }
}
