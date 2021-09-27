import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AdminAuthList from './AdminAuthList';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ManagerInterface from '../../../Utils';

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

const mapStateToProps = () => {
  return {
    isAuthListAdmin: true,
  };
};

export default connect(mapStateToProps)(AdminAuthListContainer);
