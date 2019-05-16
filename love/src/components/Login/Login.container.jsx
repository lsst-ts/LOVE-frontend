import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { getToken, getTokenStatus } from '../../redux/selectors';
import { fetchToken } from '../../redux/actions/auth';
import { tokenStates } from '../../redux/reducers/auth';

const LoginContainer = ({ token, fetchToken, loginFailed }) => {
  return <Login token={token} fetchToken={fetchToken} loginFailed={loginFailed} />;
};

const mapStateToProps = (state) => {
  const tokenStatus = getTokenStatus(state);
  const token = getToken(state);
  return {
    loginFailed:
      tokenStatus !== tokenStates.EMPTY &&
      (!token || tokenStatus === tokenStates.REJECTED || tokenStatus === tokenStates.ERROR),
    showSessionExpired: false,
    hideSessionExpired: () => console.log('hide session expired'),
    setTokenState: (token) => console.log('Set token state'),
    token: getToken(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchToken: (username, password) => dispatch(fetchToken(username, password)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginContainer);
