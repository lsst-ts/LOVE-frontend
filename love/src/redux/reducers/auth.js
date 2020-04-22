import {
  REQUEST_TOKEN,
  RECEIVE_TOKEN,
  REJECT_TOKEN,
  EXPIRE_TOKEN,
  EMPTY_TOKEN,
  MARK_ERROR_TOKEN,
  REQUEST_REMOVE_TOKEN,
  REMOVE_REMOTE_TOKEN,
  MARK_ERROR_REMOVE_TOKEN,
  GET_TOKEN_FROM_LOCALSTORAGE
} from '../actions/actionTypes';

export const tokenStates = {
  EMPTY: 'EMPTY',
  READ_FROM_STORAGE: 'READ_FROM_STORAGE',
  REQUESTED: 'REQUESTED',
  RECEIVED: 'RECEIVED',
  ERROR: 'ERROR',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  REMOVED_REMOTELY: 'REMOVED_REMOTELY',
  REMOVE_REQUESTED: 'REMOVE_REQUESTED',
  REMOVE_ERROR: 'REMOVE_ERROR',
};

const initialState = {
  username: '',
  token: null,
  status: tokenStates.EMPTY,
  permissions: {
    cmd_exec: false,
  },
};
/**
 * Modifies the state of the authentication mainly characterized by the
 * token received from the LOVE-manager and its status.
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TOKEN:
      {
        return Object.assign({}, state, {
          status: tokenStates.REQUESTED
        });
      }
    case GET_TOKEN_FROM_LOCALSTORAGE:
      {
        return Object.assign({}, state, {
          status: tokenStates.READ_FROM_STORAGE,
          token: action.token,
        });
      }
    case RECEIVE_TOKEN:
      {
        if (action.permissions === null || action.permissions === undefined) {
          return Object.assign({}, state, {
            username: action.username,
            token: action.token,
            status: tokenStates.RECEIVED,
            permissions: initialState.permissions,
          });
        }
        return Object.assign({}, state, {
          username: action.username,
          token: action.token,
          status: tokenStates.RECEIVED,
          permissions: {
            cmd_exec: action.permissions['execute_commands'],
          },
        });
      }
    case REJECT_TOKEN:
      return {
        ...initialState,
        token: null,
        status: tokenStates.REJECTED
      };
    case EXPIRE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.EXPIRED
      };
    case EMPTY_TOKEN:
      return {
        ...initialState
      };
    case MARK_ERROR_TOKEN:
      return {
        ...initialState,
        status: tokenStates.ERROR
      };

    case REQUEST_REMOVE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.REMOVE_REQUESTED
      };
    case REMOVE_REMOTE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.REMOVED_REMOTELY
      };
    case MARK_ERROR_REMOVE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.REMOVE_ERROR
      };
    default:
      return state;
  }
}
