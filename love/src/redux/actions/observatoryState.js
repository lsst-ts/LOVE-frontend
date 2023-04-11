import ManagerInterface from 'Utils';
import { RECEIVE_CONTROL_LOCATION } from './actionTypes';

const POOLING_TIME = 3000;

let poolingInterval = null;
export const fetchControlLocationLoopStart = () => {
  return (dispatch) => {
    clearInterval(poolingInterval);
    poolingInterval = setInterval(() => {
      ManagerInterface.getControlLocation().then((results) => {
        dispatch({
          type: RECEIVE_CONTROL_LOCATION,
          data: results[0],
        });
      });
    }, POOLING_TIME);
  };
};

export const fetchControlLocationLoopStop = () => {
  return (dispatch) => {
    clearInterval(poolingInterval);
  };
};
