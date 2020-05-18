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
  RECEIVE_ALARMS,
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
      return { ...state, connectionState: action.connectionState, retryInterval };
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
      } else {
        const subscriptions = [...state.subscriptions];
        subscriptions[index].counter = subscriptions[index].counter + 1;
        return {
          ...state,
          subscriptions,
        };
      }
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

    case RECEIVE_ALARMS: {
      const latestAlarms = Array.isArray(action.alarms) ? Array.from(action.alarms) : Array.from([action.alarms]);
      let alarms = Array.from(state.alarms);
      latestAlarms.forEach((latestAlarm) => {
        if (latestAlarm === undefined) return;
        const alarmIndex = alarms.findIndex((stateAlarm) => {
          return stateAlarm.name.value === latestAlarm.name.value;
        });
        if (alarmIndex === -1) {
          alarms.push(latestAlarm);
        } else {
          alarms[alarmIndex] = latestAlarm;
        }
      });

      return {
        ...state,
        alarms,
        latestAlarms,
      };
    }

    default:
      return state;
  }
}
