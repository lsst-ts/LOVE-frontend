import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { getToken } from '../../redux/selectors';
import {fetchToken} from '../../redux/actions/auth';

const LoginContainer = ({ token, fetchToken }) => {
  return <Login token={token} fetchToken={fetchToken} />;
};

const mapStateToProps = (state) => {
  return {
    showSessionExpired: false,
    hideSessionExpired: () => console.log('hide session expired'),
    setTokenState: (token) => console.log('Set token state'),
    token: getToken(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchToken: (username, password) => dispatch(fetchToken(username, password))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginContainer);
