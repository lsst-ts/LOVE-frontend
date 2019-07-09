import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { getToken, getTokenStatus } from '../../redux/selectors';
import { fetchToken } from '../../redux/actions/auth';
import { tokenStates } from '../../redux/reducers/auth';

const LoginContainer = ({ token, fetchToken, loginFailed, showSessionExpired, tokenStates }) => {
  return (
    <Login
      token={token}
      fetchToken={fetchToken}
      loginFailed={loginFailed}
      showSessionExpired={showSessionExpired}
      tokenStates={tokenStates}
    />
  );
};

const mapStateToProps = (state) => {
  const tokenStatus = getTokenStatus(state);
  const token = getToken(state);

  const notEmpty = tokenStatus !== tokenStates.EMPTY;
  const nullButNotRequested = !token && tokenStatus !== tokenStates.REQUESTED;

  console.log(tokenStatus);

  return {
    loginFailed:
      notEmpty &&
      (nullButNotRequested ||
        tokenStatus === tokenStates.REJECTED ||
        tokenStatus === tokenStates.ERROR ||
        tokenStatus === tokenStates.EXPIRED),
    showSessionExpired: tokenStatus === tokenStates.EXPIRED,
    token: getToken(state),
    tokenStates: tokenStates,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchToken: (username, password) => dispatch(fetchToken(username, password)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginContainer);
