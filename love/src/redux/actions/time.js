import { DateTime } from 'luxon';
import { RECEIVE_TIME_DATA } from './actionTypes';


export function receiveServerTime(time_data, request_time) {
  return (dispatch) => {
    const receive_time = DateTime.utc().toMillis() / 1000;
    dispatch({ type: RECEIVE_TIME_DATA, time_data, request_time, receive_time});
  };
}