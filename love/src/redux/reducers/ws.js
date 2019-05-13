import { RECEIVE_GROUP_SUBSCRIPTION_DATA, ADD_GROUP_SUBSCRIPTION, CHANGE_WS_STATE } from '../actions/actionTypes';
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
    case RECEIVE_GROUP_SUBSCRIPTION_DATA: {
        const subscriptions = state.subscriptions.map(subscription =>{
            const [category, csc, stream] = subscription.groupName.split('-');

            if(category !== action.category) return subscription;

            if(csc !== action.csc ) return subscription;

            if(!Object.keys(action.data[csc]).includes(stream) && stream !== 'all' ) return subscription;

            if(stream==='all'){
                return {
                    groupName: subscription.groupName,
                    data: action.data[csc]
                };
            }

            return {
                groupName: subscription.groupName,
                data: action.data[csc][stream]
            }
        });
      return { ...state, subscriptions };
    }
    default:
      return state;
  }
}
