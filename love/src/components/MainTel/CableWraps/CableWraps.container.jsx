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
import {
  getCCWState,
  getRotatorState,
  getCCWFollowingError,
  getCCWPosition,
  getRotatorPosition,
} from 'redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import CableWraps from './CableWraps';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { EUIs } from 'Config';

export const schema = {
  description: 'View of both Simonyi azimuth and Camera cable wraps',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CableWraps',
    },
    EUI: {
      type: 'boolean',
      description: 'Whether the component has a EUI link',
      isPrivate: false,
      default: EUIs.ROTATOR,
    },
  },
};

const CableWrapsContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <CableWraps subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const ccwState = getCCWState(state);
  const ccwPosition = getCCWPosition(state);
  const rotatorState = getRotatorState(state);
  const rotatorPosition = getRotatorPosition(state);
  const followError = getCCWFollowingError(state);
  return {
    ...ccwState,
    ...ccwPosition,
    ...rotatorState,
    ...rotatorPosition,
    ...followError,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTMount-0-cameraCableWrap',
    'telemetry-MTRotator-0-ccwFollowingError',
    'telemetry-MTRotator-0-rotation',
    'event-MTMount-0-cameraCableWrapFollowing',
    'event-MTMount-0-cameraCableWrapState',
    'event-MTMount-0-summaryState',
  ];
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
export default connect(mapStateToProps, mapDispatchToProps)(CableWrapsContainer);
