import { REQUEST_TOKEN, RECEIVE_TOKEN } from '../actionTypes';
import { requestToken, receiveToken } from '../actions';
import ManagerInterface from '../../Utils';
export const defaultState = {
  username:'',
  token: ''
}

export default function(state=defaultState, action) {
  switch (action.type) {
    case REQUEST_TOKEN: {
      return Object.assign({}, state, { username: action.username });
    }
    case RECEIVE_TOKEN: {
      return Object.assign({}, state, { token: action.token });
    }
    default:
      return state;
  }
}