import { REQUEST_TOKEN, RECEIVE_TOKEN } from '../actionTypes';
import { requestToken, receiveToken } from '../actions';
import ManagerInterface from '../../Utils';

export default function(state, action) {
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