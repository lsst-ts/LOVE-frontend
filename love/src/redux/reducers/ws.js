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
  RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  RECEIVE_GROUP_SUBSCRIPTION_DATA,
  ADD_GROUP,
  REMOVE_GROUP,
  REQUEST_SUBSCRIPTIONS,
  REQUEST_GROUP_UNSUBSCRIPTION,
  RECEIVE_GROUP_UNSUBSCRIPTION_CONFIRMATION,
  RESET_SUBSCRIPTIONS,
  CHANGE_WS_STATE,
  UPDATE_LAST_SAL_COMMAND,
  UPDATE_LAST_SAL_COMMAND_STATUS,
  RECEIVE_ALARM,
  RECEIVE_ALL_ALARMS,
} from '../actions/actionTypes';
import { connectionStates, groupStates, SALCommandStatus } from '../actions/ws';

const initialState = {
  alarms: [],
  latestAlarms: [],
  connectionState: connectionStates.CLOSED,
  socket: null, // Reference to the websocket client object
  retryInterval: undefined,
  subscriptions: [],
  lastSALCommand: {
    status: SALCommandStatus.EMPTY,
    statusCode: null,
    cmd: '',
    params: {},
    csc: '',
    salindex: 0,
  },
};
/**
 * Changes the state of the websocket connection to the LOVE-manager Django-Channels interface along with the list of subscriptions groups
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_WS_STATE: {
      let { retryInterval } = state;
      if (
        state.connectionState !== connectionStates.RETRYING &&
        action.connectionState === connectionStates.RETRYING &&
        action.socket
      ) {
        clearInterval(retryInterval);
        retryInterval = setInterval(action.socket.reconnect, 3000);
      } else if (
        state.connectionState === connectionStates.RETRYING &&
        action.connectionState !== connectionStates.RETRYING
      ) {
        clearInterval(retryInterval);
      }
      return { ...state, connectionState: action.connectionState, retryInterval, socket: action.socket };
    }
    case ADD_GROUP: {
      const index = state.subscriptions.findIndex((subscription) => subscription.groupName === action.groupName);
      if (index < 0) {
        return {
          ...state,
          subscriptions: [
            ...state.subscriptions,
            {
              groupName: action.groupName,
              status: groupStates.PENDING,
              counter: 1,
            },
          ],
        };
      }
      const subscriptions = [...state.subscriptions];
      subscriptions[index].counter += 1;
      return {
        ...state,
        subscriptions,
      };
    }
    case REQUEST_SUBSCRIPTIONS: {
      const subscriptions = action.subscriptions.map((subscription) => ({
        ...subscription,
        status:
          subscription.status === groupStates.PENDING || subscription.status === groupStates.UNSUBSCRIBING
            ? groupStates.REQUESTING
            : subscription.status,
      }));
      return {
        ...state,
        subscriptions,
      };
    }
    case RECEIVE_GROUP_CONFIRMATION_MESSAGE: {
      const subscriptions = state.subscriptions.map((subscription) => {
        if (action.data.includes(subscription.groupName)) {
          return {
            ...subscription,
            confirmationMessage: action.data,
            status: groupStates.SUBSCRIBED,
          };
        }
        return subscription;
      });

      return {
        ...state,
        subscriptions,
      };
    }
    case REMOVE_GROUP: {
      const subscriptions = state.subscriptions.map((subscription) => {
        if (action.groupName === subscription.groupName) {
          return {
            ...subscription,
            counter: subscription.counter <= 1 ? 0 : subscription.counter - 1,
          };
        }
        return subscription;
      });
      return {
        ...state,
        subscriptions,
      };
    }
    case REQUEST_GROUP_UNSUBSCRIPTION: {
      const subscriptions = state.subscriptions.map((subscription) => {
        if (action.groupName === subscription.groupName) {
          return {
            ...subscription,
            status: groupStates.UNSUBSCRIBING,
            counter: 0,
          };
        }
        return subscription;
      });
      return {
        ...state,
        subscriptions,
      };
    }
    case RECEIVE_GROUP_UNSUBSCRIPTION_CONFIRMATION: {
      const subscriptions = state.subscriptions.filter((subscription) => {
        return subscription.status !== groupStates.UNSUBSCRIBING || !action.data.includes(subscription.groupName);
      });
      return {
        ...state,
        subscriptions,
      };
    }
    case RESET_SUBSCRIPTIONS: {
      return {
        ...state,
        subscriptions: action.subscriptions,
      };
    }
    case RECEIVE_GROUP_SUBSCRIPTION_DATA: {
      const subscriptions = state.subscriptions.map((subscription) => {
        const [category, csc, salindex, stream] = subscription.groupName.split('-');
        if (csc === 'all' && salindex === 'all' && stream === 'all') {
          const newData = { ...subscription.data };
          newData[`${action.csc}-${action.salindex}`] = { ...newData[action.csc], ...action.data };
          return {
            ...subscription,
            data: newData,
            timestamp: new Date(),
          };
        }

        if (
          category !== action.category ||
          csc !== action.csc ||
          parseInt(salindex, 10) !== parseInt(action.salindex, 10) ||
          (!Object.keys(action.data).includes(stream) && stream !== 'all')
        ) {
          return subscription;
        }

        if (stream === 'all') {
          return {
            ...subscription,
            data: action.data,
            timestamp: new Date(),
          };
        }
        return {
          ...subscription,
          data: action.data[stream],
          timestamp: new Date(),
        };
      });

      return { ...state, subscriptions };
    }

    case UPDATE_LAST_SAL_COMMAND: {
      return {
        ...state,
        lastSALCommand: {
          status: action.status,
          statusCode: action.statusCode,
          cmd: action.cmd,
          params: action.params,
          csc: action.csc,
          salindex: action.salindex,
          cmd_id: action.cmd_id,
        },
      };
    }

    case UPDATE_LAST_SAL_COMMAND_STATUS: {
      return {
        ...state,
        lastSALCommand: {
          ...state.lastSALCommand,
          status: action.status,
          statusCode: action.statusCode,
          result: action.result,
        },
      };
    }

    case RECEIVE_ALARM: {
      const currentAlarms = [...state.alarms];
      const alarmIndex = currentAlarms.findIndex((alarm) => alarm.name.value === action.alarm.name.value);
      if (alarmIndex < 0) {
        currentAlarms.push(action.alarm);
      } else {
        currentAlarms[alarmIndex] = action.alarm;
      }
      return {
        ...state,
        alarms: currentAlarms,
      };
    }

    case RECEIVE_ALL_ALARMS: {
      const alarms = Object.keys(action.alarmsStream).map((key) => action.alarmsStream[key]);
      return {
        ...state,
        alarms,
      };
    }

    default:
      return state;
  }
}
