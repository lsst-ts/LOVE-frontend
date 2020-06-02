import React from 'react';
import UserSwap from './UserSwap';
import { connect } from 'react-redux';
import { getToken } from '../../redux/selectors';
import { swapUser } from '../../redux/actions/auth';

const UserSwapContainer = ({ token, tokenStatus, swapUser }) => {
  return (
    <UserSwap
      token={token}
      tokenStatus={tokenStatus}
      swapUser={swapUser}
    />
  );
};

const mapStateToProps = (state) => {
  const token = getToken(state);
  return {
    token: token,
  };
};

const mapDispatchToProps = (dispatch) => ({
  swapUser: (username, password) => dispatch(swapUser(username, password)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSwapContainer);
