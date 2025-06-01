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

import ManagerInterface from 'Utils';
import { UPDATE_TOPICS_FIELDS_INFO } from './actionTypes';

export function queryTopicsFieldsInfo() {
  return (dispatch) => {
    ManagerInterface.getTopicData('event-telemetry')
      .then((data) => {
        dispatch({
          type: UPDATE_TOPICS_FIELDS_INFO,
          data,
        });
      })
      .catch((error) => {
        console.error('Error fetching topics fields info:', error);
      });
  };
}
