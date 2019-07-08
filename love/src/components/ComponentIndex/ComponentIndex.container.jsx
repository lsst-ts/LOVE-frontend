import React from 'react';
import { connect } from 'react-redux';
import ComponentIndex from './ComponentIndex';
import { logout } from '../../redux/actions/auth';
const ComponentIndexContainer = ({ logout }) => {
  return <ComponentIndex logout={logout} />;
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentIndexContainer);
