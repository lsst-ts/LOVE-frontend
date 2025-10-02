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

import { NIGHT_REPORT_UPDATE, NIGHT_REPORT_SUCCESS } from '../actions/actionTypes';

const initialState = {
  report: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NIGHT_REPORT_UPDATE: {
      return {
        ...state,
        report: action.data,
        changesNotSaved: true,
      };
    }
    case NIGHT_REPORT_SUCCESS: {
      return {
        ...state,
        report: action.data,
        changesNotSaved: false,
      };
    }
    default:
      return state;
  }
}
