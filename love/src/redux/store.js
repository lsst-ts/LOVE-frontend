import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
// import logger from 'redux-logger';
// const middleWares = [thunkMiddleware, logger];
import { batchedSubscribe } from 'redux-batched-subscribe';
import throttle from 'lodash.throttle';

const THROTTLED = true; // Whether or not to throttle redux updates
const THROTTLE_TIME = 200; // Minimum time between redux notifications
const throttleNotify = throttle((notify) => {
  notify();
}, THROTTLE_TIME);

const middleWares = [thunkMiddleware];
const enhancer = THROTTLED
  ? compose(applyMiddleware(...middleWares), batchedSubscribe(throttleNotify))
  : applyMiddleware(...middleWares);

const store = createStore(rootReducer, enhancer);

export default store;
