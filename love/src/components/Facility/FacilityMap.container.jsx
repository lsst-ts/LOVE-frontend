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
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getHVACTelemetry, getHVACSubscription } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import FacilityMap from './FacilityMap';

export const schema = {
  description: 'Vera C. Rubin Summit Facility Map',
  defaultSize: [70, 50],
  props: {
    title: {
      type: 'string',
      description: 'Observatory Facility Map',
      isPrivate: false,
      default: 'Facility Map',
    },
  },
};

const FacilityMapContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <FacilityMap subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const HVACTelemetry = getHVACTelemetry(state);
  return HVACTelemetry;
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = getHVACSubscription();
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FacilityMapContainer);
