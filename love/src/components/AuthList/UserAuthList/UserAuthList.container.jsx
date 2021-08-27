import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserAuthList from './UserAuthList';
import { CSCSummaryHierarchy, FRONTEND_HOST } from '../../../Config';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ManagerInterface from '../../../Utils';

export const schema = {
  description: 'CSC User Authorization List',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Authorization List',
    },
    hierarchy: {
      type: 'object',
      description: 'Hierarchy on which to display each CSC authorization list',
      isPrivate: false,
      default: CSCSummaryHierarchy,
    },
  },
};

class UserAuthListContainer extends Component {
  static propTypes = {
    username: PropTypes.string,
    hierarchy: PropTypes.object,
    isRaw: PropTypes.bool,
  };

  static defaultProps = {
    hierarchy: CSCSummaryHierarchy,
  };

  state = {
    authlist: {},
    authlistRequests: [],
    subscriptions: [],
  };

  reloadData = () => {
    ManagerInterface.getAuthList().then((res) => {
      this.setState({
        authlist: res,
      });
    });

    ManagerInterface.getAuthListRequests().then((res) => {
      this.setState({
        authlistRequests: res,
      });
    });
  };

  componentDidMount() {
    this.reloadData();
  }

  render() {
    const { authlist, subscriptions, authlistRequests } = this.state;
    if (this.props.isRaw) {
      return <SubscriptionTableContainer subscriptions={subscriptions} />;
    }
    const { username, hierarchy } = this.props;
    const requests = authlistRequests.filter((req) => req.username === username && req.hostname === FRONTEND_HOST);

    return (
      <UserAuthList
        authlist={authlist}
        authlistRequests={requests}
        username={username}
        hierarchy={hierarchy}
        reloadData={this.reloadData}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth?.username,
  };
};

export default connect(mapStateToProps)(UserAuthListContainer);
