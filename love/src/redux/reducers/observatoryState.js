import { RECEIVE_CONTROL_LOCATION } from '../actions/actionTypes';

export const initialState = {
  controlLocation: null,
  lastUpdated: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CONTROL_LOCATION: {
      return {
        ...state,
        controlLocation: action.data,
        lastUpdated: new Date(),
      };
    }

    default:
      return state;
  }
}
