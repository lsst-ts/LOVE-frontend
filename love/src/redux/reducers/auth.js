import { REQUEST_TOKEN, RECEIVE_TOKEN, REJECT_TOKEN, REMOVE_TOKEN, EXPIRE_TOKEN } from '../actions/actionTypes';
export const tokenStates = {
  EMPTY: 'EMPTY',
  REQUESTED: 'REQUESTED',
  RECEIVED: 'RECEIVED',
  ERROR: 'ERROR',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
};

const initialState = {
  username: '',
  token: null,
  status: tokenStates.EMPTY,
};
/**
 * Modifies the state of the authentication mainly characterized by the
 * token received from the LOVE-manager and its status.
 */
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
    case REMOVE_TOKEN:
      localStorage.removeItem('LOVE-TOKEN');
      return { ...initialState };
    case REJECT_TOKEN:
      localStorage.removeItem('LOVE-TOKEN');
      return {
        ...state,
        token: null,
        status: tokenStates.REJECTED,
      };
    case EXPIRE_TOKEN:
      localStorage.removeItem('LOVE-TOKEN');
      return {
        ...initialState,
        status: tokenStates.EXPIRED,
      };
    default:
      return state;
  }
}
