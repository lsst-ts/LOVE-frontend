/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import ObservatorySummary from './ObservatorySummary';
import { getControlLocation, getObservatoryState, getObservatorySubscriptions } from '../../redux/selectors';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: `Component containing summary information for the Observatory, 
  Simonyi Telescope, and Auxiliary Telescope`,
  defaultSize: [21, 25],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Observatory Summary',
    },
  },
};

const ObservatorySummaryContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <ObservatorySummary {...props} />;
};

const mapStateToProps = (state) => {
  const observatorySummary = getObservatoryState(state);
  const controlLocation = getControlLocation(state);
  return { ...observatorySummary, ...controlLocation };
};

const mapDispatchToProps = (dispatch) => {
  const observatorySubscriptions = getObservatorySubscriptions();
  return {
    subscriptions: observatorySubscriptions,
    subscribeToStream: () => {
      observatorySubscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      observatorySubscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObservatorySummaryContainer);
