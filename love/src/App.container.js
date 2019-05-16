import React from 'react';
import App from './App';
import { connect } from 'react-redux';
import { validateToken } from './redux/actions/auth';
import {getToken} from './redux/selectors';

const AppContainer = ({ validateToken }) => {
  return <App validateToken={validateToken} />;
};

const mapDispatchToProps = (dispatch) => ({
    validateToken: () => dispatch(validateToken()),
//   validateToken: () => console.log('validate')
});

export default connect(
  null,
  mapDispatchToProps,
)(AppContainer);
