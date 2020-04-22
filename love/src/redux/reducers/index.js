import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';
import auth from './auth';
import ws from './ws';
import camera from './camera';
import heartbeats from './heartbeats';
import summaryData from './summaryData';
import observingLogs from './observingLogs';
import time from './time';
import uif from './uif';
import { UPDATE_EDITED_VIEW } from '../actions/actionTypes';

export default combineReducers({
  auth,
  ws,
  camera,
  heartbeats,
  summaryData,
  uif: undoable(uif, {
    limit: 10,
    filter: includeAction(UPDATE_EDITED_VIEW),
  }),
  observingLogs,
  time,
});
