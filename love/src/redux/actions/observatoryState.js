import ManagerInterface from 'Utils';
import { RECEIVE_CONTROL_LOCATION } from './actionTypes';

const POOLING_TIME = 3000;

const getControlLocation = (dispatch) => {
  ManagerInterface.getControlLocation().then((results) => {
    dispatch({
      type: RECEIVE_CONTROL_LOCATION,
      data: results[0],
    });
  });
};

let poolingInterval = null;
export const fetchControlLocationLoopStart = () => {
  return (dispatch) => {
    clearInterval(poolingInterval);
    getControlLocation(dispatch);
    poolingInterval = setInterval(() => {
      getControlLocation(dispatch);
    }, POOLING_TIME);
  };
};

export const fetchControlLocationLoopStop = () => {
  return (dispatch) => {
    clearInterval(poolingInterval);
  };
};
