import {
  RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  RECEIVE_GROUP_SUBSCRIPTION_DATA,
  ADD_GROUP_SUBSCRIPTION,
  CHANGE_WS_STATE,
} from '../actions/actionTypes';
import { connectionStates } from '../actions/ws';

const initialState = {
  connectionState: connectionStates.CLOSED,
  subscriptions: [],
};

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
        const [category, csc, stream] = subscription.groupName.split('-');
        if (action.data.includes(csc) && action.data.includes(stream)) {
          return {
            ...subscription,
            confirmationMessage: action.data,
          };
        }
        
        return subscription;
      });

      return { ...state, subscriptions };
      return state;
    }
    case RECEIVE_GROUP_SUBSCRIPTION_DATA: {
      const subscriptions = state.subscriptions.map((subscription) => {
        const [category, csc, stream] = subscription.groupName.split('-');

        if (category !== action.category) return subscription;

        if (csc !== action.csc) return subscription;

        if (!Object.keys(action.data[csc]).includes(stream) && stream !== 'all') return subscription;

        if (stream === 'all') {
          return {
            ...subscription,
            groupName: subscription.groupName,
            data: action.data[csc],
          };
        }

        return {
          ...subscription,
          groupName: subscription.groupName,
          data: action.data[csc][stream],
        };
      });

      return { ...state, subscriptions };
    }
    default:
      return state;
  }
}
