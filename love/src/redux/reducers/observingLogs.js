import { RECEIVE_OBSERVING_LOG } from '../actions/actionTypes';

const initialState = {
  logMessages: [],
};
export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_OBSERVING_LOG: {
        return {
            logMessages: [...state.logMessages, ...action.data]
        };
    }
    default: {
        return state;
    }
  }
}
