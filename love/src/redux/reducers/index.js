import { combineReducers } from 'redux';
import auth from './auth';
import ws from './ws';
import camera from './camera';
import heartbeats from './heartbeats';
export default combineReducers({
  auth,
  ws,
  camera,
  heartbeats,
});
