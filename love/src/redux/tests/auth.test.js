import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import ManagerInterface from '../../Utils';

import { fetchToken, validateToken } from '../actions/auth';
import fetchMock from 'fetch-mock'

import {getToken} from '../selectors';

let store;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  localStorage.setItem('LOVE-TOKEN', '"love-token"');
});

afterEach(() => {
  localStorage.removeItem('LOVE-TOKEN');
  fetchMock.reset();
});

it('Should not change the token state when the token is valid', async () => {
  await store.dispatch(fetchToken('asdf','asdf'));
  const initialToken = getToken(store.getState());
  
  const url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
  fetchMock.mock(url, {detail: "Token is valid"}, ManagerInterface.getHeaders());
  
  await store.dispatch(validateToken())

  const newToken = getToken(store.getState()); 
  expect(newToken).toEqual(initialToken)

});

it('Should remove the token when response status is >= 500', async () =>{
  await store.dispatch(fetchToken('asdf','asdf'));
  const initialToken = getToken(store.getState());
  expect(initialToken).toEqual('"love-token');
  
  const url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
  fetchMock.mock(url, {status:500}, ManagerInterface.getHeaders());
  
  await store.dispatch(validateToken())

  const newToken = getToken(store.getState()); 
  expect(newToken).toBeNull()

});
