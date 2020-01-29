import {
  RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  RECEIVE_GROUP_SUBSCRIPTION_DATA,
  ADD_GROUP_SUBSCRIPTION,
  CHANGE_WS_STATE,
  UPDATE_LAST_SAL_COMMAND,
  UPDATE_LAST_SAL_COMMAND_STATUS,
  RECEIVE_ALARMS,
} from '../actions/actionTypes';
import { connectionStates, SALCommandStatus } from '../actions/ws';

const initialState = {
  alarms: [],
  connectionState: connectionStates.CLOSED,
  subscriptions: [],
  lastSALCommand: {
    status: SALCommandStatus.EMPTY,
    cmd: '',
    params: {},
    component: '',
    salindex: 0,
  },
};
/**
 * Changes the state of the websocket connection to the LOVE-manager Django-Channels interface along with the list of subscriptions groups
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_WS_STATE: {
      return { ...state, connectionState: action.connectionState };
    }
    case ADD_GROUP_SUBSCRIPTION: {
      const matchingGroup = state.subscriptions.filter((subscription) => subscription.groupName === action.groupName);
      if (matchingGroup.length > 0) {
        return state;
      }

      const subscriptions = [
        ...state.subscriptions,
        {
          groupName: action.groupName,
        },
      ];
      return { ...state, subscriptions };
    }
    case RECEIVE_GROUP_CONFIRMATION_MESSAGE: {
      const subscriptions = state.subscriptions.map((subscription) => {
        const [, csc, stream] = subscription.groupName.split('-');
        if (action.data.includes(csc) && action.data.includes(stream)) {
          return {
            ...subscription,
            confirmationMessage: action.data,
          };
        }
        return subscription;
      });

      return { ...state, subscriptions };
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
          parseInt(salindex) !== parseInt(action.salindex) ||
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
          cmd: action.cmd,
          params: action.params,
          component: action.component,
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
          result: action.result,
        },
      };
    }

    case RECEIVE_ALARMS: {
      let actionAlarms = action.alarms;
      if (!Array.isArray(action.alarms)) {
        actionAlarms = [actionAlarms];
      }
      let newAlarms = Array.from(state.alarms);
      actionAlarms.forEach((actionAlarm) => {
        if (actionAlarm === undefined) return;
        const alarmIndex = newAlarms.findIndex((stateAlarm) => {
          return stateAlarm.name.value === actionAlarm.name.value;
        });
        if (alarmIndex === -1) {
          newAlarms.push(actionAlarm);
        } else {
          newAlarms[alarmIndex] = actionAlarm;
        }
      });

      return {
        ...state,
        alarms: newAlarms,
      };
    }

    default:
      return state;
  }
}
