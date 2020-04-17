import {
  RECEIVE_TIME_DATA
} from '../actions/actionTypes';
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);


const initialState = {
  request_time: 0,
  receive_time: 0,
  server_time: {
    utc: 0,
    tai: 0,
    mjd: 0,
    sidereal_summit: 0,
    sidereal_greenwich: 0,
    tai_to_utc: 0,
  }
};
/**
 * Modifies the state of the authentication mainly characterized by the
 * token received from the LOVE-manager and its status.
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_TIME_DATA:
      {
        return Object.assign({}, state, {
          request_time: action.request_time,
          receive_time: action.receive_time,
          server_time: {
            utc: action.time_data.utc,
            tai: action.time_data.tai,
            mjd: action.time_data.mjd,
            sidereal_summit: action.time_data.sidereal_summit,
            sidereal_greenwich: action.time_data.sidereal_greenwich,
            tai_to_utc: action.time_data.tai_to_utc,
          },
        });
      }
    default:
      return state;
  }
}
