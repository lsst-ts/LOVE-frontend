/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { UPDATE_NIGHT_REPORT_DATA } from './actionTypes';
import { sendEvent } from './ws';

export const updateNightReport = (report) => {
  return {
    type: UPDATE_NIGHT_REPORT_DATA,
    data: report,
  };
};

export const broadcastNightReport = (report) => {
  console.log('broadcastNightReport action called with report:', report);
  return (dispatch) => {
    dispatch(sendEvent('LOVE', '0', 'nightReportUpdates', report));
  };
};
