/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
import observatoryState from './observatoryState';
import salinfo from './salinfo';
import nightReport from './nightReport';
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
  observatoryState,
  salinfo,
  nightReport,
});
