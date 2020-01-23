import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';
import auth from './auth';
import ws from './ws';
import camera from './camera';
import heartbeats from './heartbeats';
import summaryData from './summaryData';
import uif from './uif';
import { UPDATE_EDITED_VIEW } from '../actions/actionTypes';

export default combineReducers({
  auth,
  ws,
  camera,
  heartbeats,
  summaryData,
  uif: undoable(uif, { filter: includeAction(UPDATE_EDITED_VIEW) }),
});
