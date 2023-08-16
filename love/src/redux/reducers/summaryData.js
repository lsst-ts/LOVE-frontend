/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import {
  UPDATE_LOG_MESSAGE_DATA,
  REMOVE_CSC_LOG_MESSAGES,
  UPDATE_ERROR_CODE_DATA,
  REMOVE_CSC_ERROR_CODE_DATA,
} from '../actions/actionTypes';
import { LOG_LEVELS } from 'Constants';

const initialState = {
  logMessageData: [],
  errorCodeData: [],
  withWarning: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOG_MESSAGE_DATA: {
      const cscDataIndex = state.logMessageData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      const withWarning = action.messages?.[0]?.level?.value >= LOG_LEVELS.warning;

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
          withWarning: { ...state.withWarning, [`${action.csc}:${action.salindex}`]: withWarning },
        };
      }

      const newLogMessageData = [...state.logMessageData];
      const cscData = newLogMessageData[cscDataIndex];
      const nonDuplicates =
        action?.messages?.filter((msg) => {
          return (
            cscData?.messages?.findIndex((log) => {
              return log?.private_sndStamp?.value === msg?.private_sndStamp?.value;
            }) === -1
          );
        }) ?? [];
      newLogMessageData[cscDataIndex] = {
        csc: action.csc,
        salindex: action.salindex,
        messages: [...nonDuplicates, ...cscData.messages],
      };

      return {
        errorCodeData: state.errorCodeData,
        logMessageData: newLogMessageData,
        withWarning: { ...state.withWarning, [`${action.csc}:${action.salindex}`]: withWarning },
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
        withWarning: { ...state.withWarning, [`${action.csc}:${action.salindex}`]: false },
      };
    }
    case UPDATE_ERROR_CODE_DATA: {
      const cscDataIndex = state.errorCodeData.findIndex(
        (CSCData) => CSCData.salindex === action.salindex && CSCData.csc === action.csc,
      );

      const withWarning = action.messages?.[0]?.level?.value >= LOG_LEVELS.warning;

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
          withWarning: { ...state.withWarning, [`${action.csc}:${action.salindex}`]: withWarning },
        };
      }

      const newErrorCodeData = [...state.errorCodeData];
      const cscData = newErrorCodeData[cscDataIndex];
      const nonDuplicates =
        action?.errorCodeData?.filter((msg) => {
          return (
            cscData?.errorCodeData?.findIndex((log) => {
              return log?.private_sndStamp?.value === msg?.private_sndStamp?.value;
            }) === -1
          );
        }) ?? [];
      newErrorCodeData[cscDataIndex] = {
        csc: action.csc,
        salindex: action.salindex,
        errorCodeData: [...nonDuplicates, ...cscData.errorCodeData],
      };

      return {
        logMessageData: state.logMessageData,
        errorCodeData: newErrorCodeData,
        withWarning: { ...state.withWarning, [`${action.csc}:${action.salindex}`]: withWarning },
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
        withWarning: { ...state.withWarning, [`${action.csc}:${action.salindex}`]: false },
      };
    }
    default:
      return state;
  }
}
