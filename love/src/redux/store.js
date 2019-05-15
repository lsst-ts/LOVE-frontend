import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { fetchToken } from './actions/auth';
import {openWebsocketConnection} from './actions/ws';
import logger from 'redux-logger'

const middleWares = [thunkMiddleware, logger];
const store = createStore(rootReducer, applyMiddleware(...middleWares));
store.dispatch(fetchToken('test','test')).then(() => console.log('token',store.getState()));
store.dispatch(openWebsocketConnection());
export default store;
