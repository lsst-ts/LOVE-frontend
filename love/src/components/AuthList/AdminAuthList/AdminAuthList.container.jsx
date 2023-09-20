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
    pollingTimeout: {
      type: 'number',
      description: 'Timeout to poll authorization requests',
      isPrivate: false,
      default: 5,
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
