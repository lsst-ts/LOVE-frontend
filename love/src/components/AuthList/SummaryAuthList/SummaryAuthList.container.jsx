/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup, requestSALCommand } from 'redux/actions/ws';
import { getAuthlistState, getPermAuthlistAdministrator, getUsername } from 'redux/selectors';
import { defaultCSCList } from 'Config';
import SummaryAuthList from './SummaryAuthList';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Auth list summary table',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Authorization List Summary',
    },
    cscList: {
      type: 'array',
      description:
        'List of CSCs to listen their authorization lists, ' +
        'each element of the array must be an object with the format: {name: <string>, salindex: <number>}',
      isPrivate: false,
      default: defaultCSCList,
    },
  },
};

const SummaryAuthListContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions} />;
  }
  return <SummaryAuthList {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  const subscriptions = ownProps.cscList.map((csc) => {
    const { name, salindex } = csc;
    return `event-${name}-${salindex}-authList`;
  });
  const authlistAdminPermission = getPermAuthlistAdministrator(state);
  const authlistState = getAuthlistState(state, subscriptions);
  const user = getUsername(state);
  return { authlistState, authlistAdminPermission, user };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = ownProps.cscList.map((csc) => {
    const { name, salindex } = csc;
    return `event-${name}-${salindex}-authList`;
  });
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
    requestAuthorizeCommand: (cmd) => {
      dispatch(requestSALCommand({ csc: 'Authorize', salindex: 0, ...cmd }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryAuthListContainer);
