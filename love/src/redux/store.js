import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import {receiveToken } from './actions/auth';
import logger from 'redux-logger'

const middleWares = [thunkMiddleware];
const store = createStore(rootReducer, applyMiddleware(...middleWares));

const storageToken = localStorage.getItem('LOVE-TOKEN');
if (storageToken && storageToken.length > 0) {
    store.dispatch(receiveToken(storageToken))
}

export default store;
