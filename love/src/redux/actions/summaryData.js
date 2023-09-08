/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
  UPDATE_ERROR_CODE_DATA,
  REMOVE_CSC_LOG_MESSAGES,
  REMOVE_CSC_ERROR_CODE_DATA,
} from './actionTypes';

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

export const removeCSCErrorCodeData = (csc, salindex) => {
  return {
    type: REMOVE_CSC_ERROR_CODE_DATA,
    csc,
    salindex,
  };
};
