import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { getToken, getTokenStatus } from '../../redux/selectors';
import { fetchToken } from '../../redux/actions/auth';
import { tokenStates } from '../../redux/reducers/auth';

const LoginContainer = ({ token, tokenStatus, fetchToken }) => {
  return (
    <Login
      token={token}
      tokenStatus={tokenStatus}
      fetchToken={fetchToken}
    />
  );
};

const mapStateToProps = (state) => {
  const tokenStatus = getTokenStatus(state);
  const token = getToken(state);

  console.log(tokenStatus);

  return {
    token: getToken(state),
    tokenStatus: tokenStatus,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchToken: (username, password) => dispatch(fetchToken(username, password)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginContainer);
