import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { fetchToken } from './actions';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

store.dispatch(fetchToken('test','test')).then(() => console.log(store.getState()));
export default store;
