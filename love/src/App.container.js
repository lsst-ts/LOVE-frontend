import React from 'react';
import App from './App';
import { connect } from 'react-redux';
import { validateToken, getAndValidateTokenFromStorage } from './redux/actions/auth';
import {getToken} from './redux/selectors';

const AppContainer = ({ validateToken, getAndValidateTokenFromStorage, token }) => {
  return <App
    validateToken={validateToken}
    getAndValidateTokenFromStorage={getAndValidateTokenFromStorage}
    token={token}
  />;
};

const mapDispatchToProps = (dispatch) => ({
    validateToken: () => dispatch(validateToken()),
    getAndValidateTokenFromStorage: () => dispatch(getAndValidateTokenFromStorage()),
});

const mapStateToProps = (state) => ({
  token: getToken(state),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppContainer);
