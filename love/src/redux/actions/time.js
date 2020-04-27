import { DateTime } from 'luxon';
import {
  RECEIVE_TIME_DATA,
  CLOCK_START,
  CLOCK_STOP,
  CLOCK_TICK,
} from './actionTypes';
import { sendAction } from './ws';
import { getAllTime } from '../selectors';
import { siderealSecond } from '../../Utils';

/**
 * Receive server time data
 */
export function receiveServerTime(time_data, request_time) {
  return (dispatch) => {
    const receive_time = DateTime.utc().toMillis() / 1000;
    dispatch({ type: RECEIVE_TIME_DATA, time_data, request_time, receive_time});
    dispatch({ type: CLOCK_START, time_data, request_time, receive_time});
  };
}

/**
 * Update the internal clock
 */
export function tick() {
  return (dispatch, getState) => {
    const time = getAllTime(getState());
    const diffLocalUtc = DateTime.utc().toSeconds() - (time.receive_time + time.request_time) / 2;
    dispatch({
      type: CLOCK_TICK,
      clock: {
        utc: DateTime.fromSeconds(time.server_time.utc + diffLocalUtc, { zone: 'utc' }),
        tai: DateTime.fromSeconds(time.server_time.tai + diffLocalUtc, { zone: 'utc' }),
        mjd: time.server_time.mjd + diffLocalUtc / (3600 * 24),
        sidereal_summit: DateTime.fromSeconds(
          time.server_time.sidereal_summit * 3600 + siderealSecond * diffLocalUtc,
          { zone: 'utc' }
        ),
        sidereal_greenwich: DateTime.fromSeconds(
          time.server_time.sidereal_greenwich * 3600 + siderealSecond * diffLocalUtc,
          { zone: 'utc' }
        ),
      }
    });
  }
};

/**
 * Send a websockets message to the server requesting a time update
 */
export function requestServerTime() {
  return (dispatch) => {
    dispatch(sendAction('get_time_data'));
  }
}

let tickTimer = null;
let syncTimer = null;

/**
 * Start an internal clock, setting it to update every second and requesting a server sync every 10 seconds
 */
export function clockStart() {
  return (dispatch) => {
    clearInterval(tickTimer);
    clearInterval(syncTimer);
    tickTimer = setInterval(() => dispatch(tick()), 1000);
    syncTimer = setInterval(() => dispatch(requestServerTime()), 10000);
    dispatch({ type: CLOCK_START });
    dispatch(tick());
  }
}

/**
 * Stop the internal clock
 */
export function clockStop() {
  return (dispatch) => {
    clearInterval(tickTimer);
    clearInterval(syncTimer);
    dispatch({ type: CLOCK_STOP });
  }
}