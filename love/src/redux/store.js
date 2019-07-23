import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger'

// const middleWares = [thunkMiddleware];
const middleWares = [thunkMiddleware, logger];
const store = createStore(rootReducer, applyMiddleware(...middleWares));

export default store;
