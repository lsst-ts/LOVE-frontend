import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AdminAuthList from './AdminAuthList';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ManagerInterface from '../../../Utils';

export const schema = {
  description: 'CSC User Authorization List Administration',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Authorization List',
    },
  },
};

class AdminAuthListContainer extends Component {
  static propTypes = {
    isAuthListAdmin: PropTypes.bool,
    isRaw: PropTypes.bool,
  };

  state = {
    authListRequests: [],
    subscriptions: [],
  };

  onChange = () => {
    ManagerInterface.getAuthListRequests().then((res) => {
      this.setState({
        authListRequests: res,
      });
    });
  };

  componentDidMount() {
    this.onChange();
  }

  render() {
    const { subscriptions, authListRequests } = this.state;
    if (this.props.isRaw) {
      return <SubscriptionTableContainer subscriptions={subscriptions} />;
    }
    return <AdminAuthList authListRequests={authListRequests} onChange={this.onChange} />;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthListAdmin: true,
  };
};

export default connect(mapStateToProps)(AdminAuthListContainer);
