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

import { RECEIVE_OBSERVING_LOG } from '../actions/actionTypes';

const initialState = {
  logMessages: [],
};
export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_OBSERVING_LOG: {
      const repeated = state.logMessages.some((log) =>
        action.data.some(
          (newLog) =>
            log.private_revCode.value === newLog.private_revCode.value &&
            log.private_sndStamp.value === newLog.private_sndStamp.value &&
            log.private_rcvStamp.value === newLog.private_rcvStamp.value,
        ),
      );
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
