/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
