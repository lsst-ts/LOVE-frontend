import { ADD_SUBSCRIPTION, CHANGE_WS_STATE } from '../actions/actionTypes';
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
    case ADD_SUBSCRIPTION: {
      const matchingGroup = state.subscriptions.filter((subscription) => subscription.groupName === action.groupName);
      if (matchingGroup.length > 0) {
        return state;
      }

      const subscriptions = [
        ... state.subscriptions,
        {
          groupName: action.groupName,
        },
      ];
      return { ...state, subscriptions };
    }
    default:
      return state;
  }
}
