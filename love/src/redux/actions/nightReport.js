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

import { NIGHT_REPORT_UPDATE, NIGHT_REPORT_SUCCESS } from './actionTypes';
import { sendEvent } from './ws';
import { getNightReportState } from '../selectors';
import ManagerInterface from 'Utils';

/**
 * Action creator for updating a night report.
 */
export const nightReportUpdate = (report) => {
  return {
    type: NIGHT_REPORT_UPDATE,
    data: report,
  };
};

/**
 * Action creator for storing a night report.
 */
export const nightReportSuccess = (report) => {
  return {
    type: NIGHT_REPORT_SUCCESS,
    data: report,
  };
};

// export const storeNightReport = () => {
//   return (dispatch, getState) => {
//     const nightReportState = getNightReportState(getState());
//     const { report } = nightReportState;
//     ManagerInterface.saveCurrentNightReport(
//       report.summary,
//       report.weather,
//       report.maintel_summary,
//       report.auxtel_summary,
//       report.confluence_url,
//       report.observers_crew,
//     ).then((report) => {
//       dispatch(nightReportSuccess(report));
//     });
//   };
// }

/**
 * Function used to broadcast the night report to other LOVE instances.
 */
export const broadcastNightReport = (report, persisted = false) => {
  console.log('broadcastNightReport action called with report:', report);
  return (dispatch) => {
    dispatch(sendEvent('LOVE', '0', 'nightReportUpdates', { report, persisted }));
  };
};
