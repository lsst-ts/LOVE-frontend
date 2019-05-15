import React from 'react';
import { connect } from 'react-redux';
import ComponentIndex from './ComponentIndex';
import { removeToken } from '../../redux/actions/auth';
const ComponentIndexContainer = ({ logout }) => {
  return <ComponentIndex logout={logout} />;
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(removeToken),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentIndexContainer);
