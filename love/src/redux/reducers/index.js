import { combineReducers } from 'redux';
import auth from './auth';
import ws from './ws';
import camera from './camera';
export default combineReducers({
  auth,
  ws,
  camera,
});
