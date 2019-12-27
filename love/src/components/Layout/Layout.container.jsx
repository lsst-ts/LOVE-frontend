import React from 'react';
import { connect } from 'react-redux';
import { getUsername, getLastSALCommand } from '../../redux/selectors';
import Layout from './Layout';

const LayoutContainer = ({
  user,
  subscribeToStream,
  unsubscribeToStream,
  ...props }) => {
  return (
    <Layout
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
    />
  );
};

const mapStateToProps = (state) => {
  const user = getUsername(state);
  const lastSALCommand = getLastSALCommand(state);
  return { user, lastSALCommand };
};

const mapDispatchToProps = (_dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayoutContainer);
