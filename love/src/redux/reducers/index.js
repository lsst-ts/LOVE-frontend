import { combineReducers } from 'redux';
import auth from './auth';
import ws from './ws';
export default combineReducers({
  auth,
  ws
});
