/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import {
  REQUEST_TOKEN,
  RECEIVE_TOKEN,
  REJECT_TOKEN,
  EXPIRE_TOKEN,
  EMPTY_TOKEN,
  MARK_ERROR_TOKEN,
  REQUEST_REMOVE_TOKEN,
  REMOVE_REMOTE_TOKEN,
  MARK_ERROR_REMOVE_TOKEN,
  GET_TOKEN_FROM_LOCALSTORAGE,
  REQUEST_SWAP_TOKEN,
  CANCEL_SWAP_TOKEN,
  RECEIVE_SWAP_TOKEN,
  REJECT_SWAP_TOKEN,
  MARK_ERROR_SWAP_TOKEN,
  REQUIRE_SWAP_TOKEN,
  RECEIVE_CONFIG,
} from '../actions/actionTypes';

export const tokenStates = {
  EMPTY: 'EMPTY',
  READ_FROM_STORAGE: 'READ_FROM_STORAGE',
  REQUESTED: 'REQUESTED',
  RECEIVED: 'RECEIVED',
  ERROR: 'ERROR',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  REMOVED_REMOTELY: 'REMOVED_REMOTELY',
  REMOVE_REQUESTED: 'REMOVE_REQUESTED',
  REMOVE_ERROR: 'REMOVE_ERROR',
};

export const tokenSwapStates = {
  REQUIRED: 'SWAP_REQUIRED',
  REQUESTED: 'SWAP_REQUESTED',
  RECEIVED: 'SWAP_RECEIVED',
  ERROR: 'SWAP_ERROR',
  REJECTED: 'SWAP_REJECTED',
};

const initialState = {
  username: '',
  token: null,
  status: tokenStates.EMPTY,
  permissions: {
    cmd_exec: false,
  },
  swapStatus: tokenSwapStates.RECEIVED,
  config: null,
};
/**
 * Modifies the state of the authentication mainly characterized by the
 * token received from the LOVE-manager and its status.
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case REQUEST_TOKEN: {
      return { ...state, status: tokenStates.REQUESTED };
    }
    case GET_TOKEN_FROM_LOCALSTORAGE: {
      return { ...state, status: tokenStates.READ_FROM_STORAGE, token: action.token };
    }
    case RECEIVE_TOKEN: {
      if (action.permissions === null || action.permissions === undefined) {
        return {
          ...state,
          username: action.username,
          first_name: action.first_name,
          last_name: action.last_name,
          token: action.token,
          status: tokenStates.RECEIVED,
          permissions: initialState.permissions,
        };
      }
      return {
        ...state,
        username: action.username,
        token: action.token,
        status: tokenStates.RECEIVED,
        permissions: {
          cmd_exec: action.permissions.execute_commands,
        },
      };
    }
    case REJECT_TOKEN:
      return {
        ...initialState,
        token: null,
        status: tokenStates.REJECTED,
      };
    case EXPIRE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.EXPIRED,
      };
    case EMPTY_TOKEN:
      return {
        ...initialState,
      };
    case MARK_ERROR_TOKEN:
      return {
        ...initialState,
        status: tokenStates.ERROR,
      };

    case REQUEST_REMOVE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.REMOVE_REQUESTED,
      };
    case REMOVE_REMOTE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.REMOVED_REMOTELY,
      };
    case MARK_ERROR_REMOVE_TOKEN:
      return {
        ...initialState,
        status: tokenStates.REMOVE_ERROR,
      };
    case REQUEST_SWAP_TOKEN:
      return {
        ...state,
        swapStatus: tokenSwapStates.REQUESTED,
      };
    case RECEIVE_SWAP_TOKEN:
      return {
        ...state,
        swapStatus: tokenSwapStates.RECEIVED,
      };
    case REJECT_SWAP_TOKEN:
      return {
        ...state,
        swapStatus: tokenSwapStates.REJECTED,
      };
    case MARK_ERROR_SWAP_TOKEN:
      return {
        ...state,
        swapStatus: tokenSwapStates.ERROR,
      };
    case REQUIRE_SWAP_TOKEN:
      return {
        ...state,
        swapStatus: tokenSwapStates.REQUIRED,
      };
    case CANCEL_SWAP_TOKEN:
      return {
        ...state,
        swapStatus: tokenSwapStates.RECEIVED,
      };
    case RECEIVE_CONFIG:
      return {
        ...state,
        config: { ...action.config },
      };
    default:
      return state;
  }
}
