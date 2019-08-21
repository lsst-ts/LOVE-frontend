import React from 'react';
import App from './App';
import { connect } from 'react-redux';
import { validateToken } from './redux/actions/auth';
import {getToken} from './redux/selectors';

const AppContainer = ({ validateToken, token }) => {
  return <App
    validateToken={validateToken}
    token={token}
  />;
};

const mapDispatchToProps = (dispatch) => ({
    validateToken: () => dispatch(validateToken()),
});

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppContainer);
