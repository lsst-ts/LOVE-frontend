import React from 'react';
import { connect } from 'react-redux';
import { getUsername, getLastSALCommand } from '../../redux/selectors';
import { logout } from '../../redux/actions/auth';
import Layout from './Layout';

const LayoutContainer = ({...props }) => {
  return (
    <Layout
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const user = getUsername(state);
  const lastSALCommand = getLastSALCommand(state);
  return { user, lastSALCommand };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayoutContainer);
