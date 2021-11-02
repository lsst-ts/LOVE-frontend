import React from 'react';
import { connect } from 'react-redux';
import { getPermAuthlistAdministrator, getUsername } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import AdminAuthList from './AdminAuthList';

export const schema = {
  description: 'Authorization List for administration',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Admin Authorization List',
    },
  },
};

const AdminAuthListContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={subscriptions} />;
  }
  return <AdminAuthList {...props} />;
};

const mapStateToProps = (state) => {
  const authlistAdminPermission = getPermAuthlistAdministrator(state);
  const user = getUsername(state);
  return { authlistAdminPermission, user };
};

export default connect(mapStateToProps)(AdminAuthListContainer);
