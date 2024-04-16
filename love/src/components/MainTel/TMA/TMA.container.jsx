/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import TMA from './TMA';
import {
  getTMASummary,
  getAzimuthState,
  getElevationState,
  getDrivesAzimuthElevationState,
  getMirrorCoversMotionState,
} from 'redux/selectors';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { EUIs } from 'Config';

export const schema = {
  description: 'View of Simonyi Telescope Mount Assembly',
  defaultSize: [90, 53],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi Telescope Mount Assembly',
    },
    EUI: {
      type: 'boolean',
      description: 'Whether the component has a EUI link',
      isPrivate: false,
      default: EUIs.TMA,
    },
  },
};

const TMAContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <TMA subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const tmaSummary = getTMASummary(state);
  const azimuth = getAzimuthState(state);
  const elevation = getElevationState(state);
  const drives = getDrivesAzimuthElevationState(state);
  const mirror = getMirrorCoversMotionState(state);
  return {
    ...tmaSummary,
    ...azimuth,
    ...elevation,
    ...drives,
    ...mirror,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTMount-0-azimuth',
    'telemetry-MTMount-0-azimuthDrives',
    'telemetry-MTMount-0-elevation',
    'telemetry-MTMount-0-elevationDrives',
    'telemetry-MTMount-0-mirrorCover',
    'event-MTMount-0-azimuthLimits',
    'event-MTMount-0-azimuthMotionState',
    'event-MTMount-0-azimuthSystemState',
    'event-MTMount-0-balanceSystemState',
    'event-MTMount-0-commander',
    'event-MTMount-0-connected',
    'event-MTMount-0-elevationLimits',
    'event-MTMount-0-elevationMotionState',
    'event-MTMount-0-elevationSystemState',
    'event-MTMount-0-mirrorCoversMotionState',
    'event-MTMount-0-target',
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

TMAContainer.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(TMAContainer);
