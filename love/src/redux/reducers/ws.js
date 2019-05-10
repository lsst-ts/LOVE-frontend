import { OPEN_WS_CONNECTION, CHANGE_WS_STATE } from '../actions/actionTypes';
import { connectionStates } from '../actions/ws';

const initialState = {
  connectionState: connectionStates.CLOSED,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_WS_STATE: {
      return { connectionState: action.connectionState };
    }
    default:
      return state;
  }
}
