import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import {receiveToken } from './actions/auth';
import {openWebsocketConnection} from './actions/ws';
import logger from 'redux-logger'

const middleWares = [thunkMiddleware, logger];
const store = createStore(rootReducer, applyMiddleware(...middleWares));

const storageToken = localStorage.getItem('LOVE-TOKEN');
if (storageToken && storageToken.length > 0) {
    store.dispatch(receiveToken(storageToken))
}
// store.dispatch(fetchToken('test','test')).then(() => console.log('token',store.getState()));
// store.dispatch(openWebsocketConnection());
export default store;
