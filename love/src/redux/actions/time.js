import { RECEIVE_TIME_DATA } from './actionTypes';
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);


export function receiveServerTime(time_data, request_time) {
  return (dispatch) => {
    const receive_time = dayjs().utc().valueOf() / 1000;
    dispatch({ type: RECEIVE_TIME_DATA, time_data, request_time, receive_time});
  };
}