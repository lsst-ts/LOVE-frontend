import React from 'react';
import App from './App';
import { connect } from 'react-redux';
import { validateToken } from './redux/actions/auth';
import { requestWorkspaces, requestViews } from './redux/actions/uif';
import { getToken } from './redux/selectors';

const AppContainer = ({ requestWorkspaces, requestViews, validateToken, token }) => {
  return <App
    requestWorkspaces={requestWorkspaces}
    requestViews={requestViews}
    validateToken={validateToken}
    token={token}
  />;
};

const mapDispatchToProps = (dispatch) => ({
    validateToken: () => dispatch(validateToken()),
    requestWorkspaces: () => dispatch(requestWorkspaces()),
    requestViews: () => dispatch(requestViews()),
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
