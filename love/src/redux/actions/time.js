import {
  RECEIVE_TIME_DATA,
} from './actionTypes';

export const receiveServerTime = (time_data) => ({type: RECEIVE_TIME_DATA, time_data});