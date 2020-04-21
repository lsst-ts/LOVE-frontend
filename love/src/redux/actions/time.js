import { DateTime } from 'luxon';
import {
  RECEIVE_TIME_DATA,
  CLOCK_START,
  CLOCK_STOP,
  CLOCK_TICK,
} from './actionTypes';
import { getAllTime } from '../selectors';
import { siderealSecond } from '../../Utils';
import { clockStatuses } from '../reducers/time';



export function receiveServerTime(time_data, request_time) {
  return (dispatch) => {
    const receive_time = DateTime.utc().toMillis() / 1000;
    dispatch({ type: RECEIVE_TIME_DATA, time_data, request_time, receive_time});
    dispatch({ type: CLOCK_START, time_data, request_time, receive_time});
  };
}

export function tick() {
  return (dispatch, getState) => {
    const time = getAllTime(getState());
    const diffLocalUtc = DateTime.utc().toSeconds() - (time.receive_time + time.request_time) / 2;
    dispatch({
      type: CLOCK_TICK,
      clock: {
        utc: DateTime.fromSeconds(time.server_time.utc + diffLocalUtc),
        tai: DateTime.fromSeconds(time.server_time.tai + diffLocalUtc),
        mjd: time.server_time.mjd + diffLocalUtc / (3600 * 24),
        sidereal_summit: DateTime.fromSeconds(
          time.server_time.sidereal_summit * 3600 + siderealSecond * diffLocalUtc
        ),
        sidereal_greenwich: DateTime.fromSeconds(
          time.server_time.sidereal_greenwich * 3600 + siderealSecond * diffLocalUtc
        ),
      }
    });
  }
};

let timerID = null;
export function clockStart() {
  return (dispatch) => {
    clearInterval(timerID);
    timerID = setInterval(() => dispatch(tick()), 1000);
    dispatch({ type: CLOCK_START });
    dispatch(tick());
  }
}

export function clockStop() {
  return (dispatch) => {
    clearInterval(timerID);
    dispatch({ type: CLOCK_STOP });
  }
}