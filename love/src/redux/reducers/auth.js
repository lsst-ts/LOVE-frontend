import { REQUEST_TOKEN, RECEIVE_TOKEN } from '../actionTypes';

export const tokenStates = {
  EMPTY: 'EMPTY',
  REQUESTED: 'REQUESTED',
  RECEIVED: 'RECEIVED',
  ERROR: 'ERROR',
};

const initialState = {
  username: '',
  token: '',
  status: tokenStates.EMPTY,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TOKEN: {
      return Object.assign({}, state, {
        username: action.username,
        status: tokenStates.REQUESTED,
      });
    }
    case RECEIVE_TOKEN: {
      return Object.assign({}, state, {
        token: action.token,
        status: tokenStates.RECEIVED,
      });
    }
    default:
      return state;
  }
}
