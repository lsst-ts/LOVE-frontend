/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserAuthList from './UserAuthList';
import { CSCSummaryHierarchy } from '../../../Config';
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
    const requests = authlistRequests.filter((req) => req.username === username && req.hostname === 'love');

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
